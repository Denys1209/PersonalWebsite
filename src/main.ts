import "./style.css";
import { marked } from "marked";
import mermaid from "mermaid";
import CdCommand from "./commads/cdCommand";
import type Command from "./commads/command";
import ClearCommand from "./commads/clearCommand";
import HelpCommand from "./commads/helpCommand";
import Terminal from "./terminal";

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





const terminal = new Terminal();





terminal.main();
