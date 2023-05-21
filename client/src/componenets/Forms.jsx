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

import "./forms.css";
const Forms = (props) => {
  const [checkedItems, setCheckedItems] = React.useState(false);
  const [value, setValue] = React.useState("1");
  const handleInputChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    props.handleSequence(2);
  };

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
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c1"
                  >
                    Checkbox1
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c2"
                  >
                    Checkbox2
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c3"
                  >
                    Checkbox3
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c4"
                  >
                    Checkbox4
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c5"
                  >
                    Checkbox5
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c6"
                  >
                    Checkbox6
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c7"
                  >
                    Checkbox7
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c5"
                  >
                    Checkbox5
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c6"
                  >
                    Checkbox6
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedItems[0]}
                    onChange={(e) => setCheckedItems(e.target.checked)}
                    value="c7"
                  >
                    Checkbox7
                  </Checkbox>
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
