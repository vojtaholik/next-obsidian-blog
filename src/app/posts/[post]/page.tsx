import { getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

const PostPage: React.FC<{
  params: {
    post: string
  }
}> = async ({ params }) => {
  const posts = await getPosts()
  const post = posts.find((post) => post.slug === params.post)

  if (!post) notFound()

  const frontmatter = post.frontmatter

  return (
    <div>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {frontmatter?.published ? 'Published' : 'Draft'}
      <MDXRemote
        components={{
          // custom components
          Image: (props) => (
            <Image {...props} quality={100} className="aspect-video" />
          ),
          h1: (props) => <h1 style={{ color: 'tomato' }} {...props} />,
        }}
        source={post.content}
        options={{
          parseFrontmatter: true,
        }}
      />
    </div>
  )
}

export default PostPage
