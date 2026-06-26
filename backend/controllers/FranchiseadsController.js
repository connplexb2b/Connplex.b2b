import FranchiseAds from "../models/FranchiseAds.js";

export const createFranchiseAds = async (req, res) => {
    try {
        const { name, email, phone, state, city, investmentRange, preferredCity, hasProperty, timeline } = req.body;
        if (!name || !email || !phone || !state || !city || !investmentRange || !preferredCity || !hasProperty || !timeline) {
            return res.status(400).json({ status: 400, message: "Missing required fields" });
        }
        // Save entry into Database
        const newLead = await FranchiseAds.create(req.body);
        return res.status(201).json({
            status: 201,
            message: "Franchise ads created successfully",
            data: newLead
        });
    } catch (error) {
        console.error("Error creating franchise ad lead:", error);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};
