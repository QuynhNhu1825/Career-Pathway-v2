import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider,
  Link,
  Card,
  CardContent,
  Grid,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { amber, blue, grey } from "@mui/material/colors";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const industrySuggestions = [
  "Công nghệ thông tin",
  "Trí tuệ nhân tạo (AI)",
  "Marketing",
  "Thiết kế đồ họa",
  "Kế toán - Tài chính",
  "Nguồn nhân lực (HR)",
  "Thương mại điện tử",
  "Logistics & Chuỗi cung ứng",
  "Truyền thông đa phương tiện"
];

const locationOptions = [
  {value:"Toàn quốc", label:"Toàn quốc"},
  { value: "An Giang", label: "An Giang" },
  { value: "Bắc Ninh", label: "Bắc Ninh" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Cao Bằng", label: "Cao Bằng" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Đắk Lắk", label: "Đắk Lắk" },
  { value: "Điện Biên", label: "Điện Biên" },
  { value: "Đồng Nai", label: "Đồng Nai" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
  { value: "Gia Lai", label: "Gia Lai" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Hà Tĩnh", label: "Hà Tĩnh" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Hưng Yên", label: "Hưng Yên" },
  { value: "Huế", label: "Huế" },
  { value: "Khánh Hòa", label: "Khánh Hòa" },
  { value: "Lai Châu", label: "Lai Châu" },
  { value: "Lâm Đồng", label: "Lâm Đồng" },
  { value: "Lạng Sơn", label: "Lạng Sơn" },
  { value: "Lào Cai", label: "Lào Cai" },
  { value: "Nghệ An", label: "Nghệ An" },
  { value: "Ninh Bình", label: "Ninh Bình" },
  { value: "Phú Thọ", label: "Phú Thọ" },
  { value: "Quảng Ngãi", label: "Quảng Ngãi" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
  { value: "Quảng Trị", label: "Quảng Trị" },
  { value: "Sơn La", label: "Sơn La" },
  { value: "Tây Ninh", label: "Tây Ninh" },
  { value: "Thái Nguyên", label: "Thái Nguyên" },
  { value: "Thanh Hóa", label: "Thanh Hóa" },
  { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
  { value: "Tuyên Quang", label: "Tuyên Quang" },
  { value: "Vĩnh Long", label: "Vĩnh Long" }
]

const sampleDataByIndustry: Record<string, { schools: string[]; jobs: string[] }> = {
  "Công nghệ thông tin": {
    schools: ["Đại học Bách Khoa Hà Nội", "Đại học Bách khoa - ĐH Đà Nẵng", "Đại học Công nghệ thông tin", "Đại học FPT", "Cao đẳng Kỹ thuật Cao Thắng"],
    jobs: ["Lập trình viên Frontend/Backend", "Kỹ sư DevOps", "Chuyên viên Kiểm thử (Tester)", "Kỹ sư Hệ thống Cloud"]
  },
  "Trí tuệ nhân tạo (AI)": {
    schools: ["Đại học Bách Khoa Hà Nội", "Đại học Công nghệ thông tin - ĐHQG TP.HCM", "Đại học VinUniversity", "Đại học FPT"],
    jobs: ["Kỹ sư AI/ML (Machine Learning)", "Kỹ sư Dữ liệu (Data Engineer)", "Chuyên viên Phân tích Dữ liệu (Data Analyst)"]
  },
  "Marketing": {
    schools: ["Đại học Kinh tế Quốc dân", "Đại học RMIT Việt Nam", "Đại học Thương mại", "Đại học Ngoại thương", "Đại học Kinh tế - ĐH Đà Nẵng"],
    jobs: ["Digital Marketing Executive", "Chuyên viên SEO/SEM", "Chuyên viên Thương hiệu (Brand Manager)"]
  },
  "Thiết kế đồ họa": {
    schools: ["Trường Đại học Kiến trúc Đà Nẵng", "Trường Đại học Mỹ thuật Đà Nẵng", "Đại học Kiến trúc TP.HCM", "Đại học Văn Lang"],
    jobs: ["UI/UX Designer", "Graphic Designer", "Chuyên viên Diễn họa 2D/3D (Animator)"]
  }
};

// Fallback danh sách trường mặc định khi chưa chọn ngành ở Bước 1
const defaultSchoolsList = [
  "Đại học Bách khoa - ĐH Đà Nẵng",
  "Đại học Bách Khoa Hà Nội",
  "Đại học Công nghệ thông tin",
  "Đại học FPT",
  "Cao đẳng Kỹ thuật Cao Thắng",
  "Đại học Kinh tế Quốc dân",
  "Đại học Kinh tế TP.HCM (UEH)"
];

interface SchoolMajorItem {
  majorName: string;
  benchmark: string | null;
  benchmarkYear: number | null;
  benchmarkSource: string | null;
  benchmarkVerified: boolean;
}

interface SchoolItem {
  schoolName: string;
  location: string;
  schoolVerified: boolean;
  benchmark: string | null;
  benchmarkYear: number | null;
  benchmarkSource: string | null;
  benchmarkVerified: boolean;
}

interface CompanyItem {
  companyName: string;
  location: string;
  description: string;
  positions: string[];
  website: string | null;
  careerLink: string | null;
}

interface ApiResponse {
  searchType?: 'school_only' | 'major_only' | 'school_and_major';
  schoolName?: string;
  majorName?: string;
  location?: string;
  summary: string;
  topMajors?: SchoolMajorItem[]; 
  schools?: SchoolItem[];
  majorInfo?: {
    majorName: string;
    benchmark: string | null;
    benchmarkYear: number | null;
    benchmarkSource: string | null;
    benchmarkVerified: boolean;
  };
  companies?: CompanyItem[];
}

export function QuickCareerAdvisor() {
  const [industry, setIndustry] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [location, setLocation] = useState<string>("Toàn quốc");
  const [answer, setAnswer] = useState<ApiResponse | null>(null);
  const [currentMode, setCurrentMode] = useState<"HOC" | "LAM" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hàm xử lý khi nút tìm kiếm được nhấn
  const handleSearchButtonClick = () => {
    let modeToPerform: "HOC" | "LAM" | null = null;

    if (selectedJob) {
      modeToPerform = "LAM";
    } else if (selectedSchool || industry) {
      modeToPerform = "HOC";
    }

    console.log('handleSearchButtonClick triggered. Current state:', { industry, selectedSchool, selectedJob, location, modeToPerform });
    if (modeToPerform) {
      performSearch(modeToPerform);
    } else {
      setError("Vui lòng chọn ngành học, trường học hoặc vị trí công việc để tìm kiếm.");
    }
  };

  // Hàm chính để gọi API tìm kiếm, sử dụng các state hiện tại của component
  const performSearch = async (mode: "HOC" | "LAM") => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setError("Bạn cần đăng nhập để sử dụng chức năng này.");
      return;
    }

    setError("");
    setLoading(true);
    setAnswer(null);
    setCurrentMode(mode);

    try {
      const payload: any = {
        mode: mode,
        location: location === "Toàn quốc" ? "Việt Nam" : location,
        // Ưu tiên lấy tuổi từ profile người dùng nếu có, nếu không thì dùng giá trị mặc định
        age: user.profile?.age || (mode === "HOC" ? 17 : 22),
      };

      if (mode === "HOC") {
        if (selectedSchool) {
          payload.school = selectedSchool;
          if (industry) {
            payload.industry = industry; // school_and_major
          }
        } else if (industry) {
          payload.industry = industry; // major_only
        }
      } else { // mode === "LAM"
        payload.position = selectedJob;
        if (industry) { // Backend cũng có thể dùng industry cho mode LAM
          payload.industry = industry;
        }
      }

      console.log('performSearch payload:', payload);
      const response = await fetch(`${API_URL}/api/search/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id, // Sử dụng user.id đã lấy từ localStorage
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const resultData = data.advice || data.data || data;

      if (response.ok && resultData) {
        setAnswer(resultData);
      } else {
        setError(data.message || "Có lỗi xảy ra từ máy chủ.");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryChange = (newValue: string | null) => {
    const val = newValue || "";
    setIndustry(val);
    setSelectedSchool("");
    setSelectedJob("");
    setAnswer(null);
  };

  // Đổ danh sách trường: Nếu chọn ngành thì lấy theo ngành, nếu chưa chọn ngành thì lấy danh sách tổng hợp
  const currentSchools = industry ? (sampleDataByIndustry[industry]?.schools || []) : defaultSchoolsList;
  const currentJobs = sampleDataByIndustry[industry]?.jobs || ["Chuyên viên Junior", "Thực tập sinh", "Trưởng nhóm chuyên môn"];

  return (
    <Box component="section" id="quickcareer" sx={{ py: 4, bgcolor: grey[50] }}>
      <Container maxWidth="md">
        <Stack spacing={2.5} alignItems="center">
          <Chip
            icon={<SmartToyIcon sx={{ fontSize: "16px !important" }} />}
            label="AI Career Assistant"
            size="small"
            sx={{ bgcolor: amber[100], color: amber[800], fontWeight: "bold" }}
          />

          <Stack spacing={0.5} alignItems="center">
            <Typography variant="h5" fontWeight="800" textAlign="center" color={grey[900]}>
              Hệ thống tìm hiểu nhanh định hướng
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={650}>
              Tự động phân luồng thông minh dựa trên dữ liệu bạn lựa chọn ở các ô tìm kiếm
            </Typography>
          </Stack>

          {/* KHỐI TƯƠNG TÁC LUỒNG - GIỮ NGUYÊN BỐ CỤC GỐC */}
          <Paper 
            elevation={0} 
            sx={{ width: "100%", p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${grey[200]}` }}
          >
            <Stack spacing={2.5}>
              {/* BƯỚC 1: CHỌN NGÀNH NGHỀ & KHU VỰC MONG MUỐN */}
              <Box>
                <Typography component="div" variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip size="small" label="Bước 1" color="primary" sx={{ height: 20, fontSize: 11 }} /> Chọn ngành học bạn quan tâm:
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Autocomplete
                      freeSolo
                      options={industrySuggestions}
                      value={industry}
                      onInputChange={(_, newInputValue) => handleIndustryChange(newInputValue)}
                      onChange={(_, newValue) => {
                        handleIndustryChange(newValue); // Chỉ cập nhật state
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Chọn hoặc gõ ngành chính (Ví dụ: CNTT, Marketing...)"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: 13 }}>Khu vực mong muốn</InputLabel>
                      <Select
                        value={location}
                        label="Khu vực đào tạo"
                        onChange={(e) => {
                          const newLoc = e.target.value;
                          setLocation(newLoc);
                        }}
                        sx={{ fontSize: 13 }}
                      >
                        {locationOptions.map((loc) => (
                          <MenuItem key={loc.value} value={loc.value} sx={{ fontSize: 13 }}>{loc.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* BƯỚC 2: CHỌN MỤC TIÊU PHÂN TÁCH LUỒNG */}
              {/* Loại bỏ thuộc tính opacity/pointer-events ẩn form để mở rộng cho phép người dùng chọn Trường học ngay từ đầu */}
              <Box sx={{ transition: "all 0.3s" }}>
                <Typography component="div" variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip size="small" label="Bước 2" color="primary" sx={{ height: 20, fontSize: 11 }} /> Chọn mục tiêu cụ thể:
                </Typography>

                <Grid container spacing={1.5}>
                  {/* Nhánh 1: Trường học (Chế độ ĐI HỌC) */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ bgcolor: selectedSchool ? blue[50] : "none", borderColor: selectedSchool ? blue[300] : grey[200], borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <SchoolIcon color="primary" fontSize="small" /> Cơ sở đào tạo (Xem Điểm Chuẩn):
                        </Typography>

                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ fontSize: 13 }}>Chọn trường mục tiêu</InputLabel>
                          <Select
                            value={selectedSchool}
                            label="Chọn trường mục tiêu"
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedSchool(val);
                              setSelectedJob("");
                            }}
                            sx={{ fontSize: 13 }}
                          >
                            {/* Restore MenuItem children */}
                            {currentSchools.map((sch) => (
                              <MenuItem key={sch} value={sch} sx={{ fontSize: 13 }}>{sch}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Nhánh 2: Vị trí công việc (Chế độ ĐI LÀM) */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ bgcolor: selectedJob ? amber[50] : "none", borderColor: selectedJob ? amber[400] : grey[200], borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <BusinessIcon sx={{ color: amber[800] }} fontSize="small" /> Cơ hội / Vị trí việc làm:
                        </Typography>
                        <Stack spacing={1.5}>
                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontSize: 13 }}>Chọn vị trí muốn làm</InputLabel>
                            <Select
                              value={selectedJob}
                              label="Chọn vị trí muốn làm"
                              disabled={!industry} // Đi làm cần có định hướng ngành từ Bước 1
                              onChange={(e) => {
                                const val = e.target.value;
                                setSelectedJob(val);
                                setSelectedSchool("");
                              }}
                              sx={{ fontSize: 13 }}
                            >
                            {/* Restore MenuItem children */}
                              {currentJobs.map((job) => (
                                <MenuItem key={job} value={job} sx={{ fontSize: 13 }}>{job}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSearchButtonClick}
                disabled={loading || (!industry && !selectedSchool && !selectedJob)}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                sx={{
                  bgcolor: amber[600],
                  '&:hover': { bgcolor: amber[700] },
                }}
              >
                {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
              </Button>

              {error && <Alert severity="error" sx={{ borderRadius: 2, py: 0.5, fontSize: 13 }}>{error}</Alert>}
            </Stack>
          </Paper>

          {/* HIỆU ỨNG TẢI DỮ LIỆU */}
          {loading && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={28} />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Đang tìm kiếm và quét dữ liệu tại khu vực: {location}...
              </Typography>
            </Box>
          )}

          {/* BƯỚC 3: HIỂN THỊ DỮ LIỆU KẾT QUẢ ĐÃ ĐỒNG BỘ */}
          {answer && !loading && (
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                p: { xs: 2, md: 3 },
                bgcolor: currentMode === "HOC" ? blue[50] : amber[50],
                borderRadius: 3,
                border: `1px solid ${currentMode === "HOC" ? blue[200] : amber[200]}`
              }}
            >
              <Typography variant="subtitle2" fontWeight="800" color={grey[900]} gutterBottom display="flex" alignItems="center" gap={1}>
                <SearchIcon color="primary" fontSize="small" /> KẾT QUẢ TRA CỨU TẠI: {location}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2, color: grey[800], lineHeight: 1.6, fontWeight: 500 }}>
                {answer.summary}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* KỊCH BẢN 1: CHẾ ĐỘ ĐI HỌC - TRA THEO TRƯỜNG MỤC TIÊU (school_only) */}
              {currentMode === "HOC" && answer.searchType === "school_only" && answer.topMajors && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SchoolIcon color="primary" fontSize="small" /> Danh sách ngành đào tạo tiêu biểu của trường:
                  </Typography>
                  <Grid container spacing={1.5}>
                    {answer.topMajors.map((majorItem, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff" }}>
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1 }}>
                              {majorItem.majorName}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: grey[50], p: 1, borderRadius: 1 }}>
                              <EventAvailableIcon sx={{ fontSize: 16, color: grey[600] }} />
                              <Typography variant="caption" color="text.secondary">
                                Điểm chuẩn {majorItem.benchmarkYear || 2025}:
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color={majorItem.benchmark ? "primary.main" : "text.disabled"}>
                                {majorItem.benchmark ? `${majorItem.benchmark}đ` : "N/A"}
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* KỊCH BẢN 2: CHẾ ĐỘ ĐI HỌC - CHỈ TRA THEO NGÀNH HỌC (major_only) */}
              {currentMode === "HOC" && answer.searchType === "major_only" && answer.schools && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SchoolIcon color="primary" fontSize="small" /> Các trường có đào tạo ngành phù hợp tại khu vực:
                  </Typography>
                  <Stack spacing={1.5}>
                    {answer.schools.map((schoolItem, idx) => (
                      <Card key={idx} variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff" }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="body2" fontWeight="bold" color={grey[900]}>
                              {schoolItem.schoolName}
                            </Typography>
                            <Chip icon={<LocationOnIcon sx={{ fontSize: '12px !important' }} />} label={schoolItem.location} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                          </Stack>
                          
                          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: blue[50], p: 1, borderRadius: 1.5 }}>
                            <EventAvailableIcon sx={{ fontSize: 16, color: blue[700] }} />
                            <Typography variant="caption" fontWeight="bold" color={grey[700]}>
                              Điểm chuẩn năm {schoolItem.benchmarkYear || "gần nhất"}:
                            </Typography>
                            <Typography variant="body2" fontWeight="black" color="primary.main">
                              {schoolItem.benchmark ? `${schoolItem.benchmark}đ` : "N/A"}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* KỊCH BẢN 3: CÓ CẢ TRƯỜNG VÀ NGÀNH CỤ THỂ (school_and_major) */}
              {currentMode === "HOC" && answer.searchType === "school_and_major" && answer.majorInfo && (
                <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, border: `1px solid ${grey[200]}` }}>
                  <Typography variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SchoolIcon fontSize="small" /> Chi tiết ngành {answer.majorInfo.majorName || answer.majorName} tại trường {answer.schoolName || selectedSchool}
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                    <Box sx={{ p: 1.5, bgcolor: grey[50], borderRadius: 1.5 }}>
                      <Grid container alignItems="center">
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" color="text.secondary" display="block">Điểm chuẩn tra cứu:</Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {answer.majorInfo.benchmark ? `${answer.majorInfo.benchmark}đ` : "N/A"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" color="text.secondary" display="block">Năm tuyển sinh:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            Năm {answer.majorInfo.benchmarkYear || 2025}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Nguồn: ${answer.majorInfo.benchmarkSource || 'Tìm kiếm trực tiếp'}`} size="small" variant="outlined" />
                      {answer.majorInfo.benchmarkVerified && <Chip label="Đã Xác Thực Chính Xác" size="small" color="success" />}
                    </Stack>
                  </Stack>
                </Box>
              )}

              {/* KỊCH BẢN 4: CHẾ ĐỘ ĐI LÀM (companies) */}
              {currentMode === "LAM" && answer.companies && answer.companies.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BusinessIcon sx={{ color: amber[800], fontSize: 18 }} /> Đề xuất doanh nghiệp tuyển dụng tại {location}:
                  </Typography>
                  <Stack spacing={1.5}>
                    {answer.companies.map((company, idx) => (
                      <Card key={idx} variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff" }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" fontWeight="bold" color={grey[900]}>
                              {company.companyName}
                            </Typography>
                            <Chip icon={<LocationOnIcon sx={{ fontSize: '12px !important' }} />} label={company.location} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                          </Stack>

                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                            {company.description}
                          </Typography>

                          <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" fontWeight="bold" color={grey[700]} sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <WorkOutlineIcon sx={{ fontSize: 14 }} /> Vị trí đang tuyển dụng nóng:
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                              {company.positions.map((pos, pIdx) => (
                                <Chip key={pIdx} label={pos} size="small" sx={{ bgcolor: grey[100], fontSize: 11, height: 20 }} />
                              ))}
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            {company.website && (
                              <Link href={company.website} target="_blank" rel="noopener" variant="caption" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.3 }}>
                                <LanguageIcon sx={{ fontSize: 12 }} /> Trang chủ Công Ty
                              </Link>
                            )}
                            {company.careerLink && (
                              <Link href={company.careerLink} target="_blank" rel="noopener" variant="caption" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.3, color: amber[900] }}>
                                <ArrowForwardIcon sx={{ fontSize: 12 }} /> Ứng tuyển ngay
                              </Link>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}