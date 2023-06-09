import { useState } from "react";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Tag,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";

import { SearchIcon, AddIcon } from "@chakra-ui/icons";

import "./forms.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


const Topics = (props) => {
  const [formData, setFormData] = useState({
    searchTerm: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data, e.g., send it to the server

    props.handleSequence(3);
    console.log(formData);
  };

  const handleClear = () => {
    setFormData({
      searchTerm: "",
    });
  };

  const posts = [
    {
      topic: "Lorem Ipsum",
      keywords: ["random", "text", "latin", "literature"],
      noOfQuestions: 5,
      difficulty: "easy",
    },
    {
      topic: "Machine Learning",
      keywords: ["random", "text", "latin", "literature"],
      noOfQuestions: 20,
      difficulty: "hard",
    },        
    {
      topic: "Try Catch Loop",
      keywords: ["error", "exception", "try", "catch"],
      noOfQuestions: 15,
      difficulty: "easy",
    },
    {
      topic: "Linear Regression",
      keywords: ["machine learning", "regression", "linear"],
      noOfQuestions: 15,
      difficulty: "easy",
    }
]

  const listing = posts.map((item) => {
    return (
      <Card key={item.topic} style={{ margin: "10px" }}>
        <Card.Body>
          <Card.Title>{item.topic}</Card.Title>
          <Card.Text>
            <strong>{item.difficulty}</strong> <br/>
            {item.noOfQuestions} questions <br/>
            {item.keywords.map((keyword) => {
              return (
                <Tag size="sm" style={{ margin: "2px"}} variant="solid" colorScheme="cyan" key={keyword}>
                  <TagLabel>{keyword}</TagLabel>
                </Tag>
              );
            })}
          </Card.Text>

        </Card.Body>
      </Card>
    );
  });

  return (
    <div className="flex flex-col text-center h-[100vh]">
      <div className="flex flex-row mt-[80px]">
        <div className="w-1/2 mx-20 border-solid border-white border-2">
          <form action="" className="p-12" size="xl">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="#8294C4" />
              </InputLeftElement>
              <Input
                placeholder="Search for a topic"
                _placeholder={{"text-color": "white" }}
                value={formData.searchTerm}
                onChange={handleChange}
              />
            </InputGroup>
            <div className="flex flex-row items-center justify-end text-white mt-16 text-[20px] ">
              <button className="w-[150px] h-[50px]" onClick={handleClear}>Clear</button>
              <button
                className="bg-[#8294C4] w-[150px] h-[50px] font-bold rounded-md shadow-md hover:bg-[#6B7FA3]"
                onClick={handleSubmit}
              >
                Generate
              </button>
            </div>
            <div className="border-solid border-2 border-[#8294C4] my-10"></div>
            <div className="flex flex-row gap-x-3 mt-11 justify-center">
              <Tag
                size="lg"
                variant="solid"
                colorScheme="purple"
                borderRadius="full"
              >
                <TagLabel>CPSC 304</TagLabel>
                <TagRightIcon boxSize="12px" as={AddIcon} />
              </Tag>
              <Tag
                size="lg"
                variant="solid"
                colorScheme="purple"
                borderRadius="full"
              >
                <TagLabel>BUS 250</TagLabel>
                <TagRightIcon boxSize="12px" as={AddIcon} />
              </Tag>
              <Tag
                size="lg"
                variant="solid"
                colorScheme="purple"
                borderRadius="full"
              >
                <TagLabel>CMPT 310</TagLabel>
                <TagRightIcon boxSize="12px" as={AddIcon} />
              </Tag>
              <Tag
                size="lg"
                variant="solid"
                colorScheme="purple"
                borderRadius="full"
              >
                <TagLabel>CMPT 310</TagLabel>
                <TagRightIcon boxSize="12px" as={AddIcon} />
              </Tag>
            </div>
          </form>
        </div>


        <div className="w-1/2 mx-10 p-4">
          <div className="box-content">
            {listing}
          </div>
        </div>
        {/* <div className="w-1/2 mx-10 border-solid border-white border-2 p-6">
          <ul className="flex flex-col items-start p-6 list-disc">
            <li className="text-white text-4xl">Distributed Systems</li>
            <li className="text-white text-4xl">Embedded Systems</li>
            <li className="text-white text-4xl">Prompt Engineering</li>
            <li className="text-white text-4xl">NLP</li>
            <li className="text-white text-4xl">Web Systems Architecture</li>
            <li className="text-white text-4xl">Operating Systems</li>
            <li className="text-white text-4xl">User Interactive Design</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Topics;
