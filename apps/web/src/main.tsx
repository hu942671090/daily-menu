import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('缺少 #root 挂载节点');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
