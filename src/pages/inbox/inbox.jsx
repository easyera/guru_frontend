/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import styles from "./inbox.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Inbox = () => {
  const { auth, logout, refreshToken } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { id } = useParams();
  const [pollingActive, setPollingActive] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (auth.token === null || auth.token === null) {
        logout();
        redirecttopath("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/inbox`, {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        });
        setConversations(response.data.conversations);
        // console.log(response.data.conversations);
      } catch (error) {
        if (error.response && error.response.data.message === "Token expired") {
          await refreshToken();
          const response = await axios.get(`${API_BASE_URL}/inbox`, {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          });
          setConversations(response.data.conversations);
        } else {
          logout();
          redirecttopath("/login");
          console.error("Error fetching conversations:", error);
        }
      }
    };

    if (id) {

      const fetch = async () => {
        if (auth.token === null || auth.refreshToken === null) {
          logout();
          redirecttopath("/login");
        } else {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/inbox/check-conversation`,
              { id: id },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            if (response.status === 200) {
              // console.log(response.data.conversations);
              setConversations(response.data.conversations);
            }
          } catch (error) {
            if (error.response.data.message === "Token expired") {
              refreshToken();
              window.location.reload();
            } else {
              console.log(error);
              logout();
              redirecttopath("/login");
            }
          }
        }
      };

      fetch();
    } else {
      fetchConversations();
    }
  }, []);

  const adjustHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to auto to calculate scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
  };

  const redirecttopath = (path) => {
    window.location.href = path;
  };

  const startPolling = () => {
    setPollingActive(true);
  };

  useEffect(() => {
    if (!pollingActive) return;

    const intervalId = setInterval(async () => {
      if (selectedConversation) {
        try {
          await fetchTodayMessages(selectedConversation.id);
        } catch (error) {
          console.error("Polling error:", error);
          if (error.response.data.message === "Token expired") {
            await refreshToken();
            window.location.reload();
          }
        }
      }
    }, 6000);

    return () => clearInterval(intervalId); // Cleanup on unmount or pollingActive change
  }, [pollingActive, selectedConversation, refreshToken]);

  const stopPolling = () => {
    setPollingActive(false);
  };

  // Function to fetch today's messages for a conversation
  const fetchTodayMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/inbox/getMessage`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          params: {
            conversationId: conversationId,
          },
        }
      );
      if (response.status === 200) {
        const newMessages = response.data.messages;

        if (!newMessages.length) return;
        setSelectedConversation((prevConversation) => {
          if (!prevConversation) return prevConversation;

          // Filter out messages with time "today"
          const filteredMessages = prevConversation.messages.filter(
            (message) => message.time !== "today"
          );

          // Add the new messages to the filtered messages
          const updatedMessages = [...filteredMessages, ...newMessages];

          return {
            ...prevConversation,
            messages: updatedMessages,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching today's messages:", error);
      if (error.response.data.message === "Token expired") {
        refreshToken();
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (!pollingActive) {
      startPolling();
    }
  };

  const goBack = () => {
    setSelectedConversation(null);
    stopPolling(); // Stop polling when going back
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      text: newMessage,
      time: "today",
      type: "outgoing",
      conversationId: selectedConversation.id,
      receiverId: selectedConversation.receiver_id, // Include receiverId in the message
    };

    try {
      // Send the message to the backend API
      const response = await axios.post(
        `${API_BASE_URL}/inbox/updatemessage`,
        message,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the UI with the new message
        setSelectedConversation((prevConversation) => ({
          ...prevConversation,
          messages: [...prevConversation.messages, message],
        }));

        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.id === selectedConversation.id
              ? {
                  ...conversation,
                  messages: [...conversation.messages, message],
                }
              : conversation
          )
        );
      }
    } catch (error) {
      console.log("Error sending message:", error);
      if (error.response.data.message === "Token expired") {
        refreshToken();
        window.location.reload();
      } else {
        logout();
        redirecttopath("/login");
      }
    }

    setNewMessage("");
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.sidebar} ${
          selectedConversation ? styles.hidden : ""
        }`}
      >
        <h2 className={styles.title}>Conversation</h2>
        <ul className={styles.conversation_list}>
          {conversations.map((conversation, index) => (
            <li
              key={index}
              className={styles.conversation_item}
              onClick={() => selectConversation(conversation)}
            >
              <div className={styles.item_image}>
                <img src={conversation.profileImage} alt={conversation.name} />
              </div>
              <div className={styles.item_content}>
                <div className={styles.item_name}>{conversation.name}</div>
                <div className={styles.item_type}>{conversation.type}</div>
              </div>
            </li>
          ))}
          {conversations.length === 0 && (
            <p className={styles.no_conversations}>No conversations found.</p>
          )}
        </ul>
      </div>
      {selectedConversation ? (
        <div
          className={`${styles.chat_area} ${
            selectedConversation ? styles.active : ""
          }`}
        >
          <div className={styles.chat_header}>
            <span className={styles.back_button} onClick={goBack}>
              ← Back
            </span>
            <h3>{selectedConversation.name}</h3>
            <p>{selectedConversation.type}</p>
          </div>
          <div className={styles.chat_messages}>
            {selectedConversation.messages.map((message, index) => (
              <div key={index} className={styles.message_container}>
                {index === 0 ||
                selectedConversation.messages[index - 1].time !==
                  message.time ? (
                  <div className={styles.chat_date}>{message.time}</div>
                ) : null}
                <div
                  className={`${styles.chat_message} ${
                    message.type === "incoming"
                      ? styles.message_incoming
                      : styles.message_outgoing
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.input_container}>
            <textarea
              ref={textareaRef}
              className={styles.input_field}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                adjustHeight(e);
              }}
              onInput={adjustHeight}
              placeholder="Type your message..."
            />
            <button className={styles.send_button} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.noselect}>
          <p>select one of the conversation</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
