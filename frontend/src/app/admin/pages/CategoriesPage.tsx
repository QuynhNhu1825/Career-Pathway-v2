import { useState } from "react";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
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
import { useCategories, type Category } from "../contexts/CategoriesContext";
import { apiRequest } from "../services/api";

const initialForm = {
  tenNganh: "",
  truong: "",
  diemChuan: "",
  link: "",
};

const orange = "#f59e0b";
const orangeDark = "#d97706";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function CategoriesPage() {
  const { categories, refreshCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  const filtered = categories.filter(
    (category) =>
      (category.tenNganh || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.truong || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      await apiRequest("/admin/categories", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      await refreshCategories();
      setIsAddOpen(false);
      setFormData(initialForm);
      setNotification({ open: true, message: 'Thêm danh mục thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Thêm danh mục thất bại!', severity: 'error' });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingItem(category);
    setFormData({
      tenNganh: category.tenNganh,
      truong: category.truong,
      diemChuan: category.diemChuan,
      link: category.link,
    });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      await apiRequest(`/admin/categories/${editingItem.id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      await refreshCategories();
      setEditingItem(null);
      setFormData(initialForm);
      setNotification({ open: true, message: 'Cập nhật danh mục thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Cập nhật danh mục thất bại!', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa ngành/trường học này?"
      )
    ) {
      try {
        await apiRequest(`/admin/categories/${id}`, {
          method: "DELETE"
        });
        await refreshCategories();
        setNotification({ open: true, message: 'Xóa danh mục thành công!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setNotification({ open: true, message: 'Xóa danh mục thất bại!', severity: 'error' });
      }
    }
  };

  const isFormValid = formData.tenNganh.trim() && formData.truong.trim();

  const renderForm = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mt: 1 }}>
      <TextField
        fullWidth
        size="small"
        label="Tên ngành"
        required
        placeholder="VD: Khoa học Xã hội và Nhân văn"
        value={formData.tenNganh}
        onChange={(e) =>
          setFormData({ ...formData, tenNganh: e.target.value })
        }
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Trường học"
        required
        placeholder="VD: Trường Đại học Bách khoa"
        value={formData.truong}
        onChange={(e) => setFormData({ ...formData, truong: e.target.value })}
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Điểm chuẩn"
        placeholder="VD: 25.5"
        value={formData.diemChuan}
        onChange={(e) => setFormData({ ...formData, diemChuan: e.target.value })}
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Link tuyển sinh / chính thức"
        placeholder="VD: https://ts.hust.edu.vn"
        value={formData.link}
        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        sx={inputSx}
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
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity} 
          sx={{ width: '100%' }}>
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
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 700,
              color: textMain,
              letterSpacing: "-0.03em",
            }}
          >
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
          onClick={() => setIsAddOpen(true)}
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
            "&:hover": {
              bgcolor: orangeDark,
              boxShadow: "none",
            },
          }}
        >
          Thêm danh mục
        </Button>
      </Box>

      <Dialog
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setFormData(initialForm);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Thêm danh mục mới
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Nhập thông tin danh mục ngành nghề cần thêm vào hệ thống.
          </Typography>
        </DialogTitle>

        <DialogContent>{renderForm()}</DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setIsAddOpen(false);
              setFormData(initialForm);
            }}
            sx={cancelButtonSx}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            disabled={!isFormValid}
            onClick={handleAdd}
            sx={primaryButtonSx}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingItem}
        onClose={() => {
          setEditingItem(null);
          setFormData(initialForm);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Cập nhật danh mục
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Chỉnh sửa thông tin danh mục ngành.
          </Typography>
        </DialogTitle>

        <DialogContent>{renderForm()}</DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setEditingItem(null);
              setFormData(initialForm);
            }}
            sx={cancelButtonSx}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            disabled={!isFormValid}
            onClick={handleUpdate}
            sx={primaryButtonSx}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
            Tra cứu danh mục
          </Typography>

          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
            Tìm kiếm theo tên hoặc mô tả
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm danh mục..."
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

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: textMain,
              mb: 2,
            }}
          >
            Danh sách danh mục ({filtered.length})
          </Typography>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${borderColor}`,
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  {["Mã", "Tên ngành", "Trường học", "Điểm chuẩn", "Link thông tin", "Thao tác"].map(
                    (head) => (
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
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((category) => (
                  <TableRow
                    key={category.id}
                    hover
                    sx={{
                      "& td": {
                        borderBottom: `1px solid ${borderColor}`,
                      },
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: "monospace",
                          fontSize: 13,
                          color: textMuted,
                        }}
                      >
                        {category.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: textMain,
                        }}
                      >
                        {category.tenNganh}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        title={category.truong}
                        sx={{
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: textMain,
                          fontSize: 14,
                        }}
                      >
                        {category.truong}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          color: textMuted,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {category.diemChuan}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {category.link ? (
                        <a
                          href={category.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: orange,
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Xem liên kết
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleEdit(category)}
                          sx={{
                            minWidth: 36,
                            color: orange,
                            "&:hover": {
                              bgcolor: orangeLight,
                            },
                          }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </Button>

                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleDelete(category.id)}
                          sx={{
                            minWidth: 36,
                            color: "#dc2626",
                            "&:hover": {
                              bgcolor: "#fee2e2",
                            },
                          }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>
                          Không tìm thấy danh mục nào.
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

  "& .MuiSelect-select": {
    padding: "8px 12px",
    fontSize: 14,
  },

  "& .MuiInputLabel-root": {
    fontSize: 14,
    top: "-6px",
  },

  "& .MuiInputLabel-shrink": {
    top: 0,
  },
};

const primaryButtonSx = {
  bgcolor: orange,
  textTransform: "none",
  borderRadius: "10px",
  fontWeight: 700,
  boxShadow: "none",
  "&:hover": {
    bgcolor: orangeDark,
    boxShadow: "none",
  },
};

const cancelButtonSx = {
  textTransform: "none",
  borderRadius: "10px",
  fontWeight: 700,
  borderColor,
  color: textMain,
};