import { getBaseUrl } from '@/utils/get-base-url'

export async function getPosts() {
  const posts = await fetch(`${getBaseUrl()}/api/posts`).then((res) =>
    res.json()
  )
  return posts
}
