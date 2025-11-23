import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Buyer from "../models/buyerModel.js";

// Register Buyer
export const registerBuyer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer)
            return res.status(400).json({ success: false, message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await Buyer.create({ email, password: hashedPassword });

        res.json({ success: true, message: "Buyer registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Login Buyer
export const loginBuyer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const buyer = await Buyer.findOne({ email });
        if (!buyer)
            return res.status(400).json({ success: false, message: "Buyer not found" });

        const valid = await bcrypt.compare(password, buyer.password);
        if (!valid)
            return res.status(401).json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: buyer._id }, process.env.JWT_SECRET || "secret123", {
            expiresIn: "1d",
        });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
