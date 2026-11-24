import NormalView from "./views/normalView";
import TerminalView from "./views/terminalView";
import type { View } from "./views/view";
import { VirtualFS } from "./virtualFS";

type Mode = "normal" | "terminal";

export default class App {
  public fs = new VirtualFS();
  public path = "/";
  private view: View = new NormalView(this);
  private mode: Mode = "normal";
  private content = document.createElement("main");
  private _root: HTMLElement;

  constructor(root: HTMLElement) {
    this._root = root;
  }

  public start() {
    try {
      this.mode =
        localStorage.getItem("view") === "terminal" ? "terminal" : "normal";
    } catch {}

    this._root.append(this.buildToggle(), this.content);
    window.addEventListener("hashchange", () => this.syncFromUrl());
    this.syncFromUrl();
    this.mountView();
  }

  public navigate(path: string) {
    location.hash = path;
  }

  public setMode(mode: Mode) {
    this.mode = mode;
    localStorage.setItem("view", mode);
    this.mountView();
  }

  private syncFromUrl() {
    const path = this.fs.resolve(
      "/",
      decodeURIComponent(location.hash.slice(1)),
    );
    this.path = this.fs.isDir(path) || this.fs.isFile(path) ? path : "/";

    this.view?.onNavigate(this.path);
  }

  private mountView() {
    this.view.unmount();
    this.view =
      this.mode === "terminal" ? new TerminalView(this) : new NormalView(this);
    document.body.dataset.view = this.mode;
    this.view.mount(this.content);
    this.view.onNavigate(this.path);
  }

  private buildToggle() {
    const toggle = document.createElement("div");
    const button = document.createElement("button");

    toggle.className = "toggle";

    if (this.mode === "normal") {
      button.textContent = ">_ terminal view";
    } else {
      button.textContent = "normal view";
    }

    toggle.append(button);

    button.addEventListener("click", () => {
      this.setMode(this.mode === "normal" ? "terminal" : "normal");
      if (this.mode === "normal") {
        button.textContent = ">_ terminal view";
      } else {
        button.textContent = "normal view";
      }
    });

    return toggle;
  }
}
