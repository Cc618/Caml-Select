// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

// Selects the Caml Function
// Returns whether the function is selected
function selectFunc () {
	let editor = vscode.window.activeTextEditor;
	let data = editor.document.getText();
	
	// Find the start and end of the function
	let cursorPos = editor.document.offsetAt(editor.selection.anchor);
	let start = data.lastIndexOf('\nlet', cursorPos) + 1;
	let end = data.indexOf(';;', cursorPos) + 2;

	// If function found, update selection
	if (end != -1)
		editor.selection = new vscode.Selection(editor.document.positionAt(start), editor.document.positionAt(end + 2));
	
	return end != -1;
}

function getFunc() {
	let editor = vscode.window.activeTextEditor;
	let doc = editor.document;
	let data = doc.getText();
	
	// Find the start and end of the function
	let cursorPos = editor.document.offsetAt(editor.selection.anchor);
	let start = data.lastIndexOf('\nlet', cursorPos) + 1;
	let end = data.indexOf(';;', cursorPos) + 2;

	// Not found
	if (end == -1)
		return '';

	// Get command data (in selection)
	return data.substring(start, end);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Command to select the function
	context.subscriptions.push(vscode.commands.registerCommand('extension.selectCamlFunction', selectFunc));

	// Command to execute the function in the shell
	context.subscriptions.push(vscode.commands.registerCommand('extension.runCamlFunction', function () {
		// Open a terminal and run ocaml if there isn't one
		if (vscode.window.terminals.length == 0) {
			vscode.window.showErrorMessage('Please start a new terminal');
			return;
		}

		// Retrieve the function
		let cmd = getFunc();
		
		// Execute
		if (cmd.length != 0)
			vscode.window.activeTerminal.sendText(cmd);
	}));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
