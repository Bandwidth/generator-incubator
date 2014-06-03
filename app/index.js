"use strict";
var util = require("util");
var path = require("path");
var yeoman = require("yeoman-generator");
var yosay = require("yosay");
var chalk = require("chalk");


var IncubatorGenerator = yeoman.generators.Base.extend({
  // Your initialization methods (checking current project state, getting configs, etc)
  initializing: function () {
    this.log(yosay("Welcome to the Incubator Generator!"));
    this.log("By default I will create a Gruntfile and all dotfiles required to work");
    this.log("with the Bandwidth Incubator build pipeline.");
    this.log();

    this.pkg = require("../package.json");
  },

  // Where you prompt users for options (where you'd call this.prompt())
  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: "input",
      name: "projectName",
      message: "What is the name of this project?",
      default: function () {
        return process.cwd().split(path.sep).pop();
      }
    }, {
      type: "input",
      name: "projectDescription",
      message: "Please provide a brief description of this project:"
    }, {
      type: "input",
      name: "projectGitRepoUrl",
      message: "What is the URL of the Git repo for this project?"
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectDescription = props.projectDescription;
      this.projectGitRepoUrl = props.projectGitRepoUrl;

      done();
    }.bind(this));
  },

  // Saving configurations and configure the project
  // (creating .editorconfig files and other metadata files)
  configuring: function () {
    this.mkdir("lib");
    this.mkdir("test");

    this.copy("editorconfig", ".editorconfig");
    this.copy("gitignore", ".gitignore");
    this.copy("jshint.json", ".jshint.json");
    this.copy("jscs.json", ".jscs.json");
    this.copy("travis.yml", ".travis.yml");

    this.template("_package.json", "package.json");
    this.template("_Gruntfile.js", "Gruntfile.js");
  },

  // Default priority
  default: function () {

  },

  // Where you write the generator specific files (routes, controllers, etc)
  writing: function () {

  },

  // Where conflicts are handled (used internally)
  conflicts: function () {

  },

  // Where installation are run (npm, bower)
  install: function () {
    if (!this.options["skip-install"]) {
      this.installDependencies();
    }
  },

  // Called last, cleanup, say good bye, etc
  end: function () {
    this.log("The project has been created. Always a pleasure to be of service!");
  }
});

module.exports = IncubatorGenerator;
