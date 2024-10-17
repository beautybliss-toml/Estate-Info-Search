const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/app.config");
const lang = require("../lang/lang")

exports.insertOne = async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const password1 = await bcrypt.hash("111", salt)

        const [user, created] = await User.findOrCreate({
            where: { username: config.admin_name },
            defaults: {
                username1: "古舘 真",
                password: password1,
                allow: 1
            }
        });
        if (created) {
            return res.json({ message: "created" })
        }
        else {
            return res.json({ message: "user alreay exist"})
        }
    } catch (error) {
        console.log(error)
    }
}

exports.changeState = async (req, res) => {
    try {

        let id = req.body.id;
        let state = req.body.state === 1 ? 0 : 1;

            var updated = await User.update({ allow: state }, {
                where: {
                    id: id
                }
            });

            updated ? res.send({ message: "sucess" }) : res.status(400).send({ message: lang("failed") });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.userlist = async (req, res) => {
    try {

        // const userlist = await User.findAll();
        // res.json({
        //     userlist
        // })



        let where = {}

        if (req.body.keyword !== "") {
            where = {
                [Op.and]: [{
                    [Op.or]: [
                        {
                            username: {
                                [Op.like]: '%' + req.body.keyword + '%'
                            }
                        },
                        {
                            username1: {
                                [Op.like]: '%' + req.body.keyword + '%'
                            }
                        }
                    ],
                    username: {
                        [Op.ne]: config.admin_name
                    }
                }],
            }
        }
        else {
            where = {
                username: {
                    [Op.ne]: config.admin_name
                }
            }
        }


        let order = [
            ['createdAt', 'ASC']
        ]

        let reviewAll = await User.findAll() //all count
        let matchAll = await User.findAll({
            where
        }) //match count

        let userlist = await User.findAll({
            where,
            order,
            offset: (req.body.pageno - 1) * 15,
            limit: 15
        })

        res.json({
            allCount: (reviewAll.length - 1),
            matchCount: matchAll.length,
            userlist
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

exports.signin = async (req, res) => {
    try {
        if (req.user.statusCode === 460)
            return res.status(400).json({ message: "no username" });

        if (req.user.statusCode === 461)
            return res.status(400).json({ message: "no password" });

        if (req.user.statusCode === 462)
            return res.status(400).json({ message: "is not allowed" });

        const payload = {
            id: req.user.id,
            username: req.user.username,
            username1: req.user.username1,
        };

        jwt.sign(payload, config.secret, { expiresIn: "3650d" }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({
                message: "Jwt Login Success.",
                token: `JWT ${token}`,
                user: payload,
                serverTime: Date.now()
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.signup = async (req, res) => {
    try {

        let email = req.body.email
        let name = req.body.username
        let password = req.body.password

        const salt = await bcrypt.genSalt(10);
        const password1 = await bcrypt.hash(password, salt)

        const [user, created] = await User.findOrCreate({
            where: { username: email },
            defaults: {
                username1: name,
                password: password1,
                allow: 0
            }
        });
        if (created) {
            return res.json({ message: "created" })
        }
        else {
            return res.json({ message: "user alreay exist"})
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.tokenLogin = async (req, res) => {
    try {
        const payload = {
            id: req.user.id,
            username: req.user.username,
            username1: req.user.username1,
        };
        jwt.sign(payload, config.secret, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({
                message: "Jwt Login Success.",
                token: `JWT ${token}`,
                user: payload,
                serverTime: Date.now()
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.putPassword = async (req, res) => {
    try {
        console.log(req.user.username)
        console.log(req.body)
        const user_one = await User.findOne({ where: { username: req.user.username } });

        if (!user_one) return res.status(400).send({ message: "no username" });

        if (req.body.password !== "" && req.body.newPassword !== "") {
            console.log(req.body.password)
            console.log(user_one.password)
            const isMatch = await bcrypt.compare(req.body.password, user_one.password);
            console.log(isMatch)
            if (!isMatch)
                return res.status(400).send({ message: "no password" });

            const salt = await bcrypt.genSalt(10);
            var newPassword = await bcrypt.hash(req.body.newPassword, salt);

            var updated = await User.update({ password: newPassword }, {
                where: {
                    username: req.user.username
                }
            });

            updated ? res.send({ message: "sucess" }) : res.status(400).send({ message: lang("failed") });
        }
        else {
            return res.status(400).send({ message: "no username" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};