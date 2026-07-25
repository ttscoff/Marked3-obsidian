import { App, Notice, Platform, Plugin, PluginManifest, PluginSettingTab, Setting, FileSystemAdapter, addIcon } from 'obsidian';

addIcon('Marked-logo-neutral', `<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 78 49" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><use id="Artboard1" xlink:href="#_Image1" x="9" y="7" width="56px" height="38px"/><defs><image id="_Image1" width="56px" height="38px" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAmCAYAAACRWlj1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADk0lEQVRogd3azY+dUxwH8M+9c6e9HdN2lBJKlCHxWkrEwgKb7opIJDZio7EiJBJ/AImtP8BCWFgKEQsLIWEpkTZYqCLidUpGO7RmzIzFuY8+c+7zdk7vZKLf5GTuufOcb77f33n7nfPcKWnYh9vxKC7GMv7EWgLHHK7HQ7gTZ7Ey+tsVfezHvXgQU1jF6QSODZjH8ZGQ9VJZwQnc0IFjgNecC0jBsYYlPNNRy2H8gn8iLcv4VAhgJ/TxBI5GRFVlCZfW8MzjTZzpwPNKDccMXsC3NganqnyDy5qMzeBh/NaBrFx+HAWlCM41eDeh/brQK7MlLXM4IgQwRctbdeZewmIiWXmo3YW78ZXxIdS1vD3S8rrQ6zlalmJjh7GQKahcUnu9qqzi7wlo6UNPGBK/Ykfs+n+OK/FTH3e48MzBbYRuvH9rdWwabiYY/HBrdWwariMYPCpM6gsNewkGT+Ex55HmtGB5AhyrGW0uqvryPryI5/GkkBKlLs9n8BGeFtKza0cCU7eK7/CqkP/C94kcH3eJwvFE0pPOZTMF5qXvjYcqtJxO5DihQkyM3S3/jzFt/GSxXdhvzxczic/P0W5wkEhaNe5z9ti4TV+71hjDomEdBsI5KwVVz08ncjAeqFRzhZZ+m8Ec4ngodT6flTCM6rOVTzWjh8Gke5DxeXt5BseuqN54vqtBD7NNBrfJ68G9Uf3qDI59Uf2mDI4+djcZyJnYhPuWMm7J4Ih7/ZIMDtjRZjAHscH5DI74+mNbppbGOThtMotMjrh4mOdw9DDVtsjkbNDxEp+zD+6M6vGi0xXbN8NgLCY1A2F8m8hZiXvY1WQwZ4uAPVE9Zw+L21yVqaXRYGoeWuCKqF55bGlB3Os52RBMNxncn0kaRz9HXNwm1+CwyWDcE11RnrepyXqBeHrk8jQuMp9lki6WPueufj0bt6i/Mnn+aDL4tbS3RgXeK33OmX8Fyivp+xnt1/Fl0wMD/CztFH02EjZMbD92Mz3CrHC3k9J+QYehfY+0dwxPVXCczDD3QwXP47pffazgYJu5As91JH65pv0jGQaP1HC90UHLGp7taq7AQRyrIVxQfUlUYIjfE8wtas5+DqmfOp8LryL+Q2oqdqvwyniP8Kb2A+GKsEu7T7SvqqdwQLgybMMDwmuHnUIA3xEusbcMQ2FVq7ojXROin3tEq8UkrvNS0MeNwg8ZDgjmjo3KF/K2pUb8C5sMzpWOftRCAAAAAElFTkSuQmCC"/></defs></svg>`);

addIcon('Marked-logo-blue', `<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 78 49" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><use xlink:href="#_Image1" x="9" y="7" width="56px" height="38px"/><defs><image id="_Image1" width="56px" height="38px" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAmCAYAAACRWlj1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEx0lEQVRogd3Zy6scRRQG8F/NnXtzc81bYuIrGhUfwYCK4PsBIi5aRd34QDAqEQkuXEQQV4I70ZiViP+B6ELREcFFogQ1EsRFjC8MmECMj8RozNM47aJ6zNyZnp6pvlEk32a6e7q+Pt+pU6dOVQUpaOXzsAjnYRd243dZaCdwTGJ+wZFje8FxOIEjYAGW4vSCY68s/N77ahiRcBHW4UYswRja+Bkf4klZ2DOEo4GHsUYUN1sUeAjfYa0sfDCCLSvwPC4Tnd0obPkBb+GZbmcNFhi9dCUewqpC1Hjx20EbR/AFbpKFgyU8i3AvHscFBUez69s5jha/q2ThtRKOcdwsOuj2gmOiENfBscKWt/CYLBwoFxjJLsJLuLoQNFnpjGjgu7hHFvLCOfOxGs8Wxk+a7pxe/Ikfcb4sHC1smcTlWI8VhbBZFRwdZz0tC+v7BbbyO7EWl2KO6Z6uQo79hREBz+EWLNbv6Sq08ZQsrNPKV+MJLBfDeWxEW47hM1m4yj8NYly/iBtEL42PSNaNv7BRHBtTorCqHitDLvbib1hWtJ9I5CBGwyxZyINWPoHNYljOrkHWTXpMDKFRe6wXbRwWRTVnYAvMk4X9DZyBS8QxMhOMiw6qK07RdsrMxRGnDw1cLHo9NST/z8jFjtPAV8WDkwlBLAI0xAlym5NP5EJoyMIR3IePxUzYFsXORHCn/SF8XfDW5cixU0w+KZiikxCysFUWrsOFuAu34lq0pAk9iq3iPHizOJdeI5Z0o6It1riv4REskIVleCeBI1f04PRslYXtYuEa0cqr68t+fIDbZOG4U2JVM57AcUgs+77peX52AkfAOQxP6UukZdepaeIimtLm10E2nZvAAWdWkXVQVfeVYXnJs3HFeBgRnaL+OGIUzEu0pUgygxCXN6kCl5Y8Sy3Xxkq+G2rYMqWVh6oebKhTUcTVSDc6675R0dA/ZiekFyINNIYJrFO+9baZJ824oH/MzpE+bTUxUSWwLFSGIeCUnmenJnKUtUlNdkTbJ6sEBvWWKot77ssSTxVycSuiG3Nq2NHE+DCBqSuDXPR2N85L5KBfYFN6iAZDxuCY9PVhWeZNjYKgPwqa0p09ZoQkkzoG6U8ydcJrfs99nYX4GJr/hsDeJDP3BHAsrMExYUiSaaiXZHq9f1oNjrIsmoqhAodtFQ5CrzFn1eDoHYMpxXoHAWNVAuvMX/SHZJ0s2vvtOns0wZBpYkENUrqzXaxn60RB2TRRB5UCd6i3qt/bdT2rJsecYgXRwaEaHDkOVgncg19qEG/quq6TpDro7rVPa7Tfh91VAv8QN4RTsA0buu4PpFpV4Ii4idzBJ/g2kWMzfhwsMJ75rRHPAUfBYayWheOGxev3Ew2D1rSdgXgY84B4/jEKvsejstCuLn+ysBMPmj6uynAA98vCRyX/rZW2q9bGCyW2bCm4honcIx7D7WKU+i4LG7ASLw944z1cIQtvDvj/S3EzalRswpYBtrwqnlm+PaDtK1gpCxs7D9JSeCtfIp4ezRVDcluxEzdKuzdw/ZA3N+EOWdg3Auf54pnKbLFXP5eF3b2v/XfnEa28KUbB3Y4fPRND8le8jjUlu3Izwn974BLntsXilt454ly1Q0xkP51ocfA3xx4J7KusESYAAAAASUVORK5CYII="/></defs></svg>`);

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
		this.ribbonIcon = this.addRibbonIcon(this.settings.MarkedIconColor, 'Open in Marked', () => {
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
		this.ribbonIcon = this.addRibbonIcon(this.settings.MarkedIconColor, 'Open in Marked', () => {
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
