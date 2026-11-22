import type App from "../app";
import { renderMarkdown } from "../main";
import type { View } from "./view";

export default class NormalView implements View {
  private el = document.createElement("div");
  private _app: App;

  public constructor(app: App) {
    this._app = app;
  }

  public mount(root: HTMLElement): void {
    root.append(this.el);
  }

  public unmount(): void {
    this.el.remove();
  }

  public onNavigate(path: string): void {
    this.render(path);
    this._app.navigate(path);
  }

  private link(label: string, path: string): HTMLAnchorElement {
    const a = document.createElement("a");
    a.href = "#" + encodeURI(path);
    a.textContent = label;
    return a;
  }

  private breadcrumbs(path: string): HTMLElement {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Breadcrumb");

    const crumbs = [{ label: "home", path: "/" }];

    let acc = "";

    for (const part of path.split("/").filter(Boolean)) {
      acc += "/" + part;
      crumbs.push({ label: part, path: acc });
    }

    crumbs.forEach((c, i) => {
      if (i > 0) nav.append(" / ");
      if (i === crumbs.length - 1) {
        // current page: plain text, not a link
        const here = document.createElement("span");
        here.textContent = c.label;
        here.setAttribute("aria-current", "page");
        nav.append(here);
      } else {
        nav.append(this.link(c.label, c.path));
      }
    });
    return nav;
  }

  private childLinks(dir: string): HTMLElement 
  {
    const { fs } = this._app;

    const ul = document.createElement("ul");

    for (const name of fs.list(dir))
    {
        if (name === "read.md") continue;

        const isDir = name.endsWith("/");

        const clean = isDir ? name.slice(0, -1) : name;
        const li = document.createElement("li");
        li.append(this.link(isDir ? clean + "/" : clean, fs.join(dir, clean)));
        ul.append(li); 
    }

    return ul;
  }

  private async render(path: string) {
    const { fs } = this._app;
    const dir = fs.isDir(path) ? path : fs.parent(path);
    const mdPath = fs.isFile(path)
      ? path
      : (dir === "/" ? "" : dir) + "/read.md";

    this.el.replaceChildren(
      this.breadcrumbs(path), // <a href="#/projects"> links
      this.childLinks(dir), // fs.list(dir) -> <a href="#/...">
      fs.isFile(mdPath)
        ? await renderMarkdown(fs.read(mdPath)!)
        : document.createElement("div"),
    );
  }
}
