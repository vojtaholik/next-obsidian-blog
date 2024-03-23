import { type Post } from './schemas'
import { glob } from 'glob'
import { compileMDX } from 'next-mdx-remote/rsc'
import slugify from '@sindresorhus/slugify'
import path from 'path'
import fs from 'fs/promises'
import { parseBacklinks } from '@/utils/parse-backlinks'

export async function getPosts() {
  const files = await glob(
    path.join(process.cwd(), 'vault', '**', '*.{md,mdx}')
  )
  const pathStringToReplace = path.join(process.cwd(), 'vault')
  const posts = await Promise.all(
    files.map(async (filepath: string) => {
      const contentBuffer = await fs.readFile(filepath, 'utf8')
      const content = contentBuffer.toString()
      const filename = path.basename(filepath)
      const title = filename.replace(/\.mdx?$/, '')
      const { frontmatter } = await compileMDX<Pick<Post, 'frontmatter'>>({
        source: content,
        options: {
          parseFrontmatter: true,
        },
      })

      const post = {
        slug: slugify(title),
        title,
        content, // : await parseObsidianContent(content),
        frontmatter,
        path: filepath
          .replace(pathStringToReplace, '')
          .replace(`${filename}`, '')
          .split(path.sep)
          .filter(Boolean),
      }

      return post
    })
  )

  const postsWithBacklinks = await parseBacklinks(posts as Post[])
  const parseObsidianContent = await parseObsidianContentForPosts(
    postsWithBacklinks
  )

  const orderedPosts = parseObsidianContent.sort((a, b) => {
    return a?.path && b?.path
      ? a?.path.join('/').localeCompare(b?.path.join('/'))
      : 0
  })

  return orderedPosts as Post[]
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

  // const post = posts.find((post: Post) => post.slug === slug)
  if (!params) {
    const post = posts.find((post) => post.slug === slug)
    return post
  } else {
    const post = Array.isArray(params.post)
      ? posts.find(
          (post: Post) =>
            post.slug === params.post[params.post.length - 1] &&
            post.path?.join('/') ===
              (params.post.slice(0, -1) as string[]).join('/')
        )
      : posts.find((post) => post.slug === params.post)

    return post
  }
}

const parseObsidianContentForPosts = async (posts: Post[]): Promise<Post[]> => {
  return posts.map((post) => {
    let { content } = post

    // Replace obsidian's image markup ![[image.png]] with standard markdown image tag
    const imgRegex = /!\[\[(.*?)\]\]/g
    const imgTag = `![/images/$1](/images/$1)`
    content = content.replace(imgRegex, imgTag)

    // Replace [[wikilinks]] with markdown links
    const backlinkRegex = /\[\[(.*?)\]\]/g
    const linkTag = `[$1](/posts/$1)`
    content = content.replace(backlinkRegex, linkTag)

    // Return the post with updated content
    return {
      ...post,
      content,
    }
  })
}
