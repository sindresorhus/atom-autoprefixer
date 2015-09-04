'use babel';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssSafeParser from 'postcss-safe-parser';

function init() {
	const editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	const selectedText = editor.getSelectedText();
	const text = selectedText || editor.getText();

	postcss(autoprefixer({
		browsers: atom.config.get('autoprefixer.browsers'),
		cascade: atom.config.get('autoprefixer.cascade')
	})).process(text, {
		parser: postcssSafeParser
	}).then(function (result) {
		result.warnings().forEach(x => {
			console.warn(x.toString());
			atom.notifications.addWarning('Autoprefixer', {detail: x.toString()});
		});

		const cursorPosition = editor.getCursorBufferPosition();

		if (selectedText) {
			editor.setTextInBufferRange(editor.getSelectedBufferRange(), result.css);
		} else {
			editor.setText(result.css);
		}

		editor.setCursorBufferPosition(cursorPosition);
	}).catch(function (err) {
		if (err.name === 'CssSyntaxError') {
			err.message += err.showSourceCode();
		}

		console.error(err);
		atom.notifications.addError('Autoprefixer', {detail: err.message});
	});
}

export const config = {
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

export const activate = () => {
	atom.commands.add('atom-workspace', 'autoprefixer', init);
};
