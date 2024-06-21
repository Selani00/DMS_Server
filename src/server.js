import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import userRouter from './routers/user.router.js';
import disasterRequestRouter from './routers/request.router.js'
import disasterReportRouter from './routers/report.router.js'
import newsRouter from './routers/news.router.js'
import shelterRouter from './routers/shelter.router.js'
import mapRouter from './routers/maps.router.js'
import volunteerRouter from './routers/volunteer.router.js'
import ContactRouter from './routers/contact.router.js'
import RoadCloseRouter from './routers/roadClosure.router.js'
import EmailRouter from './routers/email.router.js'
import botRouter from './routers/chat.router.js';
import liveChatRouter from './routers/livechat.router.js';
import alertRouter from './routers/alerts.router.js';
import deviceRouter from './routers/devices.router.js';
import {Server} from 'socket.io';
import {dbconnect} from './config/database.config.js';
import http from 'http';
import multer from 'multer';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());

app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173'],
    })
);

app.use('/api/users',userRouter);
app.use('/api/requests',disasterRequestRouter);
app.use('/api/reports', disasterReportRouter);
app.use('/api/chatbot',botRouter);
app.use('/api/livechat',liveChatRouter);
app.use('/api/news', newsRouter);
app.use('/api/shelters', shelterRouter);
app.use('/api/maps', mapRouter);
app.use('/api/volunteers', volunteerRouter);
app.use('/api/contacts', ContactRouter);
app.use('/api/roadCloses', RoadCloseRouter);
app.use('/api/email', EmailRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/devices', deviceRouter);

dbconnect();
process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: applicationDefault(),
  id:"disaster-management-7d158"
})

const PORT = 4800;
server.listen(PORT,/*0.0.0.0"*/() =>{
    console.log('listening on port '+ PORT);
})

io.on('connection', async (socket) => {
  console.log('User connected',socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected',socket.id);
  });

  socket.on('message', async(data) => {
    console.log(data);
    socket.broadcast.emit('message', data);
    const newMessage = new chatMessage(data);
    await newMessage.save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  });

  
});