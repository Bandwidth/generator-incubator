module.exports = function (grunt) {

	var sourceFiles = [ "*.js", "lib/**/*.js" ];
	var testFiles   = [ "test/**/*.js" ];
	var allFiles    = sourceFiles.concat(testFiles);

	grunt.initConfig({
		jscs : {
			src     : allFiles,
			options : {
				config : ".jscs.json"
			}
		},

		jshint : {
			jshintrc : ".jshint.json",
			src      : allFiles
		},

		mochaTest : {
			test : {
				options : {
					reporter : "spec"
				},
				src     : testFiles
			}
		},

		coverage : {
			options : {
				thresholds : {
					statements : 100,
					branches   : 100,
					lines      : 100,
					functions  : 100
				},
				dir        : "coverage",
				root       : "test"
			}
		},

		clean : [ "coverage" ]
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jscs-checker");
	grunt.loadNpmTasks("grunt-mocha-test");
	grunt.loadNpmTasks("grunt-istanbul-coverage");

	// Rename plugins when needed
	grunt.renameTask("coverage", "istanbul");

	// Register tasks
	grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
	grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
	grunt.registerTask("test", "Run the test suite.", [ "mochaTest" ]);
	grunt.registerTask("coverage", "Create a test coverage report.", [ "clean", "istanbul" ]);

	grunt.registerTask("default", [ "clean", "lint", "style", "test", "coverage" ]);

};