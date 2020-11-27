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

    this.addSettingTab(new SampleSettingTab(this.app, this));

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

class SampleSettingTab extends PluginSettingTab {
  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange((value) => {
            console.log("Secret: " + value);
          })
      );
  }
}
