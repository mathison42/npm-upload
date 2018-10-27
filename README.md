## Upload Videos NPM Package

Simple npm package to upload video files to Streamable.

### Quick Overview
```
Usage: upload [options] [command]

Upload files to Streamable.

Options:
  -V, --version                              output the version number
  -h, --help                                 output usage information

Commands:
  streamable|s <username> <password> [file]  Add Streamable videos under your account.
```

### Install

  1. Install [Node.Js and npm](https://nodejs.org/en/). (It's a single installation.)
  2. Confirm they are install correctly by running `node -v` and `npm -v`
    - You should see something like:
      ```
      $ node -v
      v8.12.0
      $ npm -v
      6.4.1
      ```
  3. Download the [full npm-upload source zip](https://github.com/mathison42/npm-upload/archive/master.zip) from this GitHub repository.
  4. Extract it and place the contents somewhere safe.
  5. Navigate to the newly extracted folder and run `npm install`.
    - This will generate a large directory called `node_modules` containing various dependencies.
  6. (Optional) While you are here, also run: `npm link`
    - This will allow you to call the command from anywhere and not just in this folder.

### Usage

There are two ways to run the npm-upload package.

  1. From the extracted package, run:

    npm upload streamable <username> <password> [folder/file]

  2. If the optional 6th step was followed, open up a new terminal and from anywhere run:

    upload streamable <username> <password> [folder/file]

  Note: The `username` and `password` arguments are required. The `folder/file` argument can  be left blank to run against the local directory.
