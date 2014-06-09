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

			app.options["skip-welcome-message"] = true;
			app.options["skip-install"] = true;
			app.options["skip-core"] = true;

			done();
		});
	});

	it("can be imported without blowing up", function (done) {
		var app = require("../app");
		assert(app !== undefined);

		done();
	});
});
