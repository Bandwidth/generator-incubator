"use strict";

var yeoman = require("yeoman-generator");
var util   = require("util");
var q      = require("q");

var CoreGenerator = module.exports = function CoreGenerator () {
	yeoman.generators.Base.apply(this, arguments);

	this.project = {};
	this.npm = {};

	this.dependencies = [
		"lodash",
		"q"
	];

	this.devDependencies = [
		"sinon",
		"chai",
		"grunt",
		"grunt-cli",
		"grunt-contrib-clean",
		"grunt-contrib-watch",
		"grunt-jscs-checker",
		"grunt-contrib-jshint",
		"grunt-mocha-istanbul"
	];

	this.on("end", function () {
		if (this.options["skip-install"]) {
			return;
		}

		this.log("Installing Dependencies...");

		q.allSettled([
			q.ninvoke(this, "npmInstall", this.dependencies, { "--save" : "" }),
			q.ninvoke(this, "npmInstall", this.devDependencies, { "--save-dev" : "" })
		]).nodeify(function () {

		});
	}.bind(this));
};

util.inherits(CoreGenerator, yeoman.generators.NamedBase);

CoreGenerator.prototype.projectInfo = function () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "projectName",
		message : "What is the name of this project?",
		default : this._.slugify(this.appname)
	}, {
		type    : "input",
		name    : "projectDescription",
		message : "Please provide a brief description of this project :"
	} ];

	this.prompt(prompts, function (props) {
		this.project.description = props.projectDescription;
		this.project.name        = props.projectName;

		done();
	}.bind(this));
};

CoreGenerator.prototype.git = function () {
	var done = this.async();

	var prompts = [ {
		type     : "input",
		name     : "gitRepoUrl",
		message  : "What is the URL of the Git repo for this project?",
		validate : function (input) {
			return input.match(
				/(?:git|ssh|https?|git@[\w\.]+):(?:\/\/)?[\w\.@:\/\-~]+\.git\/?/
			) !== null;
		}
	} ];

	this.prompt(prompts, function (props) {
		this.project.gitRepoUrl = props.gitRepoUrl;

		done();
	}.bind(this));
};

CoreGenerator.prototype.npm = function () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "npmRegistry",
		message : "What is URL of the NPM registry you want to use?",
		default : "https://npm.bwrnd.com"
	} ];

	this.prompt(prompts, function (props) {
		this.npm.registry = props.npmRegistry;

		done();
	}.bind(this));
};

CoreGenerator.prototype.directories = function () {
	this.mkdir("lib");
	this.mkdir("test");
	this.mkdir("coverage");
};

CoreGenerator.prototype.files = function () {
	this.copy("gitignore", ".gitignore");
	this.copy("gitattributes", ".gitattributes");
	this.copy("jshint.json", ".jshint.json");
	this.copy("test/jshint.json", "test/.jshint.json");
	this.copy("jscsrc", ".jscsrc");

	this.template("_package.json", "package.json");
	this.template("_Gruntfile.js", "Gruntfile.js");
};