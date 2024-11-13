import * as vscode from 'vscode';
import { SmallwebProvider } from './provider';

export function activate(context: vscode.ExtensionContext) {
	const tokens = vscode.workspace.getConfiguration('smallweb').get<Record<string, string>>('tokens') || {};

	const smallwebProvider = new SmallwebProvider(tokens)
	context.subscriptions.push(vscode.workspace.registerFileSystemProvider('smallweb', smallwebProvider, { isCaseSensitive: true }));
	context.subscriptions.push(vscode.workspace.registerTextSearchProvider('smallweb', smallwebProvider))
	context.subscriptions.push(vscode.workspace.registerFileSearchProvider('smallweb', smallwebProvider))

	context.subscriptions.push(vscode.commands.registerCommand('smallweb.workspaceInit', _ => {
		vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('smallweb:/'), name: "Smallweb" });
	}));

}

