import { Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { FamilyPlanModel } from "../models/familyPlan.model.js";
import { UserModel } from "../models/user.model.js";

const router = Router();

router.post('/createPlan', handler(async (req, res) => {
    const { title, content, email,category} = req.body;

    // Validate request body
    if (!title || !content || !email || !category) {
        return res.status(BAD_REQUEST).send("Missing required fields");
    }
    const newPlan = {
        planId: await generatePlanId(),
        email,
        title,
        content,
        category
    }
    try {
        const planCreated = await FamilyPlanModel.create(newPlan);
        res.send(planCreated);
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).send("Plan create failed");
    }
}));

router.get('/getPlans/:email', handler(async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(BAD_REQUEST).send("Email parameter is required");
    }

    try {
        // Fetch all plans with the same email
        const plans = await FamilyPlanModel.find({ email:email });
        res.send(plans);
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(INTERNAL_SERVER_ERROR).send("Plan fetch error");
    }
}));

//delete a plan
router.delete('/deletePlan/:planId', handler(async (req, res) => {
    const { planId } = req.params;
    if (!planId) {
        return res.status(BAD_REQUEST).send("Missing required fields");
    }
    try {
        const result = await FamilyPlanModel.deleteOne({ planId:planId});
        res.send(result);
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).send("Plan delete failed");
    }
}));

//update a plan
router.put('/updatePlan', handler(async (req, res) => {
    const { planId, title, content,category } = req.body;
    if (!planId || !title || !content || !category) {
        return res.status(BAD_REQUEST).send("Missing required fields");
    }
    try {
        await FamilyPlanModel.updateOne({ planId:planId}, { title:title, content:content,category:category});
        const updatedPlan = await FamilyPlanModel.findOne({planId:planId});
        return res.send(updatedPlan);
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).send("Plan update failed");
    }
}));

const generatePlanId = async () => {
    // Generate random id
    const count = await FamilyPlanModel.countDocuments();
    const id = Math.floor(Math.random() * 1000000);
    const planId = `${id}_${count}`;
    return planId;
};

export default router;
