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
  Divider,
} from "@mui/material";
import {
  ArrowForward as ArrowRight,
  Psychology as Brain,
  TrackChanges as Target,
} from "@mui/icons-material";
import { amber } from "@mui/material/colors";

interface HeroProps {
  onStart?: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom right, #f9fafb, #fef3c7)",
        py: { xs: 10, lg: 16 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={4}>
              <Chip
                icon={<Brain sx={{ fontSize: 16, color: amber[800] }} />}
                label="Hệ thống AI Chuyên gia"
                sx={{
                  bgcolor: amber[100],
                  color: amber[800],
                  fontWeight: 500,
                  alignSelf: "flex-start",
                }}
              />

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", lg: "3.75rem" },
                  lineHeight: 1.2,
                }}
              >
                Tư Vấn Hướng Nghiệp{" "}
                <Box component="span" sx={{ color: "#f59e0b" }}>
                  Khoa Học
                </Box>
              </Typography>

              <Typography variant="h6" color="text.secondary">
                Đánh giá tương thích nghề nghiệp dựa trên AI và dữ liệu khoa học. Loại bỏ hoàn toàn việc chọn ngành theo cảm tính.
              </Typography>

              <List disablePadding>
                {[
                  "Đánh giá đa chiều với RIASEC, Big Five & SCCT",
                  "Khảo sát động 15 câu hỏi tình huống thực tế",
                  "Lộ trình phát triển kỹ năng chi tiết",
                ].map((text) => (
                  <ListItem key={text} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#f59e0b", fontSize: "1rem" }}>✓</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={onStart}
                  endIcon={<ArrowRight />}
                  sx={{
                    bgcolor: "#f59e0b",
                    "&:hover": { bgcolor: "#ca8a04" }, 
                    "& .MuiButton-endIcon": { transition: "transform 0.2s" },
                    "&:hover .MuiButton-endIcon": { transform: "translateX(4px)" },
                  }}
                >
                  Bắt đầu đánh giá miễn phí
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", top: -16, right: -16, width: 288, height: 288, bgcolor: amber[200], borderRadius: "50%", filter: "blur(64px)", opacity: 0.3 }} />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1698891667906-a0bc5633e7c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Career counseling session"
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  boxShadow: 24,
                  width: "100%",
                  height: 500,
                  objectFit: "cover",
                }}
              />

              <Paper
                elevation={8}
                sx={{
                  position: "absolute",
                  bottom: -24,
                  left: 24,
                  right: 24,
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {[
                  { value: "15", label: "Câu hỏi" },
                  { value: "3", label: "Mô hình AI" },
                  { value: "98%", label: "Độ chính xác" },
                ].map((stat, index) => (
                  <Stack key={stat.label} direction="row" alignItems="center" spacing={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    </Box>
                    {index < 2 && <Divider orientation="vertical" flexItem />}
                  </Stack>
                ))}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
