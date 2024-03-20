import { ImageResponse } from 'next/og'
// import { getArticle } from '@/lib/articles-query'

export const revalidate = 60

export default async function PostOG({
  params,
}: {
  params: { post: string | string[] }
}) {
  //   const authorPhoto = fetch(
  //     new URL(`../../public/images/author.jpg`, import.meta.url)
  //   ).then(res => res.arrayBuffer());

  //   // fonts
  //   const inter600 = fetch(
  //     new URL(`../../../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff`, import.meta.url),
  //   ).then((res) => res.arrayBuffer())

  //   const resource = await getArticle(params.slug)

  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={
          {
            //   ...font('Inter 600'),
          }
        }
      >
        <main tw="flex flex-col gap-5 h-full flex-grow items-start pb-24 justify-center px-16">
          <div tw="text-[60px] text-white">
            {Array.isArray(params.post) ? params.post.join('/') : params.post}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* <img
                tw="rounded-full h-74"
                alt={author.name}
                @ts-ignore
                src={await authorPhoto}
              /> */}
        </main>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      //   fonts: [
      //     {
      //       name: 'Inter 600',
      //       data: await inter600,
      //     },
      //   ],
    }
  )
}

// // lil helper for more succinct styles
// function font(fontFamily: string) {
//   return { fontFamily }
// }
