import { Router } from "express";
import handler from "express-async-handler";
import { ShelterModel } from "../models/shelter.model.js";
import { BAD_REQUEST } from "../constants/httpStatus.js";

const router = Router();

router.post('/createShelter', handler(async(req, res) => {
    const {
        shelterName,
        location,
        locationLatLang,
        shelterType,
        phoneNumber,
        personInCharge
    } = req.body;

    const shelterId = await shelterIDGenerate(location, shelterType);

    const newShelter = {
        shelterId: shelterId,
        shelterName,
        location,
        locationLatLang,
        shelterType,
        phoneNumber,
        personInCharge
    };

    try {
        const result = await ShelterModel.create(newShelter);
        res.send(result);
    } catch(error) {
        console.error(error);
        res.status(BAD_REQUEST).send("Shelter creation failed");
    }
}));

router.post('/getAll', handler(async(req, res) => {
    try {
        const shelters = await ShelterModel.find({});
        res.send(shelters);
    } catch(error) {
        console.error(error);
        res.status(BAD_REQUEST).send("Shelter retrieval failed");
    }
}));

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = degree => degree * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

router.post('/getNearbyShelters', handler(async (req, res) => {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(BAD_REQUEST).send("Invalid latitude or longitude");
    }

    console.log(`Received coordinates: Latitude - ${latitude}, Longitude - ${longitude}`);

    try {
        const shelters = await ShelterModel.find({});
        console.log('Fetched shelters:', shelters);

        const nearbyShelters = shelters.filter(shelter => {
            const shelterCoords = shelter.locationLatLang[0];
            if (!shelterCoords) {
                return false;
            }

            const { latitude: shelterLat, longitude: shelterLon } = shelterCoords;
            const distance = calculateDistance(latitude, longitude, shelterLat, shelterLon);
            return distance <= 10; // 5 km radius
        });

        res.send(nearbyShelters);
    } catch (error) {
        console.error('Error:', error);
        res.status(BAD_REQUEST).send("Error retrieving nearby shelters");
    }
}));

router.post('/getShelters', handler(async(req, res) => {
    const { ids } = req.body;

    try {
        const shelters = await ShelterModel.find({ shelterId: { $in: ids } });
        res.send(shelters);
    } catch(error) {
        console.error(error);
        res.status(BAD_REQUEST).send("Shelter retrieval failed");
    }
}));

router.post('/deleteShelter', handler(async(req, res) => {
    const { shelterId } = req.body;

    try {
        const result = await ShelterModel.deleteOne({ shelterId });
        res.send(result);
    } catch(error) {
        console.error(error);
        res.status(BAD_REQUEST).send("Shelter deletion failed!");
    }
}));

const shelterIDGenerate = async(location, shelterType) => {
    let number = 1;
    const idString = location.substring(0, 2) + shelterType.substring(0, 1);
    let id = idString + number.toString().padStart(3, '0');

    let ids = await ShelterModel.find({ shelterId: id });

    while(ids.length > 0) {
        number++;
        id = idString + number.toString().padStart(3, '0');
        ids = await ShelterModel.find({ shelterId: id });
    }

    return id;
};

export default router;
