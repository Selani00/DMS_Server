import {model, Schema} from 'mongoose';

export const ShelterSchema = new Schema(
    {
        shelterId: {type: String, required: true},
        shelterName: {type: String, required: true},
        location: {type: String, required: true},
        locationLatLang: {type: [
            {
              latitude: Number,
              longitude: Number
            }
          ], default: []},
        shelterType: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        personInCharge: {type: String, required: true}
    },
    {
        timestamps: false,
        toJSON: {
            virtuals: true,
        },
        toObject : {
            virtuals: true,
        },
    }
);

const ShelterModel = model('shelters', ShelterSchema);

export default ShelterModel;