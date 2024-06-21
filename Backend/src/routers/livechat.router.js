import { Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import ChatMessageModel from "../models/livechat.model.js";
import handler from 'express-async-handler';

const router = Router();

// router.post('/store', handler(async (req, res) => {
    
//         const {sender, userName, message} = req.body;
    
//         const newMessage = {
//             messageID: (await generateID(userName)),
//             sender,
//             userName,
//             message,
//         };
    
//         try{
//             await ChatMessageModel.create(newMessage);
//             res.send(true);
//         } catch(error){
//             res.status(BAD_REQUEST).send("Message send failed");
//         }
// }));

router.get('/getAll',handler(async (req,res)=>{
    try {
        const messages = await ChatMessageModel.find(); // Retrieve all messages from the collection
        res.send(messages);
    } catch (error) {
        res.status(BAD_REQUEST).send("Failed to get messages");
    }
}));




export default router;