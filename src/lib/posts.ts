import { getBaseUrl } from '@/utils/get-base-url'

export async function getPosts() {
  try {
    const posts = await fetch(`${getBaseUrl()}/api/posts`, {
      method: 'GET',
    }).then((res) => res.json())
    console.log({ posts })
    return posts
  } catch (error) {
    console.error(error)
    return []
  }
}
