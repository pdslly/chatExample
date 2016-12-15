var log = require("log4js"),
	fs = require("fs"),
	path = require('path');

var file = fs.readFileSync("./resource/log4js-configure.json");
var conf = JSON.parse(file), 
	i = 0, appenders = conf["appenders"];

if( {}.toString.call(appenders) != "[object Array]" ) throw new Error("log4js configure error!");

function checkedAndMkdir(dir){
	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
}

function isAbsoluteDir(dir){
	if(process.platform === "win32"){
		return path.isAbsolute(dir) && dir.charAt(1) === ":";
	}
}

for(; i < appenders.length; i++){
	if(appenders[i].absolute && isAbsoluteDir(appenders[i].filename)){
		checkedAndMkdir(appenders[i].filename);
	}else{
		console.log("asd");
	}
}

log.configure(conf);
var logInfo = log.getLogger("logInfo");
var logError = log.getLogger("logError");



module.exports = {
	writeInfo(msg){
		msg = msg || "";
		logInfo.info(msg);
	},
	writeErr(err){
		err = err || "";
		logError.error(err);
	}
};
