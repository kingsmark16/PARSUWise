import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "../components/ThemeToggle";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Award,
  Youtube,
  Facebook,
  Clock,
  CheckCircle2,
  CheckCircle,
  FileText,
  Play,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Pin,
  Heart,
  Search,
  Layers,
  Compass,
  Menu,
  X,
  Lock,
  Check,
  AlertCircle,
  RotateCcw,
  Building2,
  MonitorSmartphone,
  Wifi,
  BatteryCharging,
  Sparkles,
  Library,
  Users,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Cpu,
  FlaskConical,
  Briefcase,
  BookMarked,
  Waves,
  HeartPulse,
  Utensils,
  Sprout,
  Trees,
  MapPin,
} from "lucide-react";

const REAL_COURSE_LESSONS = [
  {
    id: "l1",
    title: "1.1 Relational Algebra & Keys",
    description: "Primary, candidate, and foreign key constraints in SQL",
    type: "YOUTUBE",
    duration: "14m 20s",
    completed: true,
  },
  {
    id: "l2",
    title: "1.2 Normalization (1NF to BCNF) Guide",
    description: "Step-by-step functional dependency reference workbook",
    type: "PDF",
    duration: "12 pages",
    completed: true,
  },
  {
    id: "l3",
    title: "1.3 Lossless-Join & 3NF Synthesis",
    description: "Eliminating transitive anomalies in university schemas",
    type: "DROPBOX",
    duration: "18m 40s",
    completed: false,
  },
];

const WORKSPACE_LESSONS = [
  {
    id: "vid-1",
    type: "YOUTUBE",
    badge: "VIDEO",
    duration: "18m 40s",
    title: "Lecture 2.1: Functional Dependencies & 3NF Decomposition",
    description:
      "Walks through lossless-join decomposition, dependency preservation, and common anomalies in relational schemas using PSU enrollment table examples.",
    highlights: [
      "00:00 — Identifying insertion, update, and deletion anomalies",
      "06:15 — Armstrong's axioms and attribute closure computation",
      "12:30 — Step-by-step 3NF synthesis algorithm with examples",
    ],
  },
  {
    id: "pdf-1",
    type: "PDF",
    badge: "PDF",
    duration: "16 pages",
    title: "PSU_CS204_Normalization_Workbook.pdf",
    description:
      "Annotated reference packet with worked normalization problems, ER-to-relational mapping rules, and practice exercises before taking the module quiz.",
    highlights: [
      "Section A — Normal Forms Quick Reference Matrix (1NF, 2NF, 3NF, BCNF)",
      "Section B — 5 Worked Case Studies from Academic Information Systems",
      "Section C — Self-Check Practice Problems with Answer Key",
    ],
  },
  {
    id: "res-1",
    type: "LINK",
    badge: "RESOURCE LINK",
    duration: "External",
    title: "PostgreSQL 16 Official Documentation & SQL Sandbox",
    description:
      "Curated external reference links and downloadable SQL starter scripts attached directly below the module lessons list.",
    highlights: [
      "Reference Link: PostgreSQL Foreign Key & Constraint Documentation",
      "Dropbox Resource: Lab_02_Starter_Schema.sql",
      "Interactive Quiz: Module 2 Mastery Assessment (10 pts)",
    ],
  },
];

const SAMPLE_QUIZ_QUESTIONS = {
  MULTIPLE_CHOICE: {
    typeLabel: "Multiple Choice",
    points: 2,
    question:
      "Which normal form eliminates transitive dependencies of non-prime attributes on the primary key?",
    options: [
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Third Normal Form (3NF)",
      "Unnormalized Form (UNF)",
    ],
    correctAnswer: "Third Normal Form (3NF)",
    explanation:
      "3NF requires the relation to be in 2NF and ensures no non-prime attribute is transitively dependent on the primary key.",
  },
  TRUE_FALSE: {
    typeLabel: "True / False",
    points: 1,
    question:
      "In WISE, a module's completion percentage updates automatically as students finish lessons and submit the module quiz.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "WISE tracks LessonProgress, ModuleProgress, and CourseProgress records automatically upon lesson completion and quiz submission.",
  },
  IDENTIFICATION: {
    typeLabel: "Identification",
    points: 3,
    question:
      "Type the acronym of the standard query language used to define and manipulate relational database tables (3 letters):",
    options: [],
    correctAnswer: "SQL",
    explanation:
      "SQL (Structured Query Language) is the standard language for relational database management systems.",
  },
};

const INITIAL_FORUM_POSTS = [
  {
    id: "post-1",
    title: "Guidelines for Module 2 SQL Normalization Lab & Quiz Schedule",
    author: "Prof. M. Concina",
    initials: "MC",
    role: "FACULTY",
    category: "Announcement",
    timeAgo: "2h ago",
    isPinned: true,
    content:
      "Please review the PDF workbook in Lesson 1.2 before attempting the Module Quiz. You have 3 attempts and a 15-minute time limit.",
    likes: 18,
    liked: false,
    repliesCount: 2,
  },
  {
    id: "post-2",
    title: "Clarification on composite primary keys in Partial Dependency check",
    author: "K. Flororita",
    initials: "KF",
    role: "STUDENT",
    category: "Q&A",
    timeAgo: "5h ago",
    isPinned: false,
    content:
      "If a table has a single-attribute primary key and is already in 1NF, is it automatically in 2NF?",
    likes: 9,
    liked: true,
    repliesCount: 3,
  },
];

const ROLE_WORKFLOWS = {
  STUDENT: {
    badge: "Student View (/student)",
    title: "Self-Paced Study, Real-Time Collaboration & Verifiable Credentials",
    summary:
      "Students access their enrolled courses, expand ModuleAccordions, watch video lessons or view PDFs, take timed quizzes, and unlock verifiable certificates.",
    sidebarItems: [
      { name: "My Courses", icon: Library, active: true },
      { name: "Achievements", icon: GraduationCap, active: false },
    ],
    capabilities: [
      {
        title: "Sequential ModuleAccordion & Lesson Tracking",
        detail:
          "Each module displays live progress bars and unlocks the next module automatically once completed.",
      },
      {
        title: "Multi-Format Lesson Player (Video, PDF, Links)",
        detail:
          "Watch embedded YouTube/Dropbox videos with duration badges or read inline Supabase PDFs.",
      },
      {
        title: "CourseTabs Navigation (Modules, Forum, Students, Certification)",
        detail:
          "Switch seamlessly between learning materials, real-time course forums, classmates, and certificates.",
      },
      {
        title: "Achievements & Public QR Certificate",
        detail:
          "Download official PDF completion certificates with a unique WISE verification code.",
      },
    ],
  },
  FACULTY: {
    badge: "Faculty View (/faculty)",
    title: "Structured Curriculum Authoring & Learner Analytics",
    summary:
      "Faculty members create courses, build ordered modules with drag-and-drop lessons, configure module quizzes, and monitor student analytics.",
    sidebarItems: [
      { name: "Dashboard", icon: BarChart3, active: true },
      { name: "Create Course", icon: BookOpen, active: false },
      { name: "Active Courses", icon: Library, active: false },
    ],
    capabilities: [
      {
        title: "Drag-and-Drop Module & Lesson Builder",
        detail:
          "Organize ordered modules combining YouTube videos, PDF uploads, Dropbox files, and external links.",
      },
      {
        title: "Custom Quiz & Assessment Engine",
        detail:
          "Author Multiple-Choice, True/False, and Identification questions with time and attempt limits.",
      },
      {
        title: "Access Code & Enrollment Control",
        detail:
          "Manage draft, active, and archived courses with unique course enrollment codes.",
      },
      {
        title: "Course & Student Performance Analytics",
        detail:
          "Track enrollment trends, module completion rates, and individual student quiz scores.",
      },
    ],
  },
  ADMIN: {
    badge: "Admin View (/admin)",
    title: "University-Wide Oversight, Role Management & Analytics",
    summary:
      "Administrators oversee all 11 PSU colleges, manage faculty and student accounts, review platform-wide analytics, and toggle between Admin and Instructor modes.",
    sidebarItems: [
      { name: "Analytics Dashboard", icon: BarChart3, active: true },
      { name: "Course Management", icon: BookOpen, active: false },
      { name: "User Management", icon: Users, active: false },
    ],
    capabilities: [
      {
        title: "Role-Based User & Faculty Management",
        detail:
          "Manage STUDENT, FACULTY, and ADMIN accounts and inspect teaching loads and student records.",
      },
      {
        title: "Cross-College Curriculum Visibility",
        detail:
          "Audit courses, modules, lessons, and analytics across all 11 Partido State University colleges.",
      },
      {
        title: "Daily Activity & Completion Metrics",
        detail:
          "Monitor daily active users, top courses, completion rates, and issued certificates.",
      },
      {
        title: "Dual Admin / Instructor Mode Switch Button",
        detail:
          "Switch between Admin governance and Instructor course management right from the header.",
      },
    ],
  },
};

const PSU_COLLEGES = [
  {
    name: "College of Engineering and Computational Sciences",
    short: "CECS",
    focus: "Computing, Software Systems, Civil & Electrical Engineering",
    cluster: "STEM & Computing",
    campus: "Goa Main Campus",
    icon: Cpu,
    accentGradient: "from-blue-600 via-indigo-500 to-cyan-500",
    glowColor: "from-blue-500/20 via-indigo-500/5 to-transparent",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    programs: ["Computer Science", "Information Tech", "Civil & Sanitary Eng."],
    modality: "Code Labs, SQL Workbooks & Technical Assessments",
  },
  {
    name: "College of Education",
    short: "COEd",
    focus: "Teacher Education, Curriculum Design & Instructional Technology",
    cluster: "Education, Arts & Health",
    campus: "Goa Main Campus",
    icon: GraduationCap,
    accentGradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    glowColor: "from-violet-500/20 via-purple-500/5 to-transparent",
    badgeClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25",
    programs: ["Secondary Education", "Elementary Ed.", "Instructional Media"],
    modality: "Lesson Plan Modules, Video Micro-Teaching & Rubrics",
  },
  {
    name: "College of Business and Management",
    short: "CBM",
    focus: "Accountancy, Financial Management, Marketing & Entrepreneurship",
    cluster: "Business & Hospitality",
    campus: "Goa Main Campus",
    icon: Briefcase,
    accentGradient: "from-amber-500 via-orange-500 to-yellow-500",
    glowColor: "from-amber-500/20 via-orange-500/5 to-transparent",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    programs: ["Accountancy", "Financial Mgmt", "Entrepreneurship"],
    modality: "Case Study Packets, Ledger Sheets & Timed Exams",
  },
  {
    name: "College of Science",
    short: "COS",
    focus: "Biology, Chemistry, Mathematics & Statistical Sciences",
    cluster: "STEM & Computing",
    campus: "Goa Main Campus",
    icon: FlaskConical,
    accentGradient: "from-emerald-600 via-teal-500 to-green-500",
    glowColor: "from-emerald-500/20 via-teal-500/5 to-transparent",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    programs: ["Applied Mathematics", "Biology", "Chemistry & Stats"],
    modality: "Lab Protocol PDFs, Problem Sets & Analytical Quizzes",
  },
  {
    name: "College of Arts and Humanities",
    short: "CAH",
    focus: "Communication, Languages, Literature & Social Sciences",
    cluster: "Education, Arts & Health",
    campus: "Goa Main Campus",
    icon: BookMarked,
    accentGradient: "from-rose-600 via-pink-500 to-fuchsia-500",
    glowColor: "from-rose-500/20 via-pink-500/5 to-transparent",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
    programs: ["BA Communication", "English Language", "Social Sciences"],
    modality: "Media Critique Forums, Reading Anthologies & Seminars",
  },
  {
    name: "College of Fisheries and Marine Science",
    short: "CFMS",
    focus: "Marine Biology, Aquaculture & Coastal Resource Governance",
    cluster: "Sciences & Environment",
    campus: "Sagñay Campus",
    icon: Waves,
    accentGradient: "from-cyan-600 via-sky-500 to-blue-500",
    glowColor: "from-cyan-500/20 via-sky-500/5 to-transparent",
    badgeClass:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
    programs: ["BS Fisheries", "Marine Biology", "Aquaculture Systems"],
    modality: "Coastal Field Guides, Taxonomic Visuals & Lab Modules",
  },
  {
    name: "College of Public Safety and Community Health",
    short: "CPSCH",
    focus: "Public Health, Community Safety & Emergency Preparedness",
    cluster: "Education, Arts & Health",
    campus: "Lagonoy Campus",
    icon: HeartPulse,
    accentGradient: "from-red-600 via-rose-500 to-orange-500",
    glowColor: "from-red-500/20 via-rose-500/5 to-transparent",
    badgeClass:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
    programs: ["Criminology", "Community Health", "Disaster Preparedness"],
    modality: "Field Response Briefings, Case Law & Scenario Quizzes",
  },
  {
    name: "College of Hospitality and Tourism Management",
    short: "CHTM",
    focus: "Sustainable Tourism, Culinary Arts & Hospitality Operations",
    cluster: "Business & Hospitality",
    campus: "San Jose Campus",
    icon: Utensils,
    accentGradient: "from-orange-600 via-amber-500 to-rose-500",
    glowColor: "from-orange-500/20 via-amber-500/5 to-transparent",
    badgeClass:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25",
    programs: ["Tourism Management", "Hospitality Mgmt", "Eco-Tourism"],
    modality: "Operations Video Demos, Service Standards & Certs",
  },
  {
    name: "College of Agribusiness and Community Development",
    short: "CACD",
    focus: "Agricultural Economics, Rural Enterprise & Extension",
    cluster: "Business & Hospitality",
    campus: "Salogon Campus",
    icon: Sprout,
    accentGradient: "from-lime-600 via-green-500 to-emerald-500",
    glowColor: "from-lime-500/20 via-green-500/5 to-transparent",
    badgeClass:
      "bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/25",
    programs: ["Agribusiness", "Rural Development", "Agri-Extension"],
    modality: "Value-Chain Workbooks, Field Extension & Forums",
  },
  {
    name: "College of Sustainable Communities and Ecosystems",
    short: "CSCE",
    focus: "Ecological Restoration, Biodiversity & Community Resilience",
    cluster: "Sciences & Environment",
    campus: "Caramoan Campus",
    icon: Trees,
    accentGradient: "from-teal-600 via-emerald-500 to-cyan-500",
    glowColor: "from-teal-500/20 via-emerald-500/5 to-transparent",
    badgeClass:
      "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25",
    programs: ["Ecosystem Conservation", "Biodiversity", "Eco-Resilience"],
    modality: "Conservation Mapping, Field Surveys & Case Modules",
  },
  {
    name: "College of Environmental Science and Design",
    short: "CESD",
    focus: "Environmental Planning, Spatial Design & Climate Adaptation",
    cluster: "Sciences & Environment",
    campus: "Tinambac Campus",
    icon: Compass,
    accentGradient: "from-sky-600 via-blue-500 to-indigo-500",
    glowColor: "from-sky-500/20 via-blue-500/5 to-transparent",
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
    programs: ["Environmental Science", "Spatial Planning", "Climate Design"],
    modality: "GIS & Spatial Workbooks, Impact Studies & Assessments",
  },
];

/**
 * Reusable High-Precision MacBook Pro 16" Hardware Shell
 */
const MacBookShell = ({ urlText, badgeText, children }) => (
  <div className="w-full select-none">
    {/* Outer Anodized Aluminum Lid Rim */}
    <div className="relative rounded-t-[1.4rem] sm:rounded-t-[1.75rem] p-[3px] bg-gradient-to-b from-zinc-400 via-zinc-700 to-zinc-900 dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-950 shadow-[0_28px_65px_-15px_rgba(0,0,0,0.65)]">
      {/* Inner Black Glass Display Bezel */}
      <div className="relative rounded-t-[1.25rem] sm:rounded-t-[1.6rem] bg-[#09090b] p-2 sm:p-3 pb-3 sm:pb-4 overflow-hidden">
        {/* Subtle Diagonal Screen Glass Reflection */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-2/3 h-64 bg-gradient-to-br from-white/[0.05] to-transparent rotate-12 z-20" />

        {/* Top Camera Notch */}
        <div className="relative z-20 mx-auto -mt-2 sm:-mt-3 mb-1.5 w-24 sm:w-32 h-3.5 sm:h-4 bg-[#09090b] rounded-b-xl border-x border-b border-zinc-800/80 flex items-center justify-center gap-2">
          {/* Webcam Lens */}
          <span className="h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-zinc-700 flex items-center justify-center">
            <span className="h-0.5 w-0.5 rounded-full bg-sky-400/70" />
          </span>
          {/* Active Camera Green LED */}
          <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </div>

        {/* Browser Chrome Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 px-3 py-1.5 bg-zinc-900/95 rounded-t-xl border border-zinc-800">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>

          {/* URL Bar */}
          <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-md bg-zinc-950/90 border border-zinc-800 text-[10px] sm:text-[11px] font-mono text-zinc-300 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
            <Lock className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
            <span className="truncate">{urlText}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400">
              {badgeText}
            </span>
          </div>
        </div>

        {/* Actual WISE Desktop Viewport */}
        <div className="relative z-10 bg-background text-foreground rounded-b-xl border-x border-b border-zinc-800 overflow-hidden">
          {children}
        </div>

        {/* Bottom Bezel Logo Chin */}
        <div className="pt-1.5 flex justify-center">
          <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-zinc-500">
            WISE Book Pro
          </span>
        </div>
      </div>
    </div>

    {/* 3D Sculpted Aluminum Keyboard Base Deck */}
    <div className="relative mx-auto w-[104%] -left-[2%] h-3.5 sm:h-4 bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 dark:from-zinc-800 dark:via-zinc-600 dark:to-zinc-800 rounded-b-2xl shadow-[0_14px_28px_rgba(0,0,0,0.45)] border-t border-white/30 flex justify-center">
      {/* Center Thumb Lip Indent */}
      <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-gradient-to-b from-zinc-500 to-zinc-700 dark:from-zinc-800 dark:to-zinc-950 rounded-b-lg shadow-inner" />
    </div>
  </div>
);

/**
 * Reusable High-Precision iPhone Pro Titanium Hardware Shell
 */
const IPhoneProShell = ({ children, className = "" }) => (
  <div className={`relative select-none ${className}`}>
    {/* Left Hardware Buttons (Action Button + Volume Up / Down) */}
    <div className="absolute -left-[3px] top-20 w-[3px] h-5 bg-zinc-500 dark:bg-zinc-600 rounded-l-sm" />
    <div className="absolute -left-[3px] top-28 w-[3px] h-10 bg-zinc-500 dark:bg-zinc-600 rounded-l-sm" />
    <div className="absolute -left-[3px] top-40 w-[3px] h-10 bg-zinc-500 dark:bg-zinc-600 rounded-l-sm" />
    {/* Right Hardware Power Button */}
    <div className="absolute -right-[3px] top-32 w-[3px] h-14 bg-zinc-500 dark:bg-zinc-600 rounded-r-sm" />

    {/* Brushed Titanium Outer Rim */}
    <div className="rounded-[2.85rem] p-[3px] bg-gradient-to-tr from-zinc-600 via-zinc-300 to-zinc-600 dark:from-zinc-800 dark:via-zinc-500 dark:to-zinc-800 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.75)]">
      {/* Inner Black OLED Bezel */}
      <div className="rounded-[2.7rem] bg-[#050507] p-[7px] relative overflow-hidden">
        {/* Glass Screen Reflection */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-bl from-white/[0.06] to-transparent rounded-full blur-md z-30" />

        {/* Tall OLED Screen Container (Authentic ~9:19 Smartphone Proportions) */}
        <div className="bg-background text-foreground rounded-[2.3rem] overflow-hidden border border-zinc-800/80 relative flex flex-col min-h-[480px] sm:min-h-[500px]">
          {/* iOS Status Bar + Dynamic Island */}
          <div className="bg-background px-5 pt-2.5 pb-1.5 flex items-center justify-between text-[10px] font-semibold text-foreground border-b border-border/40 relative z-30 shrink-0">
            <span className="font-mono tracking-tight">9:41</span>
            {/* Dynamic Island */}
            <div className="h-4 w-20 rounded-full bg-black flex items-center justify-between px-2 shadow-inner ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-indigo-500/40" />
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              <BatteryCharging className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>

          {/* Actual WISE Mobile Viewport Content */}
          <div className="relative flex-1 flex flex-col justify-between">
            {children}
          </div>

          {/* iOS Bottom Home Indicator */}
          <div className="py-2 bg-background flex justify-center border-t border-border/30 shrink-0">
            <div className="h-1 w-24 rounded-full bg-foreground/25" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for GSAP animations
  const heroLeftRef = useRef(null);
  const heroDevicesRef = useRef(null);
  const laptopTiltRef = useRef(null);
  const phoneFloatRef = useRef(null);
  const workspaceContentRef = useRef(null);
  const mainRef = useRef(null);

  // Real WISE UI State synchronized between Desktop Laptop & Mobile Phone!
  const [courseLessons, setCourseLessons] = useState(REAL_COURSE_LESSONS);
  const [activeCourseTab, setActiveCourseTab] = useState("module"); // "module" | "forum" | "certification"
  const [moduleExpanded, setModuleExpanded] = useState(true);
  const [phoneSidebarOpen, setPhoneSidebarOpen] = useState(false);
  const [phoneSearchOpen, setPhoneSearchOpen] = useState(false);

  // Interactive Workspace Preview State
  const [activeTab, setActiveTab] = useState("modules");
  const [selectedWorkspaceLesson, setSelectedWorkspaceLesson] = useState(
    WORKSPACE_LESSONS[0]
  );

  // Interactive Quiz Sandbox State
  const [quizType, setQuizType] = useState("MULTIPLE_CHOICE");
  const [selectedOption, setSelectedOption] = useState("");
  const [identInput, setIdentInput] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Interactive Forum State
  const [forumPosts, setForumPosts] = useState(INITIAL_FORUM_POSTS);
  const [forumCategory, setForumCategory] = useState("ALL");

  // Interactive PSU Colleges Spotlight State
  const [spotlightCollege, setSpotlightCollege] = useState(PSU_COLLEGES[0]);

  // Active Navigation Section State
  const [activeNavSection, setActiveNavSection] = useState("hero");

  // Certificate Verification Lookup State
  const [certCode, setCertCode] = useState("");

  const completedCount = courseLessons.filter((l) => l.completed).length;
  const moduleProgress = Math.round(
    (completedCount / courseLessons.length) * 100
  );

  // GSAP Entrance & Continuous Floating + Scroll Reveal Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroLeftRef.current) {
        gsap.fromTo(
          heroLeftRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }

      if (heroDevicesRef.current) {
        gsap.fromTo(
          heroDevicesRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            delay: 0.2,
            ease: "power3.out",
          }
        );
      }

      if (phoneFloatRef.current) {
        gsap.to(phoneFloatRef.current, {
          y: -8,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, mainRef);

    const revealElements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                clearProps: "transform",
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));

    // Track which section is centered in the viewport on scroll
    const sectionIds = ["hero", "workspace", "workflow", "colleges", "verify"];
    const handleScrollSpy = () => {
      const headerEl = document.querySelector("header");
      const headerHeight = headerEl ? headerEl.offsetHeight : 76;
      const viewportCenter =
        headerHeight + (window.innerHeight - headerHeight) / 2;

      let closestId = "hero";
      let minDistance = Infinity;

      sectionIds.forEach((secId) => {
        const secEl = document.getElementById(secId);
        if (!secEl) return;
        const rect = secEl.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = secId;
        }
      });

      setActiveNavSection(closestId);
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });

    return () => {
      ctx.revert();
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

  // Smooth GSAP transition whenever Workspace Tab, Lesson, Role, or Device Mode changes
  useEffect(() => {
    if (!workspaceContentRef.current) return;
    gsap.fromTo(
      workspaceContentRef.current,
      { opacity: 0, y: 14, scale: 0.99 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, [activeTab, selectedWorkspaceLesson]);

  // 3D Tilt effect on Desktop Hero Device Showcase
  const handleHeroMouseMove = (e) => {
    if (!laptopTiltRef.current || window.innerWidth < 1024) return;
    const rect = laptopTiltRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(laptopTiltRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      transformPerspective: 1200,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleHeroMouseLeave = () => {
    if (!laptopTiltRef.current) return;
    gsap.to(laptopTiltRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const toggleLessonCompletion = (id) => {
    setCourseLessons((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const currentQuestion = SAMPLE_QUIZ_QUESTIONS[quizType];
  const userAnswer =
    quizType === "IDENTIFICATION" ? identInput.trim() : selectedOption;
  const isQuizCorrect =
    quizSubmitted &&
    userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

  const handleQuizTypeChange = (type) => {
    setQuizType(type);
    setSelectedOption("");
    setIdentInput("");
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer) return;
    setQuizSubmitted(true);
  };

  const togglePostLike = (postId) => {
    setForumPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const trimmed = certCode.trim();
    if (trimmed) {
      navigate(`/verify?code=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/verify");
    }
  };

  // Center target section inside the visible viewport area below the fixed header
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setActiveNavSection(id);
    if (id === "hero") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;

    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? headerEl.offsetHeight : 80;
    const visibleViewportHeight = window.innerHeight - headerHeight;

    // Measure the inner .container so we center the section's visual content in the viewport
    const contentEl = el.querySelector(".container") || el;
    const rect = contentEl.getBoundingClientRect();
    const contentAbsoluteTop = rect.top + window.scrollY;

    // Calculate the scroll position that places the center of the content block
    // at the exact vertical center of the visible viewport (below the fixed navbar).
    // If on a narrow mobile screen a section is much taller than the viewport,
    // align the top of its content cleanly below the navbar so the heading isn't cut off.
    const centeredScrollY =
      rect.height <= visibleViewportHeight * 1.15
        ? contentAbsoluteTop -
          headerHeight -
          (visibleViewportHeight - rect.height) / 2
        : contentAbsoluteTop - headerHeight - 16;

    window.scrollTo({
      top: Math.max(0, centeredScrollY),
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden"
    >
      {/* Subtle Architectural Grid Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient Top Glow */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-80 bg-primary/10 blur-[120px] pointer-events-none z-0 rounded-full" />

      {/* Fixed Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto max-w-7xl flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand + PSU Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer text-left"
            >
              <img
                src="/PSU_LOGO.png"
                alt="Partido State University Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-wider text-foreground">
                    WISE
                  </span>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden sm:inline-block leading-none">
                  Partido State University
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {[
              { id: "workspace", label: "Device Workspace" },
              { id: "workflow", label: "How It Works" },
              { id: "colleges", label: "PSU Colleges" },
              {
                id: "verify",
                label: "Verify Certificate",
                icon: ShieldCheck,
              },
            ].map((navItem) => {
              const NavIcon = navItem.icon;
              const isActive = activeNavSection === navItem.id;
              return (
                <button
                  key={navItem.id}
                  type="button"
                  onClick={() => scrollToSection(navItem.id)}
                  className={`px-3.5 py-2 text-sm font-medium transition-all rounded-lg inline-flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {NavIcon && <NavIcon className="h-4 w-4 text-primary" />}
                  <span>{navItem.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              asChild
              variant="outline"
              className="hidden sm:inline-flex text-sm font-medium transition-transform active:scale-95"
            >
              <NavLink to="/verify">
                <ShieldCheck className="h-4 w-4 mr-1.5 text-primary" />
                Verify ID
              </NavLink>
            </Button>
            <Button
              asChild
              className="font-semibold px-4 sm:px-5 text-sm shadow-sm transition-transform active:scale-95"
            >
              <NavLink to="/sign-in">
                Sign In
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </NavLink>
            </Button>

            {/* Mobile Hamburger Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-lg px-4 py-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => scrollToSection("workspace")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Interactive Laptop &amp; Phone Workspace
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("workflow")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              How Learning Works on WISE
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("colleges")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              11 PSU Academic Colleges
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("verify")}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify Completion Certificate
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-16 sm:pt-20">
        {/* HERO SECTION WITH HIGH-PRECISION LAPTOP + PHONE SHOWING ACTUAL WISE UI */}
        <section
          id="hero"
          className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center border-b border-border/70 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 via-background to-background"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10 items-center">
              {/* Left Column: Academic Pitch & Actions */}
              <div
                ref={heroLeftRef}
                className="lg:col-span-5 space-y-5 sm:space-y-6 text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-xs sm:text-sm font-medium text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    Partido State University • Digital Learning Platform
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl xl:text-[3.4rem] font-extrabold tracking-tight leading-[1.1] text-foreground">
                  Structured Digital Learning Built for{" "}
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-sky-500 bg-clip-text text-transparent">
                    Academic Mastery
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  WISE unifies course delivery across Partido State
                  University&apos;s 11 academic colleges. Interact with the{" "}
                  <strong>actual WISE Desktop &amp; Mobile interface</strong>{" "}
                  on the right—complete lessons, switch course tabs, or open the
                  mobile sidebar drawer to see how your progress stays synced
                  everywhere.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    size="lg"
                    onClick={() => navigate("/sign-in")}
                    className="h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  >
                    Access Learning Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection("workspace")}
                    className="h-11 sm:h-12 px-4 sm:px-5 text-sm sm:text-base font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <MonitorSmartphone className="mr-2 h-4 w-4 text-primary" />
                    Explore Full UI Tour
                  </Button>
                </div>

                {/* Key Platform Pillars Strip */}
                <div className="pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-xl bg-muted/25 border border-border/50">
                    <p className="text-base sm:text-lg font-bold text-foreground">
                      11 Colleges
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Official PSU units
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/25 border border-border/50">
                    <p className="text-base sm:text-lg font-bold text-foreground">
                      4 Media Types
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Video, PDF, File, Link
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/25 border border-border/50">
                    <p className="text-base sm:text-lg font-bold text-foreground">
                      3 Quiz Modes
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      MCQ, T/F, Ident.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/25 border border-border/50">
                    <p className="text-base sm:text-lg font-bold text-foreground">
                      QR Verified
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Public `/verify` ID
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Detail MacBook Pro + iPhone Pro Running Actual WISE UI */}
              <div
                ref={heroDevicesRef}
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                className="lg:col-span-7 relative pb-4 sm:pb-14 lg:pb-12"
              >
                <div
                  ref={laptopTiltRef}
                  className="relative mx-auto w-full transition-transform duration-200"
                >
                  {/* MACBOOK PRO 16" RUNNING ACTUAL WISE DESKTOP UI */}
                  <MacBookShell
                    urlText="parsuwise.onrender.com/student/homepage/cs204/selected-course"
                    badgeText="Desktop lg:left-64"
                  >
                    <div className="flex min-h-[410px] sm:min-h-[430px] text-left">
                      {/* ACTUAL WISE DESKTOP SIDEBAR (w-40 scaled representation of w-64 Sidebar.jsx) */}
                      <aside className="hidden sm:flex w-40 border-r border-border bg-gradient-to-b from-background to-background/95 flex-col justify-between shrink-0 p-3">
                        <div className="space-y-4">
                          {/* PSU Logo Section from Sidebar.jsx */}
                          <div className="py-3 border-b border-border/50 flex flex-col items-center gap-2">
                            <img
                              src="/PSU_LOGO.png"
                              alt="PSU Logo"
                              className="w-10 h-10 object-contain"
                            />
                            <div className="text-center leading-tight">
                              <p className="text-[10px] font-bold tracking-wider text-foreground uppercase">
                                Partido State
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                University
                              </p>
                            </div>
                          </div>

                          {/* Student Menu Items from Sidebar.jsx */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-accent text-accent-foreground shadow-sm text-xs font-medium">
                              <Library className="h-3.5 w-3.5 shrink-0" />
                              <span>My Courses</span>
                            </div>
                            <div className="flex items-center gap-2 h-8 px-2.5 rounded-md text-foreground/70 hover:bg-accent/50 text-xs font-medium">
                              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                              <span>Achievements</span>
                            </div>
                          </div>
                        </div>

                        {/* Sidebar Footer from Sidebar.jsx */}
                        <div className="pt-2 border-t border-border/40 text-center space-y-1.5">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Follow Us
                          </p>
                          <div className="flex justify-center gap-1.5">
                            <span className="h-6 w-6 rounded border border-border/60 flex items-center justify-center text-muted-foreground">
                              <Youtube className="h-3 w-3" />
                            </span>
                            <span className="h-6 w-6 rounded border border-border/60 flex items-center justify-center text-muted-foreground">
                              <Facebook className="h-3 w-3" />
                            </span>
                          </div>
                          <p className="text-[9px] text-muted-foreground/70">
                            © 2025 Partido State University
                          </p>
                        </div>
                      </aside>

                      {/* ACTUAL WISE DESKTOP MAIN AREA (Header.jsx + CoursePage.jsx) */}
                      <div className="flex-1 flex flex-col min-w-0 bg-background">
                        {/* Authentic Header.jsx (Desktop Mode) */}
                        <div className="h-12 border-b border-border px-4 flex items-center justify-between gap-3 bg-background/95">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-black tracking-wider text-foreground">
                              WISE
                            </span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-80" />
                          </div>

                          {/* Search Bar from Header.jsx */}
                          <div className="flex-1 max-w-[200px] relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <div className="w-full pl-7 pr-2 h-7 rounded-lg bg-background/50 border border-foreground/20 flex items-center text-[10px] text-muted-foreground">
                              Search courses...
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border">
                              <AvatarFallback className="text-[9px] font-bold bg-primary/15 text-primary">
                                JD
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>

                        {/* Authentic CoursePage.jsx Content */}
                        <div className="p-3.5 sm:p-4 space-y-3 flex-1 overflow-hidden">
                          {/* CoursePage Hero Banner (Gradient Overlay + Top College Badge + Bottom Title) */}
                          <div className="relative h-24 sm:h-28 w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 shadow-sm">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute top-2.5 left-3">
                              <Badge className="bg-white/20 text-white backdrop-blur-md border-none px-2 py-0.5 text-[10px] font-medium">
                                College of Engineering and Computational Sciences
                              </Badge>
                            </div>
                            <div className="absolute bottom-2.5 left-3 right-3">
                              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                                CS 204: Database Management Systems
                              </h3>
                            </div>
                          </div>

                          {/* CoursePage Meta Bar (Instructor + Last Updated + Unenroll) */}
                          <div className="flex items-center justify-between gap-2 bg-card px-3 py-2 rounded-xl border shadow-xs text-[10px]">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">
                                  MC
                                </div>
                                <div className="truncate">
                                  <p className="text-[9px] text-muted-foreground leading-none">
                                    Instructor
                                  </p>
                                  <p className="font-semibold text-foreground truncate">
                                    Prof. M. Concina
                                  </p>
                                </div>
                              </div>
                              <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3 w-3 text-primary" />
                                <span>Updated Oct 2025</span>
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded bg-destructive/10 text-destructive font-semibold text-[9px] shrink-0">
                              Unenroll
                            </span>
                          </div>

                          {/* Authentic CourseTabs.jsx Rounded-Full Pill Bar */}
                          <div className="flex justify-start sm:justify-center">
                            <div className="p-0.5 bg-muted/60 border border-border/50 rounded-full inline-flex gap-1">
                              {[
                                {
                                  id: "module",
                                  label: "Modules",
                                  icon: BookOpen,
                                },
                                {
                                  id: "forum",
                                  label: "Forum",
                                  icon: MessageSquare,
                                },
                                {
                                  id: "certification",
                                  label: "Certification",
                                  icon: Award,
                                },
                              ].map((t) => {
                                const Icon = t.icon;
                                const active = activeCourseTab === t.id;
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setActiveCourseTab(t.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                                      active
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    <span>{t.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Authentic ModuleAccordion.jsx + StudentLessonsList.jsx (Desktop Horizontal Progress Layout) */}
                          <div className="sm:pr-0 xl:pr-44">
                            {activeCourseTab === "module" && (
                              <div className="rounded-lg border-2 shadow-sm bg-card overflow-hidden">
                                {/* AccordionTrigger Desktop Row */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setModuleExpanded((prev) => !prev)
                                  }
                                  className="w-full py-2.5 px-3 flex items-center justify-between gap-2 bg-accent/20 border-b border-border text-left cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`rounded-lg p-1.5 shrink-0 ${
                                        moduleProgress === 100
                                          ? "bg-green-100 dark:bg-green-900/30"
                                          : "bg-primary/10"
                                      }`}
                                    >
                                      {moduleProgress === 100 ? (
                                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                      ) : (
                                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                                      )}
                                    </div>
                                    <span className="font-semibold text-xs text-foreground truncate">
                                      Module 1: Relational Model &amp;
                                      Normalization
                                    </span>
                                  </div>

                                  {/* Desktop Right-Aligned Progress Bar */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`text-[10px] font-bold ${
                                        moduleProgress === 100
                                          ? "text-green-600"
                                          : "text-primary"
                                      }`}
                                    >
                                      {moduleProgress}%
                                    </span>
                                    <Progress
                                      value={moduleProgress}
                                      className={`h-1.5 w-16 sm:w-20 ${
                                        moduleProgress === 100
                                          ? "[&>div]:bg-green-500"
                                          : "[&>div]:bg-primary"
                                      }`}
                                    />
                                    <ChevronDown
                                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                        moduleExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </button>

                                {/* AccordionContent: StudentLessonsList.jsx */}
                                {moduleExpanded && (
                                  <div className="p-2.5 space-y-1.5">
                                    {courseLessons.map((lesson, idx) => (
                                      <button
                                        key={lesson.id}
                                        type="button"
                                        onClick={() =>
                                          toggleLessonCompletion(lesson.id)
                                        }
                                        className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-input bg-card hover:bg-accent/50 text-left transition-colors cursor-pointer group"
                                      >
                                        <span className="text-[10px] font-semibold text-primary w-4 text-center shrink-0">
                                          {idx + 1}
                                        </span>

                                        {/* Exact Thumbnail / Icon style from StudentLessonsList.jsx */}
                                        {lesson.type === "PDF" ? (
                                          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                            <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                                          </div>
                                        ) : (
                                          <div className="w-12 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center relative shrink-0 overflow-hidden">
                                            <Play className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 fill-current" />
                                            <span className="absolute bottom-0 right-0 bg-black/75 text-white text-[8px] px-1 rounded-tl">
                                              {lesson.duration}
                                            </span>
                                          </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <p className="text-xs font-medium text-foreground truncate group-hover:text-primary">
                                              {lesson.title}
                                            </p>
                                            {lesson.completed && (
                                              <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <Badge
                                              variant="secondary"
                                              className="text-[9px] px-1.5 py-0 h-3.5"
                                            >
                                              {lesson.type === "PDF"
                                                ? "PDF"
                                                : "VIDEO"}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground truncate">
                                              Click to toggle completion
                                            </span>
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {activeCourseTab === "forum" && (
                              <div className="rounded-lg border bg-card p-3 space-y-2">
                                {forumPosts.map((post) => (
                                  <div
                                    key={post.id}
                                    className="p-2.5 rounded-lg border bg-muted/20 flex items-start justify-between gap-2"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <Badge
                                          variant="outline"
                                          className="text-[9px] py-0 h-4"
                                        >
                                          {post.category}
                                        </Badge>
                                        <span className="text-[11px] font-bold text-foreground truncate">
                                          {post.author}
                                        </span>
                                      </div>
                                      <p className="text-xs font-semibold text-foreground truncate mt-1">
                                        {post.title}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => togglePostLike(post.id)}
                                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 px-2 py-1 rounded border bg-background cursor-pointer shrink-0"
                                    >
                                      <Heart
                                        className={`h-3 w-3 ${
                                          post.liked ? "fill-current" : ""
                                        }`}
                                      />
                                      {post.likes}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {activeCourseTab === "certification" && (
                              <div className="rounded-lg border bg-card p-3.5 flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <Badge
                                    className={
                                      moduleProgress === 100
                                        ? "bg-green-600 text-white border-0 text-[10px]"
                                        : "text-[10px]"
                                    }
                                  >
                                    {moduleProgress === 100
                                      ? "Certificate Ready"
                                      : `${moduleProgress}% Completed`}
                                  </Badge>
                                  <p className="text-xs font-bold text-foreground">
                                    {moduleProgress === 100
                                      ? "Download Official PSU Certificate (WISE-2025-PSU-8492)"
                                      : "Complete all 3 lessons in Module 1 to unlock certificate"}
                                  </p>
                                </div>
                                <Award className="h-8 w-8 text-primary shrink-0" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </MacBookShell>

                  {/* FLOATING IPHONE PRO TITANIUM RUNNING ACTUAL MOBILE-SIZED WISE UI */}
                  <div
                    ref={phoneFloatRef}
                    className="mt-8 sm:mt-0 sm:absolute sm:-bottom-10 sm:-right-2 xl:-right-5 z-30 mx-auto w-[270px] sm:w-[248px] md:w-[262px]"
                  >
                    <IPhoneProShell>
                      {/* ACTUAL MOBILE SIDEBAR DRAWER OVERLAY (Sidebar.jsx on <lg screens!) */}
                      {phoneSidebarOpen && (
                        <div className="absolute inset-0 z-40 flex animate-in fade-in duration-200">
                          <div className="w-44 bg-background border-r border-border h-full p-3 flex flex-col justify-between shadow-2xl text-left">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <img
                                    src="/PSU_LOGO.png"
                                    alt="PSU"
                                    className="h-7 w-7 object-contain"
                                  />
                                  <div className="leading-tight">
                                    <p className="text-[9px] font-bold uppercase">
                                      Partido State
                                    </p>
                                    <p className="text-[8px] text-muted-foreground">
                                      University
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPhoneSidebarOpen(false)}
                                  className="p-1 rounded hover:bg-muted cursor-pointer"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => setPhoneSidebarOpen(false)}
                                  className="w-full flex items-center gap-2 h-7 px-2 rounded-md bg-accent text-accent-foreground text-[10px] font-medium cursor-pointer"
                                >
                                  <Library className="h-3 w-3" />
                                  <span>My Courses</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPhoneSidebarOpen(false)}
                                  className="w-full flex items-center gap-2 h-7 px-2 rounded-md text-foreground/70 hover:bg-accent/50 text-[10px] font-medium cursor-pointer"
                                >
                                  <GraduationCap className="h-3 w-3" />
                                  <span>Achievements</span>
                                </button>
                              </div>
                            </div>

                            <p className="text-[8px] text-muted-foreground text-center border-t pt-2">
                              © 2025 Partido State University
                            </p>
                          </div>
                          <div
                            onClick={() => setPhoneSidebarOpen(false)}
                            className="flex-1 bg-black/50 backdrop-blur-xs cursor-pointer"
                          />
                        </div>
                      )}

                      {/* ACTUAL MOBILE HEADER (Header.jsx on <lg screens: Hamburger + WISE + Search Toggle + Avatar) */}
                      <div className="h-10 px-3 border-b border-border bg-background/95 flex items-center justify-between relative z-20">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPhoneSidebarOpen((prev) => !prev)
                            }
                            className="h-6 w-6 rounded hover:bg-accent flex items-center justify-center cursor-pointer"
                            title="Open Mobile Sidebar"
                          >
                            <Menu className="h-3.5 w-3.5" />
                          </button>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-black tracking-wider text-foreground">
                              WISE
                            </span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPhoneSearchOpen((prev) => !prev)
                            }
                            className="h-6 w-6 rounded hover:bg-accent flex items-center justify-center cursor-pointer"
                            title="Toggle Mobile Search"
                          >
                            {phoneSearchOpen ? (
                              <X className="h-3 w-3" />
                            ) : (
                              <Search className="h-3 w-3" />
                            )}
                          </button>
                          <Avatar className="h-5 w-5 border">
                            <AvatarFallback className="text-[8px] font-bold bg-primary/15 text-primary">
                              JD
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Mobile Search Overlay from Header.jsx */}
                      {phoneSearchOpen && (
                        <div className="p-2 bg-background border-b border-border shadow-md z-20">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <input
                              type="text"
                               readOnly
                              placeholder="Search courses..."
                              className="w-full pl-7 pr-2 h-6 rounded-lg bg-muted/50 border border-foreground/20 text-[10px]"
                            />
                          </div>
                        </div>
                      )}

                      {/* ACTUAL MOBILE COURSEPAGE.JSX BODY (Responsive <sm layout) */}
                      <div className="p-2.5 space-y-2.5 text-left flex-1">
                        {/* Mobile Course Hero Banner */}
                        <div className="relative h-20 w-full rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute top-2 left-2 right-2">
                            <span className="inline-block bg-white/20 text-white backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-medium truncate max-w-full">
                              College of Engineering &amp; Comp. Sci.
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs font-bold text-white leading-tight line-clamp-1">
                              CS 204: Database Systems
                            </p>
                          </div>
                        </div>

                        {/* Mobile CourseTabs Pill Bar (CourseTabs.jsx) */}
                        <div className="p-0.5 bg-muted/60 border border-border/50 rounded-full grid grid-cols-3 gap-0.5">
                          {[
                            { id: "module", label: "Modules" },
                            { id: "forum", label: "Forum" },
                            { id: "certification", label: "Cert." },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setActiveCourseTab(t.id)}
                              className={`py-1 rounded-full text-[9px] font-semibold transition-all cursor-pointer ${
                                activeCourseTab === t.id
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {/* Mobile ModuleAccordion.jsx (Stacked Progress Bar below Title on <sm!) */}
                        {activeCourseTab === "module" && (
                          <div className="rounded-lg border-2 bg-card shadow-xs overflow-hidden">
                            <div className="p-2 border-b border-border space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`rounded-md p-1 shrink-0 ${
                                    moduleProgress === 100
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : "bg-primary/10"
                                  }`}
                                >
                                  {moduleProgress === 100 ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <BookOpen className="h-3 w-3 text-primary" />
                                  )}
                                </div>
                                <span className="font-semibold text-[10px] text-foreground truncate">
                                  Module 1: Relational Model
                                </span>
                              </div>
                              {/* Mobile Full-Width Progress Bar (matches ModuleAccordion.jsx line 343) */}
                              <div className="space-y-0.5">
                                <span
                                  className={`block text-[9px] font-bold ${
                                    moduleProgress === 100
                                      ? "text-green-600"
                                      : "text-primary"
                                  }`}
                                >
                                  {moduleProgress}%
                                </span>
                                <Progress
                                  value={moduleProgress}
                                  className={`h-1.5 w-full ${
                                    moduleProgress === 100
                                      ? "[&>div]:bg-green-500"
                                      : "[&>div]:bg-primary"
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Mobile StudentLessonsList.jsx */}
                            <div className="p-1.5 space-y-1">
                              {courseLessons.map((lesson, idx) => (
                                <button
                                  key={lesson.id}
                                  type="button"
                                  onClick={() =>
                                    toggleLessonCompletion(lesson.id)
                                  }
                                  className="w-full flex items-center gap-1.5 p-1.5 rounded-md border border-input bg-card hover:bg-accent/50 text-left cursor-pointer"
                                >
                                  <span className="text-[9px] font-bold text-primary w-3">
                                    {idx + 1}
                                  </span>
                                  {lesson.type === "PDF" ? (
                                    <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                      <FileText className="h-3 w-3 text-red-600 dark:text-red-400" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                      <Play className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400 fill-current" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <p className="text-[10px] font-medium text-foreground truncate">
                                        {lesson.title}
                                      </p>
                                      {lesson.completed && (
                                        <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                            {/* Selected Lesson Preview on Mobile */}
                            {courseLessons[0] && (
                              <div className="mx-1.5 mb-1.5 p-2 rounded-md bg-muted/40 border border-border/60 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-[9px] uppercase font-bold text-primary">
                                    Active Lesson ({courseLessons[0].type})
                                  </p>
                                  <p className="text-[10px] font-semibold text-foreground truncate">
                                    {courseLessons[0].title}
                                  </p>
                                </div>
                                <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                                  {courseLessons[0].duration}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {activeCourseTab === "forum" && (
                          <div className="space-y-2">
                            {forumPosts.map((p) => (
                              <div
                                key={p.id}
                                className="p-2.5 rounded-lg border bg-card space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {p.isPinned && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[8px] px-1 py-0 h-3.5"
                                        >
                                          <Pin className="h-2 w-2 mr-0.5 text-primary" />
                                          Pinned
                                        </Badge>
                                      )}
                                      <Badge
                                        variant="outline"
                                        className="text-[8px] px-1 py-0 h-3.5"
                                      >
                                        {p.category}
                                      </Badge>
                                      <span className="text-[10px] font-bold text-foreground truncate">
                                        {p.author}
                                      </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-foreground mt-1 line-clamp-1">
                                      {p.title}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => togglePostLike(p.id)}
                                    className="text-[9px] inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border bg-background text-rose-500 font-bold cursor-pointer shrink-0"
                                  >
                                    <Heart
                                      className={`h-2.5 w-2.5 ${
                                        p.liked ? "fill-current" : ""
                                      }`}
                                    />
                                    {p.likes}
                                  </button>
                                </div>
                                <p className="text-[9px] text-muted-foreground line-clamp-2">
                                  {p.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeCourseTab === "certification" && (
                          <div className="p-3 rounded-lg border bg-card space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                className={
                                  moduleProgress === 100
                                    ? "bg-green-600 text-white border-0 text-[9px]"
                                    : "text-[9px]"
                                }
                              >
                                {moduleProgress === 100
                                  ? "Certificate Ready"
                                  : `${moduleProgress}% Completed`}
                              </Badge>
                              <Award className="h-5 w-5 text-primary shrink-0" />
                            </div>
                            <p className="text-[10px] font-bold text-foreground leading-snug">
                              {moduleProgress === 100
                                ? "Download Official PSU Certificate (WISE-2025-PSU-8492)"
                                : "Complete all 3 lessons in Module 1 to unlock certificate"}
                            </p>
                          </div>
                        )}
                      </div>
                    </IPhoneProShell>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE LEARNING WORKSPACE INSIDE HIGH-PRECISION LAPTOP & PHONE (#workspace) */}
        <section
          id="workspace"
          data-reveal
          className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-border/70 scroll-mt-16"
        >
          <div className="container mx-auto max-w-7xl space-y-6">
            {/* Section Header */}
            <div className="max-w-2xl space-y-2.5 text-left">
              <Badge variant="outline" className="text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Actual Platform UI Showcase
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Explore WISE on Desktop &amp; Mobile
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                See how the real WISE interface adapts from a full-screen laptop
                workspace with a persistent left sidebar to a compact smartphone
                screen with a slide-out navigation drawer.
              </p>
            </div>

            {/* Interactive Feature Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
              {[
                {
                  id: "modules",
                  label: "1. Course Modules & Lessons",
                  icon: BookOpen,
                },
                {
                  id: "quizzes",
                  label: "2. Timed Module Quizzes",
                  icon: HelpCircle,
                },
                {
                  id: "forums",
                  label: "3. Real-Time Course Forum",
                  icon: MessageSquare,
                },
                {
                  id: "certificates",
                  label: "4. Certificate Verification",
                  icon: ShieldCheck,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                        : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Animated Device Stage */}
            <div
              ref={workspaceContentRef}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center"
            >
              {/* MACBOOK PRO FRAME */}
              <div className="xl:col-span-8 w-full">
                <MacBookShell
                  urlText={`parsuwise.onrender.com/${
                    activeTab === "certificates"
                      ? "verify"
                      : "student/homepage/cs204/selected-course"
                  }`}
                  badgeText="1440px Desktop UI"
                >
                  <div className="flex min-h-[455px] text-left">
                    {/* Desktop Sidebar inside Workspace Laptop */}
                    <aside className="hidden md:flex w-40 border-r border-border bg-background flex-col justify-between p-3 shrink-0">
                      <div className="space-y-4">
                        <div className="py-2 border-b border-border/50 flex flex-col items-center gap-1.5">
                          <img
                            src="/PSU_LOGO.png"
                            alt="PSU"
                            className="w-9 h-9 object-contain"
                          />
                          <p className="text-[9px] font-bold uppercase tracking-wider text-center">
                            Partido State University
                          </p>
                        </div>
                        <div className="space-y-1">
                          {ROLE_WORKFLOWS.STUDENT.sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.name}
                                className={`flex items-center gap-2 h-8 px-2.5 rounded-md text-xs font-medium ${
                                  item.active
                                    ? "bg-accent text-accent-foreground shadow-xs"
                                    : "text-foreground/70"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-[9px] text-muted-foreground/70 text-center border-t pt-2">
                        © 2025 PSU WISE
                      </p>
                    </aside>

                    {/* Main Content Area inside Workspace Laptop */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* Authentic WISE Header */}
                      <div className="h-11 border-b border-border px-4 flex items-center justify-between bg-background/95">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-black tracking-wider">
                            WISE
                          </span>
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg border bg-muted/30 text-[10px] text-muted-foreground w-48">
                          <Search className="h-3 w-3" />
                          <span>Search courses...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border">
                            <AvatarFallback className="text-[9px] font-bold bg-primary/15 text-primary">
                              PSU
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Tab-Specific Desktop Screen Content */}
                      <div className="p-4 sm:p-5 flex-1">
                        {/* TAB 1: MODULES & LESSONS */}
                        {activeTab === "modules" && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            <div className="md:col-span-5 space-y-2">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Play className="h-3.5 w-3.5 text-primary" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">
                                  Lessons ({WORKSPACE_LESSONS.length})
                                </h3>
                              </div>
                              {WORKSPACE_LESSONS.map((item, idx) => {
                                const isCurrent =
                                  selectedWorkspaceLesson.id === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                      setSelectedWorkspaceLesson(item)
                                    }
                                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border-2 text-left transition-all cursor-pointer ${
                                      isCurrent
                                        ? "border-primary bg-primary/5"
                                        : "border-input bg-card hover:bg-accent/50"
                                    }`}
                                  >
                                    <span className="text-xs font-semibold text-primary w-4 text-center">
                                      {idx + 1}
                                    </span>
                                    {item.type === "PDF" ? (
                                      <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                                      </div>
                                    ) : item.type === "LINK" ? (
                                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <ExternalLink className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                      </div>
                                    ) : (
                                      <div className="w-14 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center relative shrink-0">
                                        <Play className="h-4 w-4 text-blue-600 dark:text-blue-400 fill-current" />
                                        <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 rounded">
                                          {item.duration}
                                        </span>
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-foreground truncate">
                                        {item.title}
                                      </p>
                                      <Badge
                                        variant="secondary"
                                        className="text-[9px] mt-0.5 px-1.5 py-0 h-4"
                                      >
                                        {item.badge}
                                      </Badge>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="md:col-span-7 rounded-xl border bg-card p-4 space-y-3">
                              <div className="flex items-center justify-between border-b pb-2.5">
                                <Badge>{selectedWorkspaceLesson.badge}</Badge>
                                <span className="text-xs font-mono text-muted-foreground">
                                  {selectedWorkspaceLesson.duration}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-foreground">
                                {selectedWorkspaceLesson.title}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {selectedWorkspaceLesson.description}
                              </p>
                              <div className="space-y-1.5 pt-1">
                                {selectedWorkspaceLesson.highlights.map(
                                  (point) => (
                                    <div
                                      key={point}
                                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/60 text-xs"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                      <span>{point}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: QUIZZES */}
                        {activeTab === "quizzes" && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            <div className="md:col-span-4 space-y-2">
                              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                Question Modes:
                              </p>
                              {[
                                {
                                  key: "MULTIPLE_CHOICE",
                                  label: "Multiple Choice",
                                },
                                { key: "TRUE_FALSE", label: "True / False" },
                                {
                                  key: "IDENTIFICATION",
                                  label: "Identification",
                                },
                              ].map((q) => (
                                <button
                                  key={q.key}
                                  type="button"
                                  onClick={() => handleQuizTypeChange(q.key)}
                                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                                    quizType === q.key
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-card hover:bg-muted border-border"
                                  }`}
                                >
                                  <span>{q.label}</span>
                                  <span>
                                    {SAMPLE_QUIZ_QUESTIONS[q.key].points} pts
                                  </span>
                                </button>
                              ))}
                            </div>

                            <form
                              onSubmit={handleQuizSubmit}
                              className="md:col-span-8 rounded-xl border bg-card p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between text-xs border-b pb-2">
                                <Badge variant="outline">
                                  {currentQuestion.typeLabel}
                                </Badge>
                                <span className="font-mono text-amber-500 inline-flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" /> 14:52
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-foreground">
                                {currentQuestion.question}
                              </p>
                              {quizType === "IDENTIFICATION" ? (
                                <Input
                                  type="text"
                                  value={identInput}
                                  onChange={(e) => {
                                    setIdentInput(e.target.value);
                                    setQuizSubmitted(false);
                                  }}
                                  placeholder="Type SQL..."
                                  className="h-9 text-xs"
                                />
                              ) : (
                                <div className="space-y-1.5">
                                  {currentQuestion.options.map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => {
                                        setSelectedOption(opt);
                                        setQuizSubmitted(false);
                                      }}
                                      className={`w-full p-2 rounded-lg border text-left text-xs font-medium flex items-center justify-between cursor-pointer ${
                                        selectedOption === opt
                                          ? "bg-primary/10 border-primary"
                                          : "bg-background hover:bg-muted border-border"
                                      }`}
                                    >
                                      <span>{opt}</span>
                                      {selectedOption === opt && (
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {quizSubmitted && (
                                <div
                                  className={`p-2.5 rounded-lg border text-xs ${
                                    isQuizCorrect
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                                      : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                                  }`}
                                >
                                  <p className="font-bold">
                                    {isQuizCorrect
                                      ? "Correct!"
                                      : `Answer: ${currentQuestion.correctAnswer}`}
                                  </p>
                                  <p className="opacity-90">
                                    {currentQuestion.explanation}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOption("");
                                    setIdentInput("");
                                    setQuizSubmitted(false);
                                  }}
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                                </Button>
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={!userAnswer}
                                >
                                  Submit Answer
                                </Button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* TAB 3: FORUMS */}
                        {activeTab === "forums" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Course Discussion Forum
                              </span>
                              <div className="flex gap-1">
                                {["ALL", "Announcement", "Q&A"].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setForumCategory(cat)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${
                                      forumCategory === cat
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-muted-foreground"
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {forumPosts
                              .filter(
                                (p) =>
                                  forumCategory === "ALL" ||
                                  p.category === forumCategory
                              )
                              .map((post) => (
                                <div
                                  key={post.id}
                                  className="p-3.5 rounded-xl border bg-card space-y-2"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        {post.isPinned && (
                                          <Badge
                                            variant="secondary"
                                            className="text-[9px]"
                                          >
                                            <Pin className="h-2.5 w-2.5 mr-1 text-primary" />
                                            Pinned
                                          </Badge>
                                        )}
                                        <span className="text-xs font-bold">
                                          {post.author}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-[9px] py-0 h-4"
                                        >
                                          {post.role}
                                        </Badge>
                                      </div>
                                      <p className="text-xs sm:text-sm font-bold text-foreground mt-1">
                                        {post.title}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => togglePostLike(post.id)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold text-rose-500 cursor-pointer"
                                    >
                                      <Heart
                                        className={`h-3 w-3 ${
                                          post.liked ? "fill-current" : ""
                                        }`}
                                      />
                                      {post.likes}
                                    </button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {post.content}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* TAB 4: CERTIFICATES */}
                        {activeTab === "certificates" && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <div className="md:col-span-5 space-y-2.5">
                              <Badge variant="secondary">
                                Public /verify Page
                              </Badge>
                              <h4 className="text-sm sm:text-base font-bold">
                                Verify Certificate Authenticity
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Enter any WISE certificate serial number to
                                validate recipient and course details.
                              </p>
                              <form
                                onSubmit={handleVerifySubmit}
                                className="space-y-2"
                              >
                                <Input
                                  type="text"
                                  value={certCode}
                                  onChange={(e) =>
                                    setCertCode(e.target.value)
                                  }
                                  placeholder="WISE-2025-XXXX"
                                  className="h-9 text-xs font-mono"
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="w-full cursor-pointer"
                                >
                                  Verify on /verify
                                </Button>
                              </form>
                            </div>
                            <div className="md:col-span-7 p-4 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 space-y-3">
                              <div className="flex items-center justify-between border-b pb-2.5">
                                <div className="flex items-center gap-2">
                                  <img
                                    src="/PSU_LOGO.png"
                                    alt="PSU"
                                    className="h-8 w-8 object-contain"
                                  />
                                  <div>
                                    <p className="text-[9px] font-bold uppercase text-primary">
                                      Partido State University
                                    </p>
                                    <p className="text-xs font-bold">
                                      Certificate of Completion
                                    </p>
                                  </div>
                                </div>
                                <Badge className="bg-emerald-600 text-white border-0 text-[9px]">
                                  Verified
                                </Badge>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground">
                                  Recipient
                                </p>
                                <p className="text-base font-bold">
                                  Juan Dela Cruz
                                </p>
                                <p className="text-xs font-semibold text-primary">
                                  CS 204: Database Management Systems
                                </p>
                              </div>
                              <div className="pt-2 border-t flex justify-between text-[10px] font-mono text-muted-foreground">
                                <span>ID: WISE-2025-PSU-8492</span>
                                <span>Issued Oct 2025</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </MacBookShell>
              </div>

              {/* IPHONE PRO TITANIUM FRAME (TALL PROPORTIONAL SMARTPHONE, IDENTICAL CONSISTENT UI) */}
              <div className="xl:col-span-4 flex justify-center w-full">
                <IPhoneProShell className="w-[268px] sm:w-[278px]">
                  {/* Interactive Mobile Sidebar Drawer inside Workspace Phone */}
                  {phoneSidebarOpen && (
                    <div className="absolute inset-0 z-40 flex animate-in fade-in duration-200">
                      <div className="w-44 bg-background border-r border-border h-full p-3 flex flex-col justify-between shadow-2xl text-left">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                            <div className="flex items-center gap-2">
                              <img
                                src="/PSU_LOGO.png"
                                alt="PSU"
                                className="h-7 w-7 object-contain"
                              />
                              <div className="leading-tight">
                                <p className="text-[9px] font-bold uppercase">
                                  Partido State
                                </p>
                                <p className="text-[8px] text-muted-foreground">
                                  University
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPhoneSidebarOpen(false)}
                              className="p-1 rounded hover:bg-muted cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            {ROLE_WORKFLOWS.STUDENT.sidebarItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => setPhoneSidebarOpen(false)}
                                  className={`w-full flex items-center gap-2 h-7 px-2 rounded-md text-[10px] font-medium cursor-pointer ${
                                    item.active
                                      ? "bg-accent text-accent-foreground shadow-xs"
                                      : "text-foreground/70 hover:bg-accent/50"
                                  }`}
                                >
                                  <Icon className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-[8px] text-muted-foreground text-center border-t pt-2">
                          © 2025 PSU WISE
                        </p>
                      </div>
                      <div
                        onClick={() => setPhoneSidebarOpen(false)}
                        className="flex-1 bg-black/50 backdrop-blur-xs cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Authentic Mobile Header inside Workspace Phone */}
                  <div className="h-10 px-3 border-b border-border bg-background/95 flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPhoneSidebarOpen((prev) => !prev)}
                        className="h-6 w-6 rounded hover:bg-accent flex items-center justify-center cursor-pointer"
                        title="Open Mobile Sidebar"
                      >
                        <Menu className="h-3.5 w-3.5 text-foreground" />
                      </button>
                      <span className="text-xs font-black tracking-wider">
                        WISE
                      </span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPhoneSearchOpen((prev) => !prev)}
                        className="h-6 w-6 rounded hover:bg-accent flex items-center justify-center cursor-pointer"
                        title="Toggle Mobile Search"
                      >
                        {phoneSearchOpen ? (
                          <X className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Search className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                      <Avatar className="h-5 w-5 border">
                        <AvatarFallback className="text-[8px] font-bold bg-primary/15 text-primary">
                          PSU
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Mobile Search Overlay */}
                  {phoneSearchOpen && (
                    <div className="p-2 bg-background border-b border-border shadow-md z-20">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input
                          type="text"
                          readOnly
                          placeholder="Search courses..."
                          className="w-full pl-7 pr-2 h-6 rounded-lg bg-muted/50 border border-foreground/20 text-[10px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Responsive Mobile Viewport matching Laptop UI for current activeTab */}
                  <div className="p-3 space-y-2.5 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {activeTab === "modules" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Play className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Lessons ({WORKSPACE_LESSONS.length})
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {WORKSPACE_LESSONS.map((l, i) => {
                              const active =
                                selectedWorkspaceLesson.id === l.id;
                              return (
                                <button
                                  key={l.id}
                                  type="button"
                                  onClick={() => setSelectedWorkspaceLesson(l)}
                                  className={`w-full flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all cursor-pointer ${
                                    active
                                      ? "border-primary bg-primary/5"
                                      : "border-input bg-card hover:bg-accent/50"
                                  }`}
                                >
                                  <span className="text-[10px] font-bold text-primary w-3 text-center">
                                    {i + 1}
                                  </span>
                                  {l.type === "PDF" ? (
                                    <div className="w-7 h-7 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                      <FileText className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    </div>
                                  ) : l.type === "LINK" ? (
                                    <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                      <ExternalLink className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                  ) : (
                                    <div className="w-11 h-7 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center relative shrink-0">
                                      <Play className="h-3 w-3 text-blue-600 dark:text-blue-400 fill-current" />
                                      <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[7px] px-1 rounded">
                                        {l.duration}
                                      </span>
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-semibold truncate">
                                      {l.title}
                                    </p>
                                    <Badge
                                      variant="secondary"
                                      className="text-[8px] px-1 py-0 h-3.5"
                                    >
                                      {l.badge}
                                    </Badge>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Selected Lesson Details (matches Laptop right panel) */}
                          <div className="p-2.5 rounded-xl border bg-card space-y-1.5">
                            <div className="flex items-center justify-between border-b pb-1.5">
                              <Badge className="text-[8px] px-1.5 py-0 h-4">
                                {selectedWorkspaceLesson.badge}
                              </Badge>
                              <span className="text-[9px] font-mono text-muted-foreground">
                                {selectedWorkspaceLesson.duration}
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-foreground leading-tight">
                              {selectedWorkspaceLesson.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">
                              {selectedWorkspaceLesson.description}
                            </p>
                            <div className="space-y-1 pt-0.5">
                              {selectedWorkspaceLesson.highlights
                                .slice(0, 2)
                                .map((point) => (
                                  <div
                                    key={point}
                                    className="flex items-center gap-1.5 p-1 rounded bg-muted/40 border border-border/60 text-[9px]"
                                  >
                                    <CheckCircle2 className="h-2.5 w-2.5 text-primary shrink-0" />
                                    <span className="truncate">{point}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "quizzes" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { key: "MULTIPLE_CHOICE", label: "MCQ" },
                              { key: "TRUE_FALSE", label: "True/False" },
                              { key: "IDENTIFICATION", label: "Ident." },
                            ].map((q) => (
                              <button
                                key={q.key}
                                type="button"
                                onClick={() => handleQuizTypeChange(q.key)}
                                className={`py-1 px-1.5 rounded-md border text-[9px] font-bold cursor-pointer truncate ${
                                  quizType === q.key
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-muted-foreground border-border"
                                }`}
                              >
                                {q.label}
                              </button>
                            ))}
                          </div>

                          <form
                            onSubmit={handleQuizSubmit}
                            className="p-2.5 rounded-xl border bg-card space-y-2"
                          >
                            <div className="flex items-center justify-between text-[10px] border-b pb-1.5">
                              <Badge
                                variant="outline"
                                className="text-[8px] px-1.5 py-0 h-4"
                              >
                                {currentQuestion.typeLabel}
                              </Badge>
                              <span className="font-mono text-amber-500 inline-flex items-center gap-1 text-[10px]">
                                <Clock className="h-3 w-3" /> 14:52
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold leading-snug">
                              {currentQuestion.question}
                            </p>
                            {quizType === "IDENTIFICATION" ? (
                              <Input
                                type="text"
                                value={identInput}
                                onChange={(e) => {
                                  setIdentInput(e.target.value);
                                  setQuizSubmitted(false);
                                }}
                                placeholder="Type SQL..."
                                className="h-7 text-[10px]"
                              />
                            ) : (
                              <div className="space-y-1">
                                {currentQuestion.options.map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      setSelectedOption(opt);
                                      setQuizSubmitted(false);
                                    }}
                                    className={`w-full p-1.5 rounded-lg border text-left text-[10px] font-medium flex items-center justify-between cursor-pointer ${
                                      selectedOption === opt
                                        ? "bg-primary/10 border-primary"
                                        : "bg-background hover:bg-muted border-border"
                                    }`}
                                  >
                                    <span className="truncate">{opt}</span>
                                    {selectedOption === opt && (
                                      <Check className="h-3 w-3 text-primary shrink-0" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                            {quizSubmitted && (
                              <div
                                className={`p-2 rounded-lg border text-[9px] ${
                                  isQuizCorrect
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                                    : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                                }`}
                              >
                                <p className="font-bold">
                                  {isQuizCorrect
                                    ? "Correct!"
                                    : `Answer: ${currentQuestion.correctAnswer}`}
                                </p>
                              </div>
                            )}
                            <div className="flex justify-end gap-1.5 pt-0.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                onClick={() => {
                                  setSelectedOption("");
                                  setIdentInput("");
                                  setQuizSubmitted(false);
                                }}
                              >
                                <RotateCcw className="h-2.5 w-2.5 mr-1" />
                                Reset
                              </Button>
                              <Button
                                type="submit"
                                size="sm"
                                disabled={!userAnswer}
                                className="h-6 px-2.5 text-[9px]"
                              >
                                Submit
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}

                      {activeTab === "forums" && (
                        <div className="space-y-2">
                          <div className="space-y-1.5 border-b pb-2">
                            <span className="text-[11px] font-bold flex items-center gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5 text-primary" />
                              Course Discussion Forum
                            </span>
                            <div className="flex gap-1">
                              {["ALL", "Announcement", "Q&A"].map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setForumCategory(cat)}
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border cursor-pointer ${
                                    forumCategory === cat
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background text-muted-foreground"
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                          {forumPosts
                            .filter(
                              (p) =>
                                forumCategory === "ALL" ||
                                p.category === forumCategory
                            )
                            .map((p) => (
                              <div
                                key={p.id}
                                className="p-2.5 rounded-xl border bg-card space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {p.isPinned && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[8px] px-1 py-0 h-3.5"
                                        >
                                          <Pin className="h-2 w-2 mr-0.5 text-primary" />
                                          Pinned
                                        </Badge>
                                      )}
                                      <span className="text-[10px] font-bold">
                                        {p.author}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-[8px] px-1 py-0 h-3.5"
                                      >
                                        {p.role}
                                      </Badge>
                                    </div>
                                    <p className="text-[10px] font-bold text-foreground mt-1 line-clamp-2">
                                      {p.title}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => togglePostLike(p.id)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold text-rose-500 cursor-pointer shrink-0"
                                  >
                                    <Heart
                                      className={`h-2.5 w-2.5 ${
                                        p.liked ? "fill-current" : ""
                                      }`}
                                    />
                                    {p.likes}
                                  </button>
                                </div>
                                <p className="text-[9px] text-muted-foreground line-clamp-2">
                                  {p.content}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}

                      {activeTab === "certificates" && (
                        <div className="space-y-2.5">
                          <div className="p-3 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 space-y-2">
                            <div className="flex items-center justify-between border-b pb-2">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src="/PSU_LOGO.png"
                                  alt="PSU"
                                  className="h-6 w-6 object-contain"
                                />
                                <div>
                                  <p className="text-[8px] font-bold uppercase text-primary">
                                    Partido State University
                                  </p>
                                  <p className="text-[10px] font-bold">
                                    Certificate of Completion
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-emerald-600 text-white border-0 text-[8px] px-1.5 py-0 h-4">
                                Verified
                              </Badge>
                            </div>
                            <div>
                              <p className="text-[9px] text-muted-foreground">
                                Recipient
                              </p>
                              <p className="text-xs font-bold">
                                Juan Dela Cruz
                              </p>
                              <p className="text-[10px] font-semibold text-primary truncate">
                                CS 204: Database Management Systems
                              </p>
                            </div>
                            <div className="pt-1.5 border-t flex justify-between text-[8px] font-mono text-muted-foreground">
                              <span>ID: WISE-2025-PSU-8492</span>
                              <span>Issued Oct 2025</span>
                            </div>
                          </div>

                          <form
                            onSubmit={handleVerifySubmit}
                            className="p-2.5 rounded-xl border bg-card space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="secondary"
                                className="text-[8px] px-1.5 py-0 h-4"
                              >
                                Public /verify Page
                              </Badge>
                            </div>
                            <Input
                              type="text"
                              value={certCode}
                              onChange={(e) => setCertCode(e.target.value)}
                              placeholder="WISE-2025-XXXX"
                              className="h-7 text-[10px] font-mono"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="w-full h-7 text-[10px] cursor-pointer"
                            >
                              Verify on /verify
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Mobile Responsive Footer Bar */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[9px] text-muted-foreground">
                      <span>Responsive UI</span>
                      <span className="font-mono text-primary">390px</span>
                    </div>
                  </div>
                </IPhoneProShell>
              </div>
            </div>
          </div>
        </section>

        {/* HOW LEARNING WORKS ON WISE (#workflow) */}
        <section
          id="workflow"
          data-reveal
          className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-border/70 scroll-mt-16"
        >
          <div className="container mx-auto max-w-7xl space-y-10">
            <div className="max-w-3xl space-y-3 text-left">
              <Badge variant="outline" className="text-xs font-semibold">
                End-to-End Academic Workflow
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                How Learning Works on WISE
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                From initial enrollment to verifiable certification, every step
                is structured so students and instructors always know what comes
                next on any screen size.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                {
                  step: "01",
                  title: "Authenticate & Select Role",
                  description:
                    "Sign in securely via Clerk authentication. WISE automatically routes you to the Student, Faculty, or Administrator workspace.",
                  icon: Lock,
                },
                {
                  step: "02",
                  title: "Enroll via Catalog or Code",
                  description:
                    "Join courses across PSU's 11 colleges or enter a course access code provided by your instructor.",
                  icon: Compass,
                },
                {
                  step: "03",
                  title: "Master Ordered Modules",
                  description:
                    "Complete video lectures, Supabase PDF readings, and timed module quizzes on desktop or mobile while collaborating in forums.",
                  icon: Layers,
                },
                {
                  step: "04",
                  title: "Earn Verifiable Credentials",
                  description:
                    "Upon 100% course completion, receive an official PDF certificate with a QR code and public verification ID.",
                  icon: Award,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.step}
                    className="p-6 border-border bg-card flex flex-col justify-between space-y-4 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-primary/10 text-primary">
                          STEP {item.step}
                        </span>
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* PARTIDO STATE UNIVERSITY 11 COLLEGES DIRECTORY (#colleges) */}
        <section
          id="colleges"
          data-reveal
          className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-muted/15 scroll-mt-16 overflow-hidden"
        >
          {/* Ambient Background Grid & Glow */}
          <div className="pointer-events-none absolute -top-32 right-1/4 w-[480px] h-[480px] rounded-full bg-primary/8 blur-[130px]" />

          <div className="container mx-auto max-w-7xl space-y-5 relative z-10">
            {/* Section Header */}
            <div className="space-y-1.5 max-w-3xl text-left">
              <Badge
                variant="outline"
                className="text-xs font-semibold px-3 py-0.5 bg-background/80 backdrop-blur-xs"
              >
                <Building2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                11 Academic Colleges • Multi-Campus Ecosystem
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                Engineered for Every{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Partido State University
                </span>{" "}
                College
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Explore how WISE adapts to each college&apos;s academic programs
                across Goa, Sagñay, Lagonoy, San Jose, Salogon, Caramoan, and
                Tinambac campuses.
              </p>
            </div>

            {/* Interactive Active College Spotlight Deck */}
            {spotlightCollege && (
              <div className="relative rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-md overflow-hidden p-3.5 sm:p-4">
                {/* Top Gradient Accent Bar */}
                <div
                  className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${spotlightCollege.accentGradient}`}
                />
                {/* Ambient Radial Aura */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br ${spotlightCollege.glowColor} blur-2xl`}
                />
                {/* Watermark Acronym */}
                <span className="pointer-events-none select-none absolute right-6 -bottom-3 text-6xl sm:text-7xl font-black tracking-tighter text-foreground/[0.04] dark:text-foreground/[0.06]">
                  {spotlightCollege.short}
                </span>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 text-left">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {(() => {
                      const SpotlightIcon = spotlightCollege.icon;
                      return (
                        <div
                          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${spotlightCollege.accentGradient} text-white shadow-md flex items-center justify-center shrink-0`}
                        >
                          <SpotlightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                      );
                    })()}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${spotlightCollege.badgeClass}`}
                        >
                          {spotlightCollege.short} SPOTLIGHT
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-full">
                          <MapPin className="h-3 w-3 text-primary" />
                          {spotlightCollege.campus}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {spotlightCollege.name}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-2xl">
                        <span className="font-semibold text-foreground">
                          WISE Learning Modality:
                        </span>{" "}
                        {spotlightCollege.modality}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => navigate("/sign-in")}
                      className="rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm h-8 text-xs"
                    >
                      <span>Enter {spotlightCollege.short} Portal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Redesigned Cool Bento College Cards Grid (4 columns on xl so all 11 fit cleanly centered in viewport) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {PSU_COLLEGES.map((college) => {
                const CollegeIcon = college.icon;
                const isSpotlight = spotlightCollege?.short === college.short;

                return (
                  <div
                    key={college.name}
                    onClick={() => setSpotlightCollege(college)}
                    onMouseEnter={() => setSpotlightCollege(college)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSpotlightCollege(college);
                      }
                    }}
                    className={`group relative rounded-2xl border bg-card/90 backdrop-blur-xs overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between p-4 text-left ${
                      isSpotlight
                        ? "border-primary/60 shadow-[0_12px_30px_-12px_rgba(37,99,235,0.28)] -translate-y-0.5 ring-1 ring-primary/25"
                        : "border-border/80 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                  >
                    {/* Top Glowing Gradient Laser Strip */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${college.accentGradient} transition-opacity duration-300 ${
                        isSpotlight
                          ? "opacity-100"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    />

                    {/* Corner Radial Spotlight Glow */}
                    <div
                      className={`pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${college.glowColor} blur-2xl transition-all duration-500 ${
                        isSpotlight
                          ? "opacity-100 scale-110"
                          : "opacity-40 group-hover:opacity-100 group-hover:scale-110"
                      }`}
                    />

                    {/* Architectural Giant Watermarked Acronym */}
                    <span className="pointer-events-none select-none absolute top-2 right-3 text-4xl sm:text-5xl font-black tracking-tighter text-foreground/[0.04] dark:text-foreground/[0.06] group-hover:text-foreground/[0.09] group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-500">
                      {college.short}
                    </span>

                    {/* Top Section: 3D Icon Medallion + Badges + Title */}
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        {/* 3D Gradient Medallion */}
                        <div
                          className={`h-9 w-9 rounded-xl bg-gradient-to-br ${college.accentGradient} text-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}
                        >
                          <CollegeIcon className="h-4 w-4" />
                        </div>

                        {/* Code + Campus Pill */}
                        <div className="flex flex-wrap items-center justify-end gap-1">
                          <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60">
                            <MapPin className="h-2.5 w-2.5 text-primary" />
                            {college.campus}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${college.badgeClass}`}
                          >
                            {college.short}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {college.name}
                        </h3>
                      </div>

                      {/* Program Track Chips */}
                      <div className="flex flex-wrap gap-1">
                        {college.programs.map((prog) => (
                          <span
                            key={prog}
                            className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-foreground/85 border border-border/60 group-hover:border-primary/25 group-hover:bg-primary/5 transition-colors"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Footer Strip: Digital Modality + Portal CTA */}
                    <div className="relative z-10 mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-medium text-muted-foreground truncate flex-1">
                        {college.modality}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/sign-in");
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-[10px] font-semibold transition-all shrink-0 cursor-pointer"
                      >
                        <span>Portal</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PUBLIC CERTIFICATE VERIFICATION BANNER (#verify) */}
        <section
          id="verify"
          data-reveal
          className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-border/70 scroll-mt-16"
        >
          <div className="container mx-auto max-w-5xl">
            <Card className="p-6 sm:p-10 border-primary/25 bg-gradient-to-r from-primary/5 via-card to-primary/5 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-2 text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Public Credential Registry</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    Validate a WISE Completion Certificate
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Employers, faculty, and academic evaluators can verify the
                    authenticity of any WISE certificate immediately using its
                    unique certificate number.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <form
                    onSubmit={handleVerifySubmit}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={certCode}
                        onChange={(e) => setCertCode(e.target.value)}
                        placeholder="Certificate ID (e.g. WISE-2025-...)"
                        className="pl-9 h-11 bg-background text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 px-5 font-semibold shrink-0 cursor-pointer"
                    >
                      Verify Now
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Structured Academic Footer */}
      <footer className="bg-muted/30 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-border/60">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <img
                  src="/PSU_LOGO.png"
                  alt="PSU Logo"
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <span className="text-xl font-black tracking-wider text-foreground">
                    WISE
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Web-Based Interactive System for Education
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                Partido State University&apos;s centralized learning management
                platform for modular course delivery, interactive assessments,
                course forums, and verifiable academic credentials.
              </p>
            </div>

            {/* Platform Navigation */}
            <div className="md:col-span-4 space-y-3 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Platform Navigation
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("workspace")}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    Interactive Device Workspace
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("workflow")}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    How Learning Works on WISE
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("colleges")}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    PSU Academic Colleges
                  </button>
                </li>
                <li>
                  <NavLink
                    to="/verify"
                    className="hover:text-foreground transition-colors"
                  >
                    Public Certificate Verification (/verify)
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sign-in"
                    className="hover:text-foreground transition-colors"
                  >
                    Portal Sign In (/sign-in)
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Official Channels */}
            <div className="md:col-span-3 space-y-3 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Official Channels
              </h3>
              <p className="text-xs text-muted-foreground">
                Follow WISE updates, instructional videos, and announcements:
              </p>
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                >
                  <a
                    href="https://www.youtube.com/@WiseLearningPlatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  <a
                    href="https://www.facebook.com/share/1BTHYYTNtX/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Partido State University — WISE
              Learning Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;