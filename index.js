/** @babel */
import path from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssSafeParser from 'postcss-safe-parser';
import postcssScss from 'postcss-scss';

function init(editor, onSave) {
	const supportedExt = [
		'.css',
		'.less',
		'.scss',
		'.sass'
	];

	if (!editor || !supportedExt.includes(path.extname(editor.getPath()))) {
		return;
	}

	const selectedText = onSave ? null : editor.getSelectedText();
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
		title: 'Cascade Prefixes',
		type: 'boolean',
		default: true
	},
	onFileSave: {
		title: 'Run On File Save',
		type: 'boolean',
		default: false
	},
	remove: {
		title: 'Remove Unneeded Prefixes',
		type: 'boolean',
		default: true
	}
};

export const activate = () => {
	if (atom.config.get('autoprefixer.onFileSave') == true) {
		atom.workspace.observeTextEditors(editor => {
			editor.getBuffer().onDidSave(() => {
				init(editor, true);
			});
		});
	}
	atom.commands.add('atom-workspace', 'autoprefixer', () => {
		init(atom.workspace.getActiveTextEditor())
	});
};
