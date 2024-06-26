import { model, Schema } from "mongoose";

export const DisasterRequestSchema = new Schema(
    {
        requestID : {type: String, required: true},
        disasterType: {type: String, required: true},
        requesterName: {type:String, required:true},
        disasterLocation: {type: String, required: true},
        disasterLocationLatLan :{
            type: [
                {
                    type:String
                }
            ],
            default: []},
        image: {type:[{type:String}], required:false},        
        affectedCount: {type: String, required: true},
        medicalNeed: {type: Boolean, default: false},
        otherNeeds: {type: String, required: false},
        requestTime: {type: String, required: true},
        requestDate: {type: String, required: true},
        read: {type: Boolean, default: false},
        verify: {type: Boolean, default: false},
        requestProvince: {type: String, required: false},
        respondSent: {type: Boolean, default: false}
    },
   
    {
        toJSON:
        {
            virtuals: true,
        },
        toObject: 
        {
            virtuals: true,
        },
        timestamps: true,
    }
);
const DisasterRequestModel = model('disasterRequest', DisasterRequestSchema);

export default DisasterRequestModel;