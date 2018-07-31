#!/usr/bin/env node

const program = require('commander');

// Require logic.js file and extract controller functions using JS dest
const { getUI } = require('./logic');

program
  .version('0.0.1')
  .description('Shows Steam data for a specific user.');

program
  .command('ui') // Command arguments
  .alias('u') // Alias for command argument
  .description('Show user info in a nice UI.')
  .action( () => 
  	getUI()
  	);

program.parse(process.argv)