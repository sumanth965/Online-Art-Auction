import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
}, { timestamps: true });


const Buyer = mongoose.model("Buyer", buyerSchema);

export default Buyer;
