import { useState, useEffect } from "react";
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
import { apiRequest } from "../services/api";

interface Prompt {
  id: string;
  code: string;
  title: string;
  content: string;
  description: string;
  version: string;
  inputVariables: string;
  status: string;
  createdAt: string;
}

const initialFormState = {
  code: "",
  title: "",
  version: "",
  inputVariables: "",
  status: "active",
  description: "",
  content: "",
};

const orange = "#f59e0b";
const orangeDark = "#d97706";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  const refreshPrompts = async () => {
    try {
      const res = await apiRequest("/admin/prompts");
      if (res.success) {
        setPrompts(res.prompts || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshPrompts();
  }, []);

  const filteredPrompts = prompts.filter(
    (prompt) =>
      (prompt.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prompt.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prompt.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      await apiRequest("/admin/prompts", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      await refreshPrompts();
      setIsAddDialogOpen(false);
      setFormData(initialFormState);
      setNotification({ open: true, message: 'Thêm prompt thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Thêm prompt thất bại!', severity: 'error' });
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      code: prompt.code,
      title: prompt.title,
      version: prompt.version,
      inputVariables: prompt.inputVariables,
      status: prompt.status,
      description: prompt.description,
      content: prompt.content,
    });
  };

  const handleUpdate = async () => {
    if (!editingPrompt) return;
    try {
      await apiRequest(`/admin/prompts/${editingPrompt.id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      await refreshPrompts();
      setEditingPrompt(null);
      setFormData(initialFormState);
      setNotification({ open: true, message: 'Cập nhật prompt thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: 'Cập nhật prompt thất bại!', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa prompt này?")) {
      try {
        await apiRequest(`/admin/prompts/${id}`, {
          method: "DELETE"
        });
        await refreshPrompts();
        setNotification({ open: true, message: 'Xóa prompt thành công!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setNotification({ open: true, message: 'Xóa prompt thất bại!', severity: 'error' });
      }
    }
  };

  const isFormValid =
    formData.code.trim() &&
    formData.title.trim() &&
    formData.version.trim() &&
    formData.content.trim();

  const getStatusLabel = (status: string) => {
  return status === "active"
    ? "Hoạt động"
    : "Bảo trì";
  };

  const getStatusStyle = (status: string) => {
  return status === "active"
    ? {
        bgcolor: "#dcfce7",
        color: "#15803d",
      }
    : {
        bgcolor: "#fee2e2",
        color: "#b91c1c",
      };
  };

  const renderFormFields = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mt: 1 }}>
      <TextField
        fullWidth
        size="small"
        label="Mã Prompt"
        placeholder="Ví dụ: 101"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        label="Tiêu đề"
        placeholder="Nhập tiêu đề prompt"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        sx={inputSx}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Phiên bản"
          placeholder="Ví dụ: 1.0.0"
          value={formData.version}
          onChange={(e) =>
            setFormData({ ...formData, version: e.target.value })
          }
          sx={inputSx}
        />

        <FormControl fullWidth size="small" sx={inputSx}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Bảo trì / Khóa</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Biến đầu vào"
        placeholder="Ví dụ: {skills}, {interests}"
        value={formData.inputVariables}
        onChange={(e) =>
          setFormData({ ...formData, inputVariables: e.target.value })
        }
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        multiline
        rows={3}
        label="Mô tả"
        placeholder="Nhập mô tả ngắn gọn"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        sx={inputSx}
      />

      <TextField
        fullWidth
        size="small"
        multiline
        rows={6}
        label="Nội dung"
        placeholder="Nhập nội dung cấu hình prompt cho AI..."
        value={formData.content}
        onChange={(e) =>
          setFormData({ ...formData, content: e.target.value })
        }
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
            Quản lý Prompt
          </Typography>

          <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
            Quản lý các kịch bản và prompt cho AI
          </Typography>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<Add sx={{ fontSize: 18 }} />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={addButtonSx}
        >
          Thêm Prompt
        </Button>
      </Box>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setFormData(initialFormState);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Thêm Prompt mới
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Nhập thông tin prompt để thêm vào hệ thống
          </Typography>
        </DialogTitle>

        <DialogContent>{renderFormFields()}</DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setIsAddDialogOpen(false);
              setFormData(initialFormState);
            }}
            sx={cancelButtonSx}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!isFormValid}
            sx={primaryButtonSx}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editingPrompt}
        onClose={() => {
          setEditingPrompt(null);
          setFormData(initialFormState);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700, color: textMain }}>
          Cập nhật Prompt
          <Typography sx={{ color: textMuted, fontSize: 14, mt: 0.5 }}>
            Chỉnh sửa thông tin prompt
          </Typography>
        </DialogTitle>

        <DialogContent>{renderFormFields()}</DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setEditingPrompt(null);
              setFormData(initialFormState);
            }}
            sx={cancelButtonSx}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!isFormValid}
            sx={primaryButtonSx}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
            Tra cứu Prompt
          </Typography>

          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
            Tìm kiếm prompt theo mã, tiêu đề hoặc mô tả
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

      <Card elevation={0} sx={{ ...cardSx, mb: 0 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: textMain,
              mb: 2,
            }}
          >
            Danh sách Prompt ({filteredPrompts.length})
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
                  {[
                    "Mã Prompt",
                    "Tiêu đề",
                    "Phiên bản",
                    "Trạng thái",
                    "Ngày tạo",
                    "Thao tác",
                  ].map((head) => (
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
                {filteredPrompts.map((prompt) => (
                  <TableRow
                    key={prompt.id}
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
                          fontSize: 14,
                          fontWeight: 700,
                          color: textMain,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {prompt.code}
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
                        {prompt.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: textMuted,
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {prompt.description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={prompt.version}
                        size="small"
                        sx={{
                          bgcolor: "#f3f4f6",
                          color: textMain,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getStatusLabel(prompt.status)}
                        size="small"
                        sx={{
                          ...getStatusStyle(prompt.status),
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: textMuted }}>
                        {prompt.createdAt}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleEdit(prompt)}
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
                          onClick={() => handleDelete(prompt.id)}
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

                {filteredPrompts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>
                          Không tìm thấy Prompt nào.
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
    fontSize: 14,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: orange,
  },
};

const cardSx = {
  border: `1px solid ${borderColor}`,
  borderRadius: "18px",
  bgcolor: "#fff",
  mb: 3,
};

const addButtonSx = {
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