'use client'

import Image from 'next/image'
import React from 'react'
import Lightbox from 'yet-another-react-lightbox'

export const ImageLightbox: React.FC<{
  image: string
  images?: (string | undefined)[]
  width?: number
  height?: number
}> = ({ image, images, width, height }) => {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const slides =
    images?.map((image) => ({
      src: image as string,
      width: 800,
      height: 600,
    })) || []

  const currentImageIndex = images?.indexOf(image) || 0

  return (
    <>
      <Image
        width={width}
        height={height}
        src={image}
        quality={100}
        onClick={() => {
          setOpen(true)
        }}
        className="cursor-zoom-in"
        alt=""
      />
      <Lightbox
        index={index}
        controller={{
          closeOnBackdropClick: true,
        }}
        on={{ view: ({ index: currentIndex }) => setIndex(currentImageIndex) }}
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        render={{ slide: Slide }}
      />
    </>
  )
}

const Slide: React.FC<any> = ({ slide, rect, setOpen }) => {
  return (
    <div>
      <Image alt="" src={slide} />
    </div>
  )
}
