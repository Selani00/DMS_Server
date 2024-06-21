import { Router } from "express";
import handler from 'express-async-handler';
import DevicesModel from "../models/devices.model.js";

const router = Router();

router.post('/newDevice', handler(async (req, res) => {
    const {fcm, email} = req.body;

    const newDevice = {
        fcm,
        email,
    };

    try{
        if(await DevicesModel.findOne({email: email})){
            const result = await DevicesModel.updateOne({email:email}, newDevice);
            res.send(result);
        } else {
            const result = await DevicesModel.create(newDevice);
            res.send(result);
        }
    } catch(error){
        res.status(BAD_REQUEST).send("Device registration failed");
    }
}));

export default router;


