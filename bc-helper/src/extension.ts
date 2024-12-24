import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('workspaceCreator.createWorkspace', async () => {
        // Ottieni la cartella principale aperta nel workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('Nessun workspace aperto.');
            return;
        }

        // Usa il nome della prima cartella come nome suggerito
        const folderName = path.basename(workspaceFolders[0].uri.fsPath);
        const suggestedFileName = `${folderName}.code-workspace`;

        // Apri la finestra di dialogo per salvare il file
        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(path.join(workspaceFolders[0].uri.fsPath, suggestedFileName)),
            filters: { 'Workspace Files': ['code-workspace'] },
        });

        if (!uri) {
            return; // Utente ha annullato
        }

        // Creazione del contenuto predefinito per il workspace
        const workspaceContent = {
            "folders": [ 
			{ 
			"path": "app" 
			} 
			], 
			"settings": {"al.codeAnalyzers": ["${AppSourceCop}","${CodeCop}"]}
        	};

        // Salva il file con il contenuto del workspace
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(workspaceContent, null, 4)));
            vscode.window.showInformationMessage(`Workspace salvato in: ${uri.fsPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Errore durante il salvataggio del workspace: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

