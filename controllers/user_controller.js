import User from "../models/User.js";
import { hashPassword } from "../utils/hash_pwd.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password length must be >= 6 " });
        }
        const foundUser = await User.findOne({ $or: [{ email }, { username }] });
        if (foundUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPwd = await hashPassword(password);
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPwd
        });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required " });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const verified = await bcrypt.compare(password, user.password);
        if (!verified) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        //generate jwt token
        generateToken(user._id, user.role, res);
        res.status(200).json({
            message: "Logged in successfuly",
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
};

export const myProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};