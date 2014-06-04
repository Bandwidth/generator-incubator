var _ = require("lodash");

module.exports = function (grunt) {

	var sourceFiles = [ "*.js", "app/**/*.js" ];
	var testFiles   = [ "test/**/*.js" ];
	var allFiles    = sourceFiles.concat(testFiles);

	var defaultJsHintOptions = require("./.jshint.json");
	var testJsHintOptions = _.extend(require("./test/.jshint.json"), defaultJsHintOptions);

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

		mochaTest : {
			test : {
				options : {
					reporter : "spec"
				},
				src     : testFiles
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jscs-checker");
	grunt.loadNpmTasks("grunt-mocha-test");

	// Register tasks
	grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
	grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
	grunt.registerTask("test", "Run the test suite.", [ "mochaTest" ]);

	grunt.registerTask("default", [ "lint", "style", "test" ]);

};