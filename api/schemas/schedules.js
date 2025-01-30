import mongoose from 'mongoose';

const schedule_schema = new mongoose.Schema({
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
    }],
    training_plans: [{
        plan: {type: mongoose.Schema.Types.ObjectId}
    }],

});

const model = mongoose.model('scheduleSchema', schedule_schema);
export default model;