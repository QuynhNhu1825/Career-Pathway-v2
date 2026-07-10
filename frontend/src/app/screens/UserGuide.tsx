import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface UserGuideProps {
  onBack: () => void;
}

const steps = [
  "Truy cập hệ thống Career Pathway",
  "Nhập thông tin cá nhân và thông tin học tập",
  "Nếu người dùng nhập ngành nghề mục tiêu, hệ thống chuyển sang chế độ Targeted",
  "Nếu người dùng chưa nhập ngành nghề mục tiêu, hệ thống chuyển sang chế độ Discovery",
  "Thực hiện bài đánh giá hướng nghiệp theo chế độ đã chọn",
  "Đăng nhập hoặc đăng ký tài khoản để xem kết quả",
  "Xem kết quả phân tích và đề xuất từ AI",
  "Chat với Chatbox AI để được tư vấn chi tiết hơn",
];

export default function UserGuide({ onBack }: UserGuideProps) {
  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <MenuBookIcon color="warning" sx={{ fontSize: 42 }} />
            <Typography variant="h3" fontWeight={700}>
              Hướng dẫn sử dụng
            </Typography>
          </Stack>

          <Typography component="p" color="text.secondary" sx={{ mb: 4 }}>
            Trang này hướng dẫn người dùng sử dụng các chức năng chính của hệ thống
            tư vấn hướng nghiệp Career Pathway.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h5" fontWeight={700} gutterBottom>
            Quy trình sử dụng hệ thống
          </Typography>

          <Stepper orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label} active>
                <StepLabel>
                  <Typography fontWeight={600}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="h5" fontWeight={700} gutterBottom>
        Chế độ Targeted
        </Typography>

        <Typography component="p" sx={{ mb: 2 }}>
        Nếu người dùng đã có ngành nghề mục tiêu và nhập ngành nghề đó trong phần
        thông tin cá nhân, hệ thống sẽ chuyển sang chế độ Targeted.
        </Typography>

        <Typography component="p" sx={{ mb: 3 }}>
        Ở chế độ này, hệ thống phân tích thông tin học tập, điểm số và mục tiêu nghề
        nghiệp để đưa ra mức độ phù hợp, đề xuất ngành học, trường học và lộ trình phát triển.
        </Typography>

        <Typography variant="h5" fontWeight={700} gutterBottom>
        Chế độ Discovery
        </Typography>

        <Typography component="p" sx={{ mb: 2 }}>
        Nếu người dùng chưa nhập ngành nghề mục tiêu, hệ thống sẽ chuyển sang chế độ Discovery.
        </Typography>

        <Typography component="p" sx={{ mb: 3 }}>
        Ở chế độ này, người dùng thực hiện bài đánh giá để hệ thống khám phá nhóm ngành,
        nghề nghiệp phù hợp dựa trên sở thích, năng lực và đặc điểm cá nhân.
        </Typography>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            3. Xem kết quả đánh giá
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            Trang kết quả hiển thị điểm phù hợp, biểu đồ năng lực, điểm mạnh, điểm
            cần phát triển và các bước tiếp theo mà người dùng nên thực hiện.
          </Typography>
          <Typography component="p" sx={{ mb: 3 }}>
            Kết quả này giúp người dùng có cái nhìn tổng quan hơn về bản thân trước
            khi đưa ra quyết định chọn ngành hoặc nghề nghiệp.
          </Typography>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            4. Chatbot AI
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            Sau khi có kết quả, người dùng có thể đặt câu hỏi cho Chatbot AI để được
            giải thích thêm về ngành học, kỹ năng, chứng chỉ, lộ trình học tập và cơ
            hội nghề nghiệp.
          </Typography>
          <Typography component="p" sx={{ mb: 3 }}>
            Số lượt hỏi có thể bị giới hạn để đảm bảo hệ thống hoạt động ổn định và
            kiểm soát tài nguyên AI.
          </Typography>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            5. Lưu ý khi sử dụng
          </Typography>
          <Typography component="p" sx={{ mb: 4 }}>
            Người dùng nên trả lời trung thực các câu hỏi đánh giá để hệ thống đưa
            ra kết quả chính xác hơn. Kết quả tư vấn chỉ mang tính tham khảo và nên
            kết hợp với ý kiến từ gia đình, giáo viên hoặc chuyên gia hướng nghiệp.
          </Typography>

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="warning"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
            >
              Quay về trang chủ
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}