import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';

const client = new ApolloClient({
  uri: `${process.env.STRAPI_ADMIN_BFF_URL}/graphql`,
  cache: new InMemoryCache(),
});

export const ApolloAppProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
