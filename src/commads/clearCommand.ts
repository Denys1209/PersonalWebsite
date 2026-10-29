import type Command from "./command";


export default class ClearCommand implements Command 
{
    name = "clear";

    desciption = "clear";

    execute(args: string[]): void {
        const appContainer = document.querySelector<HTMLDivElement>("#app")!;
        appContainer.innerHTML = '';
    }

}