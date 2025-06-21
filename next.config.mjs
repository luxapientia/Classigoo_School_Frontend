/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_BASE_URL: process.env.APP_BASE_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
    CLASSROOM_CDN_URL: process.env.CLASSROOM_CDN_URL,
    HASURA_GRAPHQL_ENDPOINT: process.env.HASURA_GRAPHQL_ENDPOINT,
    HASURA_GRAPHQL_WS_ENDPOINT: process.env.HASURA_GRAPHQL_WS_ENDPOINT,
  },
};

export default nextConfig;
