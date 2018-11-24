## Upload Videos NPM Package

Simple npm package to upload video files to Streamable.

### Simple Command
```
Usage: upload streamable|s <username> <password> [folder/file]

Upload file(s) to Streamable from specified location.

Options:
  -V, --version                              output the version number
  -h, --help                                 output usage information

Sample Commands:
  upload streamable user pass | Upload files from current working directory.
  upload s user pass | Upload files from current working directory. (Identical to previous command.)
  upload s user pass C:\User\Videos\abc.mp4 | Upload abc.mp4 video.
```


### Advanced Command
```
Usage: upload streamable-loop|sl [--seconds XXX] <username> <password> [folder]

Upload file(s) to Streamable from specified location. Once complete, the program will continue to monitor the directory for new videos.
A file called `streamableRecordFile.txt` will be created in the specified folder and utilized to track which videos have been uploaded.
Delete this file and restart the `upload streamable-loop` command to start fresh.

Options:
  -V, --version                              output the version number
  -h, --help                                 output usage information
  -s, --seconds <value>                      (Optional) Specify a value, in seconds, to loop in the specified directory. Default: 10

Sample Commands:
  upload streamable-loop user pass | Monitor and upload videos from the current directory.
  upload sl user pass C:\User\Videos | Monitor and upload videos from C:\User\Videos.
  upload sl -s 20 user pass C:\User\Videos | Monitor and upload videos from C:\User\Videos every 20 seconds.
```
  Note: `<username>` and `<password>` are the credentials used to authenticate with [Streamable](www.streamable.com). Ignore the `folder/file` arguments to run against the local directory.


### Install

  1. Install [Node.Js and npm](https://nodejs.org/en/). (It's a single installation.)
  2. Confirm they are installed correctly by running `node -v` and `npm -v`
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

    node src/upload.js streamable <username> <password> [folder/file]
    node src/upload.js streamable-loop <username> <password> [folder]

  2. If the optional 6th step was followed, open up a new terminal and, from anywhere, run:

    upload streamable <username> <password> [folder/file]
    upload streamable-loop <username> <password> [folder]
