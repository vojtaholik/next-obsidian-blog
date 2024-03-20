import Image from 'next/image'
import PostLayout from './posts/[...post]/layout'
export default function Home() {
  return (
    <PostLayout params={{ post: '' }}>
      <Image src={require('../../public/images/myc2SQ.jpg')} alt="" />
    </PostLayout>
  )
}
