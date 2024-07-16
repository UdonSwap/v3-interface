import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { ChainId } from "smartorderrouter18";

import store from "../../state/index";

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.MODE]:
    "https://api.goldsky.com/api/public/project_clvqb3g2poub601xzgkzc9oxs/subgraphs/udonswap-v3/1/gn",
};

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[ChainId.MODE] });

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = store.getState().application.chainId;

  operation.setContext(() => ({
    uri:
      chainId && CHAIN_SUBGRAPH_URL[chainId]
        ? CHAIN_SUBGRAPH_URL[chainId]
        : CHAIN_SUBGRAPH_URL[ChainId.MODE],
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export const chainToApolloClient: Record<
  number,
  ApolloClient<NormalizedCacheObject>
> = {
  
  [ChainId.MODE]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[ChainId.MODE],
  }),
  
};
