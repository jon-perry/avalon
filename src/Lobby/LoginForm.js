import React, { useState, useContext } from 'react';
import { SocketContext } from '../App';
import './LoginForm.scss';
const APP_CONSTANTS = require('../AppConstants');

function LoginForm({ loggedIn, error }) {
    const socket = useContext(SocketContext);
    const [name, nameInputProps] = useTextInput('name');
    const [password, passwordInputProps] = useTextInput('password (stored in plain-text)')
    const [reEnteredPassword, reEnteredPasswordInputProps] = useTextInput('re-enter password')
    const [showRegister, setShowRegister] = useState(false);
    const [clientError, setClientError] = useState('');

    const submit = (event) => {
        event.preventDefault();
        if (!showRegister) {
            if (name === '') {
                setClientError('Enter username');
                return;
            } else if (password === '') {
                setClientError('Enter password');
                return;
            } else {
                setClientError('');
            }
            socket.emit(APP_CONSTANTS.LOGIN, { name, password });
        } else {
            if (password === '') {
                setClientError('Enter a password');
            }
            else if (password !== reEnteredPassword) {
                setClientError('Passwords do not match');
            } else {
                setClientError('');
                socket.emit(APP_CONSTANTS.CREATE_USER, { name, password })
            }
        }
    }
    const handleButtonClick = () => {
        setShowRegister(!showRegister);
        setClientError('');
    };

    return loggedIn === undefined ? (<div>Loading...</div>) : (
        <form className="login-form" onSubmit={submit}>
            <div className="error" hidden={!(error || clientError)}>{clientError ? clientError : error}</div>
            <input type="text" {...nameInputProps} />
            <input type="password" {...passwordInputProps} />
            {
                showRegister && (
                    <input type="password" {...reEnteredPasswordInputProps} />
                )
            }
            <div className="login-controls">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => handleButtonClick()}>{!showRegister ? 'Register' : 'Login'}</button>
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