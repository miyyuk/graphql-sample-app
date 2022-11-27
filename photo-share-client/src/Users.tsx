import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { ROOT_QUERY } from './App'

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count:Int!) {
    addFakeUsers(count:$count) {
      githubLogin
      name
      avatar
    }
  }
`

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`

const Users = () => {
  const { data, loading, refetch, subscribeToMore } = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (loading) return <p>loading users...</p>;

  return (
    <UserList count={data.totalUsers}
      users={data.allUsers}
      refetchUsers={refetch}
      subscribeToNewUser={() =>
        subscribeToMore({
          document: LISTEN_FOR_USERS,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newUser = subscriptionData.data.newUser

            return Object.assign({}, prev, {
              allUsers: [...prev.allUsers, newUser]
            })
          }
        })
      }
    />
  )
}

const UserList = ({
  count,
  users,
  refetchUsers,
  subscribeToNewUser
}: any) => {
  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION);

  React.useEffect(() => {
    subscribeToNewUser();
  }, [])

  return (
    <div>
      <p>{count} Users</p>
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      <button onClick={() => addFakeUsers({ variables:{ count: 1 } })}>
        Add Fake Users
      </button>
      <ul>
        {users.map((user: any) => <UserListItem key={user.githubLogin}
          name={user.name}
          avatar={user.avatar}
        />
        )}
      </ul>
    </div>
  );
}

const UserListItem = ({
  name,
  avatar
}: any) =>
  <li>
    <img src={avatar} width={48} height={48} alt='' />
    {name}
  </li>

export default Users