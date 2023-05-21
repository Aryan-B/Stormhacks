import React, { useEffect, useState, useRef } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import { FileUploadContainer } from "./upload.styles";

import axios from "axios";

import "./forms.css";
const Forms = (props) => {
  const [checkedItems, setCheckedItems] = React.useState(false);
  const [value, setValue] = React.useState("1");
  const handleInputChange = (e) => setInput(e.target.value);

  const [checkedList, setCheckedList] = useState([]);

  const [topics, setTopics] = useState([]);

  const [noOfQues, setNoOfQues] = useState(10);

  const pdfId = props.pdfId;

  var comps = topics.map((topic) => {
    return(
      <Checkbox
        key={topic}
        value={topic}
        onChange={(e) => {
          if (e.target.checked) {
            checkedList.push(e.target.value);
          } else {
            checkedList.splice(checkedList.indexOf(e.target.value), 1);
          }
        }}
      >
        {topic}
      </Checkbox>
    )
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(
      `http://localhost:3000/question`,
      {
        id: pdfId,
        topics: checkedList,
        noOFQues: value,
        level: value,
      },
    ).then((res) => {
      console.log(res.data);
      props.handleSequence(2);
    });
    

  };

  useEffect(() => {
    axios.get(`http://localhost:3000/api/getTopics/${pdfId}`).then((res) => {
      setTopics(res.data.topics);
    });
  }, [pdfId]);



  return (
    <div className="flex flex-col text-center">
      <h2 className="text-4xl font-bold text-white text-shadow">Set Topics</h2>
      <FileUploadContainer>
        <FormControl isRequired>
            <div class="grid grid-cols-2 gap-4">
            <div>
              <FormLabel>Topics detected:</FormLabel>
              <CheckboxGroup colorScheme="purple">
                <Stack
                  spacing={[1, 5]}
                  direction={["row", "column"]}
                  overflow="auto"
                  maxHeight={60}
                >
                  {comps}
                </Stack>
              </CheckboxGroup>
            </div>
            <div >
              <Stack direction={["column"]} maxHeight={60} className="flex">
                <div>
                  <FormLabel>Set Difficulty Level:</FormLabel>
                  <RadioGroup onChange={setValue} value={value}>
                    <Stack direction="row">
                      <Radio value="easy">Easy</Radio>
                      <Radio value="medium">Medium</Radio>
                      <Radio value="hard">Hard</Radio>
                    </Stack>
                  </RadioGroup>
                </div>
                <div minHeight="[120px]"></div>

                <div>
                  <FormLabel className="font-extrabold">
                    Set Number of Questions:
                  </FormLabel>
                  <NumberInput
                    defaultValue={10}
                    min={1}
                    max={50}
                    className="w-24"
                    onChange={(value) => {
                      setNoOfQues(value);
                    }
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </div>
                <div className="text-left mt-20">
                  Disclaimer: Questions generated will be stored and displayed
                  publicly for educational purposes.
                </div>
                <div className="flex flex-row justify-end flex-1/2">
                  <button
                    className="bg-[#8294C4] w-[150px] h-[50px] text-white text-[20px] font-bold rounded-md shadow-md hover:bg-[#6B7FA3] mt-10"
                    onClick={handleSubmit}
                  >
                    Generate
                  </button>
                </div>
              </Stack>
            </div>
          </div>
        </FormControl>
      </FileUploadContainer>
    </div>
  );
};

export default Forms;
