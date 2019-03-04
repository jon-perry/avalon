import React, { useState, useContext } from 'react';
import { SocketContext } from '../App';


// could add some kind of persistence here to check if they've logged in previously. have to figure out how to do that
// this is bare bones for now
export default function (props) {
    const socket = useContext(SocketContext);
    const name = useFormInput('Type your name here');
    const email = useFormInput('Type your email here')

    const submit = (event) => {
        event.preventDefault();
        socket.emit('login', { name: name });
    }


    return (
        <div>
            <div>
                <form onSubmit={submit}>
                    <input {...name} />
                </form>
            </div>
            <div>
                <form label="hello" onSubmit={submit}>
                    <input {...email} />
                </form>
            </div>
        </div>
    )
}


// taken from the intro to react hooks video ... pretty basic but cool
function useFormInput(initial) {
    const [value, setValue] = useState(initial);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const focus = event => value === initial ? setValue('') : undefined;

    return { value, onChange: handleChange, onFocus: focus };
}