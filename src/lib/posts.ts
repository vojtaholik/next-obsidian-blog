import path from 'path'
import * as fs from 'node:fs/promises'
import * as glob from 'glob'
import slugify from '@sindresorhus/slugify'
import { compileMDX } from 'next-mdx-remote/rsc'
import { PostSchema, type Post } from './schemas'

const VAULT =
  process.env.NODE_ENV === 'development' ? './public/vault' : '/vault'

export async function getPosts() {
  const files = glob.sync(path.join(VAULT, '**', '*.{md,mdx}'))
  return Promise.all(
    files.map(async (filepath) => {
      const contentBuffer = await fs.readFile(filepath)
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
          .replace('public/vault/', '')
          .replace(`${filename}`, '')
          .split(path.sep)
          .filter(Boolean),
      }

      return PostSchema.parse(post)
    })
  )
}

const parseObsidianContent = async (content: string) => {
  // replace ![[gitfoundations.png]] with standard html image tag
  const imgRegex = /!\[\[(.*?)\]\]/g
  const imgTag = `![/vault/$1](/vault/$1)`
  content = content.replace(imgRegex, imgTag)
  return content
}
