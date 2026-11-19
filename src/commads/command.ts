import type TerminalView from "../views/terminalView";

export default abstract class Command 
{
    public name: string;

    public description: string;

    protected terminal: TerminalView;

    constructor(name: string, description: string,   terminal: TerminalView)
    {
        this.name = name;

        this.description = description;

        this.terminal = terminal
    }



    public execute(args: string[]): void 
    {
        throw Error(`This execute is no implement ${this.name}`);
    }

}

