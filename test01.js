var path = require("path"),
	fs = require("fs"),
	colors = require("colors");

function readDir(dir, extName){
	var rArr = [];
	var files = fs.readdirSync( dir );
	files.forEach( (file, index) => {

		file = path.join(dir, file);
		if( path.extname(file).slice(1).toLowerCase() === extName.toLowerCase() ){
			rArr.push( path.basename(file) );
			return;
		}
		fs.stat(file, (err, stat) => {
			if( err ) throw new Error("stat error".red);
			if( stat.isDirectory() ){
				readDir(file, extName);
			}
		});

	});
	return rArr;
}

module.exports = readDir;
