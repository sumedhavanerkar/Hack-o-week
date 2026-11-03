import React from "react";
import styles from "./ChatMessageBubble.module.css";

export function ChatMessageBubble({ message, isCurrentUser, roleLabel }) {
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`${styles.bubbleWrapper} ${
        isCurrentUser ? styles.bubbleOutgoing : styles.bubbleIncoming
      }`}
    >
      <div className={styles.metaHeader}>
        <span className={styles.senderName}>{message.senderName}</span>
        {roleLabel && <span className={styles.roleTag}>{roleLabel}</span>}
        <span className={styles.timestamp}>{formattedTime}</span>
      </div>
      <div className={styles.messageBubble}>
        <p className={styles.messageText}>{message.text}</p>
      </div>
    </div>
  );
}
