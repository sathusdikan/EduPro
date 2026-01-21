'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type PaymentResult = {
    success: boolean
    message?: string
    error?: string
    transactionId?: string
}

/**
 * Generate a unique transaction ID for payment tracking
 */
function generateTransactionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `TXN-${timestamp}-${random}`.toUpperCase()
}

/**
 * Process a payment for a package purchase
 * @param packageId - The ID of the package being purchased
 * @param userId - The ID of the user making the purchase (optional, will use authenticated user if not provided)
 */
export async function processPayment(packageId: string, userId?: string): Promise<PaymentResult> {
    const supabase = await createClient()

    // 1. Authenticate User securely on server side
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'User not authenticated. Please log in and try again.' }
    }

    // Use the authenticated user's ID (ignore userId parameter for security)
    const authenticatedUserId = user.id

    // 2. Data Operations using Admin Client to bypass RLS for insertion
    const adminSupabase = createAdminClient()

    // Generate unique transaction ID
    const transactionId = generateTransactionId()

    try {
        // Verify Package Exists and is active
        const { data: pkg, error: pkgError } = await adminSupabase
            .from('packages')
            .select('*')
            .eq('id', packageId)
            .eq('is_active', true)
            .single()

        if (pkgError || !pkg) {
            // Record failed payment
            await adminSupabase.from('payments').insert({
                user_id: authenticatedUserId,
                package_id: packageId,
                amount: 0,
                status: 'failed',
                transaction_id: transactionId,
                error_message: 'Package not found or inactive',
            })
            return { success: false, error: 'Package not found or is no longer available.' }
        }

        // 3. Calculate Dates
        const startDate = new Date()
        const endDate = new Date(startDate)

        // Handle 0 duration as 3-day trial correctly
        if (pkg.duration_months === 0) {
            endDate.setDate(endDate.getDate() + 3)
        } else {
            endDate.setMonth(endDate.getMonth() + pkg.duration_months)
        }

        // 4. Deactivate existing active packages
        const { error: deactivateError } = await adminSupabase
            .from('user_packages')
            .update({ is_active: false })
            .eq('user_id', authenticatedUserId)
            .eq('is_active', true)

        if (deactivateError) {
            console.error('Error deactivating old packages:', deactivateError)
            // Continue anyway - not critical
        }

        // 5. Insert new User Package
        const { data: newUserPackage, error: insertError } = await adminSupabase
            .from('user_packages')
            .insert({
                user_id: authenticatedUserId,
                package_id: pkg.id,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                is_active: true,
            })
            .select()
            .single()

        if (insertError || !newUserPackage) {
            console.error('Payment Insertion Error:', insertError)

            // Record failed payment
            await adminSupabase.from('payments').insert({
                user_id: authenticatedUserId,
                package_id: pkg.id,
                amount: pkg.price,
                status: 'failed',
                transaction_id: transactionId,
                error_message: insertError?.message || 'Failed to create user package',
            })

            return {
                success: false,
                error: 'Failed to process payment. Please try again or contact support.'
            }
        }

        // 6. Record successful payment transaction
        const { data: paymentRecord, error: paymentError } = await adminSupabase
            .from('payments')
            .insert({
                user_id: authenticatedUserId,
                package_id: pkg.id,
                user_package_id: newUserPackage.id,
                amount: pkg.price,
                status: 'completed',
                transaction_id: transactionId,
                payment_method: 'mock_card',
            })
            .select()
            .single()

        if (paymentError) {
            console.error('Error recording payment:', paymentError)
            // Don't fail the transaction if payment record fails - package is already created
        }

        // 7. Transfer money to admin's wallet (if payment amount > 0)
        if (pkg.price > 0 && paymentRecord) {
            try {
                // Get the main admin ID
                const { data: adminIdData } = await adminSupabase.rpc('get_main_admin_id')
                const adminId = adminIdData

                if (adminId) {
                    // Get or create admin wallet
                    const { data: wallet } = await adminSupabase
                        .from('admin_wallet')
                        .select('*')
                        .eq('admin_id', adminId)
                        .single()

                    const currentBalance = wallet?.balance || 0
                    const newBalance = Number(currentBalance) + Number(pkg.price)

                    // Update admin wallet balance
                    await adminSupabase
                        .from('admin_wallet')
                        .upsert({
                            admin_id: adminId,
                            balance: newBalance,
                            total_earnings: (wallet?.total_earnings || 0) + Number(pkg.price),
                            updated_at: new Date().toISOString(),
                        })

                    // Record wallet transaction
                    const { data: walletTxn } = await adminSupabase
                        .from('wallet_transactions')
                        .insert({
                            admin_id: adminId,
                            payment_id: paymentRecord.id,
                            transaction_type: 'credit',
                            amount: pkg.price,
                            balance_before: currentBalance,
                            balance_after: newBalance,
                            description: `Payment from user for ${pkg.name}`,
                        })
                        .select()
                        .single()

                    // Link wallet transaction to payment
                    if (walletTxn) {
                        await adminSupabase
                            .from('payments')
                            .update({ wallet_transaction_id: walletTxn.id })
                            .eq('id', paymentRecord.id)
                    }
                }
            } catch (walletError) {
                console.error('Error updating admin wallet:', walletError)
                // Don't fail the payment if wallet update fails
            }
        }

        // 8. Revalidate pages
        revalidatePath('/dashboard')
        revalidatePath('/pricing')
        revalidatePath('/admin/dashboard')

        return {
            success: true,
            message: 'Payment processed successfully!',
            transactionId
        }
    } catch (error) {
        console.error('Unexpected error in processPayment:', error)

        // Record failed payment
        try {
            await adminSupabase.from('payments').insert({
                user_id: authenticatedUserId,
                package_id: packageId,
                amount: 0,
                status: 'failed',
                transaction_id: transactionId,
                error_message: error instanceof Error ? error.message : 'Unknown error',
            })
        } catch (recordError) {
            console.error('Failed to record error payment:', recordError)
        }

        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.'
        }
    }
}
