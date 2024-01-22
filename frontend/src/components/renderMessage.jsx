import { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LeoProfanity from 'leo-profanity';
import { selectors } from '../slices/Messages.js';
import ChatContext from '../contexts/chatContext.jsx';

const RenderMessageComponent = () => {
  const chatContext = useContext(ChatContext);
  const { currentChannel } = chatContext;
  const messageRef = useRef();
  const messages = useSelector(selectors.selectAll);

  const currentMessages = messages.filter((message) => message.channelId === currentChannel.id);

  useEffect(() => {
    const ruCensor = LeoProfanity.getDictionary('ru');
    LeoProfanity.add(ruCensor);
    messageRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }, [currentMessages]);

  return (
    <>
      { currentMessages.map((message) => (
        <div key={message.id} className="text-break mb-2">
          <b>{message.username}</b>
          :
          {` ${LeoProfanity.clean(message.body)}`}
        </div>
      ))}
      <span ref={messageRef} />
    </>
  );
};

export default RenderMessageComponent;
