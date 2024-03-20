import { type Post } from './schemas'
import { glob } from 'glob'
import { compileMDX } from 'next-mdx-remote/rsc'
import slugify from '@sindresorhus/slugify'
import path from 'path'
import fs from 'fs/promises'

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
        content: await parseObsidianContent(content),
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

  const orderedPosts = posts.sort((a, b) => {
    return a.path.join('/').localeCompare(b.path.join('/'))
  })

  return orderedPosts as Post[]
}

const parseObsidianContent = async (content: string) => {
  // replace obsidian's image markup ![[image.png]] with standard html image tag
  const imgRegex = /!\[\[(.*?)\]\]/g
  const imgTag = `![/images/$1](/images/$1)`
  content = content.replace(imgRegex, imgTag)
  return content
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
