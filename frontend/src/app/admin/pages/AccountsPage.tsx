import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Lock,
  LockOpen,
  Edit,
} from "@mui/icons-material";

interface Account {
  id: string;
  tenDangNhap: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  vaiTro: string;
  trangThai: 1 | 0;
  ngayTao: string;
  token: number;
}

const orange = "#f59e0b";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

const initialFormState: Partial<Account> = {
  hoTen: "",
  email: "",
  vaiTro: "User",
  token: 0,
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<Partial<Account>>(initialFormState);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Validation states
  const [hoTenError, setHoTenError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest("/admin/accounts")
      .then(res => {
        if (res.success) {
          setAccounts(res.accounts || []);
        }
      })
      .catch(err => console.error("Fetch accounts error:", err));
  }, []);

  const refreshAccounts = async () => {
    try {
      const res = await apiRequest("/admin/accounts");
      if (res.success) {
        setAccounts(res.accounts || []);
      }
    } catch (e) {
      console.error("Refresh accounts error:", e);
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      (account.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.tenDangNhap || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.soDienThoai || "").includes(searchTerm)
  );

  const validateForm = () => {
    let isValid = true;

    if (!formData.hoTen || !formData.hoTen.trim()) {
      setHoTenError("Họ tên không được để trống.");
      isValid = false;
    } else if (formData.hoTen.trim().length > 255) {
      setHoTenError("Họ tên không được vượt quá 255 ký tự.");
      isValid = false;
    } else {
      setHoTenError(null);
    }

    if (!formData.email || !formData.email.trim()) {
      setEmailError("Email không được để trống.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (formData.token === undefined || formData.token < 0) {
      setTokenError("Token phải là số không âm.");
      isValid = false;
    } else {
      setTokenError(null);
    }

    return isValid;
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      hoTen: account.hoTen,
      email: account.email,
      vaiTro: account.vaiTro,
      token: account.token,
    });
    setHoTenError(null);
    setEmailError(null);
    setTokenError(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAccount || !validateForm()) {
      setNotification({ open: true, message: 'Vui lòng kiểm tra lại các trường thông tin.', severity: 'error' });
      return;
    }
    try {
      await apiRequest(`/admin/accounts/${editingAccount.id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      await refreshAccounts();
      setIsEditDialogOpen(false);
      setEditingAccount(null);
      setFormData(initialFormState);
      setNotification({ open: true, message: 'Cập nhật tài khoản thành công!', severity: 'success' });
    } catch (err) {
      console.error("Update account error:", err);
      setNotification({ open: true, message: 'Cập nhật tài khoản thất bại!', severity: 'error' });
    }
  };

  const toggleAccountStatus = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;
    const newStatus = account.trangThai === 1 ? 0 : 1;
    try {
      const res = await apiRequest(`/admin/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ trangThai: newStatus })
      });
      if (res.success) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === id ? { ...acc, trangThai: newStatus } : acc
          )
        );
        setNotification({ open: true, message: `Tài khoản ${account.hoTen} đã ${newStatus === 1 ? 'mở khóa' : 'khóa'}!`, severity: 'success' });
      }
    } catch (err) {
      console.error("Toggle account status error:", err);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const isFormValid = !hoTenError && !emailError && !tokenError && 
                     (formData.hoTen && formData.hoTen.trim() !== "") &&
                     (formData.email && formData.email.trim() !== "") &&
                     (formData.token !== undefined && formData.token >= 0);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "US";
  };

  const stats = [
    { label: "Tổng tài khoản", value: accounts.length },
    { label: "Đang hoạt động", value: accounts.filter((a) => a.trangThai === 1).length },
    { label: "Đã khóa", value: accounts.filter((a) => a.trangThai === 0).length },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: textMain, letterSpacing: "-0.03em" }}>
          Quản lý Tài khoản
        </Typography>
        <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
          Quản lý tài khoản người dùng trong hệ thống
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        {stats.map((stat, index) => (
          <Card key={stat.label} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: textMuted, mb: 1.5 }}>
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: index === 1 ? "#16a34a" : index === 2 ? "#dc2626" : textMain,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tìm kiếm */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain, mb: 0.5 }}>
            Tra cứu tài khoản
          </Typography>
          <Typography sx={{ fontSize: 14, color: textMuted, mb: 2 }}>
            Tìm kiếm theo họ tên, email 
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#fff",
                "& fieldset": { borderColor },
                "&:hover fieldset": { borderColor: orange },
                "&.Mui-focused fieldset": { borderColor: orange, borderWidth: "1px" },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Danh sách bảng chính */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, width: "100%", boxSizing: "border-box" }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: textMain, mb: 2 }}>
            Danh sách tài khoản ({filteredAccounts.length})
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "14px", overflowX: "auto", width: "100%" }}>
            {/* Đặt minWidth tối ưu về 750px để tự co giãn khít khung màn hình ngang */}
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={thSx} style={{ width: "90px" }}>Avatar</TableCell>
                  <TableCell sx={thSx} style={{ width: "140px" }}>Ngày tạo</TableCell>
                  <TableCell sx={thSx} style={{ width: "160px" }}>Họ tên</TableCell>
                  <TableCell sx={thSx} style={{ width: "auto" }}>Email liên hệ</TableCell>
                  <TableCell sx={thSx} style={{ width: "100px" }}>Vai trò</TableCell>
                  <TableCell sx={thSx} style={{ width: "120px" }}>Trạng thái</TableCell>
                  <TableCell sx={thSx} style={{ width: "90px" }}>Token</TableCell>
                  <TableCell sx={thSx} style={{ width: "140px" }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id} hover sx={{ "& td": { borderBottom: `1px solid ${borderColor}` }, "&:last-child td": { borderBottom: 0 } }}>
                    {/* Avatar */}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: orange, color: "#fff", fontSize: 13, fontWeight: 700 }}>
                        {getInitials(account.hoTen)}
                      </Avatar>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: textMuted, whiteSpace: "nowrap" }}>
                          {account.ngayTao ? new Date(account.ngayTao).toLocaleDateString("vi-VN") : "—"}
                      </Typography>
                    </TableCell>

                    {/* Họ tên & Username */}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain, wordBreak: "break-word" }}>
                        {account.hoTen || "—"}
                      </Typography>
                    </TableCell>

                    {/* Email */}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Typography sx={{ fontSize: 14, color: textMain, whiteSpace: "normal", wordBreak: "break-all" }}>
                        {account.email || "Chưa cập nhật"}
                      </Typography>
                    </TableCell>

                    {/* Vai trò */}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Chip
                        label={account.vaiTro}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: borderColor, color: "#374151", fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Trạng thái công khai sạch đẹp */}
                    <TableCell sx={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      <Chip
                        label={account.trangThai === 1 ? "Hoạt động" : "Đã khóa"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: account.trangThai === 1 ? "#dcfce7" : "#fee2e2",
                          color: account.trangThai === 1 ? "#15803d" : "#b91c1c",
                          minWidth: "85px"
                        }}
                      />
                    </TableCell>

                    {/* Token */}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Chip
                        label={account.token}
                        size="small"
                        sx={{ fontWeight: 700, bgcolor: orangeLight, color: "#92400e" }}
                      />
                    </TableCell>

                    {/* Hành động Thao tác */}
                    <TableCell align="right" sx={{ verticalAlign: "middle" }}>
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        justifyContent="flex-end" 
                        alignItems="center" 
                      >
                        {/* Nút Sửa */}
                        <Button 
                          variant="text" 
                          size="small" 
                          onClick={() => handleEdit(account)} 
                          sx={{ 
                            minWidth: 36, 
                            height: 32, // Đồng bộ chiều cao với nút kế bên
                            p: 0, 
                            color: orange, 
                            borderRadius: "8px",
                            "&:hover": { bgcolor: orangeLight } 
                          }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </Button>

                        {/* Nút Khóa / Mở khóa */}
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => toggleAccountStatus(account.id)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            height: 32, 
                            px: 1.5, 
                            borderRadius: "8px",
                            color: account.trangThai === 1 ? "#dc2626" : "#16a34a",
                            "&:hover": { 
                              bgcolor: account.trangThai === 1 ? "#fee2e2" : "#dcfce7" 
                            },
                          }}
                        >
                          {account.trangThai === 1 ? "Khóa" : "Mở khóa"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredAccounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>Không tìm thấy tài khoản phù hợp</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => { setIsEditDialogOpen(false); setEditingAccount(null); setFormData(initialFormState); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>Cập nhật tài khoản</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Họ tên"
              value={formData.hoTen || ''}
              onChange={(e) => {
                setFormData({ ...formData, hoTen: e.target.value });
                if (!e.target.value.trim()) setHoTenError("Họ tên không được để trống.");
                else if (e.target.value.trim().length > 255) setHoTenError("Họ tên không được vượt quá 255 ký tự.");
                else setHoTenError(null);
              }}
              error={!!hoTenError}
              helperText={hoTenError}
              sx={inputSx}
            />
            <TextField
              fullWidth
              size="small"
              label="Email"
              value={formData.email || ''}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (!e.target.value.trim()) setEmailError("Email không được để trống.");
                else if (!/\S+@\S+\.\S+/.test(e.target.value.trim())) setEmailError("Email không hợp lệ.");
                else setEmailError(null);
              }}
              error={!!emailError}
              helperText={emailError}
              sx={inputSx}
            />
            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                label="Vai trò"
                value={formData.vaiTro || 'User'}
                onChange={(e) => setFormData({ ...formData, vaiTro: e.target.value as string })}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Token"
              type="number"
              value={formData.token ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setFormData({ ...formData, token: isNaN(val) ? 0 : val });
                if (!isNaN(val) && val < 0) setTokenError("Token phải là số không âm.");
                else setTokenError(null);
              }}
              error={!!tokenError}
              helperText={tokenError}
              sx={inputSx}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setIsEditDialogOpen(false); setEditingAccount(null); setFormData(initialFormState); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={!isFormValid} sx={primaryButtonSx}>Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const thSx = { fontSize: 13, fontWeight: 700, color: "#4b5563", whiteSpace: "nowrap", borderBottom: `1px solid ${borderColor}` };
const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    bgcolor: "#fff",
    "& fieldset": { borderColor },
    "&:hover fieldset": { borderColor: orange },
    "&.Mui-focused fieldset": { borderColor: orange, borderWidth: "1px" },
  },
  "& .MuiInputBase-input": { padding: "8px 12px", fontSize: 14 },
  "& .MuiSelect-select": { padding: "8px 12px", fontSize: 14 },
  "& .MuiInputLabel-root": { fontSize: 14, top: "-6px" },
  "& .MuiInputLabel-shrink": { top: 0 },
};
const primaryButtonSx = { bgcolor: orange, textTransform: "none", borderRadius: "10px", fontWeight: 700, boxShadow: "none", "&:hover": { bgcolor: orange, boxShadow: "none" } };
const cancelButtonSx = { textTransform: "none", borderRadius: "10px", fontWeight: 700, borderColor, color: textMain };