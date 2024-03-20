import { getPosts } from '@/lib/posts'
import type { Post } from '@/lib/schemas'
import Link from 'next/link'
import React from 'react'

export default async function PostLayout({
  params,
  children,
}: {
  params: {
    post: string | string[]
  }
  children: React.ReactNode
}) {
  const posts = await getPosts()
  const navStructure: {
    [category: string]: {
      [slug: string]: Post
    }
  } = convertPostsToNavStructure(posts)

  return (
    <div className="flex gap-5 md:flex-row flex-col w-full max-w-screen-lg">
      <aside>
        {/* {posts && (
          <ul>
            {posts.map((post) => {
              const isActive = Array.isArray(params.post)
                ? post.slug === params.post[params.post.length - 1] &&
                  post.path?.join('/') ===
                    (params.post.slice(0, -1) as string[]).join('/')
                : post.slug === params.post
              return post.path ? (
                <ul>
                  <strong>{post.path.join('/')}</strong>
                  <li className="" key={post.slug}>
                    {isActive ? '> ' : ''}
                    <a href={`/posts/${post.path?.join('/')}/${post.slug}`}>
                      {post.title}
                    </a>
                  </li>
                </ul>
              ) : (
                <li key={post.slug}>
                  {isActive ? '> ' : ''}
                  <a href={`/posts/${post.slug}`}>{post.title}</a>
                </li>
              )
            })}
          </ul>
        )} */}
        {navStructure && (
          <ul>
            {Object.entries(navStructure).map(([key, value]) => {
              return (
                <li key={key}>
                  <strong>{key}</strong>
                  <ul>
                    {Object.entries(value).map(([key, value]) => {
                      return (
                        <li key={key}>
                          <Link
                            href={`/posts/${value.path?.join('/')}/${value.slug}
                        `}
                          >
                            {value.frontmatter?.title || value.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
        )}
      </aside>
      <article>{children}</article>
    </div>
  )
}

const convertPostsToNavStructure = (posts: Post[]) => {
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
