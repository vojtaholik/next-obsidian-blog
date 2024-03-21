import * as React from 'react'
import { getPost, getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import { ImageLightbox } from '@/components/image-lightbox'
// import type { Post } from '@/lib/schemas'
import path from 'path'
// import { join } from 'path'
import sizeOf from 'image-size'
import { readFile } from 'fs/promises'

const PostPage: React.FC<{
  params: {
    post: string | string[]
  }
}> = async ({ params }) => {
  const posts = await getPosts()

  if (!posts) {
    console.error('No posts found')
    return notFound()
  }
  const last = params.post[params.post.length - 1] || params.post
  const post = await getPost(last as string)

  if (!post) {
    console.error('No post found')
    return notFound()
  }

  const frontmatter = post.frontmatter
  const title = frontmatter?.title || post.title

  const imageUrlsFromPost = post.content
    .match(/!\[.*?\]\((.*?)\)/g)
    ?.map((match) => match.match(/!\[.*?\]\((.*?)\)/)?.[1])

  const imagesWithDimensions = imageUrlsFromPost?.map(async (image) => {
    const imageDir = path.join(process.cwd(), 'public', image as string)
    const imageBuffer = await readFile(imageDir)
    const { width, height } = sizeOf(imageBuffer)
    return {
      src: image,
      width: width,
      height: height,
    }
  })
  const imagesInPost =
    imagesWithDimensions && (await Promise.all(imagesWithDimensions))

  return (
    <div className="w-full pt-12">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="prose sm:prose-lg prose-invert w-full max-w-none">
        <MDXRemote
          components={{
            Grid: ({ children, className = '' }) => (
              <div className={`grid grid-cols-2 gap-5 ${className}`}>
                {children.props.children}
              </div>
            ),
            img: async ({ src, alt = '' }) => {
              // return null

              if (typeof src !== 'string') return null
              const imageDir = path.join(process.cwd(), 'public', src)
              const imageBuffer = await readFile(imageDir)
              const { width, height } = sizeOf(imageBuffer)

              return (
                <ImageLightbox
                  width={width?.toString() || '800'}
                  height={height?.toString() || '600'}
                  image={src}
                  images={imagesInPost as any}
                />
              )
            },
          }}
          source={post.content}
          options={{
            parseFrontmatter: true,
          }}
        />
      </div>
      <div>
        Meta:
        {frontmatter?.published ? 'Published' : 'Draft'}
        {/* <pre>{JSON.stringify(frontmatter)}</pre> */}
      </div>
    </div>
  )
}

export default PostPage
