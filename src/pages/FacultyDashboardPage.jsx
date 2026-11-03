import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  BookOpen,
  Calendar,
  AlertCircle,
  Building,
  Mail,
  UserCheck,
  ChevronRight,
  Send,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { EmptyState } from "../components/EmptyState";
import styles from "./FacultyDashboardPage.module.css";

export function FacultyDashboardPage() {
  const {
    faculty,
    activeFacultyId,
    setActiveFacultyId,
    conversations,
    tasks,
    sessions,
    sendFacultyReply,
    toggleQueryStatus,
  } = useApp();

  const currentFaculty =
    faculty.find((f) => f.id === activeFacultyId) || faculty[0];

  // Conversations relevant to this faculty member
  const facultyConversations = conversations.filter(
    (c) => c.facultyId === currentFaculty.id
  );

  const pendingQueries = facultyConversations.filter(
    (c) => c.status === "Pending"
  );
  const answeredQueries = facultyConversations.filter(
    (c) => c.status === "Answered"
  );

  // Relevant subject coursework tasks created in portal
  const subjectTasks = tasks.filter(
    (t) => t.subjectId === currentFaculty.subjectId
  );
  // Relevant subject study sessions created by students
  const subjectSessions = sessions.filter(
    (s) => s.subjectId === currentFaculty.subjectId
  );

  // Quick reply modal / inline composer state
  const [quickReplyConvId, setQuickReplyConvId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleSendQuickReply = (convId) => {
    if (!replyText.trim()) return;
    sendFacultyReply(convId, replyText);
    setReplyText("");
    setQuickReplyConvId(null);
    setFeedbackMsg("Reply delivered to student record!");
    setTimeout(() => setFeedbackMsg(""), 3500);
  };

  return (
    <div className={styles.facultyDashboard}>
      {/* Faculty Profile Hero Header */}
      <section className={styles.facultyHero}>
        <div className={styles.heroLeft}>
          <div
            className={styles.avatarLarge}
            style={{ backgroundColor: currentFaculty.color || "var(--primary)" }}
          >
            {currentFaculty.avatarInitials}
          </div>
          <div>
            <div className={styles.nameRow}>
              <h1 className={styles.facultyNameTitle}>{currentFaculty.name}</h1>
              <span className={styles.roleTag}>Instructor View</span>
            </div>
            <p className={styles.facultySubtitle}>
              {currentFaculty.designation} • {currentFaculty.department}
            </p>
            <div className={styles.facultyMetaRow}>
              <span className={styles.metaChip}>
                <BookOpen size={13} /> {currentFaculty.subjectName}
              </span>
              <span className={styles.metaChip}>
                <Building size={13} /> {currentFaculty.office}
              </span>
              <span className={styles.metaChip}>
                <Mail size={13} /> {currentFaculty.email}
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Switcher dropdown for quick testing */}
        <div className={styles.switchFacultyBox}>
          <label className={styles.switchLabel}>Switch Faculty Profile:</label>
          <select
            className={styles.switchSelect}
            value={activeFacultyId}
            onChange={(e) => {
              setActiveFacultyId(e.target.value);
              setQuickReplyConvId(null);
            }}
          >
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.subjectName.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>
      </section>

      {feedbackMsg && (
        <div className={styles.feedbackAlert}>
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconWrapPending}`}>
            <Clock size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{pendingQueries.length}</span>
            <span className={styles.statLabel}>Pending Student Queries</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconWrapAnswered}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{answeredQueries.length}</span>
            <span className={styles.statLabel}>Answered Queries</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconWrapTasks}`}>
            <FileText size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{subjectTasks.length}</span>
            <span className={styles.statLabel}>Assignments in {currentFaculty.subjectName.split(" ")[0]}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconWrapSessions}`}>
            <Calendar size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{subjectSessions.length}</span>
            <span className={styles.statLabel}>Student Study Blocks</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Student Inquiries & Coursework Activity */}
      <div className={styles.contentSplit}>
        {/* Left: Student Queries Management */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleRow}>
              <MessageSquare size={18} color="var(--primary)" />
              <h2 className={styles.panelTitle}>Student Consultations & Inquiries</h2>
            </div>
            <Link to="/faculty/queries" className={styles.panelLink}>
              Open Full Query Desk <ChevronRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>

          {facultyConversations.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No student inquiries yet"
              description={`Students haven't asked questions for ${currentFaculty.subjectName} yet. Switch to Student Portal to ask a question.`}
            />
          ) : (
            <div className={styles.queriesList}>
              {facultyConversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isPending = conv.status === "Pending";
                const isReplying = quickReplyConvId === conv.id;

                return (
                  <div
                    key={conv.id}
                    className={`${styles.queryCard} ${
                      isPending ? styles.queryCardPending : ""
                    }`}
                  >
                    <div className={styles.queryTopRow}>
                      <div className={styles.studentInfo}>
                        <span className={styles.studentName}>{conv.studentName}</span>
                        <span className={styles.rollTag}>{conv.studentRoll}</span>
                      </div>
                      <div className={styles.badgeRow}>
                        {isPending ? (
                          <span className={styles.badgePending}>
                            <Clock size={11} /> Needs Response
                          </span>
                        ) : (
                          <span className={styles.badgeAnswered}>
                            <CheckCircle2 size={11} /> Answered
                          </span>
                        )}
                        <button
                          type="button"
                          className={styles.toggleStatusBtn}
                          onClick={() => toggleQueryStatus(conv.id)}
                          title="Toggle between Pending and Answered status"
                        >
                          Mark as {isPending ? "Answered" : "Pending"}
                        </button>
                      </div>
                    </div>

                    <div className={styles.messageBox}>
                      <span className={styles.msgSenderLabel}>
                        {lastMsg.sender === "student" ? "Student Query:" : "Your Reply:"}
                      </span>
                      <p className={styles.msgSnippet}>{lastMsg.text}</p>
                    </div>

                    {/* Quick Reply Box */}
                    {isReplying ? (
                      <div className={styles.replyBox}>
                        <textarea
                          rows={2}
                          className={styles.replyTextarea}
                          placeholder={`Type faculty reply to ${conv.studentName}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className={styles.replyActions}>
                          <button
                            type="button"
                            className={styles.cancelReplyBtn}
                            onClick={() => {
                              setQuickReplyConvId(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className={styles.sendReplyBtn}
                            onClick={() => handleSendQuickReply(conv.id)}
                          >
                            <Send size={13} />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.cardFooter}>
                        <span className={styles.msgTime}>
                          Last updated:{" "}
                          {new Date(conv.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          type="button"
                          className={styles.replyActionBtn}
                          onClick={() => {
                            setQuickReplyConvId(conv.id);
                            setReplyText("");
                          }}
                        >
                          <Send size={13} />
                          <span>Reply to Student</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right: Subject Coursework Overview */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleRow}>
              <BookOpen size={18} color="var(--primary)" />
              <h2 className={styles.panelTitle}>
                {currentFaculty.subjectName} Overview
              </h2>
            </div>
            <span className={styles.courseCodeBadge}>{currentFaculty.subjectId}</span>
          </div>

          <div className={styles.subjectOverviewCard}>
            <h3 className={styles.subHeading}>Portal Assignments Assigned</h3>
            {subjectTasks.length === 0 ? (
              <p className={styles.emptyNote}>
                No assignments recorded for this subject yet.
              </p>
            ) : (
              <div className={styles.miniTaskList}>
                {subjectTasks.map((t) => (
                  <div key={t.id} className={styles.taskMiniRow}>
                    <div className={styles.taskMiniLeft}>
                      <span className={styles.taskMiniTitle}>{t.title}</span>
                      <span className={styles.taskMiniDue}>Due: {t.dueDate}</span>
                    </div>
                    <span
                      className={
                        t.status === "Completed"
                          ? styles.statusDone
                          : styles.statusOpen
                      }
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.facultyConsultationCard}>
            <h3 className={styles.subHeading}>Consultation Hours</h3>
            <p className={styles.consultationText}>{currentFaculty.statusText}</p>
            <p className={styles.consultationNote}>
              Students can view these availability timings in the <strong>Faculty Chat</strong> section.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
