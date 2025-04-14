import { SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton, Skeleton, Stack, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { getUserData } from '../../../functions/user'
import useAppSelector from '../../../hooks/useAppSelector'
import { Story } from '../../../models/Story'
import { userDataQueryKey } from '../../../queryKeyStore'
import { convertTime } from '../../../utils/functions'
import ProgressIndexBar from '../../common/ProgressIndexBar'
import StoryAnalytics from './StoryAnalytics'
import StoryReact from './StoryReact'
export default function StoryViewer({
  story,
  storyController,
  storyIndex,
  userController,
  storyLoading,
  setStoryLoading,
  setCreateStory,
  storyHold,
  setStoryHold,
}: {
  story: Story | undefined
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
  storyHold: boolean | undefined
  setStoryHold: ((hold: boolean) => void) | undefined
}) {
  const isAuthenticated = useAppSelector(state => state.authenticated.value)

  const userQuery = useQuery(userDataQueryKey, {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, 'min', 'ms'),
  })

  const userData = userQuery.data

  const handleImageLoad = async () => {
    setStoryLoading(false)
    story?.storyId && isAuthenticated && (await Story.addViewer(story.storyId))
  }
  const totalStories = storyController.getTotalPages()

  const handleStoryPrevious = () => {
    if (storyHold) return
    setStoryLoading(true)
    if (storyIndex === 0) {
      userController?.dec()
    } else {
      storyController.dec()
    }
  }

  const handleStoryNext = () => {
    if (storyHold) return
    setStoryLoading(true)
    if (storyIndex === totalStories - 1) {
      userController?.inc()
      setCreateStory && setCreateStory(true)
    } else {
      storyController.inc()
    }
  }
  const isMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  )
  return (
    <Stack sx={styles.viewerBox}>
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
        <Stack direction="column" alignItems="center" justifyItems="center">
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
            style={
              {
                ...styles.storyPicture(isMobileScreen ? '50vh' : '75vh'),
                display: storyLoading ? 'none' : 'block',
              } as React.CSSProperties
            }
            onLoad={handleImageLoad}
          />
        </Stack>
      )}
      {story &&
        isAuthenticated &&
        (story.userId !== userData?.id ? (
          <StoryReact disabled={storyLoading} storyId={story.storyId} />
        ) : (
          <StoryAnalytics
            storyAnalytics={story}
            setStoryHold={setStoryHold as (hold: boolean) => void}
          />
        ))}
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
  storyPicture: (height: string) => ({
    height: height,
    width: '90%',
    objectFit: 'contain',
  }),
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
