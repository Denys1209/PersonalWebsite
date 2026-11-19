import type App from "../app";
import CatCommand from "../commads/catCommand";
import CdCommand from "../commads/cdCommand";
import ClearCommand from "../commads/clearCommand";
import type Command from "../commads/command";
import HelpCommand from "../commads/helpCommand";
import LsCommand from "../commads/lsCommand";
import { VirtualFS } from "../virtualFS";
import type { View } from "./view";

export default class TerminalView implements View {
  private listOfAvailableCommand: Map<string, Command>;

  private _cwd = "/";
  private _app: App;

  public get cwd() {
    return this._cwd;
  }

  public set cwd(value: string) {
    this._cwd = value;
    this.currectDirectoryTextNode.textContent = value + ">";
  }

  public currectDirectoryTextNode: Text;

  public currentDirectory: string = "./";

  public fileSystem: VirtualFS;

  constructor(app: App) {
    
    this._app = app;

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

    this.currectDirectoryTextNode = document.createTextNode(
      this.currentDirectory,
    );

    this.fileSystem = new VirtualFS();
  }

  private async parseCommand(text: string) {
    const [name, ...args] = text.trim().split(" ");

    if (!name) return;

    const commad = this.listOfAvailableCommand.get(name.toLowerCase());

    if (!commad) return this.leaveError(`${name}: command not found`);

    await commad!.execute(args);
  }
  mount(root: HTMLElement): void {
    throw new Error("Method not implemented.");
  }
  unmount(): void {
    throw new Error("Method not implemented.");
  }
  onNavigate(path: string): void {
    throw new Error("Method not implemented.");
  }

  public leaveError(text: string) {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.color = "red";
    this.leaveMessageInTerminal(p);
  }

  public print(text: string) {
    const p = document.createElement("p");
    p.textContent = text;
    this.leaveMessageInTerminal(p);
  }

  public leaveMessageInTerminal(node: HTMLElement) {
    const appContainer = document.querySelector<HTMLDivElement>("#app")!;

    appContainer.append(node);
  }

  public main() {
    const bodyElement = document.body;

    let terminalDiv = document.createElement("div");

    let inputTerminal = document.createElement("input");

    inputTerminal.id = "terminal-input";
    terminalDiv.appendChild(inputTerminal);

    terminalDiv.id = "terminal";

    inputTerminal.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        console.log(inputTerminal.value);

        let leaveCommandDiv = document.createElement("div");
        let commandText = document.createElement("p");
        commandText.textContent = `${this._cwd}>${inputTerminal.value}`;
        leaveCommandDiv.appendChild(commandText);

        this.leaveMessageInTerminal(leaveCommandDiv);

        this.parseCommand(inputTerminal.value);

        inputTerminal.value = "";
      }
    });

    terminalDiv.prepend(this.currectDirectoryTextNode);
    bodyElement.prepend(terminalDiv);
  }
}
