import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { followingUserWithStories } from '../../../models/Story'
import { pageControl } from '../../../utils/functions'
import StoryViewer from './StoryViewer'

export default function FollowingUserStoryDialog({
  open,
  handleClose,
  followingUserWithStories,
  followingUserStoryIndexController,
}: {
  open: boolean
  handleClose: () => void
  followingUserWithStories: followingUserWithStories
  followingUserStoryIndexController: {
    inc: () => void
    dec: () => void
    set: (index: number) => void
  }
}) {
  const descriptionElementRef = useRef<HTMLDivElement>(null)

  const [storyViewIndex, setStoryViewIndex] = useState<number | null>(0)

  const stories = followingUserWithStories.stories

  const storyViewerIndexController = useMemo(() => {
    return pageControl(setStoryViewIndex, stories.length, false)
  }, [setStoryViewIndex, stories.length])

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const [storyLoading, setStoryLoading] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (storyLoading) {
      return
    }
    if (storyViewIndex === stories.length - 1) {
      timeout = setTimeout(() => {
        followingUserStoryIndexController.inc()
        setStoryViewIndex(0)
        setStoryLoading(true)
      }, 5000)
    } else {
      timeout = setTimeout(() => {
        storyViewerIndexController.inc()
        setStoryLoading(true)
      }, 5000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [
    storyViewIndex,
    stories.length,
    followingUserStoryIndexController,
    storyViewerIndexController,
    storyLoading,
  ])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="following-user-story-dialog"
      aria-describedby="following-user-story-dialog-description"
      sx={styles.dialog}
      ref={descriptionElementRef}
    >
      <DialogTitle id="following-user-dialog-title" sx={styles.dialogTitle}>
        <Avatar
          sx={styles.userPicture}
          src={followingUserWithStories?.picture as string}
        ></Avatar>
        <Stack>
          <Typography variant="h6" sx={styles.name}>
            {followingUserWithStories?.name}
          </Typography>
          <Typography variant="subtitle2" sx={styles.userName}>
            @{followingUserWithStories?.userName}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true} sx={styles.dialogContent}>
        <StoryViewer
          story={stories[storyViewIndex as number]}
          storyController={storyViewerIndexController}
          storyIndex={storyViewIndex as number}
          userController={followingUserStoryIndexController}
          storyLoading={storyLoading}
          setStoryLoading={setStoryLoading}
          setCreateStory={undefined}
          storyHold={undefined}
          setStoryHold={undefined}
        />
      </DialogContent>
    </Dialog>
  )
}

const styles = {
  dialog: {
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    minWidth: '350px',
    '& .MuiDialog-paper': {
      width: {
        xs: '70vw',
        sm: '60vw',
        md: '50vw',
        lg: '40vw',
      },
    },
  },
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 24px',
    borderBottom: '1px solid #ddd',
  },
  userName: {
    color: 'text.secondary',
  },
  name: {
    fontWeight: 'bold',
  },
  userPicture: {
    width: '50px',
    height: '50px',
  },
  dialogContent: {
    padding: 0,
  },
}
