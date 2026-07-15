import { useState, useEffect } from "react";
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
  TrendingUp,
  People,
  Bolt,
  TrackChanges,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const orange = "#F59E0B";
const amber = "#FBBF24";
const yellow = "#FCD34D";
const gray = "#9E9E9E";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${borderColor}`,
        borderRadius: "18px",
        bgcolor: "#fff",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: textMain }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 3 }}>
          {description}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export function AnalyticsPage() {
  const [metricCards, setMetricCards] = useState<any[]>([]);
  const [surveyActivityData, setSurveyActivityData] = useState<any[]>([]);
  const [careerTrendData, setCareerTrendData] = useState<any[]>([]);
  const [personalityData, setPersonalityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiRequest("/admin/dashboard/stats")
      .then(res => {
        if (res.success) {
          // Parse metrics values
          const activeUserStat = res.stats.find((s: any) => s.title === "Tài khoản hoạt động");
          const totalUserStat = res.stats.find((s: any) => s.title === "Tổng người dùng");
          const surveyStat = res.stats.find((s: any) => s.title === "Khảo sát hoàn thành");
          const compStat = res.stats.find((s: any) => s.title === "Độ phù hợp TB");

          setMetricCards([
            {
              title: "Tổng quan hệ thống",
              value: "99.9%",
              desc: "Uptime hệ thống",
              icon: TrackChanges,
              bg: orange,
            },
            {
              title: "Người dùng hoạt động",
              value: activeUserStat ? activeUserStat.value : "0",
              desc: `Tổng: ${totalUserStat ? totalUserStat.value : "0"}`,
              icon: People,
              bg: amber,
            },
            {
              title: "Khảo sát hoàn thành",
              value: surveyStat ? surveyStat.value : "0",
              desc: "Tổng số khảo sát",
              icon: Bolt,
              bg: "#6b7280",
            },
            {
              title: "Độ tương thích TB",
              value: compStat ? compStat.value : "0%",
              desc: "Trung bình toàn hệ thống",
              icon: TrendingUp,
              bg: gray,
            },
          ]);

          // Set chart activity weekly
          setSurveyActivityData((res.surveyData || []).map((d: any) => ({
            week: d.name,
            completed: d.completed,
            started: d.completed + d.aborted
          })));

          // Set career trends
          setCareerTrendData((res.careerTrendData || []).map((d: any) => ({
            month: d.career,
            IT: d.count,
            Marketing: Math.round(d.count * 0.7),
            Finance: Math.round(d.count * 0.5),
            Healthcare: Math.round(d.count * 0.3)
          })));

          // Set personality layout
          const colors = [orange, amber, yellow, gray];
          setPersonalityData((res.personalityData || []).slice(0, 4).map((d: any, idx: number) => ({
            name: d.name.split(" ")[0],
            value: d.value,
            color: colors[idx % colors.length]
          })));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const aiPerformanceData = [
    { month: "T1", accuracy: 89, responseTime: 1.8, satisfaction: 4.2 },
    { month: "T2", accuracy: 91, responseTime: 1.6, satisfaction: 4.4 },
    { month: "T3", accuracy: 92, responseTime: 1.5, satisfaction: 4.5 },
    { month: "T4", accuracy: 93, responseTime: 1.3, satisfaction: 4.6 },
    { month: "T5", accuracy: 94, responseTime: 1.2, satisfaction: 4.7 },
    { month: "T6", accuracy: 95, responseTime: 1.1, satisfaction: 4.8 },
  ];

  const detailedStats = [
    { label: "Tỷ lệ hoàn thành khảo sát", value: "87%", percent: 87, color: orange },
    { label: "Độ chính xác gợi ý nghề nghiệp", value: "92%", percent: 92, color: amber },
    { label: "Mức độ hài lòng người dùng", value: "4.8/5.0", percent: 96, color: "#6b7280" },
    { label: "Thời gian phản hồi trung bình", value: "1.1s", percent: 78, color: gray },
    { label: "Tỷ lệ người dùng quay lại", value: "64%", percent: 64, color: orange },
    { label: "Tỷ lệ chuyển đổi", value: "71%", percent: 71, color: amber },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: orange }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 700,
            color: textMain,
            letterSpacing: "-0.03em",
          }}
        >
          Thống kê & Phân tích
        </Typography>

        <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
          Phân tích chi tiết các chỉ số và xu hướng
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {metricCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              elevation={0}
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: "18px",
                bgcolor: "#fff",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: textMuted }}>
                    {item.title}
                  </Typography>

                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: item.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                </Box>

                <Typography sx={{ fontSize: 30, fontWeight: 800, color: textMain }}>
                  {item.value}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#16a34a", mt: 0.5 }}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2, mb: 3 }}>
        <ChartCard
          title="Phân tích xu hướng ngành nghề"
          description="Số người dùng quan tâm đến các lĩnh vực theo tháng"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={careerTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="IT" stroke={orange} strokeWidth={2} />
              <Line type="monotone" dataKey="Marketing" stroke={amber} strokeWidth={2} />
              <Line type="monotone" dataKey="Finance" stroke={yellow} strokeWidth={2} />
              <Line type="monotone" dataKey="Healthcare" stroke={gray} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Phân tích nhóm tính cách phổ biến"
          description="Phân bố các nhóm tính cách trong hệ thống"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={personalityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={75}
                dataKey="value"
              >
                {personalityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2, mb: 3 }}>
        <ChartCard
          title="Theo dõi hiệu suất AI"
          description="Các chỉ số hiệu suất của hệ thống AI theo tháng"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aiPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke={orange} strokeWidth={2} name="Độ chính xác (%)" />
              <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke={gray} strokeWidth={2} name="Mức độ hài lòng" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Thống kê hoạt động khảo sát"
          description="So sánh số khảo sát bắt đầu và hoàn thành"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={surveyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="started" fill={yellow} name="Bắt đầu" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" fill={orange} name="Hoàn thành" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: "18px",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: textMain }}>
            Chi tiết thống kê
          </Typography>
          <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5, mb: 3 }}>
            Các chỉ số chi tiết theo từng mảng
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {detailedStats.map((item) => (
              <Box key={item.label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ fontSize: 14, color: textMain }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain }}>
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
        </CardContent>
      </Card>
    </Box>
  );
}