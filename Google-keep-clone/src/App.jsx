import './App.css'
import Navbar from './components/Navbar/Navbar.jsx'
import Modal from './components/Modal/Modal.jsx'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Modal />
      </main>
    </div>
  )
}

export default App
