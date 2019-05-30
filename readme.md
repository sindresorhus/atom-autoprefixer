# autoprefixer

> Prefix CSS and SCSS with [Autoprefixer](https://github.com/postcss/autoprefixer)


## Install

```
$ apm install autoprefixer
```

Or, Settings → Install → Search for `autoprefixer`


## Usage

### Prefix

- Open the Command Palette and type `Autoprefixer: Prefix`.

	![](https://user-images.githubusercontent.com/6153816/57973335-23f09b80-79c5-11e9-91cc-66ae1ce9f99d.gif)

- In an HTML file, select the CSS, open the Command Palette, and type `Autoprefixer: Prefix`.

	![](https://user-images.githubusercontent.com/6153816/57973336-23f09b80-79c5-11e9-8f21-edf4102c2adf.gif)

### Remove Prefixes

- Open the Command Palette and type `Autoprefixer: Remove Prefixes`.

	![](https://user-images.githubusercontent.com/6153816/57973337-23f09b80-79c5-11e9-8e68-5f48f2ea2dd1.gif)

- In an HTML file, select the CSS, open the Command Palette, and type `Autoprefixer: Remove Prefixes`.

	![](https://user-images.githubusercontent.com/6153816/57973338-24893200-79c5-11e9-869a-25b7e28387f4.gif)


## Settings

There's a `Run on Save` option and more in the settings.


## Keyboard shortcut

Set the keyboard shortcut you want in your [keymap](http://flight-manual.atom.io/using-atom/sections/basic-customization/#customizing-keybindings):

```cson
'atom-text-editor':
	'cmd-shift-x': 'autoprefixer:prefix'
	'cmd-shift-u': 'autoprefixer:remove-prefixes'
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
