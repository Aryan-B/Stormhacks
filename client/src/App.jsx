import './App.css'
import {useState} from 'react'
import { ChakraBaseProvider } from '@chakra-ui/react'
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme'

import UploadPage from './componenets/UploadPage'
import Forms from './componenets/Forms'
import Carousels from './componenets/Carousels'
import LandingPage from './componenets/LandingPage'
import Navbar from './componenets/navbar'
import Topics from './componenets/Topics'

function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      <ChakraBaseProvider theme={chakraTheme}>
        <div>
          <LandingPage handleShow={setShow} show={show}/>
          {!show ? <Navbar/> : <></>}
          <UploadPage/>
          <Forms />
          <Topics/>
          <Carousels/>
        </div>
      </ChakraBaseProvider>
    </>
  )
}

export default App