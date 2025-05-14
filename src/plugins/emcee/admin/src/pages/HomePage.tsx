import { Main } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { gql, useQuery } from '@apollo/client';

const GET_BRANDS = gql`
  query getMerchants($input: String!) {
    allMerchants(filter: { displayName: { includesInsensitive: $input } }) {
      edges {
        node {
          id
          displayName
        }
      }
    }
  }
`;

const HomePage = () => {
  const input = 'haw';
  const { loading, error, data } = useQuery(GET_BRANDS, {
    variables: { input },
  });

  return (
    <Main>
      <h1>Welcome to Emcee</h1>
      <p>{JSON.stringify(data)}</p>
    </Main>
  );
};

export { HomePage };
