import {Router} from "express";
import * as centerOfInterestController from "../controllers/centerOfInterest";
import {CenterOfInterest} from "../interfaces";
import {isAuthenticated, jsonParser} from "../infrastructure/authentication";

const router: Router = Router();

router.post('/matchByName', isAuthenticated, jsonParser, async (req, res) => {
    const name: string = req.body.search;
    const centerOfInterests: CenterOfInterest[] = await centerOfInterestController.matchByName(name);

    let ResponseCenterOfInterest: Array<any> = [];
    for (const centerOfInterest of centerOfInterests) {
        ResponseCenterOfInterest.push({
            value: centerOfInterest.id,
            name: centerOfInterest.name,
        });
    }
    res.json(ResponseCenterOfInterest);
});

export default router;