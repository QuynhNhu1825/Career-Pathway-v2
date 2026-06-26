import React, { useState, useRef, useEffect } from "react";
import { AuthUser, Answers } from "../App";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import SaveIcon from "@mui/icons-material/Save";
import Edit from "@mui/icons-material/Edit";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Person,
  History,
  Logout,
  Home,
  ChatBubbleOutline as Chat,
  Send,
  Close as X,
  SmartToy as Bot,
  ChevronRight,
  EmojiEvents as Award,
  AttachMoney as DollarSign,
  Work as Briefcase,
  CheckCircle,
  Check,
  BarChart as BarChart2,
  Edit as Pencil,
  Save,
  Explore as Compass,
  TrackChanges as Target,
  TrendingUp,
} from "@mui/icons-material";
import { amber, blue, green, purple, red } from "@mui/material/colors";

interface DashboardProps {
  authUser: AuthUser;
  career: string;
  careerAnswers: Answers;
  onLogout: () => void;
  onHome: () => void;
}

type TabKey = "profile" | "history";

/* ── Static data ─────────────────────────────────────────── */

interface TestEntry {
  id: number;
  date: string;
  career: string;
  match: number;
  type: string;
  scores: Record<string, number>;
}

const testHistory: TestEntry[] = [
    {
        id: 4, date: "Tháng 1/2025", career: "Kỹ sư phần mềm", match: 84, type: "Targeted",
        scores: { "Tư duy phân tích": 84, "Sáng tạo": 72, "Giao tiếp": 68, "Tổ chức": 80, "Kỹ thuật": 82, "Lãnh đạo": 74 },
    },
    {
        id: 3, date: "Tháng 11/2024", career: "Quản lý dự án", match: 65, type: "Targeted",
        scores: { "Tư duy phân tích": 68, "Sáng tạo": 52, "Giao tiếp": 72, "Tổ chức": 82, "Kỹ thuật": 55, "Lãnh đạo": 75 },
    },
    {
        id: 2, date: "Tháng 7/2024", career: "Bài test tính cách", match: 72, type: "Discovery",
        scores: { "Tư duy phân tích": 60, "Sáng tạo": 78, "Giao tiếp": 65, "Tổ chức": 70, "Kỹ thuật": 65, "Lãnh đạo": 58 },
    },
    {
        id: 1, date: "Tháng 3/2024", career: "Kỹ sư phần mềm", match: 68, type: "Targeted",
        scores: { "Tư duy phân tích": 65, "Sáng tạo": 55, "Giao tiếp": 52, "Tổ chức": 68, "Kỹ thuật": 62, "Lãnh đạo": 50 },
    },
];

const DIMENSIONS = ["Tư duy phân tích", "Sáng tạo", "Giao tiếp", "Tổ chức", "Kỹ thuật", "Lãnh đạo"];

interface SkillPhase {
  phase: string;
  month: string;
  title: string;
  tasks: string[];
  initialDone: boolean;
}

const skillPhases: SkillPhase[] = [
  { phase: "p0", month: "Tháng 1–2", title: "Nền tảng", tasks: ["Hoàn thành khóa học cơ bản", "Lập tài khoản GitHub/Portfolio"], initialDone: true },
  { phase: "p1", month: "Tháng 3–4", title: "Dự án đầu tiên", tasks: ["Xây dựng 1 dự án thực tế", "Tham gia hackathon hoặc cộng đồng"], initialDone: true },
  { phase: "p2", month: "Tháng 5–6", title: "Chứng chỉ", tasks: ["Lấy chứng chỉ cơ bản ngành", "Mở rộng network LinkedIn +20 người"], initialDone: false },
  { phase: "p3", month: "Tháng 7–9", title: "Kinh nghiệm thực tế", tasks: ["Tìm thực tập hoặc freelance", "Hoàn thiện 2–3 dự án portfolio"], initialDone: false },
  { phase: "p4", month: "Tháng 10–12", title: "Tìm việc", tasks: ["Ứng tuyển 15–20 vị trí phù hợp", "Chuẩn bị phỏng vấn chuyên sâu"], initialDone: false },
];

function buildInitialChecked(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  skillPhases.forEach(({ phase, tasks, initialDone }) => {
    tasks.forEach((_, i) => { state[`${phase}-${i}`] = initialDone; });
  });
  return state;
}

const marketData = {
  certifications: [
    { name: "AWS Solutions Architect", provider: "Amazon", level: "Associate", priority: "Cao" },
    { name: "Google Cloud Professional", provider: "Google", level: "Professional", priority: "Cao" },
    { name: "PMP Certification", provider: "PMI", level: "Professional", priority: "Trung bình" },
    { name: "Docker & Kubernetes", provider: "CNCF", level: "Associate", priority: "Trung bình" },
  ],
  salaryRanges: [
    { level: "Intern", min: 3, max: 6 },
    { level: "Junior (0–2 năm)", min: 8, max: 18 },
    { level: "Mid-level (2–5 năm)", min: 18, max: 35 },
    { level: "Senior (5+ năm)", min: 35, max: 80 },
    { level: "Tech Lead / Manager", min: 50, max: 120 },
  ],
  jobs: [
    { company: "VNG Corporation", position: "Senior Engineer", location: "TP.HCM", type: "Toàn thời gian" },
    { company: "Tiki", position: "Software Engineer", location: "Hà Nội", type: "Hybrid" },
    { company: "MoMo", position: "Backend Developer", location: "TP.HCM", type: "Toàn thời gian" },
    { company: "FPT Software", position: "Tech Lead", location: "Đà Nẵng", type: "Toàn thời gian" },
  ],
};

interface ChatMessage { id: number; role: "user" | "ai"; text: string; }

const aiReplies = [
  "Dựa trên hồ sơ của bạn, tôi thấy bạn có tiềm năng lớn. Hãy tiếp tục phát triển kỹ năng kỹ thuật nhé!",
  "Theo xu hướng thị trường 2025, ngành bạn đang theo đuổi có nhu cầu tăng trưởng rất mạnh — khoảng 30% so với năm ngoái.",
  "Gợi ý: Bạn nên tập trung vào 1 chứng chỉ quan trọng trong 3 tháng tới. Hỏi tôi nếu cần tư vấn cụ thể!",
  "Điểm mạnh của bạn là tư duy phân tích — đây là lợi thế cạnh tranh rất lớn trong ngành bạn chọn.",
  "Bạn có muốn tôi đề xuất lộ trình học cụ thể dựa trên mục tiêu của bạn không?",
];

/* ── Comparison radar data builder ───────────────────────── */

function buildComparisonRadar(a: TestEntry, b: TestEntry) {
  return DIMENSIONS.map((dim) => ({
    subject: dim,
    [a.career + " (" + a.date + ")"]: a.scores[dim] ?? 0,
    [b.career + " (" + b.date + ")"]: b.scores[dim] ?? 0,
    fullMark: 100,
  }));
}

const educationOptions = [
    { value: "thpt", label: "THPT (Lớp 12)" },
    { value: "trungcap", label: "Trung cấp / Cao đẳng" },
    { value: "daihoc", label: "Đại học" },
    { value: "thacsi", label: "Thạc sĩ" },
    { value: "tiensi", label: "Tiến sĩ / Sau đại học" },
];

const statusOptions = [
    { value: "studying", label: "Đang học" },
    { value: "working", label: "Đi làm" },
    { value: "switching", label: "Đang chuyển nghề" },
    { value: "searching", label: "Đang tìm việc" },
];

const careerRoadmap = [
    { year: "Năm 1", title: "Junior", salary: "8–15M/tháng", icon: "🌱", tasks: ["Học nhanh và thực hành nhiều", "Xây dựng kỹ năng cốt lõi"] },
    { year: "Năm 2–3", title: "Mid-level", salary: "15–25M/tháng", icon: "🚀", tasks: ["Dẫn dắt tính năng hoặc module", "Mentoring junior"] },
    { year: "Năm 4–5", title: "Senior", salary: "25–45M/tháng", icon: "⭐", tasks: ["Thiết kế hệ thống lớn", "Ảnh hưởng đến roadmap sản phẩm"] },
    { year: "Năm 6+", title: "Lead / Principal", salary: "45M+/tháng", icon: "🏆", tasks: ["Lãnh đạo kỹ thuật toàn tổ chức", "Định hướng chiến lược công nghệ"] },
];

const personalityQuestions = [
    { id: 1, question: "Khi gặp một vấn đề phức tạp, bạn thường làm gì đầu tiên?", answer: "Phân tích từng bước theo logic và dữ liệu" },
    { id: 2, question: "Môi trường làm việc lý tưởng của bạn là?", answer: "Năng động, đầy thách thức và cơ hội mới" },
    { id: 3, question: "Điều gì mang lại sự thỏa mãn nhất cho bạn trong công việc?", answer: "Tạo ra điều gì đó mới mẻ và có ý nghĩa" },
];

const careerSuggestions = [
    { name: "Kỹ sư phần mềm", match: 87, description: "Xây dựng phần mềm, ứng dụng và hệ thống kỹ thuật số." },
    { name: "Thiết kế UX/UI", match: 82, description: "Tạo ra trải nghiệm người dùng xuất sắc qua thiết kế giao diện." },
    { name: "Quản lý dự án", match: 84, description: "Lãnh đạo và điều phối dự án từ khởi đầu đến hoàn thành." },
    { name: "Data Scientist", match: 78, description: "Phân tích dữ liệu để tìm ra các insight có giá trị cho doanh nghiệp." },
];

type HistoryFilter = "all" | "discovery" | "targeted";
type DetailTab = "answers" | "roadmap" | "market" | "suggestions";

/* ── Component ───────────────────────────────────────────── */

export function Dashboard({ authUser, career, careerAnswers, onLogout, onHome }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [openLogout, setOpenLogout] = useState(false);
  /* Profile edit state */
  const [editMode, setEditMode] = useState(false);
  const [profileName, setProfileName] = useState(authUser.name);
  const [profileEmail, setProfileEmail] = useState(authUser.email);
  const [profilePhone, setProfilePhone] = useState("0901 234 567");
  const [profileLocation, setProfileLocation] = useState("TP. Hồ Chí Minh");
  const [profileBio, setProfileBio] = useState("Đang xây dựng lộ trình trở thành " + (career || "chuyên gia công nghệ") + ".");
  const [profileEducation, setProfileEducation] = useState("daihoc");
  const [profileStatus, setProfileStatus] = useState("working");

  /* Roadmap checkbox state */
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(buildInitialChecked);
  const totalTasks = skillPhases.reduce((acc, p) => acc + p.tasks.length, 0);
  const doneTasks = Object.values(checkedTasks).filter(Boolean).length;
  const roadmapProgress = Math.round((doneTasks / totalTasks) * 100);

  const toggleTask = (key: string) => {
    setCheckedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* History comparison state */
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [selectedTest, setSelectedTest] = useState<TestEntry | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("answers");

  const filteredHistory = testHistory.filter(item => 
    historyFilter === 'all' || item.type.toLowerCase() === historyFilter);

  /* Chat state */
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "ai", text: `Xin chào ${authUser.name}! Tôi là AI Tư vấn của Career Pathway. Bạn cần hỗ trợ gì về lộ trình ngành ${career}?` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: aiReplies[Math.floor(Math.random() * aiReplies.length)] },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSelectTest = (test: TestEntry) => {
    setSelectedTest(test);
    setDetailTab(test.type === 'Discovery' ? 'suggestions' : 'answers');
  }

  const handleBackToHistory = () => {
    setSelectedTest(null);
  }

  const navItems: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "profile", label: "Hồ sơ cá nhân", icon: Person },
    { key: "history", label: "Lịch sử test", icon: History },
  ];


  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent";

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar (desktop) ─────────────────── */}
      <aside className="w-64 bg-white border-r border-border flex-col fixed h-full z-20 hidden lg:flex">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CP</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">Career <span className="text-amber-500">Pathway</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-sm">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{profileName}</p>
              <p className="text-xs text-gray-500 truncate">{profileEmail}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium truncate">{career}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {activeTab === key && <ChevronRight className="h-3 w-3 ml-auto text-amber-500" />}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-1 border-t border-border">
          <button onClick={onHome}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Home className="h-4 w-4" /> Trang chủ
          </button>
          <Button
        fullWidth
        startIcon={<Logout />}
        color="error"
        onClick={() => setOpenLogout(true)}
        sx={{
          justifyContent: "flex-start",
          textTransform: "none",
        }}
      >
        Đăng xuất
      </Button>

      <Dialog
        open={openLogout}
        onClose={() => setOpenLogout(false)}
      >
        <DialogTitle>
          Xác nhận đăng xuất
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn đăng xuất không?
            Dữ liệu của bạn sẽ được lưu lại.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>
            Hủy
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={onLogout}
          >
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      </aside>

      {/* ── Mobile header ─────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">CP</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">Dashboard</span>
        </div>
        <div className="flex gap-1">
          {navItems.map(({ key, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`p-2 rounded-lg transition-colors ${activeTab === key ? "bg-amber-100 text-amber-700" : "text-gray-500"}`}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ──────────────────────── */}
      <main className="flex-1 lg:ml-64">
        <div className="min-h-screen pt-14 lg:pt-0">
          <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

            {/* ══ PROFILE TAB ══════════════════════════════ */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">Hồ sơ cá nhân</h1>
                    <p className="text-gray-500 text-sm mt-1">Thông tin và thành tích của bạn</p>
                  </div>
                  <Button
                  variant={editMode ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setEditMode(!editMode)}
                  sx={{
                    textTransform: "none",
                    ...(editMode
                      ? {
                          bgcolor: "success.main",
                          "&:hover": {
                            bgcolor: "success.dark",
                          },
                        }
                      : {}),
                  }}>
                  {editMode ? (
                    <>
                      <Save sx={{ mr: 1, fontSize: 18 }} />
                      Lưu
                    </>
                  ) : (
                    <>
                      <Edit sx={{ mr: 1, fontSize: 18 }} />
                      Chỉnh sửa
                    </>
                  )}
                </Button>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  {/* Avatar row */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                      {profileName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      {editMode ? (
                        <input value={profileName} onChange={(e) => setProfileName(e.target.value)}
                          className="text-xl font-bold text-gray-900 border-b-2 border-amber-400 focus:outline-none bg-transparent w-48 mb-1" />
                      ) : (
                        <h2 className="text-xl font-bold text-gray-900">{profileName}</h2>
                      )}
                      {editMode ? (
                        <input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
                          className="text-sm text-gray-500 border-b border-gray-300 focus:outline-none bg-transparent w-56" />
                      ) : (
                        <p className="text-gray-500 text-sm">{profileEmail}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{career}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Đã xác minh</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Bài test đã làm", value: "4", icon: BarChart2, color: "text-blue-600 bg-blue-50" },
                      { label: "Điểm match hiện tại", value: "4.4%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-border">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Editable fields */}
                  {editMode ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Số điện thoại</label>
                        <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Khu vực sinh sống</label>
                        <input value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Trình độ học vấn</label>
                        <select value={profileEducation} onChange={(e) => setProfileEducation(e.target.value)} className={inputCls + " bg-white"}>
                          {educationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Tình trạng hiện tại</label>
                        <select value={profileStatus} onChange={(e) => setProfileStatus(e.target.value)} className={inputCls + " bg-white"}>
                          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Giới thiệu bản thân</label>
                        <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={3}
                          className={inputCls + " resize-none"} />
                      </div>
                      <div className="md:col-span-2">
                        <Button onClick={() => setEditMode(false)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                          <Save className="h-4 w-4" /> Lưu thay đổi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: "Số điện thoại", value: profilePhone },
                        { label: "Khu vực sinh sống", value: profileLocation },
                        { label: "Trình độ học vấn", value: educationOptions.find((o) => o.value === profileEducation)?.label ?? profileEducation },
                        { label: "Tình trạng", value: statusOptions.find((o) => o.value === profileStatus)?.label ?? profileStatus },
                        { label: "Ngành định hướng", value: career || "Chưa xác định" },
                        { label: "Lần đánh giá gần nhất", value: "Tháng 1/2025" },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1">
                          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{item.label}</span>
                          <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                        </div>
                      ))}
                      <div className="md:col-span-2 flex flex-col gap-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Giới thiệu bản thân</span>
                        <span className="text-sm text-gray-700 leading-relaxed">{profileBio}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Thành tích đạt được</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: "🎯", title: "First Test", desc: "Hoàn thành bài test đầu tiên" },
                      { icon: "📈", title: "Improver", desc: "Tăng điểm match 20+ điểm" },
                      { icon: "🔥", title: "Streak 7", desc: "Học liên tiếp 7 ngày" },
                      { icon: "🤝", title: "Networker", desc: "Kết nối 10+ mentor" },
                    ].map((badge) => (
                      <div key={badge.title} className="flex flex-col items-center text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <span className="text-3xl mb-2">{badge.icon}</span>
                        <p className="text-xs font-bold text-gray-900">{badge.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ HISTORY TAB ══════════════════════════════ */}
            {activeTab === "history" && (
                <div className="space-y-6">
                    {!selectedTest ? (
                        <>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 font-serif">Lịch sử test</h1>
                                <p className="text-gray-500 text-sm mt-1">Xem lại tất cả các bài đánh giá của bạn</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-border p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900">Các lần đánh giá</h3>
                                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                                        {(["all", "discovery", "targeted"] as HistoryFilter[]).map(f => (
                                            <button key={f} onClick={() => setHistoryFilter(f)}
                                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${historyFilter === f ? "bg-white text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                                                {f === 'all' ? 'Tất cả' : f === 'discovery' ? 'Discovery' : 'Targeted'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {filteredHistory.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'Discovery' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                                    {item.type === 'Discovery' ? <Compass className="w-5 h-5 text-purple-600" /> : <Target className="w-5 h-5 text-blue-600" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === 'Discovery' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{item.type}</span>
                                                        <p className="text-sm font-semibold text-gray-900">{item.career}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{item.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold font-mono ${((item.match / 100) * 4 + 1) >= 4.0 ? 'text-green-600' : ((item.match / 100) * 4 + 1) >= 3.0 ? 'text-amber-600' : 'text-red-500'}`}>
                                                        {/* Quy đổi điểm từ hệ 100 sang hệ 5 (1.0-5.0) */}
                                                        {((item.match / 100) * 4 + 1).toFixed(1)}
                                                    </div>
                                                    <div className="text-xs text-gray-400">/ 5.0</div>
                                                </div>
                                               <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleSelectTest(item)}
                                                sx={{
                                                  borderColor: "#f59e0b",
                                                  color: "#f59e0b",
                                                  textTransform: "none",
                                                  "&:hover": {
                                                    borderColor: "#d97706",
                                                    bgcolor: "#fffbeb",
                                                  },
                                                }}
                                              >
                                                Xem chi tiết
                                              </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ══ DETAIL VIEW ══════════════════════════════ */
                        <div className="space-y-6">
                            <div>
                                <button onClick={handleBackToHistory} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-2">
                                    <ChevronRight className="h-4 w-4 rotate-180" /> Quay lại lịch sử
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                                    Chi tiết: {selectedTest.career}
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    {selectedTest.type} Test · {selectedTest.date} · Điểm: <span className="font-bold text-amber-600">{((selectedTest.match / 100) * 4 + 1).toFixed(1)}/5.0</span>
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl border border-border p-6">
                                <div className="border-b border-border mb-6">
                                    <div className="flex items-center gap-4">
                                        {selectedTest.type === 'Targeted' && (
                                            <>
                                                <button onClick={() => setDetailTab('answers')} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === 'answers' ? 'text-amber-600 border-amber-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>Câu trả lời</button>
                                                <button onClick={() => setDetailTab('roadmap')} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === 'roadmap' ? 'text-amber-600 border-amber-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>Lộ trình phát triển</button>
                                                <button onClick={() => setDetailTab('market')} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === 'market' ? 'text-amber-600 border-amber-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>Thị trường lao động</button>
                                            </>
                                        )}
                                        {selectedTest.type === 'Discovery' && (
                                            <>
                                                <button onClick={() => setDetailTab('suggestions')} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === 'suggestions' ? 'text-amber-600 border-amber-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>Gợi ý nghề nghiệp</button>
                                                <button onClick={() => setDetailTab('answers')} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === 'answers' ? 'text-amber-600 border-amber-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>Câu trả lời</button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                {detailTab === 'answers' && (
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-4">Câu hỏi & Câu trả lời đã chọn</h3>
                                        <div className="space-y-4">
                                            {personalityQuestions.map(q => (
                                                <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-border">
                                                    <p className="text-sm font-semibold text-gray-800 mb-2">Câu {q.id}: {q.question}</p>
                                                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                                        <Check className="h-4 w-4 text-amber-600" />
                                                        <p className="text-sm text-amber-800">{q.answer}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {detailTab === 'suggestions' && (
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-4">Danh sách nghề nghiệp được gợi ý</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {careerSuggestions.map(s => (
                                                <div key={s.name} className="p-4 border border-border rounded-xl flex flex-col">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-gray-900">{s.name}</h4>
                                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{s.match}%</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                                                    </div>
                                                    <Button size="small" className="w-full bg-amber-500 hover:bg-amber-600">Làm bài test chuyên sâu</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {detailTab === 'roadmap' && (
                                    <div className="space-y-6">
                                        {/* Skill roadmap */}
                                        <div className="p-6 bg-gray-50 rounded-xl border border-border">
                                            <h3 className="font-bold text-gray-900 mb-4">Lộ trình kỹ năng (12 tháng)</h3>
                                            <div className="relative">
                                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                                                <div className="space-y-6">
                                                    {skillPhases.map(({ phase, month, title, tasks }, phaseIdx) => (
                                                        <div key={phase} className="flex gap-4 relative">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-colors bg-white ${tasks.every((_, i) => checkedTasks[`${phase}-${i}`]) ? "border-amber-500 text-amber-500" : "border-gray-300 text-gray-400"}`}>
                                                                <CheckCircle color="success" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
                                                                <p className="text-xs text-gray-500 mb-2">{month}</p>
                                                                {tasks.map((task, taskIdx) => <p key={taskIdx} className="text-sm text-gray-700 flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />{task}</p>)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Career roadmap */}
                                        <div className="bg-white rounded-2xl border border-border p-6">
                                            <h3 className="font-bold text-gray-900 mb-6">Lộ trình nghề nghiệp</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {careerRoadmap.map((item, i) => (
                                                    <div key={i} className={`p-4 rounded-xl border-2 ${i === 0 ? "border-amber-400 bg-amber-50" : "border-border bg-white"}`}>
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <span className="text-2xl">{item.icon}</span>
                                                            <div>
                                                                <p className="text-xs text-gray-500">{item.year}</p>
                                                                <p className="font-bold text-gray-900">{item.title}</p>
                                                                <p className="text-xs text-amber-600 font-semibold">{item.salary}</p>
                                                            </div>
                                                        </div>
                                                        <ul className="space-y-1">
                                                          {item.tasks.map((t) => (
                                                            <li key={t} className="text-xs text-gray-600 flex items-start gap-1.5">
                                                              <ChevronRight className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                                                              {t}
                                                            </li>
                                                          ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {detailTab === 'market' && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-2xl border border-border p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <DollarSign className="h-5 w-5 text-amber-600" />
                                                <h3 className="font-bold text-gray-900">Mức lương theo cấp độ</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {marketData.salaryRanges.map((range) => (
                                                    <div key={range.level} className="flex items-center gap-4">
                                                        <span className="text-sm text-gray-700 w-40 shrink-0">{range.level}</span>
                                                        <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 bg-amber-200 h-3 rounded-full" style={{ width: `${(range.max / 120) * 100}%` }} />
                                                            <div className="absolute top-0 left-0 bg-amber-500 h-3 rounded-full" style={{ width: `${(range.min / 120) * 100}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-600 font-mono w-20 shrink-0 text-right">{range.min}–{range.max}M</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-border p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Award className="h-5 w-5 text-amber-600" />
                                                <h3 className="font-bold text-gray-900">Chứng chỉ cần thiết</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-left border-b border-border">
                                                            <th className="py-2 pr-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Chứng chỉ</th>
                                                            <th className="py-2 pr-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Cấp bởi</th>
                                                            <th className="py-2 pr-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Cấp độ</th>
                                                            <th className="py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">Ưu tiên</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {marketData.certifications.map((cert) => (
                                                            <tr key={cert.name} className="hover:bg-gray-50">
                                                                <td className="py-3 pr-4 font-medium text-gray-900">{cert.name}</td>
                                                                <td className="py-3 pr-4 text-gray-600">{cert.provider}</td>
                                                                <td className="py-3 pr-4 text-gray-600">{cert.level}</td>
                                                                <td className="py-3">
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cert.priority === "Cao" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                                                        {cert.priority}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-border p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-5 w-5 text-amber-600" />
                                                    <h3 className="font-bold text-gray-900">Cơ hội việc làm nổi bật</h3>
                                                </div>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">1.240+ vị trí</span>
                                            </div>
                                            <div className="space-y-3">
                                                {marketData.jobs.map((job, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                                                                {job.company.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">{job.position}</p>
                                                                <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{job.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Floating AI Chatbox ───────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-border w-80 flex flex-col overflow-hidden" style={{ height: 420 }}>
            <div className="bg-amber-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AI Tư vấn</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-white/80 text-xs">Đang hoạt động</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-2 mt-0.5 shrink-0">
                      <Bot className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-border shadow-sm rounded-bl-sm"
                  }`}>{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            <div className="p-3 bg-white border-t border-border flex items-center gap-2">
              <input
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Hỏi AI tư vấn..."
                className="flex-1 text-xs px-3 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50"
              />
              <button onClick={sendMessage} disabled={!input.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  input.trim() ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-amber-500 hover:bg-amber-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          {chatOpen ? <X className="h-6 w-6 text-white" /> : <Chat color="inherit" />}
        </button>
      </div>
    </div>
  );
}
