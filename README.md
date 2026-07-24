## Open in Marked

Open the current note, or monitor the current vault, in [Marked 3](https://markedapp.com).

### Requirements

- macOS
- [Marked 3](https://markedapp.com) installed
- Desktop Obsidian (`isDesktopOnly`)

### How to use

Use the commands via the Command Palette (<kbd>cmd</kbd>+<kbd>p</kbd>, then search for "Marked"), click the ribbon icon, or assign hotkeys in Obsidian's hotkey preferences.

### How it works

The plugin reads the absolute path of the active note or vault on disk, then asks macOS to open Marked 3 via its `x-marked-3://` URL handler (`open`). Marked shows changes with about a 2s delay.

If you use **Open vault in Marked**, the Marked preview follows the most recently modified file in your vault. To switch the preview to another note, make an edit (hitting <kbd>Space</kbd> anywhere in the note is enough).

### Disclosures

- Requires Marked 3, a separate paid macOS app.
- Uses Node.js APIs on desktop only to run `open` with a Marked URL.
- Reads absolute filesystem paths for files inside your vault so Marked can open them.

### Installing from Community Plugins

Search Community Plugins for "Open in Marked" and install it.

### Manually installing the plugin

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/ttscoff/Marked3-obsidian/releases/latest).
2. Create `VaultFolder/.obsidian/plugins/open-in-marked/`.
3. Copy both files into that folder and enable the plugin in Obsidian settings.

### License

MIT
