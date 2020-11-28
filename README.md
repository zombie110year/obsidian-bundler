## Obsidian Bundler

Select current note as a start point, iterate the graph contains it, and copy all related file (notes or attachments) into a textbundle directory.

+ the note's wiki link will keep the origin format, markdown links too.
    + [ ] TODO: parse internal links.
+ the notes will be flatten in the root path.
+ the attachments will be placed into subdirectory `/assets`.

### How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

### API Documentation

See https://github.com/obsidianmd/obsidian-api
