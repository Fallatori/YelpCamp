const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales posuere posuere. Ut id nunc vitae mi sagittis eleifend eget a sem. Ut sit amet eros quis risus sagittis malesuada. Sed aliquet quam sit amet volutpat convallis. Etiam vehicula quam sit amet quam fringilla imperdiet. Maecenas rutrum arcu sed libero vulputate ullamcorper. Vivamus molestie tincidunt neque vitae tincidunt. Praesent at volutpat justo, sed dignissim nisi.',
            price: price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})