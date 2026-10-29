import { marked } from "marked";
import Command from "./command";
import mermaid from "mermaid";
import type Terminal from "../terminal";

export default class CdCommand extends Command {
  constructor(terminal: Terminal) {
    super("cd", "move to a different directory", terminal);
  }

  public execute(args: string[]): void {

    if (args.length !== 1)
    {
      return;
    }

    if (args[0] === '..')
    {
      if (this.terminal.currentDirectory !== './')
      {
        const pathSplit = this.terminal.currentDirectory.split('/');


        this.terminal.currentDirectory = pathSplit.slice(0, pathSplit.length-1).join('/') + '/';
      }
    }
    else if (
      this.terminal.currentDirectory[
        this.terminal.currentDirectory.length - 1
      ] === "/"
    ) {
      this.terminal.currentDirectory += args[0];
    } else {
      this.terminal.currentDirectory += '/' + args[0];
    }
    this.terminal.currectDirectoryTextNode.textContent = this.terminal.currentDirectory + '>';

    // fetch(`/src/${args[0]}/read.md`)
    //   .then((response) => response.text())
    //   .then(async (markdown) => {
    //     // Parse markdown into HTML using our custom renderer
    //     const htmlContent = await marked.parse(markdown);

    //     // Inject into the app container
    //     const appContainer = document.querySelector<HTMLDivElement>("#app")!;

    //     const commandDiv = document.createElement("div");

    //     commandDiv.innerHTML = htmlContent;

    //     appContainer.append(commandDiv);

    //     // 4. Tell Mermaid to find all elements with class="mermaid" and render them
    //     await mermaid.run({
    //       nodes: appContainer.querySelectorAll(".mermaid"),
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Failed to load markdown content:", error);
    //   });
  }
}
