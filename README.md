generator-incubator [![Build Status](https://travis-ci.org/inetCatapult/generator-incubator.svg?branch=0.0.5)](https://travis-ci.org/inetCatapult/generator-incubator)
=========

[![Dependencies Status](https://david-dm.org/inetCatapult/generator-incubator.png)](https://david-dm.org/inetCatapult/generator-incubator)
[![DevDependencies Status](https://david-dm.org/inetCatapult/generator-incubator/dev-status.png)](https://david-dm.org/inetCatapult/generator-incubator#info=devDependencies)
[![PeerDependencies Status](https://david-dm.org/inetCatapult/generator-incubator/peer-status.png)](https://david-dm.org/inetCatapult/generator-incubator#info=peerDependencies)

## Getting Started

### What is this project for?

The Bandwidth Incubator team needed a way to reduce time spent setting up projects.
To do this we decided to use [Yeoman](yeoman.io). It is recommended to read their
documentation before using this tool, to be familiar with it.

This generator will set up a project with all the configuration necessary to work
out of the box with the BW Incubator build pipeline.

### Usage

1. Install the generator `sudo npm install -g generator-incubator`
2. `mkdir ~/Projects/project-name`
3. `cd ~/Projects/project-name`
4. `yo incubator`
5. Answer the questions
    - What is the name of this project?
        - used in package.json
    - Please provide a brief description of this project :
        - used in package.json
    - What is the URL of the Git repo for this project?
        - used in package.json
    - What is URL of the NPM registry you want to use?
        - used in package.json


### Sub-Generators
The incubator generator makes use of sub-generators for different project capabilities.
The main generator will invoke the default sub-generators, but you can always run
just a specific sub-generator in a directory. For example, you might only want to have
a .travis.yml file created, but nothing else. A sub-generator like this could be invoked
with the following command: `yo incubator:travis`

## License

MIT
