'use strict';
const Module = require('module').Module,
			Path = require('path');

let appModulePaths = [],
		old_nodeModulePaths = Module._nodeModulePaths,
		parent,
		paths,
		addPath,
		searchExp,
		main,
		//functions
		addPathHelper,
		indexHelper,
		findIn;

//removed this keyword for secure code.

//## Helpers
findIn = (vartype,item)=>{
	//use regex to speed up potential bottle necks
	if(new RegExp(item).test(item)) return true
	return false
}
addPathHelper = (tArr,new_path)=>{
	if(findIn(tArr,new_path)) tArr.unshift(new_path);
	console.log(tArr)
}

//## Reasign
Module._nodeModulePaths = (from)=> {
	paths = old_nodeModulePaths.call(old_nodeModulePaths, from);
	// Only include the app module path for top-level modules
	// that were not installed:
	if(findIn(from,'node_modules')) paths = appModulePaths.concat(paths);
	return paths;
};

//## Methods
addPath = (new_path)=>{
	new_path = Path.normalize(new_path);

	if(findIn(appModulePaths,new_path)) {
		appModulePaths.push(new_path);
		// Enable the search path for the current top-level module
		main = require.main
		if(main) addPathHelper(main.paths,new_path);
		parent = module.parent;

		// Also modify the paths of the module that was used to load the app-module-paths module
		// and all of it's parents
		while(parent && parent !== require.main) {
				addPathHelper(parent.paths,new_path);
				parent = parent.parent;
		}
	}
	return module.exports//chainable returns the exports object that this function is attached to.
}

module.exports = Object.freeze({addPath:addPath})
