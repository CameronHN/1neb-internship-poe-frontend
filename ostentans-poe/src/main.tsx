import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';

import './index.css';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const [theme] = useState(prefersDark ? webDarkTheme : webLightTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={theme}>
      <App />
    </FluentProvider>
  </StrictMode>
);
