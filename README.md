&lt;node-package&gt;
====

Install
----

Polyfill tags if you need them. This will include ShadowDOM and Custom Elements support.

```
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-sd-ce.js"></script>
```

Loading this component. It would be a good idea to use a specific version instead of `latest`.

```
<script src="https://unpkg.com/node-package@latest/dist/node-package.min.js"></script>
```

Usage
----

```
<node-package></node-package>

<node-package name="Pickle"></node-package>

<node-package>Slot content</node-package>
```



License
----

NodePackage is released under an MIT license.

Built, tested, and published with [Nutmeg](https://nutmeg.tools).
