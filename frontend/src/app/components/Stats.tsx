import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Storage as Database,
  Psychology as Brain,
  TrackChanges as Target,
  ChatBubbleOutline as MessageSquare,
} from "@mui/icons-material";
import { amber } from "@mui/material/colors";

const stats = [
  {
    icon: Database,
    value: "O*NET",
    label: "Dữ liệu nghề nghiệp chuẩn quốc tế",
    color: amber[600],
    bgColor: amber[100],
  },
  {
    icon: Brain,
    value: "3 mô hình",
    label: "RIASEC, Big Five & SCCT",
    color: "grey.600",
    bgColor: "grey.100",
  },
  {
    icon: Target,
    value: "2 chế độ",
    label: "Targeted & Discovery",
    color: amber[600],
    bgColor: amber[100],
  },
  {
    icon: MessageSquare,
    value: "3 tokens",
    label: "Tư vấn AI sau kết quả",
    color: "grey.600",
    bgColor: "grey.100",
  },
];

export function Stats() {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: 10,
        background: "linear-gradient(to bottom right, #f59e0b, #d97706)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
            Công Nghệ AI Hàng Đầu
          </Typography>
          <Typography variant="h6" sx={{ color: amber[100] }}>
            Kết hợp trí tuệ nhân tạo và khoa học tâm lý nghề nghiệp
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <Paper
              elevation={6}
              sx={{
                p: 3,
                height: "100%",
                minHeight: 212,
                textAlign: "center",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: stat.bgColor,
                  mx: "auto",
                  mb: 2,
                  borderRadius: 3,
                }}
              >
                <Icon sx={{ fontSize: 28, color: stat.color }} />
              </Avatar>

              <Typography
                sx={{
                  fontSize: "1.875rem",
                  lineHeight: 1.2,
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                {stat.value}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {stat.label}
              </Typography>
                      </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
