# Mamangava

O site usa HTML, CSS e JavaScript nativos. Sirva a pasta com um servidor estático para navegar pelas URLs com barra final. As fontes, os ícones, o símbolo e as capturas são servidos localmente.

## Referências visuais

| Referência | O que entrou no projeto |
|---|---|
| [ESR Bespoke](https://www.esrbespoke.au/) | Fundo escuro, legenda editorial e abertura que dá espaço à imagem. |
| [DeepBook](https://deepbook-v2-wip.webflow.io/) | Geometria de fundo a serviço da hierarquia e chamada curta na abertura. |
| [Grail](https://grail-app.com/) | Capítulos e mudança de escala entre texto de orientação e título. |
| [Zirka](https://www.zrk.technology/) | Pequenas marcações técnicas e uso pontual da cor em fundo escuro. |
| [Moto Card](https://www.moto-card.com/) | Um objeto visual dominante e uma composição com respiro. |
| [Tengile MalaMala](https://tengilemalamala.com/) | Ritmo de leitura que alterna tipos grandes e imagens em escala ampla. |
| [LxL Creative](https://www.lxlcreative.co.uk/) | Projetos com pesos diferentes e tipografia integrada às imagens. |

As capturas de ChefData, Sevá Camburi, Bússola.farm, Atiye Persianas e Vitrine do Peixe foram feitas nos sites públicos em 9 de novembro de 2026. Cada imagem é servida em WebP e aponta para o projeto correspondente.

## Conferências

- Navegação em 320, 390, 768, 1440 e 2560 px.
- Três caminhos de orçamento, mensagens pré-preenchidas, alteração de respostas e resumo.
- Preferência por movimento reduzido, navegação por teclado e contraste das cores principais.
- Páginas do Caderno e carregamento das cinco imagens.

## Decisões antes da publicação

Os textos de Saiba mais estão disponíveis no simulador para validação. Confirmar o escopo coberto pelo preço-base e pela redação, a vigência do registro de domínio, o parcelamento dos adicionais e a periodicidade das quatro alterações ou publicações. O site exibe as quatro inclusões sem atribuir uma periodicidade.

## Busca e medição em produção

- Confirmar a resposta HTTPS do domínio principal e o redirecionamento de `www`. Enviar `https://mamangava.com.br/sitemap.xml` ao Google Search Console e ao Bing Webmaster Tools. Inspecionar a home, o Caderno, a página de serviço, os estudos de caso e o artigo de preço.
- No contêiner `GTM-MXQGZHDH`, associar os eventos personalizados `quote_start`, `quote_complete` e `whatsapp_click` a tags de evento GA4. Nos dois últimos, usar a variável da camada de dados `project_type`, com valores `new_site`, `redesign` e `store`.
- Validar os três fluxos no Tag Assistant e no DebugView. A camada de dados recebe apenas o nome do evento e, quando aplicável, o tipo do projeto. Revisar as tags automáticas de clique para que o texto pré-preenchido do WhatsApp e o endereço do cliente não sejam coletados. Contabilizar contatos recebidos separadamente dos cliques.
- Registrar a linha de base por consulta e página no Search Console. Acompanhar sessões e eventos do simulador no GA4 e citações por URL no relatório de IA do Bing.
- Medir LCP, INP e CLS da home e das páginas novas em produção. Usar dados de campo quando disponíveis e o Lighthouse para diagnóstico.

O símbolo da mamangava é o desenho aprovado anteriormente. Os ícones de estrutura, busca e medição foram desenhados para este projeto. Lusitana e Gabarito têm os arquivos de licença incluídos em assets.
