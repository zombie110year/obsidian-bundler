import { dbgDumpGraph, bundleCurrentGraph, dbgDumpTasks } from "src/app";
import { Plugin, App, PluginSettingTab, Modal, Setting } from "obsidian";

export default class ObsidianBundlerPlugin extends Plugin {
  onload() {
    console.log("loading obsidian bundler");
    this.addCommand({
      id: "open-modal-obsidian-bundler-control",
      name: "Open Bundler Modal",
      callback: () => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          new SampleModal(this.app).open();
        }
      },
      checkCallback: (checking: boolean) => {
        let leaf = app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new SampleModal(this.app).open();
          }
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new ObsidianBundlerSettingTab(this.app, this));

    this.registerEvent(
      this.app.on("codemirror", (cm: CodeMirror.Editor) => {
        console.log("codemirror", cm);
      })
    );

    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });

    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );
  }

  onunload() {
    console.log("unloading plugin");
  }

  dbg_dump_graph() {
    return dbgDumpGraph();
  }

  dbg_dump_tasks() {
    return dbgDumpTasks();
  }

  bundle() {
    bundleCurrentGraph().finally(() => {
      console.log("obsidian bundle over");
    });
  }
}

// todo: show a confirm modal before perform coping.
class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

class ObsidianBundlerSettingTab extends PluginSettingTab {
  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for Obsidian Bundler" });

    // todo: parse wiki links
    new Setting(containerEl)
      .setName("Parse Wiki Links(todo)")
      .setDesc(
        "parse wiki links into markdown links. This function is working in process."
      )
      .addSlider((slider) => {
        slider.onChange((value) => {
          console.debug(`Parse Wiki Links set to ${value}`);
        });
      });
  }
}
