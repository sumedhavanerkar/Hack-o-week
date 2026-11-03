import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  User,
  ChevronLeft,
  Info,
  Filter,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChatMessageBubble } from "../components/ChatMessageBubble";
import { EmptyState } from "../components/EmptyState";
import styles from "./FacultyQueriesPage.module.css";

export function FacultyQueriesPage() {
  const {
    faculty,
    activeFacultyId,
    setActiveFacultyId,
    conversations,
    sendFacultyReply,
    toggleQueryStatus,
  } = useApp();

  const currentFaculty =
    faculty.find((f) => f.id === activeFacultyId) || faculty[0];

  const relevantConversations = conversations.filter(
    (c) => c.facultyId === currentFaculty.id
  );

  const [selectedConvId, setSelectedConvId] = useState(
    relevantConversations[0]?.id || null
  );
  const [replyText, setReplyText] = useState("");
  const [validationError, setValidationError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'Pending' | 'Answered'
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-select first conversation if selected is missing
  useEffect(() => {
    if (!selectedConvId && relevantConversations.length > 0) {
      setSelectedConvId(relevantConversations[0].id);
    }
  }, [relevantConversations.length, selectedConvId]);

  const activeConv = relevantConversations.find((c) => c.id === selectedConvId);
  const messages = activeConv?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedConvId]);

  const handleSendReply = (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) {
      setValidationError("Please enter your academic advice or answer before sending.");
      return;
    }
    setValidationError("");
    sendFacultyReply(selectedConvId, replyText);
    setReplyText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const filteredConversations = relevantConversations.filter((c) => {
    const matchStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    const matchSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchStatus && matchSearch;
  });

  return (
    <div className={styles.container}>
      {/* Faculty Profile Banner & Switcher */}
      <div className={styles.topBar}>
        <div className={styles.facultyProfileSummary}>
          <div
            className={styles.avatarMini}
            style={{ backgroundColor: currentFaculty.color || "var(--primary)" }}
          >
            {currentFaculty.avatarInitials}
          </div>
          <div>
            <span className={styles.currentFacultyName}>{currentFaculty.name}</span>
            <span className={styles.subjectSub}>
              {currentFaculty.subjectName} ({currentFaculty.department})
            </span>
          </div>
        </div>

        <div className={styles.rightControls}>
          <label className={styles.switchLabel}>Acting As Faculty:</label>
          <select
            className={styles.facultySelect}
            value={activeFacultyId}
            onChange={(e) => {
              setActiveFacultyId(e.target.value);
              setSelectedConvId(null);
            }}
          >
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.subjectName.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.chatWindow}>
        {/* Left Side: Student Inquiries List */}
        <div
          className={`${styles.sidebarPanel} ${
            mobileShowChat ? styles.hideOnMobile : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitleRow}>
              <h2 className={styles.sidebarTitle}>Student Inquiries</h2>
              <span className={styles.countBadge}>
                {relevantConversations.length}
              </span>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.searchWrap}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Filter student or topic..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className={styles.statusSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Inquiries</option>
                <option value="Pending">Needs Response</option>
                <option value="Answered">Answered</option>
              </select>
            </div>
          </div>

          <div className={styles.convList}>
            {filteredConversations.length === 0 ? (
              <p className={styles.emptyNotice}>
                No inquiries matching filter for {currentFaculty.subjectName}.
              </p>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isPending = conv.status === "Pending";

                return (
                  <div
                    key={conv.id}
                    className={`${styles.convCard} ${
                      isSelected ? styles.convCardActive : ""
                    } ${isPending ? styles.convCardPending : ""}`}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setMobileShowChat(true);
                    }}
                  >
                    <div className={styles.convCardTop}>
                      <div className={styles.studentWrap}>
                        <User size={14} color="var(--primary)" />
                        <span className={styles.convStudentName}>
                          {conv.studentName}
                        </span>
                        <span className={styles.convRoll}>
                          {conv.studentRoll}
                        </span>
                      </div>
                      {isPending ? (
                        <span className={styles.badgePending}>
                          <Clock size={10} /> Pending
                        </span>
                      ) : (
                        <span className={styles.badgeAnswered}>
                          <CheckCircle2 size={10} /> Answered
                        </span>
                      )}
                    </div>
                    <p className={styles.snippetText}>
                      {lastMsg
                        ? `${
                            lastMsg.sender === "student" ? "Student: " : "You: "
                          }${lastMsg.text}`
                        : "No messages"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Stream & Reply */}
        <div
          className={`${styles.chatContentPanel} ${
            !mobileShowChat ? styles.hideOnMobileChat : ""
          }`}
        >
          {activeConv ? (
            <>
              {/* Header */}
              <div className={styles.conversationHeader}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setMobileShowChat(false)}
                >
                  <ChevronLeft size={18} />
                  <span>Student Inquiries</span>
                </button>

                <div className={styles.activeStudentInfo}>
                  <div className={styles.studentAvatar}>
                    {activeConv.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className={styles.headerStudentName}>
                      {activeConv.studentName} ({activeConv.studentRoll})
                    </h3>
                    <p className={styles.headerCourse}>
                      Subject: {activeConv.subjectName}
                    </p>
                  </div>
                </div>

                <div className={styles.headerStatusWrap}>
                  <button
                    type="button"
                    className={
                      activeConv.status === "Pending"
                        ? styles.markAnsweredBtn
                        : styles.markPendingBtn
                    }
                    onClick={() => toggleQueryStatus(activeConv.id)}
                    title="Click to toggle status"
                  >
                    {activeConv.status === "Pending"
                      ? "Mark as Answered ✓"
                      : "Mark as Pending ⏱"}
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className={styles.messagesContainer}>
                {messages.map((msg) => (
                  <ChatMessageBubble
                    key={msg.id}
                    message={msg}
                    isCurrentUser={msg.sender === "faculty"}
                    roleLabel={msg.sender === "faculty" ? "You (Faculty)" : "Student"}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Composer */}
              <form className={styles.composerForm} onSubmit={handleSendReply}>
                {validationError && (
                  <div className={styles.validationNotice}>
                    {validationError}
                  </div>
                )}
                <div className={styles.inputRow}>
                  <textarea
                    rows={2}
                    className={styles.messageInput}
                    placeholder={`Reply to ${activeConv.studentName} as ${currentFaculty.name}... (Press Enter to send, Shift+Enter for new line)`}
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="submit"
                    className={styles.sendButton}
                    title="Send Reply to Student"
                  >
                    <Send size={16} />
                    <span>Send Reply</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Select an Inquiry"
              description="Choose a student conversation from the left to read their doubt and post your instructor guidance."
            />
          )}
        </div>
      </div>
    </div>
  );
}
