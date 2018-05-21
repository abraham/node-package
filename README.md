&lt;node-package&gt;
====
[![Version Status](https://img.shields.io/npm/v/node-package.svg?style=flat&label=version&colorB=4bc524)](https://npmjs.com/package/node-package)
[![macOS Build Status](https://img.shields.io/circleci/project/github/abraham/node-package.svg?style=flat&label=macos)](https://circleci.com/gh/abraham/node-package)
[![Linux Build Status](https://img.shields.io/travis/abraham/node-package.svg?style=flat&label=linux)](https://travis-ci.org/abraham/node-package)
[![Windows Build Status](https://img.shields.io/appveyor/ci/abraham/node-package.svg?style=flat&label=windows)](https://ci.appveyor.com/project/abraham/node-package)
[![Dependency Status](https://david-dm.org/abraham/node-package.svg?style=flat)](https://david-dm.org/abraham/node-package)

Install
----

Polyfill tags if you need them. This will include ShadowDOM and Custom Elements support.

```
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/bundles/webcomponents-sd-ce.js"></script>
```

Loading this component. It would be a good idea to use a specific version instead of `latest`.

```
<script src="https://unpkg.com/node-package@latest/dist/node-package.min.js"></script>
```

Example
----

[Live demo](https://codepen.io/abrahamwilliams/pen/eVVJrM)

Usage
----

Set the `name` attribute to the name of an [NPM](https://www.npmjs.com/) package.

```
<node-package name="lodash"></node-package>
```

![Example](https://github.com/abraham/node-package/raw/master/images/default.png)

Add the `global` attribute to add `--global` to the NPM install command.

```
<node-package name="@angular/cli" global></node-package>
```

Will result in `npm install @angular/cli --global`.

For advanced theming you can set the following:

- `--node-package-background-color`
- `--node-package-color`
- `--node-package-link-color`

```
<style>
  node-package.blue {
    --node-package-background-color: #03A9F4;
    --node-package-color: #FAFAFA;
    --node-package-link-color: #EEEEEE;
  }
</style>
<node-package name="bluebird" class="blue"></node-package>
```

![Example with blue theme](https://github.com/abraham/node-package/raw/master/images/custom-theme-blue.png)

```
<style>
  node-package.red {
    --node-package-background-color: #CB3837;
    --node-package-color: #FAFAFA;
    --node-package-link-color: #EEEEEE;
  }
</style>
<node-package name="@nutmeg/cli" class="red"></node-package>
```

![Example with red theme](https://github.com/abraham/node-package/raw/master/images/custom-theme-red.png)

Install commands being copied.

![Example of copying install command](https://github.com/abraham/node-package/raw/master/images/copy-install.gif)

License
----

NodePackage is released under an MIT license.

Built, tested, and published with [Nutmeg](https://nutmeg.tools).
