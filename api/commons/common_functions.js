import Developer_account from "../schemas/developer_account.js";
import mongoose from "mongoose";
import User_account from "../schemas/user_account.js";
import bcrypt from "bcrypt";

export const get_date = () => {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    return yourDate.toISOString().split('T')[0];
}

export const check_key = async (v_api_key) => {
    try {
        let query = Developer_account.findOne({api_key: new mongoose.Types.ObjectId(v_api_key)});
        const dev = await query.exec();
        if(dev == null) {
            console.log("wrong api key!" + v_api_key);
            return false;
        }
        let calls = dev.call_count.valueOf();
        query = Developer_account.findOneAndUpdate({api_key: v_api_key}, {call_count: calls + 1});
        await query.exec();
        return true;
    }catch(err) {
        return false;
    }
}

export const check_email_availability = async (v_email) => {
    try {
        let query = User_account.findOne({email: v_email});
        const result = await query.exec();
        if(result == null) {
            console.log("email not taken!");
            return true;
        }
        return false;
    }catch(err) {
        return false;
    }
}

export const check_login_availability = async (v_login) => {
    try {
        let query = User_account.findOne({login: v_login});
        const result = await query.exec();
        if(result == null) {
            console.log("login not taken!");
            return true;
        }
        return false;
    }catch(err) {
        return false;
    }
}

export const check_user_password = async (v_user_login, v_password) => {
    try {
        let query = User_account.findOne({login: v_user_login});
        const result = await query.exec();
        if(result == null) {
            console.log("login not taken!");
            return 404;
        }
        let actual_password_hashed = result.password_hashed;
        const salt = result.password_salt;
        const hashed_password = await bcrypt.hash(v_password, salt);
        return hashed_password === actual_password_hashed;
    }catch(err) {
        return false;
    }
}

export const username_to_id = async (v_username) => {
    try{
        let query = User_account.findOne({login: v_username});
        const result = await query.exec();
        if(result === null) {
            return false;
        }
        return result.id;
    }catch(err){
        return false;
    }
}