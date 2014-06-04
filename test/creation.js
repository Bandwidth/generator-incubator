/*global describe, beforeEach, it */
var path = require("path");
var helpers = require("yeoman-generator").test;

describe("incubator generator", function () {
	beforeEach(function (done) {
		helpers.testDirectory(path.join(__dirname, "temp"), function (err) {
			if (err) {
				return done(err);
			}

			this.app = helpers.createGenerator("incubator:app", [
				"../../app"
			]);
			done();
		}.bind(this));
	});

	it("creates expected files", function (done) {
		var expected = [
			".jshint.json",
			".jscs.json",
			".travis.yml",
			".gitignore",
			"package.json",
			"Gruntfile.js"
		];

		helpers.mockPrompt(this.app, {
			projectName        : "test-project",
			projectDescription : "This is a test project",
			projectGitRepoUrl  : "git@github.com:inetCatapult/test-project.git"
		});

		this.app.options["skip-install"] = true;

		this.app.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});
