import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './firebase';  // Import your AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
