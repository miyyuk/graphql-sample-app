import React from 'react'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { withRouter } from 'react-router-dom'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose'
import { gql, useQuery, useMutation } from '@apollo/client'
import { withApollo } from '@apollo/client/react/hoc';
// @ts-expect-error TS(6142): Module './App' was resolved to '/Users/miyukano/mi... Remove this comment to see the full error message
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

  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  if (loading) return <p>loading...</p>;

  if (data?.me) {
    return (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <CurrentUser {...data.me} logout={logout} />
    )
  } else {
    return (
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <img src={avatar} width={48} height={48} alt="" />
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <h1>{name}</h1>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    var clientID = process.env.REACT_APP_CLIENT_ID
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type '(string |... Remove this comment to see the full error message
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
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
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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