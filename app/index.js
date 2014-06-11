"use strict";

var yeoman = require("yeoman-generator");
var incSay = require("incubator-say");
var util   = require("util");
var path   = require("path");

var IncubatorGenerator = module.exports = function IncubatorGenerator () {
	yeoman.generators.Base.apply(this, arguments);

	this.argument("appname", { type : String, required : false });
	this.appname = this.appname || path.basename(process.cwd());
	this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

	this.option("skip-welcome-message", {
		desc : "Do not print out the welcome message.",
		type : Boolean
	});

	this.option("skip-core", {
		desc : "Skip core installation.",
		type : Boolean
	});
};

util.inherits(IncubatorGenerator, yeoman.generators.Base);

IncubatorGenerator.prototype.greeting = function () {
	if (!this.options["skip-welcome-message"]) {
		this.log(incSay("Welcome to the Incubator Generator!"));
		this.log("By default I will create a Gruntfile and all dotfiles required to work");
		this.log("with the Bandwidth Incubator build pipeline.");
		this.log();
	}
};

IncubatorGenerator.prototype.components = function () {
	if (!this.options["skip-core"]) {
		this.invoke("incubator:core", this.args);
	}
};