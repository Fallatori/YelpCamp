const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.createReviews = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReviews = async (req, res,) => {
    const { id, reviewID } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}