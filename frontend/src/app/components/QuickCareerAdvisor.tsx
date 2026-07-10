import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider,
  Link,
  Card,
  CardContent
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import { amber, blue } from "@mui/material/colors";

// Chú ý: Đảm bảo route này khớp với setup Express của bạn (ví dụ: /api/search/career)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const suggestions = [
  "Công nghệ thông tin",
  "Marketing",
  "Trí tuệ nhân tạo (AI)",
  "Kế toán",
];

export function QuickCareerAdvisor() {
  const [careerName, setCareerName] = useState("");
  const [answer, setAnswer] = useState(null); // Lưu object JSON trả về
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"HOC" | "LAM" | null>(null);
  const [error, setError] = useState("");

  const handleAsk = async (type: "HOC" | "LAM") => {
    if (!careerName.trim()) {
      setError("Vui lòng điền đầy đủ tên ngành nghề bạn quan tâm.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      setError("Bạn cần đăng nhập để sử dụng chức năng.");
      return;
    }

    setError("");
    setLoading(true);
    setLoadingType(type);
    setAnswer(null);

    try {
      // Gọi tới endpoint mới
      const response = await fetch(`${API_URL}/api/search/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id || "anonymous",
        },
        body: JSON.stringify({
          careerName,
          location: "Việt Nam", // Hardcode vì đã bỏ input
          age: type === "HOC" ? 17 : 22, // Gán tuổi đại diện
        }),
      });

      const data = await response.json();

      // Giả sử API trả về trực tiếp JSON của model hoặc bọc trong object data
      // Tùy vào cách bạn viết controller, hãy điều chỉnh cho phù hợp.
      const resultData = data.data || data; 

      if (response.ok && resultData) {
        setAnswer(resultData);
      } else {
        setError(data.message || "Có lỗi xảy ra từ máy chủ.");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <Box
      component="section"
      id="quickcareer"
      sx={{
        py: 10,
        bgcolor: "#fff",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Chip
            icon={<SmartToyIcon />}
            label="AI Career Assistant"
            sx={{
              bgcolor: amber[100],
              color: amber[800],
              fontWeight: "bold",
            }}
          />

          <Typography variant="h3" fontWeight="bold" textAlign="center">
            Tư vấn nhanh về ngành nghề
          </Typography>

          <Typography
            color="text.secondary"
            textAlign="center"
            maxWidth={700}
          >
            Cung cấp thông tin ngành nghề bạn quan tâm để AI gợi ý lộ trình, trường học hoặc công ty phù hợp nhất.
          </Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 4,
            }}
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Ngành nghề quan tâm"
                placeholder="VD: Công nghệ thông tin"
                value={careerName}
                onChange={(e) => setCareerName(e.target.value)}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  startIcon={
                    loading && loadingType === "HOC" ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SchoolIcon />
                    )
                  }
                  disabled={loading}
                  onClick={() => handleAsk("HOC")}
                >
                  {loading && loadingType === "HOC" ? "Đang phân tích..." : "Đi học"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    loading && loadingType === "LAM" ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <BusinessIcon />
                    )
                  }
                  disabled={loading}
                  onClick={() => handleAsk("LAM")}
                  sx={{ bgcolor: "#f59e0b", "&:hover": { bgcolor: "#ca8a04" } }}
                >
                  {loading && loadingType === "LAM" ? "Đang phân tích..." : "Đi làm"}
                </Button>
              </Stack>

              {error && (
                <Alert severity="error">{error}</Alert>
              )}
            </Stack>
          </Paper>

          {/* Gợi ý ngành nghề */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="center"
            useFlexGap
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, mt: 0.5 }}>
              Gợi ý:
            </Typography>
            {suggestions.map((item) => (
              <Chip
                key={item}
                label={item}
                clickable
                onClick={() => setCareerName(item)}
              />
            ))}
          </Stack>

          {/* HIỂN THỊ KẾT QUẢ JSON TỪ AI */}
          {answer && (
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                mt: 4,
                p: { xs: 2, md: 4 },
                bgcolor: blue[50],
                borderRadius: 4,
                borderColor: blue[100]
              }}
            >
              <Typography variant="h5" fontWeight="bold" color={blue[900]} gutterBottom>
                Tổng quan ngành: {answer.career}
              </Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip size="small" label={`Khu vực: ${answer.location}`} color="primary" variant="outlined" />
                <Chip size="small" label={`Nhóm: ${answer.ageGroup}`} color="primary" variant="outlined" />
              </Stack>
              
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                {answer.summary}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Nhóm học sinh THPT: Hiển thị trường học */}
              {answer.schools && answer.schools.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom display="flex" alignItems="center" gap={1}>
                    <SchoolIcon color="primary" /> Các trường đào tạo tiêu biểu
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    {answer.schools.map((school, idx) => (
                      <Card key={idx} variant="outlined" sx={{ bgcolor: "#fff" }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {school.schoolName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {school.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1.5 }}>
                            <strong>Điểm chuẩn:</strong> {school.benchmarkScores}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            {school.officialLink && (
                              <Link href={school.officialLink} target="_blank" variant="body2" underline="hover">
                                Trang chủ
                              </Link>
                            )}
                            {school.admissionLink && (
                              <Link href={school.admissionLink} target="_blank" variant="body2" underline="hover">
                                Cổng tuyển sinh
                              </Link>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Nhóm Sinh viên/Người đi làm: Hiển thị công ty */}
              {answer.companies && answer.companies.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom display="flex" alignItems="center" gap={1}>
                    <BusinessIcon color="primary" /> Các doanh nghiệp tuyển dụng tiêu biểu
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    {answer.companies.map((company, idx) => (
                      <Card key={idx} variant="outlined" sx={{ bgcolor: "#fff" }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {company.companyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {company.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1.5 }}>
                            <strong>Vị trí phổ biến:</strong> {company.positions}
                          </Typography>
                          {company.careerLink && (
                            <Link href={company.careerLink} target="_blank" variant="body2" underline="hover">
                              Xem trang tuyển dụng
                            </Link>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}