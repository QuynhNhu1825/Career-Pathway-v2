import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { AssessmentMode, AuthUser, UserData } from "../App";

interface AssessmentProps {
  authUser: AuthUser | null;
  type: AssessmentMode;
  career: string;
  userData: UserData | null;
  onComplete: (sessionId: string, result?: any) => void;
  onBack: () => void;
}

interface Question {
  id: number;
  questionText: string;
  options: { text: string; weight: number }[];
  [key: string]: any; // Allow other properties from backend
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function Assessment({ type, career, userData, authUser, onComplete, onBack }: AssessmentProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testName, setTestName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!userData) {
        setError("Không có thông tin người dùng để tạo bài test.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Sử dụng endpoint /api/survey/init để tạo bài test 15 câu hỏi theo đặc tả.
        const response = await fetch(`${API_URL}/api/survey/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: (() => {
            const body: any = {
              mode: type === "discovery" ? "Discovery" : "Targeted",
              target_career: career,

              age: userData.age,
              education: userData.education,
              location: userData.location,
              hobby: userData.hobby,
              status: userData.status,

              subject_scores: userData.studentScores,
              gpa: userData.workerScores?.gpa
            };

            if (userData.studentScores) {
                body.subject_scores = userData.studentScores;
            }

            if (userData.workerScores) {
                body.gpa = userData.workerScores.gpa;
            }
            return JSON.stringify(body);
          })(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể tải câu hỏi từ máy chủ.");
        }

        const data = await response.json();
        // Backend /api/survey/init trả về sessionId và survey object
        if (data.sessionId && data.survey) {
          setSessionId(data.sessionId);

          // Câu hỏi từ /api/survey/init đã có định dạng options {text, weight}
          // Chỉ cần thêm 'id' để component hoạt động
          const formattedQuestions = data.survey.questions.map((q: any, index: number) => ({
            ...q, // Preserve extra fields like hollandType, trait
            id: index, // Use array index as a stable key for answers
          }));

          setQuestions(formattedQuestions);
          setTestName(data.survey.testName);
        } else {
          throw new Error(data.message || "Dữ liệu câu hỏi không hợp lệ.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [type, career, userData]);

  const handleNext = async () => {
    const q = questions[current];
    const selectedAnswer = answers[q.id];
    if (selectedAnswer === undefined) return;

    // Move to next question or complete
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      // Last question, submit answers and trigger evaluation
      if (sessionId && userData) {
        setLoading(true);
        setError(null);
        try {
          // Backend /api/survey/submit chỉ cần mảng các trọng số (weights) của câu trả lời.
          const answerWeights = questions.map(q => answers[q.id] ?? 3);

          const payload: { sessionId: string; answers: number[]; userId?: number } = {
            sessionId: sessionId,
            answers: answerWeights,
          };
          if (authUser?.id) {
            payload.userId = authUser.id;
          }

          const evalRes = await fetch(`${API_URL}/api/survey/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!evalRes.ok) {
            const errorData = await evalRes.json();
            throw new Error(errorData.message || "Lỗi khi gửi bài đánh giá.");
          }

          const evalData = await evalRes.json();
          // Chuyển kết quả về App.tsx để xử lý điều hướng.
          onComplete(sessionId, evalData);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setError("Không có mã phiên. Không thể gửi bài đánh giá.");
      }
    }
  };

  const handleBack = () => {
    if (current === 0) onBack();
    else setCurrent(current - 1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color="warning" />
        <Typography sx={{ mt: 2 }}>
          {questions.length > 0 ? "Đang xử lý kết quả..." : "Đang tạo bài test cho bạn..."}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', px: 2 }}>
        <Typography color="error" variant="h6">Đã có lỗi xảy ra</Typography>
        <Typography color="error.main" sx={{ mt: 1, mb: 3 }}>{error}</Typography>
        <Button onClick={onBack} variant="outlined">Quay lại</Button>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Không có câu hỏi nào được tải.</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }} variant="outlined">Quay lại</Button>
      </Box>
    );
  }

  const q = questions[current];
  const total = questions.length;
  const progress = ((current) / total) * 100;
  const selectedWeight = answers[q.id];
  const currentOptions = q.options || [];

  const title = type === "discovery"
    ? "Bài test khám phá"
    : `Đánh giá: ${career}`;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f9fafb, #fef3c7)", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 28, height: 28, bgcolor: "#f59e0b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PsychologyIcon sx={{ fontSize: 16, color: "white" }} />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>{title}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
            {current + 1} / {total}
          </Typography>
        </Toolbar>
        <LinearProgress variant="determinate" value={progress} color="warning" />
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: { xs: 4, md: 8 } }}>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, width: "100%" }}>
          <Box mb={4}>
            <Typography component="span" sx={{
              display: 'inline-block', bgcolor: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: '600', px: 1.5, py: 0.5, borderRadius: '9999px', mb: 2, textTransform: 'uppercase', letterSpacing: 1
            }}>
              Câu {current + 1}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {q.questionText}
            </Typography>
          </Box>

          <Stack spacing={2}>
            {currentOptions.map((opt, index) => {
              const isSelected = selectedWeight === opt.weight;
              return (
                <Button
                  key={index}
                  fullWidth
                  variant={isSelected ? "contained" : "outlined"}
                  color="warning"
                  onClick={() => setAnswers({ ...answers, [q.id]: opt.weight })}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    p: 2,
                    textTransform: 'none',
                    borderColor: isSelected ? '#f59e0b' : 'grey.300',
                    backgroundColor: isSelected ? '#fff7ed' : 'white',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: '#fffbeb',
                      borderColor: '#f59e0b',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 28, height: 28, borderRadius: '50%', border: '2px solid',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0, mr: 2,
                      borderColor: isSelected ? '#f59e0b' : 'grey.400',
                      bgcolor: isSelected ? '#f59e0b' : 'transparent',
                      color: isSelected ? 'white' : 'grey.600',
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 500 : 400 }}>
                    {opt.text}
                  </Typography>
                </Button>
              );
            })}
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e5e7eb' }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ color: 'text.secondary' }}>
              Trước
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              disabled={selectedWeight === undefined}
              sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}
            >
              {current === total - 1 ? "Hoàn thành" : "Tiếp theo"}
            </Button>
          </Box>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Không có câu trả lời đúng hay sai — hãy chọn điều phù hợp nhất với bạn
        </Typography>
      </Container>
    </Box>
  );
}
