import type { Post } from '@/lib/schemas'

export async function parseBacklinks(posts: Post[]): Promise<Post[]> {
  const postMap = new Map<string, Post>()
  const slugMap = new Map<string, Post[]>()

  posts.forEach((post) => {
    const key = Array.isArray(post.path)
      ? [...post.path, post.slug].join('/')
      : [post.path, post.slug].join('/')
    postMap.set(key, post)
    if (!slugMap.has(post.slug)) {
      slugMap.set(post.slug, [])
    }
    slugMap.get(post.slug)!.push(post)
  })

  posts.forEach((post) => {
    if (!post.content) return

    const backlinkRegex = /\[\[([^\]]+)\]\]/g
    let match

    while ((match = backlinkRegex.exec(post.content)) !== null) {
      const backlinkRef = match[1]
      let referencedPosts: Post[] = []

      if (postMap.has(backlinkRef)) {
        referencedPosts.push(postMap.get(backlinkRef)!)
      } else if (
        slugMap.has(backlinkRef.split('/')[backlinkRef.split('/').length - 1])
      ) {
        // If no direct path/slug match, try to match by slug only and get all possible matches
        referencedPosts = slugMap.get(
          backlinkRef.split('/')[backlinkRef.split('/').length - 1]
        )!
      }

      referencedPosts.forEach((referencedPost) => {
        if (!referencedPost.backlinks) {
          referencedPost.backlinks = []
        }
        // Add backlink info if it's not already there to avoid duplicates
        const backlinkExists = referencedPost.backlinks.some(
          (bl) =>
            bl.slug === post.slug &&
            bl.title === post.title &&
            JSON.stringify(bl.path) === JSON.stringify(post.path)
        )
        if (!backlinkExists) {
          referencedPost.backlinks.push({
            title: post.title,
            slug: post.slug,
            path: post.path,
          })
        }
      })
    }
  })

  return posts
}
