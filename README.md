# ng-content-editable

### Getting Started
Download the package, and include the dist/ng-content-editable.min.js file in your page.

Via bower

```bash
bower install ng-content-editable --save
```

Or via npm

```bash
npm install ng-content-editable --save
```

Then add the content-editable module to your Angular App file, e.g.

```js
var app = angular.module('app', ["content-editable"]);
```

### Usage

```html
<div
  contenteditable
  ng-model="model"
  ng-maxlength=255
  ng-minlength=3
  only-text="true"
  convert-new-lines="true"
/></div>
```

### Description of optional attributes
| Attribute | Description| Example  |
| :------------- |:-------------|  :-----|
| ng-maxlength | The max-length for the attribute | 255|
| ng-minlength | The min-length for the attribute | 3|
| only-text | Remove all the html tags for the attribute value | true or false|
| convert-new-lines | Convert all `<br>` and `<div>` to `\r\n` | true or false|


### Demo

Visit [vizir.github.io/ng-contenteditable](http://vizir.github.io/ng-contenteditable/)

### Contributing

It's easy for you to make a contribution, just open a PR on GitHub :)

But if this will be your first contribution to a JavaScript project, below are some steps that are useful during development.

Install the dev dependencies:

```bash
npm install
```

Run linter:

```bash
npm run lint
```

Generate the dist files:

```bash
npm run compile
```

Regerate the dist files while coding:

```bash
npm run watch
```
