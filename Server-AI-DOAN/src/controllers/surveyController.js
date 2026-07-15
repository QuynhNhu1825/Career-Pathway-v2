const surveyService = require('../services/surveyService');
const { claimAssessmentResult } = require('../services/assessmentService');
const { getSessionContext } = require('../services/sessionContextStore');
const profileService = require('../services/profileService'); 
const { Taikhoan: UserAccount } = require('../models'); // Đưa import model lên đầu trang

// Chức năng 1: Khởi tạo khảo sát động (AI-Driven)
const initSurvey = async (req, res) => {
    try {
        const { 
            mode, 
            target_career, 
            age, 
            education, 
            location, 
            hobby,
            fullName, 
            status,
            subject_scores,
            gpa,
            academicData,
            userId: bodyUserId // Đổi tên để tránh trùng lặp biến
        } = req.body;

        // 1. Validate input căn bản
        if (!mode || !['Targeted', 'Discovery'].includes(mode)) {
            return res.status(400).json({ success: false, message: 'mode phải là Targeted hoặc Discovery' });
        }
        if (mode === 'Targeted' && !target_career) {
            return res.status(400).json({ success: false, message: 'target_career là bắt buộc khi mode = Targeted' });
        }

        // Xác định userId từ header hoặc body
        const activeUserId = req.headers['x-user-id'] || bodyUserId;

        // 2. Kiểm tra giới hạn tokenTest TRƯỚC KHI xử lý khảo sát
        let userInstance = null;
        if (activeUserId) {
            userInstance = await UserAccount.findByPk(activeUserId);
            if (userInstance) {
                if (userInstance.tokenTest <= 0) {
                    return res.status(403).json({
                        success: false,
                        tokenLimit: true,
                        message: 'Hết lượt làm bài test. Vui lòng nâng cấp hoặc mua thêm lượt.'
                    });
                }
            }
        }

        // 3. Cập nhật thông tin profile người dùng nếu có userId
        if (activeUserId) {
            await profileService.updateProfile(activeUserId, { 
                fullName: fullName, 
                age,
                educationLevel: education,
                location,
                interests: hobby, 
                studentScores: subject_scores,
                workerScores: { gpa }
            });
        }

        // 4. Gọi dịch vụ khởi tạo khảo sát duy nhất một lần
        const result = await surveyService.initSurvey( 
            mode,
            target_career,
            { fullName, age, education, location, hobby, status }, 
            academicData || { scores: subject_scores, gpa }
        );

        // 5. Trừ token test thành công sau khi đã khởi tạo khảo sát thành công
        if (userInstance) {
            userInstance.tokenTest -= 1;
            await userInstance.save();
        }

        // 6. Trả kết quả về cho client
        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Chức năng 2: Xử lý chấm điểm và trả về kết quả sơ bộ
const submitSurvey = async (req, res) => {
    try {
        const { sessionId, answers } = req.body;

        if (!sessionId || !answers) {
            return res.status(400).json({ success: false, message: 'Thiếu sessionId hoặc answers' });
        }

        const result = await surveyService.processSurveySubmit(sessionId, answers);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Chức năng 4: Đánh giá mức độ hài lòng (Feedback Loop)
const feedbackSurvey = async (req, res) => {
    try {
        const { sessionId, ratingScore, comment, userId } = req.body;

        if (!sessionId || !ratingScore) {
            return res.status(400).json({ success: false, message: 'Thiếu sessionId hoặc ratingScore' });
        }

        // Lấy userId từ session context nếu không được cung cấp trực tiếp trong body
        let actualUserId = userId;
        if (!actualUserId) {
            const sessionCtx = getSessionContext(sessionId);
            if (sessionCtx && sessionCtx.userId) {
                actualUserId = sessionCtx.userId;
            }
        }

        const result = await surveyService.saveFeedback(sessionId, ratingScore, comment, actualUserId);
        return res.status(200).json({ success: true, message: 'Đã gửi phản hồi thành công', feedback: result });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Xuất bản (Export) các hàm ra ngoài để file Route có thể sử dụng
module.exports = {
    initSurvey,
    submitSurvey,
    feedbackSurvey
};