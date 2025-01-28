/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_BASE_URL: process.env.APP_BASE_URL,
    CLASSROOM_CDN_URL: process.env.CLASSROOM_CDN_URL,
    HASURA_GRAPHQL_ENDPOINT: process.env.HASURA_GRAPHQL_ENDPOINT,
    HASURA_GRAPHQL_WS_ENDPOINT: process.env.HASURA_GRAPHQL_WS_ENDPOINT,
  },
};

export default nextConfig;
