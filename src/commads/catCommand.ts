import { marked } from "marked";
import type TerminalView from "../views/terminalView";
import Command from "./command";
import mermaid from "mermaid";
import { renderMarkdown } from "../main";

export default class CatCommand extends Command {
  constructor(terminal: TerminalView) {
    super("cat", "display file information", terminal);
  }

  public async execute(args: string[]): Promise<void> {
    if (!args[0]) return this.terminal.leaveError("cat: missing file name");

    const path = this.terminal.fileSystem.resolve(this.terminal.cwd, args[0]);

    if (this.terminal.fileSystem.isDir(path))
    {
      return this.terminal.leaveError(`cat: ${args[0]}: Is a directory`);
    }

    if (!this.terminal.fileSystem.isFile(path)){
      return this.terminal.leaveError(`cat: ${args[0]}: No such file or directory`);
    }

    // const html = await marked.parse(this.terminal.fileSystem.read(path)!);
    // const div = document.createElement("div");
    // div.innerHTML = html;
    this.terminal.leaveMessageInTerminal(await renderMarkdown(this.terminal.fileSystem.read(path)!));
    // await mermaid.run({nodes: div.querySelectorAll(".mermaid")});
    
  }
}
