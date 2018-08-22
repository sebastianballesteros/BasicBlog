//require dependencies
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var method = require("method-override");
var sanitizer = require("express-sanitizer");


//app configuration
/*var promise = mongoose.connect("mongodb://localhost/blog", {
  useMongoClient: true,
  /* other options
}); */

//connnect to mongoDB from mLab
mongoose.connect("mongodb://tatanballesteros:tatan22@ds163510.mlab.com:63510/blog-app-22");


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());
app.use(method("_method"));

//Set DB Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTful routes
app.get("/", function(req,res){
    res.redirect("/blogs");
});

// Index Route
app.get("/blogs", function(req,res){
    console.log("hola");
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            console.log("hello");
            res.render("index.ejs", {blogs:blogs});
        }
    });
});

//New Route
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});

//Create Route
app.post("/blogs", function(req,res){
    //create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("__________________________");
    console.log(req.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new.ejs");
        }else {
            res.redirect("/blogs");
        }
    });
});

// Show Route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("show.ejs", {blog: foundBlog});
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("edit.ejs", {blog:foundBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err, updateBlog){
       if(err){
           console.log(err);
       } else {
           res.redirect("/blogs");
       }
   });
});

app.listen(8080, process.env.IP, function(){
    console.log("Server is running");
});
