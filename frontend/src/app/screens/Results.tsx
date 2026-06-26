import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Download, Home, AutoAwesome as Sparkles, ZoomIn, CheckCircle,
  ErrorOutline as AlertCircle, TrendingUp
} from "@mui/icons-material";
import { green, amber, red } from "@mui/material/colors";
import { AssessmentMode, UserData, Answers, AuthUser } from "../App";
import DashboardIcon from "@mui/icons-material/Dashboard";
interface ResultsProps {
  mode: AssessmentMode;
  userData: UserData;
  personalityAnswers: Answers;
  careerAnswers: Answers;
  career: string;
  authUser: AuthUser;
  onDashboard: () => void;
  onHome: () => void;
}

function computeScores(personalityAnswers: Answers, careerAnswers: Answers) {
  const pCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(personalityAnswers).forEach((v) => { if (v in pCounts) pCounts[v]++; });

  const cCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(careerAnswers).forEach((v) => { if (v in cCounts) cCounts[v]++; });

  const total = (obj: Record<string, number>) => Object.values(obj).reduce((a, b) => a + b, 0);
  const pTotal = total(pCounts) || 1;
  const cTotal = total(cCounts) || 1;

  const pct = (n: number, t: number) => Math.round((n / t) * 100);

  return {
    analytical: Math.min(95, pct(pCounts.A, pTotal) * 4 + 20),
    creative: Math.min(95, pct(pCounts.B, pTotal) * 4 + 20),
    communication: Math.min(95, pct(pCounts.C, pTotal) * 4 + 20),
    organization: Math.min(95, pct(pCounts.D, pTotal) * 4 + 20),
    technical: Math.min(95, pct(cCounts.A + cCounts.B, cTotal) * 3 + 25),
    leadership: Math.min(95, pct(pCounts.A + pCounts.D, pTotal) * 2 + 30),
    matchScore: Math.round(
      (pct(pCounts.A, pTotal) + pct(cCounts.A + cCounts.B, cTotal)) / 2 + 50
    ) || 60, // Ensure not 0 to avoid NaN
  };
}

export function Results({
  mode,
  userData,
  personalityAnswers,
  careerAnswers,
  career,
  authUser,
  onDashboard,
  onHome,
}: ResultsProps) {
  const [deepScan, setDeepScan] = useState(false);
  const [scanning, setScanning] = useState(false);

  const scores = computeScores(
    Object.keys(personalityAnswers).length > 0 ? personalityAnswers : { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" },
    Object.keys(careerAnswers).length > 0 ? careerAnswers : { 1: "A", 2: "A", 3: "A", 4: "A", 5: "A" }
  );

  const matchPct = Math.min(100, Math.max(0, scores.matchScore));
  
  // Quy đổi điểm từ hệ 100 (từ 0-100%) sang hệ 5 (từ 1.0 đến 5.0) tròn 1 chữ số thập phân
  const matchScore5 = Number(((matchPct / 100) * 4 + 1).toFixed(1)); 

  const radarData = [
    { dimension: "Tư duy phân tích", value: scores.analytical },
    { dimension: "Sáng tạo", value: scores.creative },
    { dimension: "Giao tiếp", value: scores.communication },
    { dimension: "Tổ chức", value: scores.organization },
    { dimension: "Kỹ thuật", value: scores.technical },
    { dimension: "Lãnh đạo", value: scores.leadership },
  ];

  const strengths = radarData.filter((d) => d.value >= 65).map((d) => d.dimension);
  const gaps = radarData.filter((d) => d.value < 50).map((d) => d.dimension);

  const handleDeepScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setDeepScan(true); }, 2000);
  };

  const handleExportPDF = () => {
    alert("Tính năng xuất PDF đang được phát triển. Báo cáo sẽ được gửi qua email của bạn sớm!");
  };

  const matchColor = matchScore5 >= 4.0 ? green[600] : matchScore5 >= 3.0 ? amber[600] : red[500];
  const matchBgColor = matchScore5 >= 4.0 ? green[50] : matchScore5 >= 3.0 ? amber[50] : red[50];
  const matchBorderColor = matchScore5 >= 4.0 ? green[200] : matchScore5 >= 3.0 ? amber[200] : red[200];
  const matchProgressColor = matchScore5 >= 4.0 ? "success" : matchScore5 >= 3.0 ? "warning" : "error";
  const matchLabel = matchScore5 >= 4.0 ? "Rất phù hợp" : matchScore5 >= 3.0 ? "Khá phù hợp" : "Cần cân nhắc";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
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
              <Button variant="outlined" size="small" onClick={handleExportPDF} startIcon={<Download sx={{ fontSize: 16 }} />}>
                Xuất PDF
              </Button>
              <Button variant="contained" size="small" onClick={onDashboard} startIcon={<DashboardIcon />} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
                Dashboard
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Match score hero */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: 2, p: 3, borderColor: matchBorderColor, bgcolor: matchBgColor }}>
            <Grid container alignItems="center" spacing={3}>
              {/* Bên trái: điểm số */}
              <Grid size={{ xs: 12, md: 2 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "4rem",
                      fontWeight: "bold",
                      color: matchColor,
                      fontFamily: "monospace",
                      lineHeight: 1,
                    }}
                  >
                    {matchScore5}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                      color: matchColor,
                    }}
                  >
                    {matchLabel}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    (Thang điểm 5.0)
                  </Typography>
                </Box>
              </Grid>

              {/* Bên phải: nội dung */}
              <Grid size={{ xs: 12, md: 10 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "serif",
                    mb: 1,
                  }}
                >
                  Mức độ phù hợp với ngành{" "}
                  <Box component="span" sx={{ color: amber[600] }}>
                    {career}
                  </Box>
                </Typography>

                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  Dựa trên {mode === "discovery" ? "bài test tính cách và " : ""}
                  bài đánh giá chuyên sâu, AI phân tích {radarData.length}
                  chiều năng lực của bạn với yêu cầu của ngành {career}.
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={(matchScore5 / 5) * 100}
                  color={matchProgressColor}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Strengths and Gaps */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider', height: '100%' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Box sx={{ width: 32, height: 32, bgcolor: green[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle sx={{ fontSize: 18, color: green[600] }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Điểm mạnh nổi bật</Typography>
                </Stack>
                {strengths.length > 0 ? (
                  <List dense disablePadding>
                    {strengths.map((s) => (
                      <ListItem key={s} disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}><Box sx={{ width: 6, height: 6, bgcolor: green[500], borderRadius: '50%' }} /></ListItemIcon>
                        <ListItemText primary={s} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">Tiếp tục phát triển đều các chiều năng lực</Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider', height: '100%' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Box sx={{ width: 32, height: 32, bgcolor: amber[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertCircle sx={{ fontSize: 18, color: amber[600] }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Cần phát triển thêm</Typography>
                </Stack>
                {gaps.length > 0 ? (
                  <List dense disablePadding>
                    {gaps.map((g) => (
                      <ListItem key={g} disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}><Box sx={{ width: 6, height: 6, bgcolor: amber[500], borderRadius: '50%' }} /></ListItemIcon>
                        <ListItemText primary={g} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">Hồ sơ năng lực của bạn khá cân bằng và vững chắc</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* AI Analysis */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ width: 32, height: 32, bgcolor: amber[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles sx={{ fontSize: 18, color: amber[600] }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Phân tích AI</Typography>
              </Stack>
              {!deepScan && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDeepScan}
                  disabled={scanning}
                  startIcon={scanning ? <CircularProgress size={14} color="inherit" /> : <ZoomIn sx={{ fontSize: 16 }} />}
                  sx={{ color: amber[700], borderColor: amber[300], '&:hover': { bgcolor: amber[50], borderColor: amber[400] } }}
                >
                  {scanning ? "Đang phân tích..." : "Deep-scan AI"}
                </Button>
              )}
            </Stack>

            <Stack spacing={1.5} sx={{ color: 'text.secondary' }}>
              <Typography variant="body2">
                Dựa trên kết quả đánh giá, <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{authUser.name}</Typography> thể hiện{" "}
                {strengths.length > 0
                  ? `năng lực nổi bật về ${strengths.slice(0, 2).join(" và ")}`
                  : "tiềm năng phát triển đa chiều"}{" "}
                — những yếu tố cốt lõi để thành công trong ngành <Typography component="span" sx={{ fontWeight: 'bold', color: amber[700] }}>{career}</Typography>.
              </Typography>
              <Typography variant="body2">
                Điểm tương thích đạt <Typography component="span" sx={{ fontWeight: 'bold', color: amber[700] }}>{matchScore5}/5.0</Typography> cho thấy bạn có nền tảng{" "}
                {matchScore5 >= 4.0 ? "rất tốt" : "khá tốt"} để phát triển trong lĩnh vực này. Với{" "}
                {userData?.location || "khu vực của bạn"}, thị trường lao động đang có nhu cầu cao về nhân sự ngành{" "}
                {career}.
              </Typography>
            </Stack>

            {deepScan && (
              <Box sx={{ mt: 2.5, pt: 2.5, borderTop: 1, borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                  <Box sx={{ width: 8, height: 8, bgcolor: green[500], borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: green[700], textTransform: 'uppercase', letterSpacing: 1 }}>Kết quả Deep-scan AI</Typography>
                </Stack>

                <Paper elevation={0} sx={{ bgcolor: amber[50], border: 1, borderColor: amber[200], p: 2, borderRadius: 3 }}>
                  <Stack spacing={1}> 
                    <Typography variant="body2" color="text.secondary"><strong>Phân tích chuyên sâu:</strong> Hồ sơ tính cách của bạn phù hợp với nhóm chuyên gia{" "}
                      {scores.analytical > scores.creative ? "thiên về phân tích và kỹ thuật" : "thiên về sáng tạo và đổi mới"}.
                      Trong ngành {career}, nhóm này thường thăng tiến nhanh ở các vị trí{" "}
                      {career === "Kỹ sư phần mềm" ? "Senior Engineer, Tech Lead, Architect" :
                       career === "Thiết kế UX/UI" ? "Senior Designer, Design Lead, Creative Director" :
                       "Senior Manager, Director, C-level"}.
                    </Typography>
                    <Typography variant="inherit"><strong>Pivot logic:</strong> Nếu sau 2 năm bạn muốn chuyển hướng, các ngành liền kề phù hợp nhất là:{" "}
                      {career === "Kỹ sư phần mềm" ? "Data Science, Product Management, CTO startup" :
                       career === "Thiết kế UX/UI" ? "Product Design, Brand Strategy, Creative Consulting" :
                       "Organizational Development, Executive Coaching, Business Consulting"}.
                    </Typography>
                    <Typography variant="inherit"><strong>Lời khuyên ưu tiên:</strong> Tập trung{" "}
                      {gaps.length > 0
                        ? `nâng cao ${gaps[0]} trong 6 tháng tới — đây là khoảng trống lớn nhất so với yêu cầu ngành`
                        : "duy trì và đào sâu các thế mạnh hiện có, đồng thời xây dựng portfolio thực tế"}.
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            )}
          </Paper>

          {/* Recommendations */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Box sx={{ width: 32, height: 32, bgcolor: amber[100], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp sx={{ fontSize: 18, color: amber[600] }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bước tiếp theo được đề xuất</Typography>
            </Stack>
            <Grid container spacing={2}>
              {[
                { step: "01", title: "Xây dựng portfolio", desc: "Tạo 2–3 dự án thực tế trong lĩnh vực " + career, time: "1–3 tháng" },
                { step: "02", title: "Học chứng chỉ cơ bản", desc: "Hoàn thành 1 khóa học chuyên sâu được công nhận trong ngành", time: "3–6 tháng" },
                { step: "03", title: "Tìm mentor & network", desc: "Kết nối với ít nhất 5 chuyên gia trong ngành qua LinkedIn", time: "Ngay bây giờ" },
              ].map((item) => (
                <Grid size={{ xs: 12, sm: 4 }} key={item.step}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography sx={{ fontSize: '1.75rem', fontWeight: 'bold', color: amber[500], fontFamily: 'monospace' }}>{item.step}</Typography>
                      <Typography sx={{ fontWeight: 'bold', mt: 1, mb: 0.5 }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{item.desc}</Typography>
                      <Typography component="span" sx={{ fontSize: '0.75rem', bgcolor: amber[50], color: amber[700], px: 1, py: 0.5, borderRadius: '99px' }}>{item.time}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* CTA */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" pt={4} pb={2}>
            <Button variant="outlined" onClick={onHome} startIcon={<Home />}>
              Về trang chủ
            </Button>
            <Button variant="contained" onClick={onDashboard} startIcon={<DashboardIcon />} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
              Xem Dashboard cá nhân
            </Button>
            <Button variant="outlined" onClick={handleExportPDF} startIcon={<Download />} sx={{ color: amber[700], borderColor: amber[300], '&:hover': { bgcolor: amber[50], borderColor: amber[400] } }}>
              Xuất PDF
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}