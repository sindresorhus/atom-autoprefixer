/* global atom */
'use strict';
var autoprefixer = require('autoprefixer');
var plugin = module.exports;

function prefix() {
	var browsers = atom.config.get('autoprefixer.browsers');
	var editor = atom.workspace.getActiveEditor();
	var isCSS = editor.getGrammar().name === 'CSS';
	var text = '';
	var prefixed = '';

	if (!editor) {
		return;
	}

	// process the selected text only when not CSS
	text = isCSS ? editor.getText() : editor.getSelectedText();

	try {
		prefixed = autoprefixer.apply(autoprefixer, browsers).process(text).css;
	} catch (err) {
		console.error(err);
		atom.beep();
		return;
	}

	if (isCSS) {
		editor.setText(prefixed);
	} else {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), prefixed);
	}
}

plugin.configDefaults = {
	browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

plugin.activate = function () {
	return atom.workspaceView.command('autoprefixer', prefix);
};
