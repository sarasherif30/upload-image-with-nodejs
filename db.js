const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const bodyParser = require('body-parser');
const formidable = require('formidable');

var database;
//middlewares
app.use('/node_modules',express.static(__dirname+'/node_modules'));
app.use('/upload',express.static(__dirname+'/upload'));
app.use(bodyParser.json())
//routing
app.get('/',function(request,response){
  response.sendFile(__dirname+'/index.html');
})
app.get('*',function(request,response){
  response.send(404);
})
function test(fn){
  app.post('/fileupload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req);
    function isa (fn){
         form.on('fileBegin', function (name, file){
            file.path = __dirname + '/upload/' + file.name;
            fn(file.path);
          })
      }
        isa(fn);
        res.sendFile(__dirname + '/index.html');
  });
}
// Connect to the db
var url = "mongodb://localhost:27017/upload";
MongoClient.connect(url, function(err, db) {
  if(!err) {
    database = db;
    console.log("We are connected");
    // if (err) throw err;
    db.createCollection("upload", function(err, res) {
      if (err) throw err;
      console.log("Table created!");
        var myobj ;
        var name;
        test(function(path){
          name = path;    // this is where you get the return value
          myobj = { path: name};
          console.log('waiting image upload');
          db.collection("upload").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("image path inserted");
            db.close();
          });
      });
  });
//listing
server.listen(3000,function(){
console.log("server is working!");
})
}else {
   console.log(err);
  }

});
