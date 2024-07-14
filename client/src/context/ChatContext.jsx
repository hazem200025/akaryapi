// ChatContext.js
import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatData, setChatData] = useState(null);

  const openChat = (data) => {
    setChatData(data);
    setChatVisible(true);
  };

  const closeChat = () => {
    setChatVisible(false);
    setChatData(null);
  };

  return (
    <ChatContext.Provider value={{ chatVisible, chatData, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};
