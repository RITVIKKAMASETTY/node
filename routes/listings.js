import { Router } from "express";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import listingschema, { reviewschema } from "../utils/Schema.js";
import { authmiddleware } from "../utils/middleware.js";

const listingsrouter = Router();

// GET + POST LISTINGS
listingsrouter
  .route("/")
  .get(authmiddleware, async (req, res) => {
    try {
      const listings = await Listing.find({})
        .populate("reviews")
        .populate("owner");
      res.send(listings);
    } catch (err) {
      res.status(500).send({ error: "Failed to fetch listings" });
    }
  })
  .post(
    authmiddleware,
    wrapAsync(async (req, res) => {
      const newListing = new Listing(req.body);

      console.log("Logged-in user:", req.user);

      newListing.owner = req.user.id;
      await newListing.save();
      res.status(201).send(newListing.toJSON());
    })
  );

// VALIDATION MIDDLEWARE
function validateListing(req, res, next) {
  const { error } = listingschema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

// GET SPECIFIC LISTING
listingsrouter.get(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send({ error: "Listing not found" });
    }
    res.send(listing.toJSON());
  })
);

// ADD REVIEW
listingsrouter.post(
  "/:id/reviews",
  authmiddleware,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).send({ error: "Listing not found" });
    }

    const { error } = reviewschema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }

    const review = await Review.create({
      rating: req.body.rating,
      comment: req.body.comment,
    });

    listing.reviews.push(review._id);
    await listing.save();

    res.status(201).send(listing.toJSON());
  })
);

// DELETE REVIEW
listingsrouter.delete(
  "/:id/reviews/:reviewId",
  authmiddleware,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send({ error: "Listing not found" });
    }

    listing.reviews.pull(reviewId);
    await listing.save();
    await Review.findByIdAndDelete(reviewId);

    res.send({ message: "Review deleted successfully" });
  })
);

export default listingsrouter;
