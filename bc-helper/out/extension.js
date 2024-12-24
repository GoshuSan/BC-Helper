"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function activate(context) {
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
            "settings": { "al.codeAnalyzers": ["${AppSourceCop}", "${CodeCop}"] }
        };
        // Salva il file con il contenuto del workspace
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(workspaceContent, null, 4)));
            vscode.window.showInformationMessage(`Workspace salvato in: ${uri.fsPath}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Errore durante il salvataggio del workspace: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map