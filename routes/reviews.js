const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campground');
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const { reviewSchema } = require('../schemas')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(reviews.createReviews))

router.delete('/:reviewID', catchAsync(reviews.deleteReviews))

module.exports = router;