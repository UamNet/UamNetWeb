window.addEventListener("load", function () {
	var tiles = document.getElementsByClassName("box");
	for (var i = 0; i < tiles.length; i++) {
		var x = tiles[i];
		if (x.dataset.openlink) {
			x.addEventListener("mouseup", (function (x) {
				return function (e) {
					document.getElementById("fadeout").style["z-index"] = "10000";
					document.getElementById("fadeout").style.opacity = "1";
					window.setTimeout(function () {
						document.location = x.dataset.openlink;
					}, 800);
					//In case of mailto:, so the user can keep using the page
					window.setTimeout(function () {
						document.getElementById("fadeout").style["z-index"] = "-10000";
						document.getElementById("fadeout").style.opacity = "0";
					}, 1600);
				}
			})(x));
		}
	}
	
	var membersId=0;
	window.setInterval(function(){
			membersId++;
			if(membersId==3){
				membersId=0;
			}
			document.getElementById("facepic").style.transform="scale(0.1,0.1)";
			document.getElementById("facepic").style["left"]=membersId*200+"px";
			setTimeout(function(){
				document.getElementById("facepic").src='img/user'+membersId+'.jpg';
				document.getElementById("facepic").style.transform="scale(1,1)";
			},1000);
	},2000);
});