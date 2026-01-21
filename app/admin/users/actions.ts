'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleSubscription(formData: FormData) {
    const supabase = await createClient()

    const subscriptionId = formData.get('subscriptionId') as string
    const currentStatus = formData.get('currentStatus') === 'true'

    const { error } = await supabase.from('subscriptions').update({
        is_active: !currentStatus
    }).eq('id', subscriptionId)

    if (error) {
        console.error('Error toggling subscription', error)
    }

    revalidatePath('/admin/users')
}
