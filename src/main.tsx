import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './types/chartjs-plugin-crosshair.d.ts';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
