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
import {get, Types} from "mongoose";
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
            message: "missing parameters!"
        })
        return;
    }


    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!"
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!"
        })
        return;
    }
    if(!await check_login_availability(req.body.login)) {
        res.status(409).json({
            title: "Access denied",
            message: "login already taken!"
        })
        return;
    }
    if(!await check_email_availability(req.body.email)) {
        res.status(409).json({
            title: "Access denied",
            message: "email already taken!"
        })
        return;
    }
    let password = req.body.password;
    consconst salt = await bcrypt.genSalt(10);
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
        res.status(201).json(`saved user ${saved_user.login}`);
    } catch (err) {

        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})

users_router.get('/authenticate_user/', async (req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!"
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!"
        })
        return;
    }
    if(req.query.login == null || req.query.password == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing login or password!"
        })
    }
    try {
        if(await check_user_password(req.query.login, req.query.password) === 404) {
            res.status(404).json({
                title: "Requested resource not found!",
                message: "wrong login!"
            })
            return;
        }
        if (!await check_user_password(req.query.login, req.query.password)) {
            res.status(403).json({
                title: "Access Denied",
                message: "wrong login or password!"
            })
            return;
        }
        res.status(200).json({
            title: "Authentication complete",
            message: `Hello, ${req.query.login}!`
        });
    } catch(err) {
        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})

users_router.get('/find_user/', async(req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!"
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!"
        })
        return;
    }
    if(req.query.user == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing login"
        })
    }
    let query = User_account.findOne({login: req.query.user});
    const result = await query.exec();
    if(result === null) {
        res.status(404).json({
            title: "Requested resource not found!",
            message: "A user with this login was not found. Are you sure the login is correct?"
        })
        return;
    }
    res.status(200).json({
        title: "user found!",
        message: result.id
    });
})

users_router.post('/add_plan_user_id', async (req, res) => {
    if(!req.query.api_key) {
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!"
        })
        return;
    }
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!"
        })
        return;
    }
    if(req.query.id == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing id!"
        })
    }
    if( req.body.name == null ||
        req.body.sport == null ||
        req.body.duration_in_minutes == null ||
        req.body.priority == null ||
        req.body.location == null)
    {
        res.status(400).json({
            title: "Bad Request",
            message: "missing parameters!"
        })
        return;
    }



    let sport_id = new Types.ObjectId(req.body.sport);
    let plan_id = new Types.ObjectId();

    if(!await assert_sport_exists(sport_id)) {
        res.status(400).json({
            title: "Bad Request",
            message: "This sport does not exist!"
        })
        return;
    }
    let new_plan = new plan({
        name: req.body.name,
        date_created: get_date(),
        sport: sport_id,
        duration_in_minutes: req.body.duration_in_minutes,
        priority: req.body.priority,
        location: req.body.location
    })


    const query = User_account.findOneAndUpdate({id: req.query.id}, { $push: {training_plans: {
                plan_id
            }}});
    let result = await query.exec();
    const saved_plan = new_plan.save();
    if(result === null || saved_plan === null) {
        res.status(505).json({
            title: "internal error!",
            message: "an error has occured!"
        })
        return;
    }
    res.status(202).json({
        title: "update successful!"
    })
})

export default users_router;