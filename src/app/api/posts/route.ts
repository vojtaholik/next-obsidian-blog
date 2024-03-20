import path from 'path'
import type { NextRequest } from 'next/server'
import { getPosts } from '@/lib/posts'

const VAULT =
  process.env.NODE_ENV === 'development'
    ? './vault'
    : path.join(process.cwd(), 'vault')

export const GET = async (
  _: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const posts = await getPosts()
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
