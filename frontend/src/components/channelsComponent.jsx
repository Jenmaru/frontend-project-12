import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';
import cn from 'classnames';
import ChatContext from '../contexts/chatContext.jsx';
import { selectors } from '../reducers/Channels';

const ChannelItem = (props) => {
  const {
    channel,
    currentChannel,
    setCurrentChannel,
    onChange,
    setId,
    t,
  } = props;

  return (
    <li className="nav-item w-100" key={channel.id}>
      { !channel.removable
        ? (
          <button
            type="button"
            onClick={() => setCurrentChannel(channel)}
            className={cn('w-100', 'rounded-0', 'text-start', 'btn', {
              'btn-secondary': channel.id === currentChannel.id,
            })}
          >
            <span>#</span>
            {' '}
            {channel.name}
          </button>
        )
        : (
          <Dropdown as={ButtonGroup} className="d-flex">
            <Button
              type="button"
              variant={channel.id === currentChannel.id && 'secondary'}
              onClick={() => setCurrentChannel(channel)}
              className="w-100 rounded-0 text-start text-truncate"
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>
            <Dropdown.Toggle
              split
              variant={channel.id === currentChannel.id && 'secondary'}
              id={`dropdown-split-basic-${channel.id}`}
            >
              <span className="visually-hidden">{t('chatPage.channels.control')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={() => {
                  setId(channel);
                  setCurrentChannel(channel);
                  onChange(false, 'removeChannel');
                }}
                id={channel.id}
              >
                {t('chatPage.channels.remove')}
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={() => {
                  setId(channel);
                  onChange(false, 'renameChannel');
                }}
                id={channel.id}
              >
                {t('chatPage.channels.rename')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
    </li>
  );
};

const ChannelsComponent = ({ onChange, setId }) => {
  const channels = useSelector(selectors.selectAll);
  const chatContext = useContext(ChatContext);
  const { currentChannel, setCurrentChannel } = chatContext;
  const { t } = useTranslation();

  console.log(currentChannel);

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chatPage.channels.title')}</b>
        <button onClick={() => onChange(false, 'addChannel')} type="button" className="p-0 text-primary btn btn-group-vertical">
          <PlusSquare height="20" width="20" />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            currentChannel={currentChannel}
            setCurrentChannel={setCurrentChannel}
            onChange={onChange}
            setId={setId}
            t={t}
          />
        ))}
      </ul>
    </>
  );
};

export default ChannelsComponent;
