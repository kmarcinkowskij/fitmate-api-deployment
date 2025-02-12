import express from "express";
import {check_key} from "../commons/common_functions.js";

const fitmate_router = express.Router();

fitmate_router.get('/', async (req, res) => {
    console.log("attempted call!");
    if(!req.query.api_key) {
        console.log("access denied!");
        res.status(403).json({
            title: "Access denied",
            message: "API key not provided!",
            status: 403
        })
        return;
    }
    console.log("api key checked!");
    if(!await check_key(req.query.api_key)) {
        res.status(403).json({
            title: "Access denied",
            message: "API key invalid!",
            status: 403
        })
        return;
    }
    try {
        console.log("connected!");
        res.status(200).json({"message": "Connection successful!", status: 200});
        return;
    } catch (err) {
        console.log("an error has occured!");
        res.status(500).json({
            title: "internal error",
            message: err.message,
            status: 500
        })
        return;
    }
})


export default fitmate_router;