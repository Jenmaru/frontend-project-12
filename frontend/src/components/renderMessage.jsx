import { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../reducers/Messages.js';
import ChatContext from '../contexts/chatContext.jsx';

const RenderMessageComponent = () => {
  const chatContext = useContext(ChatContext);
  const { currentChannel } = chatContext;
  const lastMessageRef = useRef();
  const messages = useSelector(selectors.selectAll);

  const filteredMessages = messages.filter((message) => message.channelId === currentChannel.id);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }, [filteredMessages]);

  return (
    <>
      { filteredMessages.map((message) => (
        <div key={message.id} className="text-break mb-2">
          <b>{message.username}</b>
          :
          {` ${message.body}`}
        </div>
      ))}
      <span ref={lastMessageRef} />
    </>
  );
};

export default RenderMessageComponent;