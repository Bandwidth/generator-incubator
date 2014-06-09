var helpers = require("yeoman-generator").test;
var assert  = require("assert");
var path    = require("path");

describe("incubator core generator", function () {
	var testDirectory = path.join(__dirname, "temp");
	var app;

	beforeEach(function (done) {
		helpers.testDirectory(testDirectory, function (err) {
			if (err) {
				return done(err);
			}

			app = helpers.createGenerator("incubator:core", [
				"../../core"
			]);

			done();
		});
	});

	it("can be imported without blowing up", function (done) {
		var app = require("../app");
		assert(app !== undefined);

		done();
	});

	it("adds the correct properties to package.json", function (done) {
		var props = {
			projectName        : "test-project",
			projectDescription : "This is a test project",
			projectGitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
			npmRegistry        : "https://npm.bwrnd.com"
		};

		helpers.mockPrompt(app, props);

		app.options["skip-install"] = true;
		app.options["skip-welcome-message"] = true;

		app.run({}, function () {
			var pkg = require(path.join(testDirectory, "package.json"));

			assert(pkg.name === props.projectName);
			assert(pkg.description === props.projectDescription);
			assert(pkg.repository.url === props.projectGitRepoUrl);
			assert(pkg.publishConfig.registry === props.npmRegistry);

			done();
		});
	});

	it("slugifies the name of the project in package.json", function (done) {
		var props = {
			projectName        : "Test Project",
			projectDescription : "This is a test project",
			projectGitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
			npmRegistry        : "https://npm.bwrnd.com"
		};

		helpers.mockPrompt(app, props);

		app.options["skip-install"] = true;
		app.options["skip-welcome-message"] = true;

		app.run({}, function () {
			var pkg = require(path.join(testDirectory, "package.json"));

			assert(pkg.name === "test-project");

			done();
		});
	});

	it("creates expected files and directories", function (done) {
		var expected = [
			"lib",
			"test",
			"coverage",
			".jshint.json",
			"test/.jshint.json",
			".jscsrc",
			".gitignore",
			".gitattributes",
			"package.json",
			"Gruntfile.js"
		];

		var props = {
			projectName        : "test-project",
			projectDescription : "This is a test project",
			projectGitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
			npmRegistry        : "https://npm.bwrnd.com"
		};

		helpers.mockPrompt(app, props);

		app.options["skip-install"] = true;
		app.options["skip-welcome-message"] = true;

		app.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});
});
