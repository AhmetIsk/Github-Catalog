import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const httpLink = new HttpLink({
  uri: GITHUB_GRAPHQL_API,
});

/**
 * An ApolloLink that adds an authorization header to the request.
 * @param operation - The Apollo operation.
 * @param forward - The next link in the chain.
 * @returns The modified operation.
 */
const authLink = new ApolloLink((operation, forward) => {
  // Use the token from .env
  const token = process.env.REACT_APP_GITHUB_TOKEN;

  // Set the authorization header for the request
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

/**
 * An ApolloClient instance that uses the authLink and httpLink.
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
