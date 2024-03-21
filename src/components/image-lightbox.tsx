'use client'

import Image from 'next/image'
import React from 'react'
import Lightbox from 'yet-another-react-lightbox'

export const ImageLightbox: React.FC<{
  image: string
  images?: {
    src: string
    width: string
    height: string
  }[]
  width: string
  height: string
}> = ({ image, images, width, height }) => {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const slides = images?.map((image) => ({
    src: image.src,
    width: Number(image.width),
    height: Number(image.height),
  }))

  const currentImageIndex =
    slides?.findIndex((slide) => {
      return slide.src === image
    }) || 0

  return (
    <>
      <Image
        width={Number(width)}
        height={Number(height)}
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
        on={{
          view: ({ index: currentIndex }) => {
            setIndex(currentImageIndex)
          },
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        render={{
          slide: (props) => {
            return (
              <Image
                {...props}
                alt=""
                src={props.slide.src}
                width={Number(width)}
                height={Number(height)}
              />
            )
          },
        }}
      />
    </>
  )
}
