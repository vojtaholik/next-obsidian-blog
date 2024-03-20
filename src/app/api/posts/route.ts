import path from 'path'
import * as fs from 'node:fs/promises'
import * as glob from 'glob'
import slugify from '@sindresorhus/slugify'
import { compileMDX } from 'next-mdx-remote/rsc'
import { PostSchema, type Post } from '@/lib/schemas'
import type { NextRequest } from 'next/server'

const VAULT =
  process.env.NODE_ENV === 'development' ? './public/vault' : './public/vault'

export const GET = async (
  _: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const files = glob.sync(path.join(VAULT, '**', '*.{md,mdx}'))

  const posts = await Promise.all(
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
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const parseObsidianContent = async (content: string) => {
  // replace obsidian's image markup ![[image.png]] with standard html image tag
  const imgRegex = /!\[\[(.*?)\]\]/g
  const imgTag = `![/vault/$1](/vault/$1)`
  content = content.replace(imgRegex, imgTag)
  return content
}
