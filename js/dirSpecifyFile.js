var path = require("path"),
	fs = require("fs"),
	colors = require("colors");

function readDir(dir, extName){
	var rArr = [];
	var files = fs.readdirSync( dir );
	var patt = new RegExp("^"+extName+"$", "i");

	files.forEach( (file, index) => {
		var bName;
		file = path.join(dir, file);

		if( patt.test(path.extname(file).slice(1)) ){
			bName = path.basename(file);
			rArr.push( {src:"/music/"+bName,name:bName} );
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