import { marked } from "marked";
import type Command from "./command";
import mermaid from "mermaid";

export default class Cd implements Command {
  name = "cd";
  desciption = "test";

  public execute(args: string[]): void {
    console.log(`src/${args[0]}/read.md`);

    fetch(`/src/${args[0]}/read.md`)
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
