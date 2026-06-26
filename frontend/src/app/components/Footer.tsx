import {
  Box,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  LinkedIn as Linkedin,
  Mail,
  LocationOn as MapPin,
  Phone,
  Psychology as Brain,
} from "@mui/icons-material";
import { amber } from "@mui/material/colors";

export function Footer() {
  return (
    <Box component="footer" id="contact" sx={{ bgcolor: "grey.900", color: "grey.300", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} mb={6}>
          {/* Company Info */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Brain sx={{ fontSize: 32, color: amber[500] }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                Career Pathway
              </Typography>
            </Stack>
            <Typography color="grey.400" sx={{ mb: 3, lineHeight: 1.6 }}>
              Hệ thống AI chuyên gia giúp bạn định hướng nghề nghiệp khoa học, loại bỏ việc chọn ngành theo cảm tính.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "grey.800",
                  "&:hover": { bgcolor: amber[500] },
                }}
              >
                <Facebook sx={{ color: "white" }} />
              </IconButton>
              <IconButton
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "grey.800",
                  "&:hover": { bgcolor: amber[500] },
                }}
              >
                <Instagram sx={{ color: "white" }} />
              </IconButton>
              <IconButton
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "grey.800",
                  "&:hover": { bgcolor: amber[500] },
                }}
              >
                <Linkedin sx={{ color: "white" }} />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
              Liên kết nhanh
            </Typography>
            <List disablePadding sx={{ "& li": { py: 0.5 } }}>
              {[
                { text: "Trang chủ", href: "#home" },
                { text: "Tính năng", href: "#features" },
                { text: "Quy trình", href: "#how-it-works" },
                { text: "Đánh giá", href: "#testimonials" },
              ].map((item) => (
                <ListItem key={item.text} disablePadding>
                  <Link href={item.href} color="inherit" underline="none" sx={{ "&:hover": { color: amber[400] } }}>
                    <ListItemText primary={item.text} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Assessment Info */}
         <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
              Hệ thống đánh giá
            </Typography>
            <List disablePadding sx={{ "& li": { py: 0.5 } }}>
              {[
                "Chế độ Targeted",
                "Chế độ Discovery",
                "Mô hình RIASEC",
                "Chatbox AI",
              ].map((item) => (
                <ListItem key={item} disablePadding>
                  <Link href="#" color="inherit" underline="none" sx={{ "&:hover": { color: amber[400] } }}>
                    <ListItemText primary={item} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
              Liên hệ
            </Typography>
            <List disablePadding sx={{ "& li": { py: 0.5 } }}>
              <ListItem disablePadding sx={{ alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <MapPin sx={{ color: amber[400] }} />
                </ListItemIcon>
                <ListItemText primary="Trường Cao đẳng Kỹ thuật Cao Thắng" secondary="TP. Hồ Chí Minh" primaryTypographyProps={{ color: "inherit" }} secondaryTypographyProps={{ color: "grey.400" }} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Phone sx={{ color: amber[400] }} />
                </ListItemIcon>
                <ListItemText primary="0123 456 789" primaryTypographyProps={{ color: "inherit" }} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Mail sx={{ color: amber[400] }} />
                </ListItemIcon>
                <ListItemText primary="contact@careerpathway.vn" primaryTypographyProps={{ color: "inherit" }} />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ borderTop: 1, borderColor: "grey.800", pt: 4 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="body2" color="grey.400">
              © 2026 Career Pathway. Powered by Gemini AI & O*NET Database.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="#" color="inherit" underline="none" sx={{ "&:hover": { color: amber[400] } }}>
                Chính sách bảo mật
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ "&:hover": { color: amber[400] } }}>
                Điều khoản sử dụng
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ "&:hover": { color: amber[400] } }}>
                Tài liệu API
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
