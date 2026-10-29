import { marked } from "marked";
import type Terminal from "../terminal";
import Command from "./command";
import mermaid from "mermaid";

export default class CatCommand extends Command {
  constructor(terminal: Terminal) {
    super("cat", "display file information", terminal);
  }

  public execute(args: string[]): void {
    console.log(`src/${this.terminal.currentDirectory.split('/').slice(1).join('/')}/${args[0]}`);

    fetch(`src/${this.terminal.currentDirectory.split('/').slice(1).join('/')}/${args[0]}`)
      .then((response) => response.text())
      .then(async (markdown) => {
        // Parse markdown into HTML using our custom renderer
        const htmlContent = await marked.parse(markdown);

        // Inject into the app container
        const appContainer = document.querySelector<HTMLDivElement>("#app")!;

        const commandDiv = document.createElement("div");

        commandDiv.innerHTML = htmlContent;

        appContainer.append(commandDiv);

        // 4. Tell Mermaid to find all elements with class="mermaid" and render them
        await mermaid.run({
          nodes: appContainer.querySelectorAll(".mermaid"),
        });
      })
      .catch((error) => {
        console.error("Failed to load markdown content:", error);
      });
  }
}
