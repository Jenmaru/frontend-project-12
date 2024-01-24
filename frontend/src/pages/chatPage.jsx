import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import { actions as channelsAction } from '../slices/Channels.js';
import routes from '../routes.js';
import Header from '../components/header.jsx';
import ChannelsComponent from '../components/channelsComponent.jsx';
import AddModal from '../modals/addModalWindow.jsx';
import RenameModal from '../modals/renameModalWindow.jsx';
import RemoveModal from '../modals/removeModalWindow.jsx';
import { useAuth } from '../contexts/authProvider.jsx';
import { actions as messagesAction } from '../slices/Messages.js';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  useEffect(() => {
    const getResponse = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), {
          headers: auth.getAuth(),
        });
        const { channels, messages, currentChannelId } = data;
        dispatch(channelsAction.addChannels(channels));
        dispatch(messagesAction.addMessages(messages));
        dispatch(channelsAction.setChannelId(currentChannelId));
      } catch (e) {
        auth.logOut();
        toast.error(t('toast.networkError'), { toastId: `${t('toast.networkError')} error` });
      }
    };
    getResponse();
  }, [auth, dispatch, t]);

  return (
    <>
      <div className="d-flex flex-column h-100">
        <Header />
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <ChannelsComponent onChange={handleChange} setId={setId} />
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
