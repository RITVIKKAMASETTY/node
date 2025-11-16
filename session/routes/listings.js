import express from "express";
import mongoose from "mongoose";
import { Router } from "express";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import listingschema,{ reviewschema } from "../utils/Schema.js";
import { authmiddleware } from "../utils/middleware.js";
const listingsrouter=Router();

listingsrouter.route("/")
.get(authmiddleware, async (req, res) => {
  try {
    // const sampleListings = new Listing({
    //   title: "Sample Listing",
    //   description: "This is a sample listing description.",
    //   price: 100,
    //   location: "Sample Location",
    //   image: ""
    // });

    // await sampleListings.save();
    const listings = await Listing.find({}).populate('reviews').populate('owner');
    res.send(listings);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch listings" });
  }
})
.post(authmiddleware,wrapAsync(async (req,res)=>{
    const newListing = new Listing(req.body);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    res.status(201).send(newListing.toJSON());
}));

// listingsrouter.get("/",authmiddleware, async (req, res) => {
//   try {
//     // const sampleListings = new Listing({
//     //   title: "Sample Listing",
//     //   description: "This is a sample listing description.",
//     //   price: 100,
//     //   location: "Sample Location",
//     //   image: ""
//     // });

//     // await sampleListings.save();
//     const listings = await Listing.find({}).populate('reviews').populate('owner');
//     res.send(listings);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch listings" });
//   }
// });
function validateListing(req,res,next){
  const {error} = listingschema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(',');
    throw new ExpressError(msg,400);
  }else{
    next();
  }
}
listingsrouter.get("/:id",validateListing,wrapAsync(async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return res.status(404).send({error:"Listing not found"});
    }
    res.send(listing.toJSON());
}));

// listingsrouter.post("/",authmiddleware,wrapAsync(async (req,res)=>{
//     const newListing = new Listing(req.body);
//     console.log(req.user);
//     newListing.owner = req.user._id;
//     await newListing.save();
//     res.status(201).send(newListing.toJSON());
// }));
listingsrouter.post("/:id/reviews",authmiddleware,wrapAsync(async (req,res)=>{
  const data=req.body;
  const listingId=req.params.id;
  console.log(data,listingId);
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if(!listing){
      return res.status(404).send({error:"Listing not found"});
    }
    const {error} = reviewschema.validate(req.body);
    if(error){
      const msg = error.details.map(el=>el.message).join(',');
      throw new ExpressError(msg,400);
    } 
    
    const review = await Review.create({
    rating: req.body.rating,
    comment: req.body.comment,
  });
    listing.reviews.push(review._id);
    await listing.save();
    res.status(201).send(listing.toJSON());
}));
listingsrouter.delete("/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  const {id,reviewId}=req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    return res.status(404).send({error:"Listing not found"});
  }
  console.log(listing,id,reviewId);
  listing.reviews.pull(reviewId);
  await listing.save();
  await Review.findByIdAndDelete(reviewId);
  res.send({message:"Review deleted successfully"});
}));
export default listingsrouter;