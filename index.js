var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest: 'uploads'});

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000;

var dbFileName = "insta.db";
var devDbUrl = "sqlite://" + dbFileName;
var sequelize = new Sequelize(devDbUrl);

var InstaPost = sequelize.define('InstaPost', {
	title: Sequelize.STRING,
	comment: Sequelize.TEXT
});

app.get('/insta', function(req, res) {
	InstaPost.findAll().then(function(instaPost){
		res.render('insta', {post: instaPost});
	})
});

app.get('/upload', function(req, res){
	InstaPost.findAll().then(function(instaPost){
		res.render('upload');
	})
});

app.post('/upload', upload.single('file-to-upload'), 
	function(req, res){InstaPost.create(req.body)
		.then(function(instaPost){
		res.redirect('/insta');
	})
});

app.post('/upload', upload.single('file-to-upload'), 
	function(req, res){
		console.log(req.file);


		var uploadedFile = req.file.path;
		var newLocation = `${req.file.destination}
		/${req.file.originalname}`;
 		fs.rename(uploadedFile, newLocation, 
 			function() {
  			res.send(`Saved to ${newLocation}.`);
  	})
});



sequelize.sync().then(function() {
 app.listen(port, function() {
   console.log("Server started on port " + port );
 });
});


