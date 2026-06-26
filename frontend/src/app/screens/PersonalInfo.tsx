import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Stack,
  TextField,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import { AssessmentMode, UserData } from "../App";

interface PersonalInfoProps {
  mode: AssessmentMode;
  onSubmit: (data: UserData) => void;
  onBack: () => void;
}

const educationOptions = [
  { value: "thpt", label: "THPT (Lớp 12)" },
  { value: "trungcap", label: "Trung cấp / Cao đẳng" },
  { value: "daihoc", label: "Đại học" },
  { value: "thacsi", label: "Thạc sĩ" },
  { value: "tiensi", label: "Tiến sĩ / Sau đại học" },
];

const statusOptions = [
  { value: "studying", label: "Đang học" },
  { value: "working", label: "Đi làm" },
  { value: "switching", label: "Đang chuyển nghề" },
  { value: "searching", label: "Đang tìm việc" },
];

export function PersonalInfo({ mode, onSubmit, onBack }: PersonalInfoProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(22);
  const [education, setEducation] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [targetCareer, setTargetCareer] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Vui lòng nhập họ và tên";
    if (!education) e.education = "Vui lòng chọn trình độ học vấn";
    if (!currentStatus) e.currentStatus = "Vui lòng chọn tình trạng hiện tại";
    if (!location.trim()) e.location = "Vui lòng nhập khu vực sinh sống";
    if (!skills.trim()) e.skills = "Vui lòng mô tả sở thích và kỹ năng của bạn";
    if (mode === "targeted" && !targetCareer.trim()) e.targetCareer = "Vui lòng nhập ngành nghề bạn muốn theo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name, age, education, currentStatus, location, skills, hobbies, targetCareer: mode === "targeted" ? targetCareer : undefined });
  };

  const step = mode === "targeted" ? "Bước 2 / 4" : "Bước 2 / 3";

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

      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography component="span" sx={{
            display: 'inline-block', bgcolor: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: '600', px: 1.5, py: 0.5, borderRadius: '9999px', mb: 2, textTransform: 'uppercase', letterSpacing: 1
          }}>
              {step}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "serif", mb: 1 }}>Thông tin cá nhân</Typography>
          <Typography color="text.secondary">Giúp AI hiểu rõ bối cảnh của bạn để đưa ra đánh giá chính xác hơn</Typography>
        </Box>

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
          <Stack spacing={3}>
            {/* Name */}
            <TextField
              label="Họ và tên"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn An"
              error={!!errors.name}
              helperText={errors.name}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Age Slider */}
            <FormControl>
              <FormLabel sx={{ mb: 1, color: 'text.primary', '&.Mui-focused': { color: 'text.primary' } }}>
                Tuổi: <Typography component="span" sx={{ color: "#b45309", fontWeight: "bold" }}>{age}</Typography>
              </FormLabel>
              <Slider
                aria-label="Age"
                value={age}
                onChange={(_, v) => setAge(v as number)}
                min={15}
                max={60}
                valueLabelDisplay="auto"
                sx={{ color: '#f59e0b', mx: 1 }}
              />
            </FormControl>

            {/* Education */}
            <TextField
              select
              label="Trình độ học vấn"
              required
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              error={!!errors.education}
              helperText={errors.education}
            >
              <MenuItem value="" disabled>-- Chọn trình độ --</MenuItem>
              {educationOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            {/* Status */}
            <FormControl required error={!!errors.currentStatus}>
              <FormLabel>Tình trạng hiện tại</FormLabel>
              <RadioGroup
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}>
              <Grid container spacing={2}>
                {statusOptions.map((o) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={o.value}>
                    <FormControlLabel
                      value={o.value}
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": {
                              color: "#f59e0b",
                            },
                          }}
                        />
                      }
                      label={o.label}
                      sx={{
                        width: "100%",
                        m: 0,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
              {errors.currentStatus && <FormHelperText>{errors.currentStatus}</FormHelperText>}
            </FormControl>

            {/* Location */}
            <TextField
              label="Khu vực sinh sống"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
              error={!!errors.location}
              helperText={errors.location}
            />

            {/* Target Career - only for targeted mode */}
            {mode === "targeted" && (
              <TextField
                label="Ngành nghề muốn theo"
                required
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                placeholder="Ví dụ: Kỹ sư phần mềm, Bác sĩ, Luật sư, Kế toán..."
                error={!!errors.targetCareer}
                helperText={errors.targetCareer}
              />
            )}

            {/* Skills */}
            <TextField
              label="Kỹ năng hiện có"
              required
              multiline
              rows={3}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Mô tả chi tiết về kỹ năng, kinh nghiệm và những điều bạn giỏi nhất. Càng chi tiết, kết quả càng chính xác..."
              error={!!errors.skills}
              helperText={errors.skills || `${skills.length} ký tự`}
            />

            {/* Hobby */}
            <TextField
              label="Sở thích của bạn"
              required
              multiline
              rows={3}
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              placeholder="Mô tả chi tiết về sở thích của bạn. Càng chi tiết, kết quả càng chính xác..."
              error={!!errors.hobbies}
              helperText={errors.hobbies || `${hobbies.length} ký tự`}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleSubmit}
              sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#ca8a04' } }}
            >
              Tiếp tục
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
