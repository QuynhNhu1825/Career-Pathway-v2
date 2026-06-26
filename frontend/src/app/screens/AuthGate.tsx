import { useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowLeft, Lock, Mail, Person as User,   AutoAwesome, Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthUser } from "../App";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

interface AuthGateProps {
  onLogin: (user: AuthUser) => void;
  onBack: () => void;
}

export function AuthGate({ onLogin, onBack }: AuthGateProps) {
  const [tab, setTab] = useState<string>("login");
  const [showPw, setShowPw] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPw2, setRegPw2] = useState("");
  const [regError, setRegError] = useState("");

  const handleLogin = () => {
    if (!loginEmail || !loginPw) {
      setLoginError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!loginEmail.includes("@")) {
      setLoginError("Email không hợp lệ");
      return;
    }
    setLoginError("");
    const name = loginEmail.split("@")[0].replace(/[._]/g, " ");
    onLogin({ name: name.charAt(0).toUpperCase() + name.slice(1), email: loginEmail });
  };

  const handleRegister = () => {
    if (!regName || !regEmail || !regPw || !regPw2) {
      setRegError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!regEmail.includes("@")) {
      setRegError("Email không hợp lệ");
      return;
    }
    if (regPw.length < 6) {
      setRegError("Mật khẩu cần ít nhất 6 ký tự");
      return;
    }
    if (regPw !== regPw2) {
      setRegError("Mật khẩu xác nhận không khớp");
      return;
    }
    setRegError("");
    onLogin({ name: regName, email: regEmail });
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f9fafb, #fef3c7)", display: "flex", flexDirection: "column", position: 'relative', overflow: 'hidden' }}>
      {/* Decorative elements */}
      <Box sx={{ position: 'absolute', top: '5rem', left: '5rem', width: '16rem', height: '16rem', bgcolor: 'rgba(245, 158, 11, 0.2)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '5rem', right: '5rem', width: '24rem', height: '24rem', bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <AppBar position="relative" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <Button startIcon={<ArrowLeft />} onClick={onBack} sx={{ color: "text.secondary", textTransform: "none" }}>
            Quay lại
          </Button>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Box sx={{ width: 28, height: 28, bgcolor: "#f59e0b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", mr: 1 }}>
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>CP</Typography>
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: 'text.primary' }}>
              Career <Box component="span" sx={{ color: "#f59e0b" }}>Pathway</Box>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" width="100%">
          {/* Announcement */}
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Chip
              icon={< AutoAwesome sx={{ fontSize: 16, color: '#fbbf24' }} />}
              label="Bài đánh giá đã hoàn thành!"
              variant="outlined"
              sx={{ 
                color: '#b45309', 
                borderColor: 'rgba(251, 191, 36, 0.4)', 
                bgcolor: 'rgba(254, 243, 199, 0.7)', 
                fontWeight: 600 
              }}
            />
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', fontFamily: 'serif' }}>
              Đăng nhập để xem kết quả
            </Typography>
            <Typography color="text.secondary">
              Kết quả phân tích chi tiết của bạn đang chờ. Đăng nhập hoặc tạo tài khoản để xem ngay.
            </Typography>
          </Stack>

          {/* Card */}
          <Paper elevation={2} sx={{ width: '100%', borderRadius: 4, overflow: 'hidden' }}>
            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab value="login" label="Đăng nhập" onClick={() => setLoginError("")} />
              <Tab value="register" label="Tạo tài khoản" onClick={() => setRegError("")} />
            </Tabs>

            <Box p={4}>
              {tab === "login" ? (
                <Stack spacing={2}>
                  <TextField
                  label="Email"
                  fullWidth
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                  <TextField
                    label="Mật khẩu"
                    type={showPw ? "text" : "password"}
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                            {showPw ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {loginError && <Alert severity="error" sx={{ mt: 1 }}>{loginError}</Alert>}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    sx={{ mt: 1, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}
                  >
                    Đăng nhập & xem kết quả
                  </Button>

                  <Divider sx={{ my: 2 }}>hoặc</Divider>

                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ borderColor: 'grey.300', color: 'text.primary', '&:hover': { bgcolor: 'grey.50' } }}
                      startIcon={<GoogleIcon />}
                    >
                      Google
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ borderColor: 'grey.300', color: 'text.primary', '&:hover': { bgcolor: 'grey.50' } }} startIcon={<FacebookIcon sx={{ color: '#1877F2' }} />}>Facebook</Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <TextField label="Họ và tên" value={regName} onChange={(e) => setRegName(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><User fontSize="small" /></InputAdornment> }} />
                  <TextField label="Email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Mail fontSize="small" /></InputAdornment> }} />
                  <TextField
                    label="Mật khẩu"
                    type={showPw ? "text" : "password"}
                    value={regPw}
                    onChange={(e) => setRegPw(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                            {showPw ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField label="Xác nhận mật khẩu" type="password" value={regPw2} onChange={(e) => setRegPw2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRegister()} InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }} />

                  {regError && <Alert severity="error" sx={{ mt: 1 }}>{regError}</Alert>}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleRegister}
                    sx={{ mt: 1, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}
                  >
                    Tạo tài khoản & xem kết quả
                  </Button>

                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <Box component="span" sx={{ color: 'warning.dark', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Điều khoản sử dụng</Box>{" "}
                    và{" "}
                    <Box component="span" sx={{ color: 'warning.dark', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Chính sách bảo mật</Box>
                  </Typography>
                </Stack>
              )}
            </Box>
          </Paper>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Thông tin của bạn được bảo mật tuyệt đối theo PDPA
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
