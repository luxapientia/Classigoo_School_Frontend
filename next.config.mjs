/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HASURA_GRAPHQL_ENDPOINT: process.env.HASURA_GRAPHQL_ENDPOINT,
    HASURA_GRAPHQL_WS_ENDPOINT: process.env.HASURA_GRAPHQL_WS_ENDPOINT,
  },
};

export default nextConfig;
