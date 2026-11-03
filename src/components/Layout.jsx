import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BookOpen,
  Menu,
  X,
  GraduationCap,
  RotateCcw,
  Users,
  MessageSquare,
  School,
  UserCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import styles from "./Layout.module.css";

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    profile,
    tasks,
    conversations,
    activeRole,
    setActiveRole,
    resetToDemoData,
    faculty,
    activeFacultyId,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isFacultyPortal =
    activeRole === "faculty" || location.pathname.startsWith("/faculty");

  const pendingTasksCount = tasks.filter((t) => t.status === "Pending").length;

  // Unanswered queries for this faculty (in faculty view) or total pending queries
  const facultyPendingQueries = conversations.filter(
    (c) => c.facultyId === activeFacultyId && c.status === "Pending"
  ).length;

  const currentFaculty =
    faculty.find((f) => f.id === activeFacultyId) || faculty[0];

  const studentNavItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: "/tasks",
      label: "Tasks & Deadlines",
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeType: "primary",
    },
    {
      to: "/planner",
      label: "Study Planner",
      icon: CalendarDays,
      badge: null,
    },
    {
      to: "/subjects",
      label: "Subjects & Goals",
      icon: BookOpen,
      badge: null,
    },
    {
      to: "/chat",
      label: "Faculty Chat",
      icon: MessageSquare,
      badge: null,
    },
  ];

  const facultyNavItems = [
    {
      to: "/faculty",
      label: "Faculty Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: "/faculty/queries",
      label: "Student Consultations",
      icon: MessageSquare,
      badge: facultyPendingQueries > 0 ? facultyPendingQueries : null,
      badgeType: "warning",
    },
  ];

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    setSidebarOpen(false);
    if (newRole === "faculty") {
      navigate("/faculty");
    } else {
      navigate("/");
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all portal data back to original Hackathon demo state?"
      )
    ) {
      resetToDemoData();
      navigate("/");
    }
  };

  const currentNavItems = isFacultyPortal ? facultyNavItems : studentNavItems;

  return (
    <div className={styles.layout}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <GraduationCap size={20} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Smart Student Hub</span>
            <span className={styles.brandSubtitle}>Academic Portal</span>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className={styles.roleSwitchBox}>
          <span className={styles.roleSwitchLabel}>Portal Mode:</span>
          <div className={styles.roleBtnGroup}>
            <button
              type="button"
              className={`${styles.roleBtn} ${
                !isFacultyPortal ? styles.roleBtnActive : ""
              }`}
              onClick={() => handleRoleSwitch("student")}
            >
              <UserCheck size={13} />
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`${styles.roleBtn} ${
                isFacultyPortal ? styles.roleBtnActive : ""
              }`}
              onClick={() => handleRoleSwitch("faculty")}
            >
              <School size={13} />
              <span>Faculty</span>
            </button>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.sectionHeaderLabel}>
            {isFacultyPortal ? "Faculty Navigation" : "Academic Navigation"}
          </div>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/" || item.to === "/faculty"}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={
                      item.badgeType === "warning"
                        ? styles.navBadgeWarning
                        : styles.navBadge
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer for CSE Project Details */}
        <div className={styles.sidebarFooter}>
          <div className={styles.teamBadge}>
            <div className={styles.teamTitle}>
              <Users size={14} />
              <span>CSE Team Project</span>
            </div>
            <p className={styles.teamDesc}>
              Hack-O-Week Evaluation • 3 Members Integration
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleReset}
              title="Reset data for viva demonstration"
            >
              <RotateCcw
                size={12}
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />
              Reset Demo Data
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles.breadcrumbs}>
            <span>{isFacultyPortal ? "Faculty Portal" : "Student Portal"}</span>
            <span>/</span>
            <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
              {location.pathname === "/"
                ? "Overview"
                : location.pathname === "/faculty"
                ? "Instructor Dashboard"
                : location.pathname === "/chat"
                ? "Faculty Chat"
                : location.pathname === "/faculty/queries"
                ? "Student Consultations"
                : location.pathname.slice(1).charAt(0).toUpperCase() +
                  location.pathname.slice(2)}
            </span>
          </div>

          <div className={styles.studentMeta}>
            {isFacultyPortal ? (
              <>
                <span className={styles.semesterTag}>Faculty Portal</span>
                <span className={styles.studentName}>{currentFaculty.name}</span>
              </>
            ) : (
              <>
                <span className={styles.semesterTag}>
                  {profile.semester || "3rd Sem"}
                </span>
                <span className={styles.studentName}>{profile.name}</span>
              </>
            )}
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
