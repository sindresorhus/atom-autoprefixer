'use strict';
var autoprefixer = require('autoprefixer');
var plugin = module.exports;

function prefix() {
	var browsers = atom.config.get('autoprefixer.browsers');
	var editor = atom.workspace.getActiveEditor();
	var isCSS = editor.getGrammar().name === 'CSS';

	if (!editor) {
		return;
	}

	// process the selected text only when not CSS
	var text = isCSS ? editor.getText() : editor.getSelectedText();
	var prefixed = '';

	try {
		prefixed = autoprefixer(browsers).process(text).css;
	} catch (err) {
		console.error(err);
		atom.beep();
		return;
	}

	var cursorPosition = editor.getCursorBufferPosition();

	if (isCSS) {
		editor.setText(prefixed);
	} else {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), prefixed);
	}

	editor.setCursorBufferPosition(cursorPosition);
}

plugin.configDefaults = {
	browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

plugin.activate = function () {
	return atom.workspaceView.command('autoprefixer', prefix);
};
