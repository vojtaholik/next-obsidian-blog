import { getPosts } from '@/lib/posts'
import type { Post } from '@/lib/schemas'
import { convertPostsToNavStructure } from '@/utils/convert-posts-to-nav-structure'
import Link from 'next/link'
import React from 'react'

const PostLayout: React.FC<
  React.PropsWithChildren<{ params: { post: string | string[] } }>
> = async ({ children, params }) => {
  const posts = await getPosts()
  const navStructure: {
    [category: string]: {
      [slug: string]: Post
    }
  } = posts && (await convertPostsToNavStructure(posts))

  return (
    <div className="flex gap-5 md:flex-row flex-col w-full max-w-screen-lg">
      {posts && (
        <aside className="max-w-[230px] w-full">
          <Link href="/">
            <svg
              className="w-8 p-1"
              viewBox="0 0 48 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.2008 42V12.5708H30.315V6.685H36.2008V0.799164H47.9725V42H36.2008ZM24.4292 24.3425H30.315V30.2283H24.4292V42H18.5433V30.2283H12.6575V18.4567H6.77167V42H0.885834V0.799164H12.6575V6.685H18.5433V18.4567H24.4292V24.3425Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          {navStructure && (
            <ul className="mt-5 flex flex-col gap-3">
              {Object.entries(navStructure).map(([key, value]) => {
                return (
                  <li key={key}>
                    <strong>{key}</strong>
                    <ul>
                      {Object.entries(value).map(([key, value]) => {
                        const isActive = params?.post?.includes(value.slug)
                        return (
                          <li key={key}>
                            <Link
                              className={isActive ? 'underline' : ''}
                              href={`/posts/${value.path?.join('/')}/${
                                value.slug
                              }
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
      )}
      <article>{children}</article>
    </div>
  )
}

export default PostLayout
