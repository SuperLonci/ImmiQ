import {PrismaClient} from '@prisma/client';
import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '$env/static/private';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({request}) => {
    try {
        const {email, password} = await request.json();

        // Validate input
        if (!email || !password) {
            return json({success: false, message: 'Email and password are required'}, {status: 400});
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if (!user) {
            return json({success: false, message: 'Invalid credentials'}, {status: 401});
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return json({success: false, message: 'Invalid credentials'}, {status: 401});
        }

        // Create a JWT token
        const token = jwt.sign(
            {userId: user.id},
            JWT_SECRET,
            {expiresIn: '7d'}
        );

        // Return success with the token as a cookie
        return json(
            {success: true},
            {
                headers: {
                    'Set-Cookie': `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
                }
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return json(
            {success: false, message: 'An error occurred during login'},
            {status: 500}
        );
    } finally {
        await prisma.$disconnect();
    }
};