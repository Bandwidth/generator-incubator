	"use strict";

var yeoman  = require("yeoman-generator");
var util    = require("util");
var shell   = require("shelljs");
var yaml    = require("js-yaml");
var path    = require("path");
var q       = require("q");
var fs      = require("fs");
var _       = require("lodash");

var TravisGenerator = module.exports = function TravisGenerator () {
	yeoman.generators.Base.apply(this, arguments);

	if (!shell.which("travis")) {
		this.log.error("The `travis` gem must be installed to use this sub-generator!");
		shell.exit(1);
	}

	this.travis = {};

	this.validators = {
		required : function (input) {
			return !_.isEmpty(input) || "This is a required";
		}
	};
};

util.inherits(TravisGenerator, yeoman.generators.NamedBase);

TravisGenerator.prototype.init = function () {
	this.log("Initializing a .travis.yml ...");
	shell.exec("travis init javascript --no-interactive --skip-version-check", { silent : true });
};

TravisGenerator.prototype.deploy = function () {
	var done = this.async();

	var prompts = [ {
		type    : "checkbox",
		name    : "deploys",
		message : "Do you want Travis to deploy to any providers?",
		choices : [ {
			name    : "registry.npmjs.org",
			value   : "npm",
			checked : false
		} ]
	} ];

	this.prompt(prompts, function (props) {
		this.travis.deploys = props.deploys;

		done();
	}.bind(this));
};

TravisGenerator.prototype.npmDeploy = function () {
	if (!_.contains(this.travis.deploys, "npm")) {
		return;
	}

	var done = this.async();

	var prompts = [ {
		type     : "input",
		name     : "emailAddress",
		message  : "What is the email address to use for deploying to registry.npmjs.org?",
		validate : this.validators.required
	}, {
		type     : "input",
		name     : "apiKey",
		message  : "What is the api key to use for deploying to registry.npmjs.org",
		validate : this.validators.required
	} ];

	this.prompt(prompts, function (props) {
		var encryptedApiKey = shell.exec(
			"travis encrypt --no-interactive " + props.apiKey,
			{ silent : true }
		).output.match(/"(.*)"/).pop();

		q.ninvoke(fs, "readFile", path.join(process.cwd(), ".travis.yml"))
		.then(function (data) {
			var config = yaml.safeLoad(data);
			var oldDeployConfig = _.clone(config.deploy);

			config.deploy = [];

			config.deploy.push({
				provider : "npm",
				email    : props.emailAddress,
				api_key  : {
					secure : encryptedApiKey
				}
			});

			if (!_.isEmpty(oldDeployConfig)) {
				config.deploy.push(oldDeployConfig);

				if (_.isArray(oldDeployConfig)) {
					config.deploy = _.flatten(config.deploy);
				}
			}

			return config;
		})
		.then(function (config) {
			return q.ninvoke(fs, "writeFile", path.join(process.cwd(), ".travis.yml"), yaml.safeDump(config));
		})
		.catch(function () {
			this.log.error("There was an error adding npm to the travis deploy list.");
			shell.exit(1);
		})
		.nodeify(done);
	}.bind(this));
};