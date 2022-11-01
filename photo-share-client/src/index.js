import React from 'react';
import { createRoot } from 'react-dom/client';

import { ApolloClient, HttpLink, ApolloLink, ApolloProvider, InMemoryCache, concat } from '@apollo/client';
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

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })

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
  link: concat(authMiddleware, httpLink),
})

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
