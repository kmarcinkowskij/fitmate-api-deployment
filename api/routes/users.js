import bcrypt from "bcrypt";
import User_account from "../schemas/user_account.js";
import express from "express";
import {
    assert_sport_exists,
    check_email_availability,
    check_key,
    check_login_availability,
    check_user_password,
    get_date
} from "../commons/common_functions.js";
import {Types} from "mongoose";
import plan from "../schemas/plan.js";
import Plan from "../schemas/plan.js";

const users_router = express.Router();

users_router.post('/add_user', async (req, res) => {
    if( req.body.email == null ||
        req.body.login == null ||
        req.body.password == null ||
        req.body.bmi == null ||
        req.body.height == null ||
        req.body.weight == null)
    {
        res.status(400).json({
            title: "Bad Request",
            message: "missing parameters!",
            status: 400
        })
        return;
    }


    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!",
            status: 403
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!",
            status: 403
        })
        return;
    }
    if(!await check_login_availability(req.body.login)) {
        res.status(409).json({
            title: "Access denied",
            message: "login already taken!",
            status: 409
        })
        return;
    }
    if(!await check_email_availability(req.body.email)) {
        res.status(409).json({
            title: "Access denied",
            message: "email already taken!",
            status: 409
        })
        return;
    }
    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    let new_user = new User_account( {
        email: req.body.email,
        login: req.body.login,
        password_hashed: hashed_password,
        password_salt: salt,
        bmi: req.body.bmi,
        height: req.body.height,
        weight: req.body.weight,
        date_created: get_date(),
        last_active: get_date()
    });

    try {
        const saved_user = await new_user.save()
        res.status(201).json({
            message: `saved user ${saved_user.login}`,
            status: 201
        }
    );
    } catch (err) {

        res.status(500).json({
            title: "internal error",
            message: err.message,
            status: 500

        })
    }
})

users_router.get('/authenticate_user/', async (req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!",
            status: 403
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!",
            status: 403
        })
        return;
    }
    if(req.query.login == null || req.query.password == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing login or password!",
            status: 400
        })
    }
    try {
        if(await check_user_password(req.query.login, req.query.password) === 404) {
            res.status(404).json({
                title: "Requested resource not found!",
                message: "wrong login!",
                status: 404
            })
            return;
        }
        if (!await check_user_password(req.query.login, req.query.password)) {
            res.status(403).json({
                title: "Access Denied",
                message: "wrong login or password!",
                status: 403
            })
            return;
        }
        res.status(200).json({
            title: "Authentication complete",
            message: `Hello, ${req.query.login}!`,
            status: 200
        });
    } catch(err) {
        res.status(500).json({
            title: "internal error",
            message: err.message,
            status: 500
        })
    }
})

users_router.get('/find_user/', async(req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!",
            status: 403
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!",
            status: 403
        })
        return;
    }
    if(req.query.user == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing login",
            status: 400
        })
        return;
    }
    let query = User_account.findOne({login: req.query.user});
    const result = await query.exec();
    if(result === null) {
        res.status(404).json({
            title: "Requested resource not found!",
            message: "A user with this login was not found. Are you sure the login is correct?",
            status: 404
        })
        return;
    }
    res.status(200).json({
        title: "user found!",
        message: result.id,
        status: 404
    });
})

users_router.get('/get_plans', async (req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!",
            status: 403
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!",
            status: 403
        })
        return;
    }
    if(req.query.user_id == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing id!",
            status: 400
        })
    }

    let query = User_account.findOne({id: req.query.user_id});
    const result = await query.exec();
    if(result === null) {

        res.status(404).json({
            title: "Requested resource not found!",
            message: "A user with this login was not found. Are you sure the login is correct?",
            status: 404
        })
        return;
    }
    // res.status(200).json({
    //     title: "user found!",
    //     message: result.id,
    //     status: 404
    // });

    let user_plans = Array.from(result.training_plans);
    let plan_query = Plan.find({
        id: { $in: user_plans
            }  })

    // let plan_query = Plan.findOne({
    //          'id': user_plans[0]
    // })
    const plans_result = await plan_query.exec();


    if(plans_result === null) {
        res.status(404).json({
            title: "Requested resource not found!",
            message: "A plan with this id was not found. Are you sure the id is correct?",
            status: 404
        })
        return;
    }

    res.status(200).json({
        title: "user's plans found!",
        message: plans_result,
        status: 200
    });


});

users_router.post('/add_plan_user_id', async (req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!",
            status: 403
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!",
            status: 403
        })
        return;
    }
    if(req.query.id == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing id!",
            status: 400
        })
    }
    if( req.body.name == null ||
        req.body.sport == null ||
        req.body.duration_in_minutes == null ||
        req.body.priority == null ||
        req.body.location == null ||
        req.body.weekday == null)
    {
        res.status(400).json({
            title: "Bad Request",
            message: "missing parameters!",
            status: 400
        })
        return;
    }



    let sport_id = new Types.ObjectId(req.body.sport);
    let plan_id = new Types.ObjectId();

    if(!await assert_sport_exists(sport_id)) {
        res.status(400).json({
            title: "Bad Request",
            message: "This sport does not exist!",
            status: 400
        })
        return;
    }
    let new_plan = new plan({
        id: plan_id,
        name: req.body.name,
        date_created: get_date(),
        sport: sport_id,
        duration_in_minutes: req.body.duration_in_minutes,
        priority: req.body.priority,
        location: req.body.location,
        weekday: req.body.weekday
    })



    const query = User_account.findOneAndUpdate({id: req.query.id}, { $push: {training_plans: {
                _id: plan_id
            }}});

    let result = await query.exec();
    const saved_plan = new_plan.save();
    if(result === null || saved_plan === null) {
        res.status(505).json({
            title: "internal error!",
            message: "an error has occured!",
            status: 505
        })
        return;
    }
    res.status(202).json({
        title: "update successful!",
        status: 202
    })
})

export default users_router;
