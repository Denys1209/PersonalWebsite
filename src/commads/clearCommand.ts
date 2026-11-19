import type TerminalView from "../views/terminalView";
import Command from "./command";


export default class ClearCommand extends Command 
{

    constructor(terminal: TerminalView)
    {
        super("clear", "clear the terminal from previous command", terminal);
    }



    public execute(args: string[]): void {
        const appContainer = document.querySelector<HTMLDivElement>("#app")!;
        appContainer.innerHTML = '';
    }

}