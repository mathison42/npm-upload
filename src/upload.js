#!/usr/bin/env node

const program = require('commander');

// Require logic.js file and extract controller functions using JS destructuring assignment
const { streamable } = require('./logic');

program
  .version('0.1.0')
  .description('Upload files to Streamable.');

program
  .command('streamable <username> <password> [file]')
  .alias('s')
  .description('Add streamables under your account.')
  .action((username, password, file) => {
    streamable(username, password, file);
  });


program.parse(process.argv);
