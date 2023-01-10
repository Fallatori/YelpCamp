const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const campgrounds = require('../controllers/campgrounds')
const Campground = require('../models/campground');
const { campgroundSchema} = require('../schemas')
const {isLoggedIn} = require('../middleware')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req,res) => {
    //     console.log(req.body, req.file)
    //     res.send('it worked!')
    // })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm))

module.exports = router