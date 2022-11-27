import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
// @ts-expect-error TS(6142): Module './App' was resolved to '/Users/miyukano/mi... Remove this comment to see the full error message
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

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  if (loading) return <p>loading users...</p>;

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <UserList count={data.totalUsers}
      users={data.allUsers}
      refetchUsers={refetch}
      subscribeToNewUser={() =>
        subscribeToMore({
          document: LISTEN_FOR_USERS,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newUser = subscriptionData.data.newUser

            // @ts-expect-error TS(2550): Property 'assign' does not exist on type 'ObjectCo... Remove this comment to see the full error message
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
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <p>{count} Users</p>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <button onClick={() => addFakeUsers({ variables:{ count: 1 } })}>
        Add Fake Users
      </button>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <ul>
        {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <li>
    {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
    <img src={avatar} width={48} height={48} alt='' />
    {name}
  </li>

export default Users