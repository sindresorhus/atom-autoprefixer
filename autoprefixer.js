var autoprefixer = require('autoprefixer');
var plugin = module.exports;

plugin.configDefaults = {
	browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

plugin.activate = function () {
	return atom.workspaceView.command('autoprefixer', plugin.prefix);
};

plugin.prefix = function () {
	var editor = atom.workspace.getActiveEditor();

	if (!editor) {
		return;
	}

	var browsers = atom.config.get('autoprefixer.browsers');
	var text = editor.getText();
	var prefixed = autoprefixer.apply(autoprefixer, browsers).process(text).css;

	return editor.setText(prefixed);
};
