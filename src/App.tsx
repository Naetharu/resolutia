import './App.css'
import { Outlet } from '@tanstack/react-location'

import { AppShell } from '@mantine/core';
import MainHeader from './components/MainHeader/MainHeader';

const navigationLinks = [
  {
    to: '/',
    text: 'Home'
  },
  {
    to: '/about',
    text: 'About'
  }
]

function App() {

  return (
    <AppShell
      padding="md"
      header={<MainHeader links={navigationLinks} />}
    >
      <Outlet />
    </AppShell>
  )
}

export default App
