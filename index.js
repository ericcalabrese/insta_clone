var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest : 'public/uploads'});
var fs = require('fs');

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000;

var dbFileName = "fakestagram.db";
var devDbUrl = "sqlite://" + dbFileName;
var sequelize = new Sequelize(devDbUrl);

var InstaPost = sequelize.define("InstaPost", {
	title: Sequelize.STRING,
	imageID: Sequelize.INTEGER
});

var Comment = sequelize.define("Comment", {
	comment: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

Comment.belongsTo(InstaPost);
InstaPost.hasMany(Comment);

app.get('/insta', function(req, res) {
	InstaPost.findAll({
		include:[{
			model: Comment
		}]
	})
	.then(function(instaPost){
		res.render('insta', {post: instaPost});
	});
});

app.get('/upload', function(req, res){
	InstaPost.findAll().then(function(instaPost){
		res.render('upload');
	})
});

app.post('/upload', upload.single('file-to-upload'), function(req, res){
	//console.log(req.body);
	//console.log(req.file);
	var full = { 
		title: req.body.title,
		imageID: req.file.filename
	}

	InstaPost.create(full).then(
	function(instaPost){
		res.redirect('/insta');
	});
})


app.post('/posts/:id/comments', function(req, res){
	// console.log("got the post");
	// console.log(req.params.imageID);
	InstaPost.findById(req.params.id).
	then(function(row){

		if (!row) {
			res.status(404).send("Could not find that post");
			return;
		}

		// console.log("found row");
		// console.log(row);
		row.createComment({
			comment: req.body.comment,
		}).
		then(function(comment){
			// res.send("Done!")
			res.redirect('/insta')
		})
	})
});

app.post('/posts/:id', upload.single('file-to-upload'), 
function(req, res){
	InstaPost.findById(req.params.id).
	then(function(row){

		if (!row) {
			res.status(404).send("Could not find that post");
			return;
		}

		var data = {
			title: req.body.title
		};

		if (req.file) {
			data.imageID = req.file.filename;
		}

		row.update(data).
		then(function(title){
			// res.send("Done!")
			//console.log(title);

			res.redirect('/insta')
		})
	})
});

app.post('/posts/:id/delete', function(req, res){
	InstaPost.findById(req.params.id).
	then(function(row){

		if (!row) {
			res.status(404).send("Could not find that post");
			return;
		}

		row.destroy(
		// {
		// 	title: req.body.title,
		// 	imageID: req.file.filename,
		//     comment: req.body.comment,
		// }
		).then(function(deleted){
			res.redirect('/insta')
		})
	})
});

/*
'/posts/:post_id/comments/:comment_id/delete' =>
'/posts/123/comments/456'
req.params = {
	post_id: "123",
	comment_id: "456"
}
req.params.Comments
*/

app.post('/posts/:post_id/comments/:comment_id/delete', function(req, res){
	// Comment.findById(req.params.id).
	// then(function(row){

	// 	if (!row) {
	// 		res.status(404).send("Could not find that post");
	// 		return;
	// 	}

	// 	comment.id.InstaPostId.destroy().
	// 	then(function(delete_c){
	// 		console.log("Eric is cool");
	// 		console.log(delete_c);
	// 		res.redirect('/insta')
	// 	})
	// })
	Comment.destroy({
		where:{
			//undefined.id
			id: req.params.comment_id
		}
	}).then(function(delete_c){
			console.log("Eric is cool");
	 		console.log(delete_c);
	 		res.redirect('/insta')
 	})

});


	/*
// Path given by Multer
	var uploadedFile = req.file.path;
	// Path we want it go
	var newLocation = `${req.file.destination}/${req.file.originalname}`;
 	fs.rename(uploadedFile, newLocation, 
 		function() {
  		 	//res.send(`Saved to ${newLocation}.`);
 			res.redirect('/insta');
		})
	*/


sequelize.sync().then(function() {
 app.listen(port, function() {
   console.log("Server started on port " + port );
 });
});


