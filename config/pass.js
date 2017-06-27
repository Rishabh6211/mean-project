module.exports = function(passport,User,LocalStrategy){

passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
 
}) });
passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
  function(username, password, done) {
     
      User.findOne({username: username ,password : password},function(err,users){
       if (err) { return done(err); }
       if (!users) { return done(null, false); }
          if(users){
             
              return done(null,users)
          }
          else{  return done(null,false,"not matched")
              }
      })
}));
}