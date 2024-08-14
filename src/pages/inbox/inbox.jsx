/* eslint-disable no-unused-vars */
import { useState } from 'react';
import styles from './inbox.module.css';

const Inbox = () => {
    const [conversations] = useState([
        {
            name: 'John Doe',
            type: 'work',
            messages: [
                { text: 'Project update?', time: '02/08/2024', type: 'incoming' },
                { text: 'Here it is!', time: '02/08/2024', type: 'outgoing' },
                { text: 'Thanks!', time: '03/08/2024', type: 'incoming' },
                { text: 'No problem.', time: '04/08/2024', type: 'outgoing' },
                { text: 'Can we discuss this?', time: '05/08/2024', type: 'incoming' },
                { text: 'Sure, when?', time: '05/08/2024', type: 'outgoing' },
                { text: 'How about tomorrow?', time: '06/08/2024', type: 'incoming' },
                { text: 'That works.', time: '06/08/2024', type: 'outgoing' },
                { text: 'Great.', time: '07/08/2024', type: 'incoming' },
                { text: 'Talk soon.', time: '08/08/2024', type: 'outgoing' },
                { text: 'Let’s catch up later.', time: 'yesterday', type: 'incoming' },
                { text: 'Definitely.', time: 'yesterday', type: 'outgoing' },
                { text: 'Any updates?', time: 'today', type: 'incoming' },
                { text: 'Not yet.', time: 'today', type: 'outgoing' },
            ]
        },
        {
            name: 'Jane Smith',
            type: 'friends',
            messages: [
                { text: 'Wanna hang out?', time: '02/08/2024', type: 'incoming' },
                { text: 'Sure, where?', time: '02/08/2024', type: 'outgoing' },
                { text: 'How about the park?', time: '03/08/2024', type: 'incoming' },
                { text: 'Sounds good!', time: '04/08/2024', type: 'outgoing' },
                { text: 'See you there.', time: '05/08/2024', type: 'incoming' },
                { text: 'On my way.', time: '05/08/2024', type: 'outgoing' },
                { text: 'Almost there.', time: '06/08/2024', type: 'incoming' },
                { text: 'Me too.', time: '06/08/2024', type: 'outgoing' },
                { text: 'I’m here.', time: '07/08/2024', type: 'incoming' },
                { text: 'I see you.', time: '08/08/2024', type: 'outgoing' },
                { text: 'We should do this again.', time: 'yesterday', type: 'incoming' },
                { text: 'Absolutely.', time: 'yesterday', type: 'outgoing' },
                { text: 'Lunch tomorrow?', time: 'today', type: 'incoming' },
                { text: 'Sure thing.', time: 'today', type: 'outgoing' },
            ]
        }
    ]);

    const [selectedConversation, setSelectedConversation] = useState(null);

    const selectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    const goBack = () => {
        setSelectedConversation(null);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.sidebar} ${selectedConversation ? styles.hidden : ''}`}>
                <ul className={styles.conversation_list}>
                    {conversations.map((conversation, index) => (
                        <li 
                            key={index} 
                            className={styles.conversation_item}
                            onClick={() => selectConversation(conversation)}
                        >
                            <div>{conversation.name}</div>
                            <div>{conversation.type}</div>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedConversation && (
                <div className={`${styles.chat_area} ${selectedConversation ? styles.active : ''}`}>
                    <div className={styles.chat_header}>
                        <span className={styles.back_button} onClick={goBack}>← Back</span>
                        <h3>{selectedConversation.name}</h3>
                        <p>{selectedConversation.type}</p>
                    </div>
                    {selectedConversation.messages.map((message, index) => (
                        <div key={index}>
                            {index === 0 || selectedConversation.messages[index - 1].time !== message.time ? (
                                <div className={styles.chat_date}>{message.time}</div>
                            ) : null}
                            <div className={`${styles.chat_message} ${message.type === 'incoming' ? styles.message_incoming : styles.message_outgoing}`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inbox;
