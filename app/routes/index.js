const passport = require("passport");
const passport_service = require('../services/passport.service.js')

const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });


module.exports = app => {

    //user controller
    const userController = require("../controller/user.controller.js");
    var router2 = require("express").Router();
    router2.get('/insertOne', userController.insertOne)
    router2.get('/login', requireLogin, userController.signin)
    router2.post('/register', userController.signup)
    router2.post('/tokenLogin', requireAuth, userController.tokenLogin)
    router2.post('/putpassword', requireAuth, userController.putPassword)
    router2.post('/userlist', requireAuth, userController.userlist)
    router2.post('/changeState', requireAuth, userController.changeState)

    app.use('/api/', router2)

    // const scrarpingController = require('../controller/scrarping.controller.js')
    // var router7 = require("express").Router();
    // router7.post("/getApartmentInfo", requireAuth, scrarpingController.getApartmentInfo);

    // app.use('/api/scrarping', router7);

};
