import './App.css'
import { ReactLocation, Router } from '@tanstack/react-location'
import { routes } from './routes'


const location = new ReactLocation();

function App() {

  return (
    <Router location={location} routes={routes} />
  )
}

export default App
