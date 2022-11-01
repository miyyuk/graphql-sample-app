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

const updateUserCache = (cache, { data:{ addFakeUsers }}) => {
  const data = cache.readQuery({ query: ROOT_QUERY })
  const newData = {
    ...data,
    totalUsers: data.totalUsers + addFakeUsers.length,
    allUsers: [
      ...data.allUsers,
      ...addFakeUsers,
    ]
  }
  cache.writeQuery({ query: ROOT_QUERY, data: newData })
}

const Users = () => {
  const { data, loading, refetch } = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (loading) return <p>loading users...</p>;

  return (
    <UserList count={data.totalUsers}
      users={data.allUsers}
      refetchUsers={refetch}
    />
  )
}

const UserList = ({ count, users, refetchUsers }) => {
  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION, {
    update: updateUserCache
  });

  return (
    <div>
      <p>{count} Users</p>
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      <button onClick={() => addFakeUsers({ variables:{ count: 1 } })}>
        Add Fake Users
      </button>
      <ul>
        {users.map(user =>
          <UserListItem key={user.githubLogin}
            name={user.name}
            avatar={user.avatar}
          />
        )}
      </ul>
    </div>
  )
}

const UserListItem = ({ name, avatar }) =>
  <li>
    <img src={avatar} width={48} height={48} alt='' />
    {name}
  </li>

export default Users