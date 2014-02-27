/* global atom */
'use strict';
var autoprefixer = require('autoprefixer');
var plugin = module.exports;

function prefix () {
	var browsers = atom.config.get('autoprefixer.browsers');
	var editor = atom.workspace.getActiveEditor();
	var isCSS = editor.getGrammar().name === 'CSS';
	var text = '';
	var textPrefixed = '';

	if (!editor) {
		return;
	}

	// If Atom reports that the content is CSS, use Autoprefixer for all
	// content, otherwise, just use Autoprefixer for the selected content.
	text = isCSS ? editor.getText() : editor.getSelectedText();

	try {
		textPrefixed = autoprefixer.apply(autoprefixer, browsers).process(text).css;
	} catch (e) {
		atom.beep();
		return;
	}

	if (isCSS) {
		editor.setText(textPrefixed);
	} else {
		// replace selected content with the result from Autoprefixer
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), textPrefixed);
	}
}

plugin.configDefaults = {
	browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

plugin.activate = function () {
	return atom.workspaceView.command('autoprefixer', prefix);
};
