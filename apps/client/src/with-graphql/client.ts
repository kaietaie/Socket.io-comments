import { ApolloClient, InMemoryCache } from "@apollo/client";
import { url } from "../urlToBE";

const client = new ApolloClient({
    uri:  `${url}/api/graphql`,
    cache: new InMemoryCache()
});

export default client;