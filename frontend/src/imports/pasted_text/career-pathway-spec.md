ĐẶC TẢ HỆ THỐNG TƯ VẤN HƯỚNG NGHIỆP "CAREER PATHWAY"
1. Mục tiêu và Đối tượng
Mục tiêu: Xây dựng một Hệ thống chuyên gia (Expert System) sử dụng Trí tuệ Nhân tạo (AI) để đánh giá khoa học sự tương thích giữa cá nhân và nghề nghiệp, nhằm loại bỏ hoàn toàn việc chọn ngành theo cảm tính. Hệ thống cung cấp lộ trình phát triển rõ ràng dựa trên dữ liệu định lượng và kết hợp các cơ chế giới hạn tương tác AI để tối ưu hóa nguồn lực.
Đối tượng sử dụng:
•	Người dùng (User): Học sinh cuối cấp THPT, sinh viên năm nhất hoặc những cá nhân đang cần định hướng lại nghề nghiệp.
•	Quản trị viên (Admin): Người quản lý hệ thống, quản lý dữ liệu gốc, cấu hình thuật toán và theo dõi giám sát toàn bộ nền tảng.
2. Quy trình Khởi tạo và Hệ thống Ràng buộc AI
2.1. Khởi tạo lộ trình và khảo sát động (AI-Driven)
Hệ thống không sử dụng bộ câu hỏi tĩnh. Thay vào đó, AI sẽ tự động tạo nội dung khảo sát( 15 câu hỏi) dựa trên một trong hai chế độ lựa chọn của người dùng:
•	Chế độ Targeted (Đã có ngành mục tiêu): Người dùng nhập tên một ngành cụ thể (ví dụ: "Thiết kế đồ họa"). AI sẽ đóng vai trò chuyên gia nhân sự, tự động tạo ra bộ câu hỏi trắc nghiệm tình huống tập trung sâu vào các tố chất, tư duy và kỹ năng đặc thù cần thiết cho ngành nghề đó.
•	Chế độ Discovery (Khám phá từ đầu): Dành cho người dùng chưa xác định được hướng đi. AI sẽ khởi tạo một bài đánh giá tổng quát dựa trên khung mã RIASEC. Mục tiêu là thu thập dữ liệu hành vi thô để hệ thống tự động đối chiếu (Mapping) với cơ sở dữ liệu nghề nghiệp O*NET và đưa ra các đề xuất phù hợp.
2.2. Hệ thống Quy tắc Ràng buộc (Constraint Rules)
Để đảm bảo tính khách quan và độ chính xác cao nhất, AI phải tuân thủ nghiêm ngặt 3 quy tắc logic cốt lõi khi khởi tạo câu hỏi:
1.	Khai thác đa tầng (Multi-layered Inquiry): Tuyệt đối không sử dụng các câu hỏi trực tiếp mang tính cảm tính. AI phải luân phiên đặt câu hỏi qua 3 trục đánh giá: Sở thích (Holland), Hành vi (Big Five) và Kỹ năng (SCCT).
2.	Đối chiếu chéo (Cross-Validation): Khi hệ thống nhận diện người dùng khẳng định một thiên hướng nào đó, AI bắt buộc phải kích hoạt các câu hỏi tình huống kiểm chứng (ví dụ: kiểm tra tính Tận tâm/kỷ luật) để xác thực và loại bỏ các "ảo tưởng sở thích".
3.	Định dạng kịch bản (Scenario-based): Yêu cầu người dùng giải quyết các tình huống giả định thay vì trả lời Đúng/Sai. Các phản hồi sẽ được thu thập thông qua thang đo Likert ngầm (5 mức độ) để hệ thống có thể định lượng hóa hành vi một cách chính xác.
3. Thuật toán Chấm điểm, Đánh giá và Yêu cầu Hệ thống
3.1. Thuật toán phân tích tương thích
Hệ thống áp dụng mô hình chấm điểm định lượng (Weight-based Scoring) với cấu trúc trọng số như sau:
•	Interest Fit (50%): Đánh giá mức độ khớp nối đam mê dựa trên mô hình Holland.
•	Behavioral Fit (30%): Phân tích khả năng chịu áp lực, tính tỉ mỉ và độ bền bỉ thông qua mô hình Big Five.
•	Efficacy Fit (20%): Đánh giá sự sẵn sàng về mặt kỹ năng hiện tại và tâm lý thực thi công việc (SCCT).
3.2. Yêu cầu Đăng nhập và Xử lý Kết quả
Sau khi hoàn thành bộ câu hỏi khảo sát động, hệ thống yêu cầu một bước xác thực bắt buộc:
•	Yêu cầu đăng nhập nhận kết quả: Mặc dù người dùng có thể làm bài khảo sát dưới dạng ẩn danh ban đầu, để nhận được báo cáo kết quả đánh giá chi tiết, người dùng bắt buộc phải đăng nhập hoặc tạo tài khoản. Yêu cầu này giúp bảo mật thông tin, lưu trữ lịch sử cấu hình, và cấp phát Token cho tính năng Chatbox.
Sau khi đăng nhập thành công, hệ thống xử lý điểm số theo ngưỡng cấu hình (ví dụ ngưỡng Pass là > 3.0):
•	Điểm > 3 (Phù hợp): Hệ thống trả về kết quả chúc mừng. Cung cấp biểu đồ đa chiều (Radar cho RIASEC, Bar cho Big Five và SCCT), hiển thị danh sách các ngành phù hợp, lộ trình nghề nghiệp, lộ trình phát triển kỹ năng (Roadmap), các chứng chỉ cần thiết, và dữ liệu thị trường thực tế.
•	Điểm ≤ 3 (Không phù hợp): Hệ thống kích hoạt cơ chế Deep Scan. AI sẽ cung cấp các giải thích chi tiết, phản biện logic về lý do tại sao ngành công việc này không phù hợp. Cơ chế Pivot Logic sẽ được gọi để tự động gợi ý các ngành nghề thay thế có đặc tính tương đồng khả thi hơn.
3.3. Đánh giá Mức độ Hài lòng (Feedback Loop)
Nhằm cải thiện độ chính xác của mô hình AI, tại trang kết quả, hệ thống tích hợp chức năng thu thập phản hồi:
•	Người dùng được yêu cầu đánh giá mức độ hài lòng đối với điểm số đánh giá và các nhận định giải thích của AI (thông qua hệ thống rating sao hoặc nút Hài lòng/Không hài lòng).
•	Dữ liệu đánh giá từ chức năng này sẽ được quản trị viên thu thập để phục vụ quá trình Fine-tuning (tinh chỉnh) thuật toán.
4. Chi tiết Các Phân hệ Chức năng
4.1. Phân hệ Người dùng (Học sinh / Sinh viên)
•	Quản lý tài khoản: Đăng ký, đăng nhập, đăng xuất và quản lý hồ sơ cá nhân. Đăng nhập là điều kiện kiên quyết để xem báo cáo định hướng.
•	Quản lý Lịch sử & Kế hoạch:
o	Lưu trữ, xem lại và so sánh lịch sử các lần thực hiện khảo sát.
o	Theo dõi lộ trình nghề nghiệp và lộ trình kỹ năng (Roadmap).
o	So sánh các ngành nghề và tra cứu thông tin thị trường (chứng chỉ, lương, cơ hội).
o	Xuất báo cáo định hướng cá nhân dưới định dạng PDF.
•	Chatbox Tư Vấn Khám Phá Chuyên Sâu:
o	Hệ thống tích hợp một Chatbox AI cho phép người dùng đặt các câu hỏi chuyên sâu về ngành nghề, yêu cầu giải thích chi tiết về các đề xuất, hoặc xin gợi ý cải thiện kỹ năng.
o	Giới hạn Token (Token Limit): Mỗi tài khoản đăng nhập thành công sẽ được cấp phát tối đa 3 Token.
o	Giới hạn số lượng câu hỏi: Tại Chatbox, mỗi một câu hỏi hoặc yêu cầu tư vấn gửi đi sẽ tiêu tốn 1 Token. Hệ thống sẽ giới hạn chặt chẽ số lượng câu hỏi người dùng được đặt (tối đa 3 câu theo số Token hiện có). Việc này nhằm đảm bảo tính tập trung, tối ưu hóa chi phí vận hành AI, và định hướng người dùng đặt những câu hỏi thực sự có giá trị. Khi hết Token, người dùng không thể gửi thêm câu hỏi tư vấn mới.
4.2. Phân hệ Quản trị viên (Admin)
•	Cấu hình Trí tuệ nhân tạo (AI Orchestration):
o	Prompt Management: Thiết lập và quản lý các kịch bản mẫu cho AI, đảm bảo tuân thủ 3 quy tắc cốt lõi (Khai thác đa tầng, Đối chiếu chéo, Kịch bản tình huống).
o	Tuning: Điều chỉnh phương pháp AI thực hiện phản biện (Deep Scan) và cách thức chuyển hướng ngành nghề (Pivot Logic).
•	Quản lý Thuật toán & Trọng số: Thiết lập tỷ lệ tính điểm (Interest - Behavioral - Efficacy), cấu hình ngưỡng điểm phù hợp và quản trị thông số Token cấp phát.
•	Quản lý Dữ liệu gốc (Knowledge Base - CRUD):
o	Cập nhật danh mục nghề nghiệp chuẩn hóa theo hệ thống O*NET.
o	Quản lý và cập nhật ngân hàng câu hỏi gốc (sở thích, hành vi, kỹ năng).
o	Mapping: Thiết lập ma trận quan hệ giữa các nhóm tính cách, nhóm kỹ năng và các nghề nghiệp cụ thể.
o	Cập nhật dữ liệu thị trường (chứng chỉ, lương, cơ hội).
•	Giám sát & Thống kê (Dashboard):
o	Theo dõi tổng quan hệ thống, xu hướng ngành nghề được quan tâm nhiều nhất.
o	Thống kê hiệu suất mô hình AI, bao gồm báo cáo phản hồi mức độ hài lòng của người dùng đối với điểm đánh giá.
o	Báo cáo phân bổ nhóm tính cách phổ biến, số lượt thực hiện test, và tỷ lệ hoàn thành test.
•	Quản trị Hệ thống: Quản lý tài khoản, phân quyền người dùng, kiểm soát nhật ký hệ thống (Logs), và bảo trì kết nối API.
5. Kiến trúc và Thành phần Công nghệ (Stack)
Hệ thống được xây dựng trên nền tảng kiến trúc hiện đại, phân tách rõ ràng giữa các lớp dịch vụ:
Thành phần	Công nghệ	Vai trò & Chức năng

Giao diện (Frontend)	Flutter	Đảm nhiệm hiển thị đa nền tảng, render kịch bản tình huống, nhận input từ người dùng, quản lý giới hạn Token trên giao diện Chatbox và vẽ các biểu đồ phân tích đa chiều.
Giao diện (Frontend)	ReactJS	Đảm nhiệm hiển thị đa nền tảng, render kịch bản tình huống, nhận input từ người dùng, quản lý giới hạn Token trên giao diện Chatbox và vẽ các biểu đồ phân tích đa chiều.
Trí tuệ (AI Engine)	Gemini	Đóng vai trò "bộ não" chuyên gia: sinh câu hỏi động, phân tích câu trả lời, chấm điểm, giải thích Deep Scan và phản hồi tư vấn qua Chatbox.
Hậu phương (Backend)	Node.js	Xử lý logic nghiệp vụ, chặn yêu cầu xem kết quả nếu chưa đăng nhập, quản lý trừ Token khi hỏi Chatbox và là cầu nối giao tiếp với các APIs AI.
Cơ sở dữ liệu	MySQL	Lưu trữ thông tin người dùng, lịch sử đánh giá, kho dữ liệu mã RIASEC, lưu trữ đánh giá hài lòng của người dùng và trạng thái Token hiện tại.

