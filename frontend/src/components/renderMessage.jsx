import { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LeoProfanity from 'leo-profanity';
import { selectors } from '../reducers/Messages.js';
import ChatContext from '../contexts/chatContext.jsx';

const RenderMessageComponent = () => {
  const chatContext = useContext(ChatContext);
  const { currentChannel } = chatContext;
  const messageRef = useRef();
  const messages = useSelector(selectors.selectAll);
  const censor = LeoProfanity;
  const ruCensor = censor.getDictionary('ru');
  censor.add(ruCensor);

  const currentMessages = messages.filter((message) => message.channelId === currentChannel.id);

  useEffect(() => {
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
          {` ${censor.clean(message.body)}`}
        </div>
      ))}
      <span ref={messageRef} />
    </>
  );
};

export default RenderMessageComponent;
