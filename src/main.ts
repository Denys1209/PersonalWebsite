import "./style.css";
import { marked } from "marked";
import mermaid from "mermaid";
import Cd from "./commads/cdCommand";
import type Command from "./commads/command";
import ClearCommand from "./commads/clearCommand";
import HelpCommand from "./commads/helpCommand";

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

const listOfAvailableCommand: Map<string, Command> = new Map();

listOfAvailableCommand.set("cd", new Cd());
listOfAvailableCommand.set("clear", new ClearCommand());
listOfAvailableCommand.set("help", new HelpCommand(listOfAvailableCommand));

function leaveMessageInTerminal(node: HTMLElement) {
  const appContainer = document.querySelector<HTMLDivElement>("#app")!;

  appContainer.append(node);
}

function parseCommand(text: string): void {
  const args: string[] = text.trim().toLowerCase().split(" ");

  if (!listOfAvailableCommand.has(args[0])) {
    return;
  }

  const command = listOfAvailableCommand.get(args[0]);

  command!.execute(args.slice(1));
}

function main() {
  const bodyElement = document.body;

  let elemDiv = document.createElement("div");
  elemDiv.id = "terminal";

  let inputTerminal = document.createElement("input");
  inputTerminal.id = "terminal-input";

  inputTerminal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      console.log(inputTerminal.value);

      let leaveCommandDiv = document.createElement("div");
      let commandText = document.createElement("p");
      commandText.textContent = `>${inputTerminal.value}`;
      leaveCommandDiv.appendChild(commandText);

      leaveMessageInTerminal(leaveCommandDiv);

      parseCommand(inputTerminal.value);

      inputTerminal.value = "";
    }
  });

  elemDiv.appendChild(inputTerminal);


  bodyElement.append(elemDiv);
}

main();
