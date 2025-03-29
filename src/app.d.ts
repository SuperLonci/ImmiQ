// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            user: Omit<User, 'password'> | null;
        }

        interface PageData {
            user?: Omit<User, 'password'> | null;
        }

        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
