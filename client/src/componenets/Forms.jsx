import React, { useEffect, useState, useRef } from "react";
import { Checkbox, CheckboxGroup, FormControl, FormLabel, Stack, Radio, RadioGroup, NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper, Box
} from '@chakra-ui/react'

import {
    FileUploadContainer,
    FormField,
    DragDropText,
    UploadFileBtn,
    FilePreviewContainer,
    ImagePreview,
    PreviewContainer,
    PreviewList,
    FileMetaData,
    RemoveFileIcon,
    InputLabel,
} from "./upload.styles";

import './forms.css'
const Forms = () => {
    const [checkedItems, setCheckedItems] = React.useState(false)
    const [value, setValue] = React.useState('1')
    const handleInputChange = (e) => setInput(e.target.value)
  
  
    return (
        <FileUploadContainer>
        <FormControl isRequired >
            <div className="flex">
                <div className="w-1/2 px-20">
                    <FormLabel>Topics detected:</FormLabel>
                    <CheckboxGroup colorScheme='purple'>
                        <Stack spacing={[1, 5]} direction={['row', 'column']} overflow="auto" height="40">
                            <Checkbox 
                            isChecked={checkedItems[0]} 
                            onChange={(e) => setCheckedItems(e.target.checked)} 
                            value='c1'>Checkbox1</Checkbox>
                            <Checkbox 
                            isChecked={checkedItems[0]} 
                            onChange={(e) => setCheckedItems(e.target.checked)} 
                            value='c2'>Checkbox2</Checkbox>
                            <Checkbox 
                            isChecked={checkedItems[0]} 
                            onChange={(e) => setCheckedItems(e.target.checked)} 
                            value='c3'>Checkbox3</Checkbox>
                            <Checkbox 
                            isChecked={checkedItems[0]} 
                            onChange={(e) => setCheckedItems(e.target.checked)} 
                            value='c4'>Checkbox4</Checkbox>
                            <Checkbox 
                            isChecked={checkedItems[0]} 
                            onChange={(e) => setCheckedItems(e.target.checked)} 
                            value='c5'>Checkbox5</Checkbox>
                        </Stack>
                    </CheckboxGroup>
                </div>
                <div className="w-1/2 px-20">
                    <Stack spacing={[1, 5]} direction={['row', 'column']} height="40">
                        <FormLabel>Set Difficulty Level:</FormLabel>
                        <RadioGroup onChange={setValue} value={value}>
                            <Stack direction='row'>
                                <Radio value='easy'>Easy</Radio>
                                <Radio value='medium'>Medium</Radio>
                                <Radio value='hard'>Hard</Radio>
                            </Stack>
                        </RadioGroup>
                        
                        <FormLabel>Set Number of Questions:</FormLabel>
                        <NumberInput defaultValue={10} min={1} max={50} className="w-24">
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Stack>
                </div>
            </div>
        </FormControl>
        </FileUploadContainer>
    )
};

export default Forms;
