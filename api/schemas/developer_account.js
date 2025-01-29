import mongoose from "mongoose";

const developerSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, index: true, auto: true},
    api_key: {type: mongoose.Schema.Types.ObjectId, required: true, auto: true},
    key_name: {type: String, required: true},
    email: {type: String, required: true},
    date_created: {type: Date, required: true},
    last_call: {type: Date},
    call_count: {type: Number, required: true, default: 0}
})

const model = mongoose.model('developers', developerSchema)
export default model