import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Import Router for navigation
import { BrowserRouter } from 'react-router-dom';

// 2. Import Context Providers for global state
import { AuthProvider } from './context/AuthContext.jsx';

// 3. Import React Query for data fetching in the admin panel
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provides data fetching and caching capabilities */}
    <QueryClientProvider client={queryClient}>
      {/* Handles all application routing */}
      <BrowserRouter>
        {/* Manages user authentication state (who is logged in) */}
        <AuthProvider>
          {/* Manages shopping cart state */}
          
            <App />
          
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);