const User = require("../models").User;
const bcryptjs = require("bcryptjs");
const auth = require("basic-auth");

const authUser = async(req, res, next) => {
    let message = null;

    const credentials= auth(req);

    if (credentials) {
        await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        }).then( user => {
        if (user) {
            const authenticated = bcryptjs.compareSync( credentials.pass, user.password);
        if (authenticated) {
            
            req.currentUser = user;
        } else {
            message = `Auth failed for username: ${user.username}`;
        } 
    } else {
        message = `User ${credentials.emailAddress} not found`;
        }
    })
    } else {
            message = `Auth header not found`;
        }

        if (message) {
            console.warn(message);
            res.status(401).json({message: "Access Denied" });
        } else {
            next();
        }
    };

    module.exports = authUser;