import express from "express";
import Developer_account from "../schemas/developer_account.js";
import {check_key, get_date} from "../commons/common_functions.js";

const devs_router = express.Router();

devs_router.post('/dev_add', async (req, res)=> {
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
    if(req.query.email == null || req.query.key_name == null) {
        res.status(400).json({
            title: "Bad Request",
            message: "missing name or category!"
        })
        return;
    }
    const new_dev = new Developer_account({
        email: req.query.email,
        key_name: req.query.key_name,
        date_created: get_date(),
        call_count: 0
    })

    try {
        const saved_dev = await new_dev.save()
        res.status(201).json({
            message: `${saved_dev}\n\n\tSave your api key! ${saved_dev.api_key}`,
        })
    }catch(err){
        res.status(500).json({
            title: "internal error",
            message: err.message
        })
    }
})

export default devs_router;