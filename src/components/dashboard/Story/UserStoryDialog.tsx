import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Story } from '../../../models/Story'
import { UserAttributes } from '../../../models/User'
import { pageControl } from '../../../utils/functions'
import CreateStory from './CreateStory'
import StoryViewer from './StoryViewer'

export default function UserStoryDialog({
  open,
  handleClose,
  userData,
  stories,
}: {
  open: boolean
  handleClose: () => void
  userData: Omit<UserAttributes, 'password'> | undefined
  stories: Story[] | undefined
}) {
  const descriptionElementRef = useRef<HTMLDivElement>(null)

  const [storyViewIndex, setStoryViewIndex] = useState<number | null>(0)

  const [storyLoading, setStoryLoading] = useState(false)

  const [createStory, setCreateStory] = useState(false)

  const [storyHold, setStoryHold] = useState<boolean>(false)

  const storyViewerIndexController = useMemo(() => {
    return pageControl(setStoryViewIndex, stories?.length ?? 0, false)
  }, [setStoryViewIndex, stories?.length])

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (storyLoading || stories === undefined || storyHold) {
      return
    }
    if (stories.length === 0) {
      setCreateStory(true)
    } else if (storyViewIndex === stories.length - 1) {
      timeout = setTimeout(() => {
        setCreateStory(true)
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
    stories,
    stories?.length,
    storyViewerIndexController,
    storyLoading,
    setCreateStory,
    storyHold,
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
          src={userData?.picture as string}
        ></Avatar>
        <Stack>
          <Typography variant="h6" sx={styles.name}>
            {userData?.name}
          </Typography>
          <Typography variant="subtitle2" sx={styles.userName}>
            @{userData?.userName}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true} sx={styles.dialogContent}>
        {createStory ? (
          <CreateStory />
        ) : (
          <StoryViewer
            story={stories ? stories[storyViewIndex as number] : undefined}
            storyController={storyViewerIndexController}
            storyIndex={storyViewIndex as number}
            userController={null}
            storyLoading={storyLoading}
            setStoryLoading={setStoryLoading}
            setCreateStory={setCreateStory}
            storyHold={storyHold}
            setStoryHold={setStoryHold}
          />
        )}
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
