import { useState, useEffect } from "react";
// 🚀 ĐIỀU CHỈNH ĐƯỜNG DẪN IMPORT API CHO ĐÚNG VỚI VỊ TRÍ MỚI TRONG FOLDER ADMIN
import { apiRequest } from "../services/api"; 
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import {
  People,
  Description,
  Timeline,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const orange = "#F59E0B";
const amber = "#FBBF24";
const yellow = "#FCD34D";
const gray = "#9E9E9E";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

// Định nghĩa interfaces rõ ràng thay vì dùng anys để tối ưu TypeScript
interface StatItem {
  title: string;
  value: string | number;
  change: string;
  color?: string;
  icon?: any;
}

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${borderColor}`,
        borderRadius: "18px",
        bgcolor: "#fff",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
          {title}
        </Typography>

        <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
          {description}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [careerTrendData, setCareerTrendData] = useState<any[]>([]);
  const [personalityData, setPersonalityData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Đã loại bỏ hoàn toàn logic liên quan đến "Danh mục ngành" và "Nghề nghiệp" ở đây
  const getIconAndColor = (title: string) => {
    switch (title) {
      case "Tổng người dùng":
        return { icon: People, color: "#F59E0B" };
      case "Tài khoản hoạt động":
        return { icon: People, color: "#10B981" };
      case "Prompts":
        return { icon: Description, color: "#FBBF24" };
      case "Khảo sát hoàn thành":
      default:
        return { icon: Timeline, color: "#9CA3AF" };
    }
  };

  useEffect(() => {
    setLoading(true);
    apiRequest("/admin/dashboard/stats")
      .then(res => {
        if (res.success) {
          // Lọc bỏ hẳn "Danh mục ngành" và "Nghề nghiệp" nếu API trả về trong mảng stats
          const filteredStats = (res.stats || []).filter(
            (s: any) => s.title !== "Danh mục ngành" && s.title !== "Nghề nghiệp"
          );

          // Map stats icons and colors
          const mappedStats = filteredStats.map((s: any) => {
            const extra = getIconAndColor(s.title);
            return { ...s, ...extra };
          });
          setStats(mappedStats);

          // Map surveyData (completed)
          const mappedSurvey = (res.surveyData || []).map((d: any) => ({
            month: d.name || d.month,
            count: d.completed || d.count || 0
          }));
          setSurveyData(mappedSurvey);

          // Map careerTrendData
          const mappedCareers = (res.careerTrendData || []).map((d: any) => ({
            month: d.career || d.month,
            users: d.count || d.users || 0
          }));
          setCareerTrendData(mappedCareers);

          // Map personalityData with colors
          const colors = [orange, amber, yellow, gray, "#8B5CF6", "#EC4899"];
          const mappedPersonality = (res.personalityData || []).map((d: any, idx: number) => ({
            ...d,
            color: colors[idx % colors.length]
          }));
          setPersonalityData(mappedPersonality);

          setRecentActivities(res.recentActivities || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: orange }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
            color: textMain,
            letterSpacing: "-0.03em",
          }}
        >
          Dashboard
        </Typography>

        <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
          Tổng quan hệ thống và các chỉ số quan trọng
        </Typography>
      </Box>

      {/* Các ô chỉ số đếm tổng quan */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              elevation={0}
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: "18px",
                bgcolor: "#fff",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: textMuted,
                    }}
                  >
                    {stat.title}
                  </Typography>

                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {Icon && <Icon sx={{ color: "#fff", fontSize: 20 }} />}
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: textMain,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>

                <Typography sx={{ fontSize: 13, color: "#16a34a", mt: 1 }}>
                  {stat.change} so với tháng trước
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Khu vực chứa các Biểu đồ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        {/* Sửa lại BarChart để đảm bảo an toàn thuộc tính dữ liệu */}
        <ChartCard
          title="Hoạt động khảo sát"
          description="Số lượng khảo sát hoàn thành theo ngày"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={surveyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar dataKey="count" fill={orange} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Số lượng người dùng quan tâm"
          description="Số người dùng quan tâm theo ngày"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={careerTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke={orange}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      <Box width={"100%"} height={280}>
        <ChartCard
          title="Hiệu suất AI"
          description="Các chỉ số hiệu suất hệ thống AI"
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            {[
              {
                label: "Độ chính xác",
                value: "94.2%",
                percent: 94.2,
                color: orange,
              },
              {
                label: "Thời gian phản hồi",
                value: "1.2s",
                percent: 85,
                color: amber,
              },
              {
                label: "Mức độ hài lòng",
                value: "4.7/5.0",
                percent: 94,
                color: "#6B7280",
              },
            ].map((item) => (
              <Box key={item.label}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: textMain }}>
                    {item.label}
                  </Typography>

                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={item.percent}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "#f3f4f6",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: item.color,
                      borderRadius: 999,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </ChartCard>
        </Box>
      </Box>

      {/* Hoạt động gần đây */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: textMain }}>
            Hoạt động gần đây
          </Typography>

          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 2 }}>
            Các hoạt động mới nhất trong hệ thống
          </Typography>

          <Box>
            {recentActivities.map((activity, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  pb: 2,
                  mb: 2,
                  borderBottom:
                    index === recentActivities.length - 1
                      ? "none"
                      : `1px solid ${borderColor}`,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: orange,
                    mt: 0.8,
                    flexShrink: 0,
                  }}
                />

                <Box>
                  <Typography sx={{ fontSize: 14, color: textMain }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {activity.user}
                    </Box>{" "}
                    {activity.action}
                  </Typography>

                  <Typography sx={{ fontSize: 12, color: textMuted, mt: 0.5 }}>
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}