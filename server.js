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

//Iniciamos el servidor en el puerto que provee Azure, u 8080 si estamos probando en local
app.listen(process.env.PORT || 8080);