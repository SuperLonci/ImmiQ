import {PrismaClient} from '@prisma/client';
import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '$env/static/private';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({request}) => {
    try {
        const {email, password, name} = await request.json();

        // Validate input
        if (!email || !password || !name) {
            return json({success: false, message: 'All fields are required'}, {status: 400});
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if (existingUser) {
            return json({success: false, message: 'User with this email already exists'}, {status: 400});
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

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
        console.error('Registration error:', error);
        return json(
            {success: false, message: 'An error occurred during registration'},
            {status: 500}
        );
    } finally {
        await prisma.$disconnect();
    }
};