import type { Post } from '@/lib/schemas'

export const convertPostsToNavStructure = (posts: Post[]) => {
  return posts.reduce((acc: any, post) => {
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
