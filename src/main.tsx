import { createRoot } from 'react-dom/client';

import App from './app/App.tsx';
import './styles/index.css';

const userAgent = navigator.userAgent;

const isSafari =
  /Safari/i.test(userAgent) &&
  !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS|Android/i.test(userAgent);

if (isSafari) {
  document.documentElement.classList.add('is-safari');
}

const updateAppHeight = () => {
  document.documentElement.style.setProperty(
    '--app-height',
    `${window.innerHeight}px`,
  );
};

updateAppHeight();

window.addEventListener('resize', updateAppHeight, {
  passive: true,
});

window.addEventListener('orientationchange', updateAppHeight, {
  passive: true,
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

createRoot(rootElement).render(<App />);
