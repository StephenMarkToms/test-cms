import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './HomePage';
import { ApolloAppProvider } from '../components/ApolloProvider';

const App = () => {
  return (
    <ApolloAppProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </ApolloAppProvider>
  );
};

export { App };
