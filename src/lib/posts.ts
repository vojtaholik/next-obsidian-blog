import path from 'path'
import * as fs from 'node:fs/promises'
import slugify from '@sindresorhus/slugify'
import { compileMDX } from 'next-mdx-remote/rsc'
import { PostSchema, type Post } from './schemas'

const VAULT = './public/vault'

export async function getPosts() {
  const files = await fs.readdir(VAULT)
  const mdFiles = files.filter(
    (file) => file.endsWith('.md') || file.endsWith('.mdx')
  )
  return Promise.all(
    mdFiles.map(async (filename) => {
      const contentBuffer = await fs.readFile(path.join(VAULT, filename))
      const content = contentBuffer.toString()
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
      }

      return PostSchema.parse(post)
    })
  )
}

const parseObsidianContent = async (content: string) => {
  // replace ![[gitfoundations.png]] with standard html image tag
  const imgRegex = /!\[\[(.*?)\]\]/g
  const imgTag = `<img src="/vault/$1" alt="$1" />`
  content = content.replace(imgRegex, imgTag)
  return content
}
