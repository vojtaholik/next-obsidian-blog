import { getPosts } from '@/lib/posts'
import type { Post } from '@/lib/schemas'
import slugify from '@sindresorhus/slugify'
import { uniq } from 'lodash'
import Link from 'next/link'
import React from 'react'

type TreeNode = {
  name: string
  children: Map<string, TreeNode>
  posts: Post[]
}

const buildTree = (posts: Post[]): TreeNode => {
  const root: TreeNode = { name: 'root', children: new Map(), posts: [] }

  posts.forEach((post) => {
    let currentNode = root
    let currentPath = '' // Initialize the current path
    post?.path?.forEach((pathName, index) => {
      // Update the current path as you go deeper
      currentPath += `${slugify(pathName)}/`
      if (!currentNode.children.has(pathName)) {
        currentNode.children.set(pathName, {
          name: pathName,
          children: new Map(),
          posts: [],
        })
      }
      currentNode = currentNode.children.get(pathName)!
    })
    // Set fullPath for the post
    // Trim trailing slash for consistency if preferred
    post.path = [`/${currentPath}${post.slug}`.replace(/\/$/, '')]
    currentNode.posts.push(post)
  })

  return root
}

// Conversion function to object for easier visualization
const treeNodeToObject = (node: TreeNode): any => {
  return {
    name: node.name,
    children: Array.from(node.children.values()).map((child) =>
      treeNodeToObject(child)
    ),
    posts: node.posts.map((post) => post.title), // Showing titles for simplicity
  }
}

const PostLayout: React.FC<
  React.PropsWithChildren<{ params: { post: string | string[] } }>
> = async ({ children, params }) => {
  const posts = await getPosts()
  const navStructure = buildTree(posts)

  return (
    <div className="flex md:flex-row flex-col w-full relative">
      {/* <pre>{JSON.stringify(posts.slice(0, 3))}</pre> */}
      <aside className="w-full max-w-[300px] p-5 bg-black h-screen overflow-y-auto sticky top-0">
        <nav className=" flex flex-col gap-3">
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
            <div className="flex flex-col mt-5 w-full">
              <Tree node={navStructure} params={params} isRoot />
            </div>
          </div>
        </nav>
      </aside>
      <article className="w-full lg:p-10 p-5">{children}</article>
    </div>
  )
}

const Post: React.FC<{ post: Post; params: { post: string | string[] } }> = ({
  post,
  params,
}) => {
  const isActive = params?.post?.includes(post.slug)

  return (
    <li className="w-full">
      <Link
        className={`${
          isActive ? 'underline' : 'opacity-85'
        } hover:opacity-100 transition`}
        href={`/posts${post.path}`}
      >
        {post.frontmatter?.title || post.title}
      </Link>
    </li>
  )
}

const Tree: React.FC<{
  node: TreeNode
  isRoot?: boolean
  params: { post: string | string[] }
}> = ({ node, isRoot = false, params }) => {
  return (
    <div className="flex flex-col w-full">
      {!isRoot && <strong className="font-bold capitalize">{node.name}</strong>}
      {(node.children.size > 0 || node.posts.length > 0) && (
        <ul className={!isRoot ? 'ml-2' : 'flex flex-col gap-5'}>
          {Array.from(node.children.values()).map((child, index) => (
            <Tree key={index} node={child} params={params} />
          ))}
          {node.posts.map((post, index) => (
            <Post key={index} post={post} params={params} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default PostLayout
