import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { FirebaseProvider } from './contexts/FirebaseContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </FirebaseProvider>
  </React.StrictMode>
);