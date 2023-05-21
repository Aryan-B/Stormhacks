import './App.css'

import { ChakraBaseProvider } from '@chakra-ui/react'
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme'

import UploadPage from './componenets/UploadPage'
import Forms from './componenets/Forms'
import SummaryPage from './componenets/summaryPage'
import LandingPage from './componenets/LandingPage'

function App() {

  return (
    <>
      <ChakraBaseProvider theme={chakraTheme}>
        <div>
          <LandingPage/>
          <UploadPage/>
          <Forms />
        </div>
      </ChakraBaseProvider>
    </>
  )
}

export default App
