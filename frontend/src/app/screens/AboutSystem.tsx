import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface AboutSystemProps {
  onBack: () => void;
}

const technologies = [
  "React",
  "TypeScript",
  "Material UI",
  "ASP.NET Core Web API",
  "SQL Server",
  "Gemini AI",
  "O*NET Database",
];

const features = [
  "Đánh giá hướng nghiệp",
  "Chế độ Targeted",
  "Chế độ Discovery",
  "Phân tích AI",
  "Lưu lịch sử đánh giá",
  "Chatbot tư vấn",
];

export default function AboutSystem({ onBack }: AboutSystemProps) {
  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <PsychologyIcon color="warning" sx={{ fontSize: 44 }} />
            <Typography variant="h3" fontWeight={700}>
              Giới thiệu hệ thống
            </Typography>
          </Stack>

          <Typography component="p" color="text.secondary" sx={{ mb: 4 }}>
            Career Pathway là hệ thống hỗ trợ tư vấn hướng nghiệp ứng dụng trí tuệ
            nhân tạo, giúp người dùng lựa chọn ngành học và nghề nghiệp phù hợp.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h5" fontWeight={700} gutterBottom>
            1. Tổng quan hệ thống
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            Career Pathway được xây dựng nhằm hỗ trợ học sinh, sinh viên trong quá
            trình định hướng nghề nghiệp. Hệ thống kết hợp dữ liệu học tập, sở thích,
            bài đánh giá tâm lý nghề nghiệp và phân tích AI để đưa ra gợi ý phù hợp.
          </Typography>
          <Typography component="p" sx={{ mb: 3 }}>
            Thay vì lựa chọn ngành học theo cảm tính, người dùng có thể tham khảo kết
            quả đánh giá dựa trên dữ liệu và các mô hình hướng nghiệp phổ biến.
          </Typography>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            2. Mục tiêu của hệ thống
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            Mục tiêu chính của Career Pathway là giúp người dùng hiểu rõ hơn về năng
            lực, tính cách, sở thích và định hướng phát triển của bản thân.
          </Typography>
          <Typography component="p" sx={{ mb: 3 }}>
            Từ đó, hệ thống hỗ trợ đề xuất ngành học, nghề nghiệp, kỹ năng cần phát
            triển và lộ trình học tập phù hợp trong tương lai.
          </Typography>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            3. Chức năng nổi bật
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            {features.map((item) => (
              <Grid key={item}>
                <Chip label={item} color="warning" />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            4. Các mô hình đánh giá
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            Hệ thống sử dụng mô hình RIASEC để phân loại xu hướng nghề nghiệp theo
            các nhóm như Realistic, Investigative, Artistic, Social, Enterprising và
            Conventional.
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            Bên cạnh đó, Big Five hỗ trợ phân tích đặc điểm tính cách, còn SCCT giúp
            xem xét sự tự tin, mục tiêu và yếu tố môi trường trong quá trình lựa chọn
            nghề nghiệp.
          </Typography>
          <Typography component="p" sx={{ mb: 3 }}>
            Việc kết hợp nhiều mô hình giúp kết quả tư vấn có tính toàn diện hơn.
          </Typography>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            5. Công nghệ sử dụng
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            {technologies.map((item) => (
              <Grid key={item}>
                <Chip label={item} variant="outlined" color="warning" />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            6. Ý nghĩa thực tiễn
          </Typography>
          <Typography component="p" sx={{ mb: 4 }}>
            Career Pathway giúp giảm tình trạng chọn sai ngành, thiếu định hướng hoặc
            lựa chọn nghề nghiệp theo cảm tính. Hệ thống có thể được sử dụng như một
            công cụ tham khảo trong hoạt động tư vấn hướng nghiệp tại nhà trường.
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