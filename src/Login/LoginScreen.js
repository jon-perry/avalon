import React, { useState, useContext } from 'react';
import { SocketContext } from '../App';
const CLIENT_ACTION = require('../AppConstants');


// could add some kind of persistence here to check if they've logged in previously. have to figure out how to do that
// this is bare bones for now
export default function (props) {
    const socket = useContext(SocketContext);
    const [username, usernameInputProps] = useTextInput('username');
    const [email, emailInputProps] = useTextInput('email')

    console.log({ username, email });

    const submit = (event) => {
        event.preventDefault();
        console.log({ username, email });
        socket.emit(CLIENT_ACTION.LOGIN, { username, email });
    }

    return (
        <div classusername="login">
            <h1>Login</h1>
            <form id="login-form" onSubmit={submit}>
                <input {...usernameInputProps} />
                <input {...emailInputProps} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

// taken from the intro to react hooks video ... pretty basic but cool
function useTextInput(placeholder) {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return [
        value,
        {
            [placeholder]: value,
            onChange,
            placeholder
        }
    ];
}