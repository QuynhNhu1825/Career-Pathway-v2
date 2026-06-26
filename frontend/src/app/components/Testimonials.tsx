import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Star, CheckCircle } from "@mui/icons-material";
import { amber } from "@mui/material/colors";

const testimonials = [
  {
    name: "Nguyễn Minh Châu",
    role: "Học sinh lớp 12",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    content: "Ban đầu mình rất bối rối không biết nên chọn ngành gì. Career Pathway đã giúp mình hiểu rõ bản thân qua các câu hỏi tình huống thực tế. Kết quả rất chính xác!",
    rating: 5,
    score: "Điểm phù hợp: 4.2/5.0"
  },
  {
    name: "Phạm Tuấn Anh",
    role: "Sinh viên năm 1",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    content: "Hệ thống AI phân tích rất chi tiết. Mình thích nhất là phần biểu đồ RIASEC và lộ trình kỹ năng. Chatbox AI cũng trả lời rất hữu ích!",
    rating: 5,
    score: "Điểm phù hợp: 3.8/5.0"
  },
  {
    name: "Lê Thanh Hà",
    role: "Sinh viên chuyển ngành",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    content: "Deep Scan khi điểm thấp giúp mình hiểu tại sao ngành cũ không phù hợp. Pivot Logic đề xuất ngành mới rất hợp lý. Cảm ơn Career Pathway!",
    rating: 5,
    score: "Điểm phù hợp: 2.7 → 4.5/5.0"
  },
];

export function Testimonials() {
  return (
    <Box component="section" id="testimonials" sx={{ py: 10, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label="Phản hồi từ người dùng" sx={{ mb: 2 }} />
          <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Người Dùng Nói Gì Về Chúng Tôi
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Hàng nghìn người đã tìm ra định hướng đúng đắn
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderColor: "grey.200",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: amber[300], boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={0.5} mb={2}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: amber[400] }} />
                    ))}
                  </Stack>

                  <Typography color="text.secondary" sx={{ mb: 3, fontStyle: "italic" }}>
                    "{testimonial.content}"
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, p: 1, bgcolor: amber[50], borderRadius: 2, mb: 3 }}
                  >
                    <CheckCircle sx={{ fontSize: 18, color: amber[500] }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: amber[700] }}>{testimonial.score}</Typography>
                  </Paper>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={testimonial.avatar} alt={testimonial.name} />
                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>{testimonial.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
