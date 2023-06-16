import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MantineProvider } from '@mantine/core'
import { ReactLocation, Router } from '@tanstack/react-location'
import { routes } from './routes'

const location = new ReactLocation();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS withCSSVariables theme={{
      primaryColor: 'green'
    }}>
      <Router location={location} routes={routes} >
        <App />
      </Router>
    </MantineProvider>
  </React.StrictMode>,
)
