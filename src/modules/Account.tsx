import { Stack, SvgIcon, Typography } from '@mui/material'
import { ReactComponent as AccountSVG } from '../assets/icons/account_settings.svg'

export default function Account() {
  return (
    <Stack sx={styles.account}>
      <SvgIcon component={AccountSVG} sx={styles.svg} inheritViewBox />
      <Stack>
        <Stack>
          <Typography>Wanna change your name</Typography>
        </Stack>
        <Stack></Stack>
        <Stack></Stack>
      </Stack>
    </Stack>
  )
}
const styles = {
  account: {
    width: '100vw',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
  },
  svg: {
    height: 'auto',
    width: {
      xs: '70vw',
      sm: '60vw',
      md: '70vw',
      lg: '50vw',
    },
    color: 'inherit',
  },
}
