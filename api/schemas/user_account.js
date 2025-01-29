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
    schedules: [{
        schedule: {
            days: {
                monday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                },
                tuesday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                },
                wednesday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                },
                thursday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                },
                friday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                },
                saturday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                },
                sunday: {
                    empty: {type: Boolean, default: true},
                    data:
                        [{
                            beginning_time_hour: {type: Number},
                            beginning_time_minutes: {type: Number},
                            plan_id: {type: mongoose.Schema.Types.ObjectId},
                        }],
                }
            }
        },
        training_plans: [{
            plan: {type: planSchema}
        }],
    }]

})

const model = mongoose.model('users', userSchema)
export default model