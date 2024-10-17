// Importing Passport, strategies, and config
const passport = require('passport')
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const config = require('../config/app.config')
const bcrypt = require("bcryptjs");
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local');

// Setting username field to userID rather than username
const localOptions = {
  usernameField: 'username'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, async (username, password, done) => {

  try {
    var user = await User.findOne({ where: { username: username } });
    console.log(user)
  } catch (err) {
    return done(err);
  }

  if (!user) {
    return done(null, {
      error: { username: 'No username' },
      statusCode: 460,
    });
  }

  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (err) { return done(err); }
    if (!isMatch) {
      console.log("----------------")
      return done(null, {
        error: { password: 'Incorrect Password.' },
        statusCode: 461,
      });
    }

    if(user.allow === 0) {
      return done(null, {
        error: { password: 'Is not allowed' },
        statusCode: 462,
      });
    }

    return done(null, user);
  });


});

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  // Telling Passport where to find the secret
  secretOrKey: config.secret

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {

  try {
    const user = await User.findByPk(payload.id);
    if (user === null) {
      done(false);
    } else {
      if(user.allow === 1) {
        done(null, user);
      }
      else {
        done(false);
      }
    }
  } catch (err) {
    return done(err);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
