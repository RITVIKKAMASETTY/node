import express from 'express';
import mongoose from 'mongoose';
import listingsrouter from './routes/listings.js';
import reviewsrouter from './routes/reviews.js';
import session from 'express-session';
import passport from 'passport';
import localStrategy from 'passport-local';
import User from './models/users.js';
import usersrouter from './routes/users.js';
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb://localhost:27017/mydatabase';
app.use(express.json());
app.set('view engine', 'ejs');
app.use(session({
  secret: 'thisisasecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    expires: Date.now() + 1000 * 60 * 60,
    httpOnly: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
main()
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log(err));
// function validateListing(req,res,next){
//   const {error} = listingschema.validate(req.body);
//   if(error){
//     const msg = error.details.map(el=>el.message).join(',');
//     throw new ExpressError(msg,400);
//   }else{
//     next();
//   }
// }
async function main() {
  await mongoose.connect(MONGO_URI);
}
app.use((req, res, next) => {
  const method = req.method;
  const url = req.url;
  console.log(`Received ${method} request for ${url}`);
  next();
});


app.use('/listings', listingsrouter);
app.use('/getreviews', reviewsrouter);
app.use("/user",usersrouter);
// app.get("/listings", async (req, res) => {
//   try {
//     // const sampleListings = new Listing({
//     //   title: "Sample Listing",
//     //   description: "This is a sample listing description.",
//     //   price: 100,
//     //   location: "Sample Location",
//     //   image: ""
//     // });

//     // await sampleListings.save();
//     const listings = await Listing.find({});
//     res.send(listings);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch listings" });
//   }
// });

// app.get("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
//     const listing = await Listing.findById(req.params.id);
//     if(!listing){
//       return res.status(404).send({error:"Listing not found"});
//     }
//     res.send(listing.toJSON());
// }));

// app.post("/listings",wrapAsync(async (req,res)=>{
//     const newListing = new Listing(req.body);
//     await newListing.save();
//     res.status(201).send(newListing.toJSON());
// }));
// app.post("/listings/:id/reviews",wrapAsync(async (req,res)=>{
//   const data=req.body;
//   const listingId=req.params.id;
//   console.log(data,listingId);
//     const listing = await Listing.findById(req.params.id);
//     console.log(listing);
//     if(!listing){
//       return res.status(404).send({error:"Listing not found"});
//     }
//     const {error} = reviewschema.validate(req.body);
//     if(error){
//       const msg = error.details.map(el=>el.message).join(',');
//       throw new ExpressError(msg,400);
//     } 
    
//     const review = await Review.create({
//     rating: req.body.rating,
//     comment: req.body.comment,
//   });
//     listing.reviews.push(review._id);
//     await listing.save();
//     res.status(201).send(listing.toJSON());
// }));
// app.get("/getreviews/:id",wrapAsync(async(req,res)=>{
//   const listing = await Listing.findById(req.params.id).populate('reviews');
//   if(!listing){
//     return res.status(404).send({error:"Listing not found"});
//   }
//   const reviews = listing.reviews;
//   res.send(reviews);
// }));
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//   const {id,reviewId}=req.params;
//   const listing = await Listing.findById(id);
//   if(!listing){
//     return res.status(404).send({error:"Listing not found"});
//   }
//   console.log(listing,id,reviewId);
//   listing.reviews.pull(reviewId);
//   await listing.save();
//   await Review.findByIdAndDelete(reviewId);
//   res.send({message:"Review deleted successfully"});
// }));
app.use((err,req,res,next)=>{
  const {statusCode=500}=err;
  if(!err.message) err.message="Something went wrong";
  res.status(statusCode).send({error:err.message});
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;