import e from "express";
import userModel from "../models/user.model.js";

const createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const newUser = new userModel({ email, password, name, role });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.find({ email, password });
        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.status(200).json({ message: "Login successful", user: user[0] });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await userModel.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}

export { createUser, getUserByEmail, loginUser, deleteUser };