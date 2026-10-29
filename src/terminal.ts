import CatCommand from "./commads/catCommand";
import CdCommand from "./commads/cdCommand";
import ClearCommand from "./commads/clearCommand";
import type Command from "./commads/command";
import HelpCommand from "./commads/helpCommand";

export default class Terminal {

  private listOfAvailableCommand: Map<string, Command>;

  public currectDirectoryTextNode: Text;

  public currentDirectory: string = "./";

  
  constructor() {
    this.listOfAvailableCommand = new Map();
    
    const cd = new CdCommand(this);
    const clear = new ClearCommand(this);
    const help = new HelpCommand(this, this.listOfAvailableCommand);
    const cat = new CatCommand(this);

    this.listOfAvailableCommand.set(cd.name, cd);
    this.listOfAvailableCommand.set(clear.name, clear);
    this.listOfAvailableCommand.set(help.name, help);
    this.listOfAvailableCommand.set(cat.name, cat);

    this.currectDirectoryTextNode = document.createTextNode(this.currentDirectory);

   

  }

  private parseCommand(text: string): void {
    const args: string[] = text.trim().toLowerCase().split(" ");

    if (!this.listOfAvailableCommand.has(args[0])) {
      return;
    }

    const command = this.listOfAvailableCommand.get(args[0]);

    command!.execute(args.slice(1));
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

  terminalDiv.prepend(this.currectDirectoryTextNode);

  terminalDiv.id = "terminal";

  inputTerminal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      console.log(inputTerminal.value);

      let leaveCommandDiv = document.createElement("div");
      let commandText = document.createElement("p");
      commandText.textContent = `${this.currentDirectory}>${inputTerminal.value}`;
      leaveCommandDiv.appendChild(commandText);

      this.leaveMessageInTerminal(leaveCommandDiv);

      this.parseCommand(inputTerminal.value);

      inputTerminal.value = "";
    }
  });




  bodyElement.append(terminalDiv);
}


}
