import "./App.css";
import { useState } from "react";
import { ChakraBaseProvider } from "@chakra-ui/react";
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from "@chakra-ui/theme";

import UploadPage from "./componenets/UploadPage";
import Forms from "./componenets/Forms";
import Carousels from "./componenets/Carousels";
import LandingPage from "./componenets/LandingPage";
import Navbar from "./componenets/navbar";
import Topics from "./componenets/Topics";
// import { set } from "../../server/app";

function App() {
  const [show, setShow] = useState(true);
  const [sequence, setSequence] = useState(0);
  const [pdfId, setPdfId] = useState('');
  const [questions, setQuestions] = useState([]);

  return (
    <>
      <ChakraBaseProvider theme={chakraTheme}>
        <div>
          <LandingPage handleShow={setShow} show={show} />
          {!show ? (
            <div>
              <Navbar handleSequence={setSequence}/>
              {sequence === 0 && <UploadPage handleSequence={setSequence} handlePdfId={setPdfId}/>}
              {sequence === 1 && <Forms handleSequence={setSequence} pdfId={pdfId} setQuestions={setQuestions}/>}
              {sequence === 3 && <Topics handleSequence={setSequence}/>}
              {sequence === 2 && <Carousels questions={questions}/>}
             
              
            </div>
          ) : (
            <></>
          )}
        </div>
      </ChakraBaseProvider>
    </>
  );
}

export default App;
