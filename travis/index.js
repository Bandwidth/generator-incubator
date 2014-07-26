	"use strict";

var yeoman  = require("yeoman-generator");
var util    = require("util");
var shelljs = require("shelljs");

var TravisGenerator = module.exports = function TravisGenerator () {
	yeoman.generators.Base.apply(this, arguments);
};

util.inherits(TravisGenerator, yeoman.generators.NamedBase);

TravisGenerator.prototype.init = function () {
	// Run travis init
};

TravisGenerator.prototype.deploy = function () {
	// Prompt the user to see if they want to set up any deploys
	// multiple select
};

TravisGenerator.prototype.npm = function () {
	// if the user selected npm, then ask them to set it up
};

TravisGenerator.prototype.amazonS3 = function () {
	// if the user selected s3, then ask them to set it up
};