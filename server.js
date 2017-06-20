var express = require("express");
var mongojs  = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var databaseurl = "articles";
var collection = ["scrapedArticles"];


var db = mongojs(databaseurl,collection)
var app = express();
var port = 7000;



app.get("/",function(req,res){
	res.send("welcome to app.");
});


db.on("error",function(){
	return console.log("database error:"+ error);
});
app.get("/all",function(req,res){
	db.scrapedArticles.find({},function(err,found){
		if(err){
			console.log(error)
		}else{
			res.json(found)
		}
	})
});

app.get("/articles",function(req,res){
	request("https://www.nytimes.com/",function(error,response,html){
		var $ = cheerio.load(html);
		$("h2.story-heading").each(function(i,element){
			var title = $(this).children().text();
			var link = $(this).children().attr("href");
			 if(title && link){
			 	db.scrapedArticles.save({
			 		title:title,
			 		link: link
			 	},
			 	function( error,saved){
			 		if(error){
			 			console.log(error)
			 		}else{
			 			console.log(saved)
			 		}
			 	})
			 }
		})
	})
	res.send("scraped complete!")
})

app.listen(port,function(){
	console.log("listening to port:"+ port);
})