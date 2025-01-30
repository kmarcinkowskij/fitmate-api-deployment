import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, index: true, auto: true},
    email: {type: String, required: true},
    login: {type: String, required: true},
    password_hashed: {type: String, required: true},
    password_salt: {type: String, required: true},
    bmi: {type: Number, required: true},
    height: {type: Number, required: true},
    weight: {type: Number, required: true},
    date_created: {type: Date, required: true},
    last_active: {type: Date},
    favourite_sports: {type: [String]},
    schedules: [{type: mongoose.Types.ObjectId}],
    training_plans: [{type: mongoose.Types.ObjectId}]
})

const model = mongoose.model('users', userSchema)
export default model