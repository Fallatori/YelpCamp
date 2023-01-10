const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios')

mongoose.connect('mongodb://127.0.0.1/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const unsplashAxios = axios.create({
    baseURL: "https://api.unsplash.com",
    headers: {
        Authorization: 'Client-ID ZOpVJb2hfArq3wwnlkZYTJsytJoHW4tEBNzDF8rasXY',
        "Accept-Encoding": "gzip,deflate,compress"
    }
  });

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 10;
        const title = `${sample(descriptors)} ${sample(places)}`
        try {
            const imageResponse = await unsplashAxios.get("/photos/random", { query: title, orientation: 'landscape', topics: 'nature' })
            const imageURL = imageResponse.data.urls.small
            const imageFilename = imageResponse.data.id
            const imageResponse2 = await unsplashAxios.get("/photos/random", { query: title, orientation: 'landscape', topics: 'nature' })
            const imageURL2 = imageResponse2.data.urls.small
            const imageFilename2 = imageResponse2.data.id
            //console.log("Fetched successfully!", { imageURL })
            const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title,
                images: [{
                    url: imageURL,
                    filename: imageFilename
                },
                {
                    url: imageURL2,
                    filename: imageFilename2
                }],
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales posuere posuere. Ut id nunc vitae mi sagittis eleifend eget a sem. Ut sit amet eros quis risus sagittis malesuada. Sed aliquet quam sit amet volutpat convallis. Etiam vehicula quam sit amet quam fringilla imperdiet. Maecenas rutrum arcu sed libero vulputate ullamcorper. Vivamus molestie tincidunt neque vitae tincidunt. Praesent at volutpat justo, sed dignissim nisi.',
                price: price,
                geometry: {
                    type: "Point",
                    coordinates: [-113.1331, 47.0202]
                }
            })
            await camp.save();
        } catch( err ) {
            console.error(err)
        }
        
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})