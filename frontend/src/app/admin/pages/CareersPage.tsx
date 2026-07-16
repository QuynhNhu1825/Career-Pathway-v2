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

  // State for validation errors
  const [tenNgheError, setTenNgheError] = useState<string | null>(null);
  const [moTaError, setMoTaError] = useState<string | null>(null);
  const [kyNangCanThietError, setKyNangCanThietError] = useState<string | null>(null);

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

  const getCategoryName = (id: string, jobName: string) => {
    if (id && id !== "—") {
      const found = categories.find((c) => c.id.toString() === id.toString());
      if (found) return found.tenNganh;
    }

    const name = (jobName || "").toLowerCase();
    let keyword = "";
    if (name.includes("phần mềm") || name.includes("lập trình") || name.includes("it") || name.includes("dev") || name.includes("web")) {
      keyword = "Công nghệ thông tin";
    } else if (name.includes("sự kiện") || name.includes("tổ chức") || name.includes("quản lý")) {
      keyword = "Quản lý và Tổ chức sự kiện";
    } else if (name.includes("ô tô") || name.includes("cơ khí") || name.includes("chế tạo")) {
      keyword = "Kỹ thuật Ô tô";
    } else if (name.includes("bóng đá") || name.includes("cầu thủ") || name.includes("thể thao")) {
      keyword = "Thể dục thể thao";
    } else if (name.includes("du lịch") || name.includes("lữ hành") || name.includes("khách sạn")) {
      keyword = "Du lịch";
    } else if (name.includes("nhân văn") || name.includes("xã hội")) {
      keyword = "Khoa học Xã hội";
    }

    const matchedCat = categories.find(c => c.tenNganh.toLowerCase().includes(keyword.toLowerCase()));
    return matchedCat ? matchedCat.tenNganh : "Danh mục khác";
  };

  const uniqueJobsMap = new Map<string, Career>();

  careers.forEach((item) => {
    const jobKey = (item.tenNghe || (item as any).roles || (item as any).careerName || "").toString().trim();
    
    if (jobKey && !uniqueJobsMap.has(jobKey)) {
      uniqueJobsMap.set(jobKey, {
        id: item.id,
        tenNghe: jobKey,
        categoryId: item.categoryId && item.categoryId !== "—" ? item.categoryId : "",
        moTa: item.moTa || (item as any).jobDescription || "Chưa có mô tả ngắn.",
        kyNangCanThiet: item.kyNangCanThiet || (item as any).requiredSkills || "Tư duy logic",
        trangThai: item.trangThai !== undefined ? item.trangThai : 1,
      });
    }
  });

  const groupedCareers = Array.from(uniqueJobsMap.values());

  const filtered = groupedCareers.filter((career) => {
    const catName = getCategoryName(career.categoryId, career.tenNghe).toLowerCase();

    const matchSearch =
      (career.tenNghe || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      catName.includes(searchTerm.toLowerCase()) ||
      (career.moTa || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = filterCategoryId
      ? career.categoryId === filterCategoryId
      : true;

    const matchStatus =
      filterTrangThai !== ""
        ? career.trangThai === Number(filterTrangThai)
        : true;

    return matchSearch && matchCategory && matchStatus;
  });

  // Validation function
  const validateForm = () => {
    let isValid = true;

    // Validate tenNghe
    if (!formData.tenNghe.trim()) {
      setTenNgheError("Tên nghề không được để trống.");
      isValid = false;
    } else if (formData.tenNghe.trim().length > 255) {
      setTenNgheError("Tên nghề không được vượt quá 255 ký tự.");
      isValid = false;
    } else {
      // Check for duplicate tenNghe (case-insensitive)
      const isDuplicate = groupedCareers.some(
        (career) =>
          career.tenNghe.toLowerCase() === formData.tenNghe.trim().toLowerCase() &&
          (editingCareer ? career.id !== editingCareer.id : true) // Allow current item to have its own name during edit
      );
      if (isDuplicate) {
        setTenNgheError("Tên nghề đã tồn tại.");
        isValid = false;
      } else {
        setTenNgheError(null);
      }
    }

    // Validate moTa
    if (!formData.moTa.trim()) {
      setMoTaError("Mô tả không được để trống.");
      isValid = false;
    } else if (formData.moTa.trim().length > 1000) {
      setMoTaError("Mô tả không được vượt quá 1000 ký tự.");
      isValid = false;
    } else {
      setMoTaError(null);
    }

    // Validate kyNangCanThiet
    if (!formData.kyNangCanThiet.trim()) {
      setKyNangCanThietError("Kỹ năng cần thiết không được để trống.");
      isValid = false;
    } else if (formData.kyNangCanThiet.trim().length > 500) {
      setKyNangCanThietError("Kỹ năng cần thiết không được vượt quá 500 ký tự.");
      isValid = false;
    } else {
      setKyNangCanThietError(null);
    }

    return isValid;
  };

  const resetForm = () => {
    setFormData({
      tenNghe: "",
      categoryId: categories[0]?.id ?? "",
      moTa: "",
      kyNangCanThiet: "",
      trangThai: 1
    });
    setTenNgheError(null);
    setMoTaError(null);
    setKyNangCanThietError(null);
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
    setTenNgheError(null); // Clear errors when opening edit dialog
    setMoTaError(null); // Clear errors when opening edit dialog
    setKyNangCanThietError(null); // Clear errors when opening edit dialog
  };

  const handleUpdate = async () => {
    if (!editingCareer) return;
    try {
      const targetItems = careers.filter(c => 
        (c.tenNghe || (c as any).roles || "").toString().trim() === editingCareer.tenNghe.trim()
      );

      const itemsToUpdate = targetItems.length > 0 ? targetItems : [editingCareer];

      await Promise.all(
        itemsToUpdate.map(item => 
          apiRequest(`/admin/careers/${item.id}`, {
            method: "PUT",
            body: JSON.stringify(formData)
          })
        )
      );

      await refreshCareers();
      setEditingCareer(null);
      resetForm();
      setNotification({ open: true, message: 'Cập nhật nghề nghiệp thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Cập nhật nghề nghiệp thất bại!', severity: 'error' });
    }
  };

  const handleDelete = async (tenNghe: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ nghề nghiệp thuộc nhóm "${tenNghe}"?`)) {
      try {
        const itemsToDelete = careers.filter(c => 
          (c.tenNghe || (c as any).roles || "").toString().trim() === tenNghe.trim()
        );

        if (itemsToDelete.length === 0) return;

        await Promise.all(
          itemsToDelete.map(item => 
            apiRequest(`/admin/careers/${item.id}`, { method: "DELETE" })
          )
        );

        await refreshCareers();
        setNotification({ open: true, message: 'Xóa nghề nghiệp thành công!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setNotification({ open: true, message: 'Xóa nghề nghiệp thất bại!', severity: 'error' });
      }
    }
  };

  const isFormValid = !tenNgheError && !moTaError && !kyNangCanThietError && formData.tenNghe.trim() && formData.moTa.trim() && formData.kyNangCanThiet.trim();
  const renderForm = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mt: 1.5 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          label="Tên nghề"
          required
          fullWidth
          value={formData.tenNghe}
          onChange={(e) => {
            setFormData({ ...formData, tenNghe: e.target.value });
            const value = e.target.value.trim();
            if (!value) setTenNgheError("Tên nghề không được để trống.");
            else if (value.length > 255) setTenNgheError("Tên nghề không được vượt quá 255 ký tự.");
            else if (groupedCareers.some(
              (career) => career.tenNghe.toLowerCase() === value.toLowerCase() && (editingCareer ? career.id !== editingCareer.id : true)
            )) {
              setTenNgheError("Tên nghề đã tồn tại.");
            } else setTenNgheError(null);
          }}
          error={!!tenNgheError}
          helperText={tenNgheError}
          placeholder="VD: Lập trình viên Front-end"
          sx={inputSx}
        />

        <FormControl fullWidth sx={inputSx}>
          <InputLabel>Danh mục ngành</InputLabel>
          <Select
            label="Danh mục ngành"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.tenNganh}
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
        onChange={(e) => {
          setFormData({ ...formData, moTa: e.target.value });
          const value = e.target.value.trim();
          if (!value) setMoTaError("Mô tả không được để trống.");
          else if (value.length > 1000) setMoTaError("Mô tả không được vượt quá 1000 ký tự.");
          else setMoTaError(null);
        }}
        error={!!moTaError}
        helperText={moTaError}
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
        onChange={(e) => {
          setFormData({ ...formData, kyNangCanThiet: e.target.value });
          const value = e.target.value.trim();
          if (!value) setKyNangCanThietError("Kỹ năng cần thiết không được để trống.");
          else if (value.length > 500) setKyNangCanThietError("Kỹ năng cần thiết không được vượt quá 500 ký tự.");
          else setKyNangCanThietError(null);
        }}
        error={!!kyNangCanThietError}
        helperText={kyNangCanThietError}
        placeholder="VD: JavaScript, ReactJS, Git (ngăn cách bởi dấu phẩy)"
        sx={multilineInputSx}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <FormControl fullWidth sx={inputSx}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={formData.trangThai}
            onChange={(e) => setFormData({ ...formData, trangThai: Number(e.target.value) })}
          >
            <MenuItem value={1}>Hoạt động</MenuItem>
            <MenuItem value={0}>Khóa</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
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
          <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: textMain, letterSpacing: "-0.03em" }}>
            Quản lý Nghề nghiệp
          </Typography>
          <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 14 }}>
            Quản lý danh sách nghề nghiệp trong hệ thống
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { resetForm(); setIsAddOpen(true); }}
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
            "&:hover": { bgcolor: orangeDark, boxShadow: "none" },
          }}
        >
          Thêm nghề nghiệp
        </Button>
      </Box>

      {/* Tra cứu */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff", mb: 3, maxWidth: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>Tra cứu nghề nghiệp</Typography>
          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>Tìm kiếm và lọc theo tên nghề, danh mục</Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr" }, gap: 2, width: "100%" }}>
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

            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel id="filter-category-label">Danh mục</InputLabel>
              <Select
                labelId="filter-category-label"
                id="filter-category-select"
                label="Danh mục"
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
              >
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.tenNganh}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={filterTrangThai} onChange={(e) => setFilterTrangThai(e.target.value)}>
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="1">Hoạt động</MenuItem>
                <MenuItem value="0">Khóa</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Bảng dữ liệu - CỐ ĐỊNH PHẲNG VỪA KHÍT MÀN HÌNH */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff", maxWidth: "100%", width: "100%" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, width: "100%", boxSizing: "border-box" }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: textMain, mb: 2 }}>
            Danh sách nghề nghiệp ({filtered.length})
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "14px", overflowX: "auto", width: "100%" }}>
            {/* Hạ thấp minWidth về 700 để vừa vặn khung cha flexbox */}
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={thSx} style={{ width: "140px" }}>Tên nghề</TableCell>
                  <TableCell sx={thSx} style={{ width: "150px" }}>Danh mục</TableCell>
                  <TableCell sx={thSx} style={{ width: "auto" }}>Mô tả</TableCell>
                  <TableCell sx={thSx} style={{ width: "210px" }}>Kỹ năng cần thiết</TableCell>
                  <TableCell sx={thSx} style={{ width: "110px" }}>Trạng thái</TableCell>
                  <TableCell sx={thSx} style={{ width: "80px" }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((career) => (
                  <TableRow key={career.id} hover sx={{ "& td": { borderBottom: `1px solid ${borderColor}` }, "&:last-child td": { borderBottom: 0 } }}>
                    {/* 1. Tên Nghề */}
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain, wordBreak: "break-word" }}>
                        {career.tenNghe}
                      </Typography>
                    </TableCell>

                    {/* 2. Danh mục */}
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Chip
                        label={getCategoryName(career.categoryId, career.tenNghe)}
                        size="small"
                        sx={{
                          bgcolor: orangeLight,
                          color: "#92400e",
                          fontWeight: 700,
                          maxWidth: "140px",
                          height: "auto",
                          "& .MuiChip-label": { whiteSpace: "normal", py: 0.5, textAlign: "center" }
                        }}
                      />
                    </TableCell>

                    {/* 3. Mô tả nghề */}
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Typography sx={{ fontSize: 13, color: textMuted, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal", wordBreak: "break-word" }} title={career.moTa}>
                        {career.moTa}
                      </Typography>
                    </TableCell>

                    {/* 4. Kỹ năng cần thiết */}
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {career.kyNangCanThiet.split(/[,，\n]+/).map((skill, sIdx) => (
                          <Chip
                            key={sIdx}
                            label={skill.trim()}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: "#d1d5db",
                              color: "#374151",
                              fontSize: "11px",
                              fontWeight: 500,
                              height: "20px"
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>

                    {/* 5. Trạng thái */}
                    <TableCell sx={{ verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <Chip 
                        label={career.trangThai === 1 ? "Hoạt động" : "Khóa"} 
                        size="small" 
                        sx={{ 
                          bgcolor: career.trangThai === 1 ? "#dcfce7" : "#fee2e2", 
                          color: career.trangThai === 1 ? "#15803d" : "#b91c1c", 
                          fontWeight: 700,
                          minWidth: "80px"
                        }} 
                      />
                    </TableCell>

                    {/* 6. Thao tác */}
                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      <Stack direction="row" spacing={0.2} justifyContent="flex-end">
                        <Button variant="text" size="small" onClick={() => handleEdit(career)} sx={{ minWidth: 32, p: 0.5, color: orange }}>
                          <Edit sx={{ fontSize: 18 }} />
                        </Button>
                        <Button variant="text" size="small" onClick={() => handleDelete(career.tenNghe)} sx={{ minWidth: 32, p: 0.5, color: "#dc2626" }}>
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
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

      {/* Dialog Thêm */}
      <Dialog open={isAddOpen} onClose={() => { setIsAddOpen(false); resetForm(); }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>Thêm nghề nghiệp mới</DialogTitle>
        <DialogContent>{renderForm()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setIsAddOpen(false); resetForm(); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" disabled={!isFormValid} onClick={handleAdd} sx={primaryButtonSx}>Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sửa */}
      <Dialog open={!!editingCareer} onClose={() => { setEditingCareer(null); resetForm(); }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>Cập nhật nghề nghiệp</DialogTitle>
        <DialogContent>{renderForm()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setEditingCareer(null); resetForm(); }} sx={cancelButtonSx}>Hủy</Button>
          <Button variant="contained" disabled={!isFormValid} onClick={handleUpdate} sx={primaryButtonSx}>Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const thSx = { fontSize: 13, fontWeight: 700, color: "#4b5563", whiteSpace: "nowrap" };
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
const multilineInputSx = { ...inputSx, "& .MuiOutlinedInput-root": { ...inputSx["& .MuiOutlinedInput-root"], height: "auto" } };
const primaryButtonSx = { bgcolor: orange, textTransform: "none", borderRadius: "10px", fontWeight: 700, boxShadow: "none", "&:hover": { bgcolor: orangeDark, boxShadow: "none" } };
const cancelButtonSx = { textTransform: "none", borderRadius: "10px", fontWeight: 700, borderColor, color: textMain };