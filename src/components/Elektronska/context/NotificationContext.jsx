import React, { createContext, useContext, useMemo } from 'react';
import { notification } from 'antd';

// Create a context for the notification
const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, message, description) => {
        api[type]({
            message: message,
            description: description,
            duration: 4
        });
    };

    const value = useMemo(() => ({ openNotification }), [api]);

    return (
        <NotificationContext.Provider value={value}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;