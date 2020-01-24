'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const utils = module.exports;
module.exports.file = {};
//module.exports.file
function write_file_log(text){
    //console.log(text);
    if(utils.file.logFile) {
        let tl = utils.DateToShotXMLString(new Date());
        fs.appendFileSync(utils.file.logFile, `${tl}\t${text}\n`);
    }
};


module.exports.init = function (writeFileLog) {
    if(!utils.file.hasOwnProperty("logFile"))
        if(writeFileLog !== false){
            const processFile = path.parse(process.mainModule.filename);
            const logDir = `${processFile.dir}/logs`;
            if (!fs.existsSync(logDir))
                fs.mkdirSync(logDir);
            utils.file.logFile = `${logDir}/${processFile.name}.log`;
        }else
            utils.file.logFile = undefined;


    return module.exports;
};

initExitHandler();



console._log = console.log;
console.log = function (arg) {
    if(arg instanceof Error)
        console.error(arg);
    else
        console._log(`\x1b[2K${arg}\x1b[0m`);
};
console._error = console.error;
console.error = function (arg) {
    if(arg instanceof Error)
        arg = arg.stack;
    console._log(`\x1b[2K\x1b[91m${arg}\x1b[0m`);
    write_file_log(arg);
};
console._info = console.info;
console.info = function (arg) {
    console._log(`\x1b[2K\x1b[94m${arg}\x1b[0m`);
    write_file_log(arg);
};
console._warn = console.warn;
console.warn = function (arg) {
    console._log(`\x1b[2K\x1b[93m${arg}\x1b[0m`);
    write_file_log(arg);
};
console.state = function (arg) {
    console._log(`\x1b[2K\x1b[92m${arg}\x1b[1A\x1b[0m`)
}



function byte(x){
    return x < 0 ? x + 256 : x;
}
module.exports.byte = byte;


module.exports.DateFromShotXMLString = function (ds){
    return new Date(ds.substr(0, 4), Number(ds.substr(4, 2)) - 1, ds.substr(6, 2), ds.substr(9, 2), ds.substr(11, 2), ds.substr(13, 2));
};
module.exports.DateToShotXMLString = function (d){
    return ('number' == typeof d ? new Date(d) : d).toFormatString('yyyymmddThhiiss');
};


Number.prototype.toHex = function(len){
    let res = Number(this).toString(16);
    return String('00000000' + res).slice(-Math.max(len || 0, Math.ceil(res.length / 2) * 2));
};
Number.prototype.toBin = function(len){
    return String('0000000000000000' + Number(this).toString(2)).slice(-len);
};


Array.prototype.toBin = function() {
    let res = '';
    this.forEach(function (entry) {
        res += Number(byte(entry)).toBin(8) + ' ';
    });

    return res;
};

Array.prototype.toHex = function() {
    let res = '';
    this.forEach(function (entry) {
        res += Number(byte(entry)).toHex() + ' ';
    });

    return res;
};

Date.prototype.toFormatString = function(format, utc) {
    if(format === undefined)
        return this.toString();
    else if(utc){
        let yyyy = this.getUTCFullYear().toString();
        format = format.replace(/yyyy/g, yyyy);
        let mm = (this.getUTCMonth() + 1).toString();
        format = format.replace(/mm/g, (mm[1] ? mm : "0" + mm[0]));
        let dd = this.getUTCDate().toString();
        format = format.replace(/dd/g, (dd[1] ? dd : "0" + dd[0]));
        let hh = this.getUTCHours().toString();
        format = format.replace(/hh/g, (hh[1] ? hh : "0" + hh[0]));
        let ii = this.getUTCMinutes().toString();
        format = format.replace(/ii/g, (ii[1] ? ii : "0" + ii[0]));
        let ss = this.getSeconds().toString();
        format = format.replace(/ss/g, (ss[1] ? ss : "0" + ss[0]));

    }else {
        let yyyy = this.getFullYear().toString();
        format = format.replace(/yyyy/g, yyyy);
        let mm = (this.getMonth() + 1).toString();
        format = format.replace(/mm/g, (mm[1] ? mm : "0" + mm[0]));
        let dd = this.getDate().toString();
        format = format.replace(/dd/g, (dd[1] ? dd : "0" + dd[0]));
        let hh = this.getHours().toString();
        format = format.replace(/hh/g, (hh[1] ? hh : "0" + hh[0]));
        let ii = this.getMinutes().toString();
        format = format.replace(/ii/g, (ii[1] ? ii : "0" + ii[0]));
        let ss = this.getSeconds().toString();
        format = format.replace(/ss/g, (ss[1] ? ss : "0" + ss[0]));
    }
    return format;
};

String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

String.prototype.toKebab = function(){
    return this
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
        .toLowerCase();
};

String.prototype.toCamel = function(){
    return this.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); })
};

function initExitHandler(exitHandler) {
//do something when app is closing
    process.on('exit', (code) => {
        console.info(`Done. Exit code: ${code}`);
    });

//catches ctrl+c event
    process.on('SIGINT', (signal)=>{
        console.info(`Receive SIGINT (ctrl+c)`);
        process.exit(0);
    });

// catches "kill pid" (for example: nodemon restart)
//    process.on('SIGUSR1', exitHandler.bind(null, {event:'SIGUSR1', exit: true}));
//    process.on('SIGUSR2', exitHandler.bind(null, {event:'SIGUSR2', exit: true}));

    process.on('unhandledRejection', (reason, p) => {
        console.info(reason);
        process.exit(2);
    });
    process.on('uncaughtException', err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports.spawnAnything = function (apps, cb, opt) {
    for(let key in apps){
        let child = child_process.spawn(key, apps[key], opt);
        child.on('error', (err) => {
            console.log(`Failed to start child process '${child.spawnargs.join(' ')}' (${err.message})`);
        });
        if(child.pid){
            child._stdout = '';
            child.stdout.on('data', (data) => {
                child._stdout += (data ? new Buffer(data,'utf-8') : '').toString();
            });
            child._stderr = '';
            child.stderr.on('data', (data) => {
                child._stderr += (data ? new Buffer(data,'utf-8') : '').toString();
            });

            child.on('close', (code) => {
                cb(child, child._stdout, child._stderr);
            });
            return child;
        }
    }
};

