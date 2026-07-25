import { App, Notice, Platform, Plugin, PluginManifest, PluginSettingTab, Setting, FileSystemAdapter, addIcon } from 'obsidian';

// Simple vector icons — the old PNG-in-SVG (xlink) icons render blank in current Obsidian.
addIcon('Marked-logo-neutral', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>`);

addIcon('Marked-logo-blue', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>`);

interface MarkedSettings {
	MarkedIconColor: string;
}

const DEFAULT_SETTINGS: MarkedSettings = {
	MarkedIconColor: 'Marked-logo-blue'
}

export default class MarkedPlugin extends Plugin {
	settings: MarkedSettings;
	ribbonIcon: HTMLElement;

	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
	}

	async onload() {

		await this.loadSettings();

		// isDesktopOnly plugin; always expose UI on desktop. macOS is enforced at launch time.
		this.ribbonIcon = this.addRibbonIcon(this.settings.MarkedIconColor, 'Marked', () => {
			this.doRibbonAction();
		});

		this.addCommand({
			id: 'open-indexed-note-in-marked',
			name: 'Open current note in Marked',
			callback: () => {
				this.openInMarked(false);
			},
		});

		this.addCommand({
			id: 'open-vault-in-marked',
			name: 'Open vault in Marked',
			callback: () => {
				this.openVaultInMarked(false);
			},
		});

		this.addSettingTab(new MarkedSettingsTab(this.app, this));
	}

	async resetRibbonIcon() { //Hat-tip to @liam for this elegant way of managing the plugin's ribbon button. The idea is to give the plugin the ribbon icon as an object to hold onto. Then, since the ribbon icons are a `HTMLElement`, you can `.detach()` them to remove them and re-add them, reassigning the object.
		this.ribbonIcon.detach();
		this.ribbonIcon = this.addRibbonIcon(this.settings.MarkedIconColor, 'Marked', () => {
			this.doRibbonAction();
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, (await this.loadData()) as Partial<MarkedSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	doRibbonAction() {
		this.openInMarked(false);
	};

	private nodeRequire(moduleName: string): unknown {
		const req =
			typeof window !== 'undefined' && (window as Window & { require?: NodeRequire }).require
				? (window as Window & { require: NodeRequire }).require
				: typeof require !== 'undefined'
					? require
					: null;
		if (!req) {
			throw new Error('Node require() is not available in this Obsidian process');
		}
		return req(moduleName);
	}

	private isMacDesktop(): boolean {
		if (Platform.isMacOS) {
			return true;
		}
		try {
			const processApi = this.nodeRequire('process') as { platform?: string };
			return processApi?.platform === 'darwin';
		} catch {
			return false;
		}
	}

	private openPathInMarked(absolutePath: string): void {
		if (!Platform.isDesktop) {
			new Notice('Marked is only available on desktop Obsidian.');
			return;
		}
		if (!this.isMacDesktop()) {
			new Notice('Marked is only available on macOS.');
			return;
		}

		const markedUrl = `x-marked-3://${encodeURI(absolutePath)}`;

		try {
			const electron = this.nodeRequire('electron') as {
				shell?: { openExternal: (url: string) => Promise<void> | void };
			};
			if (electron?.shell?.openExternal) {
				void Promise.resolve(electron.shell.openExternal(markedUrl)).catch((error: unknown) => {
					const message = error instanceof Error ? error.message : String(error);
					new Notice(`Failed to open Marked: ${message}`);
				});
				return;
			}
		} catch {
			// Fall through to macOS `open`.
		}

		try {
			const childProcess = this.nodeRequire('child_process') as typeof import('child_process');
			childProcess.exec(`open ${JSON.stringify(markedUrl)}`, (error) => {
				if (error) {
					new Notice(`Failed to open Marked: ${error.message}`);
				}
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			new Notice(`Failed to open Marked: ${message}`);
		}
	}

	openVaultInMarked(_checking: boolean): boolean {
		if (!this.isMacDesktop()) {
			new Notice('Marked is only available on macOS.');
			return false;
		}

		const vaultAdapter = this.app.vault.adapter;
		if (!(vaultAdapter instanceof FileSystemAdapter)) {
			new Notice('Marked needs a local vault on disk.');
			return false;
		}

		this.openPathInMarked(vaultAdapter.getBasePath());
		new Notice('Opened vault in Marked.');
		return true;
	}

	openInMarked(_checking: boolean): boolean {
		if (!this.isMacDesktop()) {
			new Notice('Marked is only available on macOS.');
			return false;
		}

		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('No active note to open in Marked.');
			return false;
		}

		const vaultAdapter = this.app.vault.adapter;
		if (!(vaultAdapter instanceof FileSystemAdapter)) {
			new Notice('Marked needs a local vault on disk.');
			return false;
		}

		this.openPathInMarked(vaultAdapter.getFullPath(activeFile.path));
		new Notice('Opened in Marked.');
		return true;
	};
}

class MarkedSettingsTab extends PluginSettingTab {
	plugin: MarkedPlugin;

	constructor(app: App, plugin: MarkedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Ribbon button color')
			.setDesc('Should the ribbon button be Marked blue or inherit the theme colour?')
			.addDropdown(buttonMenu => buttonMenu
				.addOption("Marked-logo-neutral", "Inherit the theme colour")
				.addOption("Marked-logo-blue", "Marked blue")
				.setValue(this.plugin.settings.MarkedIconColor)
				.onChange(async (value) => {
					this.plugin.settings.MarkedIconColor = value;
					void this.plugin.resetRibbonIcon();
					await this.plugin.saveSettings();
				}));
	}
}
