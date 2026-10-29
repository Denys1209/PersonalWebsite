import type Command from "./command";



export default class slCommand implements Command 
{
    name = "ls";
    desciption = "ls";

    execute(args: string[]): void {

    }

}