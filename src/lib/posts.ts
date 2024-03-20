import { getBaseUrl } from '@/utils/get-base-url'
import type { Post } from './schemas'

export async function getPosts() {
  try {
    const posts = await fetch(`${getBaseUrl()}/api/posts`, {
      method: 'GET',
    }).then((res) => res.json())
    // console.log({ posts })
    return posts
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getPost(
  slug: string,
  params?: { post: string | string[] }
) {
  const posts = await getPosts()
  if (!posts) {
    console.error('No posts found')
    return null
  }

  const post = posts.find((post: Post) => post.slug === slug)

  return post
}
