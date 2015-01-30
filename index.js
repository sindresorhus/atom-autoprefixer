'use strict';
var autoprefixer = require('autoprefixer-core');

function init() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	var selectedText = editor.getSelectedText();
	var text = selectedText || editor.getText();
	var retText = '';

	try {
		retText = autoprefixer({
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

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.setText(retText);
	}

	editor.setCursorBufferPosition(cursorPosition);
}

exports.config = {
	browsers: {
		type: 'array',
		default: autoprefixer.defaults,
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
	atom.commands.add('atom-workspace', 'autoprefixer', init);
};
