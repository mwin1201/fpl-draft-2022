import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { CurrentUserProvider } from './context/CurrentUserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // FPL data changes at most a few times per gameweek, so keep fetched data
      // "fresh" for 5 minutes to avoid redundant refetches on navigation.
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
