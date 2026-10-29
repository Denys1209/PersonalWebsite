
import type Terminal from "../terminal";
import Command from "./command";


export default class HelpCommand extends Command 
{
    private listOfAllCommands : Map<string, Command>;


    public constructor(terminal: Terminal, listOfAllCommands: Map<string, Command>)
    {
        super("help", "list all commands with thier description", terminal);
        this.listOfAllCommands = listOfAllCommands;
    }



    execute(args: string[]): void {
        const appContainer = document.querySelector<HTMLDivElement>("#app")!;

        let contentDiv = document.createElement("div");

        this.listOfAllCommands.forEach((value : Command) => 
            {

                let newDiv = document.createElement("div");

                const textElement = document.createElement("p");

                textElement.textContent = `${value.name} - ${value.description}`;


                newDiv.append(textElement);
                contentDiv.append(newDiv)
            })

        appContainer.append(contentDiv);
    }

}