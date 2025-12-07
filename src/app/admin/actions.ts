'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createArticle(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const image_url = formData.get('image_url') as string
  const category = formData.get('category') as string

  // Validasi simpel
  if (!title || !content) {
    return { message: 'Judul dan Konten wajib diisi!', status: 'error' }
  }

  // Insert ke Supabase
  const { error } = await supabase.from('articles').insert({
    title,
    content,
    image_url,
    category,
  })

  if (error) {
    return { message: 'Gagal posting artikel.', status: 'error' }
  }

  // Refresh halaman biar data baru langsung muncul
  revalidatePath('/dashboard/educare')
  revalidatePath('/admin')

  return { message: 'Artikel berhasil diterbitkan!', status: 'success' }
}
