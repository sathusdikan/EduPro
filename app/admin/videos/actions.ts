'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function addVideo(formData: FormData) {
    const supabase = await createClient()

    const subjectId = formData.get('subjectId') as string
    const title = formData.get('title') as string
    const youtubeUrl = formData.get('youtubeUrl') as string

    const { error } = await supabase.from('videos').insert({
        subject_id: subjectId,
        title,
        youtube_url: youtubeUrl
    })

    if (error) {
        console.error('Error creating video', error)
        // return { error: error.message }
    }

    revalidatePath('/admin/videos')
}

export async function deleteVideo(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase.from('videos').delete().eq('id', id)

    if (error) {
        console.error('Error deleting video', error)
        // return { error: error.message }
    }

    revalidatePath('/admin/videos')
}
