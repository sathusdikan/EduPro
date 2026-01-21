'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createSubject(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Create subject
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    const { error } = await supabase.from('subjects').insert({
        name,
        description
    })

    if (error) {
        console.error('Error creating subject', error)
        return { error: error.message }
    }

    revalidatePath('/admin/subjects')
    revalidatePath('/dashboard')
}

export async function deleteSubject(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase.from('subjects').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/subjects')
    revalidatePath('/dashboard')
}
