import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { IconButton, debounce } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'

type direction = 'left' | 'right'
function disableButtons(
  scrollLeft: number,
  offsetWidth: number,
  scrollWidth: number,
  setDisabledButton: React.Dispatch<
    React.SetStateAction<direction | 'both' | null>
  >
) {
  const leftDisabled = Math.floor(scrollLeft) === 0
  const rightDisabled = Math.ceil(scrollLeft + offsetWidth) >= scrollWidth
  console.log([scrollLeft + offsetWidth, scrollWidth])
  if (leftDisabled && rightDisabled) {
    setDisabledButton('both')
  } else if (leftDisabled) {
    setDisabledButton('left')
  } else if (rightDisabled) {
    setDisabledButton('right')
  } else setDisabledButton(null)
}
const disableButtonsEvent = debounce(
  (
    carousel: HTMLDivElement,
    setDisabledButton: React.Dispatch<
      React.SetStateAction<direction | 'both' | null>
    >
  ) => {
    const { scrollLeft, offsetWidth, scrollWidth } = carousel as HTMLDivElement
    disableButtons(scrollLeft, offsetWidth, scrollWidth, setDisabledButton)
  },
  300
)
export default function CarouselControl({
  carouselRef,
  hasNextPage,
  fetchNextPage,
  page,
}: {
  carouselRef: React.RefObject<HTMLDivElement>
  hasNextPage: boolean | undefined
  fetchNextPage: () => void
  page: number
}) {
  function onClickCarouselControl(
    e: React.MouseEvent<HTMLButtonElement>,
    direction: direction
  ) {
    if (!carouselRef.current) return
    if (direction === 'left') {
      carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth
    } else {
      carouselRef.current.scrollLeft += carouselRef.current.offsetWidth
    }
  }
  const [disabled, setDisabledButton] = useState<direction | null | 'both'>(
    null
  )
  console.log(hasNextPage + ' ' + disabled)

  useEffect(() => {
    if (!carouselRef.current) return
    const carousel = carouselRef.current
    carousel.addEventListener('scroll', ev =>
      disableButtonsEvent(carousel, setDisabledButton)
    )
    window.addEventListener('resize', ev =>
      disableButtonsEvent(carousel, setDisabledButton)
    )
    const { scrollLeft, offsetWidth, scrollWidth } = carousel
    disableButtons(scrollLeft, offsetWidth, scrollWidth, setDisabledButton)
    return () => {
      carousel.removeEventListener('scroll', () =>
        disableButtonsEvent(carousel, setDisabledButton)
      )
      window.removeEventListener('resize', () =>
        disableButtonsEvent(carousel, setDisabledButton)
      )
    }
  }, [carouselRef, page])
  useEffect(() => {
    if (disabled !== 'left' && hasNextPage) {
      fetchNextPage()
    }
  }, [disabled, hasNextPage, fetchNextPage])
  return (
    <>
      <IconButton
        sx={{ ...styles.buttonLeft, ...styles.button }}
        onClick={e => onClickCarouselControl(e, 'left')}
        disabled={disabled === 'left' || disabled === 'both'}
      >
        <KeyboardArrowLeftIcon
          sx={{
            ...styles.icon,
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? grey[900] : grey[200],
          }}
        />
      </IconButton>
      <IconButton
        sx={{ ...styles.buttonRight, ...styles.button }}
        onClick={e => onClickCarouselControl(e, 'right')}
        disabled={disabled === 'right' || disabled === 'both'}
      >
        <KeyboardArrowRightIcon
          sx={{
            ...styles.icon,
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? grey[800] : grey[300],
          }}
        />
      </IconButton>
    </>
  )
}
const styles = {
  buttonLeft: {
    left: -7.5,
  },
  buttonRight: {
    right: -7.5,
  },
  button: {
    position: 'absolute',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:disabled': {
      '& > *': {
        backgroundColor: 'action.disabled',
        color: 'text.disabled',
      },
    },
  },
  icon: {
    borderRadius: 50,
    p: 0.02,
    fontSize: 24,
    color: 'background.default',
  },
}
