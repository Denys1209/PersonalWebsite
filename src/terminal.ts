import CdCommand from "./commads/cdCommand";
import ClearCommand from "./commads/clearCommand";
import type Command from "./commads/command";
import HelpCommand from "./commads/helpCommand";

export default class Terminal {

  private listOfAvailableCommand: Map<string, Command>;

  public currentDirectory: string = "./";
  
  constructor() {
    this.listOfAvailableCommand = new Map();
    this.listOfAvailableCommand.set("cd", new CdCommand(this));
    this.listOfAvailableCommand.set("clear", new ClearCommand(this));
    this.listOfAvailableCommand.set(
      "help",new HelpCommand(this, this.listOfAvailableCommand),);
  }

  

  public leaveMessageInTerminal(node: HTMLElement) {
    const appContainer = document.querySelector<HTMLDivElement>("#app")!;

    appContainer.append(node);
  }

  private parseCommand(text: string): void {
    const args: string[] = text.trim().toLowerCase().split(" ");

    if (!this.listOfAvailableCommand.has(args[0])) {
      return;
    }

    const command = this.listOfAvailableCommand.get(args[0]);

    command!.execute(args.slice(1));
  }

public main() {
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

      this.leaveMessageInTerminal(leaveCommandDiv);

      this.parseCommand(inputTerminal.value);

      inputTerminal.value = "";
    }
  });

  elemDiv.appendChild(inputTerminal);


  bodyElement.append(elemDiv);
}


}
