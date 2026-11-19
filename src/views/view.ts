export interface View 
{
    mount(root: HTMLElement): void;
    unmount(): void;
    onNavigate(path: string): void;
}
