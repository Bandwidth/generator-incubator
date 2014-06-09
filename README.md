# generator-incubator [![Build Status](https://magnum.travis-ci.com/inetCatapult/generator-incubator.svg?token=PbDurkvGqqM4EqWpSZ3B)](https://magnum.travis-ci.com/inetCatapult/generator-incubator)

## Getting Started

### What is this project for?

The Bandwidth Incubator needed a way to reduce time spent setting up projects.
To do this we decided to use [Yeoman](yeoman.io). It is recommended to read their
documentation before using this tool, to be familiar with it.

This generator will set up a project with all the configuration necessary to work
out of the box with the BW Incubator build pipeline.

### Prerequisites

We use TravisCI as our CI/CD system. Due to perceived availability issues with
the public NPM registry causing our builds to fail, we decided to use a private
registry that we host. As a consequence it is required to have the `travis` Ruby
gem installed before this generator can be used.

### Steps

1) Install the generator `sudo npm install -g generator-incubator`
2) `mkdir ~/Projects/project-name`
3) `cd ~/Projects/project-name`
4) `yo incubator`
5) Answer the questions
    - What is the name of this project?
        - used in package.json
    - Please provide a brief description of this project :
        - used in package.json
    - What is the URL of the Git repo for this project?
        - used in package.json
    - What is URL of the NPM registry you want to use?
        - used in package.json
    - What is your username for this repo?
        - used in .travis.yml
    - What is your password for this repo?
        - used in .travis.yml
        - this is encrypted using `travis encrypt` before being placed in .travis.yml
    - What is your email address for signing into this repo?
        - used in .travis.yml


## License

MIT
