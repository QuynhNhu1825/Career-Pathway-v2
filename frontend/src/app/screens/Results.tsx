import { useState, useEffect } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  Chip,
  Grid,
  Rating,
  TextField
} from "@mui/material";
import {
  Download, Home, AutoAwesome as Sparkles, CheckCircle,
  ErrorOutline as AlertCircle, TrendingUp, School, BusinessCenter,
  ListAlt, Link as LinkIcon, RateReview
} from "@mui/icons-material";
import { green, amber, red, blue } from "@mui/material/colors";
import { AuthUser } from "../App";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OpenInNew from '@mui/icons-material/OpenInNew';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ResultsProps {
  authUser: AuthUser & { age?: number; educationLevel?: string };
  sessionId: string;
  onDashboard: () => void;
  onHome: () => void;
}

export function Results({
  authUser,
  sessionId,
  onDashboard,
  onHome,
}: ResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const claimResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/assessment/claim`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, userId: authUser.id }),
        });
        const data = await response.json();
        if (data.success) {
          setResultData(data);
        } else {
          throw new Error(data.message || "Không thể lấy kết quả đánh giá.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && authUser?.id) {
      claimResult();
    }
  }, [sessionId, authUser]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color="warning" />
        <Typography sx={{ mt: 2 }}>Đang lấy kết quả phân tích từ AI...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', px: 2 }}>
        <Typography color="error" variant="h6">Lỗi khi lấy kết quả</Typography>
        <Typography color="error.main" sx={{ mt: 1, mb: 3 }}>{error}</Typography>
        <Button onClick={onHome} variant="outlined">Về trang chủ</Button>
      </Box>
    );
  }

  if (!resultData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Không có dữ liệu kết quả.</Typography>
        <Button onClick={onHome} sx={{ mt: 2 }} variant="outlined">Về trang chủ</Button>
      </Box>
    );
  }

  const evaluation = resultData.evaluation || {};
  const firstCompatible = evaluation.compatibleCareers?.[0] || {};
  
  const strengths = evaluation.strengths || firstCompatible.strengths || [];
  const weaknesses = evaluation.weaknesses || firstCompatible.weaknesses || [];
  const advice = evaluation.advice || firstCompatible.advice;
  
  // Lấy dữ liệu cho Thị trường tuyển dụng (Người đi làm / Sinh viên)
  const companies = evaluation.companies || firstCompatible.companies || [];
  const roadmap = evaluation.roadmap || firstCompatible.roadmap || [];

  // Lấy dữ liệu cho Khối đào tạo (Học sinh THPT)
  const trainingInstitutions =
    evaluation.trainingInstitutions ||
    firstCompatible.trainingInstitutions ||
    evaluation.compatibleCareers?.flatMap((career: any) => career.trainingInstitutions || []) ||
    [];

  const career = evaluation.career || 
                 evaluation.targetCareer || 
                 firstCompatible.careerName || 
                 "ngành đã chọn";

  const matchScore5 = evaluation.score || firstCompatible.score || 3.5; 

  const handleExportPDF = () => {
    const input = document.getElementById("pdf-export-content");
    if (!input) {
      alert("Không tìm thấy nội dung để xuất PDF.");
      return;
    }

    setExportingPdf(true);
    const buttonsToHide = input.querySelectorAll("button");
    buttonsToHide.forEach(btn => btn.style.display = 'none');

    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        buttonsToHide.forEach(btn => btn.style.display = 'inline-flex');
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
          position = -heightLeft;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
        pdf.save(`career-pathway-report-${authUser.name}-${sessionId}.pdf`);
        setExportingPdf(false);
      })
      .catch(() => {
        buttonsToHide.forEach(btn => btn.style.display = 'inline-flex');
        alert("Đã có lỗi xảy ra trong quá trình xuất PDF.");
        setExportingPdf(false);
      });
  };

  const matchColor = matchScore5 >= 4.0 ? green[600] : matchScore5 >= 3.0 ? amber[600] : red[500];
  const matchBgColor = matchScore5 >= 4.0 ? green[50] : matchScore5 >= 3.0 ? amber[50] : red[50];
  const matchBorderColor = matchScore5 >= 4.0 ? green[200] : matchScore5 >= 3.0 ? amber[200] : red[200];
  const matchProgressColor = matchScore5 >= 4.0 ? "success" : matchScore5 >= 3.0 ? "warning" : "error";
  const matchLabel = matchScore5 >= 4.0 ? "Rất phù hợp" : matchScore5 >= 3.0 ? "Khá phù hợp" : "Cần cân nhắc";

  const getBenchmarkString = (school: any) => {
    const parts = [];
    if (school.benchmark2025 != null) parts.push(`2025: ${school.benchmark2025}`);
    if (school.benchmark2024 != null) parts.push(`2024: ${school.benchmark2024}`);
    if (school.benchmark2023 != null) parts.push(`2023: ${school.benchmark2023}`);
    if (parts.length > 0) return parts.join(' - ');
    return school.benchmarkScores || 'Đang cập nhật';
  };

  const handleSubmitFeedback = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/survey/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sessionId: sessionId,
            ratingScore: rating,
          comment: feedback,
          userId: authUser.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gửi đánh giá thất bại");

      setFeedbackMessage({ type: 'success', text: 'Cảm ơn bạn đã gửi đánh giá! Ý kiến của bạn giúp AI cải thiện chất lượng tư vấn.' });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setFeedbackMessage({ type: 'error', text: err.message || 'Đã có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, bgcolor: "#f59e0b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>CP</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>Kết quả đánh giá</Typography>
                <Typography variant="caption" color="text.secondary">{authUser.name} • {career}</Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={handleExportPDF} startIcon={exportingPdf ? <CircularProgress size={16} color="inherit" /> : <Download sx={{ fontSize: 16 }} />} disabled={exportingPdf}>
                {exportingPdf ? "Đang xuất..." : "Xuất PDF"}
              </Button>
              <Button variant="contained" size="small" onClick={onDashboard} startIcon={<DashboardIcon sx={{ fontSize: 18 }}/>} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
                Dashboard
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div id="pdf-export-content">
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ borderRadius: 4, border: 2, p: 3, borderColor: matchBorderColor, bgcolor: matchBgColor }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: "4rem", fontWeight: "bold", color: matchColor, fontFamily: "monospace", lineHeight: 1 }}>
                      {matchScore5}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", mt: 1, color: matchColor }}>
                      {matchLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Thang điểm 5.0)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: "serif", mb: 1 }}>
                    Mức độ phù hợp với ngành <Box component="span" sx={{ color: amber[600] }}>{career}</Box>
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    {evaluation.summary || `AI đã phân tích các câu trả lời của bạn để đưa ra đánh giá về mức độ phù hợp với ngành ${career}.`}
                  </Typography>
                  <LinearProgress variant="determinate" value={(matchScore5 / 5) * 100} color={matchProgressColor} sx={{ height: 12, borderRadius: 6 }} />
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider', height: '100%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <Box sx={{ width: 32, height: 32, bgcolor: green[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle sx={{ fontSize: 18, color: green[600] }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Điểm mạnh nổi bật</Typography>
                  </Stack>
                  {strengths && strengths.length > 0 ? (
                    <List dense disablePadding>
                      {strengths.map((s: string) => (
                        <ListItem key={s} disableGutters>
                          <ListItemIcon sx={{ minWidth: 20 }}><Box sx={{ width: 6, height: 6, bgcolor: green[500], borderRadius: '50%' }} /></ListItemIcon>
                          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{s}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Tiếp tục phát triển đều các chiều năng lực</Typography>
                  )}
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider', height: '100%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <Box sx={{ width: 32, height: 32, bgcolor: amber[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertCircle sx={{ fontSize: 18, color: amber[600] }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Cần phát triển thêm</Typography>
                  </Stack>
                  {weaknesses && weaknesses.length > 0 ? (
                    <List dense disablePadding>
                      {weaknesses.map((w: string) => (
                        <ListItem key={w} disableGutters>
                          <ListItemIcon sx={{ minWidth: 20 }}><Box sx={{ width: 6, height: 6, bgcolor: amber[500], borderRadius: '50%' }} /></ListItemIcon>
                          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{w}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Hồ sơ năng lực của bạn khá cân bằng và vững chắc</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
            
            {/* ================= CHẾ ĐỘ 1: THỊ TRƯỜNG TUYỂN DỤNG & LỘ TRÌNH (CHO NGƯỜI ĐI LÀM / SINH VIÊN) ================= */}
            {companies && companies.length > 0 && (
              <>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'secondary.light', bgcolor: 'white' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                    <Box sx={{ width: 40, height: 40, bgcolor: amber[50], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BusinessCenter sx={{ fontSize: 24, color: amber[700] }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: amber[700] }}>Thị Trường Tuyển Dụng</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Công ty đang tuyển dụng:
                      </Typography>
                      <Stack spacing={1.5}>
                        {companies.map((comp: any, i: number) => (
                          <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} flexWrap="wrap">
                              <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'secondary.main' }}>
                                  {comp.companyName}
                                </Typography>
                                {comp.companyDescription && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {comp.companyDescription}
                                  </Typography>
                                )}
                                {comp.basicSalary && (
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    <b>Mức lương:</b> {comp.basicSalary}
                                  </Typography>
                                )}
                                {comp.laborMarket && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    <b>Thị trường:</b> {comp.laborMarket}
                                  </Typography>
                                )}
                              </Box>
                              {comp.careerLink && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
                                  component="a"
                                  href={comp.careerLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ borderColor: 'secondary.main', color: 'secondary.main', flexShrink: 0 }}
                                >
                                  Xem tuyển dụng
                                </Button>
                              )}
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>

                {/* Khối lộ trình phát triển đi kèm chung với thị trường tuyển dụng */}
                {roadmap && roadmap.length > 0 && (
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                      <Box sx={{ width: 40, height: 40, bgcolor: green[50], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ListAlt sx={{ fontSize: 24, color: green[600] }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[700] }}>Lộ Trình Phát Triển</Typography>
                    </Stack>
                    <List dense disablePadding>
                      {roadmap.map((item: any, i: number) => (
                        <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'grey.200', bgcolor: 'grey.50', mb: 1.5 }}>
                          <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                            <CheckCircle sx={{ fontSize: 18, color: green[600], mt: 0.5, flexShrink: 0 }} />
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                {item.stage}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.desc}
                              </Typography>
                            </Box>
                          </Stack>
                          {item.certs && item.certs.length > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, pl: 3 }}>
                              Chứng chỉ: {item.certs.join(', ')}
                            </Typography>
                          )}
                        </Paper>
                      ))}
                    </List>
                  </Paper>
                )}
              </>
            )}

            {/* ================= CHẾ ĐỘ 2: TRƯỜNG ĐÀO TẠO (CHO HỌC SINH THPT) ================= */}
            {(!companies || companies.length === 0) && trainingInstitutions && trainingInstitutions.length > 0 && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'primary.light', bgcolor: 'white' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                  <Box sx={{ width: 40, height: 40, bgcolor: blue[50], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <School sx={{ fontSize: 24, color: blue[600] }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Ngành Nghề Tối Ưu & Trường Đào Tạo</Typography>
                  </Box>
                </Stack>
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Top các trường đào tạo nổi bật:
                </Typography>

                <Grid container spacing={2}>
                  {trainingInstitutions.map((school: any, index: number) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 1.5, color: 'primary.main' }}>{school.schoolName}</Typography>
                          
                          {school.description && <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>{school.description}</Typography>}

                          <Chip 
                            icon={<TrendingUp />} 
                            label={`Điểm chuẩn: ${getBenchmarkString(school)}`} 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontWeight: 'medium', mb: 2, alignSelf: 'flex-start' }}
                          />

                          <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                            {school.officialLink && (
                              <Button size="small" variant="text" href={school.officialLink} target="_blank" startIcon={<Home sx={{ fontSize: 16 }} />}>
                                Trang chủ
                              </Button>
                            )}
                            {school.admissionLink && (
                              <Button size="small" variant="text" href={school.admissionLink} target="_blank" startIcon={<LinkIcon sx={{ fontSize: 16 }} />}>
                                Tuyển sinh
                              </Button>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Thông báo nếu rỗng dữ liệu hoàn toàn */}
            {(!companies || companies.length === 0) && (!trainingInstitutions || trainingInstitutions.length === 0) && (
              <Alert severity="info" variant="outlined">
                Hệ thống chưa tìm thấy dữ liệu định hướng chi tiết (Trường học hoặc Doanh nghiệp) phù hợp cho hồ sơ này.
              </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 32, height: 32, bgcolor: amber[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles sx={{ fontSize: 18, color: amber[600] }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Lời khuyên từ AI</Typography>
                </Stack>
              </Stack>
              <Alert severity="info" variant="outlined" sx={{ borderColor: 'info.light', bgcolor: 'info.lighter' }}>
                {advice || `Chào ${authUser.name}, dựa trên các câu trả lời, AI nhận thấy bạn có những tố chất phù hợp với ngành ${career}. Hãy tập trung phát triển các điểm mạnh và cải thiện các điểm yếu để tối đa hóa cơ hội thành công.`}
              </Alert>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Box sx={{ width: 32, height: 32, bgcolor: blue[50], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RateReview sx={{ fontSize: 18, color: blue[600] }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Đánh Giá Độ Chính Xác Của AI
                </Typography>
              </Stack>

              <Typography color="text.secondary" mb={3}>
                Đánh giá mức độ hài lòng về điểm số và phản biện của AI:
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Rating
                  name="ai-evaluation-rating"
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ color: amber[500], fontSize: '3rem', gap: 1 }}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Nhập ý kiến đóng góp của bạn để tinh chỉnh thuật toán AI..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{
                  bgcolor: '#f9fafb',
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

              {feedbackMessage && (
                <Alert severity={feedbackMessage.type} sx={{ mt: 2 }}>
                  {feedbackMessage.text}
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "right", width: "100%" }}>
                <Button
                  variant="contained"
                  sx={{ mt: 3, bgcolor: "#f59e0b", "&:hover": { bgcolor: "#ca8a04" } }}
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback}
                  startIcon={submittingFeedback ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  Gửi đánh giá
                </Button>
              </Box>
            </Paper>

          </Stack>
        </div>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" pt={4} pb={2}>
          <Button variant="outlined" onClick={onHome} startIcon={<Home />}>
            Về trang chủ
          </Button>
          <Button variant="contained" onClick={onDashboard} startIcon={<DashboardIcon sx={{ fontSize: 18 }}/>} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
            Xem Dashboard cá nhân
          </Button>
          <Button variant="outlined" onClick={handleExportPDF} startIcon={exportingPdf ? <CircularProgress size={16} /> : <Download />} sx={{ color: amber[700], borderColor: amber[300], '&:hover': { bgcolor: amber[50], borderColor: amber[400] } }} disabled={exportingPdf}>
            {exportingPdf ? "Đang xuất..." : "Xuất PDF"}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
