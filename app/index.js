var path   = require("path");
var yeoman = require("yeoman-generator");
var yosay  = require("yosay");
var q      = require("q");

var IncubatorGenerator = yeoman.generators.Base.extend({
	// Your initialization methods (checking current project state, getting configs, etc)
	initializing : function () {
		this.log(yosay("Welcome to the Incubator Generator!"));
		this.log("By default I will create a Gruntfile and all dotfiles required to work");
		this.log("with the Bandwidth Incubator build pipeline.");
		this.log();

		this.pkg = require("../package.json");
	},

	// Where you prompt users for options (where you'd call this.prompt())
	prompting : function () {
		var done = this.async();

		var prompts = [ {
			type    : "input",
			name    : "projectName",
			message : "What is the name of this project?",
			default : function () {
				return path.basename(process.cwd());
			}
		}, {
			type    : "input",
			name    : "projectDescription",
			message : "Please provide a brief description of this project :"
		}, {
			type    : "input",
			name    : "projectGitRepoUrl",
			message : "What is the URL of the Git repo for this project?"
		} ];

		this.prompt(prompts, function (props) {
			this.projectName = props.projectName;
			this.projectDescription = props.projectDescription;
			this.projectGitRepoUrl = props.projectGitRepoUrl;

			done();
		}.bind(this));
	},

	// Saving configurations and configure the project
	// (creating .editorconfig files and other metadata files)
	configuring : function () {
		this.mkdir("lib");
		this.mkdir("test");
		this.mkdir("coverage");

		this.copy("gitignore", ".gitignore");
		this.copy("gitattributes", ".gitattributes");
		this.copy("jshint.json", ".jshint.json");
		this.copy("test/jshint.json", "test/.jshint.json");
		this.copy("jscsrc", ".jscsrc");
		this.copy("travis.yml", ".travis.yml");

		this.template("_package.json", "package.json");
		this.template("_Gruntfile.js", "Gruntfile.js");
	},

	// Where installation are run (npm, bower)
	install : function () {
		if (this.options["skip-install"]) {
			return;
		}

		var done = this.async();
		var self = this;

		var dependencies = [
			"lodash",
			"q"
		];

		var devDependencies = [
			"mocha",
			"istanbul",
			"sinon",
			"grunt",
			"grunt-cli",
			"grunt-contrib-jshint",
			"grunt-contrib-clean",
			"grunt-jscs-checker",
			"grunt-mocha-test",
			"grunt-istanbul-coverage"
		];

		function installDependencies (deps, args) {
			var deferred = q.defer();

			self.npmInstall(deps, args, function () {
				deferred.resolve();
			});

			return deferred.promise;
		}

		this.log("Installing Dependencies...");

		q.allSettled([
			installDependencies(dependencies, { "--save" : "" }),
			installDependencies(devDependencies, { "--save-dev" : "" })
		]).nodeify(done);
	},

	// Called last, cleanup, say good bye, etc
	end : function () {
		this.log("The project has been created. Always a pleasure to be of service!");
	}
});

module.exports = IncubatorGenerator;
