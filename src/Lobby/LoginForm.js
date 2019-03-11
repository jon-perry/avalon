import React, { useState, useContext } from 'react';
import { SocketContext } from '../App';
import './LoginForm.scss';
const CLIENT_ACTION = require('../AppConstants');

function LoginForm({ loggedIn }) {
    const socket = useContext(SocketContext);
    const [name, nameInputProps] = useTextInput('name');
    const [password, passwordInputProps] = useTextInput('password')
    
    const submit = (event) => {
        event.preventDefault();
        socket.emit(CLIENT_ACTION.LOGIN, { name, password });
    }

    return loggedIn === undefined ? (<div>Loading...</div>) : (
        <form className="login-form" onSubmit={submit}>
            <input type="text" {...nameInputProps} />
            <input type="password" {...passwordInputProps} />
            <div className="login-controls">
                <button type="submit">Submit</button>
                <button onClick={() => alert('Not yet implemented')}>Register</button> {/* TODO: Implement user creation page */}
            </div>
        </form>
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
            onChange,
            placeholder
        }
    ];
}

export default LoginForm;