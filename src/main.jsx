import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import appConfig from './config/appConfig';
import { App } from './App';
 
 if (appConfig.RECORD_TELEMETRY) {
   const script = document.createElement('script');
   script.defer = true;
   script.src = 'https://cloud.umami.is/script.js';
   script.setAttribute('data-website-id', 'd1092703-9ddb-43f9-9511-d2c63eeb5717');
   document.head.appendChild(script);
 }


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
