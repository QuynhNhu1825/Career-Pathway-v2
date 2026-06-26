import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ExploreIcon from "@mui/icons-material/Explore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AssessmentMode } from "../App";

interface ModeSelectionProps {
  onSelect: (mode: AssessmentMode) => void;
  onBack: () => void;
}

export function ModeSelection({ onSelect, onBack }: ModeSelectionProps) {
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f9fafb, #fef3c7)", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <Toolbar>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ color: "text.secondary", textTransform: "none" }}>
            Quay lại
          </Button>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Box sx={{ width: 28, height: 28, bgcolor: "#f59e0b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", mr: 1 }}>
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>CP</Typography>
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              Career <Box component="span" sx={{ color: "#f59e0b" }}>Pathway</Box>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography component="span" sx={{
            display: 'inline-block', bgcolor: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: '600', px: 1.5, py: 0.5, borderRadius: '9999px', mb: 2, textTransform: 'uppercase', letterSpacing: 1
          }}>
              Bước 1 / 4
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", fontFamily: "serif", mb: 1.5 }}>
              Chọn chế độ đánh giá
          </Typography>
          <Typography variant="h6" color="text.secondary">
              Hãy cho chúng tôi biết bạn đang ở đâu trong hành trình nghề nghiệp
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Targeted Card */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 4, border: "2px solid transparent", "&:hover": { borderColor: "#f59e0b", boxShadow: 6, transform: "translateY(-4px)" }, transition: "all 0.2s", width: '100%' }}>
              <CardActionArea onClick={() => onSelect("targeted")} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", p: 3 }}>
                <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                  <Box sx={{ width: 56, height: 56, bgcolor: "#fef3c7", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    <TrackChangesIcon sx={{ fontSize: 32, color: "#b45309" }} />
                  </Box>
                  <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: '600', color: '#b45309', bgcolor: '#fef3c7', px: 1, py: 0.5, borderRadius: 1, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5, display: 'inline-block' }}>
                    Có định hướng
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1.5 }}>Targeted</Typography>
                  <Typography color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    Dành cho bạn đã có ngành nghề cụ thể muốn theo đuổi. Hệ thống sẽ đánh giá mức độ phù hợp của bạn với ngành đó.
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    {[
                      "Nhập ngành nghề bạn muốn theo",
                      "Làm bài đánh giá phù hợp chuyên biệt",
                      "Nhận điểm match + lộ trình phát triển",
                    ].map((item) => (
                      <ListItem key={item} disableGutters>
                        <ListItemIcon sx={{ minWidth: 28 }}><CheckCircleIcon sx={{ color: '#f59e0b', fontSize: 18 }} /></ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </CardActionArea>
              <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Button fullWidth variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => onSelect("targeted")} sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}>
                  Chọn Targeted
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Discovery Card */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 4, border: "2px solid transparent", "&:hover": { borderColor: "grey.500", boxShadow: 6, transform: "translateY(-4px)" }, transition: "all 0.2s", width: '100%' }}>
              <CardActionArea onClick={() => onSelect("discovery")} sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", p: 3 }}>
                <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                  <Box sx={{ width: 56, height: 56, bgcolor: "grey.100", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    <ExploreIcon sx={{ fontSize: 32, color: "grey.700" }} />
                  </Box>
                  <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: '600', color: 'grey.700', bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5, display: 'inline-block' }}>
                    Khám phá
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1.5 }}>Discovery</Typography>
                  <Typography color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    Dành cho bạn chưa xác định được hướng đi. AI sẽ phân tích tính cách qua một bài test duy nhất và đề xuất các ngành phù hợp nhất.
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    {[
                      "Làm bài test tính cách duy nhất (15 câu)",
                      "Nhận danh sách các ngành nghề phù hợp",
                      "Lựa chọn làm bài test chuyên sâu (Targeted) nếu muốn",
                    ].map((item) => (
                      <ListItem key={item} disableGutters>
                        <ListItemIcon sx={{ minWidth: 28 }}><CheckCircleIcon color="disabled" sx={{ fontSize: 18 }} /></ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </CardActionArea>
              <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Button fullWidth variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => onSelect("discovery")} sx={{ bgcolor: "grey.800", "&:hover": { bgcolor: "grey.900" } }}>
                  Chọn Discovery
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
        
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 6 }}>
            Bạn có thể thay đổi lựa chọn bất cứ lúc nào trước khi hoàn thành
        </Typography>
      </Container>
    </Box>
  );
}
