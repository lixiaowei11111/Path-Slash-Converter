import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('*', new SlashConverterProvider(), {
            providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('path-slash-converter.convertSlash', convertSlash)
    );
}

class SlashConverterProvider implements vscode.CodeActionProvider {
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        const selectedText = document.getText(range);

        if (selectedText.includes('\\')) {
            const convertSlashAction = new vscode.CodeAction('Convert Slash', vscode.CodeActionKind.QuickFix);
            convertSlashAction.command = {
                command: 'path-slash-converter.convertSlash',
                title: 'Convert Slash',
                arguments: [document, range]
            };
            return [convertSlashAction];
        }

        return [];
    }
}

function convertSlash(document: vscode.TextDocument, range: vscode.Range) {
    const selectedText = document.getText(range);
    const transformedText = selectedText.replace(/\\/g, '/');
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, transformedText);
    vscode.workspace.applyEdit(edit);
}

export function deactivate() {}