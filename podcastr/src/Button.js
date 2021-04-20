import { useState } from 'react';

export default function Button(props) {
    const [counter, setCounter] = useState(1); //counter = [estado, alterarEstado]

    function increment() {
        setCounter(counter + 1);
        console.log("Valor de counter: "+ counter);
    }

    return (
        <>
            <br/>
            <span>{counter}</span>
            <button onClick={increment}> {props.title} </button>
        </>
        
    )
}