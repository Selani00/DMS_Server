import { model, Schema } from "mongoose";

export const Devices = new Schema(
    {
        fcm : {type: String, required: true},
        email: {type: String, required: true},
    },

    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

const DevicesModel = model('devices', Devices);

export default DevicesModel;
