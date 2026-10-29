
export default interface Command 
{
    name: string;

    desciption: string;

    execute(args: string[]): void;    

}

