import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/authProvider.jsx';
import ChatContext from '../contexts/chatContext';

const MessagesComponent = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const chatContext = useContext(ChatContext);
  const ref = useRef();
  const { sendNewMessage, currentChannel } = chatContext;
  const auth = useAuth();

  const sendMessage = async () => {
    const message = {
      body: text,
      channelId: currentChannel.id,
      username: auth.user.username,
    };
    await sendNewMessage(message);
    setText('');
  };

  useEffect(() => {
    ref.current.focus();
  });

  return (
    <Form
      className="py-1 border rounded-2"
      novalidate=""
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <InputGroup className="has-validation">
        <Form.Control
          name="body"
          placeholder="Введите сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Новое сообщение"
          className="border-0 p-0 ps-2"
          noValidate=""
          ref={ref}
        />
        <Button variant="group-vertical btn-light" type="submit" disabled={text === ''}>
          <ArrowRightSquare width="20" height="20" />
          <span className="visually-hidden">
            {t('charPage.chat.send')}
          </span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessagesComponent;
