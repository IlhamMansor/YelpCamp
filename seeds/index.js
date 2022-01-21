const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000) + 1;
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "61ea0fa18af720f66cce39fe",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: { type: "Point", coordinates: [101.770907, 2.934473] },
      images: [
        {
          url: "https://res.cloudinary.com/dgi9fzukm/image/upload/v1642768115/YelpCamp/sl1ywublqnymwvao18bw.jpg",
          filename: "YelpCamp/sl1ywublqnymwvao18bw",
        },
        {
          url: "https://res.cloudinary.com/dgi9fzukm/image/upload/v1642768116/YelpCamp/ht5zdc1hdp4nukno8evz.jpg",
          filename: "YelpCamp/ht5zdc1hdp4nukno8evz",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita aspernatur veritatis facilis in ipsam quisquam eos reiciendis provident ab molestias praesentium repudiandae distinctio natus, tempora sapiente libero nesciunt odio ipsum?",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
