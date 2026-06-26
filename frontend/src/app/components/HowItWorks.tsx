import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import {
  PlayCircleOutline as PlayCircle,
  Psychology as Brain,
  Login as LogIn,
  ShowChart as LineChart,
  CheckCircle,
} from "@mui/icons-material";
import { amber, grey } from "@mui/material/colors";

const steps = [
  {
    step: "01",
    title: "Bắt đầu khảo sát",
    description: "Chọn chế độ Targeted (đã có ngành) hoặc Discovery (khám phá). AI sẽ tạo 15 câu hỏi tình huống phù hợp.",
    icon: PlayCircle,
  },
  {
    step: "02",
    title: "AI phân tích",
    description: "Hệ thống chấm điểm qua 3 tiêu chí: Sở thích (50%), Hành vi (30%) và Kỹ năng (20%).",
    icon: Brain,
  },
  {
    step: "03",
    title: "Đăng nhập nhận kết quả",
    description: "Bắt buộc đăng nhập để xem báo cáo chi tiết và nhận 3 tokens tư vấn AI.",
    icon: LogIn,
  },
  {
    step: "04",
    title: "Nhận lộ trình",
    description: "Xem biểu đồ đa chiều, ngành phù hợp, roadmap kỹ năng và tương tác với Chatbox AI.",
    icon: LineChart,
  },
];

export function HowItWorks() {
  return (
    <Box component="section" id="how-it-works" sx={{ py: 10, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip
            label="Quy trình 4 bước"
            sx={{ bgcolor: grey[200], color: grey[700], mb: 2, fontWeight: 500 }}
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Cách Thức Hoạt Động
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "md", mx: "auto" }}>
            Từ khảo sát đến nhận kết quả chỉ trong vài phút
          </Typography>
        </Box>

        <Box sx={{ position: "relative", mb: 8 }}>
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "absolute",
              top: "25%",
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(to right, ${amber[200]}, ${grey[300]}, ${amber[200]})`,
            }}
          />

          <Grid container spacing={4} justifyContent="center" sx={{ position: "relative" }}>
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                  <Stack alignItems="center" textAlign="center">
                    <Box sx={{ position: "relative", mb: 3 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 96,
                          height: 96,
                          bgcolor: isEven ? amber[100] : grey[100],
                          borderRadius: 4,
                          boxShadow: 3,
                        }}
                      >
                        <Icon sx={{ fontSize: 48, color: isEven ? amber[500] : grey[600] }} />
                      </Avatar>
                      <Avatar
                        sx={{
                          position: "absolute",
                          top: -12,
                          right: -12,
                          bgcolor: isEven ? amber[500] : grey[600],
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          boxShadow: 3,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">{item.description}</Typography>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", top: -24, right: -24, width: 288, height: 288, bgcolor: amber[200], borderRadius: "50%", filter: "blur(48px)", opacity: 0.2 }} />
              <Box sx={{ position: "absolute", bottom: -24, left: -24, width: 288, height: 288, bgcolor: grey[200], borderRadius: "50%", filter: "blur(48px)", opacity: 0.2 }} />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Data analysis dashboard"
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  boxShadow: 8,
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={3}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Kết quả đánh giá chi tiết & trực quan
              </Typography>
              <List disablePadding>
                {[
                  "Biểu đồ Radar cho RIASEC, Bar cho Big Five và SCCT",
                  "Danh sách các ngành nghề phù hợp với điểm tương thích",
                  "Lộ trình phát triển kỹ năng (Roadmap) và chứng chỉ cần có",
                  "Dữ liệu thị trường thực tế: mức lương, cơ hội việc làm",
                ].map((text) => (
                  <ListItem key={text} disableGutters sx={{ alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: amber[500], fontSize: "0.8rem" }}>✓</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ color: "text.primary" }} />
                  </ListItem>
                ))}
              </List>
              <Button
                size="large"
                variant="contained"
                sx={{ bgcolor: "#f59e0b", "&:hover": { bgcolor: "#ca8a04" }, alignSelf: "flex-start" }}
                startIcon={<PlayCircle />}
              >
                Bắt đầu đánh giá ngay
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
