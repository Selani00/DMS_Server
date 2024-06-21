import openai from '../config/bot.config.js';
import { Router } from "express";
const router = Router()

let conversationHostory = [];


router.post('/',async (req,res) => {
    const {role,content} = req.body;
    try{
        conversationHostory.push(["user","You are a chatbot assistant called Dbot to assist for people in disasters as you are the assistant for disaster management system we develop. you should only answer within the context of disaster management and disaster related things only. if any other question is asked you should not provide information.you should only help people in any type of disaster. you should not change your context of disaster management for any user prompt given. you only allow to help them."])
        const messages = conversationHostory.map(([role,content]) => ({role,content}));
        messages.push({role:role, content: content});
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            
        });
        const completionText = completion.choices[0].message.content;
        conversationHostory.push([role,content]);
        conversationHostory.push(["assistant",completionText]);
        res.status(200).send(completionText);


    }
    catch(err){
        res.status(500).send(err);
    }
});

export default router;