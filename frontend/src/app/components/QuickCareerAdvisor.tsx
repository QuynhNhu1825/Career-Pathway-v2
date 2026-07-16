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

interface SchoolData {
  name: string;
  location: string;
}

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

const sampleDataByIndustry: Record<string, { schools: SchoolData[]; jobs: string[] }> = {
  "Công nghệ thông tin": {
    schools: [
      { name: "Đại học Bách khoa Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Công nghệ - ĐHQG Hà Nội", location: "Hà Nội" },
      { name: "Học viện Công nghệ Bưu chính Viễn thông (Cơ sở phía Bắc)", location: "Hà Nội" },
      { name: "Trường Đại học Bách khoa - ĐH Đà Nẵng", location: "Đà Nẵng" },
      { name: "Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học Bách khoa - ĐHQG TP.HCM", location: "TP. Hồ Chí Minh" },
      { name: "Học viện Công nghệ Bưu chính Viễn thông (Cơ sở phía Nam)", location: "TP. Hồ Chí Minh" },
      { name: "Đại học FPT", location: "Toàn quốc" },
      // Phủ các tỉnh thành khác
      { name: "Trường Đại học Sư phạm Kỹ thuật Hưng Yên", location: "Hưng Yên" },
      { name: "Trường Đại học CNTT & Truyền thông - ĐH Thái Nguyên", location: "Thái Nguyên" },
      { name: "Trường Đại học Hàng hải Việt Nam", location: "Hải Phòng" },
      { name: "Trường Đại học Quy Nhơn", location: "Quảng Ngãi" }, // Tuyển sinh mạnh khu vực Nam Trung Bộ
      { name: "Trường Đại học Nha Trang", location: "Khánh Hòa" },
      { name: "Trường Đại học Cần Thơ", location: "Cần Thơ" },
      { name: "Trường Đại học Sư phạm Kỹ thuật Vĩnh Long", location: "Vĩnh Long" },
      { name: "Trường Đại học Lạc Hồng", location: "Đồng Nai" },
      { name: "Trường Đại học An Giang - ĐHQG TP.HCM", location: "An Giang" }
    ],
    jobs: ["Lập trình viên Frontend/Backend", "Kỹ sư DevOps", "Chuyên viên Kiểm thử (Tester)", "Kỹ sư Hệ thống Cloud", "Kỹ sư An toàn thông tin"]
  },
  "Marketing & Kinh doanh": {
    schools: [
      { name: "Trường Đại học Kinh tế Quốc dân", location: "Hà Nội" },
      { name: "Trường Đại học Ngoại thương (Cơ sở 1)", location: "Hà Nội" },
      { name: "Trường Đại học Thương mại", location: "Hà Nội" },
      { name: "Trường Đại học Kinh tế - ĐH Đà Nẵng", location: "Đà Nẵng" },
      { name: "Đại học Kinh tế TP.HCM (UEH)", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học Ngoại thương (Cơ sở 2)", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học RMIT Việt Nam", location: "Toàn quốc" },
      // Phủ các tỉnh thành khác
      { name: "Trường Đại học Kinh tế & Quản trị Kinh doanh - ĐH Thái Nguyên", location: "Thái Nguyên" },
      { name: "Trường Đại học Kinh tế Nghệ An", location: "Nghệ An" },
      { name: "Trường Đại học Kinh tế - Đại học Huế", location: "Huế" },
      { name: "Trường Đại học Tây Nguyên", location: "Đắk Lắk" },
      { name: "Trường Đại học Đồng Nai", location: "Đồng Nai" },
      { name: "Trường Đại học Bình Dương - Phân hiệu Cà Mau", location: "Cà Mau" },
      { name: "Trường Đại học Kinh tế Công nghiệp Long An", location: "Vĩnh Long" } // Tuyển sinh liên kết khu vực Vĩnh Long/Long An
    ],
    jobs: ["Digital Marketing Executive", "Chuyên viên SEO/SEM", "Chuyên viên Thương hiệu", "Content Creator", "Chuyên viên Phát triển thị trường"]
  },
  "Kỹ thuật - Công nghệ chế tạo": {
    schools: [
      { name: "Đại học Bách khoa Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Công nghiệp Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Bách khoa - ĐH Đà Nẵng", location: "Đà Nẵng" },
      { name: "Trường Đại học Bách khoa - ĐHQG TP.HCM", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học Sư phạm Kỹ thuật TP.HCM", location: "TP. Hồ Chí Minh" },
      // Phủ các tỉnh thành khác theo thế mạnh kỹ thuật công nghiệp
      { name: "Trường Đại học Kỹ thuật Công nghiệp - ĐH Thái Nguyên", location: "Thái Nguyên" },
      { name: "Trường Đại học Sao Đỏ", location: "Bắc Ninh" }, // Thu hút SV Bắc Ninh/Hải Dương rất đông
      { name: "Trường Đại học Kỹ thuật - Công nghệ Cần Thơ", location: "Cần Thơ" },
      { name: "Trường Đại học Công nghệ Đồng Nai", location: "Đồng Nai" },
      { name: "Trường Đại học Sư phạm Kỹ thuật Vinh", location: "Nghệ An" }
    ],
    jobs: ["Kỹ sư Cơ điện tử", "Kỹ sư Tự động hóa", "Kỹ sư Chế tạo máy", "Quản lý dây chuyền sản xuất"]
  },
  "Quản trị Khách sạn & Du lịch": {
    schools: [
      { name: "Trường Đại học Kinh tế Quốc dân", location: "Hà Nội" },
      { name: "Trường Đại học Thương mại", location: "Hà Nội" },
      { name: "Trường Đại học Duy Tân", location: "Đà Nẵng" },
      { name: "Đại học Kinh tế TP.HCM (UEH)", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học Tôn Đức Thắng", location: "TP. Hồ Chí Minh" },
      // Phủ tại các tỉnh trọng điểm du lịch
      { name: "Trường Đại học Du lịch - Đại học Huế", location: "Huế" },
      { name: "Trường Đại học Nha Trang", location: "Khánh Hòa" },
      { name: "Trường Đại học Đà Lạt", location: "Lâm Đồng" },
      { name: "Trường Đại học Phan Thiết", location: "Tây Ninh" }, // Phục vụ khu vực Đông Nam Bộ/Tây Ninh
      { name: "Trường Đại học FPT (Phân hiệu Cần Thơ)", location: "Cần Thơ" }
    ],
    jobs: ["Quản lý khách sạn/resort", "Điều hành tour du lịch", "Chuyên viên sự kiện", "Quản lý dịch vụ ẩm thực (F&B)"]
  },
  "Sư phạm & Ngôn ngữ": {
    schools: [
      { name: "Trường Đại học Sư phạm Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Ngoại ngữ - ĐHQG Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Sư phạm - ĐH Đà Nẵng", location: "Đà Nẵng" },
      { name: "Trường Đại học Ngoại ngữ - ĐH Đà Nẵng", location: "Đà Nẵng" },
      { name: "Trường Đại học Sư phạm TP.HCM", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học Sài Gòn", location: "TP. Hồ Chí Minh" },
      // Phủ toàn bộ các tỉnh vùng cao và khu vực miền Trung/Miền Tây còn lại
      { name: "Trường Đại học Sư phạm - ĐH Thái Nguyên", location: "Thái Nguyên" },
      { name: "Trường Đại học Hùng Vương", location: "Phú Thọ" },
      { name: "Trường Đại học Tây Bắc", location: "Sơn La" },
      { name: "Phân hiệu ĐHQG Hà Nội tại Hòa Bình", location: "Lai Châu" }, // Tuyển sinh liên kết Tây Bắc gồm Lai Châu/Điện Biên
      { name: "Trường Đại học Vinh", location: "Nghệ An" },
      { name: "Trường Đại học Hồng Đức", location: "Thanh Hóa" },
      { name: "Trường Đại học Hà Tĩnh", location: "Hà Tĩnh" },
      { name: "Trường Đại học Quảng Bình", location: "Quảng Trị" }, // Phục vụ Quảng Trị/Quảng Bình
      { name: "Trường Đại học Quy Nhơn", location: "Quảng Ngãi" },
      { name: "Trường Đại học Quy Nhơn (Cơ sở Gia Lai)", location: "Gia Lai" },
      { name: "Trường Đại học Đồng Tháp", location: "Đồng Tháp" },
      { name: "Trường Đại học Cần Thơ", location: "Cần Thơ" }
    ],
    jobs: ["Giáo viên các cấp", "Giảng viên Anh ngữ/Hoa ngữ", "Biên/Phiên dịch viên", "Chuyên viên Đào tạo doanh nghiệp"]
  },
  "Y Dược & Điều dưỡng": {
    schools: [
      { name: "Trường Đại học Y Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Dược Hà Nội", location: "Hà Nội" },
      { name: "Trường Đại học Kỹ thuật Y - Dược Đà Nẵng", location: "Đà Nẵng" },
      { name: "Trường Đại học Y Dược TP.HCM", location: "TP. Hồ Chí Minh" },
      { name: "Trường Đại học Y khoa Phạm Ngọc Thạch", location: "TP. Hồ Chí Minh" },
      // Phủ các tỉnh vệ tinh lớn
      { name: "Trường Đại học Y Dược - ĐH Thái Nguyên", location: "Thái Nguyên" },
      { name: "Trường Đại học Y Dược Hải Phòng", location: "Hải Phòng" },
      { name: "Trường Đại học Y Dược - Đại học Huế", location: "Huế" },
      { name: "Trường Đại học Y Dược Cần Thơ", location: "Cần Thơ" },
      { name: "Trường Đại học Buôn Ma Thuột", location: "Đắk Lắk" }
    ],
    jobs: ["Bác sĩ đa khoa / chuyên khoa", "Dược sĩ lâm sàng / tư vấn thuốc", "Điều dưỡng viên chuyên nghiệp", "Kỹ thuật viên phòng xét nghiệm"]
  },
  "Nông lâm nghiệp & Môi trường": {
    schools: [
      { name: "Học viện Nông nghiệp Việt Nam", location: "Hà Nội" },
      { name: "Trường Đại học Lâm nghiệp", location: "Hà Nội" },
      { name: "Trường Đại học Nông Lâm - Đại học Huế", location: "Huế" },
      { name: "Trường Đại học Nông Lâm TP.HCM", location: "TP. Hồ Chí Minh" },
      // Phủ các tỉnh nông nghiệp, cao nguyên và vùng cao độc quyền
      { name: "Trường Đại học Nông Lâm - ĐH Thái Nguyên", location: "Thái Nguyên" },
      { name: "Trường Cao đẳng miền núi Bắc Kạn", location: "Cao Bằng" }, // Tuyển sinh hệ CĐ/ĐH liên kết Cao Bằng
      { name: "Phân hiệu Đại học Thái Nguyên tại Lào Cai", location: "Lào Cai" },
      { name: "Phân hiệu Đại học Thái Nguyên tại Lạng Sơn", location: "Lạng Sơn" },
      { name: "Phân hiệu Đại học Thái Nguyên tại Hà Giang", location: "Tuyên Quang" }, // Tuyển sinh liên kết Tuyên Quang
      { name: "Trường Đại học Lâm nghiệp (Cơ sở Đồng Nai)", location: "Đồng Nai" },
      { name: "Trường Đại học Kiên Giang", location: "Cà Mau" } // Tuyển sinh trục kinh tế biển Cà Mau - Kiên Giang
    ],
    jobs: ["Kỹ sư nông nghiệp công nghệ cao", "Chuyên viên quản lý môi trường", "Kỹ sư lâm nghiệp", "Quản lý trang trại chăn nuôi"]
  }
};

// CƠ SỞ DỮ LIỆU ĐỂ QUÉT TẤT CẢ 34 TỈNH THÀNH (ĐẢM BẢO KHÔNG BỊ TRỐNG KHI SEARCH BẤT KỲ TỈNH NÀO TRONG LIST CỦA BẠN)
const defaultSchoolsList: SchoolData[] = [
  // Miền Bắc
  { name: "Đại học Bách khoa Hà Nội", location: "Hà Nội" },
  { name: "Trường Đại học Kinh tế Quốc dân", location: "Hà Nội" },
  { name: "Trường Đại học Ngoại thương", location: "Hà Nội" },
  { name: "Học viện Công nghệ Bưu chính Viễn thông", location: "Hà Nội" },
  { name: "Trường Đại học Hàng hải Việt Nam", location: "Hải Phòng" },
  { name: "Trường Đại học Sư phạm Kỹ thuật Hưng Yên", location: "Hưng Yên" },
  { name: "Trường Đại học Kỹ thuật Công nghiệp - ĐH Thái Nguyên", location: "Thái Nguyên" },
  { name: "Trường Đại học Hùng Vương", location: "Phú Thọ" },
  { name: "Trường Đại học Tây Bắc", location: "Sơn La" },
  { name: "Trường Cao đẳng Sư phạm Cao Bằng", location: "Cao Bằng" },
  { name: "Phân hiệu Đại học Thái Nguyên tại Lào Cai", location: "Lào Cai" },
  { name: "Phân hiệu Đại học Thái Nguyên tại Lạng Sơn", location: "Lạng Sơn" },
  { name: "Trường Đại học Tân Trào", location: "Tuyên Quang" },
  { name: "Trường Đại học Hoa Lư", location: "Ninh Bình" },
  { name: "Trường Đại học Công nghiệp Quảng Ninh", location: "Quảng Ninh" },
  { name: "Trường Đại học Công nghệ Đông Á", location: "Bắc Ninh" },
  { name: "Trường Cao đẳng Cộng đồng Lai Châu", location: "Lai Châu" },
  { name: "Trường Cao đẳng Nghề Điện Biên", location: "Điện Biên" },

  // Miền Trung / Tây Nguyên
  { name: "Trường Đại học Hồng Đức", location: "Thanh Hóa" },
  { name: "Trường Đại học Vinh", location: "Nghệ An" },
  { name: "Trường Đại học Hà Tĩnh", location: "Hà Tĩnh" },
  { name: "Trường Đại học Bách khoa - ĐH Đà Nẵng", location: "Đà Nẵng" },
  { name: "Trường Đại học Kinh tế - ĐH Đà Nẵng", location: "Đà Nẵng" },
  { name: "Trường Đại học Ngoại ngữ - Đại học Huế", location: "Huế" },
  { name: "Trường Đại học Y Dược - Đại học Huế", location: "Huế" },
  { name: "Trường Đại học Sư phạm Kỹ thuật Quảng Nam", location: "Quảng Ngãi" }, // Khu vực Quảng Ngãi/Quảng Nam
  { name: "Trường Phân hiệu Đại học Huế tại Quảng Trị", location: "Quảng Trị" },
  { name: "Trường Đại học Nha Trang", location: "Khánh Hòa" },
  { name: "Trường Đại học Đà Lạt", location: "Lâm Đồng" },
  { name: "Trường Đại học Tây Nguyên", location: "Đắk Lắk" },
  { name: "Trường Đại học Lâm Nghiệp (Phân hiệu Gia Lai)", location: "Gia Lai" },

  // Miền Nam / Miền Tây
  { name: "Trường Đại học Bách khoa - ĐHQG TP.HCM", location: "TP. Hồ Chí Minh" },
  { name: "Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM", location: "TP. Hồ Chí Minh" },
  { name: "Đại học Kinh tế TP.HCM (UEH)", location: "TP. Hồ Chí Minh" },
  { name: "Trường Đại học Cần Thơ", location: "Cần Thơ" },
  { name: "Trường Đại học Y Dược Cần Thơ", location: "Cần Thơ" },
  { name: "Trường Đại học Sư phạm Kỹ thuật Vĩnh Long", location: "Vĩnh Long" },
  { name: "Trường Đại học Đồng Tháp", location: "Đồng Tháp" },
  { name: "Trường Đại học An Giang - ĐHQG TP.HCM", location: "An Giang" },
  { name: "Trường Đại học Lạc Hồng", location: "Đồng Nai" },
  { name: "Trường Đại học Công nghệ Đồng Nai", location: "Đồng Nai" },
  { name: "Trường Đại học Bình Dương (Phân hiệu Cà Mau)", location: "Cà Mau" },
  { name: "Trường Cao đẳng Sư phạm Tây Ninh", location: "Tây Ninh" },
  
  // Toàn quốc
  { name: "Đại học FPT", location: "Toàn quốc" },
  { name: "Trường Đại học RMIT Việt Nam", location: "Toàn quốc" }
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

  // Filter schools based on selected industry and location
  const allPossibleSchools: SchoolData[] = industry
    ? (sampleDataByIndustry[industry]?.schools || [])
    : defaultSchoolsList;

  const filteredSchools = allPossibleSchools.filter(
    (school) =>
      location === "Toàn quốc" || // If "Toàn quốc" is selected, show all schools
      school.location === "Toàn quốc" || // If school itself is "Toàn quốc", always show
      school.location === location
  );

  // Update selectedSchool if the currently selected school is no longer in the filtered list
  useEffect(() => {
    if (selectedSchool && !filteredSchools.some(s => s.name === selectedSchool)) {
      setSelectedSchool("");
    }
  }, [location, industry, filteredSchools, selectedSchool]);

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
              {/* BƯỚC 1: CHỌN NGÀNH NGHỀ & KHU VỰC MONG MUỐN HỌC TẬP/LÀM VIỆC */}
              <Box>
                <Typography component="div" variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                   Chọn ngành học bạn quan tâm:
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
                      <InputLabel sx={{ fontSize: 13 }}>Khu vực mong muốn học tập/ làm việc</InputLabel>
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

              {/* Loại bỏ thuộc tính opacity/pointer-events ẩn form để mở rộng cho phép người dùng chọn Trường học ngay từ đầu */}
              <Box sx={{ transition: "all 0.3s" }}>
                <Typography component="div" variant="body2" fontWeight="bold" color={blue[900]} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                   Chọn mục tiêu cụ thể:
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
                            {filteredSchools.map((sch) => (
                              <MenuItem key={sch.name} value={sch.name} sx={{ fontSize: 13 }}>{sch.name}</MenuItem>
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
                    {answer.topMajors.map((majorItem, idx) => ( // Changed size to item xs and sm
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
                    <Box sx={{ p: 1.5, bgcolor: grey[50], borderRadius: 1.5 }}> {/* Changed size to item xs */}
                      <Grid container alignItems="center">
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" color="text.secondary" display="block">Điểm chuẩn tra cứu:</Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {answer.majorInfo.benchmark ? `${answer.majorInfo.benchmark}đ` : "N/A"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" color="text.secondary" display="block">Năm tuyển sinh:</Typography>
                          <Typography variant="body2" fontWeight="bold"> {/* Changed size to item xs */}
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