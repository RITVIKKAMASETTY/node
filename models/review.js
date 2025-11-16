import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
comment: { type: String, required: true },
rating: { type: Number, required: true, min: 1, max: 5 },
createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Review', reviewSchema);
