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


//Recibe las peticiones que desencadenan un mail
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(
	smtpTransport({
		service: "hotmail",
		auth: {
			user: "uamnet@live.com",
			pass: process.env.mailpassword
		}
	}));

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
				res.json({ "status": 1 });
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
				res.json({ "status": 1 });
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

//Iniciamos el servidor en el puerto que provee Azure, u 8080 si estamos probando en local
app.listen(process.env.PORT || 8080);