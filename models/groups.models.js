const mongoose = require("mongoose");

// model step: 1
const groupModel = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        creator: {
            type: String,
            trim: true,
        },
        creator_name: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
        },
        description: {
            type: String,
        },
        avatar: {
            type: String,
        },
        type: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        },
        members:
            [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
        ,
        joinRequests: {
            type: [
                {
                    user: { // User reference using ObjectId and ref
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users',
                        required: true,
                    },
                    date: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            default: [],
        },
        discordInviationLink: {
            type: String,
            trim: true
        },
        eventChangeAt: Date,
    }
);


module.exports = mongoose.model('group', groupModel)
