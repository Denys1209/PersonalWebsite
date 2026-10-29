import type Terminal from "../terminal";

export default abstract class Command 
{
    public name: string;

    public description: string;

    protected terminal: Terminal;

    constructor(name: string, description: string,   terminal: Terminal)
    {
        this.name = name;

        this.description = description;

        this.terminal = terminal
    }



    execute(args: string[]): void 
    {
        throw Error(`This execute is no implement ${this.name}`);
    }

}

