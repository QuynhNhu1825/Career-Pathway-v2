import { useState } from "react";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
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
import { useCategories, type Category } from "../contexts/CategoriesContext";
import { apiRequest } from "../services/api";

const initialForm = {
  tenNganh: "",
  moTa: "",
};

const orange = "#f59e0b";
const orangeDark = "#d97706";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

interface GroupedCategory {
  id: string;
  tenNganh: string;
  moTa: string;
}

export function CategoriesPage() {
  const { categories, refreshCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  
  // State for validation errors
  const [tenNganhError, setTenNganhError] = useState<string | null>(null);
  const [moTaError, setMoTaError] = useState<string | null>(null);

  // --- LOGIC XỬ LÝ GOM NHÓM NGÀNH (GROUP BY) AN TOÀN ---
  const uniqueCareersMap = new Map<string, GroupedCategory>();

  categories.forEach((item) => {
    // Chấp nhận mọi trường hợp key từ Backend (tenNganh hoặc careerName)
    const nameKey = (item.tenNganh || (item as any).careerName || "").toString().trim();
    
    if (nameKey) {
      if (!uniqueCareersMap.has(nameKey)) {
        // Đồng bộ lấy trường moTa từ Object mapped của Backend
        const extractedDesc = item.moTa || (item as any).moTa || (item as any).description || "";
        
        uniqueCareersMap.set(nameKey, {
          id: item.id,
          tenNganh: nameKey,
          moTa: extractedDesc.trim() !== "" ? extractedDesc.trim() : "Chưa có mô tả cho ngành này.",
        });
      }
    }
  });

  const groupedCategories = Array.from(uniqueCareersMap.values());

  const filtered = groupedCategories.filter((category) =>
    category.tenNganh.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.moTa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validation function
  const validateForm = () => {
    let isValid = true;

    // Validate tenNganh
    if (!formData.tenNganh.trim()) {
      setTenNganhError("Tên ngành không được để trống.");
      isValid = false;
    } else if (formData.tenNganh.trim().length > 255) {
      setTenNganhError("Tên ngành không được vượt quá 255 ký tự.");
      isValid = false;
    } else {
      // Check for duplicate tenNganh (case-insensitive)
      const isDuplicate = groupedCategories.some(
        (cat) =>
          cat.tenNganh.toLowerCase() === formData.tenNganh.trim().toLowerCase() &&
          (editingItem ? cat.id !== editingItem.id : true) // Allow current item to have its own name during edit
      );
      if (isDuplicate) {
        setTenNganhError("Tên ngành đã tồn tại.");
        isValid = false;
      } else {
        setTenNganhError(null);
      }
    }

    // Validate moTa
    if (!formData.moTa.trim()) {
      setMoTaError("Mô tả ngành không được để trống.");
      isValid = false;
    } else if (formData.moTa.trim().length > 1000) {
      setMoTaError("Mô tả ngành không được vượt quá 1000 ký tự.");
      isValid = false;
    } else {
      setMoTaError(null);
    }

    return isValid;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      setNotification({ open: true, message: 'Vui lòng kiểm tra lại các trường thông tin.', severity: 'error' });
      return;
    }
    try {
      await apiRequest("/admin/categories", {
        method: "POST",
        body: JSON.stringify({
          tenNganh: formData.tenNganh.trim(),
          moTa: formData.moTa.trim()
        })
      });
      await refreshCategories();
      setIsAddOpen(false);
      setFormData(initialForm);
      setTenNganhError(null);
      setMoTaError(null);
      setNotification({ open: true, message: 'Thêm danh mục thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Thêm danh mục thất bại!', severity: 'error' });
    }
  };

  const handleEdit = (groupedItem: GroupedCategory) => {
    const originalItem = categories.find(c => 
      (c.tenNganh || (c as any).careerName || "").toString().trim() === groupedItem.tenNganh
    );
    if (originalItem) {
      setEditingItem(originalItem);
      setFormData({
        tenNganh: groupedItem.tenNganh,
        moTa: groupedItem.moTa !== "Chưa có mô tả cho ngành này." ? groupedItem.moTa : "",
      });
      setTenNganhError(null); // Clear errors when opening edit dialog
      setMoTaError(null); // Clear errors when opening edit dialog
      setIsAddOpen(false); // Đảm bảo Dialog Thêm đóng
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    if (!isFormValid) {
      setNotification({ open: true, message: 'Vui lòng điền đầy đủ thông tin.', severity: 'error' });
      return;
    }
    try {
      // Tìm các bản ghi dựa theo cả tenNganh và careerName để cập nhật đồng loạt chuẩn xác
      const targetName = (editingItem.tenNganh || (editingItem as any).careerName || "").toString().trim();
      const itemsToUpdate = categories.filter(c => 
        (c.tenNganh || (c as any).careerName || "").toString().trim() === targetName
      );

      if (itemsToUpdate.length === 0) {
        // Dự phòng nếu không filter được thì cập nhật chính item được chọn thông qua ID
        itemsToUpdate.push(editingItem);
      }

      await Promise.all(
        itemsToUpdate.map(item =>
          apiRequest(`/admin/categories/${item.id}`, {
            method: "PUT",
            body: JSON.stringify({
              tenNganh: formData.tenNganh.trim(),
              moTa: formData.moTa.trim()
            })
          })
        )
      );
      await refreshCategories();
      setEditingItem(null);
      setFormData(initialForm);
      setTenNganhError(null);
      setMoTaError(null);
      setNotification({ open: true, message: 'Cập nhật danh mục thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Cập nhật danh mục thất bại!', severity: 'error' });
    }
  };

  const handleDelete = async (tenNganh: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa ngành "${tenNganh}" khỏi danh mục?`)) {
      try {
        const itemsToDelete = categories.filter(c => 
          (c.tenNganh || (c as any).careerName || "").toString().trim() === tenNganh.trim()
        );
        
        if (itemsToDelete.length === 0) return;

        await Promise.all(
          itemsToDelete.map(item => 
            apiRequest(`/admin/categories/${item.id}`, { method: "DELETE" })
          )
        );

        await refreshCategories();
        setNotification({ open: true, message: 'Xóa danh mục ngành thành công!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setNotification({ open: true, message: 'Xóa danh mục thất bại!', severity: 'error' });
      }
    }
  };

  const isFormValid = !tenNganhError && !moTaError && formData.tenNganh.trim() && formData.moTa.trim();

  const renderForm = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mt: 1 }}>
      <TextField
        fullWidth
        size="small"
        label="Tên ngành"
        required
        placeholder="VD: Công nghệ thông tin"
        value={formData.tenNganh}
        onChange={(e) => {
          setFormData({ ...formData, tenNganh: e.target.value });
          // Real-time validation for tenNganh
          const value = e.target.value.trim();
          if (!value) setTenNganhError("Tên ngành không được để trống.");
          else if (value.length > 255) setTenNganhError("Tên ngành không được vượt quá 255 ký tự.");
          else if (groupedCategories.some(cat => cat.tenNganh.toLowerCase() === value.toLowerCase() && (editingItem ? cat.id !== editingItem.id : true))) setTenNganhError("Tên ngành đã tồn tại.");
          else setTenNganhError(null);
        }}
        error={!!tenNganhError}
        helperText={tenNganhError}
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Mô tả ngành"
        multiline
        rows={4}
        required
        placeholder="Nhập mô tả tóm tắt về ngành học này..."
        value={formData.moTa}
        onChange={(e) => {
          setFormData({ ...formData, moTa: e.target.value });
          // Real-time validation for moTa
          const value = e.target.value.trim();
          if (!value) setMoTaError("Mô tả ngành không được để trống.");
          else if (value.length > 1000) setMoTaError("Mô tả ngành không được vượt quá 1000 ký tự.");
          else setMoTaError(null);
        }}
        error={!!moTaError}
        helperText={moTaError}
        sx={{
          ...inputSx,
          "& .MuiOutlinedInput-root": {
            ...inputSx["& .MuiOutlinedInput-root"],
            height: "auto",
          }
        }}
      />
    </Box>
  );

  return (
    <Box>
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
          mb: 2.5,
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 30, fontWeight: 700, color: textMain, letterSpacing: "-0.03em" }}>
            Quản lý Danh mục ngành
          </Typography>
          <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
            Quản lý các danh mục ngành nghề trong hệ thống
          </Typography>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<Add sx={{ fontSize: 18 }} />}
          onClick={() => { setFormData(initialForm); setIsAddOpen(true); }}
          sx={{
            bgcolor: orange,
            color: "#fff",
            borderRadius: "10px",
            px: 1.8,
            py: 0.8,
            fontSize: 14,
            textTransform: "none",
            fontWeight: 700,
            minHeight: 38,
            boxShadow: "none",
            transform: "translateX(-16px)",
            "&:hover": { bgcolor: orangeDark, boxShadow: "none" },
          }}
        >
          Thêm danh mục
        </Button>
      </Box>

      {/* Dialog Thêm */}
      <Dialog open={isAddOpen} onClose={() => { setIsAddOpen(false); setFormData(initialForm); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Thêm danh mục mới
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Nhập tên và thông tin mô tả ngành nghề cần thêm vào hệ thống.
          </Typography>
        </DialogTitle>
        <DialogContent>{renderForm()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setIsAddOpen(false); setFormData(initialForm); }} sx={cancelButtonSx}>
            Hủy
          </Button>
          <Button variant="contained" disabled={!isFormValid} onClick={handleAdd} sx={primaryButtonSx}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Cập nhật */}
      <Dialog open={!!editingItem} onClose={() => { setEditingItem(null); setFormData(initialForm); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Cập nhật danh mục
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Chỉnh sửa tên hoặc mô tả ngành.
          </Typography>
        </DialogTitle>
        <DialogContent>{renderForm()}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => { setEditingItem(null); setFormData(initialForm); }} sx={cancelButtonSx}>
            Hủy
          </Button>
          <Button variant="contained" disabled={!isFormValid} onClick={handleUpdate} sx={primaryButtonSx}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bộ tìm kiếm */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff", mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
            Tra cứu danh mục
          </Typography>
          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
            Tìm kiếm theo tên ngành hoặc mô tả
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
            sx={inputSx}
          />
        </CardContent>
      </Card>

      {/* Bảng Hiển thị Danh sách */}
      <Card elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "18px", bgcolor: "#fff" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain, mb: 2 }}>
            Danh sách danh mục ({filtered.length})
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "14px", overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  {["STT", "Tên ngành", "Mô tả", "Thao tác"].map((head) => (
                    <TableCell
                      key={head}
                      align={head === "Thao tác" ? "right" : "left"}
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#4b5563",
                        borderBottom: `1px solid ${borderColor}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((category, index) => (
                  <TableRow
                    key={category.id}
                    hover
                    sx={{
                      "& td": { borderBottom: `1px solid ${borderColor}` },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ width: 80, color: textMuted, fontSize: 14 }}>
                      {index + 1}
                    </TableCell>

                    <TableCell sx={{ width: "25%", minWidth: 200 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain }}>
                        {category.tenNganh}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 400 }}>
                      <Typography 
                        sx={{ 
                          fontSize: 14, 
                          color: textMuted,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal"
                        }}
                        title={category.moTa}
                      >
                        {category.moTa}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ width: 120 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleEdit(category)}
                          sx={{ minWidth: 36, color: orange, "&:hover": { bgcolor: orangeLight } }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </Button>

                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleDelete(category.tenNganh)}
                          sx={{ minWidth: 36, color: "#dc2626", "&:hover": { bgcolor: "#fee2e2" } }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>
                          Không tìm thấy danh mục ngành nào.
                        </Typography>
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