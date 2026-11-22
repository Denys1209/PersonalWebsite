import type App from "../app";
import CatCommand from "../commads/catCommand";
import CdCommand from "../commads/cdCommand";
import ClearCommand from "../commads/clearCommand";
import type Command from "../commads/command";
import HelpCommand from "../commads/helpCommand";
import LsCommand from "../commads/lsCommand";
import { VirtualFS } from "../virtualFS";
import type { View } from "./view";

// Builds the prompt: guest@denys:~/projects$
function buildPrompt(path: string): HTMLSpanElement {
  const wrap = document.createElement("span");
  wrap.className = "terminal-prompt";

  const user = document.createElement("span");
  user.className = "terminal-user";
  user.textContent = "guest@denys";

  const dir = document.createElement("span");
  dir.className = "terminal-path";
  dir.textContent = path === "/" ? "~" : "~" + path;

  wrap.append(user, ":", dir, "$");
  return wrap;
}

export default class TerminalView implements View {
  private listOfAvailableCommand: Map<string, Command>;

  private _app: App;
  private _cwd = "/";

  // The .terminal box: output lines first, the input line always last.
  private _livingDiv = document.createElement("div");
  // The input line itself (a <label>, so clicking the prompt focuses the input).
  private _terminalDiv = document.createElement("label");
  private _promptEl: HTMLSpanElement = buildPrompt("/");
  private _input = document.createElement("input");

  public fileSystem: VirtualFS;

  public get cwd() {
    return this._cwd;
  }

  // Commands (cd) assign here: moves the terminal AND updates the URL.
  public set cwd(value: string) {
    this.showDirectory(value);
    this._app.navigate(value);
  }

  public get livingDiv() {
    return this._livingDiv;
  }

  constructor(app: App) {
    this._app = app;
    this.fileSystem = app.fs; // share the app's filesystem instead of building a second one

    this.listOfAvailableCommand = new Map();

    const cd = new CdCommand(this);
    const clear = new ClearCommand(this);
    const help = new HelpCommand(this, this.listOfAvailableCommand);
    const cat = new CatCommand(this);
    const ls = new LsCommand(this);

    this.listOfAvailableCommand.set(cd.name, cd);
    this.listOfAvailableCommand.set(clear.name, clear);
    this.listOfAvailableCommand.set(help.name, help);
    this.listOfAvailableCommand.set(cat.name, cat);
    this.listOfAvailableCommand.set(ls.name, ls);

    this.build();
  }

  // ---- View interface -------------------------------------------------

  public mount(root: HTMLElement): void {
    root.append(this._livingDiv);
    this._input.focus(); // must happen after the element is on the page
  }

  public unmount(): void {
    this._livingDiv.remove();
  }

  // Called by App when the URL changed (back button, pasted link, view switch).
  public onNavigate(path: string): void {
    const fs = this.fileSystem;
    // The URL can point at a file; a terminal can only "be" in a folder.
    this.showDirectory(fs.isDir(path) ? path : fs.parent(path));
  }

  // ---- Output helpers (used by commands) ------------------------------

  public leaveError(text: string) {
    const p = document.createElement("p");
    p.className = "terminal-error";
    p.textContent = text;
    this.leaveMessageInTerminal(p);
  }

  public print(text: string) {
    const p = document.createElement("p");
    p.textContent = text;
    this.leaveMessageInTerminal(p);
  }

  public leaveMessageInTerminal(node: HTMLElement) {
    this._terminalDiv.before(node);
  }

  public clearAllText() {
    for (const child of Array.from(this._livingDiv.children)) {
      if (child !== this._terminalDiv) {
        child.remove();
      }
    }
  }

  // ---- Internals ------------------------------------------------------

  private showDirectory(dir: string) {
    this._cwd = dir;
    const next = buildPrompt(dir);
    this._promptEl.replaceWith(next);
    this._promptEl = next;
  }

  private echo(text: string) {
    const row = document.createElement("div");
    row.className = "terminal-echo";

    const cmd = document.createElement("span");
    cmd.textContent = text; // textContent, never innerHTML: this is user-typed text

    row.append(buildPrompt(this._cwd), cmd);
    this.leaveMessageInTerminal(row);
  }

  private async parseCommand(text: string) {
    const [name, ...args] = text.trim().split(/\s+/);

    if (!name) return;

    const command = this.listOfAvailableCommand.get(name.toLowerCase());

    if (!command) return this.leaveError(`${name}: command not found`);

    await command.execute(args);
  }

  private build() {
    this._livingDiv.className = "terminal";
    this._terminalDiv.className = "terminal-line";

    const input = this._input;
    input.className = "terminal-input";
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.autocapitalize = "off";
    input.setAttribute("autocorrect", "off");
    input.setAttribute("aria-label", "Terminal command");

    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") return;

      const text = input.value;
      input.value = "";
      this.echo(text);

      try {
        await this.parseCommand(text);
      } catch (error) {
        console.error(error);
        this.leaveError("Something went wrong running that command.");
      }

      this._terminalDiv.scrollIntoView({ block: "end" });
    });

    // Clicking anywhere focuses the input, unless the user is selecting text to copy.
    this._livingDiv.addEventListener("click", () => {
      if (!window.getSelection()?.toString()) input.focus();
    });

    this._terminalDiv.append(this._promptEl, input);
    this._livingDiv.append(this._terminalDiv);
  }
}