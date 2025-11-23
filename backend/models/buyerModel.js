import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Buyer = mongoose.model("Buyer", buyerSchema);

export default Buyer;
