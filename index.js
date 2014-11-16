'use strict';
var autoprefixer = require('autoprefixer-core');

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

exports.config = {
	browsers: {
		type: 'array',
		default: autoprefixer.default,
		items: {
			type: 'string'
		}
	},
	cascade: {
		type: 'boolean',
		default: true,
		title: 'Cascade prefixes'
	},
	remove: {
		type: 'boolean',
		default: true,
		title: 'Remove unneeded prefixes'
	}
};

exports.activate = function () {
	atom.workspaceView.command('autoprefixer', init);
};
