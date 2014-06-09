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

		var self = this;

		function installDependencies (deps, args) {
			var deferred = q.defer();

			self.npmInstall(deps, args, function () {
				deferred.resolve();
			});

			return deferred.promise;
		}

		this.log("Installing Dependencies...");

		q.allSettled([
			installDependencies(this.dependencies, { "--save" : "" }),
			installDependencies(this.devDependencies, { "--save-dev" : "" })
		]).nodeify(function () {

		});
	}.bind(this));
};

util.inherits(CoreGenerator, yeoman.generators.NamedBase);

CoreGenerator.prototype.projectInfo = function projectInfo () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "projectName",
		message : "What is the name of this project?",
		default : this.appname
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

CoreGenerator.prototype.git = function promptForInfo () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "gitRepoUrl",
		message : "What is the URL of the Git repo for this project?"
	} ];

	this.prompt(prompts, function (props) {
		this.project.gitRepoUrl = props.projectGitRepoUrl;

		done();
	}.bind(this));
};

CoreGenerator.prototype.npm = function promptForInfo () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "npmRegistry",
		message : "What is URL of the NPM registry you want to use?",
		default : "https://npm.bwrnd.com"
	} ];

	this.prompt(prompts, function (props) {
		this.npm.registry       = props.npmRegistry;

		done();
	}.bind(this));
};

CoreGenerator.prototype.directories = function directories () {
	this.mkdir("lib");
	this.mkdir("test");
	this.mkdir("coverage");
};

CoreGenerator.prototype.files = function files () {
	this.copy("gitignore", ".gitignore");
	this.copy("gitattributes", ".gitattributes");
	this.copy("jshint.json", ".jshint.json");
	this.copy("test/jshint.json", "test/.jshint.json");
	this.copy("jscsrc", ".jscsrc");

	this.template("_package.json", "package.json");
	this.template("_Gruntfile.js", "Gruntfile.js");
};