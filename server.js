//Usamos Express, una libreria que simplifica el hacer un servidor web
var express = require('express');
var app = express();
//Por defecto, redirigimos las peticiones al archivo con el mismo nombre de la carpeta static_content
app.use(express.static(__dirname + '/static_content'));


//Es posible solicitar los datos de los usuarios en formato JSON
var fs = require("fs");
app.get('/API/users', function (req, res, next) {
	var file = fs.readFileSync("data/users.json", "utf8");
    var users = JSON.parse(file);
	for (var i = 0; i < users.length; i++) {
		users[i].id = i;
	}
	
	//Do not cache the users, at least during developement!
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');

    res.json(users);
});


var OAuth = require('oauth').OAuth;
var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"xUPe5ViRfty6MvDsUfsfZYmY7",
	"RJF6vV26OKUJZts48SN0vutY1F9ip49Iy9mm0icZ3AO8zOFhIV",
	"1.0",
	"http://yourdomain/auth/twitter/callback",
	"HMAC-SHA1"
	);
//Devuelve los ultimos tweets de @uamnet
app.get('/API/news', function (req, res, next) {
	oa.get(
		'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=uamnet&count=5&exclude_replies=true',
		'2913654539-xTLs5QpXz1H8bkK6J1Cx5nSY1QVlbiRuWt0lSsH', //test user token
		process.env.twittersecret, //test user secret            
		function (e, data, response) {	
			//Do not cache the users, at least during developement!
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.header('Expires', '-1');
			res.header('Pragma', 'no-cache');
			
			res.json(data);
		});
});

//Iniciamos el servidor en el puerto que provee Azure, u 8080 si estamos probando en local
app.listen(process.env.PORT || 8080);