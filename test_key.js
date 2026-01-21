const { createServerClient } = require('@supabase/ssr');

const url = 'https://vzvkkcjenvjpkdyhjeya.supabase.co';
const key = 'sb_publishable_a68z-2BcaT3LNXU17UjHvQ_nv0FF0mZ';

console.log("Testing Supabase Client Creation...");

try {
    const client = createServerClient(url, key, {
        cookies: {
            getAll() { return [] },
            setAll() { }
        }
    });
    console.log("Client created successfully.");
} catch (error) {
    console.error("Error creating client:", error);
}
