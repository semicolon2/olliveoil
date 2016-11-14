var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user.js');


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    //create new account
    passport.use('local-signup', new LocalStrategy(
        {passReqToCallback:true},
        function(req, username, password, done) {
            process.nextTick(function(){
                User.findOne({'username':username}, function(err, user){
                    if(err)
                        return done(err);

                    if(user){
                        return done(null, false);
                    } else {
                        var newUser = new User();

                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));


    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {

        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user || !user.validPassword(password))
                return done(null, false);

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
