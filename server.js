//Usamos Express, una libreria que simplifica el hacer un servidor web
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
//Por defecto, redirigimos las peticiones al archivo con el mismo nombre de la carpeta static_content
app.use(express.static(__dirname + '/static_content'));
app.use(bodyParser.json())

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

//Es posible solicitar los datos de los eventos en formato JSON
app.get('/API/events', function (req, res, next) {
	var file = fs.readFileSync("data/events.json", "utf8");
    var events = JSON.parse(file);
	for (var i = 0; i < events.length; i++) {
		events[i].id = i;
	}
	
	//Do not cache the users, at least during developement!
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');

    res.json(events);
});

app.get('/API/polls', function (req, res, next) {
	var file = fs.readFileSync("data/polls.json", "utf8");
    var polls = JSON.parse(file);
	for (var i = 0; i < polls.length; i++) {
		polls[i].id = i;
	}
	
	//Do not cache the users, at least during developement!
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');

    res.json(polls);
});


var OAuth = require('oauth').OAuth;
var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"qAFlccpzv78rj9Ad6SdorazOK",
	"PNltqdSfVKv6kUdvjy2DRu4Ez9NO4rZ5nskrSj90fV1HuO8H9N",
	"CPjErAj9jkJM5LGOF80OxfnBp",
	process.env.twittersecret1,
	"1.0",
	"http://yourdomain/auth/twitter/callback",
	"HMAC-SHA1"
	);
//Devuelve los ultimos tweets de @uamnet
app.get('/API/news', function (req, res, next) {
	oa.get(
		'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=uamnet&count=5&exclude_replies=true',
		'134400799-xyLCjtxby3LYM3BJXKQ7OJkV3rOSql5BrABw2Qzw', //test user token
		process.env.AccessTokenSecret, //test user secret            
		'134400799-AJztRwtYreSyibOtydlSIoVjCianrlAFOpmAA5le', //test user token
		process.env.twittersecret2, //test user secret            
		function (e, data, response) {	
			//Do not cache the users, at least during developement!
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.header('Expires', '-1');
			res.header('Pragma', 'no-cache');

			res.json(data);
		});
});


//Recibe las peticiones que desencadenan un mail
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'uamnet@live.com',
        pass: process.env.mailpassword
    }
});

app.post('/API/request/member', function (req, res, next) {
	console.log(req.body);
	var mailOptions = {
		from: 'uamnet@live.com', // sender address
		to: 'uamnet@live.com', // list of receivers
		subject: '[Member request]' + new Date(), // Subject line
		text: 'Hey', // plaintext body
		html: 'Hey' // html body
	};
	var validMail = /\S+@estudiante.uam.es/
	if (validMail.test(req.body.email)) {
		mailOptions.text = mailOptions.html = "Email:" + req.body.email + "\Name:" + req.body.name;
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				res.json({ "status": 1, "error": error,"info":info });
			} else {
				res.json({ "status": 0 });
			}
		});
	} else {
		mailOptions.subject = "UamNet - Do Not Reply" + new Date();
		mailOptions.to = req.body.email;
		mailOptions.text = mailOptions.html = "Hola" + req.body.name + ",\n Has solicitado ser miembro del club .Net, pero para poder añadirte necesitamos que uses tu cuenta @estudiante.uam.es para poder comprobar que efectivamente eres un alumno. Por favor, realiza la petición de nuevo con ese correo, disculpa las molestias. \n Un saludo,\n UamDotNet \n @uamnet";
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				res.json({ "status": 1, "error": error, "info":info });
			} else {
				res.json({ "status": 2 });
			}
		});
	}
});

app.post('/API/request/dreamspark', function (req, res, next) {
	console.log(req.body);
	var mailOptions = {
		from: 'uamnet@live.com', // sender address
		to: 'uamnet@live.com', // list of receivers
		subject: '[Dreamspark request]' + new Date(), // Subject line
		text: 'Hey', // plaintext body
		html: 'Hey' // html body
	};
	var validMail = /\S+@estudiante.uam.es/
	if (validMail.test(req.body.email)) {
		mailOptions.text = mailOptions.html = "Email:" + req.body.email + "\Name:" + req.body.name;
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				res.json({ "status": 1, "error": error });
			} else {
				res.json({ "status": 0 });
			}
		});
	} else {
		mailOptions.subject = "UamNet - Do Not Reply" + new Date();
		mailOptions.to = req.body.email;
		mailOptions.text = mailOptions.html = "Hola " + req.body.name + ",\n Has solicitado acceso al Dreamspark academico, pero para poder añadirte necesitamos que uses tu cuenta @estudiante.uam.es para poder comprobar que efectivamente eres un alumno. Por favor, realiza la petición de nuevo con ese correo, disculpa las molestias. \n Un saludo,\n UamDotNet \n @uamnet";
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				res.json({ "status": 1, "error": error });
			} else {
				res.json({ "status": 2 });
			}
		});
	}
});

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

app.get("/#*",function (req, res, next) {
	res.sendFile('static_content/index.html');
});

//Iniciamos el servidor en el puerto que provee Azure, u 8080 si estamos probando en local
app.listen(process.env.PORT || 8080);