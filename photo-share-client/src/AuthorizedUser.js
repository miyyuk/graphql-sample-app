import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { ROOT_QUERY } from './App'

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code:String!) {
    githubAuth(code:$code) { token }
  }
`

const Me = ({ logout, requestCode, signingIn }) =>
  <Query query={ROOT_QUERY}>
    {({ loading, data }) => data?.me ?
      <CurrentUser {...data.me} logout={logout} /> :
      loading ?
        <p>loading...</p> :
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with GitHub
        </button>
    }
  </Query>

const CurrentUser = ({ name, avatar, logout }) =>
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
  </div>

class AuthorizedUser extends Component {
  state = { signingIn: false }

  authorizationComplete = (cache, { data }) => {
    localStorage.setItem('token', data.githubAuth.token)
    this.props.history.replace('/')
    this.setState({ signingIn: false })
  }

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true })
      const code = window.location.search.replace("?code=", "")
      this.githubAuthMutation({ variables: { code } })
    }
  }

  requestCode() {
    var clientID = process.env.REACT_APP_CLIENT_ID
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
  }

  render() {
    return (
      <Mutation mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refreshQueries={[{ query: ROOT_QUERY }]}
      >
        {mutation => {
          this.githubAuthMutation = mutation
          return (
            <Me signingIn={this.state.signingIn}
              requestCode={this.requestCode}
              logout={() => localStorage.removeItem('token')}
            />
          )
        }}
      </Mutation>
    )
  }
}

export default withRouter(AuthorizedUser)