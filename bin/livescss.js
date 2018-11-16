const exec = require('child_process').exec
const fs = require('fs');
const util = require('util');

const pathToCompileScript = './bin/compile.rb';

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const compileSCSS = debounce(function() {
	exec(pathToCompileScript, (error, stdout, stderr) => {
		stdout && console.log(stdout);
		stderr && console.log(stderr);
		error && console.log(error);
	}, 1000, true);
})

console.log('\x1b[0m', "🛠' Running SCSS watch tool ⚙️");


const debouncedCallback = debounce(function(eventType, filename) {
	console.log('\x1b[32m', `💡  "${filename}" was just ${eventType}d`)
	console.log('\x1b[0m', '')
	compileSCSS();
}, 200);

fs.watch('./styles', debouncedCallback)


