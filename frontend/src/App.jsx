import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Room from './Pages/Room'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/room/:roomId' element={<Room/>}></Route>
      </Routes>
  </BrowserRouter>
  )
}

export default App
