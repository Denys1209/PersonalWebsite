const modules = import.meta.glob("./content/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true
}) as Record<string, string>;

export class VirtualFS {
  private files = new Map<string, string>();
  private dirs = new Set<string>(["/"]);

  constructor() {
    for (const [key, text] of Object.entries(modules)) {
      const path = key.replace("./content", "");
      this.files.set(path, text);

      let dir = "";

      for (const part of path.split("/").slice(1, -1)) {
        dir += "/" + part;
        this.dirs.add(dir);
      }
    }
  }

  public resolve(cwd: string, input: string): string {
    const parts = input.startsWith("/")
      ? []
      : cwd.split("/").filter((s) => s !== "");

    for (const seg of input.split("/")) {
      if (seg === "" || seg === ".") continue;
      if (seg === "..") parts.pop();
      else parts.push(seg);
    }

    return "/" + parts.join("/");
  }

  public isDir(path: string) {
    return this.dirs.has(path);
  }
  public isFile(path: string) {
    return this.files.has(path);
  }
  public read(path: string) {
    return this.files.get(path);
  }

  public list(path: string): string[] {
    const prefix = path === "/" ? "/" : path + "/";
    const names = new Set<string>();

    for (const p of [...this.dirs, ...this.files.keys()]) {
      if (p !== path && p.startsWith(prefix)) {
        const rest = p.slice(prefix.length);
        names.add(
          rest.split("/")[0] +
            (rest.includes("/") || this.dirs.has(p) ? "/" : ""),
        );
      }
    }

    return [...names].sort();
  }

  parent(path: string): string {
    return path.slice(0, path.lastIndexOf("/")) || "/";
  }

  join(dir: string, name: string): string {
    return dir === "/" ? "/" + name : dir + "/" + name;
  }
}