import { useState } from 'react'
import AddPostButton from './AddPostButton'
import AddPostDialog from './AddPostDialog'

export default function AddPost() {
  const [addPostDialogOpen, setAddPostDialogOpen] = useState(false)
  return (
    <>
      <AddPostButton
        setAddPostDialogOpen={() => {
          console.log('AddPostButton clicked')
          setAddPostDialogOpen(true)
        }}
      />
      <AddPostDialog
        addPostDialogOpen={addPostDialogOpen}
        setAddPostDialogClose={() => setAddPostDialogOpen(false)}
      />
    </>
  )
}
