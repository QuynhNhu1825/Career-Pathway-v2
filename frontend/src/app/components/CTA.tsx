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
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowForward as ArrowRight,
  AutoAwesome as Sparkles,
  ShieldOutlined as Shield,
  OfflineBoltOutlined as Zap,
} from "@mui/icons-material";
import { amber } from "@mui/material/colors";

interface CTAProps {
  onStart?: () => void;
}

export function CTA({ onStart }: CTAProps) {
  return (
    <Box
      component="section" 
      id="assessment"
      sx={{
        py: 10,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom right, #111827, #1f2937)",
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.02,
        }}
      />
      {/* Decorative Blurs */}
      <Box sx={{ position: "absolute", top: 0, right: 0, width: 384, height: 384, bgcolor: "rgba(245, 158, 11, 0.1)", borderRadius: "50%", filter: "blur(64px)" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, width: 384, height: 384, bgcolor: "rgba(107, 114, 128, 0.1)", borderRadius: "50%", filter: "blur(64px)" }} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={3}>
              <Chip
                icon={<Sparkles sx={{ fontSize: 16, color: amber[400] }} />}
                label="Miễn phí hoàn toàn"
                variant="outlined"
                sx={{
                  color: amber[400],
                  borderColor: "rgba(251, 191, 36, 0.3)",
                  bgcolor: "rgba(251, 191, 36, 0.2)",
                  fontWeight: 500,
                  alignSelf: "flex-start",
                }}
              />

              <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", color: "white" }}>
                Khám Phá Con Đường Sự Nghiệp Của Bạn
              </Typography>

              <Typography variant="h6" sx={{ color: "grey.300" }}>
                Bắt đầu đánh giá ngay bây giờ để nhận kết quả chi tiết trong vài phút.
              </Typography>

              <List>
                {[
                  { icon: Zap, text: "15 câu hỏi tình huống thực tế, AI tạo động", color: amber[400], bgColor: "rgba(245, 158, 11, 0.2)" },
                  { icon: Shield, text: "Đăng nhập chỉ khi muốn xem kết quả chi tiết", color: "grey.400", bgColor: "rgba(107, 114, 128, 0.2)" },
                  { icon: ArrowRight, text: "Nhận 3 tokens tư vấn AI miễn phí", color: amber[400], bgColor: "rgba(245, 158, 11, 0.2)" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 52 }}>
                        <Box sx={{ width: 40, height: 40, bgcolor: item.bgColor, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon sx={{ color: item.color }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText primary={item.text} primaryTypographyProps={{ color: "grey.300" }} />
                    </ListItem>
                  );
                })}
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

          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: "none", lg: "block" } }}>
            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", top: -16, right: -16, width: "100%", height: "100%", background: "linear-gradient(to bottom right, rgba(245, 158, 11, 0.2), rgba(107, 114, 128, 0.2))", borderRadius: 4, filter: "blur(32px)" }} />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1664719474052-6d3347955d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Career counseling"
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  boxShadow: 24,
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                  border: 1,
                  borderColor: "grey.700",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
