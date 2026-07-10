import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Stack,
  TextField,
  FormControl,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import { AssessmentMode, UserData, AuthUser } from "../App";

interface PersonalInfoProps {
  onSubmit: (data: UserData, mode: AssessmentMode) => void;
  authUser: AuthUser | null;
  onBack: () => void;
}

const educationOptions = [
  { value: "thpt", label: "THPT" },
  { value: "caodang", label: "Cao đẳng" },
  { value: "daihoc", label: "Đại học" },
  { value: "khac", label: "Khác" },
];

const provinces = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", 
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", 
  "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", 
  "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", 
  "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", 
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", 
  "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", 
  "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", 
  "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", 
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", 
  "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
].sort((a, b) => a.localeCompare(b, 'vi'));

const subjects = [
  { key: "Toan", label: "Toán" },
  { key: "Van", label: "Văn" },
  { key: "Anh", label: "Anh" },
  { key: "Ly", label: "Lý" },
  { key: "Hoa", label: "Hoá" },
  { key: "Sinh", label: "Sinh" },
  { key: "Su", label: "Sử" },
  { key: "Dia", label: "Địa" },
  { key: "GDCD", label: "GDCD" },
];

const initialSubjectScores = {
  Toan: "", Van: "", Anh: "", Ly: "", Hoa: "", Sinh: "", Su: "", Dia: "", GDCD: ""
};

// Hàm lấy Label hiển thị từ Value của Education Level
const getEducationLabelFromValue = (value: string): string => {
  const found = educationOptions.find(o => o.value === value);
  return found ? found.label : value;
};

// Hàm đảo ngược từ Label sang Value để điền vào Select component khi load profile cũ
const getEducationValueFromLabel = (label: string): string => {
  const found = educationOptions.find(o => o.label === label);
  return found ? found.value : "khac";
};

export function PersonalInfo({ onSubmit, authUser, onBack }: PersonalInfoProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [hobby, setHobby] = useState("");
  const [education, setEducation] = useState("");
  const [desiredCareer, setDesiredCareer] = useState("");
  const [gpa, setGpa] = useState("");
  
  const [subjectScores, setSubjectScores] = useState<Record<string, string>>(initialSubjectScores);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Đổ dữ liệu cũ của user từ hệ thống vào form (nếu có sẵn authUser profile)
  useEffect(() => {
    if (authUser && authUser.profile) {
      const p = authUser.profile;
      if (p.fullName) setName(p.fullName);
      if (p.age !== undefined && p.age !== null) setAge(String(p.age));
      if (p.location) setLocation(p.location);
      if (p.interests) setHobby(p.interests);
      if (p.educationLevel) {
        const eduVal = getEducationValueFromLabel(p.educationLevel);
        setEducation(eduVal);
      }
      if (p.workerScores?.gpa) setGpa(String(p.workerScores.gpa));
      if (p.studentScores) {
        const parsedScores: Record<string, string> = {};
        Object.entries(p.studentScores).forEach(([k, v]) => {
          parsedScores[k] = String(v);
        });
        setSubjectScores(prev => ({ ...prev, ...parsedScores }));
      }
    }
  }, [authUser]);

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEducation(val);
    // Reset điểm cũ để tránh submit thừa data rác
    setGpa("");
    setSubjectScores(initialSubjectScores);
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Vui lòng nhập họ và tên";
    if (!education) e.education = "Vui lòng chọn trình độ học vấn";
    if (!location) e.location = "Vui lòng nhập khu vực mong muốn học tập/làm việc";
    
    if (!age) {
      e.age = "Vui lòng nhập tuổi";
    } else if (Number(age) < 15 || Number(age) > 100) {
      e.age = "Tuổi hợp lệ từ 15 đến 100";
    }
    
    if (!hobby.trim()) {
      e.hobby = "Vui lòng mô tả sở thích của bạn";
    } else if (hobby.trim().length < 10) {
      e.hobby = "Vui lòng nhập ít nhất 10 ký tự";
    }

    if (education === "caodang" || education === "daihoc") {
      if (!gpa.trim()) {
        e.gpa = "Vui lòng nhập điểm GPA";
      } else if (isNaN(Number(gpa)) || Number(gpa) < 0 || Number(gpa) > 10) {
        e.gpa = "GPA hợp lệ từ 0.0 đến 10";
      }
    } else if (education === "thpt") {
      Object.entries(subjectScores).forEach(([key, value]) => {
        if (value.trim() && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 10)) {
          e[key] = "Điểm từ 0-10";
        }
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleScoreChange = (subject: string, value: string) => {
    setSubjectScores(prev => ({ ...prev, [subject]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    const currentMode: AssessmentMode = desiredCareer.trim() ? "targeted" : "discovery";
    const numAge = Number(age);
    // Xác định trạng thái status từ trình độ học vấn
    const currentStatus = (education === 'thpt') ? 'student' : 'working';

    onSubmit({ 
      name, 
      age: numAge, 
      education: getEducationLabelFromValue(education), 
      location, 
      hobby, 
      desiredCareer,
      studentScores: education === "thpt"
        ? {
            Toan: Number(subjectScores.Toan) || 0,
            Van: Number(subjectScores.Van) || 0,
            Anh: Number(subjectScores.Anh) || 0,
            Ly: Number(subjectScores.Ly) || 0,
            Hoa: Number(subjectScores.Hoa) || 0,
            Sinh: Number(subjectScores.Sinh) || 0,
            Su: Number(subjectScores.Su) || 0,
            Dia: Number(subjectScores.Dia) || 0,
            GDCD: Number(subjectScores.GDCD) || 0,
          }
        : undefined,
      workerScores: education === "caodang" || education === "daihoc"
        ? { gpa: Number(gpa) }
        : undefined,
      status: currentStatus, 
    }, currentMode);
  };

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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Age Input */}
            <FormControl fullWidth>
              <TextField
                label="Tuổi của bạn *"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={!!errors.age}
                helperText={errors.age}
                inputProps={{ min: 15, max: 100 }}
                placeholder="VD: 22"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#f59e0b',
                    },
                  },
                }}
              />
            </FormControl>

            {/* Education */}
            <TextField
              select
              label="Trình độ học vấn"
              required
              value={education}
              onChange={handleEducationChange}
              error={!!errors.education}
              helperText={errors.education}
            >
              <MenuItem value="" disabled>-- Chọn trình độ --</MenuItem>
              {educationOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            {/* Conditional Fields for Grades/GPA */}
            {(education === "thpt") && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Nhập điểm các môn thuộc khối học của bạn (thang 10)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Môn nào không học hoặc không có điểm, bạn có thể bỏ trống.
                </Typography>
                <Grid container spacing={2}>
                  {subjects.map((subject) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={subject.key}>
                      <TextField
                        label={subject.label}
                        type="number"
                        fullWidth
                        value={subjectScores[subject.key] || ""}
                        onChange={(e) => handleScoreChange(subject.key, e.target.value)}
                        error={!!errors[subject.key]}
                        helperText={errors[subject.key]}
                        inputProps={{ min: 0, max: 10, step: 0.1 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {(education === "caodang" || education === "daihoc") && (
              <TextField
                label="Điểm GPA (hệ 4) hoặc (hệ 10)"
                required
                type="number"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                error={!!errors.gpa}
                helperText={errors.gpa}
                placeholder="Ví dụ: 3.2 hoặc 8.0"
                inputProps={{ min: 0, max: 10, step: 0.01 }}
              />
            )}
          
            {/* Location */}
            <Autocomplete
              freeSolo
              options={provinces}
              inputValue={location}
              onInputChange={(event, newInputValue) => {
                setLocation(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Khu vực mong muốn học tập/làm việc"
                  required
                  placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                  error={!!errors.location}
                  helperText={errors.location}
                />
              )}
            />
            
            {/* Hobby / Skills */}
            <TextField
              label="Sở thích của bạn"
              required
              multiline
              rows={3}
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              placeholder="Mô tả các sở thích, hoạt động bạn hay làm lúc rảnh rỗi, ví dụ: đọc sách, chơi game, vẽ, chơi thể thao..."
              error={!!errors.hobby}
              helperText={errors.hobby || `${hobby.length} ký tự`}
            />

            {/* Desired Career */}
            <TextField
              label="Nghề nghiệp mong muốn (không bắt buộc)"
              value={desiredCareer}
              onChange={(e) => setDesiredCareer(e.target.value)}
              placeholder="Ví dụ: Kỹ sư phần mềm. Để trống nếu bạn muốn AI gợi ý."
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