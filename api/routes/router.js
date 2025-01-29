import express from "express";
import {check_key} from "../commons/common_functions.js";

const fitmate_router = express.Router();

fitmate_router.get('/', async (req, res) => {
    console.log("attempted call!");
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
        res.status(200).json({"message": "Connection successful!" });
    } catch (err) {
        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})


export default fitmate_router;