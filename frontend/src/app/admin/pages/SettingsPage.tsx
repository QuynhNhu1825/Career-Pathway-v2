import { useState } from "react";
import {
  Settings,
  Key,
  Storage,
  Dns,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";

const orange = "#f59e0b";
const orangeDark = "#d97706";
const orangeLight = "#fef3c7";
const borderColor = "#e5e7eb";
const textMain = "#111827";
const textMuted = "#6b7280";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("scoring");

  const [scoreSettings, setScoreSettings] = useState({
    personalityWeight: 40,
    skillWeight: 35,
    interestWeight: 25,
  });

  const [thresholdSettings, setThresholdSettings] = useState({
    minScore: 1,
    recommendThreshold: 3,
    excellentThreshold: 5,
  });

  const [tokenSettings, setTokenSettings] = useState({
    dailyLimit: 10000,
    perUserLimit: 100,
    autoRefresh: true,
  });

  const [apiRouters, setApiRouters] = useState([
    {
      id: "auth_api",
      name: "API Xác thực (Auth)",
      endpoint: "/api/v1/auth/*",
      isMaintenance: false,
    },
    {
      id: "user_api",
      name: "API Người dùng (Users)",
      endpoint: "/api/v1/users/*",
      isMaintenance: false,
    },
    {
      id: "data_api",
      name: "API Dữ liệu (Market Data)",
      endpoint: "/api/v1/data/*",
      isMaintenance: false,
    },
    {
      id: "payment_api",
      name: "API Thanh toán (Payments)",
      endpoint: "/api/v1/payments/*",
      isMaintenance: false,
    },
  ]);

  const totalWeight =
    scoreSettings.personalityWeight +
    scoreSettings.skillWeight +
    scoreSettings.interestWeight;

  const handleSaveSettings = (settingType: string) => {
    toast.success(`Đã lưu cấu hình ${settingType}`);
  };

  const handleToggleMaintenance = (id: string, checked: boolean) => {
    setApiRouters((prev) =>
      prev.map((router) =>
        router.id === id ? { ...router, isMaintenance: checked } : router
      )
    );

    const router = apiRouters.find((r) => r.id === id);

    if (checked) {
      toast.warning(
        `Đã BẬT bảo trì cho ${router?.name}. Gateway sẽ chặn request và trả về lỗi 503.`
      );
    } else {
      toast.success(`Đã TẮT bảo trì cho ${router?.name}. API hoạt động bình thường.`);
    }
  };

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
          Cấu hình & Bảo trì
        </Typography>

        <Typography sx={{ color: textMuted, mt: 0.5, fontSize: 15 }}>
          Quản lý cài đặt hệ thống và các thông số kỹ thuật
        </Typography>
      </Box>

      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              "& .MuiTabs-indicator": { bgcolor: orange },
              "& .MuiTab-root": {
                minHeight: 40,
                textTransform: "none",
                fontWeight: 700,
                color: textMuted,
              },
              "& .Mui-selected": {
                color: `${orange} !important`,
              },
            }}
          >
            <Tab icon={<Settings sx={{ fontSize: 18 }} />} iconPosition="start" value="scoring" label="Tỷ lệ tính điểm" />
            <Tab icon={<Storage sx={{ fontSize: 18 }} />} iconPosition="start" value="threshold" label="Ngưỡng điểm" />
            <Tab icon={<Key sx={{ fontSize: 18 }} />} iconPosition="start" value="token" label="Quản trị Token" />
            <Tab icon={<Dns sx={{ fontSize: 18 }} />} iconPosition="start" value="maintenance" label="Bảo trì API" />
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === "scoring" && (
        <Card elevation={0} sx={{ ...cardSx, mb: 0 }}>
          <CardContent sx={{ p: 2.5 }}>
            <SectionHeader
              title="Thiết lập tỷ lệ tính điểm"
              desc="Điều chỉnh trọng số cho các yếu tố tính điểm"
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <ScoreSlider
                label="Sở thích"
                value={scoreSettings.personalityWeight}
                onChange={(value) =>
                  setScoreSettings({ ...scoreSettings, personalityWeight: value })
                }
              />

              <ScoreSlider
                label="Hành vi"
                value={scoreSettings.skillWeight}
                onChange={(value) =>
                  setScoreSettings({ ...scoreSettings, skillWeight: value })
                }
              />

              <ScoreSlider
                label="Kỹ năng"
                value={scoreSettings.interestWeight}
                onChange={(value) =>
                  setScoreSettings({ ...scoreSettings, interestWeight: value })
                }
              />

              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f9fafb",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "14px",
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: textMain }}>
                  Tổng trọng số:
                </Typography>

                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: totalWeight === 100 ? orange : "#dc2626",
                    lineHeight: 1.2,
                  }}
                >
                  {totalWeight}%
                </Typography>

                {totalWeight !== 100 && (
                  <Typography sx={{ fontSize: 13, color: "#dc2626", mt: 0.5 }}>
                    Tổng trọng số phải bằng 100%
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<Save />}
                disabled={totalWeight !== 100}
                onClick={() => handleSaveSettings("Tỷ lệ tính điểm")}
                sx={primaryButtonSx}
              >
                Lưu cấu hình
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === "threshold" && (
        <Card elevation={0} sx={{ ...cardSx, mb: 0 }}>
          <CardContent sx={{ p: 2.5 }}>
            <SectionHeader
              title="Cấu hình ngưỡng điểm"
              desc="Thiết lập các mức ngưỡng điểm đánh giá"
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
              <SettingInput
                label="Điểm tối thiểu"
                desc="Điểm tối thiểu để được xem xét"
                value={thresholdSettings.minScore}
                onChange={(value) =>
                  setThresholdSettings({ ...thresholdSettings, minScore: value })
                }
              />

              <SettingInput
                label="Ngưỡng khuyến nghị"
                desc="Điểm tối thiểu để được khuyến nghị"
                value={thresholdSettings.recommendThreshold}
                onChange={(value) =>
                  setThresholdSettings({
                    ...thresholdSettings,
                    recommendThreshold: value,
                  })
                }
              />

              <SettingInput
                label="Ngưỡng xuất sắc"
                desc="Điểm tối thiểu để được đánh giá xuất sắc"
                value={thresholdSettings.excellentThreshold}
                onChange={(value) =>
                  setThresholdSettings({
                    ...thresholdSettings,
                    excellentThreshold: value,
                  })
                }
              />

              <Box sx={infoBoxSx}>
                {[
                  [`0-${thresholdSettings.minScore}:`, "Không phù hợp"],
                  [
                    `${thresholdSettings.minScore}-${thresholdSettings.recommendThreshold}:`,
                    "Cân nhắc",
                  ],
                  [
                    `${thresholdSettings.recommendThreshold}-${thresholdSettings.excellentThreshold}:`,
                    "Khuyến nghị",
                  ],
                  [`${thresholdSettings.excellentThreshold}:`, "Xuất sắc"],
                ].map(([range, label]) => (
                  <Box
                    key={range}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 14, color: textMuted }}>
                      {range}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSaveSettings("Ngưỡng điểm")}
                sx={primaryButtonSx}
              >
                Lưu cấu hình
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === "token" && (
        <Card elevation={0} sx={{ ...cardSx, mb: 0 }}>
          <CardContent sx={{ p: 2.5 }}>
            <SectionHeader
              title="Quản trị Token & API"
              desc="Quản lý giới hạn token và cấu hình API"
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
              <SettingInput
                label="Giới hạn token test"
                desc="Tổng số token có thể sử dụng mỗi ngày"
                value={tokenSettings.dailyLimit}
                max={999999}
                onChange={(value) =>
                  setTokenSettings({ ...tokenSettings, dailyLimit: value })
                }
              />

              <SettingInput
                label="Giới hạn token Chatbox AI"
                desc="Số token tối đa mỗi người dùng có thể sử dụng"
                value={tokenSettings.perUserLimit}
                max={999999}
                onChange={(value) =>
                  setTokenSettings({ ...tokenSettings, perUserLimit: value })
                }
              />

              <Box
                sx={{
                  p: 2,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    Tự động làm mới token
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: textMuted }}>
                    Tự động reset quota token hàng ngày
                  </Typography>
                </Box>

                <Switch
                  checked={tokenSettings.autoRefresh}
                  onChange={(e) =>
                    setTokenSettings({
                      ...tokenSettings,
                      autoRefresh: e.target.checked,
                    })
                  }
                  sx={switchSx}
                />
              </Box>

              <Box sx={infoBoxSx}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1.5 }}>
                  Thống kê sử dụng
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ fontSize: 14, color: textMuted }}>
                    Đã sử dụng hôm nay:
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    3,247 / 10,000
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={32.47}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "#fff",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: orange,
                      borderRadius: 999,
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography sx={{ fontSize: 12, color: textMuted }}>
                    Còn lại: 6,753 tokens
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: textMuted }}>
                    32.47%
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.8 }}>
                  API Key
                </Typography>

                <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    value="sk-••••••••••••••••••••••••"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    sx={inputSx}
                  />
                  <Button variant="outlined" sx={cancelButtonSx}>
                    Làm mới
                  </Button>
                </Stack>

                <Typography sx={{ fontSize: 12, color: textMuted, mt: 0.6 }}>
                  API key để kết nối với các dịch vụ bên ngoài
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSaveSettings("Token & API")}
                sx={primaryButtonSx}
              >
                Lưu cấu hình
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === "maintenance" && (
        <Card elevation={0} sx={{ ...cardSx, mb: 0 }}>
          <CardContent sx={{ p: 2.5 }}>
            <SectionHeader
              title="Quản lý Bảo trì Router API"
              desc="Kiểm soát luồng truy cập. Khi bật bảo trì, Gateway sẽ chặn request và trả về lỗi 503 Service Unavailable."
            />

            <Box
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {apiRouters.map((router, index) => (
                <Box
                  key={router.id}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    flexDirection: { xs: "column", md: "row" },
                    borderBottom:
                      index !== apiRouters.length - 1
                        ? `1px solid ${borderColor}`
                        : "none",
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                        {router.name}
                      </Typography>

                      <Chip
                        label={router.isMaintenance ? "Đang bảo trì" : "Hoạt động"}
                        size="small"
                        sx={{
                          bgcolor: router.isMaintenance ? "#fee2e2" : "#dcfce7",
                          color: router.isMaintenance ? "#b91c1c" : "#15803d",
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontFamily: "monospace",
                        color: textMuted,
                        bgcolor: "#f9fafb",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      {router.endpoint}
                    </Typography>

                    {router.isMaintenance && (
                      <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 1 }}>
                        * Request từ Client tới endpoint này đang bị Gateway chặn (503).
                      </Typography>
                    )}
                  </Box>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography sx={{ fontSize: 13, color: textMuted }}>
                      Chế độ bảo trì
                    </Typography>

                    <Switch
                      checked={router.isMaintenance}
                      onChange={(e) =>
                        handleToggleMaintenance(router.id, e.target.checked)
                      }
                      sx={switchSx}
                    />
                  </Stack>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: textMain }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 14, color: textMuted, mt: 0.5 }}>
        {desc}
      </Typography>
    </Box>
  );
}

function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Box sx={{ mb: 0}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: textMain,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            color: textMuted,
          }}
        >
          {value}%
        </Typography>
      </Box>

      <Slider
        value={value}
        min={0}
        max={100}
        step={5}
        onChange={(_, newValue) => onChange(newValue as number)}
        sx={{
          color: orange,
          height: 8,

          "& .MuiSlider-track": {
            border: "none",
            borderRadius: 999,
          },

          "& .MuiSlider-rail": {
            bgcolor: "#eeeeee",
            opacity: 1,
            borderRadius: 999,
          },

          "& .MuiSlider-thumb": {
            width: 18,
            height: 18,
            bgcolor: "#fff",
            border: `2px solid ${orange}`,

            "&:hover": {
              boxShadow: "0 0 0 8px rgba(245,158,11,.15)",
            },

            "&.Mui-focusVisible": {
              boxShadow: "0 0 0 8px rgba(245,158,11,.15)",
            },

            "&:before": {
              display: "none",
            },
          },
        }}
      />
    </Box>
  );
}

function SettingInput({
  label,
  desc,
  value,
  onChange,
  max = 5,
}: {
  label: string;
  desc: string;
  value: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.8 }}>
        {label}
      </Typography>

      <TextField
        fullWidth
        size="small"
        type="number"
        value={value} 
        slotProps={{
          htmlInput: {
            min: 0,
            max,
          },
        }}
  onChange={(e) => onChange(Number(e.target.value))}
  sx={inputSx}
/>

      <Typography sx={{ fontSize: 12, color: textMuted, mt: 0.6 }}>
        {desc}
      </Typography>
    </Box>
  );
}

const cardSx = {
  border: `1px solid ${borderColor}`,
  borderRadius: "18px",
  bgcolor: "#fff",
  mb: 2.5,
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    bgcolor: "#fff",

    "& fieldset": {
      borderColor,
    },

    "&:hover fieldset": {
      borderColor: orange,
    },

    "&.Mui-focused fieldset": {
      borderColor: orange,
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    padding: "8px 12px",
    fontSize: 14,
  },
};

const infoBoxSx = {
  p: 2,
  bgcolor: "#f9fafb",
  border: `1px solid ${borderColor}`,
  borderRadius: "14px",
};

const primaryButtonSx = {
  width: "fit-content",
  bgcolor: orange,
  textTransform: "none",
  borderRadius: "10px",
  fontWeight: 700,
  boxShadow: "none",
  "&:hover": {
    bgcolor: orangeDark,
    boxShadow: "none",
  },
};

const cancelButtonSx = {
  textTransform: "none",
  borderRadius: "10px",
  fontWeight: 700,
  borderColor,
  color: textMain,
};

const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: orange,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: orange,
  },
};