import express from "express";
import Sport from "../schemas/sports.js";
import {check_key} from "../commons/common_functions.js";

const sports_router = express.Router();

sports_router.post('/add_sport', async (req, res) => {
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
    if(req.query.name == null || req.query.category == null ) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing name or category!"
        })
        return;
    }
    const query = Sport.findOne({name: req.query.name});
    let query_result = await query.exec();
    if(query_result !== null) {
        res.status(403).json({
            title: "Resource already exists",
            message: "Resource already exists"
        })
        return;
    }
    const new_sport = new Sport({
        name: req.query.name,
        category: req.query.category,
    })

    try {
        const saved_sport = await new_sport.save()
        res.status(201).json(saved_sport)
    } catch (err) {

        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})
sports_router.get('/all_sports', async (req, res) => {
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
    try {
        const sports = await Sport.find();
        res.status(200).json(sports);
    } catch(err) {
        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})
sports_router.get('/find_sport/:sportName', async (req, res) => {
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
    try {
        const sports = await Sport.findOne( {'name': req.params.sportName} ) ;
        res.status(200).json(sports);
    } catch(err) {
        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})

export default sports_router;
