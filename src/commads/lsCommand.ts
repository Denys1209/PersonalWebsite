import type Terminal from "../terminal";
import Command from "./command";



export default class LsCommand extends Command 
{

    constructor(terminal: Terminal)
    {
        super("ls", "tree", terminal);
    }

    public execute(args: string[]): void {
        
        const contentDiv = document.createElement("div");

        const content: string[] =  this.terminal.fileSystem.list(this.terminal.cwd);

        content.forEach((value : string) => 
        {

            let newDiv = document.createElement("div");

            const textElement = document.createElement("p");

            textElement.textContent = `${value}`;


            newDiv.append(textElement);
            contentDiv.append(newDiv)
        })

        this.terminal.leaveMessageInTerminal(contentDiv);

    }

}