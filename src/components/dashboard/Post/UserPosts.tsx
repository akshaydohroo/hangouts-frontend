import { Stack } from '@mui/material'
import { UserAttributes } from '../../../models/User'
import UserPost from './UserPost'

type User = {
  id: string | number
  name: string
}

export default function UserPosts() {
  return (
    <Stack>
      <UserPost
        user={
          {
            id: '1',
            name: 'John Doe',
            email: '',
            picture: '',
            userName: '',
          } as UserAttributes
        }
        postImage="image1.jpg"
        caption="Caption 1"
        timestamp={Date.now()}
      />
      <UserPost
        user={
          {
            id: '1',
            name: 'John Doe',
            email: '',
            picture: '',
            userName: '',
          } as UserAttributes
        }
        postImage="image2.jpg"
        caption="Caption 2"
        timestamp={Date.now()}
      />
      <UserPost
        user={
          {
            id: '1',
            name: 'John Doe',
            email: '',
            picture: '',
            userName: '',
          } as UserAttributes
        }
        postImage="image3.jpg"
        caption="Caption 3"
        timestamp={Date.now()}
      />
      <UserPost
        user={
          {
            id: '1',
            name: 'John Doe',
            email: '',
            picture: '',
            userName: '',
          } as UserAttributes
        }
        postImage="image4.jpg"
        caption="Caption 4"
        timestamp={Date.now()}
      />
    </Stack>
  )
}

const styles = {
  userPostsWrapper: {},
}
