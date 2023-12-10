import {Request, Response, Router} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import * as userController from "../controllers/user";
import {CreateUserDTO, FilterUsersDTO, UpdateUserDTO} from "../dataTransferObjects/user.dto";
import {User} from "../interfaces";
import {isAuthenticated, jsonParser} from "../infrastructure/authentication";
import multer from "multer";

const router: Router = Router();
const upload: multer.Multer = multer({dest: 'uploads'})

router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
    let user: User = req.user as User;
    user = await userController.getById(user.id);

    let ResponseUser: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        hasSeenIntro: user.hasSeenIntro,
        profilePicture: user.profilePicture,
    }

    return res.status(200).send(ResponseUser);
});
router.put('/me', isAuthenticated, jsonParser, async (req: Request, res: Response) => {
    let user: User = req.user as User;
    user = await userController.getById(user.id);

    const payload: UpdateUserDTO = req.body;

    const result: User = await userController.update(user.id, payload);
    return res.status(201).send(result);
});

router.put('/me/updateProfilePic', isAuthenticated, upload.single('profilePicture'), async (req: Request, res: Response) => {
    try {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        let user: User = req.user as User;
        user = await userController.getById(user.id);

        // Accédez au fichier téléchargé depuis req.file
        const profilePicture: Express.Multer.File = req.file!;

        // Vérifiez que le fichier est une image
        if (!isImage(profilePicture.mimetype)) {
            // Si ce n'est pas une image, renvoyez une réponse d'erreur
            return res.status(400).json({error: 'Le fichier doit être une image.'});
        }

        const result: User = await userController.updateProfilePicture(user.id, profilePicture);

        return res.status(201).send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

function isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
}

router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const result: User = await userController.getById(id);
    return res.status(200).send(result);
});
router.get('/email/:email', isAuthenticated, async (req: Request, res: Response) => {
    const email: string = req.params.email;
    const result: User = await userController.getByEmail(email);
    return res.status(200).send(result);
});

router.put('/:id', isAuthenticated, async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const payload: UpdateUserDTO = req.body;

    const result: User = await userController.update(id, payload);
    return res.status(201).send(result);
});
router.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    const result: boolean = await userController.deleteById(id);
    return res.status(204).send({
        success: result
    });
});
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
    const payload: CreateUserDTO = req.body;
    const result: User = await userController.create(payload);
    return res.status(200).send(result);
});

router.get('/', isAuthenticated, async (req: Request, res: Response) => {
    const filters: FilterUsersDTO = req.body;
    const result: User[] = await userController.getAll(filters);
    return res.status(200).send(result);
});

export default router;