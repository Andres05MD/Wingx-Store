"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
    isChatOpen: boolean;
    setIsChatOpen: (isOpen: boolean) => void;
    toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => setIsChatOpen(prev => !prev);

    return (
        <ChatContext.Provider value={{ isChatOpen, setIsChatOpen, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
