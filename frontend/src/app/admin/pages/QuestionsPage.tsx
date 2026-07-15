import { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Paper,
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

interface Question {
  id: string;
  noiDungCH: string;
  cauTL: string;
  ngayTao: string;
}

const orange = "#f59e0b";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiRequest("/admin/questions")
      .then(res => {
        if (res.success) {
          setQuestions(res.questions || []);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const filteredQuestions = questions.filter((question) =>
    (question.noiDungCH || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      {/* Tiêu đề trang */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
            color: textMain,
            letterSpacing: "-0.03em",
          }}
        >
          Quản lý Ngân hàng câu hỏi
        </Typography>
        <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
          Tra cứu các câu hỏi khảo sát trong hệ thống
        </Typography>
      </Box>

      {/* Thanh tìm kiếm (Tra cứu) */}
      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
            Tra cứu câu hỏi
          </Typography>
          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
            Tìm kiếm câu hỏi theo nội dung
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

      {/* Danh sách câu hỏi */}
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
            Danh sách câu hỏi ({filteredQuestions.length})
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
                  {["Mã CH", "Nội dung câu hỏi", "Đáp án JSON", "Ngày tạo"].map(
                    (head) => (
                      <TableCell
                        key={head}
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
                {filteredQuestions.map((question) => (
                  <TableRow
                    key={question.id}
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
                          fontSize: 13,
                          fontWeight: 700,
                          color: textMuted,
                          fontFamily: "monospace",
                        }}
                      >
                        {question.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        title={question.noiDungCH}
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: textMain,
                          maxWidth: 420,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {question.noiDungCH}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        title={question.cauTL}
                        sx={{
                          fontFamily: "monospace",
                          fontSize: 12,
                          color: textMuted,
                          maxWidth: 260,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {question.cauTL || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: textMuted }}>
                        {question.ngayTao}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box sx={{ py: 5, textAlign: "center" }}>
                        <Typography sx={{ color: textMuted }}>
                          Không tìm thấy câu hỏi nào.
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
    "& fieldset": { borderColor },
    "&:hover fieldset": { borderColor: orange },
    "&.Mui-focused fieldset": {
      borderColor: orange,
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": { fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: orange },
};

const cardSx = {
  border: `1px solid ${borderColor}`,
  borderRadius: "18px",
  bgcolor: "#fff",
  mb: 3,
};