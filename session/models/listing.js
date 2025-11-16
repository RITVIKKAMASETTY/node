import mongoose from "mongoose";
import Review from './review.js';
import User from './users.js';
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image:{ type: String ,set:(v)=> v===""? 'https://via.placeholder.com/150':v},
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
listingSchema.post('findOneAndDelete', async function (doc) {
  if (doc)
  {
await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
})
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;