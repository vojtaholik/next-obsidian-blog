import { getPosts } from '@/lib/posts'
import type { Post } from '@/lib/schemas'

export const convertPostsToNavStructure = async () => {
  const posts = await getPosts()
  return posts.reduce((acc: any, post: Post) => {
    let current = acc
    post.path?.forEach((pathPart: any) => {
      if (!current[pathPart]) {
        current[pathPart] = {}
      }
      current = current[pathPart]
    })
    current[post.slug] = post
    return acc
  }, {})
}
