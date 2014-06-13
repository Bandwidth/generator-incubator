var helpers = require("yeoman-generator").test;
var assert  = require("assert");
var path    = require("path");
var shelljs = require("shelljs");
var yaml    = require("js-yaml");
var fs      = require("fs");
var assert  = require("chai").assert;
var sinon   = require("sinon");

describe("incubator travis generator", function () {
	var testDirectory = path.join(__dirname, "temp");
	var testTravisYml = path.join(testDirectory, ".travis.yml");
	var app;

	var props = {
		nodeVersions        : [ "0.10", "0.11" ],
		npmRegistryApiToken : "THIS_IS_NOT_AN_API_TOKEN"
	};

	beforeEach(function (done) {
		sinon.stub(shelljs, "exec")
			.withArgs(
				"travis encrypt NPM_API_TOKEN=" + props.npmRegistryApiToken,
				{ silent : false }
			)
			.returns("\"9SD8F9SD8F9S8DF9SD8F9SD8FJLKSDJFLSKDJF\"")
			.withArgs("git remote -v", { silent : true })
			.returns({ code : 0 });

		sinon.stub(shelljs, "which")
			.withArgs("travis")
			.returns(true);

		helpers.testDirectory(testDirectory, function (err) {
			if (err) {
				return done(err);
			}

			app = helpers.createGenerator("incubator:travis", [
				"../../travis"
			]);

			done();
		});
	});

	afterEach(function (done) {
		shelljs.exec.restore();

		done();
	});

	it("can be imported without blowing up", function (done) {
		var app = require("../travis");
		assert(app !== undefined, "result of a require should not be undefined");

		done();
	});

	it("creates a .travis.yml config file", function (done) {
		helpers.mockPrompt(app, props);

		app.run({}, function () {
			assert(shelljs.test("-f", testTravisYml), "no .travis.yml found");
			done();
		});
	});

	it("creates a .travis.yml config file with proper defaults", function (done) {
		helpers.mockPrompt(app, props);

		app.run({}, function () {
			var travisYml = yaml.safeLoad(fs.readFileSync(testTravisYml, "utf8"));

			var beforeInstall = [
				"echo \"_auth = $NPM_API_TOKEN\" > $HOME/.npmrc",
				"echo \"registry = $NPM_REGISTRY\" >> $HOME/.npmrc",
				"echo \"email = $NPM_EMAIL\" >> $HOME/.npmrc",
				"echo \"always-auth = true\" >> $HOME/.npmrc"
			];

			/* jshint camelcase:false */
			assert.sameMembers(props.nodeVersions, travisYml.node_js, "Invalid node_js versions");
			assert.sameMembers(beforeInstall, travisYml.before_install, "Invalid before_install lifecycle");
			/* jshint camelcase:true */

			done();
		});
	});
});
