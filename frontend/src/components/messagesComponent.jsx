import React, { useState, useContext, useRef, useEffect, } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

import ChatContext from '../contexts/chatContext';

const MessagesComponent = () => {
  const [text, setText] = useState('');
  const chatContext = useContext(ChatContext);
  const ref = useRef();
  const { sendNewMessage, currentChannel } = chatContext;

  const sendMessage = () => {
    const message = {
      body: text,
      channelId: currentChannel.id,
      username: localStorage.username,
    };
    sendNewMessage(message);
    setText('');
  };

  useEffect(() => {
    ref.current.focus();
  });

  return (
    <Form
      className="py-1 border rounded-2"
      novalidate=''
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <InputGroup className='has-validation'>
        <Form.Control
          name='body'
          type="text"
          placeholder='Введите сообщение...'
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Новое сообщение..."
          className="border-0 p-0 ps-2 form-control"
          noValidate=''
          ref={ref}
        />
        <Button variant="group-vertical" type="submit" disabled={text === ''}>
          
          <span className="visually-hidden">
            Отправить
          </span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessagesComponent;