var helpers = require("yeoman-generator").test;
var expect  = require("chai").expect;
var path    = require("path");
var shell   = require("shelljs");
var sinon   = require("sinon");

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
		var app = require("../core");
		expect(app).to.not.be.undefined;

		done();
	});

	it("properly loads configuration from prompts", function (done) {
		var props = {
			name        : "test-project",
			description : "This is a test project",
			gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
			private     : true
		};

		helpers.mockPrompt(app, props);

		app.options["skip-install"] = true;
		app.options["skip-welcome-message"] = true;

		app.run({}, function () {
			expect(app.project.name).to.equal(props.name);
			expect(app.project.description).to.equal(props.description);
			expect(app.project.repository.url).to.equal(props.gitRepoUrl);
			expect(app.project.repository.type).to.equal("git");
			expect(app.project.private).to.equal(true);
			expect(app.project.scripts.test).to.equal("grunt");

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
			name        : "test-project",
			description : "This is a test project",
			gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
			private     : true
		};

		helpers.mockPrompt(app, props);

		app.options["skip-install"] = true;
		app.options["skip-welcome-message"] = true;

		app.run({}, function () {
			helpers.assertFile(expected);
			done();
		});
	});

	describe("git configuration", function () {
		describe("with git installed", function () {
			var isGitRepo;
			var isGitRepoRoot;
			var hasGitRemote;

			function escape (s) {
				return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
			}

			before(function (done) {
				var props = {
					name        : "test-project",
					description : "This is a test project",
					gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
					private     : true
				};

				helpers.mockPrompt(app, props);

				app.options["skip-install"] = true;
				app.options["skip-welcome-message"] = true;

				app.run({}, function () {
					isGitRepo = shell.exec("git status", { silent : true }).code === 0;

					isGitRepoRoot = String(
						shell.exec(
							"git rev-parse --show-toplevel", { silent : true }
						).output
					).match(
						new RegExp(escape(testDirectory))
					) !== null;

					hasGitRemote = shell.exec("git remote -v", { silent : true }).output.match(
						new RegExp(escape(app.project.repository.url))
					) !== null;

					done();
				});
			});

			it("initializes a git repo if it doesn't already exist", function () {
				expect(isGitRepo).to.equal(true);
			});

			it("is a git repo root", function () {
				expect(isGitRepoRoot).to.equal(true);
			});

			it("adds the git repo as a remote if not already present", function () {
				expect(hasGitRemote).to.equal(true);
			});
		});

		describe("without git installed", function () {
			var errorStub;
			var whichStub;
			var exitStub;

			before(function (done) {
				var props = {
					name        : "test-project",
					description : "This is a test project",
					gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
					private     : true
				};

				helpers.mockPrompt(app, props);

				app.options["skip-install"] = true;
				app.options["skip-welcome-message"] = true;

				whichStub = sinon.stub(shell, "which").returns(null);
				exitStub = sinon.stub(shell, "exit");
				errorStub = sinon.stub(app.log, "error");

				app.run({}, done);
			});

			after(function () {
				whichStub.restore();
				errorStub.restore();
				exitStub.restore();
			});

			it("fails fatally", function () {
				expect(errorStub.calledWith("Git must be installed to use this generator!")).to.equal(true);
			});
		});

		describe("validation", function () {
			it("fails for an invalid git repo url", function () {
				expect(app.validators.validateGitRepo("this-is-definitely-not-valid")).to.equal(false);
			});
		});
	});

	describe("package creation", function () {
		it("adds the correct properties to package.json", function (done) {
			var props = {
				name        : "test-project",
				description : "This is a test project",
				gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
				private     : true
			};

			helpers.mockPrompt(app, props);

			app.options["skip-install"] = true;
			app.options["skip-welcome-message"] = true;

			app.run({}, function () {
				var pkg = require(path.join(testDirectory, "package.json"));

				expect(pkg.name).to.equal(props.name);
				expect(pkg.description).to.equal(props.description);
				expect(pkg.repository.url).to.equal(props.gitRepoUrl);
				expect(pkg.repository.type).to.equal("git");
				expect(pkg.private).to.equal(true);
				expect(pkg.scripts.test).to.equal("grunt");

				done();
			});
		});

		it("slugifies the name of the project in package.json", function (done) {
			var props = {
				name        : "test-project",
				description : "This is a test project",
				gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
				private     : true
			};

			helpers.mockPrompt(app, props);

			app.options["skip-install"] = true;
			app.options["skip-welcome-message"] = true;

			app.run({}, function () {
				var pkg = require(path.join(testDirectory, "package.json"));

				expect(pkg.name).to.equal(props.name);

				done();
			});
		});
	});

	describe("package installation", function () {
		var installStub;

		before(function (done) {
			var props = {
				name        : "test-project",
				description : "This is a test project",
				gitRepoUrl  : "git@github.com:inetCatapult/test-project.git",
				private     : true
			};

			helpers.mockPrompt(app, props);

			app.options["skip-install"] = false;
			app.options["skip-welcome-message"] = true;

			installStub = sinon.stub(app, "npmInstall").callsArg(2);

			app.run({}, done);
		});

		after(function () {
			installStub.restore();
		});

		it("installs the right dependencies", function () {
			expect(installStub.callCount).to.equal(2);
			expect(installStub.firstCall.calledWith(app.dependencies)).to.equal(true);
			expect(installStub.secondCall.calledWith(app.devDependencies)).to.equal(true);
		});
	});
});
