import { model, Schema } from "mongoose";

export const FamilyPlanSchema = new Schema(
    {
        planId : {type: String, required: true, unique: true},
        email : {type: String, required: true},
        title: {type: String, required: true},
        category: {type: String, required: true},
        content: {type: String, required: true},
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

export const FamilyPlanModel = model('familyPlans', FamilyPlanSchema);