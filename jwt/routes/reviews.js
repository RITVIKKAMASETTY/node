import {Router} from "express";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import listingschema,{ reviewschema } from "../utils/Schema.js";
const reviewsrouter=Router();
reviewsrouter.get("/:id",wrapAsync(async(req,res)=>{
  const listing = await Listing.findById(req.params.id).populate('reviews');
  if(!listing){
    return res.status(404).send({error:"Listing not found"});
  }
  const reviews = listing.reviews;
  res.send(reviews);
}));
export default reviewsrouter;