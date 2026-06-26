import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowForward as ArrowRight,
  AutoAwesome as Sparkles,
  Code as Code2,
  Palette,
  People as Users,
  BarChart as BarChart3,
  Home,
} from "@mui/icons-material";
import { blue, amber, purple, green } from "@mui/material/colors";

interface CareerRecommendationProps {
  career: string;
  onContinue: () => void;
  onBack: () => void;
}

const careerSuggestions: {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
  match: number;
}[] = [
  {
    name: "Kỹ sư phần mềm",
    icon: Code2,
    color: blue[600],
    bgColor: blue[50],
    description: "Xây dựng phần mềm, ứng dụng và hệ thống kỹ thuật số. Đây là ngành có nhu cầu cao và mức thu nhập hấp dẫn.",
    match: 87,
  },
  {
    name: "Quản lý dự án",
    icon: BarChart3,
    color: amber[600],
    bgColor: amber[50],
    description: "Lãnh đạo và điều phối dự án từ khởi đầu đến hoàn thành, đảm bảo mục tiêu và ngân sách.",
    match: 84,
  },
  {
    name: "Thiết kế UX/UI",
    icon: Palette,
    color: purple[600],
    bgColor: purple[50],
    description: "Tạo ra trải nghiệm người dùng xuất sắc qua thiết kế giao diện đẹp và trực quan.",
    match: 82,
  },
  {
    name: "Quản lý nhân sự",
    icon: Users,
    color: green[600],
    bgColor: green[50],
    description: "Xây dựng và phát triển nguồn nhân lực, tạo môi trường làm việc tích cực và hiệu quả.",
    match: 79,
  },
];

export function CareerRecommendation({ career, onContinue, onBack }: CareerRecommendationProps) {
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f9fafb, #fef3c7)", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <Toolbar>
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

      <Container maxWidth="md" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
        <Stack spacing={4} alignItems="center" width="100%">
          {/* Header */}
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Chip
              icon={<Sparkles sx={{ fontSize: 16, color: amber[700] }} />}
              label="AI đã phân tích xong bài test tính cách của bạn"
              sx={{ bgcolor: amber[100], color: amber[700], fontWeight: 600 }}
            />
            <Typography variant="h3" sx={{ fontWeight: "bold", fontFamily: "serif" }}>Gợi ý nghề nghiệp</Typography>
            <Typography color="text.secondary">Dưới đây là các ngành nghề phù hợp nhất với hồ sơ tính cách của bạn.</Typography>
          </Stack>

          {/* Career list */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, width: '100%', bgcolor: 'white' }}>
            <Stack spacing={1.5}>
              {careerSuggestions.map((s) => {
                const Icon = s.icon;
                return (
                  <Paper key={s.name} variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 3, '&:hover': { bgcolor: 'grey.50' } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: s.bgColor }}>
                        <Icon sx={{ color: s.color }} />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>{s.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{s.description}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 'bold', color: amber[600] }}>{s.match}%</Typography>
                        <Typography variant="caption" color="text.secondary">phù hợp</Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={onContinue}
                        endIcon={<ArrowRight sx={{ fontSize: 16 }} />}
                        sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' }, minWidth: '160px', whiteSpace: 'nowrap' }}
                      >
                        Test chuyên sâu
                      </Button>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>

          <Button
            variant="contained"
            onClick={onBack}
            startIcon={<Home />}
            sx={{ bgcolor: "grey.800", "&:hover": { bgcolor: "grey.900" } }}
          >
              Về Trang chủ
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
