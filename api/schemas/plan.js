import mongoose from "mongoose";

export const planSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    name: {type: String},
    date_created: {type: Date},
    sports: [{type: mongoose.Schema.Types.ObjectId}],
    duration_in_minutes: {type: Number},
    priority: {type: String, enum: ['high', 'medium', 'low']},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    }
})
const model = mongoose.model('plans', planSchema)
export default model
