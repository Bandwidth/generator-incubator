var helpers = require("yeoman-generator").test;
var expect  = require("chai").expect;
var path    = require("path");

describe("incubator travis generator", function () {
	var testDirectory = path.join(__dirname, "temp");
	var app;

	beforeEach(function (done) {
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

	it("can be imported without blowing up", function (done) {
		var app = require("../travis");
		expect(app).to.not.be.undefined;

		done();
	});
});
