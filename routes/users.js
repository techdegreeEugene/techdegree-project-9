const express = require('express');
const User = require('../models').User;
const authUser = require('./auth');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');

const router = express.Router();

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    };
}

router.get('/', authUser, asyncHandler(async(req, res, next) => {
    const user = await req.currentUser;
    res.json({
        id: user.id,
        firstName: user.firstName, 
        lastName: user.lastName, 
        emailAddress: user.emailAddress,
        
    });
    res.status(200);
    res.end();
}));

router.post('/', [
    check('firstName')
        .exists({ checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "First Name"'),
    check('lastName')
        .exists({ checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "Last Name"'),
    check('emailAddress')
        .exists({ checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "email"'),
        
    check("password")
        .exists({ checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for "password"'),
],
asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages});
    } else { 
        const user = req.body;
    
        user.password = bcryptjs.hashSync(user.password);

        await User.create(user)
            .then(user => {
                res.status(201).set("Location", "/").end();
            })
        }
    }) 
)

module.exports = router;