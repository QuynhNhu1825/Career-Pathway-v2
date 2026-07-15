import { useState, useEffect } from "react";
import { useCategories, type Category } from "../contexts/CategoriesContext";
import {
  Add,
  Delete,
  Edit,
  Search,
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Snackbar,
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

interface Career {
  id: string;
  tenNghe: string;
  categoryId: string;
  moTa: string;
  kyNangCanThiet: string;
  trangThai: number;
  ngayTao: string;
}

const orange = "#f59e0b";
const orangeDark = "#d97706";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function CareersPage() {
  const { categories } = useCategories();

  const [careers, setCareers] = useState<Career[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  const [formData, setFormData] = useState({
    tenNghe: "",
    categoryId: categories[0]?.id ?? "",
    moTa: "",
    kyNangCanThiet: "",
    trangThai: 1,
  });

  const refreshCareers = async () => {
    try {
      const res = await apiRequest("/admin/careers");
      if (res.success) {
        setCareers(res.careers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshCareers();
  }, []);

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.tenNganh ?? "—";

  const filtered = careers.filter((career) => {
    const catName = getCategoryName(career.categoryId).toLowerCase();

    const matchSearch =
      (career.tenNghe || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      catName.includes(searchTerm.toLowerCase());

    const matchCategory = filterCategoryId
      ? career.categoryId === filterCategoryId
      : true;

    const matchStatus =
      filterTrangThai !== ""
        ? career.trangThai === Number(filterTrangThai)
        : true;

    return matchSearch && matchCategory && matchStatus;
  });

  const resetForm = () => {
    setFormData({
      tenNghe: "",
      categoryId: categories[0]?.id ?? "",
      moTa: "",
      kyNangCanThiet: "",
      trangThai: 1
    });
  };

  const handleAdd = async () => {
    try {
      await apiRequest("/admin/careers", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      await refreshCareers();
      setIsAddOpen(false);
      resetForm();
      setNotification({ open: true, message: 'Thêm nghề nghiệp thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Thêm nghề nghiệp thất bại!', severity: 'error' });
    }
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      tenNghe: career.tenNghe,
      categoryId: career.categoryId,
      moTa: career.moTa,
      kyNangCanThiet: career.kyNangCanThiet,
      trangThai: career.trangThai,
    });
  };

  const handleUpdate = async () => {
    if (!editingCareer) return;
    try {
      await apiRequest(`/admin/careers/${editingCareer.id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      await refreshCareers();
      setEditingCareer(null);
      resetForm();
      setNotification({ open: true, message: 'Cập nhật nghề nghiệp thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Cập nhật nghề nghiệp thất bại!', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nghề nghiệp này?")) {
      try {
        await apiRequest(`/admin/careers/${id}`, {
          method: "DELETE"
        });
        await refreshCareers();
        setNotification({ open: true, message: 'Xóa nghề nghiệp thành công!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setNotification({ open: true, message: 'Xóa nghề nghiệp thất bại!', severity: 'error' });
      }
    }
  };

  const isFormValid =
    formData.tenNghe.trim() &&
    formData.moTa.trim() &&
    formData.kyNangCanThiet.trim();

  const renderForm = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mt: 1.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <TextField
          label="Tên nghề"
          required
          fullWidth
          value={formData.tenNghe}
          onChange={(e) =>
            setFormData({ ...formData, tenNghe: e.target.value })
          }
          placeholder="VD: Lập trình viên Front-end"
          sx={inputSx}
        />

        <FormControl fullWidth sx={inputSx}>
          <InputLabel>Danh mục ngành</InputLabel>
          <Select
            label="Danh mục ngành"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.tenNganh} ({cat.truong})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        label="Mô tả"
        required
        fullWidth
        multiline
        rows={3}
        value={formData.moTa}
        onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
        placeholder="Mô tả công việc và trách nhiệm chính..."
        sx={multilineInputSx}
      />

      <TextField
        label="Kỹ năng cần thiết"
        required
        fullWidth
        multiline
        rows={2}
        value={formData.kyNangCanThiet}
        onChange={(e) =>
          setFormData({ ...formData, kyNangCanThiet: e.target.value })
        }
        placeholder="VD: Python, Machine Learning, TensorFlow"
        sx={multilineInputSx}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <FormControl fullWidth sx={inputSx}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={formData.trangThai}
            onChange={(e) =>
              setFormData({ ...formData, trangThai: Number(e.target.value) })
            }
          >
            <MenuItem value={1}>Hoạt động</MenuItem>
            <MenuItem value={0}>Khóa</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    // 🌟 KHẮC PHỤC CHÍNH: Khống chế chiều rộng tuyệt đối cho container lớn nhất
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 32 },
              fontWeight: 700,
              color: textMain,
              letterSpacing: "-0.03em",
            }}
          >
            Quản lý Nghề nghiệp
          </Typography>

          <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 14 }}>
            Quản lý danh sách nghề nghiệp trong hệ thống
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddOpen(true)}
          sx={{
            bgcolor: orange,
            color: "#fff",
            borderRadius: "10px",
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",
            alignSelf: { xs: "flex-start", md: "auto" },
            "&:hover": {
              bgcolor: orangeDark,
              boxShadow: "none",
            },
          }}
        >
          Thêm nghề nghiệp
        </Button>
      </Box>

      {/* Dialogs */}
      <Dialog
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Thêm nghề nghiệp mới
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Nhập thông tin chi tiết cho nghề nghiệp cần thêm vào hệ thống.
          </Typography>
        </DialogTitle>
        <DialogContent>{renderForm()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setIsAddOpen(false); resetForm(); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" disabled={!isFormValid} onClick={handleAdd} sx={primaryButtonSx}>Thêm</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingCareer}
        onClose={() => {
          setEditingCareer(null);
          resetForm();
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Cập nhật nghề nghiệp
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Chỉnh sửa thông tin chi tiết của nghề nghiệp.
          </Typography>
        </DialogTitle>
        <DialogContent>{renderForm()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setEditingCareer(null); resetForm(); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" disabled={!isFormValid} onClick={handleUpdate} sx={primaryButtonSx}>Cập nhật</Button>
        </DialogActions>
      </Dialog>

      {/* 🌟 KHẮC PHỤC THANH LỌC: Đổi template layout grid linh hoạt hơn từ lg trở lên */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
          mb: 3,
          maxWidth: "100%",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
            Tra cứu nghề nghiệp
          </Typography>

          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
            Tìm kiếm và lọc theo danh mục, trạng thái
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "2fr 1fr 1fr", // Cấp đủ tỉ lệ phần trăm thay vì gán cứng px (220px 180px) dễ gây bóp nghẹt layout
              },
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo tên nghề, danh mục..."
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

            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                label="Danh mục"
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
              >
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.tenNganh} ({cat.truong})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="1">Hoạt động</MenuItem>
                <MenuItem value="0">Khóa</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Bảng danh sách */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 }, width: "100%", boxSizing: "border-box" }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: textMain, mb: 2 }}>
            Danh sách nghề nghiệp ({filtered.length})
          </Typography>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${borderColor}`,
              borderRadius: "14px",
              overflowX: "auto",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <Table sx={{ minWidth: 850, tableLayout: "fixed" }}> {/* 🌟 THÊM: `tableLayout: "fixed"` để cố định tỷ lệ các cột */}
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={thSx} style={{ width: "18%" }}>Tên nghề</TableCell>
                  <TableCell sx={thSx} style={{ width: "15%" }}>Danh mục</TableCell>
                  <TableCell sx={thSx} style={{ width: "25%" }}>Mô tả</TableCell>
                  <TableCell sx={thSx} style={{ width: "20%" }}>Kỹ năng cần thiết</TableCell>
                  <TableCell sx={thSx} style={{ width: "10%" }}>Trạng thái</TableCell>
                  <TableCell sx={thSx} style={{ width: "12%" }}>Ngày tạo</TableCell>
                  <TableCell sx={thSx} style={{ width: "10%" }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((career) => (
                  <TableRow
                    key={career.id}
                    hover
                    sx={{
                      "& td": { borderBottom: `1px solid ${borderColor}` },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain, wordBreak: "break-word" }}>
                        {career.tenNghe}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Chip
                        label={getCategoryName(career.categoryId)}
                        size="small"
                        sx={{
                          bgcolor: orangeLight,
                          color: "#92400e",
                          fontWeight: 700,
                          maxWidth: "100%",
                          height: "auto",
                          "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 }
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography
                        title={career.moTa}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          color: textMuted,
                          fontSize: 14,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {career.moTa}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography
                        title={career.kyNangCanThiet}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          color: textMain,
                          fontSize: 14,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {career.kyNangCanThiet}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Chip
                        label={career.trangThai === 1 ? "Hoạt động" : "Khóa"}
                        size="small"
                        sx={{
                          bgcolor: career.trangThai === 1 ? "#dcfce7" : "#fee2e2",
                          color: career.trangThai === 1 ? "#15803d" : "#b91c1c",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography sx={{ color: textMuted, fontSize: 14 }}>
                        {career.ngayTao ? new Date(career.ngayTao).toLocaleDateString("vi-VN") : "—"}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      <Stack direction="row" spacing={0.2} justifyContent="flex-end">
                        <Button variant="text" size="small" onClick={() => handleEdit(career)} sx={{ minWidth: 32, p: 0.5, color: orange }}>
                          <Edit sx={{ fontSize: 18 }} />
                        </Button>
                        <Button variant="text" size="small" onClick={() => handleDelete(career.id)} sx={{ minWidth: 32, p: 0.5, color: "#dc2626" }}>
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>Không tìm thấy nghề nghiệp nào.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

// Styles bổ sung
const thSx = {
  fontSize: 13,
  fontWeight: 700,
  color: "#4b5563",
  whiteSpace: "nowrap",
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

const multilineInputSx = {
  ...inputSx,
  "& .MuiOutlinedInput-root": {
    ...inputSx["& .MuiOutlinedInput-root"],
    height: "auto",
  },
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