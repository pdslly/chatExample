(function(root){
	var vendors = ['moz', 'o', 'webkit', 'ms'], lastTime = 0;
	for(var i = 0, len = vendors.length; i < len && !root.requestAnimationFrame; i++){
		root.requestAnimationFrame = root[vendors[i] + 'RequestAnimationFrame'];
		root.cancelAnimationFrame = root[vendors[i] + 'CancelRequestAnimationFrame']
	}
	if(!root.requestAnimationFrame){
		root.requestAnimationFrame = function(callback){
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = root.setTimeout(function(){callback(currTime + timeToCall)}, timeToCall);
			return id;
		}
	}
	if(!root.cancelAnimationFrame){
		root.cancelAnimationFrame = clearTimeout;
	}
})(window)