import { useState } from "react";
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
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { amber, blue, grey } from "@mui/material/colors";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface LinkDetail {
  url: string;
  title?: string;
  domain?: string;
}

interface SchoolMajorItem {
  majorName: string;
  officialLink: LinkDetail | null;
}

interface SchoolItem {
  schoolName: string;
  location: string;
  majorName: string;
  officialLink: LinkDetail | null;
  source: string;
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
  schoolVerified?: boolean;
  hasMajor?: boolean;
  summary: string;
  officialLink?: LinkDetail | null;
  topMajors?: SchoolMajorItem[];     
  schools?: SchoolItem[];            
  majorInfo?: {                      
    majorName: string;
    duration: string;
    combinations: string[];
    officialLink: LinkDetail | null;
  };
  companies?: CompanyItem[];         
}

export function QuickCareerAdvisor() {
  const [industry, setIndustry] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [answer, setAnswer] = useState<ApiResponse | null>(null);
  const [currentMode, setCurrentMode] = useState<"HOC" | "LAM" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper function safely extracting URL
  const getOfficialUrl = (link: string | LinkDetail | null | undefined): string | null => {
    if (!link) return null;
    if (typeof link === 'string') return link; 
    return link.url || null; 
  };

  const handleSearchButtonClick = () => {
    let modeToPerform: "HOC" | "LAM" | null = null;

    if (selectedJob) {
      modeToPerform = "LAM";
    } else if (selectedSchool || industry) {
      modeToPerform = "HOC";
    }

    console.log('handleSearchButtonClick triggered. Current state:', { industry, selectedSchool, selectedJob, modeToPerform });
    if (modeToPerform) {
      performSearch(modeToPerform);
    } else {
      setError("Vui lòng nhập ngành học, trường học hoặc vị trí công việc để tìm kiếm.");
    }
  };

  const performSearch = async (mode: "HOC" | "LAM") => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setError("Bạn cần đăng nhập để sử dụng chức năng này.");
      return;
    }

    setError("");
    setLoading(true);
    setAnswer(null);

    try {
      const payload: any = {
        mode: mode,
        location: "Việt Nam", 
        age: user.profile?.age || (mode === "HOC" ? 17 : 22),
      };

      if (mode === "HOC") {
        if (selectedSchool) {
          payload.school = selectedSchool;
          if (industry) payload.industry = industry;
        } else if (industry) {
          payload.industry = industry;
        }
      } else { 
        payload.position = selectedJob;
        if (industry) payload.industry = industry;
      }

      console.log('performSearch payload:', payload);
      const response = await fetch(`${API_URL}/api/search/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Đón nhận data chuẩn xác dựa trên cấu trúc lồng hoặc giải phẳng từ Backend
        const resultData = data.advice || data.data || data;
        setAnswer(resultData);
        
        // Cập nhật chế độ hiển thị dựa vào searchType hoặc cấu trúc dữ liệu đi kèm
        if (resultData.companies || mode === "LAM") {
          setCurrentMode("LAM");
        } else {
          setCurrentMode("HOC");
        }
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
              Tự động phân luồng thông minh dựa trên dữ liệu bạn nhập ở các ô tìm kiếm
            </Typography>
          </Stack>

          <Paper 
            elevation={0} 
            sx={{ width: "100%", p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${grey[200]}` }}
          >
            <Stack spacing={2.5}>
              {/* BƯỚC 1: NHẬP NGÀNH NGHỀ */}
              <Box>
                <Typography component="div" variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    Nhập ngành học bạn quan tâm:
                </Typography>
                
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tên ngành học (Ví dụ: Công nghệ thông tin, Marketing...)"
                  variant="outlined"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  inputProps={{ style: { fontSize: 13 } }}
                />
              </Box>

              <Divider />

              {/* BƯỚC 2: NHẬP MỤC TIÊU CỤ THỂ */}
              <Box sx={{ transition: "all 0.3s" }}>
                <Typography component="div" variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                    Nhập mục tiêu cụ thể:
                </Typography>

                <Grid container spacing={1.5}>
                  {/* Nhánh 1: Trường học */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ bgcolor: selectedSchool ? blue[50] : "none", borderColor: selectedSchool ? blue[300] : grey[200], borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <SchoolIcon color="primary" fontSize="small" /> Cơ sở đào tạo mục tiêu:
                        </Typography>

                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Nhập tên trường mục tiêu..."
                          value={selectedSchool}
                          onChange={(e) => {
                            setSelectedSchool(e.target.value);
                            setSelectedJob("");
                          }}
                          inputProps={{ style: { fontSize: 13 } }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Nhánh 2: Vị trí công việc */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ bgcolor: selectedJob ? amber[50] : "none", borderColor: selectedJob ? amber[400] : grey[200], borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <BusinessIcon sx={{ color: amber[800] }} fontSize="small" /> Cơ hội / Vị trí việc làm:
                        </Typography>
                        
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Nhập vị trí muốn làm..."
                          value={selectedJob}
                          onChange={(e) => {
                            setSelectedJob(e.target.value);
                            setSelectedSchool("");
                          }}
                          inputProps={{ style: { fontSize: 13 } }}
                        />
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
                Đang tiến hành tìm kiếm và quét dữ liệu định hướng...
              </Typography>
            </Box>
          )}

          {/* KẾT QUẢ TRA CỨU MÀN HÌNH */}
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
                <SearchIcon color="primary" fontSize="small" /> KẾT QUẢ TRA CỨU ĐỊNH HƯỚNG
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2, color: grey[800], lineHeight: 1.6, fontWeight: 500 }}>
                {answer.summary || `Kết quả tra cứu thông tin tương thích.`}
              </Typography>

              {answer.searchType === "school_only" && answer.officialLink && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: "#fff", borderRadius: 2, border: `1px dashed ${blue[300]}` }}>
                  <Link href={getOfficialUrl(answer.officialLink) || '#'} target="_blank" rel="noopener" variant="body2" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5, color: blue[700] }}>
                    <LanguageIcon sx={{ fontSize: 16 }} /> Cổng thông tin tuyển sinh chính thức của trường
                  </Link>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* KỊCH BẢN 1: CHỈ CÓ TÊN TRƯỜNG (school_only) */}
              {answer.searchType === "school_only" && answer.topMajors && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SchoolIcon color="primary" fontSize="small" /> Top ngành học nổi bật tại trường:
                  </Typography>
                  <Grid container spacing={1.5}>
                    {answer.topMajors.map((majorItem, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff" }}>
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="body2" fontWeight="bold" color={grey[900]}>
                              {majorItem.majorName}
                            </Typography>
                            {majorItem.officialLink && (
                              <Link href={getOfficialUrl(majorItem.officialLink) || '#'} target="_blank" rel="noopener" variant="caption" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.3, mt: 1, color: blue[700] }}>
                                <LanguageIcon sx={{ fontSize: 12 }} /> Xem trang tuyển sinh ngành
                              </Link>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* KỊCH BẢN 2: CHỈ CÓ TÊN NGÀNH HỌC (major_only) */}
              {answer.searchType === "major_only" && answer.schools && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SchoolIcon color="primary" fontSize="small" /> Các cơ sở đào tạo ngành này trên hệ thống:
                  </Typography>
                  <Stack spacing={1.5}>
                    {answer.schools.map((schoolItem, idx) => (
                      <Card key={idx} variant="outlined" sx={{ borderRadius: 2, bgcolor: "#fff", border: `1px solid ${grey[200]}` }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="body2" fontWeight="bold" color={grey[900]}>
                              {schoolItem.schoolName}
                            </Typography>
                            <Chip icon={<LocationOnIcon sx={{ fontSize: '12px !important' }} />} label={schoolItem.location || "Việt Nam"} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                          </Stack>
                          
                          {schoolItem.officialLink && (
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: blue[50], p: 1, borderRadius: 1.5, mt: 1 }}>
                              <Link href={getOfficialUrl(schoolItem.officialLink) || '#'} target="_blank" rel="noopener" variant="caption" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5, color: blue[700] }}>
                                <LanguageIcon sx={{ fontSize: 14 }} /> Xem trang tuyển sinh của trường
                              </Link>
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* KỊCH BẢN 3: CÓ CẢ TRƯỜNG VÀ NGÀNH CỤ THỂ (school_and_major) */}
              {answer.searchType === "school_and_major" && (
                <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, border: `1px solid ${grey[200]}` }}>
                  <Typography variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SchoolIcon fontSize="small" /> Chi tiết ngành {answer.majorName} tại {answer.schoolName}
                  </Typography>

                  {answer.hasMajor && answer.majorInfo ? (
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                      <Box sx={{ p: 1.5, bgcolor: grey[50], borderRadius: 1.5 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><QueryBuilderIcon sx={{ fontSize: 14 }} /> Thời gian học:</Typography>
                            <Typography variant="body2" fontWeight="bold">{answer.majorInfo.duration}</Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><MenuBookIcon sx={{ fontSize: 14 }} /> Tổ hợp môn xét tuyển:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {Array.isArray(answer.majorInfo.combinations) ? answer.majorInfo.combinations.join(", ") : "Đang cập nhật"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      {answer.majorInfo.officialLink && (
                        <Link href={getOfficialUrl(answer.majorInfo.officialLink) || '#'} target="_blank" rel="noopener" variant="body2" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.3, color: blue[700] }}>
                          <LanguageIcon sx={{ fontSize: 16 }} /> Xem chi tiết đề án tuyển sinh ngành này
                        </Link>
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 500 }}>
                      Hệ thống ghi nhận cơ sở này hiện chưa có thông tin đào tạo ngành học được chọn.
                    </Typography>
                  )}
                </Box>
              )}

              {/* KỊCH BẢN 4: ĐI LÀM (companies) */}
              {answer.companies && answer.companies.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color={grey[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BusinessIcon sx={{ color: amber[800], fontSize: 18 }} /> Đề xuất 5 doanh nghiệp tuyển dụng tiêu biểu:
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
                              <WorkOutlineIcon sx={{ fontSize: 14 }} /> Vị trí đang tuyển dụng:
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