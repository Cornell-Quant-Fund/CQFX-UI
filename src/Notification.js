// Notification.js
import React, { useEffect } from "react";

const Notification = ({ message, type, timeout = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, timeout);
    return () => clearTimeout(timer); // Clear timeout if component unmounts early
  }, [timeout, onClose]);

  if (!message) return null;

  return (
    <div className={`notification-banner ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
