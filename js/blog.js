const controls = document.querySelector(".archive-controls");
const search = document.querySelector("#archive-search");
const filters = [...controls.querySelectorAll("[data-filter]")];
const articles = [...document.querySelectorAll(".archive-list article")];
const resultCount = document.querySelector(".archive-count");
const empty = document.querySelector(".archive-empty");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let topic = "todos";

function normalize(text) {
  return text.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{M}/gu, "");
}

const searchText = articles.map(article => normalize(article.textContent));

function filterArticles() {
  const terms = normalize(search.value).trim().split(/\s+/);
  let visibleCount = 0;
  articles.forEach((article, index) => {
    const wasHidden = article.hidden;
    const matchesTopic = topic === "todos" || article.dataset.topic === topic;
    const matchesSearch = terms.every(term => searchText[index].includes(term));
    article.hidden = !(matchesTopic && matchesSearch);
    if (article.hidden) return;
    visibleCount++;
    if (wasHidden && !reducedMotion.matches) {
      article.animate(
        [{ opacity: 0, transform: "translateY(9px)" }, { opacity: 1, transform: "none" }],
        { duration: 240, easing: "cubic-bezier(.22,.68,.22,1)" }
      );
    }
  });
  empty.hidden = visibleCount > 0;
  resultCount.textContent = visibleCount === 1 ? "1 matéria" : `${visibleCount} matérias`;
}

controls.addEventListener("click", event => {
  const filter = event.target.closest("[data-filter]");
  if (!filter) return;
  topic = filter.dataset.filter;
  for (const button of filters) button.setAttribute("aria-pressed", String(button === filter));
  filterArticles();
});
search.addEventListener("input", filterArticles);
filterArticles();
controls.hidden = false;
