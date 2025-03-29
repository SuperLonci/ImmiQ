import {PrismaClient} from '@prisma/client';
import type {Handle} from '@sveltejs/kit';
import {sequence} from '@sveltejs/kit/hooks';
import {redirect} from '@sveltejs/kit';
import * as cookie from 'cookie';
import {JWT_SECRET} from '$env/static/private';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Authentication hook to handle session management
const auth: Handle = async ({event, resolve}) => {
    // DEMO MODE: Set this to true to automatically use user1 for all requests
    const DEMO_MODE = true;

    if (DEMO_MODE) {
        try {
            // Find user1 in the database
            const demoUser = await prisma.user.findFirst({
                where: {name: 'User One'}
            });

            console.log("Demo user found:", demoUser); // Add this line

            if (demoUser) {
                // Don't expose the password in the session
                const {password, ...userWithoutPassword} = demoUser;
                event.locals.user = userWithoutPassword;
                console.log("Setting demo user in locals:", event.locals.user); // Add this

                // Skip the rest of the auth process
                return resolve(event);
            } else {
                console.warn('Demo user "user1" not found in database');
                // If user1 doesn't exist, continue with normal auth flow
            }
        } catch (err) {
            console.error('Error finding demo user:', err);
        }
    }

    // Normal authentication flow
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const token = cookies.session;

    event.locals.user = null;

    if (token) {
        try {
            // Verify the JWT token
            const decoded = jwt.verify(token, JWT_SECRET);
            if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
                // Fetch the user from the database
                const user = await prisma.user.findUnique({
                    where: {id: decoded.userId as string}
                });

                if (user) {
                    // Don't expose the password in the session
                    const {password, ...userWithoutPassword} = user;
                    event.locals.user = userWithoutPassword;
                }
            }
        } catch (err) {
            // Token is invalid or expired
            console.error('Session token validation failed:', err);
        }
    }

    // Protected routes handling
    const protectedRoutes = ['/buildings/new', '/profile', '/buildings/edit'];
    if (protectedRoutes.some(route => event.url.pathname.startsWith(route)) && !event.locals.user) {
        throw redirect(303, '/login');
    }

    return resolve(event);
};

// Log requests for debugging
const logger: Handle = async ({event, resolve}) => {
    const start = Date.now();
    const response = await resolve(event);
    const end = Date.now();
    console.log(`${event.request.method} ${event.url.pathname} - ${response.status} in ${end - start}ms`);
    return response;
};

// Export the combined handlers
export const handle = sequence(auth, logger);