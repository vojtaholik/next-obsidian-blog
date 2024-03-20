import { getBaseUrl } from '@/utils/get-base-url'

export async function getPosts() {
  try {
    const posts = await fetch(`${getBaseUrl()}/api/posts`).then((res) =>
      res.json()
    )

    return posts
  } catch (error) {
    console.error(error)
    return []
  }
}
