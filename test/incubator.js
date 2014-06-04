var helpers = require("yeoman-generator").test;
var rimraf  = require("rimraf");
var assert = require("assert");
var path    = require("path");

describe("incubator generator", function () {
	var testDirectory = path.join(__dirname, "temp");
	var app;

	beforeEach(function (done) {
		helpers.testDirectory(testDirectory, function (err) {
			if (err) {
				return done(err);
			}

			app = helpers.createGenerator("incubator:app", [
				"../../app"
			]);

			done();
		});
	});

	afterEach(function (done) {
		rimraf(testDirectory, done);
	});

	it("can be imported without blowing up", function () {
		var app = require("../app");
		assert(app !== undefined);
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

		helpers.mockPrompt(app, {
			projectName        : "test-project",
			projectDescription : "This is a test project",
			projectGitRepoUrl  : "git@github.com:inetCatapult/test-project.git"
		});

		app.options["skip-install"] = true;

		app.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});
