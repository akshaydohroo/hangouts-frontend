import { Box } from '@mui/material'
import React from 'react'

function StoryAvatarWrapper({
  storyCount,
  children,
}: {
  storyCount: number
  children: React.ReactNode
}) {
  return (
    <Box sx={styles.wrapper(storyCount)}>
      <Box sx={styles.avatarContainer}>{children}</Box>
      {storyCount > 0 && <Box sx={styles.badge}>{storyCount}</Box>}
    </Box>
  )
}

export default StoryAvatarWrapper
const styles = {
  wrapper: (storyCount: number) => ({
    position: 'relative',
    display: 'inline-block',
    padding: '3px',
    borderRadius: '50%',
    height: '100%',
    width: 'fit-content',
    background:
      storyCount > 0
        ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
        : 'transparent',
  }),
  avatarContainer: {
    borderRadius: '50%',
    overflow: 'hidden',
    padding: '1px',
    backgroundColor: 'text.secondary',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4d4f',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '50%',
    padding: '3px 5px',
    minWidth: '18px',
    minHeight: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
