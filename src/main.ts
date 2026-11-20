import "./styles/uiElements/toggle.css";

import { marked } from "marked";
import mermaid from "mermaid";
import TerminalView from "./views/terminalView";
import App from "./app";

let terminalView: boolean = false;

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

let diagramId = 0;

export async function renderMarkdown(markdown: string): Promise<HTMLElement> {
  const el = document.createElement("div");
  el.className = "markdown";
  el.innerHTML = await marked.parse(markdown);
  mermaid.run({nodes: el.querySelectorAll(".mermaid")});
  

  // for (const node of el.querySelectorAll<HTMLElement>(".mermaid")) {
  //   try {
  //     const { svg } = await mermaid.render(
  //       `mermaid-${diagramId++}`,
  //       node.dataset.source ?? "",
  //     );
  //     node.innerHTML = svg;
  //   } catch (err) {
  //     console.error("Mermaid failed:", err);
  //     node.textContent = "Diagram could not be rendered.";
  //   }
  // }
  return el;
}

// const terminal = new TerminalView();

const body = document.getElementById("app");

const app = new App(body!);

app.start();

// main();
