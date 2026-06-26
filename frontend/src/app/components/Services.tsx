import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import {
  TrackChanges as Target,
  AutoAwesome as Sparkles,
  BarChart as BarChart3,
  ChatBubbleOutline as MessageSquare,
} from "@mui/icons-material";
import { amber } from "@mui/material/colors";

const features = [
  {
    icon: Target,
    title: "Chế độ Targeted",
    description: "Đã có ngành mục tiêu? Hệ thống AI sẽ tạo bộ câu hỏi chuyên sâu đánh giá tương thích với ngành nghề cụ thể của bạn.",
    color: amber[600],
    bgColor: amber[100],
  },
  {
    icon: Sparkles,
    title: "Chế độ Discovery",
    description: "Chưa biết làm gì? AI sẽ khảo sát tổng quát dựa trên RIASEC để tự động đề xuất các ngành nghề phù hợp nhất với bạn.",
    color: "grey.600",
    bgColor: "grey.100",
  },
  {
    icon: BarChart3,
    title: "Phân tích đa chiều",
    description: "Đánh giá toàn diện qua 3 trục: Sở thích (50%), Hành vi (30%) và Kỹ năng (20%) với biểu đồ trực quan.",
    color: amber[600],
    bgColor: amber[100],
  },
  {
    icon: MessageSquare,
    title: "Chatbox AI tư vấn",
    description: "Sau khi có kết quả, được cấp 3 tokens để đặt câu hỏi chuyên sâu với AI về ngành nghề và lộ trình phát triển.",
    color: "grey.600",
    bgColor: "grey.100",
  },
];

export function Services() {
  return (
    <Box component="section" id="features" sx={{ py: 10, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip
            label="Tính năng nổi bật"
            sx={{ bgcolor: amber[100], color: amber[600], mb: 2, fontWeight: 500 }}
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Hệ Thống Đánh Giá Thông Minh
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "md", mx: "auto" }}>
            Kết hợp AI và khoa học tâm lý nghề nghiệp để mang đến kết quả chính xác nhất
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
             <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderColor: "grey.200",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: amber[200], boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Avatar
                        variant="rounded"
                        sx={{ width: 56, height: 56, bgcolor: feature.bgColor, borderRadius: 3 }}
                      >
                        <Icon sx={{ fontSize: 28, color: feature.color }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: { xs: 3, lg: 5 },
            borderRadius: 4,
            border: 1,
            borderColor: "grey.200",
            background: "linear-gradient(to bottom right, #fffbeb, #f9fafb)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
            3 Mô Hình Đánh Giá Khoa Học
          </Typography>
          <Grid container spacing={3}>
            {[
              { value: "50%", title: "Interest Fit", desc: "Đánh giá sở thích theo mô hình RIASEC (Holland)", color: amber[500] },
              { value: "30%", title: "Behavioral Fit", desc: "Phân tích hành vi qua Big Five Personality", color: "grey.600" },
              { value: "20%", title: "Efficacy Fit", desc: "Đánh giá tự tin kỹ năng theo SCCT", color: amber[500] },
            ].map((model) => (
             <Grid size={{ xs: 12, sm: 4 }} key={model.title}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                  <Typography sx={{ fontSize: "2rem", fontWeight: "bold", color: model.color, mb: 1 }}>
                    {model.value}
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>{model.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{model.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
