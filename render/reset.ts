const resetCss = `

:root {
	font-size: 16px;
}

html, body {
	height: 100%;
}

button,
input,
optgroup,
select,
textarea {
	font-family: inherit;
	font-size: 100%;
	margin: 0;
	padding: 0;
	line-height: inherit;
	color: inherit;
}
sub,
sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline;
}
html {
	line-height: 1.5;
	-webkit-text-size-adjust: 100%;
	font-family: 'Source Sans Pro', sans-serif, sans-serif;
}
table {
	text-indent: 0;
	border-color: inherit;
	border-collapse: collapse;
}
hr {
	height: 0;
	color: inherit;
	border-top-width: 1px;
}
input::placeholder,
textarea::placeholder {
	opacity: 1;
	color: #a1a1aa;
}
::-webkit-file-upload-button {
	-webkit-appearance: button;
	font: inherit;
}
button {
	background-color: transparent;
	background-image: none;
}
body {
	font-family: inherit;
	line-height: inherit;
}
*,
::before,
::after {
	box-sizing: border-box;
	border: 0 solid currentColor;
}
h1,
h2,
h3,
h4,
h5,
h6 {
	font-size: inherit;
	font-weight: inherit;
}
a {
	color: inherit;
	-webkit-text-decoration: inherit;
	text-decoration: inherit;
}
::-moz-focus-inner {
	border-style: none;
	padding: 0;
}
[type='search'] {
	-webkit-appearance: textfield;
	outline-offset: -2px;
}
pre,
code,
kbd,
samp {
	font-family: Cousine, monospace, monospace;
	font-size: 1em;
}
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
	display: block;
	vertical-align: middle;
}
img,
video {
	max-width: 100%;
	height: auto;
}
body,
blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre,
fieldset,
ol,
ul {
	margin: 0;
}
button:focus {
	outline: 1px dotted;
	outline: 5px auto -webkit-focus-ring-color;
}
fieldset,
ol,
ul,
legend {
	padding: 0;
}
textarea {
	resize: vertical;
}
button,
[role='button'] {
	cursor: pointer;
}
:-moz-focusring {
	outline: 1px dotted ButtonText;
}
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
	height: auto;
}
summary {
	display: list-item;
}
:root {
	-moz-tab-size: 4;
	tab-size: 4;
}
ol,
ul {
	list-style: none;
}
img {
	border-style: solid;
}
button,
select {
	text-transform: none;
}
:-moz-ui-invalid {
	box-shadow: none;
}
progress {
	vertical-align: baseline;
}
abbr[title] {
	-webkit-text-decoration: underline dotted;
	text-decoration: underline dotted;
}
b,
strong {
	font-weight: bolder;
}
sub {
	bottom: -0.25em;
}
sup {
	top: -0.5em;
}
button,
[type='button'],
[type='reset'],
[type='submit'] {
	-webkit-appearance: button;
}
::-webkit-search-decoration {
	-webkit-appearance: none;
}

`

export function reset() {
	const style = document.createElement('style')
	style.textContent = resetCss

	document.head.appendChild(style)
}
