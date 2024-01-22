import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import { actions as channelsAction } from '../reducers/Channels.js';
import { actions as messagesAction, selectors } from '../reducers/Messages.js';
import routes from '../hooks/routes';
import ChatContext from '../contexts/chatContext.jsx';
import Header from '../components/header.jsx';
import ChannelsComponent from '../components/channelsComponent.jsx';
import MessagesComponent from '../components/messagesComponent.jsx';
import RenderMessageComponent from '../components/renderMessage.jsx';
import AddModal from '../modals/addModalWindow.jsx';
import RenameModal from '../modals/renameModalWindow.jsx';
import RemoveModal from '../modals/removeModalWindow.jsx';
import { useAuth } from '../contexts/authProvider.jsx';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const messagesMass = useSelector(selectors.selectAll);
  const chatContext = useContext(ChatContext);
  const {
    currentChannel,
  } = chatContext;
  const [value, setValue] = useState(true);
  const [modalType, setModalType] = useState('');
  const [channelId, setChannelId] = useState('');

  const setId = (id) => {
    setChannelId(id);
  };

  const handleChange = (state, type) => {
    setValue(state);
    setModalType(type);
  };

  const toastMessage = (message, result) => {
    const toastLabel = result === 'success' ? toast.success(message, { toastId: `${message} success` })
      : toast.error(message, { toastId: `${message} error` });
    return toastLabel;
  };

  const setModal = {
    addChannel: <AddModal onChange={handleChange} toast={toastMessage} channel={channelId} />,
    removeChannel: <RemoveModal onChange={handleChange} toast={toastMessage} channel={channelId} />,
    renameChannel: <RenameModal onChange={handleChange} toast={toastMessage} channel={channelId} />,
  };

  const currentMessages = messagesMass.filter((message) => message.channelId === currentChannel.id);

  useEffect(() => {
    const getResponse = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), {
          headers: auth.getAuth(),
        });
        const { channels, messages } = data;
        dispatch(channelsAction.addChannels(channels));
        dispatch(messagesAction.addMessages(messages));
      } catch (e) {
        auth.logOut();
        toast.error(t('toast.networkError'), { toastId: `${t('toast.networkError')} error` });
      }
    };
    getResponse();
  });

  return (
    <>
      <div className="d-flex flex-column h-100">
        <Header />
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <ChannelsComponent onChange={handleChange} setId={setId} />
            </div>
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                <div className="bg-light mb-4 p-3 shadow-sm small">
                  <p className="m-0">
                    <b>
                      {`# ${currentChannel.name}`}
                    </b>
                  </p>
                  <span className="text-muted">{t('chatPage.chat.message', { count: currentMessages.length })}</span>
                </div>
                <div id="messages-box" className="chat-messages overflow-auto px-5">
                  <RenderMessageComponent />
                </div>
                <div className="mt-auto px-5 py-3">
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
      {value === false ? setModal[modalType] : null}
    </>
  );
};

export default ChatPage;
