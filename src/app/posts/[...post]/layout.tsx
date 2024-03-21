import { getPosts } from '@/lib/posts'
import type { Post } from '@/lib/schemas'
import { convertPostsToNavStructure } from '@/utils/convert-posts-to-nav-structure'
import { uniq } from 'lodash'
import Link from 'next/link'
import React from 'react'

const PostLayout: React.FC<
  React.PropsWithChildren<{ params: { post: string | string[] } }>
> = async ({ children, params }) => {
  const posts = await getPosts()
  // const navStructure: {
  //   [category: string]: {
  //     [slug: string]: Post
  //   }
  // } = await convertPostsToNavStructure()

  const folders = uniq(
    posts.flatMap((post) => {
      return post.path
    })
  )
  const postsByFolder = folders.map((folder) => {
    return posts.filter((post) => {
      return folder && post.path?.includes(folder)
    })
  })

  const postsForFolder = (folder: string) => {
    return posts.filter((post) => {
      return folder && post.path?.includes(folder)
    })
  }

  const navStructure = folders.map((folder) => {
    const posts = folder && postsForFolder(folder)
    return {
      folder,
      posts,
    }
  })

  return (
    <div className="flex gap-5 md:flex-row flex-col w-full max-w-screen-lg relative">
      <aside className="w-[400px] flex flex-col gap-3">
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
        <div className="w-full">
          {navStructure &&
            navStructure.map((folder) => {
              return (
                <div
                  className="flex flex-col gap-3 mt-5 w-full"
                  key={folder.folder}
                >
                  <strong className="font-bold">{folder.folder}</strong>
                  <ul className="flex flex-col gap-1">
                    {folder?.posts &&
                      folder.posts.map((post: Post) => {
                        const isActive = params?.post?.includes(post.slug)
                        return (
                          <li key={post.slug} className="w-full">
                            <Link
                              className={`${
                                isActive ? 'underline' : 'opacity-85'
                              } hover:opacity-100 transition`}
                              href={`/posts/${post.path?.join('/')}/${
                                post.slug
                              }`}
                            >
                              {post.frontmatter?.title || post.title}
                            </Link>
                          </li>
                        )
                      })}
                  </ul>
                </div>
              )
            })}
        </div>
      </aside>
      <article className="w-full">{children}</article>
    </div>
  )
}

export default PostLayout
