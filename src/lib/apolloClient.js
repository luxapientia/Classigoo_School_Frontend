import axios from "axios";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
  uri: process.env.HASURA_GRAPHQL_ENDPOINT,
  fetch: (...args) => fetch(...args),
});

async function fetchSession() {
  const res = await axios.get("/auth/access-token");
  const session = res.data.token;
  return session;
}

const authLink = setContext((_, { headers }) => {
  const authLinkWithHeader = fetchSession().then((token) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return authLinkWithHeader;
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
