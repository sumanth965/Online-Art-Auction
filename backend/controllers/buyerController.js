import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Buyer from "../models/buyerModel.js";

/* =========================
   REGISTER BUYER
========================= */
export const registerBuyer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // ✅ Check existing buyer
        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create buyer
        await Buyer.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "Buyer registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/* =========================
   LOGIN BUYER
========================= */
export const loginBuyer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // ✅ Find buyer
        const buyer = await Buyer.findOne({ email });
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found",
            });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, buyer.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // ✅ Generate JWT
        const token = jwt.sign(
            {
                id: buyer._id,
                name: buyer.name,
                role: "buyer",
            },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
            buyer: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
