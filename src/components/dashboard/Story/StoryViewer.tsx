import { SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { Story } from '../../../models/Story'
import ProgressIndexBar from '../../common/ProgressIndexBar'
import StoryReact from './StoryReact'

export default function StoryViewer({
  story,
  storyController,
  storyIndex,
  userController,
  storyLoading,
  setStoryLoading,
  setCreateStory,
}: {
  story: Story | undefined | Pick<Story, 'storyId' | 'picture' | 'createdAt'>
  storyController: {
    inc: () => void
    dec: () => void
    getTotalPages: () => number
  }
  storyIndex: number
  userController: { inc: () => void; dec: () => void } | null
  storyLoading: boolean
  setStoryLoading: (loading: boolean) => void
  setCreateStory: ((create: boolean) => void) | undefined
}) {
  const handleImageLoad = async () => {
    setStoryLoading(false)
    story?.storyId && (await Story.addViewer(story.storyId))
  }
  const totalStories = storyController.getTotalPages()

  const handleStoryPrevious = () => {
    setStoryLoading(true)
    if (storyIndex === 0) {
      userController?.dec()
    } else {
      storyController.dec()
    }
  }

  const handleStoryNext = () => {
    setStoryLoading(true)
    if (storyIndex === totalStories - 1) {
      userController?.inc()
      setCreateStory && setCreateStory(true)
    } else {
      storyController.inc()
    }
  }
  return (
    <Stack sx={styles.viewerBox} direction="column">
      <IconButton
        onClick={handleStoryPrevious}
        sx={styles.previousButton}
        size="large"
      >
        <SkipPrevious />
      </IconButton>
      <ProgressIndexBar
        highlightedIndex={storyIndex}
        totalSegments={totalStories}
      />
      {story === undefined ? (
        <Skeleton variant="rectangular" sx={styles.skeleton} />
      ) : (
        <Stack direction="column">
          <Skeleton
            variant="rectangular"
            sx={{
              ...styles.skeleton,
              display: storyLoading ? 'block' : 'none',
            }}
          />
          <img
            src={story?.picture}
            alt="story"
            style={{
              ...styles.storyPicture,
              display: storyLoading ? 'none' : 'block',
            }}
            onLoad={handleImageLoad}
          />
        </Stack>
      )}
      {story && <StoryReact disabled={storyLoading} storyId={story.storyId} />}
      <IconButton
        onClick={handleStoryNext}
        sx={styles.nextButton as any}
        size="large"
      >
        <SkipNext />
      </IconButton>
    </Stack>
  )
}

const styles = {
  storyPicture: {
    height: '75vh',
  },
  skeleton: {
    height: '75vh',
    width: '100%',
  },
  viewerBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'background.paper',
  },
  nextButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    '& > *': {
      fontSize: '40px',
    },
  },
  previousButton: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    '& > *': {
      fontSize: '40px',
    },
  },
}
