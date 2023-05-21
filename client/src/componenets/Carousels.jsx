import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './carousel.css';
import {
    FileUploadContainer,
} from "./upload.styles";

function Item(props)
{
    console.log(props);
    return (
        <Carousel.Item>
            <div className="d-block h-100">
            <img
                className="d-block w-50 h-100"
                // src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fvideos%2Fblack%2520background%2F&psig=AOvVaw2GDm0cdzZvpQOMUNHp2vKe&ust=1684761989525000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCPjP9dDBhv8CFQAAAAAdAAAAABAE"
                alt={props.item.question}
            />
            </div>
            <Carousel.Caption
                className="d-block w-100 carousel-height">
                {/* <h2>{props.item.question}</h2> */}
                <p>{props.item.answer}</p>
            </Carousel.Caption>
        </Carousel.Item>
    )
}

const Carousels = (props) => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    let items = [
        {
            question: "Random Name #1",
            answer: "Probably the most random thing you have ever seen!"
        },
        {
            question: "Random Name #2",
            answer: "Hello World!"
        },        
        {
            question: "Random Name #3",
            answer: "Probably the most random thing you have ever seen!"
        },
        {
            question: "Random Name #4",
            answer: "Hello World!"
        }
    ]

    return (
        // <div className='h-[100vh]' >
            <Carousel activeIndex={index} onSelect={handleSelect}>
                {items.map((item, index) => {
                    return (
                        <Item item={item} key={index}/>
                    )
                })}
            </Carousel>
        // </div>
    )
};

export default Carousels;