import { useState } from 'react'
import CreatePostButton from './CreatePostButton'
import CreatePostDialog from './CreatePostDialog'

export default function AddPost() {
  const [addPostDialogOpen, setAddPostDialogOpen] = useState(false)
  return (
    <>
      <CreatePostButton
        setAddPostDialogOpen={() => {
          setAddPostDialogOpen(true)
        }}
      />
      <CreatePostDialog
        addPostDialogOpen={addPostDialogOpen}
        setAddPostDialogClose={() => setAddPostDialogOpen(false)}
      />
    </>
  )
}
