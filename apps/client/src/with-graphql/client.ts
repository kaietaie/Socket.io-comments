import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri:  `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT || 3000}/api/graphql`,
    cache: new InMemoryCache()
});

export default client;