import { useState, useEffect } from "react";
import {
  Add,
  Delete,
  Edit,
  MonetizationOn,
  Search,
  TrendingUp,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Snackbar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "../services/api";

interface DuLieuThiTruong {
  maDL: string;
  maNghe: string; 
  tenNghe: string;
  loai: "Luong"  | "CoHoi";
  tieuDe: string;
  giaTri: string;
  metaData: string;
  ngayCapNhat: string;
}

interface Career {
  id: string;
  tenNghe: string;
}

const initialFormState = {
  maNghe: "",
  loai: "Luong" as "Luong" | "CoHoi",
  tieuDe: "",
  giaTri: "",
  metaData: "{}",
};

const orange = "#f59e0b";
const orangeDark = "#d97706";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function MarketDataPage() {
  const [data, setData] = useState<DuLieuThiTruong[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "Luong"  | "CoHoi">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<DuLieuThiTruong | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  
  // State quản lý lỗi hiển thị
  const [maNgheError, setMaNgheError] = useState<string | null>(null);
  const [tieuDeError, setTieuDeError] = useState<string | null>(null);
  const [giaTriError, setGiaTriError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const res = await apiRequest("/admin/market-data");
      if (res.success) {
        setData(res.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const refreshCareers = async () => {
    try {
      const res = await apiRequest("/admin/careers");
      if (res.success) {
        setCareers(res.careers || []);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách nghề nghiệp:", e);
    }
  };

  useEffect(() => {
    refreshData();
    refreshCareers();
  }, []);

  // Tự động cập nhật tiêu đề dựa trên loại dữ liệu và nghề nghiệp được chọn
  useEffect(() => {
    if (formData.maNghe && !editingData) {
      const selectedCareer = careers.find((c) => c.id === formData.maNghe);
      if (selectedCareer) {
        if (formData.loai === "Luong") {
          setFormData((prev) => ({ ...prev, tieuDe: selectedCareer.tenNghe }));
          setTieuDeError(null);
        } else {
          setFormData((prev) => ({ ...prev, tieuDe: "" }));
        }
      }
    }
  }, [formData.maNghe, formData.loai, careers, editingData]);

  // --- LOGIC XỬ LÝ LỌC TRÙNG LẶP DỮ LIỆU (GROUP BY) TRƯỚC KHI HIỂN THỊ ---
  const uniqueDataMap = new Map<string, DuLieuThiTruong>();
  data.forEach((item) => {
    const uniqueKey = `${item.maNghe}_${item.loai}_${(item.tieuDe || "").toLowerCase().trim()}`;
    if (!uniqueDataMap.has(uniqueKey)) {
      uniqueDataMap.set(uniqueKey, item);
    }
  });
  const uniqueMarketData = Array.from(uniqueDataMap.values());

  // Tìm kiếm và phân tab
  const filteredData = uniqueMarketData.filter((item) => {
    const matchesSearch =
      (item.maNghe || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tieuDe || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.giaTri || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || item.loai === activeTab;

    return matchesSearch && matchesTab;
  });

  // Validation function chuẩn xác
  const validateForm = () => {
    let isValid = true;

    if (!formData.maNghe.trim()) {
      setMaNgheError("Mã nghề không được để trống.");
      isValid = false;
    } else {
      setMaNgheError(null);
    }

    if (!formData.tieuDe.trim()) {
      setTieuDeError("Tiêu đề không được để trống.");
      isValid = false;
    } else if (formData.tieuDe.trim().length > 255) {
      setTieuDeError("Tiêu đề không được vượt quá 255 ký tự.");
      isValid = false;
    } else {
      const isDuplicate = uniqueMarketData.some(
        (item) =>
          item.maNghe === formData.maNghe &&
          item.loai === formData.loai &&
          item.tieuDe.toLowerCase() === formData.tieuDe.trim().toLowerCase() &&
          (editingData ? item.maDL !== editingData.maDL : true)
      );
      if (isDuplicate) {
        setTieuDeError("Dữ liệu thị trường này đã tồn tại.");
        isValid = false;
      } else {
        setTieuDeError(null);
      }
    }

    if (!formData.giaTri.trim()) {
      setGiaTriError("Giá trị hiển thị không được để trống.");
      isValid = false;
    } else if (formData.giaTri.trim().length > 100) {
      setGiaTriError("Giá trị hiển thị không được vượt quá 100 ký tự.");
      isValid = false;
    } else {
      setGiaTriError(null);
    }

    return isValid;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      setNotification({ open: true, message: 'Vui lòng kiểm tra lại các trường thông tin.', severity: 'error' });
      return;
    }
    try {
      await apiRequest("/admin/market-data", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      await refreshData();
      setIsAddDialogOpen(false);
      setFormData(initialFormState);
      setMaNgheError(null);
      setTieuDeError(null);
      setGiaTriError(null);
      setNotification({ open: true, message: 'Thêm dữ liệu thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Thêm dữ liệu thất bại!', severity: 'error' });
    }
  };

  const handleEdit = (item: DuLieuThiTruong) => {
    setEditingData(item);
    setFormData({
      maNghe: item.maNghe,
      loai: item.loai,
      tieuDe: item.tieuDe,
      giaTri: item.giaTri,
      metaData: item.metaData,
    });
    setMaNgheError(null);
    setTieuDeError(null);
    setGiaTriError(null);
  };

  const handleUpdate = async () => {
    if (!editingData) return;
    if (!validateForm()) {
      setNotification({ open: true, message: 'Vui lòng kiểm tra lại các trường thông tin.', severity: 'error' });
      return;
    }
    try {
      await apiRequest(`/admin/market-data/${editingData.maDL}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      await refreshData();
      setEditingData(null);
      setFormData(initialFormState);
      setMaNgheError(null);
      setTieuDeError(null);
      setGiaTriError(null);
      setNotification({ open: true, message: 'Cập nhật dữ liệu thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Cập nhật dữ liệu thất bại!', severity: 'error' });
    }
  };

  const handleDelete = async (maDL: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")) {
      try {
        await apiRequest(`/admin/market-data/${maDL}`, {
          method: "DELETE"
        });
        await refreshData();
        setNotification({ open: true, message: 'Xóa dữ liệu thành công!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setNotification({ open: true, message: 'Xóa dữ liệu thất bại!', severity: 'error' });
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Luong":
        return <MonetizationOn sx={{ fontSize: 16 }} />;
      case "CoHoi":
        return <TrendingUp sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Luong":
        return "Mức lương";
      case "CoHoi":
        return "Cơ hội";
      default:
        return type;
    }
  };

  const getTypeChipColor = (type: string) => {
    switch (type) {
      case "Luong":
        return { bgcolor: "#dcfce7", color: "#15803d" };
      case "CoHoi":
        return { bgcolor: "#e0f2fe", color: "#0369a1" };
      default:
        return { bgcolor: "#f3f4f6", color: textMuted };
    }
  };

  // 🌟 FIX CHÍNH: Sửa logic check form valid để nút Thêm sáng lên đúng lúc
  const isFormValid = formData.maNghe.trim() && formData.tieuDe.trim() && formData.giaTri.trim() && !maNgheError && !tieuDeError && !giaTriError;

  const renderFormFields = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mt: 1.5 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <FormControl fullWidth size="small" sx={inputSx} error={!!maNgheError}>
          <InputLabel>Nghề nghiệp</InputLabel>
          <Select
            label="Nghề nghiệp"
            value={formData.maNghe}
            onChange={(e) => {
              setFormData({ ...formData, maNghe: e.target.value });
              if (!e.target.value.trim()) setMaNgheError("Mã nghề không được để trống.");
              else setMaNgheError(null);
            }}
          >
            {careers.map((career) => (
              <MenuItem key={career.id} value={career.id}>
                {career.tenNghe}
              </MenuItem>
            ))}
          </Select>
          {maNgheError && <FormHelperText>{maNgheError}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth size="small" sx={inputSx}>
          <InputLabel>Loại dữ liệu</InputLabel>
          <Select
            label="Loại dữ liệu"
            value={formData.loai}
            onChange={(e) => setFormData({ ...formData, loai: e.target.value as "Luong" | "CoHoi" })}
          >
            <MenuItem value="Luong">Mức lương</MenuItem>
            <MenuItem value="CoHoi">Cơ hội</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Tiêu đề"
        placeholder={formData.loai === 'CoHoi' ? "Nhập tên công ty hoặc tiêu đề cơ hội" : "Tên nghề (tự động)"}
        value={formData.tieuDe}
        onChange={(e) => {
          setFormData({ ...formData, tieuDe: e.target.value });
          const value = e.target.value.trim();
          if (!value) setTieuDeError("Tiêu đề không được để trống.");
          else if (value.length > 255) setTieuDeError("Tiêu đề không được vượt quá 255 ký tự.");
          else if (uniqueMarketData.some(
            (item) =>
              item.maNghe === formData.maNghe &&
              item.loai === formData.loai &&
              item.tieuDe.toLowerCase() === value.toLowerCase() &&
              (editingData ? item.maDL !== editingData.maDL : true)
          )) {
            setTieuDeError("Dữ liệu thị trường này đã tồn tại.");
          } else setTieuDeError(null);
        }}
        error={!!tieuDeError}
        helperText={tieuDeError}
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Giá trị hiển thị"
        placeholder="VD: 8 - 18 Triệu"
        value={formData.giaTri}
        onChange={(e) => {
          setFormData({ ...formData, giaTri: e.target.value });
          const value = e.target.value.trim();
          if (!value) setGiaTriError("Giá trị hiển thị không được để trống.");
          else if (value.length > 100) setGiaTriError("Giá trị hiển thị không được vượt quá 100 ký tự.");
          else setGiaTriError(null);
        }}
        error={!!giaTriError}
        helperText={giaTriError}
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Dữ liệu logic MetaData JSON"
        placeholder='VD: {"min": 8000000, "max": 18000000}'
        value={formData.metaData}
        onChange={(e) => setFormData({ ...formData, metaData: e.target.value })}
        sx={inputSx}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1 }}>
        {([ "Luong", "CoHoi"] as const).map((type) => {
          const active = formData.loai === type;
          return (
            <Button
              key={type}
              type="button"
              variant={active ? "contained" : "outlined"}
              startIcon={getTypeIcon(type)}
              onClick={() => setFormData({ ...formData, loai: type })}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 700,
                boxShadow: "none",
                borderColor: active ? orange : borderColor,
                bgcolor: active ? orange : "#fff",
                color: active ? "#fff" : textMain,
                py: 0.8,
                "&:hover": {
                  bgcolor: active ? orangeDark : orangeLight,
                  borderColor: orange,
                  boxShadow: "none",
                },
              }}
            >
              {getTypeLabel(type)}
            </Button>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box", px: { xs: 1, sm: 2 } }}>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3, display: "flex", alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
        <Box>
          <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, color: textMain, letterSpacing: "-0.03em" }}>
            Quản lý Dữ liệu Thị trường
          </Typography>
          <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 14 }}>
            Quản lý thông tin mức lương và cơ hội việc làm theo ngành nghề
          </Typography>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<Add sx={{ fontSize: 18 }} />}
          onClick={() => { setFormData(initialFormState); setIsAddDialogOpen(true); }}
          sx={{
            bgcolor: orange,
            color: "#fff",
            borderRadius: "10px",
            px: 2,
            py: 1,
            fontSize: 14,
            textTransform: "none",
            fontWeight: 700,
            minHeight: 38,
            boxShadow: "none",
            alignSelf: { xs: "flex-start", md: "auto" },
            "&:hover": { bgcolor: orangeDark, boxShadow: "none" },
          }}
        >
          Thêm dữ liệu
        </Button>
      </Box>

      {/* Tra cứu */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff", mb: 3, maxWidth: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>Tra cứu dữ liệu</Typography>
          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>Tìm kiếm theo mã nghề, tiêu đề hoặc giá trị</Typography>
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
            sx={inputSx}
          />
        </CardContent>
      </Card>

      {/* Bảng Danh sách */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff", maxWidth: "100%", width: "100%" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, width: "100%", boxSizing: "border-box" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain, mb: 2 }}>
            Danh sách dữ liệu ({filteredData.length})
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              minHeight: 38,
              "& .MuiTabs-indicator": { bgcolor: orange },
              "& .MuiTab-root": { textTransform: "none", minHeight: 38, fontWeight: 700, color: textMuted },
              "& .Mui-selected": { color: `${orange} !important` },
            }}
          >
            <Tab value="all" label="Tất cả" />
            <Tab value="Luong" label="Mức lương" />
            <Tab value="CoHoi" label="Cơ hội" />
          </Tabs>

          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "14px", overflowX: "auto", width: "100%" }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={thSx} style={{ width: "110px" }}>Mã nghề</TableCell>
                  <TableCell sx={thSx} style={{ width: "130px" }}>Loại</TableCell>
                  <TableCell sx={thSx} style={{ width: "auto" }}>Tiêu đề</TableCell>
                  <TableCell sx={thSx} style={{ width: "180px" }}>Giá trị</TableCell>
                  <TableCell sx={thSx} style={{ width: "130px" }}>Cập nhật</TableCell>
                  <TableCell sx={thSx} style={{ width: "80px" }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.maDL} hover sx={{ "& td": { borderBottom: `1px solid ${borderColor}` }, "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain }}>
                        {item.maNghe}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Chip
                        icon={getTypeIcon(item.loai) as React.ReactElement}
                        label={getTypeLabel(item.loai)}
                        size="small"
                        sx={{
                          ...getTypeChipColor(item.loai),
                          fontWeight: 700,
                          minWidth: "105px",
                          "& .MuiChip-icon": { color: "inherit" },
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography sx={{ fontSize: 14, color: textMain, fontWeight: 600, whiteSpace: "normal", wordBreak: "break-word" }}>
                        {item.tieuDe}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      {item.loai === "Luong" ? (
                        <Chip
                          label={item.giaTri}
                          size="small"
                          sx={{
                            bgcolor: "#e2f8ec",
                            color: "#15803d",
                            fontWeight: 700,
                            maxWidth: "100%",
                            height: "auto",
                            "& .MuiChip-label": { whiteSpace: "normal", display: "block", py: 0.5, textAlign: "center" },
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: 14, color: textMain, whiteSpace: "normal", wordBreak: "break-word" }}>
                          {item.giaTri}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: textMuted, whiteSpace: "nowrap" }}>
                          {item.ngayCapNhat ? new Date(item.ngayCapNhat).toLocaleDateString("vi-VN") : "—"}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      <Stack direction="row" spacing={0.2} justifyContent="flex-end">
                        <Button variant="text" size="small" onClick={() => handleEdit(item)} sx={{ minWidth: 32, p: 0.5, color: orange }}>
                          <Edit sx={{ fontSize: 18 }} />
                        </Button>
                        <Button variant="text" size="small" onClick={() => handleDelete(item.maDL)} sx={{ minWidth: 32, p: 0.5, color: "#dc2626" }}>
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog Thêm */}
      <Dialog open={isAddDialogOpen} onClose={() => { setIsAddDialogOpen(false); setFormData(initialFormState); setMaNgheError(null); setTieuDeError(null); setGiaTriError(null); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>Thêm dữ liệu thị trường</DialogTitle>
        <DialogContent>{renderFormFields()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setIsAddDialogOpen(false); setFormData(initialFormState); setMaNgheError(null); setTieuDeError(null); setGiaTriError(null); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!isFormValid} sx={primaryButtonSx}>Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sửa */}
      <Dialog open={!!editingData} onClose={() => { setEditingData(null); setFormData(initialFormState); setMaNgheError(null); setTieuDeError(null); setGiaTriError(null); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>Cập nhật dữ liệu thị trường</DialogTitle>
        <DialogContent>{renderFormFields()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setEditingData(null); setFormData(initialFormState); setMaNgheError(null); setTieuDeError(null); setGiaTriError(null); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={!isFormValid} sx={primaryButtonSx}>Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const thSx = {
  fontSize: 13,
  fontWeight: 700,
  color: "#4b5563",
  whiteSpace: "nowrap",
  borderBottom: `1px solid ${borderColor}`,
};

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

const primaryButtonSx = {
  bgcolor: orange,
  textTransform: "none",
  borderRadius: "10px",
  fontWeight: 700,
  boxShadow: "none",
  "&:hover": { bgcolor: orangeDark, boxShadow: "none" },
};

const cancelButtonSx = {
  textTransform: "none",
  borderRadius: "10px",
  fontWeight: 700,
  borderColor,
  color: textMain,
};