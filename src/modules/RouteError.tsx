import { Box, Button, SvgIcon, Typography } from '@mui/material'
import { ReactComponent as Error404Svg } from '../assets/icons/error404.svg'

import { useNavigate } from 'react-router-dom'

export default function RouteError() {
  const navigate = useNavigate()
  return (
    <Box sx={styles.wrapper}>
      <SvgIcon component={Error404Svg} sx={styles.svg} inheritViewBox />
      <Typography sx={styles.text}>
        It seems you have wondered off to an unknown place,{' '}
        <Button sx={styles.button} variant="text" onClick={() => navigate(-1)}>
          Click Here To Go Back.
        </Button>
      </Typography>
    </Box>
  )
}
const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    height: '50vh',
    width: '50vw',
  },
  text: {
    fontSize: 24,
    my: 5,
  },
  button: {
    fontSize: 18,
    textTransform: 'none',
  },
}
