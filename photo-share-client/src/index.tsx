import React from 'react';
import { createRoot } from 'react-dom/client';

import { ApolloClient, HttpLink, ApolloLink, ApolloProvider, InMemoryCache, split, concat } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const cache = new InMemoryCache()

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})

if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
  cache.restore(cacheData)
}

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    authToken: localStorage.getItem('token'),
  },

}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} })=> ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token')
    }
  }))

  return forward(operation)
})

const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, splitLink),
})

const container = document.getElementById('root')
// @ts-expect-error TS(2345): Argument of type 'HTMLElement | null' is not assig... Remove this comment to see the full error message
const root = createRoot(container)

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
reportWebVitals();
