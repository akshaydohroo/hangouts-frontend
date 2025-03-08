import { Favorite, People, Visibility } from '@mui/icons-material'
import {
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Story, UserWithStoryInteraction } from '../../../models/Story'

export default function StoryAnalytics({
  storyAnalytics,
  setStoryHold,
}: {
  storyAnalytics: Pick<Story, 'storyId' | 'likes' | 'seenCount' | 'viewers'>
  setStoryHold: (hold: boolean) => void
}) {
  const [dialogOpen, setDialogOpen] = useState<'likes' | 'seen' | 'none'>(
    'none'
  )

  useEffect(() => {
    setStoryHold(dialogOpen !== 'none')
  }, [dialogOpen, setStoryHold])

  return (
    <Stack direction={'row'} sx={styles.container}>
      <Stack direction="row" sx={styles.metric}>
        <Badge
          badgeContent={storyAnalytics.likes}
          color="primary"
          overlap="circular"
        >
          <IconButton color="error" onClick={() => setDialogOpen('likes')}>
            <Favorite />
          </IconButton>
        </Badge>
      </Stack>

      <Stack direction="row" sx={styles.metric}>
        <Badge
          badgeContent={storyAnalytics.seenCount}
          color="primary"
          overlap="circular"
        >
          <IconButton color="secondary" onClick={() => setDialogOpen('seen')}>
            <People />
          </IconButton>
        </Badge>
      </Stack>
      {/* Viewers Dialog */}
      <Dialog
        open={dialogOpen !== 'none'}
        onClose={() => setDialogOpen('none')}
        sx={styles.dialog}
      >
        <DialogTitle>
          {dialogOpen === 'likes' ? 'Liked By' : 'Seen By'}
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <List sx={styles.list}>
            {(dialogOpen === 'likes'
              ? findLikedByViewers(storyAnalytics.viewers)
              : storyAnalytics.viewers
            ).map(viewer => (
              <ListItem key={viewer.id as string} sx={styles.listItem}>
                <Stack direction="row" sx={styles.listItemContent}>
                  <ListItemAvatar>
                    <img
                      src={viewer.picture as string}
                      alt={viewer.userName}
                      style={styles.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={viewer.name}
                    sx={styles.listItemText}
                  />
                  <Typography variant="caption" sx={styles.icon}>
                    {dialogOpen === 'likes' ? (
                      <Favorite color="error" sx={{ fontSize: 24 }} />
                    ) : (
                      (viewer.storyInteraction?.reactionEmoji ?? (
                        <Visibility sx={{ fontSize: 24 }} />
                      ))
                    )}
                  </Typography>
                </Stack>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Stack>
  )
}

const findLikedByViewers = (viewers: UserWithStoryInteraction[]) => {
  const likedByViewers = viewers.filter(viewer => {
    console.log(viewer)
    return viewer.storyInteraction.isLike
  })
  return likedByViewers
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    bgcolor: 'background.paper',
    width: '100%',
    boxShadow: 2,
  },
  metric: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mr: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
  },
  dialog: {
    maxWidth: 'xs',
    fullWidth: true,
  },
  dialogContent: {
    bgcolor: 'background.default',
    p: 2,
    borderRadius: 2,
  },
  list: {
    p: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    py: 1,
    px: 2,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  listItemContent: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: 2,
  },
  listItemText: {
    flexGrow: 1,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 24,
  },
}
