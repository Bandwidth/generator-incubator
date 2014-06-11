"use strict";

var yeoman = require("yeoman-generator");
var util   = require("util");

var TravisGenerator = module.exports = function TravisGenerator () {
	yeoman.generators.Base.apply(this, arguments);

	this.travis = {
		node : {
			versions : []
		},
		npm  : {
			registry : {}
		}
	};
};

util.inherits(TravisGenerator, yeoman.generators.NamedBase);

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
		name     : "npmRegistryUsername",
		message  : "What is your username for this NPM registry?",
		validate : function (input) {
			return self._.trim(input).length > 0 || "Username is required";
		}
	}, {
		type     : "password",
		name     : "npmRegistryPassword",
		message  : "What is your password for this NPM registry?",
		validate : function (input) {
			return self._.trim(input).length > 0 || "Password is required";
		}
	}, {
		type     : "input",
		name     : "npmRegistryEmail",
		message  : "What is your email address for this NPM registry?",
		validate : function (input) {
			return self._.trim(input).length > 0 || "Email is required";
		}
	} ];

	this.prompt(prompts, function (props) {
		this.travis.npm.registry.url = props.npmRegistryUrl;
		this.travis.npm.registry.username = props.npmRegistryUsername;
		this.travis.npm.registry.password = props.npmRegistryPassword;
		this.travis.npm.registry.email = props.npmRegistryEmail;

		done();
	}.bind(this));
};

// Create .travis.yml using the `travis` Ruby gem
TravisGenerator.prototype.configFile = function () {

};