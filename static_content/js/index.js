var sections = ["content", "members"];
function goTo(section) {
   	window.scrollTo( 0, 0);
	sections.filter(function (x) { return x != section }).forEach(function (x) {
		document.getElementById(x).style.opacity="0";
		document.getElementById(x).style.visibility="hidden";
		document.getElementById(x).style["z-index"]="-999";
	});
	document.getElementById(section).style.opacity = "1";
	document.getElementById(section).style.visibility="visible";
	document.getElementById(section).style["z-index"]="0";
}

window.addEventListener("load", function () {
	goTo("content");
	
	
	//This piece of code makes the external link work and animate with just setting the data-openlink property
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
	
	//This piece of code makes the sections "link"" work and animate with just setting the data-opensection property
	var tiles = document.getElementsByClassName("action");
	for (var i = 0; i < tiles.length; i++) {
		var x = tiles[i];
		if (x.dataset.opensection) {
			x.addEventListener("mouseup", (function (x) {
				return function (e) {
					document.getElementById("fadeout_section").style["z-index"] = "90";
					document.getElementById("fadeout_section").style.opacity = "1";
					window.setTimeout(function () {
						goTo(x.dataset.opensection);
					}, 800);
					window.setTimeout(function () {
						document.getElementById("fadeout_section").style.opacity = "0";
					}, 850);
					window.setTimeout(function () {
						document.getElementById("fadeout_section").style["z-index"] = "-10000";
					}, 1600);
				}
			})(x));
		}
	}
	
	//This animates the pics in the members tile
	var membersId = 0;
	window.setInterval(function () {
		membersId++;
		if (membersId == 3) {
			membersId = 0;
		}
		document.getElementById("facepic").style.transform = "scale(0.1,0.1)";
		document.getElementById("facepic").style["left"] = membersId * 200 + "px";
		setTimeout(function () {
			document.getElementById("facepic").src = 'img/user' + membersId + '.jpg';
			document.getElementById("facepic").style.transform = "scale(1,1)";
		}, 1000);
	}, 2000);
});