import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './carousel.css';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
  } from '@chakra-ui/react'

function Item(props)
{
    // console.log(props)
    return (
        <div className="m-10 min-h-[500px] border-2 p-20 fill-gray">
            <div class="grid grid-cols-2 gap-4">
                <div className='text-left'>
                    <h1>Q{props.key}.</h1>
                    <br/>
                    <h2>{props.item.question}</h2>
                </div>
                
                {/* <p>{props.item.answer}</p> */}
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                            Show Answer
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>{props.item.answer}</AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
    )
}

const Carousels = (props) => {

    const items = [
        {
            question: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.  The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
            answer: "Probably the most random thing you have ever seen!"
        },
        {
            question: "What does the acronym 'URL' stand for",
            answer: "Uniform Resource Locator"
        },        
        {
            question: "What is the purpose of regularization in machine learning?",
            answer: "To penalize complex models and prevent overfitting."
        },
        {
            question: "What is the difference between supervised and unsupervised learning?",
            answer: "Supervised learning uses labeled data, while unsupervised learning uses unlabeled data."
        }
    ]

    const responsive = {
        desktop: {
          breakpoint: { max: 6000, min: 1024 },
          items: 1
        }
    }
    let count = 1;
    return (
        <div className='my-8'>
            <Carousel responsive={responsive}>
                {items.map((item, index) => {
                    console.log(index);
                    return (
                        <Item item={item} key={count++}/>
                    )
                })}
            </Carousel>
        </div>

    )
};

export default Carousels;