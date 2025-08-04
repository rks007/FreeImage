import mongoose, { mongo } from "mongoose";

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    tags: [String],

    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"]
    },
    downloads: {
        type: Number,
        default: 0
    },
    isPremium: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Image = mongoose.model("Image", imageSchema);

export default Image;