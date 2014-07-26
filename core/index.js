"use strict";

var yeoman  = require("yeoman-generator");
var util    = require("util");
var q       = require("q");
var shell   = require("shelljs");

var CoreGenerator = module.exports = function CoreGenerator () {
	yeoman.generators.Base.apply(this, arguments);

	this.project = {};

	this.validators = {
		validateGitRepo : function (input) {
			return input.match(
				/(?:git|ssh|https?|git@[\w\.]+):(?:\/\/)?[\w\.@:\/\-~]+\.git\/?/
			) !== null;
		}
	};

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
		"grunt-jscs",
		"grunt-contrib-jshint",
		"grunt-mocha-istanbul"
	];
};

util.inherits(CoreGenerator, yeoman.generators.NamedBase);

CoreGenerator.prototype.projectInfo = function () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "name",
		message : "What is the name of this project?",
		default : this._.slugify(this.appname)
	}, {
		type    : "input",
		name    : "description",
		message : "Please provide a brief description of this project :",
		default : "An awesome Incubation project."
	} ];

	this.prompt(prompts, function (props) {
		this.project.description = props.description;
		this.project.name        = props.name;

		done();
	}.bind(this));
};

CoreGenerator.prototype.git = function () {
	var done = this.async();

	var prompts = [ {
		type     : "input",
		name     : "gitRepoUrl",
		message  : "What is the URL of the Git repo for this project?",
		validate : this.validators.validateGitRepo
	} ];

	if (!shell.which("git")) {
		this.log.error("Git must be installed to use this generator!");
		shell.exit(1);
	}

	function escape (s) {
		return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	}

	this.prompt(prompts, function (props) {
		this.project.repository = {
			type : "git",
			url  : props.gitRepoUrl
		};

		var gitRepo = shell.exec("git status", { silent : true }).code === 0;

		var gitRepoRoot = String(
			shell.exec(
				"git rev-parse --show-toplevel", { silent : true }
			).output
		).match(
			new RegExp(escape(this.destinationRoot()))
		) !== null;

		if (!gitRepo || !gitRepoRoot) {
			shell.exec("git init", { silent : true });
		}

		// If this Git repo doesn't have a remote matching the
		// Git url in the config then add it
		var needsRemote = shell.exec("git remote -v", { silent : true }).output.match(
			new RegExp(escape(this.project.repository.url))
		) === null;

		if (needsRemote) {
			shell.exec("git remote add origin " + this.project.repository.url, { silent : true });
		}

		done();
	}.bind(this));
};

CoreGenerator.prototype.npm = function () {
	var done = this.async();

	var prompts = [ {
		type    : "input",
		name    : "private",
		message : "Should the NPM package be private?",
		default : false
	} ];

	this.prompt(prompts, function (props) {
		this.project.private = props.private;

		done();
	}.bind(this));
};

CoreGenerator.prototype.package = function () {
	this.project.scripts = {
		test : "grunt"
	};

	this.dest.write("package.json", JSON.stringify(this._.pick(this.project, [
		"name", "description", "private", "repository", "scripts"
	])));
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

	this.template("_Gruntfile.js", "Gruntfile.js");
};

CoreGenerator.prototype.dependencies = function () {
	if (this.options["skip-install"]) {
		return;
	}

	var done = this.async();

	this.log("Installing Dependencies...");

	q.allSettled([
		q.ninvoke(this, "npmInstall", this.dependencies, { "--save" : "" }),
		q.ninvoke(this, "npmInstall", this.devDependencies, { "--save-dev" : "" })
	]).nodeify(done);
};