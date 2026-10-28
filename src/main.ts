import "./style.css";
import { marked } from "marked";
import mermaid from "mermaid";

// 1. Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

// 2. Configure marked to intercept mermaid code blocks and turn them into <div class="mermaid">
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  if (lang === "mermaid") {
    // Mermaid requires the raw source text inside a container with class="mermaid"
    return `<div class="mermaid">${text}</div>`;
  }
  // Fallback for regular code blocks
  return `<pre><code class="language-${lang}">${text}</code></pre>`;
};

marked.use({ renderer });



// 3. Fetch, parse, and render
function cd(path: string) {
  console.log(`src/content/${path}/read.md`)

  fetch(`/src/content/${path}/read.md`)
    .then((response) => response.text())
    .then(async (markdown) => {
      // Parse markdown into HTML using our custom renderer
      const htmlContent = await marked.parse(markdown);

      // Inject into the app container
      const appContainer = document.querySelector<HTMLDivElement>("#app")!;
      appContainer.innerHTML = htmlContent;

      // 4. Tell Mermaid to find all elements with class="mermaid" and render them
      await mermaid.run({
        nodes: appContainer.querySelectorAll(".mermaid"),
      });
    })
    .catch((error) => {
      console.error("Failed to load markdown content:", error);
    });
}

console.log(window.location.href.split('/').slice(3).join('/'));
cd(window.location.href.split('/').slice(3).join('/'));
// cd(window.location.href.split('/').slice(3).join('/'))
