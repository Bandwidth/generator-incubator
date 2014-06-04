module.exports = function (grunt) {

	var sourceFiles = [ "*.js", "app/**/*.js" ];
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