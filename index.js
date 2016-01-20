
/** @babel */
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssSafeParser from 'postcss-safe-parser';
import postcssScssParser from 'postcss-scss';

function ext(path) {
	if (!path) {
		return undefined;
	}
	return path.substr(path.lastIndexOf('.') + 1).toLowerCase();
}

function init() {
	const editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	const selectedText = editor.getSelectedText();
	const text = selectedText || editor.getText();
	const path = editor.getPath();
	let postcssParser = postcssScssParser;

	if (path && ext(path) === 'css') {
		console.info('Using safe css parser');
		postcssParser = postcssSafeParser;
	}

	postcss(autoprefixer(atom.config.get('autoprefixer'))).process(text, {
		parser: postcssParser
	}).then(result => {
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
