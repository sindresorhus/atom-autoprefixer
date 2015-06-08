'use babel';
import autoprefixer from 'autoprefixer-core';

function init() {
	const editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	const selectedText = editor.getSelectedText();
	const text = selectedText || editor.getText();
	let retText = '';

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

export let config = {
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

export let activate = () => {
	atom.commands.add('atom-workspace', 'autoprefixer', init);
};
