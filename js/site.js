const form = document.querySelector("#calculator");
const content = document.querySelector("#question");
const status = document.querySelector("#step-count");
const actions = document.querySelector("#calculator-actions");
const back = document.querySelector("#back");
const next = actions.querySelector("[type=submit]");
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const phone = "5511965970387";
const fields = {
  existing: {
    label: "Sua empresa já tem um site que será substituído?",
    help: "Na reformulação, avaliamos o endereço atual, as páginas, o conteúdo e as integrações antes de definir a proposta."
  },
  domain: {
    label: "Sua empresa já tem um domínio registrado?",
    help: "Domínio é o endereço do site, como suaempresa.com.br. O registro é renovado periodicamente. Na publicação, configuramos o domínio para apontar para a hospedagem."
  },
  identity: {
    label: "Você já tem logotipo e fontes definidos?",
    help: "O logotipo identifica a empresa. As fontes organizam a leitura e mantêm a consistência com a marca. Para o site, usamos arquivos adequados e fontes licenciadas para a web."
  },
  design: {
    label: "Quer incluir identidade visual no orçamento?",
    help: "O serviço acrescenta R$ 750 à estimativa. As entregas da identidade são combinadas na proposta."
  },
  images: {
    label: "Você já tem as imagens e os materiais visuais do site?",
    help: "Podem ser fotos, ilustrações, ícones e outras peças. Ajustamos dimensões e formatos para a web e usamos materiais autorizados para publicação."
  },
  stock: {
    label: "Podemos usar imagens de banco com licença comercial?",
    help: "Selecionamos imagens de acordo com a licença de uso. Se você preferir fotos próprias, envie os arquivos. A Mamangava trabalha com imagens fornecidas pelo cliente ou de banco."
  },
  copy: {
    label: "Os textos do site já estão prontos?",
    help: "Os textos apresentam a empresa, explicam os serviços e orientam o contato. Se você precisar de redação, o simulador acrescenta R$ 300. Você fornece as informações do negócio e aprova o conteúdo."
  },
  store: {
    label: "O projeto será uma loja virtual?",
    help: "A loja precisa de um escopo próprio. Plataforma, produtos, estoque, pagamento, frete e integrações influenciam a proposta."
  },
  hosting: {
    label: "Sua empresa já tem hospedagem para o site?",
    help: "Hospedagem é a infraestrutura que mantém o site disponível. Podemos avaliar a sua ou incluir o plano da Mamangava por R$ 89,90 por mês, com manutenção e alterações."
  }
};
const answers = new Map();
const history = [];
let step = "existing";

function getNext(key) {
  switch (key) {
    case "existing": return answers.get(key) === "sim" ? "url" : "domain";
    case "url": return "result";
    case "domain": return "identity";
    case "identity": return answers.get(key) === "nao" ? "design" : "images";
    case "design": return "images";
    case "images": return answers.get(key) === "nao" ? "stock" : "copy";
    case "stock": return "copy";
    case "copy": return "store";
    case "store": return "hosting";
    default: return "result";
  }
}

function element(tag, value, className) {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  if (className) node.className = className;
  return node;
}

function render(focus = false) {
  content.replaceChildren();
  status.textContent = step === "result" ? "Resumo do projeto" : "Sobre o projeto";
  back.hidden = history.length === 0;
  next.hidden = step === "result";
  next.firstChild.textContent = getNext(step) === "result" ? "Ver resumo " : "Continuar ";
  if (step === "result") {
    renderResult();
  } else if (step === "url") {
    const label = element("label", "Qual é o endereço do site atual?", "field-title");
    label.htmlFor = "current-url";
    const input = element("input", "", "url-field");
    input.id = "current-url";
    input.name = "answer";
    input.inputMode = "url";
    input.placeholder = "suaempresa.com.br";
    input.value = answers.get(step) ?? "";
    input.required = true;
    input.maxLength = 250;
    input.addEventListener("input", () => input.setCustomValidity(""));
    content.append(label, input, element("p", "O analista avalia o que precisa ser preservado e o que muda antes de montar a proposta.", "result-note"));
  } else {
    const field = fields[step];
    const group = element("fieldset");
    group.append(element("legend", field.label));
    for (const [value, caption] of [["sim", "Sim"], ["nao", "Não"]]) {
      const label = element("label");
      const input = element("input");
      input.type = "radio";
      input.name = "answer";
      input.value = value;
      input.required = true;
      input.checked = answers.get(step) === value;
      label.append(input, caption);
      group.append(label);
    }
    const help = element("details");
    help.append(element("summary", "Saiba mais"), element("p", field.help));
    content.append(group, help);
    if (step === "copy" && answers.get("stock") === "nao") {
      content.append(element("p", "As imagens do projeto deverão ser fornecidas pela sua empresa.", "result-note"));
    }
  }
  if (focus) {
    const heading = content.querySelector("legend, .field-title, .result-title");
    heading.tabIndex = -1;
    heading.focus();
  }
}

function renderResult() {
  const isExisting = answers.get("existing") === "sim";
  const isStore = answers.get("store") === "sim";
  const items = [["Desenvolvimento", 1800]];
  if (answers.get("domain") === "nao") items.push(["Registro de domínio", 45]);
  if (answers.get("design") === "sim") items.push(["Identidade visual", 750]);
  if (answers.get("copy") === "nao") items.push(["Textos", 300]);
  const subtotal = items.reduce((sum, item) => sum + item[1], 0);
  const hasPlan = answers.get("hosting") === "nao";
  const needsImages = answers.get("stock") === "nao";
  const needsIdentity = answers.get("design") === "nao";
  const title = isExisting ? "Reformulação do site" : isStore ? "Projeto de loja virtual" : "Estimativa para seu site";
  content.append(element("h3", title, "result-title"));
  const messages = ["Olá, Mamangava! Quero conversar sobre meu projeto.", "", title];
  if (isExisting) {
    content.append(element("p", "O analista vai avaliar o site atual, o conteúdo e as integrações antes de preparar a proposta."));
    content.append(element("p", `Site atual: ${answers.get("url")}`, "result-note result-summary"));
    messages.push(`Site que será substituído: ${answers.get("url")}`);
  } else {
    if (isStore) {
      content.append(element("p", "Vamos definir plataforma, catálogo e operação com o analista para montar a proposta."));
      messages.push("Loja virtual. Preciso definir escopo e plataforma.");
    } else {
      const lines = element("dl", "", "result-lines");
      for (const [label, price] of items) {
        const row = element("div");
        row.append(element("dt", label), element("dd", money.format(price)));
        lines.append(row);
      }
      content.append(lines, element("p", money.format(subtotal), "result-price"));
      const installments = `2x de ${money.format(subtotal / 2)}`;
      content.append(element("p", installments, "result-note"));
      messages.push(`Investimento inicial estimado: ${money.format(subtotal)} (${installments})`);
    }
    if (hasPlan) {
      const planText = isStore ? "Hospedagem a definir no escopo da loja." : "Hospedagem e manutenção: R$ 89,90 por mês.";
      content.append(element("p", planText, "result-note"));
      messages.push(planText);
    }
    if (needsImages) {
      content.append(element("p", "Sua empresa fornecerá as imagens.", "result-note"));
      messages.push("Imagens: serão fornecidas pela empresa.");
    }
    if (needsIdentity) {
      content.append(element("p", "Sua empresa fornecerá o logotipo e as fontes.", "result-note"));
      messages.push("Identidade visual: será fornecida pela empresa.");
    }
    if (!isStore) {
      content.append(element("p", "O valor final depende da confirmação do escopo, das páginas e das funcionalidades.", "result-note"));
    }
    const summary = element("details");
    summary.append(element("summary", "Revisar minhas respostas"));
    const list = element("ul");
    for (const key of history) {
      if (!fields[key]) continue;
      const response = `${fields[key].label} ${answers.get(key) === "sim" ? "Sim" : "Não"}`;
      list.append(element("li", response));
      messages.push(response);
    }
    summary.append(list);
    content.append(summary);
  }
  const link = element("a", isExisting || isStore ? "Falar com o analista ↗" : "Enviar meu projeto pelo WhatsApp ↗", "button");
  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(messages.join("\n"))}`;
  content.append(link);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (step === "result") return;
  const value = new FormData(form).get("answer");
  if (!value) return;
  if (step === "url") {
    const input = form.elements.answer;
    try {
      const raw = value.trim();
      const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      if (!url.hostname.includes(".") || url.username || url.password || /\s/.test(raw)) throw new Error();
      answers.set(step, url.href);
    } catch {
      input.setCustomValidity("Informe um endereço como suaempresa.com.br.");
      input.reportValidity();
      return;
    }
  } else {
    answers.set(step, value);
  }
  history.push(step);
  step = getNext(step);
  render(true);
});

back.addEventListener("click", () => {
  const previous = history.pop();
  if (!previous) return;
  answers.delete(step);
  step = previous;
  render(true);
});

actions.hidden = false;
render();

const album = document.querySelector(".album");
const projects = [...album.querySelectorAll(".project")];
const controls = album.querySelector(".album-controls");
const rotation = album.querySelector("[data-rotation]");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let activeProject = 0;
let rotationEnabled = !reducedMotion.matches;
let albumVisible = !("IntersectionObserver" in window);
let rotationTimer;

function showProject(index) {
  activeProject = (index + projects.length) % projects.length;
  const behind = (activeProject + 1) % projects.length;
  for (const [position, project] of projects.entries()) {
    const current = position === activeProject;
    project.dataset.position = current ? "current" : position === behind ? "behind" : "hidden";
    project.inert = !current;
  }
}

function updateRotation() {
  clearInterval(rotationTimer);
  rotation.textContent = rotationEnabled ? "Pausar rotação" : "Girar álbum";
  if (rotationEnabled && albumVisible && !document.hidden && !album.matches(":hover, :focus-within")) {
    rotationTimer = setInterval(() => showProject(activeProject + 1), 6500);
  }
}

function browseProject(direction) {
  rotationEnabled = false;
  showProject(activeProject + direction);
  updateRotation();
}

album.querySelector("[data-previous]").addEventListener("click", () => browseProject(-1));
album.querySelector("[data-next]").addEventListener("click", () => browseProject(1));
rotation.addEventListener("click", () => {
  rotationEnabled = !rotationEnabled;
  updateRotation();
});
for (const event of ["pointerenter", "pointerleave", "focusin", "focusout"]) {
  album.addEventListener(event, () => requestAnimationFrame(updateRotation));
}
document.addEventListener("visibilitychange", updateRotation);
reducedMotion.addEventListener("change", event => {
  if (event.matches) rotationEnabled = false;
  updateRotation();
});
if ("IntersectionObserver" in window) {
  const visibility = new IntersectionObserver(([entry]) => {
    albumVisible = entry.isIntersecting;
    updateRotation();
  }, { threshold: .2 });
  visibility.observe(album);
}
album.dataset.ready = "";
controls.hidden = false;
showProject(0);
updateRotation();

const scenes = [...document.querySelectorAll(".scene")].map(section => ({
  section,
  artwork: section.querySelector(".scene-art")
}));
let scrollFrame = 0;

function paintParallax() {
  scrollFrame = 0;
  if (reducedMotion.matches) return;
  for (const { section, artwork } of scenes) {
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) continue;
    const progress = (innerHeight - bounds.top) / (innerHeight + bounds.height);
    const travel = Math.min(innerHeight * .21, 180);
    artwork.style.setProperty("--scene-offset", `${(progress - .5) * travel}px`);
  }
}

function queueParallax() {
  if (!reducedMotion.matches && !scrollFrame) scrollFrame = requestAnimationFrame(paintParallax);
}

window.addEventListener("scroll", queueParallax, { passive: true });
window.addEventListener("resize", queueParallax);
reducedMotion.addEventListener("change", queueParallax);
queueParallax();

