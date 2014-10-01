'use strict';
var autoprefixer = require('autoprefixer-core');
var plugin = module.exports;

function init() {
	var editor = atom.workspace.getActiveEditor();

	if (!editor) {
		return;
	}

	var isCSS = editor.getGrammar().scopeName === 'source.css';
	// process the selected text only when not CSS
	var text = isCSS ? editor.getText() : editor.getSelectedText();
	var prefixed = '';

	try {
		prefixed = autoprefixer({
			browsers: atom.config.get('autoprefixer.browsers'),
			cascade: atom.config.get('autoprefixer.cascade')
		}).process(text, {
			safe: true
		}).css;
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
	browsers: autoprefixer.default,
	cascade: true
};

plugin.activate = function () {
	return atom.workspaceView.command('autoprefixer', init);
};
