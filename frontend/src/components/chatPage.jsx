import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { actions as channelsAction } from '../reducers/Channels.js';
import { actions as messagesAction } from '../reducers/Messages.js';
import routes from '../hooks/routes';
import ChatContext from '../contexts/chatContext';
import useAuth from '../hooks/index.jsx';
import ChannelsComponent from './channelsComponent';
import MessagesComponent from './messagesComponent';
import RenderMessageComponent from './renderMessage';
import Modal from './modalPage.jsx';

const ChatPage = () => {
    const dispatch = useDispatch();
    const chatContext = useContext(ChatContext);
    const {
      getNewChannel,
      getNewMessage,
      subscribeRemoveChannel,
      subscribeRenameChannel,
      currentChannel,
    } = chatContext;
    const [ value, setValue ] = useState(true);
    const handleChange = (value) => {
      setValue(value);
    };
    console.log(value)
    
    useEffect(() => {
      const getResponse = async () => {
        const token = `Bearer ${localStorage.getItem('token')}`;
        try {
          const { data } = await axios.get(routes.usersPath(), {
            headers: {
              Authorization: token,
            },
          });
          const { channels, messages } = data;
          dispatch(channelsAction.addChannels(channels));
          dispatch(messagesAction.addMessages(messages));
        } catch(e) {
          console.log(e)
        }
      };
      getResponse();
      getNewMessage();
      getNewChannel();
      subscribeRemoveChannel();
      subscribeRenameChannel();
    });

    const AuthButton = () => {
        const auth = useAuth();
      
        return (
          auth.loggedIn
            ? <Button onClick={auth.logOut}>Выйти</Button>
            : null
        );
      };

  return (
    <>
    <div className='h-100'>
      <div id='chat' className='h-100'>
        <div className='d-flex flex-column h-100'>
          <Nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
            <div className='container'>
              <a className='navbar-brand' href='/'>Hexlet Chat</a>
                <AuthButton />
            </div>
          </Nav>
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                  <ChannelsComponent onChange={handleChange} />
                </div>
                  <div className="col p-0 h-100">
                    <div className='d-flex flex-column h-100'>
                      <div className='bg-light mb-4 p-3 shadow-sm small'>
                        <p className='m-0'>
                          <b># {currentChannel.name}</b>
                        </p>
                        <span className='text-muted'>сообщений</span>
                      </div>
                        <div id='messages-box' className='chat-messages overflow-auto px-5'>
                           <RenderMessageComponent />
                        </div>
                          <div className='mt-auto px-5 py-3'>
                            <MessagesComponent />
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
     </div>
    {value === false ? <Modal onChange={handleChange} /> : null}
    </>
  );
};

export default ChatPage;