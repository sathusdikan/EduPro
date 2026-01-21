// Run this file to create the 3 packages in your database
// Usage: node seed-packages.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPackages() {
    console.log('Creating packages...');

    const packages = [
        {
            name: '3-Day Trial',
            description: 'Try our platform with full access for 3 days',
            price: 0.00,
            duration_months: 0,
            features: [
                'Access to all subjects',
                'HD video lessons',
                'Interactive quizzes',
                '3-day full access'
            ],
            is_active: true
        },
        {
            name: '1-Month Package',
            description: 'One month of unlimited learning access',
            price: 999.00,
            duration_months: 1,
            features: [
                'Access to all subjects',
                'HD video lessons',
                'Interactive quizzes',
                'Progress tracking',
                '30 days access'
            ],
            is_active: true
        },
        {
            name: '3-Month Package',
            description: 'Three months of comprehensive learning',
            price: 2499.00,
            duration_months: 3,
            features: [
                'Access to all subjects',
                'HD video lessons',
                'Interactive quizzes',
                'Progress tracking',
                'Priority support',
                '90 days access'
            ],
            is_active: true
        }
    ];

    for (const pkg of packages) {
        const { data, error } = await supabase
            .from('packages')
            .insert(pkg)
            .select();

        if (error) {
            console.error(`Error creating ${pkg.name}:`, error.message);
        } else {
            console.log(`✓ Created: ${pkg.name} (₹${pkg.price})`);
        }
    }

    console.log('\nDone! Check /admin/packages to see the packages.');
}

createPackages();

