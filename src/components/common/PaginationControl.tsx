import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { IconButton, Stack } from '@mui/material'
export default function PaginationControl({
  pageController,
}: {
  pageController: { inc: () => void; dec: () => void }
}) {
  return (
    <Stack direction="row" sx={styles.wrapper}>
      <IconButton onClick={pageController.dec} size="large">
        <ArrowLeftIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={pageController.inc} size="large">
        <ArrowRightIcon fontSize="large" />
      </IconButton>
    </Stack>
  )
}
const styles = {
  wrapper: {
    height: 60,
    justifyContent: 'space-between',
    '& > *': {
      mx: 2,
    },
    '& > *:hover, & > *:focus': {
      color: 'info.main',
    },
  },
}
