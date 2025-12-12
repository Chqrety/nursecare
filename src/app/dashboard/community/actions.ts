'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. BUAT POSTINGAN BARU
export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { message: 'Harus login!', status: 'error' }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) return { message: 'Judul dan isi wajib diisi.', status: 'error' }

  const { error } = await supabase.from('community_posts').insert({
    user_id: user.id,
    title,
    content,
  })

  if (error) return { message: 'Gagal posting.', status: 'error' }

  revalidatePath('/dashboard/community')
  return { message: 'Cerita berhasil dibagikan!', status: 'success' }
}

// 2. TOGGLE LIKE (Like/Unlike)
export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  // Cek udah like belum
  const { data: existingLike } = await supabase
    .from('community_likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existingLike) {
    // Kalau udah -> Hapus (Unlike)
    await supabase.from('community_likes').delete().eq('user_id', user.id).eq('post_id', postId)
  } else {
    // Kalau belum -> Insert (Like)
    await supabase.from('community_likes').insert({ user_id: user.id, post_id: postId })
  }

  revalidatePath('/dashboard/community')
}

// 3. TAMBAH KOMENTAR
export async function addComment(postId: string, commentText: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  if (!commentText.trim()) return

  await supabase.from('community_comments').insert({
    user_id: user.id,
    post_id: postId,
    comment_text: commentText,
  })

  revalidatePath('/dashboard/community')
}
