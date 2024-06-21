import AlertModel from '../models/alert.model.js';
import { Router } from "express";
const router = Router();
import handler from 'express-async-handler';
import {getMessaging} from 'firebase-admin/messaging';
import DevicesModel from "../models/devices.model.js";

// import  serviceAccount from '../disaster-management-7d158-firebase-adminsdk-ct68t-bcb45ab821.json';
// const fcm = "dBabgXL9QiyCpsTEq3Qht1:APA91bFKUZEofak1B-tvUSOrh9x5BOr0kNTfb12V98oDdi4GqTQw2ZdKgMt_ccjYkhO3FIPQL8mFXnUZC7Vqh3uKHZK-6QEl4BQQCf79jM_zkiWcQGIetNX43xbFZSQ0fZJyHk51cRiS";

// const firebaseAdmin = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

router.post('/store', handler(async (req, res) => {
        
        const {disasterType, warnningLevel, message} = req.body;
    
        const newAlert = {
            alertID: (await generateID(disasterType)),
            disasterType,
            warnningLevel,
            message,
        };
        await sendPushNotifications(fcm,"Hi","Hello");
    
        try{
            await AlertModel.create(newAlert);
            res.send(true);
        } catch(error){
            res.status(BAD_REQUEST).send("Alert send failed");
        }
}));


router.post('/send', handler(async (req, res) => {
  
  const responses = [];
  const fcmTokens = await DevicesModel.find({},'fcm');
  console.log(fcmTokens);
  
  for (const token of fcmTokens) {
    const message = {
      data: {
        type: 'A Big Tsunami Wave',
        location: 'Kalutara'
      },
      token: token.toJSON().fcm
    };
    try {
      const response = await getMessaging().send(message);
      console.log('Successfully sent message:', response);
      responses.push(response);
    } catch (error) {
      console.log('Error sending message:', error);
      responses.push({ error: error.message });
    }
  }

  res.send(responses);
}));



// const sendPushNotifications = async(token,title,body)=>{
//     await firebaseAdmin.messaging().send(token,{
//         notification:{
//             title,
//             body
//         }
//     });
// }

const generateID = async(disasterType) => {
    return Date.now().toString()+disasterType;
};

export default router;


