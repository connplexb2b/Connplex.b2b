import mongoose from "mongoose";

const franchiseAdsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        investmentRange: {
            type: String,
            required: true,
        },
        preferredCity: {
            type: String,
            required: true,
        },
        hasProperty: {
            type: String,
            required: true,
        },
        timeline: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const FranchiseAds = mongoose.model("FranchiseAds", franchiseAdsSchema);
export default FranchiseAds;
