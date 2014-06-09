var helpers = require("yeoman-generator").test;
var assert  = require("assert");
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
				"../../app",
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

	it("outputs a greeting to stdout", function (done) {
		app.options["skip-install"] = true;
		app.options["skip-welcome-message"] = false;

		app.run({}, function () {
			done();
		});
	});
});
