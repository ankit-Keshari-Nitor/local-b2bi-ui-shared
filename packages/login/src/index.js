import React from 'react';
import { createRoot } from "react-dom/client";
import initI18n from '../src/I18n';
import App from './App';
import './index.scss';

initI18n({
    ns: [
      'login'
    ],
    defaultNS: 'login'
  });
const root = createRoot(document.getElementById("root"));
root.render(<App />);
