;(function(root){

function DBLinked(arr){
	var len = arr.length, res, ARR, first, last;

	function Node(data, next, prev){
		this.data = data;
		this.next = null;
		this.prev = null;
	};

	ARR = arr.map(function(data){
		return new Node(data, null, null);
	});

	first = ARR[0];
	last = ARR[len - 1];

	res = ARR.reduceRight(function(o, val){
			val.prev = o;
			return val;
		});
	last.prev = res;

	res = ARR.reduce(function(o, val){
			val.next = o;
			return val;
		});
	first.next = res;

	return res;
};

function $$(className, context){
	context = context || document;
	return context.getElementsByClassName(className);
};

function Player(layout){
	var base, rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?/;
	const {top = 0, left = 0} = Object(layout);
	this.layout = {top: top, left: left};
	this.curMusic = null;
	this.container = null;
	this.controls = {vol:0, ele:null};
	try{
		a.b.c();
	}catch(e){
		base = e.fileName || e.sourceURL || e.stack || e.stacktrace;
		if(rExtractUri.test(base)){
			base = RegExp.$1;
			this.base = base.slice(0, base.lastIndexOf("\/"));
		}else{
			throw new Error("can not find base");
		}
	}
};

Player.prototype = {
	init(){
		this.container = this.createContainer();
		this.initLayout();
		this.eventListen(this.container);
	},
	initLayout(){
		this.container.style.top = this.layout.top;
		this.container.style.left = this.layout.left;
	},
	eventListen(container){
		var Cprev = $$("prev", container)[0],
			Cstatus = $$("status", container)[0],
			Cnext = $$("next", container)[0],
			Mtime = $$("time", container)[0],
			Mscroll = $$("scroll", container)[0],
			Mprogress = $$("progress", container)[0],
			Maudio = $$("audio", container)[0];
		this.controls.ele = Maudio;
		this.processAndTimeFn(Mtime, Mprogress);
		this.audioFn(Maudio, Mscroll);
		this.nextFn(Cnext, Mscroll);
		this.prevFn(Cprev, Mscroll);
		this.statusFn(Cstatus);
	},
	nextFn(next, scrollE){
		var self = this;
		next.addEventListener("click", function(){
			self.curMusic = self.curMusic.next;
			self.audioReload( self.curMusic.data, scrollE );
		});
	},
	prevFn(prev, scrollE){
		var self = this;
		prev.addEventListener("click", function(){
			self.curMusic = self.curMusic.prev;
			self.audioReload( self.curMusic.data, scrollE );
		});
	},
	audioFn(audio, scrollE){
		var self = this;
		audio.src = self.curMusic.data.src;
		scrollE.textContent = this.curMusic.data.name;
		audio.addEventListener("canplay", function(){
			audio.play();
		});
		audio.addEventListener("ended", function(){
			self.curMusic = self.curMusic.next;
			audio.src = self.curMusic.data.src;
		});
	},
	statusFn(status){
		var audio = this.controls.ele;
		status.addEventListener("click", function(){
			if(audio.paused){
				this.className = "status";
				audio.play();
			}else{
				this.className = "status pause";
				audio.pause();
			}
		});
	},
	processAndTimeFn(time, progress){
		setInterval(this.getProgressPercent.bind(this, time, progress), 500);
	},
	getProgressPercent(time, progress){
		const {currentTime = 0, duration = 100} = this.controls.ele;
		var data = new Date(), 
			t = data.getHours() + ":" + data.getMinutes(),
			p = ~~(currentTime/duration*100+0.5) + "%";

		time.textContent = t;
		progress.style.width = p;
	},
	audioReload(data, ele){
		this.controls.ele.src = data.src;
		ele.textContent = data.name;
	},
	createContainer(){
		var Player = document.createElement("div");
		this.loadCss();
		Player.className = "MPlear";
		Player.innerHTML = this.tmpl();
		document.body.appendChild(Player);
		return Player;
	},
	loadCss(){
		var head = document.getElementsByTagName("head")[0],
			link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.href = this.base + "/css/MPlayer.css";
		head.appendChild(link);
	},
	tmpl(){
		var tmp = '<audio class="audio">YOUR BROWSER CAN NOT SUPPORT AUDIO</audio>\
					<div class="screen">\
						<span class="time">11:50</span>\
						<marquee class="scroll" scrollamount="4" behavior="scroll" direction="left">asdasd</marquee>\
					</div>\
					<span class="progress"></span>\
					<ul class="control">\
						<li class="prev"></li>\
						<li class="status"></li>\
						<li class="next"></li>\
					</ul>';
		return tmp;
	},
	loadMusic(musicList){
		this.curMusic = DBLinked(musicList);
		this.controls.count = musicList.length;
		this.init();
	},
}
root.MPlayer = Player;
})(window)