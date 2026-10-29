import type Terminal from "../terminal";
import Command from "./command";



export default class slCommand extends Command 
{

    constructor(terminal: Terminal)
    {
        super("sl", "tree", terminal);
    }

    execute(args: string[]): void {

    }

}