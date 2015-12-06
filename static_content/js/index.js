var sections = ["content", "members","join","events","dreamspark"];
var liveTiles = {};

var refreshSection = {
	"dreamspark":function(){
		document.getElementById("dreamspark_iframe").src="https://onedrive.live.com/redir?page=survey&resid=C54C5685052E8FDD!236&authkey=!ABZw3EPirQI2iaw&ithint=file%2cxlsx";
	},
	"join":function(){
		document.getElementById("join_iframe").src="https://onedrive.live.com/redir?page=survey&resid=C54C5685052E8FDD!234&authkey=!ACoCcPb0M17eQTQ&ithint=file%2cxlsx";
	},
	"content": function () {
		var xmlhttp = new XMLHttpRequest();
		var url = "http://uamnetdev.azurewebsites.net/API/news";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var news = JSON.parse(JSON.parse(xmlhttp.responseText));
				liveTiles.news=news;
				document.getElementById("newsBox").innerHTML=news[0].text;
				var newsId=0;
				window.setInterval(function () {
					var i=(newsId++)%news.length;
					if(news[i].entities.media&&news[i].entities.media[0]&&news[i].entities.media[0].type=="photo"){
					document.getElementById("newsCard").style["background-image"] = "url("+news[i].entities.media[0].media_url_https+")";
					document.getElementById("newsCard").style["background-size"] = "cover";
					}else{
						document.getElementById("newsCard").style["background-image"]="url(img/code.png)";
					}
					document.getElementById("newsBox").style["top"] = 10+Math.floor(Math.random()*100) + "px";
					document.getElementById("newsBox").innerHTML=news[i].text;
				}, 3000);
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		
		var xmlhttp2 = new XMLHttpRequest();
		url = "API/users";

		xmlhttp2.onreadystatechange = function () {
			if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
				var members = JSON.parse(xmlhttp2.responseText);
				liveTiles.members = members;
				//This animates the pics in the members tile
				var membersId = 0;
				document.getElementById("facepic").src = liveTiles.members[membersId].picture;
				window.setInterval(function () {
					membersId++;
					document.getElementById("facepic").style.transform = "scale(0.1,0.1)";
					document.getElementById("facepic").style["left"] = (membersId % 3) * 200 + "px";
					setTimeout(function () {
						document.getElementById("facepic").src = liveTiles.members[membersId % liveTiles.members.length].picture;
						document.getElementById("facepic").style.transform = "scale(1,1)";
					}, 1000);
				}, 2000);
			}
		}
		xmlhttp2.open("GET", url, true);
		xmlhttp2.send();
	},
	"members": function () {
		var xmlhttp = new XMLHttpRequest();
		var url = "API/users";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var members = JSON.parse(xmlhttp.responseText);
				document.getElementById("membersList").innerHTML = '<div class="member action" data-opensection="join"><img src="img/plus.gif" /><h3>TU</h3><h4>Únete al club</h4></div>';
				members.forEach(function (x) {
					document.getElementById("membersList").innerHTML += '<div class="member"><img src="' + x.picture + '"/><h3>' + x.firstName + '</h3><h4>' + x.lastName + '</h4></div>';
				});
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	},
	"events": function () {
		var xmlhttp = new XMLHttpRequest();
		var url = "API/events";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var events = JSON.parse(xmlhttp.responseText);
				document.getElementById("events-content").innerHTML = '';
				events.forEach(function (x) {
					var div='<div class="event" style="background-color:'+x.color+';">';
					div+='<div class="left">';
					div+='<div class="title">'+x.title+"</div>";
					div+='<div class="by">'+x.by+"</div>";
					div+='<div class="place">'+x.place+"</div>";
					div+='</div><div class="right">'
					div+='<div class="day">'+x.day+"</div>"
					div+='<div class="month">'+x.month+"</div>";
					div+='<div class="time">'+x.time+"</div>";
					div+='</div></div>';
					document.getElementById("events-content").innerHTML += div;
				});
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
};

function goTo(section) {
	if (refreshSection[section]) {
		refreshSection[section]();
	}
   	window.scrollTo(0, 0);
	sections.filter(function (x) { return x != section }).forEach(function (x) {
		document.getElementById(x).style.opacity = "0";
		document.getElementById(x).style.visibility = "hidden";
		document.getElementById(x).style["z-index"] = "-999";
	});
	document.getElementById(section).style.opacity = "1";
	document.getElementById(section).style.visibility = "visible";
	document.getElementById(section).style["z-index"] = "0";
}

window.addEventListener("load", function () {
	document.getElementById("fadeout").style["z-index"] = "-10000";
	document.getElementById("fadeout").style.opacity = "0";
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
	tiles = document.getElementsByClassName("action");
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
// document.getElementById("send_join").addEventListener("click",sendJoin);
// document.getElementById("send_dreamspark").addEventListener("click",sendDreamspark);

});



//Send forms data


function sendJoin(){	
	var xmlhttp = new XMLHttpRequest();
	var url = "/API/request/member";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				switch(JSON.parse(xmlhttp.responseText).status){
					case 0:
						document.getElementById("status_join").innerHTML="Enviado con éxito";
						break;
						case 1:
						document.getElementById("status_join").innerHTML="Se ha producido un error. Intentalo de nuevo en unos momentos, por favor.";
						break;
						case 2:
						document.getElementById("status_join").innerHTML="Necesitamos que uses tu correo @estudiante.uam.es para saber que eres un estudiante.";
						break;
				}
			}
		}
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(JSON.stringify({email:document.getElementById("name_join").value,name:document.getElementById("email_join").value}));
}


function sendDreamspark(){	
	var xmlhttp = new XMLHttpRequest();
	var url = "/API/request/dreamspark";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				switch(JSON.parse(xmlhttp.responseText).status){
					case 0:
						document.getElementById("status_dreamspark").innerHTML="Enviado con éxito";
						break;
						case 1:
						document.getElementById("status_dreamspark").innerHTML="Se ha producido un error. Intentalo de nuevo en unos momentos, por favor.";
						break;
						case 2:
						document.getElementById("status_dreamspark").innerHTML="Necesitamos que uses tu correo @estudiante.uam.es para saber que eres un estudiante.";
						break;
				}
			}
		}
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(JSON.stringify({email:document.getElementById("name_dreamspark").value,name:document.getElementById("email_dreamspark").value}));
}