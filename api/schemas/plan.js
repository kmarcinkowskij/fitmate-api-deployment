import mongoose from "mongoose";

export const planSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String},
    date_created: {type: Date},
    sport: {type: mongoose.Schema.Types.ObjectId},
    duration_in_minutes: {type: Number},
    priority: {type: String, enum: ['high', 'medium', 'low']},
    weekday: {type: Number, enum:[1,2,3,4,5,6,7]},
    location: {
        lat: {type: Number},
        lng: {type: Number}
    }
})
const model = mongoose.model('plans', planSchema)
export default model
