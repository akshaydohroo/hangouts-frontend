import { css } from '@emotion/react'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { IconButton, Stack, Typography } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getStoryFollowingLike,
  likeFollowingStory,
  sendFollowingStoryReaction,
} from '../../../functions/story'
import useAppDispatch from '../../../hooks/useAppDispatch'
import { invalidateFollowingStoryLike } from '../../../invalidateQueries'
import { StoryReactions } from '../../../models/Story'
import { storyFollowingLikeQueryKey } from '../../../queryKeyStore'
import { setSnackbar } from '../../../redux/snackbar'
import { convertTime } from '../../../utils/functions'

export default function StoryReact({
  disabled,
  storyId,
}: {
  disabled: boolean
  storyId: string
}) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const storyFollowingLikeQuery = useQuery({
    queryKey: storyFollowingLikeQueryKey(storyId),
    queryFn: () => {
      return getStoryFollowingLike(storyId)
    },
    staleTime: convertTime(5, 'min', 'ms'),
  })

  const handleToggleLike = async () => {
    if (storyFollowingLikeQuery.data === null) {
      return
    }
    await likeFollowingStory(storyId, !storyFollowingLikeQuery.data)
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        return invalidateFollowingStoryLike(queryKey, storyId)
      },
    })
  }

  const handleStoryReactions = async (reaction: string) => {
    const sendStatus = await sendFollowingStoryReaction(
      storyId,
      StoryReactions[reaction as keyof typeof StoryReactions]
    )
    if (sendStatus) {
      dispatch(
        setSnackbar({
          message: `You reacted with ${StoryReactions[reaction as keyof typeof StoryReactions]} on the story`,
          severity: 'info',
          alertVarient: 'standard',
        })
      )
    } else {
      dispatch(
        setSnackbar({
          message: `Reaction could not be sent, please try again.`,
          severity: 'error',
          alertVarient: 'filled',
        })
      )
    }
  }

  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      direction="row"
      sx={styles.reactionsWrapper}
    >
      <IconButton
        sx={styles.reactionButton}
        disabled={disabled}
        onClick={handleToggleLike}
      >
        {storyFollowingLikeQuery.data ? (
          <Favorite sx={styles.likeIconFilled} />
        ) : (
          <FavoriteBorder sx={styles.likeIconOutlined} />
        )}
      </IconButton>
      {Object.keys(StoryReactions).map((reaction, index) => (
        <IconButton
          key={index}
          disabled={disabled}
          sx={styles.reactionButton}
          onClick={() => handleStoryReactions(reaction)}
        >
          <Typography sx={styles.reactionIcon}>
            {StoryReactions[reaction as keyof typeof StoryReactions]}
          </Typography>
        </IconButton>
      ))}
    </Stack>
  )
}

const styles = {
  reactionsWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 'fit-content',
  },
  reactionButton: css`
    &:hover {
      animation: bounce 0.5s infinite;
    }

    @keyframes bounce {
      0%,
      20%,
      50%,
      80%,
      100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
  `,
  reactionIcon: {
    fontSize: '30px',
  },
  likeIconOutlined: {
    fontSize: '30px',
  },
  likeIconFilled: {
    fontSize: '30px',
    color: 'red',
  },
}
