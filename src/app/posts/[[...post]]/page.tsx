import { getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

const PostPage: React.FC<{
  params: {
    post: string | string[]
  }
}> = async ({ params }) => {
  const posts = await getPosts()

  // create routes for each post in the vault, respecting its folder structure
  const post = Array.isArray(params.post)
    ? posts.find(
        (post) =>
          post.slug === params.post[params.post.length - 1] &&
          post.path?.join('/') ===
            (params.post.slice(0, -1) as string[]).join('/')
      )
    : posts.find((post) => post.slug === params.post)

  if (!post) notFound()

  const frontmatter = post.frontmatter

  return (
    <div>
      <h1 className="text-4xl font-bold">{frontmatter?.title || post.title}</h1>

      <div className="prose sm:prose-lg prose-invert">
        <MDXRemote
          components={{
            // custom components
            img: ({ src, alt = '' }) => {
              console.log({ src })
              return src ? (
                <Image
                  width="800"
                  height="600"
                  alt={alt}
                  src={src}
                  quality={100}
                  className="aspect-video"
                />
              ) : null
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
        <pre>{JSON.stringify(frontmatter)}</pre>
      </div>
    </div>
  )
}

export default PostPage
