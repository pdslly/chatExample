"use strict";
var http = require("http"),
	mime = require("./resource/MIME.js"),
	config = require("./config.js"),
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	ejs = require("ejs"),
	log4js = require("./js/log4js.js"),
	queryString = require("querystring"),
	colors = require('colors');

const musicDir = path.join(__dirname, "music");
const musics = require("./js/dirSpecifyFile")(musicDir, "mp3|ogg|wav");

http.createServer(function(req, res){
	
	const pathname = url.parse(req.url).pathname.replace(/\.\./g, "");
	const securePath = path.normalize(pathname);
	const realpath = queryString.unescape(path.join(__dirname, securePath));
	
	var query = queryString.parse(url.parse(req.url).query);
	if(!query.name) query.name = "李向阳";

	if(String(securePath).slice(0, -2) !== ""){
		fs.exists(realpath, function(exist){
			var ext = path.extname(pathname), type, tmp, ref;
			ext = ext?ext.slice(1):"unknow";
			type = mime[ext] || "text/plain";

			if(!exist){
				res.writeHead(302, {
					"Location": "ejs/Christmas.html?name=%E6%9D%8E%E5%90%91%E9%98%B3"
				});
				res.end();
			}else{
				res.writeHead(200, {
					"content-type": type,
				});
				if(ext === "html"){
					log4js.writeInfo("query name:"+query.name);
					tmp = fs.readFileSync(realpath, "utf-8");
					ref = ejs.render(tmp, {
						name: query.name,
						musics: JSON.stringify(musics),
					});
					res.end(ref);	
				}else{
					fs.readFile(realpath, function(err, file){
						res.write(file, "binary");
						res.end();					
					});
				}
			}
		});
	}else{
		res.writeHead(302, {
			"Location": "ejs/Christmas.html?name=%E6%9D%8E%E5%90%91%E9%98%B3"
		});
		res.end();
	}

}).listen(8080, "0.0.0.0");

//http://localhost:8080/ejs/Christmas.html?name=%E6%9D%8E%E5%90%91%E9%98%B3