import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography,
  Rating,
  TextField,
  Alert,
} from "@mui/material";
import {
  ArrowForward as ArrowRight,
  AutoAwesome as Sparkles,
  Code as Code2,
  Palette,
  People as Users,
  BarChart as BarChart3,
  Home,
  BusinessCenter,
  School,
  Apartment,
  TrendingUp,
  Psychology,
  CheckCircle,
  ErrorOutline,
  RateReview,
} from "@mui/icons-material";
import { blue, amber, purple, green } from "@mui/material/colors";
import { AuthUser } from "../App";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface CareerRecommendationProps {
  authUser: AuthUser;
  sessionId: string;
  initialEvaluation: any | null;
  onContinue: (career: string) => void;
  onHome: () => void;
}

interface CareerSuggestion {
  name: string;
  careerName?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  matchRate?: string;
  jobDescription?: string;
  roles?: string;
  outlook?: string;
  requiredSkills?: string;
  studyInfo?: {
    topSchools?: string[];
  };
  workInfo?: {
    hiringCompanies?: string[];
    marketDemand?: string;
  };
  trainingInstitutions?: {
    schoolName: string;
    benchmark2024?: number;
    benchmark2023?: number;
    benchmark2025?: number;
    officialLink?: string;
    admissionLink?: string;
  }[];
}

const iconMap: Record<string, React.ElementType> = {
  "phần mềm": Code2,
  "kỹ sư": Code2,
  "lập trình": Code2,
  "công nghệ": Code2,
  it: Code2,
  "thiết kế": Palette,
  "ux/ui": Palette,
  "nghệ thuật": Palette,
  "dự án": BarChart3,
  "quản lý": BarChart3,
  "kinh doanh": BarChart3,
  "nhân sự": Users,
  "xã hội": Users,
  "giáo dục": Users,
  marketing: BarChart3,
  data: BarChart3,
  "phân tích": BarChart3,
};

const colors = [
  { color: blue[600], bgColor: blue[50] },
  { color: amber[700], bgColor: amber[50] },
  { color: purple[600], bgColor: purple[50] },
  { color: green[600], bgColor: green[50] },
];

function getVisualsForCareer(name: string, index: number) {
  const lowerCaseName = name.toLowerCase();
  let IconComponent: React.ElementType = BusinessCenter;

  for (const keyword in iconMap) {
    if (lowerCaseName.includes(keyword)) {
      IconComponent = iconMap[keyword];
      break;
    }
  }

  return {
    icon: IconComponent,
    ...colors[index % colors.length],
  };
}

function formatSuggestionsFromEvaluation(evaluation: any): CareerSuggestion[] {
  const careers =
    evaluation.compatibleCareers ||
    evaluation.recommendedCareers ||
    evaluation.careerSuggestions ||
    [];

  if (!Array.isArray(careers) || careers.length === 0) {
    throw new Error("AI không đưa ra gợi ý nào. Vui lòng thử lại bài test khác.");
  }

  return careers.map((item: any, index: number) => {
    const careerName = item.career || item.careerName || item.name || "Ngành nghề phù hợp";
    const visuals = getVisualsForCareer(careerName, index);

    return {
      name: careerName,
      careerName: item.careerName,
      icon: visuals.icon,
      color: visuals.color,
      bgColor: visuals.bgColor,
      description:
        item.reason ||
        "AI đã phân tích và gợi ý ngành này dựa trên hồ sơ tính cách và sở thích của bạn.",
      matchRate: item.matchRate,
      jobDescription: item.jobDescription,
      roles: item.roles,
      outlook: item.outlook,
      requiredSkills: item.requiredSkills,
      studyInfo: item.studyInfo,
      workInfo: item.workInfo,
      trainingInstitutions: (item.trainingInstitutions || []).map((school: any) => ({
        schoolName: school.schoolName,
        benchmark2024: school.benchmark2024,
        benchmark2023: school.benchmark2023,
        benchmark2025: school.benchmark2025,
        officialLink: school.officialLink,
        admissionLink: school.admissionLink,
      })),
    };
  });
}

export function CareerRecommendation({
  authUser,
  sessionId,
  initialEvaluation,
  onContinue,
  onHome,
}: CareerRecommendationProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const claimAndFetchSuggestions = async () => {
      if (initialEvaluation) {
        try {
          setEvaluation(initialEvaluation);
          setSuggestions(formatSuggestionsFromEvaluation(initialEvaluation));
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!sessionId || !authUser?.id) {
        setError("Thông tin phiên hoặc người dùng không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/assessment/claim`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            userId: authUser.id,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.evaluation) {
          throw new Error(data.message || "Không thể lấy kết quả gợi ý từ máy chủ.");
        }

        setEvaluation(data.evaluation);
        setSuggestions(formatSuggestionsFromEvaluation(data.evaluation));
      } catch (err: any) {
        setError(err.message || "Đã có lỗi xảy ra khi kết nối API.");
      } finally {
        setLoading(false);
      }
    };

    claimAndFetchSuggestions();
  }, [sessionId, authUser, initialEvaluation]);

  const handleSubmitFeedback = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/survey/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          survey_id: sessionId,
          rating_score: rating,
          comment: feedback,
          userId: authUser.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gửi đánh giá thất bại");
      }

      setFeedbackMessage({ type: 'success', text: 'Cảm ơn bạn đã gửi đánh giá! Ý kiến của bạn giúp AI cải thiện chất lượng tư vấn.' });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setFeedbackMessage({ type: 'error', text: err.message || 'Đã có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setSubmittingFeedback(false);
    }
  };
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f9fafb",
        }}
      >
        <CircularProgress color="warning" />
        <Typography sx={{ mt: 2, fontWeight: 600 }}>
          AI đang tổng hợp các gợi ý nghề nghiệp...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          textAlign: "center",
          px: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="error" variant="h6" fontWeight={700}>
          Đã có lỗi xảy ra
        </Typography>
        <Typography color="error.main" sx={{ mt: 1, mb: 3 }}>
          {error}
        </Typography>
        <Button onClick={onHome} variant="outlined">
          Về trang chủ
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        fontFamily: "Times New Roman",
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#f59e0b",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "white", fontWeight: 700 }}>CP</Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Career <Box component="span" sx={{ color: "#f59e0b" }}>Pathway</Box>
            </Typography>
          </Box>

          <Typography sx={{ flexGrow: 1, textAlign: "center", fontWeight: 700 }}>
            Gợi ý nghề nghiệp
          </Typography>

          <Button
            onClick={onHome}
            startIcon={<Home />}
            sx={{ color: "grey.800", textTransform: "none" }}
          >
            Trang chủ
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={4}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 5,
              textAlign: "center",
              background: "linear-gradient(135deg, #fff7ed, #ffffff)",
            }}
          >
            <Chip
              icon={<Sparkles />}
              label="AI đã phân tích xong bài test của bạn"
              sx={{
                bgcolor: amber[100],
                color: amber[800],
                fontWeight: 700,
                mb: 2,
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontFamily: "Times New Roman",
              }}
            >
              Kết quả định hướng nghề nghiệp
            </Typography>

            <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
              {evaluation?.summary ||
                "Dưới đây là các ngành nghề phù hợp nhất với hồ sơ tính cách, sở thích và câu trả lời của bạn."}
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <CheckCircle color="success" />
                  <Typography variant="h5" fontWeight={700}>
                    Điểm mạnh nổi bật
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {(evaluation?.strengths || []).map((item: string, index: number) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                      {item}
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <ErrorOutline color="warning" />
                  <Typography variant="h5" fontWeight={700}>
                    Cần cải thiện
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {(evaluation?.weaknesses || []).map((item: string, index: number) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                      {item}
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          

          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Danh sách ngành/nghề phù hợp
            </Typography>

            <Stack spacing={3}>
              {suggestions.map((s, index) => {
                const CareerIcon = s.icon;

                return (
                  <Paper
                    key={`${s.name}-${index}`}
                    variant="outlined"
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: 4,
                      transition: "0.2s",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 7 }}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 52,
                              height: 52,
                              bgcolor: s.bgColor,
                              flexShrink: 0,
                            }}
                          >
                            <CareerIcon sx={{ color: s.color, fontSize: 28 }} />
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ wordBreak: "break-word" }}>
                              {s.name}
                            </Typography>

                            {s.matchRate && (
                              <Chip
                                label={`Mức độ phù hợp: ${s.matchRate}`}
                                size="small"
                                sx={{
                                  mt: 0.8,
                                  bgcolor: amber[100],
                                  color: amber[800],
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </Box>
                        </Stack>

                        <Typography color="text.secondary" variant="body2" mb={2}>
                          {s.description}
                        </Typography>

                        {s.jobDescription && (
                          <Box mb={2}>
                            <Typography fontWeight={700} variant="body2">Mô tả công việc</Typography>
                            <Typography color="text.secondary" variant="body2">{s.jobDescription}</Typography>
                          </Box>
                        )}

                        {s.roles && (
                          <Box mb={2}>
                            <Typography fontWeight={700} variant="body2">Vai trò chính</Typography>
                            <Typography color="text.secondary" variant="body2">{s.roles}</Typography>
                          </Box>
                        )}

                        {s.requiredSkills && (
                          <Box mb={2}>
                            <Typography fontWeight={700} variant="body2">Kỹ năng cần có</Typography>
                            <Typography color="text.secondary" variant="body2">{s.requiredSkills}</Typography>
                          </Box>
                        )}

                        {s.outlook && (
                          <Box mb={0}>
                            <Typography fontWeight={700} variant="body2">Triển vọng nghề nghiệp</Typography>
                            <Typography color="text.secondary" variant="body2">{s.outlook}</Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={1.5} sx={{ height: "100%" }}>
                          {s.studyInfo?.topSchools?.length ? (
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: "#f9fafb" }}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <School sx={{ color: amber[700], fontSize: 20 }} />
                                <Typography fontWeight={700} variant="body2">Trường đào tạo</Typography>
                              </Stack>

                              <Stack spacing={0.3}>
                                {s.studyInfo.topSchools.map((school, i) => (
                                  <Typography key={i} variant="body2" color="text.secondary">
                                    • {school}
                                  </Typography>
                                ))}
                              </Stack>
                            </Paper>
                          ) : null}

                          {s.workInfo?.hiringCompanies?.length ? (
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: "#f9fafb" }}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Apartment sx={{ color: blue[600], fontSize: 20 }} />
                                <Typography fontWeight={700} variant="body2">Công ty tuyển dụng</Typography>
                              </Stack>

                              <Stack spacing={0.3}>
                                {s.workInfo.hiringCompanies.map((company, i) => (
                                  <Typography key={i} variant="body2" color="text.secondary">
                                    • {company}
                                  </Typography>
                                ))}
                              </Stack>
                            </Paper>
                          ) : null}

                          {s.workInfo?.marketDemand && (
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: "#f9fafb" }}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <TrendingUp sx={{ color: green[600], fontSize: 20 }} />
                                <Typography fontWeight={700} variant="body2">Nhu cầu thị trường</Typography>
                              </Stack>

                              <Typography variant="body2" color="text.secondary">
                                {s.workInfo.marketDemand}
                              </Typography>
                            </Paper>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>

                    {s.trainingInstitutions && s.trainingInstitutions.length > 0 ? (
                      <>
                        <Divider sx={{ my: 3 }} />

                        <Typography fontWeight={800} mb={2} variant="body1">
                          Thông tin tuyển sinh
                        </Typography>

                        <Grid container spacing={1.5}>
                          {s.trainingInstitutions.map((school, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                              <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "#fff7ed", height: "100%" }}>
                                <Typography fontWeight={700} variant="body2">{school.schoolName}</Typography>
                                
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                  Điểm chuẩn: 2025: {school.benchmark2025 ?? "Chưa rõ"} | 2024:{" "}
                                  {school.benchmark2024 ?? "Chưa rõ"} | 2023:{" "}
                                  {school.benchmark2023 ?? "Chưa rõ"}
                                </Typography>
                             
                                <Stack direction="row" spacing={1} mt={1}>
                                  {school.officialLink && (
                                    <Button
                                      size="small"
                                      href={school.officialLink}
                                      target="_blank"
                                      variant="outlined"
                                      sx={{ textTransform: "none" }}
                                    >
                                      Website
                                    </Button>
                                  )}

                                  {school.admissionLink && (
                                    <Button
                                      size="small"
                                      href={school.admissionLink}
                                      target="_blank"
                                      variant="outlined"
                                      sx={{ textTransform: "none" }}
                                    >
                                      Tuyển sinh
                                    </Button>
                                  )}
                                </Stack>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ) : null}

                    <Box sx={{ textAlign: "right", mt: 3 }}>
                      <Button
                        variant="contained"
                        onClick={() => onContinue(s.name)}
                        endIcon={<ArrowRight />}
                        sx={{
                          bgcolor: "#f59e0b",
                          "&:hover": { bgcolor: "#ca8a04" },
                          color: "#fff",
                          textTransform: "none",
                          borderRadius: 3,
                          px: 3,
                        }}
                      >
                        Test chuyên sâu ngành này
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Avatar sx={{ bgcolor: amber[50], color: amber[700], width: 40, height: 40, borderRadius: 2 }}>
                <Psychology />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
                Lời khuyên từ AI
              </Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {evaluation?.advice || "Với độ tuổi và trình độ của bạn, hãy tiếp tục khám phá năng lực cá nhân và chọn bài test chuyên sâu cho ngành bạn quan tâm. Tập trung vào việc áp dụng kỹ năng vào thực tế và không ngừng học hỏi."}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: blue[50], color: blue[600], width: 40, height: 40, borderRadius: 2 }}>
                <RateReview />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
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
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
                sx={{ 
                  color: amber[500], 
                  fontSize: '3rem',
                  gap: 1
                }} 
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
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
      </Container>
    </Box>
  );
}