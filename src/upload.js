#!/usr/bin/env node

const program = require('commander');

// Require logic.js file and extract controller functions using JS destructuring assignment
const { streamable, streamableLoopInit } = require('./logic');

program
  .version('0.1.0')
  .description('Upload files to Streamable.');

program
  .command('streamable <username> <password> [file]')
  .alias('s')
  .description('Add Streamable videos under your account.')
  .action((username, password, file) => {
    streamable(username, password, file);
  });


program
  .command('streamable-loop <username> <password> [folder]')
  .option('-s, --seconds <value>', ' (Optional) Specify a value, in seconds, to loop in the specified directory. Default: 10', parseInt)
  .alias('sl')
  .description('Loop through specified folder and add Streamable videos under your account.')
  .action((username, password, folder, cmd) => {
    streamableLoopInit(username, password, folder, (cmd.seconds ? cmd.seconds : ''));
  });

program.parse(process.argv);
