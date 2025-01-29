import mongoose from "mongoose";

const sportSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, index: true, auto: true},
    name: {type: String, required: true},
    category: {type: String,  required: true}
})

const model = mongoose.model('sport', sportSchema)
export default model