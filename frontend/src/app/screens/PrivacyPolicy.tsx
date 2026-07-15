import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";
import ContactMailIcon from "@mui/icons-material/ContactMail";

interface PrivacyPolicyProps {
  onBack: () => void;
}

const collectedInfo = [
  "Họ và tên, email đăng nhập và thông tin tài khoản.",
  "Độ tuổi, trình độ học vấn, tình trạng học tập và khu vực học tập.",
  "Sở thích, kỹ năng, mục tiêu học tập hoặc nghề nghiệp mong muốn.",
  "Điểm các môn học, GPA hoặc thông tin học lực do người dùng cung cấp.",
  "Câu trả lời trong bài đánh giá hướng nghiệp.",
  "Kết quả phân tích, lịch sử làm bài và lịch sử tư vấn với Chatbot AI.",
];

const usagePurposes = [
  "Phân tích năng lực học tập và xu hướng nghề nghiệp.",
  "Đề xuất ngành học, nghề nghiệp, trường học hoặc lộ trình phù hợp.",
  "Cá nhân hóa nội dung tư vấn dựa trên thông tin của từng người dùng.",
  "Hiển thị lại lịch sử đánh giá để người dùng theo dõi quá trình phát triển.",
  "Cải thiện chất lượng chức năng, giao diện và trải nghiệm sử dụng hệ thống.",
];

const securityMethods = [
  "Xác thực tài khoản trước khi truy cập các chức năng cá nhân.",
  "Phân quyền giữa người dùng và quản trị viên.",
  "Giới hạn quyền truy cập vào dữ liệu nhạy cảm.",
  "Quản lý phiên đăng nhập nhằm hạn chế truy cập trái phép.",
  "Lưu trữ dữ liệu trong cơ sở dữ liệu của hệ thống phục vụ mục đích hướng nghiệp.",
];

const userRights = [
  "Xem lại thông tin cá nhân và kết quả đánh giá.",
  "Cập nhật hoặc chỉnh sửa thông tin cá nhân khi cần thiết.",
  "Đăng xuất khỏi hệ thống bất kỳ lúc nào.",
  "Yêu cầu xóa hoặc điều chỉnh dữ liệu nếu không còn nhu cầu sử dụng.",
  "Được thông báo về mục đích sử dụng dữ liệu trong phạm vi hệ thống.",
];

const userResponsibilities = [
  "Cung cấp thông tin trung thực để kết quả tư vấn có độ chính xác cao hơn.",
  "Không chia sẻ tài khoản, mật khẩu hoặc mã xác thực cho người khác.",
  "Không sử dụng hệ thống để nhập dữ liệu sai lệch, gây ảnh hưởng đến kết quả phân tích.",
  "Không khai thác, sao chép hoặc tấn công hệ thống dưới bất kỳ hình thức nào.",
];

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          bgcolor: "warning.light",
          color: "warning.dark",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
    </Stack>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <List disablePadding sx={{ mb: 3 }}>
      {items.map((item) => (
        <ListItem key={item} disablePadding sx={{ mb: 1 }}>
          <ListItemIcon sx={{ minWidth: 34 }}>
            <CheckCircleIcon color="warning" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={item}
            primaryTypographyProps={{
              component: "p",
              sx: { color: "text.primary", lineHeight: 1.7 },
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: "warning.light",
                  color: "warning.dark",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SecurityIcon sx={{ fontSize: 40 }} />
              </Box>

              <Box>
                <Typography variant="h3" fontWeight={800}>
                  Chính sách bảo mật
                </Typography>
                <Typography component="p" color="text.secondary" sx={{ mt: 1 }}>
                  Career Pathway cam kết bảo vệ dữ liệu cá nhân và sử dụng thông
                  tin người dùng đúng mục đích hướng nghiệp.
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent>
                  <PrivacyTipIcon color="warning" sx={{ fontSize: 36, mb: 1 }} />
                  <Typography variant="h6" fontWeight={700}>
                    Minh bạch dữ liệu
                  </Typography>
                  <Typography component="p" color="text.secondary" sx={{ mt: 1 }}>
                    Người dùng được thông tin rõ về dữ liệu được thu thập và mục
                    đích sử dụng trong hệ thống.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent>
                  <LockIcon color="warning" sx={{ fontSize: 36, mb: 1 }} />
                  <Typography variant="h6" fontWeight={700}>
                    Bảo vệ thông tin
                  </Typography>
                  <Typography component="p" color="text.secondary" sx={{ mt: 1 }}>
                    Dữ liệu cá nhân được quản lý trong phạm vi hệ thống và không
                    công khai cho bên thứ ba.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent>
                  <VerifiedUserIcon color="warning" sx={{ fontSize: 36, mb: 1 }} />
                  <Typography variant="h6" fontWeight={700}>
                    Quyền người dùng
                  </Typography>
                  <Typography component="p" color="text.secondary" sx={{ mt: 1 }}>
                    Người dùng có quyền xem, cập nhật hoặc yêu cầu điều chỉnh dữ
                    liệu cá nhân khi cần.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
            {[
              "Bảo mật thông tin",
              "Dữ liệu cá nhân",
              "Tư vấn hướng nghiệp",
              "Gemini AI",
              "O*NET Database",
              "Career Pathway",
            ].map((item) => (
              <Chip key={item} label={item} color="warning" variant="outlined" />
            ))}
          </Stack>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<InfoIcon />} title="1. Giới thiệu" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Chính sách bảo mật này mô tả cách Career Pathway thu thập, sử dụng,
              lưu trữ và bảo vệ thông tin cá nhân của người dùng khi sử dụng hệ
              thống tư vấn hướng nghiệp thông minh.
            </Typography>
            <Typography component="p" sx={{ mb: 3, lineHeight: 1.8 }}>
              Khi truy cập và sử dụng hệ thống, người dùng được xem là đã đọc,
              hiểu và đồng ý với các nội dung được quy định trong chính sách này.
              Chính sách được xây dựng nhằm đảm bảo tính minh bạch, an toàn và phù
              hợp với mục tiêu của đồ án.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<PersonIcon />} title="2. Thông tin được thu thập" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Career Pathway chỉ thu thập những thông tin cần thiết để phục vụ quá
              trình đánh giá, phân tích và đề xuất định hướng nghề nghiệp.
            </Typography>
            <BulletList items={collectedInfo} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<StorageIcon />} title="3. Mục đích sử dụng thông tin" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Dữ liệu người dùng được sử dụng nhằm nâng cao chất lượng tư vấn và
              giúp hệ thống đưa ra kết quả phù hợp hơn với từng cá nhân.
            </Typography>
            <BulletList items={usagePurposes} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<LockIcon />} title="4. Phạm vi sử dụng thông tin" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Thông tin cá nhân chỉ được sử dụng trong phạm vi hệ thống Career
              Pathway. Dữ liệu được dùng để xử lý các chức năng như đánh giá hướng
              nghiệp, lưu lịch sử làm bài, hiển thị kết quả và hỗ trợ tư vấn AI.
            </Typography>
            <Typography component="p" sx={{ mb: 3, lineHeight: 1.8 }}>
              Hệ thống không mua bán, trao đổi hoặc chia sẻ thông tin cá nhân cho
              tổ chức, cá nhân bên ngoài khi chưa có sự đồng ý của người dùng, trừ
              trường hợp cần thực hiện theo yêu cầu hợp lệ của cơ quan có thẩm quyền.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<StorageIcon />} title="5. Thời gian lưu trữ dữ liệu" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Thông tin người dùng được lưu trữ trong cơ sở dữ liệu của hệ thống để
              phục vụ việc đăng nhập, quản lý tài khoản, xem lại kết quả và tiếp tục
              sử dụng các chức năng tư vấn.
            </Typography>
            <Typography component="p" sx={{ mb: 3, lineHeight: 1.8 }}>
              Dữ liệu có thể được lưu trong suốt thời gian tài khoản còn hoạt động.
              Khi người dùng không còn nhu cầu sử dụng, người dùng có thể yêu cầu
              cập nhật, điều chỉnh hoặc xóa dữ liệu theo chính sách của hệ thống.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<VerifiedUserIcon />} title="6. Biện pháp bảo mật" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Career Pathway áp dụng các biện pháp quản lý và kỹ thuật nhằm hạn chế
              rủi ro truy cập trái phép, mất mát hoặc sử dụng sai mục đích dữ liệu.
            </Typography>
            <BulletList items={securityMethods} />
            <Typography component="p" sx={{ mb: 3, lineHeight: 1.8 }}>
              Tuy nhiên, không có hệ thống nào có thể đảm bảo an toàn tuyệt đối.
              Người dùng cần chủ động bảo vệ tài khoản, không chia sẻ mật khẩu và
              đăng xuất khỏi thiết bị công cộng sau khi sử dụng.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<PrivacyTipIcon />} title="7. Quyền của người dùng" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Người dùng có quyền kiểm soát thông tin cá nhân của mình trong phạm vi
              chức năng mà hệ thống cung cấp.
            </Typography>
            <BulletList items={userRights} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<GavelIcon />} title="8. Trách nhiệm của người dùng" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Để đảm bảo hệ thống hoạt động ổn định và kết quả tư vấn có giá trị,
              người dùng cần tuân thủ các trách nhiệm sau:
            </Typography>
            <BulletList items={userResponsibilities} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<InfoIcon />} title="9. Dữ liệu phục vụ phân tích AI" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Career Pathway có sử dụng trí tuệ nhân tạo để hỗ trợ phân tích kết quả
              đánh giá và tạo nội dung tư vấn. Dữ liệu được đưa vào quá trình xử lý
              nhằm giúp AI hiểu rõ bối cảnh học tập, sở thích và mục tiêu của người
              dùng.
            </Typography>
            <Typography component="p" sx={{ mb: 3, lineHeight: 1.8 }}>
              Kết quả từ AI chỉ mang tính tham khảo. Người dùng nên kết hợp kết quả
              này với ý kiến từ giáo viên, phụ huynh, chuyên gia hướng nghiệp và
              điều kiện thực tế của bản thân trước khi đưa ra quyết định quan trọng.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<GavelIcon />} title="10. Cập nhật chính sách" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Chính sách bảo mật có thể được điều chỉnh khi hệ thống bổ sung chức
              năng mới hoặc thay đổi quy trình xử lý dữ liệu. Mọi thay đổi sẽ được
              cập nhật tại trang này.
            </Typography>
            <Typography component="p" sx={{ mb: 3, lineHeight: 1.8 }}>
              Người dùng nên đọc lại chính sách định kỳ để nắm rõ cách hệ thống sử
              dụng và bảo vệ thông tin cá nhân.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionTitle icon={<ContactMailIcon />} title="11. Thông tin liên hệ" />
            <Typography component="p" sx={{ mb: 2, lineHeight: 1.8 }}>
              Nếu có câu hỏi, góp ý hoặc yêu cầu liên quan đến dữ liệu cá nhân, người
              dùng có thể liên hệ nhóm phát triển Career Pathway.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "warning.light",
                borderColor: "warning.main",
              }}
            >
              <Typography component="p" fontWeight={700}>
                Email hỗ trợ: contact@careerpathway.vn
              </Typography>
              <Typography component="p" sx={{ mt: 1 }}>
                Đơn vị thực hiện: Nhóm phát triển hệ thống Career Pathway.
              </Typography>
            </Paper>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Cập nhật lần cuối: 2026
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Career Pathway © 2026 - Hệ thống tư vấn hướng nghiệp ứng dụng AI.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="warning"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Quay về trang chủ
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
