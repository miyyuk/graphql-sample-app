import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { gql, useQuery, useMutation } from '@apollo/client'
import { withApollo } from '@apollo/client/react/hoc';
import { ROOT_QUERY } from './App'

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code:String!) {
    githubAuth(code:$code) { token }
  }
`

const Me = ({
  logout,
  requestCode,
  signingIn
}: any) => {
  const { data, loading } = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-only"
  });

  if (loading) return <p>loading...</p>;

  if (data?.me) {
    return (
      <CurrentUser {...data.me} logout={logout} />
    )
  } else {
    return (
      <button onClick={requestCode} disabled={signingIn}>
        Sign In with GitHub
      </button>
    )
  }
}

const CurrentUser = ({
  name,
  avatar,
  logout
}: any) => {
  return (
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      <h1>{name}</h1>
      <button onClick={logout}>logout</button>
    </div>
  )
}

const AuthorizedUser = (props: any) => {
  const [signingIn, setSigningIn] = React.useState(false);

  const authorizationComplete = (cache: any, {
    data
  }: any) => {
    localStorage.setItem('token', data.githubAuth.token)
    props.history.replace('/')
    setSigningIn(false)
  }

  const requestCode = () => {
    var clientID = process.env.REACT_APP_CLIENT_ID;
    (window as Window).location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  }

  const [githubAuth] = useMutation(GITHUB_AUTH_MUTATION, {
    update: authorizationComplete,
    refetchQueries: [{ query: ROOT_QUERY }]
  });

  React.useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setSigningIn(true)
      const code = window.location.search.replace("?code=", "")
      githubAuth({ variables: { code } })
    }
  }, [githubAuth])

    return (
      <Me signingIn={signingIn}
        requestCode={requestCode}
        logout={() => {
          localStorage.removeItem('token')
          const data = props.client.readQuery({ query: ROOT_QUERY })
          props.client.writeQuery({ query: ROOT_QUERY, data: { ...data, me: null } })
        }}
      />
    )
}

export default compose(withApollo, withRouter)(AuthorizedUser)