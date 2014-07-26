var helpers = require("yeoman-generator").test;
var expect  = require("chai").expect;
var path    = require("path");
var sinon   = require("sinon");

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

			app.options["skip-welcome-message"] = false;
			app.options["skip-install"] = true;
			app.options["skip-core"] = true;

			done();
		});
	});

	it("can be imported without blowing up", function (done) {
		var app = require("../app");
		expect(app).to.not.be.undefined;

		done();
	});

	describe("greeting message", function () {
		var logStub;

		before(function (done) {
			logStub = sinon.stub(app, "log");

			app.run({}, done);
		});

		after(function () {
			logStub.restore();
		});

		it("is output to the console", function () {
			expect(logStub.called).to.equal(true);
		});
	});

	describe("default component invocation", function () {
		var invokeStub;

		before(function (done) {
			invokeStub = sinon.stub(app, "invoke");

			app.options["skip-welcome-message"] = true;
			app.options["skip-install"] = true;
			app.options["skip-core"] = false;

			app.run({}, done);
		});

		after(function () {
			invokeStub.restore();
		});

		it("runs the core sub-generator", function () {
			expect(invokeStub.calledWith("incubator:core")).to.equal(true);
		});
	});
});
