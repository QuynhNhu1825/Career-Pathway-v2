import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Lock, Visibility,VisibilityOff } from "@mui/icons-material";

const orange = "#f59e0b";
const orangeDark = "#d97706";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (success) {
      window.location.reload();
    } else {
      setError("Email hoặc mật khẩu không đúng."); // This will be the default if loginAdmin returns null
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "linear-gradient(135deg, #fffbeb 0%, #f9fafb 45%, #ffffff 100%)",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "22px",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.10)",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              variant="rounded"
              sx={{
                mx: "auto",
                width: 52,
                height: 52,
                bgcolor: orange,
                borderRadius: "14px",
                mb: 2,
              }}
            >
              <Lock sx={{ color: "#fff", fontSize: 28 }} />
            </Avatar>

            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
                color: textMain,
                letterSpacing: 0,
                lineHeight: 1.3,
                fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
              }}
            >
              Đăng nhập Admin
            </Typography>

            <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.8 }}>
              Nhập thông tin đăng nhập để truy cập hệ thống
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Email</Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={inputSx}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Mật khẩu</Typography>
              <TextField
                fullWidth
                size="small"
                // Đổi type linh hoạt dựa trên state showPassword
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={inputSx}
                // Tích hợp con mắt vào phía cuối ô input
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: textMuted }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: "10px",
                  fontSize: 14,
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                height: 42,
                bgcolor: orange,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: orangeDark,
                  boxShadow: "none",
                },
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

const labelSx = {
  fontSize: 14,
  fontWeight: 700,
  color: textMain,
  mb: 0.8,
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    bgcolor: "#fff",

    "& fieldset": {
      borderColor,
    },

    "&:hover fieldset": {
      borderColor: orange,
    },

    "&.Mui-focused fieldset": {
      borderColor: orange,
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    padding: "8px 12px",
    fontSize: 14,
  },
};