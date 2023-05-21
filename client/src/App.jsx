import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme'

import UploadPage from './componenets/UploadPage'
import QuesPage from './componenets/QuesPage'
import SummaryPage from './componenets/summaryPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChakraBaseProvider theme={chakraTheme}>
        <div>
          <UploadPage />
          <SummaryPage />
          <QuesPage />
        </div>
      </ChakraBaseProvider>
    </>
  )
}

export default App
