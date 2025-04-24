import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changeLikesInCache,
  getIsLikedPost,
  postToggleLikePost,
} from '../../../functions/post'
import useAppDispatch from '../../../hooks/useAppDispatch'
import useAppSelector from '../../../hooks/useAppSelector'
import { postLikeQueryKey } from '../../../queryKeyStore'
import { setSnackbar } from '../../../redux/snackbar'

export default function PostReaction({ postId }: { postId: string }) {
  const queryClient = useQueryClient()
  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const dispatch = useAppDispatch()
  const postIsLikedQuery = useQuery({
    queryKey: postLikeQueryKey(postId),
    queryFn: () => {
      return getIsLikedPost(postId)
    },
    enabled: isAuthenticated,
  })

  const handlePostLikeClick = async () => {
    try {
      await postToggleLikePost(postId, !isLiked)
      dispatch(
        setSnackbar({
          open: true,
          message: `You ${!isLiked ? 'liked' : 'unliked'} this post`,
          severity: 'success',
          alertVarient: 'filled',
        })
      )
      queryClient.invalidateQueries(postLikeQueryKey(postId))
      changeLikesInCache(queryClient, postId, !isLiked ? 1 : -1)
    } catch (error) {
      console.error(error)
      dispatch(
        setSnackbar({
          open: true,
          message: 'Error liking/unliking post',
          severity: 'error',
          alertVarient: 'filled',
        })
      )
    }
  }

  const isLiked = postIsLikedQuery.data || false

  return (
    <IconButton
      onClick={handlePostLikeClick}
      color={isLiked ? 'error' : 'default'}
      disabled={!isAuthenticated}
    >
      {isLiked ? <Favorite /> : <FavoriteBorder />}
    </IconButton>
  )
}
