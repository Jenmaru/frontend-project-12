import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsAction } from '../reducers/Channels.js';
import { actions as messagesAction } from '../reducers/Messages.js';
import routes from '../hooks/routes';
import ChatContext from '../contexts/chatContext';
import Header from "../components/header.jsx";
import ChannelsComponent from '../components/channelsComponent';
import MessagesComponent from '../components/messagesComponent';
import RenderMessageComponent from '../components/renderMessage';
import AddModal from '../modals/addModalWindow.jsx';
import RenameModal from '../modals/renameModalWindow.jsx';
import RemoveModal from '../modals/removeModalWindow.jsx';
import { useTranslation } from 'react-i18next';
import { selectors } from '../reducers/Messages.js';
import useAuth from '../hooks/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
    const auth = useAuth();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const messages = useSelector(selectors.selectAll);
    const chatContext = useContext(ChatContext);
    const {
      getNewChannel,
      getNewMessage,
      subscribeRemoveChannel,
      subscribeRenameChannel,
      currentChannel,
    } = chatContext;
    const [ value, setValue ] = useState(true);
    const [ modalType, setModalType ] = useState('');
    const [ channelId, setChannelId ] = useState('');

    const setId = (id) => {
      setChannelId(id);
    };

    const handleChange = (value, type) => {
      setValue(value);
      setModalType(type);
    };

    const toastMessage = (message, result) => {
      result === 'success' ? toast.success(message, { toastId: `${message} success` } ) :
      toast.error(message, { toastId: `${message} error`});
    };

    const setModal = {
      addChannel: <AddModal onChange={handleChange} toastMessage={toastMessage} channel={channelId} />,
      removeChannel: <RemoveModal onChange={handleChange} toastMessage={toastMessage} channel={channelId}/>,
      renameChannel: <RenameModal onChange={handleChange} toastMessage={toastMessage} channel={channelId}/>,
    };

    const currentMessages = messages.filter((message) => message.channelId === currentChannel.id);
    
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
          auth.logOut();
          toast.error(t('toast.networkError'), { toastId: `${t('toast.networkError')} error`});
        }
      };
      getResponse();
      getNewMessage();
      getNewChannel();
      subscribeRemoveChannel();
      subscribeRenameChannel();
    });

  return (
    <>
    <div className='h-100'>
      <div id='chat' className='h-100'>
        <div className='d-flex flex-column h-100'>
          <Header />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                  <ChannelsComponent onChange={handleChange} setId={setId}/>
                </div>
                  <div className="col p-0 h-100">
                    <div className='d-flex flex-column h-100'>
                      <div className='bg-light mb-4 p-3 shadow-sm small'>
                        <p className='m-0'>
                          <b># {currentChannel.name}</b>
                        </p>
                        <span className='text-muted'>{t('chatPage.chat.message', { count: currentMessages.length })}</span>
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
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
        </div>
     </div>
    {value === false ? setModal[modalType] : null}
    </>
  );
};

export default ChatPage;