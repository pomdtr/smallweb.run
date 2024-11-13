/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import * as vscode from 'vscode';
import { createClient, type NormalizeOAS } from 'fets';
import { Base64 } from  'js-base64';
import openapi from './openapi';

export class SmallwebProvider implements vscode.FileSystemProvider, vscode.FileSearchProvider, vscode.TextSearchProvider {

	private clients: Record<string, ReturnType<typeof this.createClient>> = {};

	constructor(tokens: Record<string, string>) {
		for (const [host, token] of Object.entries(tokens)) {
			this.clients[host] = this.createClient({ host, token });
		}
	}

	private createClient(options: {
		host: string,
		token?: string
	}) {
		return createClient<NormalizeOAS<typeof openapi>>({
			endpoint: `https://${options.host}/api`,
			globalParams: options.token ? { headers: { Authorization: `Bearer ${options.token}` } } : {}
		})
	}



	// --- manage file metadata

	async stat(uri: vscode.Uri) {
		const client = this.clients[uri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/stat'].post({
			json: { path: uri.path }
		})

		if (resp.status === 404) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}

		return resp.json()
	}

	async readDirectory(uri: vscode.Uri) {
		const client = this.clients[uri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/readDirectory'].post({
			json: { path: uri.path }
		})

		if (resp.status === 404) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}
		const body = await resp.json()
		const entries: [string, vscode.FileType][] = body.map(entry => ([entry.name, entry.type]))
		return entries
	}

	// --- manage file contents

	async readFile(uri: vscode.Uri) {
		const client = this.clients[uri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/readFile'].post({
			json: { path: uri.path }
		})

		// if (resp.status === 404) {
		// 	throw vscode.FileSystemError.FileNotFound(uri);
		// }

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}

		const body = await resp.json()
		return Base64.toUint8Array(body.b64)
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }) {
		const client = this.clients[uri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const b64 = Base64.fromUint8Array(content)
		const res = await client['/fs/writeFile'].post({
			json: { path: uri.path, b64, create: options.create, overwrite: options.overwrite }
		})

		if (!res.ok) {
			throw new Error(res.statusText);
		}
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }) {
		if (oldUri.authority !== newUri.authority) {
			throw new Error('Cross-host renaming is not supported');
		}

		const client = this.clients[oldUri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/rename'].post({
			json: { oldPath: oldUri.path, newPath: newUri.path, overwrite: options.overwrite }
		})

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}
	}

	async delete(uri: vscode.Uri, options: { recursive: boolean }) {
		const client = this.clients[uri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/delete'].post({
			json: { path: uri.path, recursive: options.recursive }
		})

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}
	}

	async createDirectory(uri: vscode.Uri) {
		const client = this.clients[uri.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/createDirectory'].post({
			json: { path: uri.path }
		})

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}
	}

	async copy(source: vscode.Uri, destination: vscode.Uri, options: { readonly overwrite: boolean; }) {
		if (source.authority !== destination.authority) {
			throw new Error('Cross-host copying is not supported');
		}

		const client = this.clients[source.authority];
		if (!client) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const resp = await client['/fs/copy'].post({
			json: { source: source.path, destination: destination.path, overwrite: options.overwrite }
		})

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}

	}

	provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Uri[]> {
		return [];
	}

	provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextSearchComplete> {
		return {}
	}


	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	watch(_resource: vscode.Uri): vscode.Disposable {
		// ignore, fires for all changes...
		return new vscode.Disposable(() => { });
	}
}
