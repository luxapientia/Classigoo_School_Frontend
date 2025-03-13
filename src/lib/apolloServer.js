import { auth0 } from "./auth0";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const httpLink = createHttpLink({
  uri: process.env.HASURA_GRAPHQL_ENDPOINT,
  fetch: (...args) => fetch(...args),
});

async function fetchSession() {
  const session = await auth0.getSession();
  return session?.tokenSet?.accessToken;
}

const authLink = setContext((_, { headers }) => {
  const authLinkWithHeader = fetchSession().then((token) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
      next: {
        revalidate: 0,
      },
    };
  });

  return authLinkWithHeader;
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: authLink.concat(httpLink),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
});
