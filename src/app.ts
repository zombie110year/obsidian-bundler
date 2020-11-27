import { MetadataCache, App, ViewState } from "obsidian";
import { join as joinPath, parse as parsePath, ParsedPath } from "path";
import { copyFile, PathLike } from "fs";
import { pathToFileURL } from 'url';

// 声明全局变量 app 的类型
declare global {
  const app: App;
}

class ReferenceGraphNode {
  path: string;
  links: Array<ReferenceGraphNode>;

  constructor(path: string, links?: Array<ReferenceGraphNode>) {
    this.path = path;
    this.links = links || [];
  }

  addLinkedNode(node: ReferenceGraphNode) {
    this.links.push(node);
  }
}

/**
 * findout all linked notes, attachments, then construct them into a graph object.
 */
function getCurrentGraph(): ReferenceGraphNode {
  const view_state: ViewState = app.workspace.activeLeaf.getViewState();
  const path = view_state.state.file;
  let recorder = new Set<string>();
  return getLinkedNodes(path, recorder);
}

function getLinkedNodes(start: string, recorder: Set<string>): ReferenceGraphNode {
  let x = new ReferenceGraphNode(start);
  recorder.add(start);
  // todo: read resolved links for specified file
  // @ts-ignore
  const links: Object = app.metadataCache.resolvedLinks[start];
  console.debug(start, links);
  if (links) {
    Object.entries(links).forEach(([path, _count]) => {
      if (!recorder.has(path)) {
        x.addLinkedNode(getLinkedNodes(path, recorder));
      }
    });
  }

  return x;
}

function cp(src: string, dest: PathLike): Promise<void> {
  return new Promise(function (resolve, reject) {
    copyFile(src, dest, function () {
      resolve();
    });
  });
}

class CopingTask {
  src: string;
  dest: string;

  constructor(
    vault_root: string,
    dest_root: string,
    path: string,
    type: "note" | "asset"
  ) {
    this.src = joinPath(vault_root, path);
    // flatten
    const name = parsePath(path).base;
    if (type === "note") {
      this.dest = joinPath(dest_root, name);
    } else {
      this.dest = joinPath(dest_root, "assets", name);
    }
  }

  async copy() {
    return cp(this.src, this.dest).then(() =>
      console.log(`copy ${this.src} to ${this.dest}`)
    );
  }
}

class TaskManager {
  vault: string;
  dest: string;
  tasks: Array<CopingTask>;

  constructor(vault: string, dest: string) {
    this.vault = vault;
    this.dest = dest;
    this.tasks = [];
  }

  addTask(path: string, type: "note" | "asset") {
    this.tasks.push(new CopingTask(this.vault, this.dest, path, type));
  }

  async performTask() {
    return Promise.all(this.tasks.map((t) => t.copy()));
  }
}

function makeTask(taskmgr: TaskManager, node: ReferenceGraphNode) {
  // todo: check type.
  taskmgr.addTask(node.path, "note");
  if (node.links.length !== 0) {
    for (let subnode of node.links) {
      makeTask(taskmgr, subnode);
    }
  }
}

export function bundleCurrentGraph() {
  // todo: get vault root path
  // @ts-ignore
  const vault = app.vault.adapter.basePath;
  // todo: choose destination path by user
  const dest = "";
  const graph = getCurrentGraph();
  let tasks = new TaskManager(vault, dest);
  makeTask(tasks, graph);
  tasks.performTask().then(() => {
    console.log("all coping task completed!");
  });
}

export function dbgDumpGraph() {
  const graph = getCurrentGraph();
  return graph;
}
