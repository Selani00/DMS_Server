import {model, Schema} from 'mongoose';

export const ChatMessageSchema = new Schema(
    {
        messageID: {type: String, required: true,unique: true},
        sender: {type: String, required: false,unique: false},
        userName: {type: String, required: true,unique: false},
        message: {type: String, required: true,unique: false},
        
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject : {
            virtuals: true,
        },
    }
);

const ChatMessageModel = model('chatmessages', ChatMessageSchema);

export default ChatMessageModel;

