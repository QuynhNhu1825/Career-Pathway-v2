import React, { useState, useRef, useEffect } from "react";
import { AuthUser, Answers } from "../App";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
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
  CircularProgress,
  Alert,
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
  Check,
  BarChart as BarChart2,
  Edit,
  Save,
  Explore as Compass,
  TrendingUp,
  TrackChanges as Target
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface DashboardProps {
  authUser: AuthUser;
  career: string;
  careerAnswers: Answers;
  onLogout: () => void;
  onHome: () => void;
}

type TabKey = "profile" | "history";

interface TestEntry {
  id: number;
  userId: number;
  sessionId: string;
  mode: "discovery" | "target" | "holland" | "personality" | "cognitive" | "values";
  relevanceScore: number | null;
  createdAt: string;
  title: string;
  date: string;
  type: string;
  // Fields for targeted tests
  basicSalary?: string;
  laborMarket?: string;
  roadmap?: any[];
  companies?: any[]; // Đổi tên từ hiringCompanies để nhất quán với AI service và Results.tsx
  trainingInstitutions?: any[]; // Đổi tên từ matchingSchools để nhất quán với AI service và Results.tsx
  [key: string]: any;
}

const educationOptions = [
  { value: "thpt", label: "THPT" },
  { value: "caodang", label: "Cao đẳng" },
  { value: "daihoc", label: "Đại học" },
  { value: "khac", label: "Khác" },
];

const locationOptions = [
   { value: "an_giang", label: "An Giang" },
  { value: "bac_ninh", label: "Bắc Ninh" },
  { value: "ca_mau", label: "Cà Mau" },
  { value: "can_tho", label: "Cần Thơ" },
  { value: "cao_bang", label: "Cao Bằng" },
  { value: "da_nang", label: "Đà Nẵng" },
  { value: "dak_lak", label: "Đắk Lắk" },
  { value: "dien_bien", label: "Điện Biên" },
  { value: "dong_nai", label: "Đồng Nai" },
  { value: "dong_thap", label: "Đồng Tháp" },
  { value: "gia_lai", label: "Gia Lai" },
  { value: "ha_noi", label: "Hà Nội" },
  { value: "ha_tinh", label: "Hà Tĩnh" },
  { value: "hai_phong", label: "Hải Phòng" },
  { value: "hung_yen", label: "Hưng Yên" },
  { value: "hue", label: "Huế" },
  { value: "khanh_hoa", label: "Khánh Hòa" },
  { value: "lai_chau", label: "Lai Châu" },
  { value: "lam_dong", label: "Lâm Đồng" },
  { value: "lang_son", label: "Lạng Sơn" },
  { value: "lao_cai", label: "Lào Cai" },
  { value: "nghe_an", label: "Nghệ An" },
  { value: "ninh_binh", label: "Ninh Bình" },
  { value: "phu_tho", label: "Phú Thọ" },
  { value: "quang_ngai", label: "Quảng Ngãi" },
  { value: "quang_ninh", label: "Quảng Ninh" },
  { value: "quang_tri", label: "Quảng Trị" },
  { value: "son_la", label: "Sơn La" },
  { value: "tay_ninh", label: "Tây Ninh" },
  { value: "thai_nguyen", label: "Thái Nguyên" },
  { value: "thanh_hoa", label: "Thanh Hóa" },
  { value: "tp_hcm", label: "TP. Hồ Chí Minh" },
  { value: "tuyen_quang", label: "Tuyên Quang" },
  { value: "vinh_long", label: "Vĩnh Long" },
];

interface ChatMessage { id: number; role: "user" | "ai"; text: string; }
type HistoryFilter = "all" | "discovery" | "target";
type DetailTab = "answers" | "roadmap" | "market" | "suggestions" | "schools";

const getEducationValue = (label: string) => {
  const found = educationOptions.find(o => o.label === label || o.value === label);
  return found ? found.value : "";
};

const getLocationValue = (label: string) => {
  const found = locationOptions.find(o => o.label === label || o.value === label);
  return found ? found.value : "";
};

export function Dashboard({ authUser, career, careerAnswers, onLogout, onHome }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [openLogout, setOpenLogout] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileName, setProfileName] = useState(authUser.name || "");
  const [profileEmail, setProfileEmail] = useState(authUser.email || "");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileEducation, setProfileEducation] = useState("");
  const [profileAge, setProfileAge] = useState("");
  const [profileInterests, setProfileInterests] = useState("");
  const [testCount, setTestCount] = useState(0);
  const [latestMatchScore, setLatestMatchScore] = useState(0);
  const [lastTestDate, setLastTestDate] = useState("");
  const [historyList, setHistoryList] = useState<TestEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfileAndHistoryData = async () => {
      if (!authUser?.id) return;
      setProfileLoading(true);
      setHistoryLoading(true);

      try {
        const [profileRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/profile/${authUser.id}`),
          fetch(`${API_URL}/api/history/${authUser.id}`)
        ]);

        const profileData = await profileRes.json();
        if (profileData.success && profileData.profile) {
          const p = profileData.profile;
          setProfileName(p.fullName || authUser.name || "");
          setProfileEmail(authUser.email || ""); 
          setProfileInterests(p.interests || "");
          setProfileAge(p.age ? p.age.toString() : "");
          setProfileEducation(getEducationValue(p.educationLevel));
          setProfileLocation(getLocationValue(p.location));
          setLatestMatchScore(p.careerFitScore || 0);
        } else {
          setProfileName(authUser.name || "");
          setProfileEmail(authUser.email || "");
        }

        const historyData = await historyRes.json();
        if (historyData.success && Array.isArray(historyData.history)) {
          const mappedHistory = historyData.history.map((item) => {
            const testDate = new Date(item.createdAt);
            const formattedDate = !isNaN(testDate.getTime()) 
              ? `${testDate.getHours()}:${testDate.getMinutes().toString().padStart(2, '0')} ${testDate.getDate()}/${testDate.getMonth() + 1}/${testDate.getFullYear()}` 
              : "Chưa rõ thời gian";

            return {
              ...item,
              id: item.sessionId,
              type: item.mode === "discovery" ? "Discovery" : "Target",
              title: item.title || "Bài test không tên",
              date: formattedDate,
              companies: item.companies || item.hiringCompanies || [], // Đảm bảo lấy từ 'companies' hoặc 'hiringCompanies'
              trainingInstitutions: item.trainingInstitutions || item.matchingSchools || [], // Đảm bảo lấy từ 'trainingInstitutions' hoặc 'matchingSchools'
              basicSalary: item.basicSalary, // Thêm trường basicSalary
              laborMarket: item.laborMarket, // Thêm trường laborMarket
              score: item.relevanceScore || 0,
            };
          });

          setHistoryList(mappedHistory); 
          setTestCount(mappedHistory.length);

          if (mappedHistory.length > 0) {
            setLastTestDate(mappedHistory[0].date);
            if (mappedHistory[0].score) {
              setLatestMatchScore(mappedHistory[0].score);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi fetch dữ liệu tổng hợp ở Frontend:", err);
        setProfileName(authUser.name || "");
        setProfileEmail(authUser.email || "");
      } finally {
        setProfileLoading(false);
        setHistoryLoading(false);
      }
    };

    fetchProfileAndHistoryData();
  }, [authUser.id, authUser.name, authUser.email]);

  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [selectedTest, setSelectedTest] = useState<TestEntry | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("answers");

  const filteredHistory = historyList.filter(item => 
    historyFilter === 'all' || item.mode === (historyFilter === 'discovery' ? 'discovery' : 'target'));

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "ai", text: `Xin chào ${authUser.name}! Tôi là AI Tư vấn của Career Pathway. Bạn cần hỗ trợ gì?` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [remainingTokens, setRemainingTokens] = useState<number | null>(authUser.tokenCount !== undefined ? authUser.tokenCount : null);

  // Update remainingTokens if authUser.tokenCount changes (e.g., after login or purchase)
  useEffect(() => {
    if (authUser.tokenCount !== undefined) {
      setRemainingTokens(authUser.tokenCount);
    }
  }, [authUser.tokenCount]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id) {
      setMessages((prev) => [...prev, { id: Date.now(), role: "ai", text: "Bạn cần đăng nhập để sử dụng AI Chat." }]);
      return;
    }

    // Prevent sending message if no tokens are left
    if (remainingTokens !== null && remainingTokens <= 0) {
      setMessages((prev) => [...prev, { id: Date.now(), role: "ai", text: "Bạn đã hết lượt hỏi AI. Vui lòng kiểm tra lại tài khoản." }]);
      return;
    }

    const question = input;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: question }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, question }),
      });

      const data = await res.json();
      if (!data.success) {
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: "ai", text: data.message }]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: "ai", text: data.answer }]);
        if (data.remainingTokens !== undefined) { // Ensure remainingTokens is present in the response
          setRemainingTokens(data.remainingTokens);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { id: Date.now() + 2, role: "ai", text: "Không thể kết nối tới máy chủ." }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSelectTest = (test: TestEntry) => {
    setSelectedTest(test);
    setDetailTab(test.type === 'Discovery' ? 'suggestions' : 'market'); // Default to 'market' for Target tests
  };

  const handleBackToHistory = () => {
    setSelectedTest(null);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const eduLabel = educationOptions.find(o => o.value === profileEducation)?.label || profileEducation;
      const locLabel = locationOptions.find(o => o.value === profileLocation)?.label || profileLocation;

      const res = await fetch(`${API_URL}/api/profile/${authUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profileName,
          age: profileAge ? parseInt(profileAge, 10) : null,
          educationLevel: eduLabel,
          location: locLabel,
          interests: profileInterests,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setEditMode(false);
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (localUser.id) {
          localUser.name = profileName;
          localStorage.setItem("user", JSON.stringify(localUser));
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.message || "Lưu thất bại");
      }
    } catch (err) {
      setSaveError("Không thể kết nối đến server");
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const navItems: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "profile", label: "Hồ sơ cá nhân", icon: Person },
    { key: "history", label: "Lịch sử test", icon: History },
  ];

  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* ── Sidebar (desktop) ─────────────────── */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full z-20 hidden lg:flex">
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
          <Button
            fullWidth
            startIcon={<Home className="h-4 w-4" />}
            onClick={onHome}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "text.secondary",
              fontWeight: 400,
              fontSize: "0.875rem",
              py: 1,
              "&:hover": { bgcolor: "grey.50", color: "text.primary" },
            }}
          >
            Trang chủ
          </Button>
          <Button
            fullWidth
            startIcon={<Logout />}
            color="error"
            onClick={() => setOpenLogout(true)}
            sx={{ justifyContent: "flex-start", textTransform: "none", fontSize: "0.875rem", py: 1 }}
          >
            Đăng xuất
          </Button>
        </div>
      </aside>

      <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
        <DialogTitle>Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn đăng xuất không? Dữ liệu của bạn sẽ được lưu lại.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={onLogout}>Đăng xuất</Button>
        </DialogActions>
      </Dialog>

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
      <main className="flex-1 lg:ml-64 w-full">
        <div className="min-h-screen pt-14 lg:pt-0">
          <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

            {/* ══ PROFILE TAB ══════════════════════════════ */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">Hồ sơ cá nhân</h1>
                    <p className="text-gray-500 text-sm mt-1">Thông tin cá nhân của bạn</p>
                  </div>
                  <Button
                    variant={editMode ? "contained" : "outlined"}
                    size="small"
                    onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                    disabled={savingProfile}
                    sx={{
                      textTransform: "none",
                      ...(editMode ? { bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } } : {}),
                    }}
                  >
                    {editMode ? (
                      savingProfile ? <><CircularProgress size={14} sx={{ mr: 1 }} />Đang lưu...</> : <><Save sx={{ mr: 1, fontSize: 18 }} />Lưu</>
                    ) : (
                      <><Edit sx={{ mr: 1, fontSize: 18 }} />Chỉnh sửa</>
                    )}
                  </Button>
                </div>

                {saveSuccess && <Alert severity="success" onClose={() => setSaveSuccess(false)}>Lưu hồ sơ thành công!</Alert>}
                {saveError && <Alert severity="error" onClose={() => setSaveError("")}>{saveError}</Alert>}

                <div className="bg-white rounded-2xl border border-border p-6">
                  {profileLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <CircularProgress color="warning" />
                      <Typography sx={{ ml: 2 }}>Đang tải dữ liệu hồ sơ...</Typography>
                    </div>
                  ) : (
                    <>
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
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-border">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 bg-blue-50">
                            <BarChart2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{testCount}</p>
                            <p className="text-xs text-gray-500">Bài test đã làm</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-border">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-green-600 bg-green-50">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{latestMatchScore > 0 ? latestMatchScore.toFixed(1) + "/5.0" : "N/A"}</p>
                            <p className="text-xs text-gray-500">Điểm match gần nhất</p>
                          </div>
                        </div>
                      </div>

                      {editMode ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Trình độ học vấn</label>
                            <select value={profileEducation} onChange={(e) => setProfileEducation(e.target.value)} className={inputCls + " bg-white"}>
                              <option value="">-- Chọn trình độ --</option>
                              {educationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Tuổi</label>
                            <input value={profileAge} onChange={(e) => setProfileAge(e.target.value)} className={inputCls} placeholder="Nhập tuổi..." />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Sở thích</label>
                            <input value={profileInterests} onChange={(e) => setProfileInterests(e.target.value)} className={inputCls} placeholder="Nhập sở thích..." />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Khu vực mong muốn học tập/làm việc</label>
                            <select value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} className={inputCls + " bg-white"}>
                              <option value="">-- Chọn khu vực --</option>
                              {locationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { label: "Trình độ học vấn", value: educationOptions.find((o) => o.value === profileEducation)?.label || profileEducation || "Chưa cập nhật" },
                            { label: "Tuổi", value: profileAge || "Chưa cập nhật" },
                            { label: "Khu vực mong muốn học tập/làm việc", value: locationOptions.find((o) => o.value === profileLocation)?.label || profileLocation || "Chưa cập nhật" },
                          ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{item.label}</span>
                              <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                            </div>
                          ))}
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Sở thích</span>
                            <span className="text-sm text-gray-800 font-medium">{profileInterests || "Chưa cập nhật"}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
                          {(["all", "discovery", "target"] as HistoryFilter[]).map((f) => (
                            <button
                              key={f}
                              onClick={() => setHistoryFilter(f)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                                historyFilter === f ? "bg-white text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
                              }`}
                            >
                              {f === "all" ? "Tất cả" : f === "discovery" ? "Discovery" : "Target"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {filteredHistory.length === 0 ? (
                          <p className="text-center text-sm text-gray-500 py-6">Bạn chưa tham gia bài đánh giá nào thuộc danh mục này.</p>
                        ) : (
                          filteredHistory.map((item) => (
                            <Box key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === "Discovery" ? "bg-purple-100" : "bg-blue-100"}`}>
                                  {item.mode === "discovery" ? <Compass className="w-5 h-5 text-purple-600" /> : <Target className="w-5 h-5 text-blue-600" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.mode === "discovery" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                      {item.mode === 'discovery' ? 'Discovery' : 'Target'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">{item.date}</p>
                                  <p className="text-sm font-bold text-gray-900">
                                    {item.subtitle || "Chưa xác định nghề nghiệp"}
                                  </p>
                                  
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {item.mode !== 'discovery' ? (
                                  <div className="text-right w-20">
                                    <div className={`text-xl font-bold font-mono ${item.score >= 4.0 ? "text-green-600" : item.score >= 3.0 ? "text-amber-600" : "text-red-500"}`}>
                                      {item.score ? item.score.toFixed(1) : "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-400">/ 5.0</div>
                                  </div>
                                ) : (
                                  <div className="w-20"></div>
                                )}
                                <Button
                                  size="small" variant="outlined" onClick={() => handleSelectTest(item)}
                                  sx={{
                                    borderColor: "#f59e0b", color: "#f59e0b", textTransform: "none",
                                    "&:hover": { borderColor: "#d97706", bgcolor: "#fffbeb" },
                                  }}
                                >
                                  Xem chi tiết
                                </Button>
                              </div>
                            </Box>
                          ))
                        )}
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
                      <h1 className="text-2xl font-bold text-gray-900 font-serif">Chi tiết: {selectedTest.title}</h1>
                      <p className="text-gray-500 text-sm mt-1">
                        {selectedTest.mode.charAt(0).toUpperCase() + selectedTest.mode.slice(1)} Test · {selectedTest.date}
                        {selectedTest.mode !== 'discovery' && (
                          <span className="font-bold text-amber-600"> · Điểm: {selectedTest.relevanceScore ? selectedTest.relevanceScore.toFixed(1) : "N/A"}/5.0</span>
                        )}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-border p-6">
                      <div className="border-b border-border mb-6">
                        <div className="flex items-center gap-4">
                          {selectedTest.mode === "target" && (
                            <>
                              <button onClick={() => setDetailTab("answers")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "answers" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Câu trả lời
                              </button>
                              <button onClick={() => setDetailTab("roadmap")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "roadmap" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Lộ trình phát triển
                              </button>
                              <button onClick={() => setDetailTab("market")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "market" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Thị trường lao động
                              </button>
                              <button onClick={() => setDetailTab("schools")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "schools" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Trường học
                              </button>
                            </>
                          )}
                          {selectedTest.mode === "discovery" && (
                            <>
                              <button onClick={() => setDetailTab("answers")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "answers" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Câu trả lời
                              </button>
                              <button onClick={() => setDetailTab("suggestions")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "suggestions" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Gợi ý nghề nghiệp
                              </button>
                              <button onClick={() => setDetailTab("schools")} className={`py-3 text-sm font-semibold border-b-2 ${detailTab === "schools" ? "text-amber-600 border-amber-600" : "text-gray-500 border-transparent hover:text-gray-800"}`}>
                                Gợi ý trường học
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {detailTab === "answers" && (
                        <div>
                          <h3 className="font-bold text-gray-900 mb-4 font-serif text-base">Câu hỏi & Câu trả lời đã chọn</h3>
                          <div className="space-y-4">
                            {selectedTest && Array.isArray(selectedTest.questions) && selectedTest.questions.length > 0 ? (
                              selectedTest.questions.map((q: any, index: number) => {
                                const questionText = q.questionText || q.q || `Câu hỏi số ${index + 1}`;
                                const finalAnswerDisplay = q.answerText || q.a || "Chưa trả lời";

                                return (
                                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-border shadow-sm">
                                    <p className="text-sm font-semibold text-gray-800 mb-2.5 leading-relaxed">Câu {index + 1}: {questionText}</p>
                                    <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg">
                                      <Check className="h-4 w-4 text-amber-600 shrink-0" />
                                      <p className="text-sm text-amber-900 font-medium">{finalAnswerDisplay}</p>
                                    </div>
                                    {(q.hollandType || q.trait || q.HollandGroup) && (
                                      <div className="mt-2 flex gap-1.5 flex-wrap">
                                        {(q.hollandType || q.HollandGroup) && (
                                          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-mono">
                                            Holland: {q.hollandType || q.HollandGroup}
                                          </span>
                                        )}
                                        {(q.trait || q.DacDiem) && (
                                          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono">
                                            Đặc điểm: {q.trait || q.DacDiem}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-8 bg-gray-50 border border-dashed border-border rounded-xl">
                                <p className="text-sm text-gray-400 font-medium">Không tìm thấy danh sách câu hỏi chi tiết của lượt đánh giá này.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {detailTab === "schools" && (
                        <div>
                          <h3 className="font-bold text-gray-900 mb-4">Danh sách trường học được gợi ý</h3>
                          {(selectedTest.trainingInstitutions && selectedTest.trainingInstitutions.length > 0) ? (
                            <div className="grid md:grid-cols-2 gap-4">
                              {selectedTest.trainingInstitutions.map((school: any, index: number) => (
                                <div key={index} className="p-4 border border-border rounded-xl flex flex-col bg-gray-50/50">
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-base">{school.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1 mb-3">{school.score}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {school.officialLink && (
                                      <Button size="small" variant="outlined" href={school.officialLink} target="_blank" sx={{ textTransform: 'none', flex: 1 }}>
                                        Trang chủ
                                      </Button>
                                    )}
                                    {school.admissionLink && (
                                      <Button size="small" variant="contained" href={school.admissionLink} target="_blank" sx={{ textTransform: 'none', flex: 1, bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' } }}>
                                        Tuyển sinh
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-sm text-gray-500">Không có dữ liệu trường học cho bài test này.</div>
                          )}
                        </div>
                      )}

                      {detailTab === "suggestions" && (
                        <div>
                          <h3 className="font-bold text-gray-900 mb-4">Danh sách nghề nghiệp được gợi ý</h3>
                          <div className="grid md:grid-cols-2 gap-4"> 
                            {(selectedTest.companies || []).map((s: any, index: number) => (
                              <div key={index} className="p-4 border border-border rounded-xl flex flex-col bg-gray-50/50">
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">{s.role}</h4>
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                      {selectedTest.relevanceScore?.toFixed(1) || "N/A"}/5.0
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {detailTab === "roadmap" && (
                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl border border-border p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Lộ trình nghề nghiệp</h3>
                            <div className="space-y-4">
                              {(selectedTest.roadmap || []).map((item: any, i: number) => (
                                <div key={i} className={`p-4 rounded-xl border-2 ${i === 0 ? "border-amber-400 bg-amber-50" : "border-border bg-white"}`}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div>
                                      <p className="font-bold text-gray-900">{item.stage}</p>
                                      <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                  </div>
                                  <ul className="space-y-1">
                                    {(item.certs || []).map((t: string) => (
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

                      {detailTab === "market" && (
                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            {/* Tiêu đề */}
                            <div className="flex items-center gap-2 mb-4">
                              <DollarSign className="h-5 w-5 text-amber-500" />
                              <h3 className="font-bold text-gray-900 text-base">Mức lương cơ bản</h3>
                            </div>

                            {/* Khung hiển thị text của AI */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                                {selectedTest.basicSalary 
                                  ? selectedTest.basicSalary 
                                  : "Chưa cập nhật thông tin mức lương cho vị trí này."}
                              </p>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <Briefcase className="h-5 w-5 text-amber-500" />
                              <h3 className="font-bold text-gray-900 text-base">Tổng quan thị trường lao động</h3>
                            </div>
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                                {selectedTest.laborMarket
                                  ? selectedTest.laborMarket
                                  : "Chưa cập nhật thông tin thị trường lao động cho vị trí này."}
                              </p>
                            </div>
                          </div>


                          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                              <Briefcase className="h-5 w-5 text-amber-500" />
                              <h3 className="font-bold text-gray-900 text-base">Cơ hội việc làm nổi bật</h3>
                            </div>
                            <div className="space-y-3.5">
                              {(selectedTest.companies || []).map((job: any, i: number) => {
                                const cleanRole = job.role ? job.role.replace(/\s*\(THPT\)\s*/g, "").trim() : "Chuyên viên nghiên cứu";
                                const jobLink = job.careerLink || job.url || "https://www.topcv.vn";

                                return (
                                  <a
                                    key={i} href={jobLink} target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-xl hover:border-amber-400 hover:bg-amber-50/10 hover:shadow-sm transition-all cursor-pointer gap-3"
                                  >
                                    <div>
                                      <p className="font-bold text-gray-900 text-sm">{cleanRole}</p>
                                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                        <span className="text-gray-700 font-semibold">{job.company}</span>
                                        {job.location && ` · ${job.location}`}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                      <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md hover:bg-amber-100 transition-colors">
                                        Ứng tuyển ↗
                                      </span>
                                    </div>
                                  </a>
                                );
                              })}
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
          <div className="bg-white rounded-2xl shadow-2xl border border-border w-80 flex flex-col overflow-hidden" style={{ height: 460 }}>
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
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === "user" ? "bg-amber-500 text-white rounded-br-sm" : "bg-white text-gray-800 border border-border shadow-sm rounded-bl-sm"}`}>
                    {msg.text}
                  </div>
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

            {messages.length <= 1 && !isTyping && (
              <div className="px-3 pt-2 pb-1 bg-gray-50 flex flex-col gap-1.5 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium pl-1">Gợi ý cho bạn:</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1">
                  {["Làm sao để chọn đúng ngành?", "Xu hướng nghề nghiệp 2026 là gì?"].map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(question);
                        setTimeout(() => sendMessage(), 50);
                      }}
                      className="text-left text-[11px] text-amber-700 bg-amber-50/70 border border-amber-200/60 rounded-lg px-2 py-1 hover:bg-amber-50 hover:border-amber-400 transition-all active:scale-95 whitespace-normal"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {remainingTokens !== null && (
              <Box sx={{ px: 2, pt: 1, pb: 0, bgcolor: "white" }}>
                <Typography variant="caption" color="text.secondary">Token còn lại: {remainingTokens}</Typography>
              </Box>
            )}

            <div className="p-3 bg-white border-t border-border flex items-center gap-2">
              <input
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} disabled={isTyping || (remainingTokens !== null && remainingTokens <= 0)}
                placeholder="Hỏi AI tư vấn..." className="flex-1 text-xs px-3 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50"
              />
              <button
                onClick={sendMessage} disabled={!input.trim() || isTyping || (remainingTokens !== null && remainingTokens <= 0)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${(!input.trim() || isTyping || (remainingTokens !== null && remainingTokens <= 0)) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white"}`}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-amber-500 hover:bg-amber-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-white"
        >
          {chatOpen ? <X className="h-6 w-6" /> : <Chat />}
        </button>
      </div>
    </div>
  );
}