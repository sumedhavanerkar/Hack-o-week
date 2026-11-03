import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  Search,
  BookOpen,
  Info,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Mail,
  Building,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChatMessageBubble } from "../components/ChatMessageBubble";
import { EmptyState } from "../components/EmptyState";
import styles from "./StudentChatPage.module.css";

export function StudentChatPage() {
  const { faculty, conversations, sendStudentMessage, profile } = useApp();

  const [selectedFacultyId, setSelectedFacultyId] = useState(
    faculty[0]?.id || "fac-1"
  );
  const [inputText, setInputText] = useState("");
  const [validationError, setValidationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef(null);

  const selectedFaculty =
    faculty.find((f) => f.id === selectedFacultyId) || faculty[0];

  const currentConversation = conversations.find(
    (c) => c.facultyId === selectedFacultyId
  );

  const messages = currentConversation?.messages || [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedFacultyId]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setValidationError("Please type a question or message before sending.");
      return;
    }
    setValidationError("");
    sendStudentMessage(selectedFacultyId, inputText);
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter faculty by name or subject
  const filteredFaculty = faculty.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.subjectName.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.chatContainer}>
      {/* Top Banner explaining client-side demo scope */}
      <div className={styles.demoBanner}>
        <Info size={16} className={styles.infoIcon} />
        <span>
          <strong>Faculty Consultation Desk:</strong> All academic inquiries
          and faculty replies are securely saved in your browser storage. To
          answer student questions as faculty, switch to the{" "}
          <strong>Faculty Portal</strong> above.
        </span>
      </div>

      <div className={styles.chatWindow}>
        {/* Left Side: Faculty Directory & Active Conversations */}
        <div
          className={`${styles.sidebarPanel} ${
            mobileShowChat ? styles.hideOnMobile : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Course Instructors</h2>
            <div className={styles.searchWrap}>
              <Search size={15} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search faculty or subject..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.facultyList}>
            {filteredFaculty.map((fac) => {
              const conv = conversations.find((c) => c.facultyId === fac.id);
              const lastMsg = conv?.messages[conv.messages.length - 1];
              const isSelected = fac.id === selectedFacultyId;

              return (
                <div
                  key={fac.id}
                  className={`${styles.facultyCard} ${
                    isSelected ? styles.facultyCardActive : ""
                  }`}
                  onClick={() => {
                    setSelectedFacultyId(fac.id);
                    setMobileShowChat(true);
                  }}
                >
                  <div
                    className={styles.avatar}
                    style={{ backgroundColor: fac.color || "var(--primary)" }}
                  >
                    {fac.avatarInitials}
                  </div>
                  <div className={styles.facultyMeta}>
                    <div className={styles.facultyTop}>
                      <span className={styles.facultyName}>{fac.name}</span>
                      {conv?.status === "Pending" ? (
                        <span className={styles.statusPending}>
                          <Clock size={11} /> Pending
                        </span>
                      ) : conv?.status === "Answered" ? (
                        <span className={styles.statusAnswered}>
                          <CheckCircle2 size={11} /> Answered
                        </span>
                      ) : null}
                    </div>
                    <span className={styles.subjectTag}>
                      <BookOpen size={11} /> {fac.subjectName}
                    </span>
                    <p className={styles.lastSnippet}>
                      {lastMsg
                        ? `${
                            lastMsg.sender === "student" ? "You: " : "Prof: "
                          }${lastMsg.text}`
                        : fac.statusText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div
          className={`${styles.chatContentPanel} ${
            !mobileShowChat ? styles.hideOnMobileChat : ""
          }`}
        >
          {selectedFaculty ? (
            <>
              {/* Conversation Header */}
              <div className={styles.conversationHeader}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setMobileShowChat(false)}
                >
                  <ChevronLeft size={18} />
                  <span>Instructors</span>
                </button>

                <div className={styles.activeFacultyInfo}>
                  <div
                    className={styles.headerAvatar}
                    style={{
                      backgroundColor:
                        selectedFaculty.color || "var(--primary)",
                    }}
                  >
                    {selectedFaculty.avatarInitials}
                  </div>
                  <div>
                    <h3 className={styles.headerName}>
                      {selectedFaculty.name}
                    </h3>
                    <p className={styles.headerSub}>
                      {selectedFaculty.designation} •{" "}
                      {selectedFaculty.department}
                    </p>
                  </div>
                </div>

                <div className={styles.facultyExtraBadge}>
                  <Building size={12} />
                  <span>{selectedFaculty.office}</span>
                </div>
              </div>

              {/* Messages Stream */}
              <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title={`Start a consultation with ${selectedFaculty.name}`}
                    description={`Ask technical questions regarding ${selectedFaculty.subjectName}, assignment clarifications, or lab doubts.`}
                  />
                ) : (
                  messages.map((msg) => (
                    <ChatMessageBubble
                      key={msg.id}
                      message={msg}
                      isCurrentUser={msg.sender === "student"}
                      roleLabel={msg.sender === "student" ? "Student" : "Faculty"}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form className={styles.composerForm} onSubmit={handleSend}>
                {validationError && (
                  <div className={styles.validationNotice}>
                    {validationError}
                  </div>
                )}
                <div className={styles.inputRow}>
                  <textarea
                    rows={1}
                    className={styles.messageInput}
                    placeholder={`Message ${selectedFaculty.name}... (Press Enter to send, Shift+Enter for new line)`}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="submit"
                    className={styles.sendButton}
                    title="Send Message (Enter)"
                  >
                    <Send size={16} />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Select an Instructor"
              description="Choose a faculty member from the directory on the left to review or begin an academic inquiry."
            />
          )}
        </div>
      </div>
    </div>
  );
}
