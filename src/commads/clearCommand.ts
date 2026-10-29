import type Terminal from "../terminal";
import Command from "./command";


export default class ClearCommand extends Command 
{

    constructor(terminal: Terminal)
    {
        super("clear", "clear the terminal from previous command", terminal);
    }



    execute(args: string[]): void {
        const appContainer = document.querySelector<HTMLDivElement>("#app")!;
        appContainer.innerHTML = '';
    }

}