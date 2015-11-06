var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http 	= require('http')
var httpProxy= require('http-proxy');
var app = express(),
	app1 =express(),
	app2 = express();
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

client.lpush('myServers','http://0.0.0.0:3001/');
client.lpush('myServers','http://0.0.0.0:3002/');
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app1.use(function(req, res, next) 
{
	console.log('1: ', req.method, req.url);

	// ... INSERT HERE.
	client.lpush("recentURL",req.url);
	client.ltrim("recentURL",0,4);

	next(); // Passing the request to the next handler in the stack.
});

app2.use(function(req, res, next) 
{
	console.log('2: ', req.method, req.url);

	// ... INSERT HERE.
	client.lpush("recentURL",req.url);
	client.ltrim("recentURL",0,4);

	next(); // Passing the request to the next handler in the stack.
});

var options = {};
var proxy = httpProxy.createProxyServer(options);

var server = http.createServer(function(req,res){
	client.rpoplpush('myServers','myServers',function(err,value){
		var targetURL = value;
		proxy.web(req,res,{target: targetURL});
	});
});
server.listen(3000);

app1.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   // console.log(req.body) // form fields
   // console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		//console.log(img);
	  		console.log("Uploaded!");
			client.lpush("recentImg",img);
		});
	}

   res.status(204).end()

}]);

app2.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   // console.log(req.body) // form fields
   // console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		console.log("Uploaded!");

			client.lpush("recentImg",img);
		});
	}

   res.status(204).end()

}]);



app1.get('/meow', function(req, res) {

		// client.lrange('recentImg',0,-1,function(err,data){
		// 	console.log(data);
		// });
 		
		client.lrange('recentImg',0,0,function(err,imagedata) 
 		{
			if(err) throw err
			res.writeHead(200, {'content-type':'text/html'});
			imagedata.forEach(function(photo){

    				res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+photo+"'/>");
		
 			});
			res.end();
		});	
   	 
		client.ltrim('recentImg',1,-1);
 	
 });

app2.get('/meow', function(req, res) {

		// client.lrange('recentImg',0,-1,function(err,data){
		// 	console.log(data);
		// });
 		
		client.lrange('recentImg',0,0,function(err,imagedata) 
 		{
			if(err) throw err
			res.writeHead(200, {'content-type':'text/html'});
			imagedata.forEach(function(photo){

    				res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+photo+"'/>");
		
 			});
			res.end();
		});	
   	 
		client.ltrim('recentImg',1,-1);
 	
 });

//HTTP SERVER

var serverOne = app1.listen(3001, function(){
	var host = serverOne.address().address;
	var port = serverOne.address().port

  	console.log('Example app listening at http://%s:%s', host, port)
});

var serverTwo = app2.listen(3002, function(){
        var host = serverTwo.address().address;
        var port = serverTwo.address().port

        console.log('Example app listening at http://%s:%s', host, port)
});

// /////////////////////////////////////////////////////////////////////////////////


app1.get('/',function(req,resp){

	resp.send("Hello from Server 1!");
	
});

app2.get('/',function(req,resp){
        
	
	resp.send("Hello from Server 2!");
	
        
});
// //////////////////////////////////////////////////////////////////////////////////

app1.get('/get',function(req,res){
        client.get("newKey",function(err,value){
        	if (err) {throw err}
			else{
				res.send(value);
				
			}
		});
});

app2.get('/get',function(req,res){
        client.get("newKey",function(err,value){
        		if (err) {throw err}
        			else{
                res.send(value);
                
            }
        });
});

// //////////////////////////////////////////////////////////////////////////////////

app1.get('/set',function(req,res){
	client.set("newKey","Value = 42");
        client.get("newKey", function(err,value){
                console.log(value);
                res.send(value);
                
                client.expire("newKey",10);
        });

});

app2.get('/set',function(req,res){
        client.set("newKey","Value = 42");
        client.get("newKey", function(err,value){
                console.log(value);
                res.send(value);
                
                client.expire("newKey",10);
        });

});
// /////////////////////////////////////////////////////////////////////////////


app1.get('/recent',function(req,res){
        client.lrange("recentURL",0,4,function(err,value){
                res.send(value);
                
        });
});

app2.get('/recent',function(req,res){
        client.lrange("recentURL",0,4,function(err,value){
                res.send(value);
                
        });
});

