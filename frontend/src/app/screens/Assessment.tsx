import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { Answers } from "../App";

interface AssessmentProps {
  type: "personality" | "career";
  career: string;
  onComplete: (answers: Answers) => void;
  onBack: () => void;
}

const personalityQuestions = [
  {
    id: 1,
    question: "Khi gặp một vấn đề phức tạp, bạn thường làm gì đầu tiên?",
    options: [
      { value: "A", label: "Phân tích từng bước theo logic và dữ liệu" },
      { value: "B", label: "Tìm kiếm giải pháp sáng tạo, không theo lối mòn" },
      { value: "C", label: "Tham khảo ý kiến và lắng nghe người khác" },
      { value: "D", label: "Lập kế hoạch chi tiết và phân bổ nguồn lực" },
    ],
  },
  {
    id: 2,
    question: "Môi trường làm việc lý tưởng của bạn là?",
    options: [
      { value: "A", label: "Yên tĩnh, tập trung, ít bị gián đoạn" },
      { value: "B", label: "Năng động, đầy thách thức và cơ hội mới" },
      { value: "C", label: "Hợp tác nhóm, giao tiếp và kết nối nhiều" },
      { value: "D", label: "Có cấu trúc rõ ràng, quy trình và mục tiêu cụ thể" },
    ],
  },
  {
    id: 3,
    question: "Điều gì mang lại sự thỏa mãn nhất cho bạn trong công việc?",
    options: [
      { value: "A", label: "Tìm ra giải pháp tối ưu cho bài toán khó" },
      { value: "B", label: "Tạo ra điều gì đó mới mẻ và có ý nghĩa" },
      { value: "C", label: "Giúp người khác phát triển và đạt mục tiêu" },
      { value: "D", label: "Hoàn thành dự án đúng hạn và vượt kỳ vọng" },
    ],
  },
  {
    id: 4,
    question: "Bạn học hiệu quả nhất bằng cách nào?",
    options: [
      { value: "A", label: "Đọc tài liệu và nghiên cứu độc lập, chuyên sâu" },
      { value: "B", label: "Thực hành và thử nghiệm trực tiếp" },
      { value: "C", label: "Học qua thảo luận, trao đổi với người khác" },
      { value: "D", label: "Theo dõi hướng dẫn từng bước, có cấu trúc" },
    ],
  },
  {
    id: 5,
    question: "Trong công việc, bạn coi trọng nhất điều gì?",
    options: [
      { value: "A", label: "Độ chính xác và chất lượng cao" },
      { value: "B", label: "Sự sáng tạo và tự do biểu đạt" },
      { value: "C", label: "Mối quan hệ và tinh thần đồng đội" },
      { value: "D", label: "Hiệu quả và kết quả đo lường được" },
    ],
  },
  {
    id: 6,
    question: "Khi phải ra quyết định quan trọng, bạn thường?",
    options: [
      { value: "A", label: "Thu thập và phân tích dữ liệu kỹ lưỡng" },
      { value: "B", label: "Tin vào trực giác và cảm nhận sáng tạo" },
      { value: "C", label: "Tham khảo ý kiến nhiều người liên quan" },
      { value: "D", label: "Cân nhắc rủi ro, lợi ích và tính thực tế" },
    ],
  },
  {
    id: 7,
    question: "Bạn cảm thấy thế nào khi làm việc với số liệu và dữ liệu?",
    options: [
      { value: "A", label: "Rất thoải mái — đây là điểm mạnh của tôi" },
      { value: "B", label: "Bình thường, tôi thích phần sáng tạo hơn" },
      { value: "C", label: "Không phải thế mạnh, tôi giỏi làm việc với người" },
      { value: "D", label: "Ổn nếu có mục đích và quy trình rõ ràng" },
    ],
  },
  {
    id: 8,
    question: "Khi dự án gặp trở ngại bất ngờ, bạn phản ứng như thế nào?",
    options: [
      { value: "A", label: "Phân tích nguyên nhân và tìm giải pháp hệ thống" },
      { value: "B", label: "Nghĩ ra hướng tiếp cận hoàn toàn mới và sáng tạo" },
      { value: "C", label: "Huy động nhóm cùng nhau giải quyết" },
      { value: "D", label: "Điều chỉnh kế hoạch và quản lý rủi ro" },
    ],
  },
  {
    id: 9,
    question: "Bạn muốn đóng góp vào xã hội bằng cách nào?",
    options: [
      { value: "A", label: "Phát triển công nghệ và giải pháp kỹ thuật tiên tiến" },
      { value: "B", label: "Tạo ra nghệ thuật, thiết kế và trải nghiệm đặc sắc" },
      { value: "C", label: "Hỗ trợ và giúp đỡ con người phát triển toàn diện" },
      { value: "D", label: "Tổ chức và quản lý nguồn lực xã hội hiệu quả" },
    ],
  },
  {
    id: 10,
    question: "Khi được giao một dự án mới, điều đầu tiên bạn làm là?",
    options: [
      { value: "A", label: "Nghiên cứu tài liệu và tìm hiểu giải pháp hiện có" },
      { value: "B", label: "Brainstorm ý tưởng sáng tạo và độc đáo" },
      { value: "C", label: "Liên hệ với các bên liên quan để hiểu kỳ vọng" },
      { value: "D", label: "Lập kế hoạch chi tiết với timeline và milestone" },
    ],
  },
  {
    id: 11,
    question: "Bạn thích công việc có đặc điểm gì?",
    options: [
      { value: "A", label: "Nhiều thách thức trí tuệ và bài toán phức tạp" },
      { value: "B", label: "Không gian sáng tạo tự do và đổi mới liên tục" },
      { value: "C", label: "Tương tác với con người thường xuyên" },
      { value: "D", label: "Mục tiêu rõ ràng và đo lường kết quả được" },
    ],
  },
  {
    id: 12,
    question: "Nhìn về tương lai 10 năm, bạn muốn trở thành?",
    options: [
      { value: "A", label: "Chuyên gia hàng đầu trong lĩnh vực kỹ thuật/nghiên cứu" },
      { value: "B", label: "Người sáng tạo với thương hiệu cá nhân nổi bật" },
      { value: "C", label: "Nhà lãnh đạo truyền cảm hứng, phát triển đội ngũ" },
      { value: "D", label: "Giám đốc điều hành tổ chức hoặc doanh nghiệp thành công" },
    ],
  },
  {
    id: 13,
    question: "Phong cách làm việc bạn ưa thích là?",
    options: [
      { value: "A", label: "Độc lập — tự mình nghiên cứu và giải quyết vấn đề" },
      { value: "B", label: "Tự do — ít ràng buộc, tự quyết định cách thực hiện" },
      { value: "C", label: "Cộng tác — luôn làm việc cùng nhóm, hỗ trợ lẫn nhau" },
      { value: "D", label: "Có cấu trúc — quy trình rõ ràng, phân công cụ thể" },
    ],
  },
  {
    id: 14,
    question: "Người khác thường nhận xét bạn là người như thế nào?",
    options: [
      { value: "A", label: "Thông minh, có óc phân tích và tư duy logic" },
      { value: "B", label: "Sáng tạo, độc đáo và có tư duy khác biệt" },
      { value: "C", label: "Thân thiện, đồng cảm và giỏi kết nối" },
      { value: "D", label: "Có tổ chức, đáng tin cậy và thực tế" },
    ],
  },
  {
    id: 15,
    question: "Điều bạn lo ngại nhất khi bước vào nghề nghiệp là?",
    options: [
      { value: "A", label: "Làm việc thiếu chính xác hoặc mắc lỗi kỹ thuật" },
      { value: "B", label: "Công việc nhàm chán, lặp đi lặp lại, không có sáng tạo" },
      { value: "C", label: "Phải làm việc hoàn toàn một mình, không có đồng nghiệp" },
      { value: "D", label: "Thiếu định hướng, mục tiêu không rõ ràng" },
    ],
  },
];

function getCareerQuestions(career: string) {
  return [
    {
      id: 1,
      question: `Bạn đánh giá kiến thức nền tảng của mình về lĩnh vực ${career || "này"} ở mức nào?`,
      options: [
        { value: "A", label: "Rất vững — tôi đã học và thực hành nhiều" },
        { value: "B", label: "Khá tốt — có kiến thức cơ bản, cần bổ sung thêm" },
        { value: "C", label: "Mới bắt đầu — đang tìm hiểu" },
        { value: "D", label: "Chưa có — hoàn toàn mới với lĩnh vực này" },
      ],
    },
    {
      id: 2,
      question: `Bạn đã có kinh nghiệm thực tế liên quan đến ${career || "ngành này"} chưa?`,
      options: [
        { value: "A", label: "Có — đã đi làm hoặc thực tập trong ngành" },
        { value: "B", label: "Một chút — đã làm dự án cá nhân hoặc học thuật" },
        { value: "C", label: "Chưa nhiều — chỉ tìm hiểu qua sách/khóa học" },
        { value: "D", label: "Chưa có — đây là lần đầu tôi khám phá" },
      ],
    },
    {
      id: 3,
      question: `Bạn sẵn sàng đầu tư bao nhiêu thời gian/tuần để học kỹ năng cho ${career || "ngành này"}?`,
      options: [
        { value: "A", label: "20+ giờ/tuần — tôi rất nghiêm túc với mục tiêu này" },
        { value: "B", label: "10–20 giờ/tuần — sẵn sàng đầu tư đáng kể" },
        { value: "C", label: "5–10 giờ/tuần — học song song với công việc/học chính" },
        { value: "D", label: "Dưới 5 giờ/tuần — thời gian có hạn" },
      ],
    },
    {
      id: 4,
      question: `Môi trường làm việc điển hình của ${career || "ngành này"} có phù hợp với bạn không?`,
      options: [
        { value: "A", label: "Rất phù hợp — đúng với sở thích làm việc của tôi" },
        { value: "B", label: "Khá phù hợp — có thể thích nghi dễ dàng" },
        { value: "C", label: "Chấp nhận được — cần thời gian làm quen" },
        { value: "D", label: "Không chắc — chưa hiểu rõ môi trường này" },
      ],
    },
    {
      id: 5,
      question: "Kỳ vọng thu nhập của bạn trong 2 năm đầu là?",
      options: [
        { value: "A", label: "Ưu tiên học hỏi và kinh nghiệm hơn là thu nhập" },
        { value: "B", label: "Thu nhập ở mức trung bình thị trường là đủ" },
        { value: "C", label: "Cần thu nhập ổn định từ tháng đầu tiên" },
        { value: "D", label: "Mức thu nhập cao là điều kiện tiên quyết" },
      ],
    },
    {
      id: 6,
      question: "Bạn tự đánh giá kỹ năng giao tiếp và thuyết trình của mình?",
      options: [
        { value: "A", label: "Rất tốt — thuyết trình và giao tiếp là thế mạnh" },
        { value: "B", label: "Khá tốt — có thể làm tốt khi chuẩn bị kỹ" },
        { value: "C", label: "Trung bình — đang cải thiện dần" },
        { value: "D", label: "Cần phát triển nhiều hơn" },
      ],
    },
    {
      id: 7,
      question: "Bạn có mạng lưới kết nối trong ngành này không?",
      options: [
        { value: "A", label: "Có — quen biết nhiều người trong ngành" },
        { value: "B", label: "Một chút — có vài người quen làm trong ngành" },
        { value: "C", label: "Ít — mới bắt đầu xây dựng network" },
        { value: "D", label: "Chưa có — hoàn toàn chưa có kết nối" },
      ],
    },
    {
      id: 8,
      question: `Cơ hội phát triển và thăng tiến trong ${career || "ngành này"} có hấp dẫn bạn không?`,
      options: [
        { value: "A", label: "Rất hấp dẫn — đây là một trong lý do tôi chọn ngành này" },
        { value: "B", label: "Khá hấp dẫn — có nhiều cơ hội tốt" },
        { value: "C", label: "Bình thường — quan trọng hơn là ổn định" },
        { value: "D", label: "Chưa rõ — cần tìm hiểu thêm" },
      ],
    },
    {
      id: 9,
      question: "Khả năng chịu áp lực và deadline gấp của bạn?",
      options: [
        { value: "A", label: "Rất tốt — tôi làm việc hiệu quả nhất dưới áp lực" },
        { value: "B", label: "Tốt — có thể chịu được áp lực ở mức độ vừa phải" },
        { value: "C", label: "Trung bình — cần cân bằng áp lực hợp lý" },
        { value: "D", label: "Yếu — áp lực cao ảnh hưởng nhiều đến hiệu quả" },
      ],
    },
    {
      id: 10,
      question: "Bạn sẵn sàng làm thêm giờ hoặc linh hoạt thời gian khi cần không?",
      options: [
        { value: "A", label: "Hoàn toàn sẵn sàng — công việc là ưu tiên hàng đầu" },
        { value: "B", label: "Được, trong những giai đoạn quan trọng" },
        { value: "C", label: "Chấp nhận nhưng không muốn thường xuyên" },
        { value: "D", label: "Cần cân bằng rõ ràng giữa công việc và cuộc sống" },
      ],
    },
    {
      id: 11,
      question: "Bạn có sẵn sàng lấy thêm bằng cấp hoặc chứng chỉ chuyên môn không?",
      options: [
        { value: "A", label: "Rất sẵn sàng — coi đây là khoản đầu tư giá trị" },
        { value: "B", label: "Được nếu thực sự cần thiết cho công việc" },
        { value: "C", label: "Cân nhắc tùy theo chi phí và thời gian" },
        { value: "D", label: "Ưu tiên kinh nghiệm thực tế hơn bằng cấp" },
      ],
    },
    {
      id: 12,
      question: "Bạn có thể làm việc hiệu quả trong môi trường đa văn hóa không?",
      options: [
        { value: "A", label: "Rất tốt — thích làm việc với người từ nhiều nền văn hóa" },
        { value: "B", label: "Được — có thể thích nghi tốt" },
        { value: "C", label: "Cần thời gian — đang cải thiện kỹ năng này" },
        { value: "D", label: "Thích môi trường thuần Việt hơn" },
      ],
    },
    {
      id: 13,
      question: `Bạn tự đánh giá bản thân phù hợp với ${career || "ngành này"} ở mức nào?`,
      options: [
        { value: "A", label: "Rất phù hợp — cảm giác đây là đam mê thực sự" },
        { value: "B", label: "Khá phù hợp — nhiều điểm trùng với sở thích" },
        { value: "C", label: "Tương đối — cần khám phá thêm" },
        { value: "D", label: "Chưa chắc — vẫn đang tìm hiểu bản thân" },
      ],
    },
    {
      id: 14,
      question: `Xu hướng phát triển của ${career || "ngành này"} trong 10 năm tới có làm bạn hứng thú không?`,
      options: [
        { value: "A", label: "Rất hứng thú — đây là ngành có tương lai rõ ràng" },
        { value: "B", label: "Hứng thú — có nhiều tiềm năng phát triển" },
        { value: "C", label: "Bình thường — quan trọng là phù hợp với mình" },
        { value: "D", label: "Chưa rõ — cần nghiên cứu thêm về xu hướng" },
      ],
    },
    {
      id: 15,
      question: `Bạn có thể hình dung rõ bản thân trong vai trò ${career || "này"} 5 năm tới không?`,
      options: [
        { value: "A", label: "Rất rõ — tôi đã có vision cụ thể cho hành trình này" },
        { value: "B", label: "Khá rõ — có hướng đi nhưng cần điều chỉnh" },
        { value: "C", label: "Mờ — mường tượng được nhưng chưa chắc chắn" },
        { value: "D", label: "Chưa rõ — vẫn đang khám phá các lựa chọn" },
      ],
    },
  ];
}

export function Assessment({ type, career, onComplete, onBack }: AssessmentProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const questions = type === "personality" ? personalityQuestions : getCareerQuestions(career);
  const q = questions[current];
  const total = questions.length;
  const progress = ((current) / total) * 100;
  const selected = answers[q.id];

  const handleNext = () => {
    if (!selected) return;
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (current === 0) onBack();
    else setCurrent(current - 1);
  };

  const title = type === "personality"
    ? "Bài test tính cách"
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
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {q.question}
            </Typography>
          </Box>

          <Stack spacing={2}>
            {q.options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <Button
                  key={opt.value}
                  fullWidth
                  variant={isSelected ? "contained" : "outlined"}
                  color="warning"
                  onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
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
                    {opt.value}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 500 : 400 }}>
                    {opt.label}
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
              disabled={!selected}
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
