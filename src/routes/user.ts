import express, { Request, Response } from 'express';
import { authMiddleWare } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({error: 'Email and Password are required'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = await prisma.user.create({
            data: {email, password: hashedPassword},
        });
        res.status(201).json({id: user.id, email: user.email});
    } catch(error){
        res.status(400).json({error: 'User already exist'});
    }
}); 

// Login a user
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({error: 'Email and Password are required'})
    }

    try {
        const user = await prisma.user.findUnique({
        where: {
            email
        }
        })
        if ( !user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({error: 'Invalid credentials'})
            return
        }

        const token = jwt.sign({userId: user.id}, 'your-secret-key', {expiresIn: '1h'});
        res.json({token}
    )
    } catch (error) {
        res.status(500).json({error: 'Login Failed'})
    }
})

// Reset a user password
router.put('/reset-password', authMiddleWare, async (req: Request & {user?: {userId: number}}, res: Response) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        res.status(401).json({error: 'Email and Password is required'})
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            res.status(401).json({error: 'Invalid Email'})
            return
        }
        const updatedPassword = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: newHashedPassword
            }
        })
        res.status(200).json({message: 'Password Updated!'})
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({error: 'Login Failed'})
    }
})
export default router