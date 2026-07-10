import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import {
  Menu,
  Close as X,
  Dashboard as LayoutDashboard,
  Visibility as Eye,
  VisibilityOff as EyeOff,
  Mail,
  Lock,
  Person as User,
} from "@mui/icons-material";
import { AuthUser } from "../App";
import { amber } from "@mui/material/colors";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface NavigationProps {
  onStartAssessment: () => void;
  isLoggedIn: boolean;
  onDashboard: () => void;
  onDirectLogin: (user: AuthUser) => void;
}

function AuthModal({
  onLogin,
  onClose,
}: {
  onLogin: (u: AuthUser) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPw2, setRegPw2] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPw) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!loginEmail.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }

    setError("");

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginEmail,
          password: loginPw,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      const user: AuthUser = {
        id: data.user.id,
        name: data.profile?.fullName || data.user.email,
        email: data.user.email,
        role: data.user.role,
        isActive: data.user.isActive,
        profile: data.profile,
      };

      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);

      onClose();
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối server");
    }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPw || !regPw2) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!regEmail.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }

    if (regPw.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự");
      return;
    }

    if (regPw !== regPw2) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: regEmail,
          password: regPw,
          fullName: regName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message);
        return;
      }

      // tự động login
      const loginRes = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regEmail,
          password: regPw,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginData.success) {
        setTab("login");
        setError("Đăng ký thành công. Vui lòng đăng nhập.");
        return;
      }

      const user: AuthUser = {
        id: loginData.user.id,
        name: loginData.profile?.fullName || loginData.user.email,
        email: loginData.user.email,
        role: loginData.user.role,
        isActive: loginData.user.isActive,
        profile: loginData.profile,
      };

      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);

      onClose();
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối server");
    }
  };
  return (
    <Box>
      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => { setTab(newValue); setError(""); }}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab value="login" label="Đăng nhập" />

        <Tab value="register" label="Đăng ký" />
      </Tabs>

      {tab === "login" ? (
        <Stack spacing={2}>
          <p>Chào mừng bạn đã quay trở lại!</p>
          <TextField
            label="Email của bạn"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            InputProps={{ startAdornment: <InputAdornment position="start"><Mail fontSize="small" /></InputAdornment> }}
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
                    {showPw ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button fullWidth variant="contained" onClick={handleLogin} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
            Đăng nhập
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <TextField label="Họ và tên" value={regName} onChange={(e) => setRegName(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><User fontSize="small" /></InputAdornment> }} />
          <TextField label="Email của bạn" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Mail fontSize="small" /></InputAdornment> }} />
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
                    {showPw ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField label="Xác nhận mật khẩu" type={showPw ? "text" : "password"} value={regPw2} onChange={(e) => setRegPw2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRegister()} InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> 
              , endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                    {showPw ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
              }} />
          {error && <Alert severity="error">{error}</Alert>}
          <Button fullWidth variant="contained" onClick={handleRegister} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
            Đăng ký
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export function Navigation({
  onStartAssessment,
  isLoggedIn,
  onDashboard,
  onDirectLogin,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: { xs: 1, md: 0 } }}>
            <Box sx={{ width: 32, height: 32, bgcolor: '#f59e0b', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold' }}>CP</Typography>
            </Box>
            <Typography variant="h6" noWrap component="a" href="/" sx={{ fontWeight: 'bold', color: 'text.primary', textDecoration: 'none' }}>
              Career{" "}
              <Box component="span" sx={{ color: '#f59e0b' }}>Pathway</Box>
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }}>
            {["Trang chủ", "Tính năng", "Tư vấn nhanh", "Khám phá"].map((page) => (
              <Button
                key={page}
                href={`#${page === 'Trang chủ' ? 'home' : page === 'Tính năng' ? 'features' : page === 'Tư vấn nhanh' ? 'quickcareer' : 'assessment'}`}
                sx={{ color: 'text.secondary', '&:hover': { color: amber[500] } }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {isLoggedIn ? (
              <Button variant="contained" onClick={onDashboard} startIcon={<LayoutDashboard />} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                  sx={{ color: 'text.secondary', borderColor: 'grey.300', '&:hover': { bgcolor: amber[50], borderColor: amber[300], color: amber[700] } }}
                >
                  Đăng nhập</Button>
                <Button variant="contained" onClick={onStartAssessment} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
                  Bắt đầu ngay
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton size="large" onClick={() => setIsOpen(!isOpen)} color="inherit">
              {isOpen ? <X /> : <Menu />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ display: { xs: 'block', md: 'none' }, borderTop: 1, borderColor: 'divider', py: 2 }}>
          <Stack spacing={1} sx={{ px: 2 }}>
            {["Trang chủ", "Tính năng", "Tư vấn nhanh", "Khám phá"].map((page) => (
              <Button
                key={page}
                href={`#${page === 'Trang chủ' ? 'home' : page === 'Tính năng' ? 'features' : page === 'Tư vấn nhanh' ? 'quickcareer' : 'assessment'}`}
                onClick={() => setIsOpen(false)}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                {page}
              </Button>
            ))}
            <Divider />
            {!isLoggedIn && (
              <Button onClick={() => { setDialogOpen(true); setIsOpen(false); }} sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                Đăng nhập
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => {
                setIsOpen(false);
                isLoggedIn ? onDashboard() : onStartAssessment();
              }}
              sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}
            >
              {isLoggedIn ? "Dashboard" : "Bắt đầu ngay"}
            </Button>
          </Stack>
        </Box>
      </Collapse>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 28, height: 28, bgcolor: '#f59e0b', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>CP</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Career Pathway</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <AuthModal onLogin={onDirectLogin} onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}