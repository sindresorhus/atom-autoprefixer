/** @babel */
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssSafeParser from 'postcss-safe-parser';
import postcssScss from 'postcss-scss';

function init() {
	const editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	const selectedText = editor.getSelectedText();
	const text = selectedText || editor.getText();
	const parser = editor.getGrammar().scopeName === 'source.css' ? postcssSafeParser : postcssScss;

	postcss(autoprefixer(atom.config.get('autoprefixer'))).process(text, {parser}).then(result => {
		result.warnings().forEach(x => {
			console.warn(x.toString());
			atom.notifications.addWarning('Autoprefixer', {
				detail: x.toString()
			});
		});

		const cursorPosition = editor.getCursorBufferPosition();

		if (selectedText) {
			editor.setTextInBufferRange(editor.getSelectedBufferRange(), result.css);
		} else {
			editor.setText(result.css);
		}

		editor.setCursorBufferPosition(cursorPosition);
	}).catch(err => {
		if (err.name === 'CssSyntaxError') {
			err.message += err.showSourceCode();
		}

		console.error(err);
		atom.notifications.addError('Autoprefixer', {
			detail: err.message
		});
	});
}

export const config = {
	browsers: {
		title: 'Supported browsers',
		description: 'Using the [following syntax](https://github.com/ai/browserslist#queries).',
		type: 'array',
		default: autoprefixer.defaults,
		items: {
			type: 'string'
		}
	},
	cascade: {
		title: 'Cascade prefixes',
		type: 'boolean',
		default: true
	},
	remove: {
		title: 'Remove unneeded prefixes',
		type: 'boolean',
		default: true
	}
};

export const activate = () => {
	atom.commands.add('atom-workspace', 'autoprefixer', init);
};
