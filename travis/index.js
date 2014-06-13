"use strict";

var yeoman  = require("yeoman-generator");
var util    = require("util");
var shelljs = require("shelljs");

var TravisGenerator = module.exports = function TravisGenerator () {
	yeoman.generators.Base.apply(this, arguments);

	this.travis = {
		node : {
			versions : []
		},

		npm : {
			registry : {}
		}
	};
};

util.inherits(TravisGenerator, yeoman.generators.NamedBase);

TravisGenerator.prototype.prerequisites = function () {
	// Check that this is a Git repo
	var gitRemoteCode = shelljs.exec("git remote -v", { silent : true }).code;

	if (gitRemoteCode !== 0) {
		this.log.error("This generator must be run in a directory that is a Git repo set up with TravisCI.");
		shelljs.exit(1);
	}

	// Check that the travis gem is installed
	if (!shelljs.which("travis")) {
		this.log.error("This generator requires the Travis gem to be installed.");
		shelljs.exit(1);
	}
};

TravisGenerator.prototype.nodeVersions = function () {
	var done = this.async();

	var prompts = [ {
		type     : "checkbox",
		name     : "nodeVersions",
		message  : "What versions of Node does this project need to be tested against?",
		validate : function (input) {
			return input.length > 0 || "You must pick at lease one NodeJS version";
		},
		choices  : [ {
			name    : "0.10",
			value   : "0.10",
			checked : true
		}, {
			name    : "0.11",
			value   : "0.11",
			checked : true
		} ]
	} ];

	this.prompt(prompts, function (props) {
		this.travis.node.versions = props.nodeVersions;

		done();
	}.bind(this));
};

TravisGenerator.prototype.registry = function () {
	var done = this.async();
	var self = this;

	// Check to see if the user already has a value in the package.json publishConfig.registry
	try {
		var pkg = this.dest.readJSON("package.json");
	}
	catch (ex) {

	}

	var prompts = [ {
		type    : "input",
		name    : "npmRegistryUrl",
		message : "What NPM registry should Travis use when running a build?",
		default : function () {
			// Use what is set in the publishConfig.registry
			// property of package.json if it exists
			if (pkg && pkg.publishConfig && pkg.publishConfig.registry) {
				return pkg.publishConfig.registry;
			}
			else {
				return "https://registry.npmjs.org";
			}
		}
	}, {
		type     : "input",
		name     : "npmRegistryApiToken",
		message  : "What is your API token for this NPM registry?",
		validate : function (input) {
			return self._.trim(input).length > 0 || "Api token is required";
		}
	}, {
		type     : "input",
		name     : "npmRegistryEmail",
		message  : "What is your email address for this NPM registry?",
		default  : "incubator@bandwidth.com",
		validate : function (input) {
			return self._.trim(input).length > 0 || "Email is required";
		}
	} ];

	this.prompt(prompts, function (props) {
		this.travis.npm.registry.url = props.npmRegistryUrl;
		this.travis.npm.registry.apiToken = props.npmRegistryApiToken;
		this.travis.npm.registry.email = props.npmRegistryEmail;

		done();
	}.bind(this));
};

TravisGenerator.prototype.initTravis = function () {
	this.travis.npm.registry.encryptedApiKey = shelljs.exec(
		"travis encrypt NPM_API_TOKEN=" + this.travis.npm.registry.apiToken,
		{ silent : false }
	).output;

	this.log(this.travis.npm.registry.encryptedApiKey);

	// Create .travis.yml with all but encrypted environment variables
	this.template("_travis.yml", ".travis.yml");
};