import * as process from 'process';

declare var jsonfile: any;
var jsonfile = require('jsonfile');

let cfg_location = process.env['CFG_FILE'] || './config.json';

let config;

config = jsonfile.readFileSync(cfg_location);

export const http_port = config.http_port || 8080;
//export const debug = process.env['DEBUG'] === '1';
export const debug = config.debug;

export const songfiles = config.songfiles || {};

export const email_recipient = config.email_recipient || null;

export const smtp = config.smtp || {};
