"use strict";

var _  = require("lodash");
var fs = require("fs");

module.exports = function (grunt) {

	var sourceFiles = [ "*.js", "app/**/*.js", "core/**/*.js" ];
	var testFiles   = [ "test/**/*.js" ];
	var allFiles    = sourceFiles.concat(testFiles);

	var defaultJsHintOptions = JSON.parse(fs.readFileSync("./.jshint.json"));
	var testJsHintOptions = _.extend(
		JSON.parse(fs.readFileSync("./test/.jshint.json")),
		defaultJsHintOptions
	);

	grunt.initConfig({
		jscs : {
			src     : allFiles,
			options : {
				config : ".jscsrc"
			}
		},

		jshint : {
			src     : sourceFiles,
			options : defaultJsHintOptions,
			test    : {
				options : testJsHintOptions,
				files   : {
					test : testFiles
				}
			}
		},

		/* jshint camelcase: false */
		mocha_istanbul : {
		/* jshint camelcase: true */
			coverage : {
				src : "test"
			}
		},

		watch : {
			scripts : {
				files   : allFiles,
				tasks   : [ "lint", "style" ],
				options : {
					spawn : false,
				},
			},
		},

		clean : [ "coverage", "test/temp" ]
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jscs-checker");
	grunt.loadNpmTasks("grunt-mocha-istanbul");

	grunt.registerTask("test", [ "mocha_istanbul:coverage" ]);

	// Register tasks
	grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
	grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
	grunt.registerTask("default", [ "clean", "lint", "style", "test" ]);

};