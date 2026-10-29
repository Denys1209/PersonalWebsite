
import type Command from "./command";


export default class HelpCommand implements Command 
{
    name = "clear";

    desciption = "clear";

    private listOfAllCommands : Map<string, Command>;


    public constructor(listOfAllCommands: Map<string, Command>)
    {
        this.listOfAllCommands = listOfAllCommands;
    }



    execute(args: string[]): void {
        const appContainer = document.querySelector<HTMLDivElement>("#app")!;
        appContainer.innerHTML = '';
    }

}