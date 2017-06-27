import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import multer from "multer";
import fs from "fs";
import LocalStrategy from 'passport-local';
import BodyParser from 'body-parser';
import session from 'express-session';
// import myFunc from './../config/pass.js';
mongoose.connect('mongodb://localhost/rishabh');
const Schema = mongoose.Schema;
const userschema = new Schema
	({
		username:{type:String},
		email:{type:String},
		password:{type:String},
		type:{type:String}

	});
const productschema = new Schema
	({
		name:{type:String},
		price:{type:Number}
	});
const orderschema = new Schema
	({
		name:{type:String},
		price:{type:Number}
	});
const order = mongoose.model('orders',orderschema,'order')
const product  = mongoose.model('products', productschema,'product')
const User = mongoose.model('user',userschema,'users')
//myFunc(passport,User,LocalStrategy);
const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  res.render('/../public/index', {
    title: 'Express'
  });
});
router.post('/signup', (req, res) => {
	console.log ("data",req.body);
	var users = new User
	({
	 username:req.body.username,
	 email:req.body.email,
	 password:req.body.password,
	 type:"user"
	});  
 	users.save(function(err,data)
 		{
 			res.send(data);
 			
 			
 		});

});

passport.serializeUser(function(user, done) {
   return done(null, user);
});

passport.deserializeUser(function(user, done) {
    //User.findById(id, function (err, user) {
    	done(null, user); 
    //}) 
});

passport.use('local',new LocalStrategy.Strategy({
	    usernameField : 'username',
	    passwordField : 'password'
	  },
	function(username, password, done) {
	   User.findOne({ username: username }, function(err, user) {
		    if(err){
		    	 done(err);
		    }
		    else if (!user) {
		    	 done(null, false, { message: 'Incorrect username.' });
		    }
		    else if(user.password != password){
		    	console.log("Password is not Correct");
		         done(null, false, { message: 'Incorrect password.' });
		    }
		    else  done(null, user);  
		});
	}
));

var login = function(req,res)
{
	var user = req.user;
	console.log(req.user);
	res.json(user);
}

router.post("/login",passport.authenticate('local'),login);

router.post('/logout', function(req, res)
{
    req.logOut();
    res.send(200);
}); 
router.get("/product", (req,res) => {
      product.find({}, function(err, data)
      	{
      		res.json(data);
      		console.log(data);
      		console.log("sssss",req.user);
      		console.log("check passss	",req.isAuthenticated());
 

      	});
});
router.get("/activity", (req,res)=>{
		product.find({}, function(err, data)
			{
				res.json(data);
				console.log(data);
			});
	})

router.post("/order", (req,res)=>{
	console.log(req.body);
	product.findOne({name:req.body.name},function(err,order1)
		{
			if(err)
			{
				console.log('err');
			}
			if(!order1)
			{
				console.log('not exist');
			}
			else
			{
				console.log(order1);
				 order({
					name:order1.name,
					price:order1.price
					}).save(function(err,orders){
						if(err)
						{
							console.log(err);
						}
						else
						{
						console.log(orders);
					}
					});
				
			}
			
		});
})	
router.put('/update', (req,res)=>{
	console.log("hello");
    console.log("dataname", req.body.name);
    const name=req.body.name;
   /* product.findOne({_id:req.body._id},function(err,data)
    	{
    		console.log("find it",data);*/
    		product.update({_id:req.body._id},{$set:{name:req.body.name, price:req.body.price}},function(err,data)
    		{
    				if(err){
    					console.log("Erroro",err);
    				}
    				else{
    					console.log('update data',data);
    				}
    		});
    		
    	});
// });
router.post("/remove", (req,res)=>{
	console.log(req.body);
			User.remove({username:req.body.username}, function(err,data)
			{

				if(err)
				{
					console.log("error");
				}
				else
				{
					console.log(data);
					
					
				}
			})
})
router.post("/add",(req,res)=>{
	product.findOne({name:req.body.name}, function(err,data)
	{
		if(!data)
		{
			var products = new product
			({
			 name:req.body.name,
			 price:req.body.price
			});  
		 	products.save(function(err,data)
		 		{
		 			res.send(data);	 			
		 		});
		 }
		 else
		 {
		 	console.log("data already");
		 }
	});
})

   var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
  	console.log("hello image",req.user._id);
    var filename =req.user._id;
    cb(null,''+filename);
  }
});

var upload = multer({ storage: storage }).single('file');
router.post('/upload', function(req, res) {
	console.log("upload api");
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });


router.get('/getimage',(req,res) =>{
  console.log("user in getimage:",req.user._id);
  var filename = req.user._id;
  var image = fs.readFileSync('./uploads/'+filename);
  res.writeHead(200,{'Content-Type':'image/jpeg'});
  res.end(image,'binary');
});
router.get('/dashboard', (req,res)=>{
	User.find({},function(err,data){
		res.json(data);
	})
})
router.post("/add", (req,res)=>{
	product.findOne({name:req.body.name},function(err,order1)
		{
			if(err)
			{
				console.log('err');
			}
			if(!order1)
			{
				console.log('not exist');
			}
			else
			{
				console.log(order1);
				 order({
					name:order1.name,
					price:order1.price
					}).save(function(err,orders){
						if(err)
						{
							console.log(err);
						}
						else
						{
						console.log(orders);
					}
					});
				
			}
			
		});
})	
export default router;
