import axios from "axios";
import { ApolloClient, createHttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: process.env.HASURA_GRAPHQL_ENDPOINT, // HTTP endpoint
  fetch: (...args) => fetch(...args),
});

async function fetchSession() {
  const res = await axios.get("/auth/access-token");
  const session = res.data.token;
  return session;
}

const authLink = setContext(async (_, { headers }) => {
  const token = await fetchSession();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create WebSocket client
const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.HASURA_GRAPHQL_WS_ENDPOINT, // WebSocket endpoint
    connectionParams: async () => {
      const token = await fetchSession();
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  })
);

// Use `split` to route subscriptions to `wsLink` and other operations to `httpLink`
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink, // WebSocket link for subscriptions
  authLink.concat(httpLink) // HTTP link for queries and mutations
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
