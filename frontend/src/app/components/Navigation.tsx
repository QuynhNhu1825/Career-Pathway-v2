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
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { AuthUser } from "../App";
import { amber } from "@mui/material/colors";

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

  const handleLogin = () => {
    if (!loginEmail || !loginPw) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!loginEmail.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }
    setError("");
    const name = loginEmail.split("@")[0].replace(/[._]/g, " ");
    onLogin({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: loginEmail,
    });
    onClose();
  };

  const handleRegister = () => {
    if (!regName || !regEmail || !regPw || !regPw2) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!regEmail.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }
    if (regPw.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự");
      return;
    }
    if (regPw !== regPw2) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");
    onLogin({ name: regName, email: regEmail });
    onClose();
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
        <Tab value="register" label="Tạo tài khoản" />
      </Tabs>

      {tab === "login" ? (
        <Stack spacing={2}>
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
          <Divider>hoặc</Divider>
          <Stack direction="row" spacing={2}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
              Google
            </Button>
            <Button fullWidth variant="outlined" startIcon={<FacebookIcon sx={{ color: '#1877F2' }} />}>
              Facebook
            </Button>
          </Stack>
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
          <TextField label="Xác nhận mật khẩu" type="password" value={regPw2} onChange={(e) => setRegPw2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRegister()} InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }} />
          {error && <Alert severity="error">{error}</Alert>}
          <Button fullWidth variant="contained" onClick={handleRegister} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
            Tạo tài khoản
          </Button>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Box component="span" sx={{ color: amber[600], cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Điều khoản sử dụng
            </Box>
          </Typography>
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
            {["Trang chủ", "Tính năng", "Quy trình", "Đánh giá"].map((page) => (
              <Button
                key={page}
                href={`#${page === 'Trang chủ' ? 'home' : page === 'Tính năng' ? 'features' : page === 'Quy trình' ? 'how-it-works' : 'testimonials'}`}
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
            {["Trang chủ", "Tính năng", "Quy trình", "Đánh giá"].map((page) => (
              <Button
                key={page}
                href={`#${page === 'Trang chủ' ? 'home' : page === 'Tính năng' ? 'features' : page === 'Quy trình' ? 'how-it-works' : 'testimonials'}`}
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