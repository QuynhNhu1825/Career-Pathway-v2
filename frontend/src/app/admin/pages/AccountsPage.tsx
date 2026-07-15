import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import {
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
} from "@mui/material";
import {
  Search,
  Lock,
  LockOpen,
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

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiRequest("/admin/accounts")
      .then(res => {
        if (res.success) {
          setAccounts(res.accounts || []);
        }
      })
      .catch(err => console.error("Fetch accounts error:", err));
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      (account.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.tenDangNhap || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.soDienThoai || "").includes(searchTerm)
  );

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
      }
    } catch (err) {
      console.error("Toggle account status error:", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    {
      label: "Tổng tài khoản",
      value: accounts.length,
    },
    {
      label: "Đang hoạt động",
      value: accounts.filter((a) => a.trangThai === 1).length,
    },
    {
      label: "Đã khóa",
      value: accounts.filter((a) => a.trangThai === 0).length,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 700,
            color: textMain,
            letterSpacing: "-0.03em",
          }}
        >
          Quản lý Tài khoản
        </Typography>

        <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
          Quản lý tài khoản người dùng trong hệ thống
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            elevation={0}
            sx={{
              border: `1px solid ${borderColor}`,
              borderRadius: "18px",
              bgcolor: "#fff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: textMuted,
                  mb: 1.5,
                }}
              >
                {stat.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: 34,
                  fontWeight: 800,
                  color:
                    index === 1
                      ? "#16a34a"
                      : index === 2
                      ? "#dc2626"
                      : textMain,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: textMain,
              mb: 0.5,
            }}
          >
            Tra cứu tài khoản
          </Typography>

          <Typography sx={{ fontSize: 14, color: textMuted, mb: 2 }}>
            Tìm kiếm theo họ tên, họ tên, email 
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Nhập thông tin tìm kiếm..."
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
            }}
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
        <CardContent sx={{ p: 3 }}>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: textMain,
              mb: 2,
            }}
          >
            Danh sách tài khoản ({filteredAccounts.length})
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
                    "Người dùng",
                    "Ngày tạo",
                    "Họ tên",
                    "Liên hệ",
                    "Vai trò",
                    "Trạng thái",
                    "Token",
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
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow
                    key={account.id}
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
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: orange,
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(account.hoTen)}
                        </Avatar>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: textMain,
                            }}
                          >
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 12, color: textMuted }}>
                        {account.ngayTao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        {account.hoTen}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 14, color: textMain }}>
                        {account.email || "Chưa cập nhật"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={account.vaiTro}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: borderColor,
                          color: "#374151",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={account.trangThai === 1 ? "Hoạt động" : "Đã khóa"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor:
                            account.trangThai === 1 ? "#dcfce7" : "#fee2e2",
                          color:
                            account.trangThai === 1 ? "#15803d" : "#b91c1c",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={account.token}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: orangeLight,
                          color: "#92400e",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="text"
                        startIcon={
                          account.trangThai === 1 ? <Lock /> : <LockOpen />
                        }
                        onClick={() => toggleAccountStatus(account.id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          color:
                            account.trangThai === 1 ? "#dc2626" : "#16a34a",
                          "&:hover": {
                            bgcolor:
                              account.trangThai === 1 ? "#fee2e2" : "#dcfce7",
                          },
                        }}
                      >
                        {account.trangThai === 1 ? "Khóa" : "Mở khóa"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredAccounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>
                          Không tìm thấy tài khoản phù hợp
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