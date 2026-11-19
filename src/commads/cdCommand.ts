import { marked } from "marked";
import Command from "./command";
import mermaid from "mermaid";
import type TerminalView from "../views/terminalView";

export default class CdCommand extends Command {
  constructor(terminal: TerminalView) {
    super("cd", "move to a different directory", terminal);
  }

  public execute(args: string[]): void {

    const input = args[0] ?? "/";
    const target = this.terminal.fileSystem.resolve(this.terminal.cwd, input);

    if (this.terminal.fileSystem.isFile(target)) {
      return this.terminal.leaveError(`cd: ${input}: Not a directory`);
    }

    if (!this.terminal.fileSystem.isDir(target)){
      return this.terminal.leaveError(`cd: ${input}: No such file or directory`);
    }

    this.terminal.cwd = target;

  }
}
