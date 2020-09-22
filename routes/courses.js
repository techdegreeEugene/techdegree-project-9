const express = require('express');
const Course = require('../models').Course;
const authUser = require("./auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

router.get('/', asyncHandler( async (req, res, next) => {
    Course.findAll({
        order: [["id", 
        "ASC"]],
        attributes: ["id", 
        "title", 
        "description", 
        "userId", 
        "estimatedTime", 
        "materialsNeeded"]
        
    })
    .then( courses => {
        res.json({courses});
    })
}))

router.get('/:id', asyncHandler(async(req, res, next) => {
    Course.findOne({
        attributes: ["id",
         "title", 
         "description",
         "userId", 
         "estimatedTime", 
         "materialsNeeded"],
        where: {
            id: req.params.id
        }
    }).then( course => {
    if(course) {
        res.json({ course });
    } else {
        res.status(404).json( { message: 'Course id is not found'});
    }
})}));

router.post('/', [
    check("title")
        .exists({ checkNull: true, checkFalsy: true})
        .withMessage('Please provide a value for title'),
    check('description')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for description'),
],
authUser, asyncHandler(async(req, res, next) => {
    const user = req.currentUser.id;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages});
    } else {
       await Course.create({ ...req.body, userId: user })
        .then((course) => {
            if(course) {
                res.status(201).location(`/api/courses/${course.id}`).end();
            } else {
                next();
            }
        })
        
    }
}));

router.put('/:id', [
    check('title')
    .exists({ checkNull: true, checkFalsy: true})
    .withMessage('Please providea value for "title"'),
check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
],
authUser, asyncHandler(async(req, res, next) => {
    const user = req.currentUser.id;
    const errors = validationResult(req);

if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages});
} else {
    await Course.findOne({
        where: [{ id: req.params.id }]
    })
    .then((course) => {
        if (course.userId === user) {
            if(course) {
                course.update(req.body);
                res.status(204).end();
            } else {
                next();
            }
        } else {
            res.status(403).json({ message: "User doesn't own this course"}).end();
        }
    })
}
    }));


router.delete('/:id', authUser, asyncHandler(async (req, res, next) => {
    await Course.findOne({
        where: [{ id: req.params.id }]
    })
    .then((course) => {

    if (course.userId == req.currentUser.id) {
        if (course) {
        course.destroy();
        res.status(204).end();
    } else {
        next();
    } 
} else {
res.status(403).json({ message: "Not permitted"}).end();
    }
})
}))

module.exports = router;