var Sequelize = require('sequelize');

var dbFileName = "fakestagram.db";
var devDbUrl = "sqlite://" + dbFileName;
var sequelize = new Sequelize(devDbUrl);

var InstaPost = sequelize.define("InstaPost", {
	title: {
		type: Sequelize.STRING,
		validation: {
			max: 150,
			notNull: true
		}
	}
	imageID: Sequelize.INTEGER
});

var Comment = sequelize.define("Comment", {
	comment: {
		type: Sequelize.TEXT,
		validation: {
			notNull: true
		}
	}
});

Comment.belongsTo(InstaPost);
