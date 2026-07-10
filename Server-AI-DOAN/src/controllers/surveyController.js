const surveyService = require('../services/surveyService');
const { claimAssessmentResult } = require('../services/assessmentService');
const profileService = require('../services/profileService');

const initSurvey = async (req, res) => {
    try {
        const { 
            mode, 
            target_career, 
            age, 
            education, 
            location, 
            hobby,
            status,
            subject_scores,
            gpa,
            userId
        } = req.body;


        // Lưu điểm người dùng
        if (userId) {
            await profileService.updateProfile(userId, {
                fullName: req.body.name,
                age,
                educationLevel: education,
                location,
                hobby,
                studentScores: subject_scores,
                workerScores: {
                    gpa
                }
            });
        }


        const result = await surveyService.initSurvey(
            mode,
            target_career,
            { 
            age,
            education,
            location,
            hobby,
            status
            },
            {
            scores: subject_scores,
            gpa
            }
        );

        res.status(200).json({
            success:true,
            ...result
        });

    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const submitSurvey = async (req, res) => {
    try {
        const { sessionId, answers } = req.body;
        const userId = req.body.userId || req.headers['x-user-id'] || req.query.userId;

        // Validate
        if (!sessionId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin sessionId hoặc answers' });
        }

        const result = await surveyService.processSurveySubmit(sessionId, answers);

        // Tự động claim kết quả và cập nhật UserProfile nếu người dùng đã đăng nhập
        if (userId && result.requiresLogin) {
            const claimRes = await claimAssessmentResult(sessionId, userId);
            if (claimRes.success) {
                return res.status(200).json({
                    success: true,
                    requiresLogin: false,
                    sessionId,
                    evaluation: claimRes.evaluation,
                    profile: claimRes.profile
                });
            }
        }

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const feedbackSurvey = async (req, res) => {
    try {
        const { survey_id, rating_score, comment } = req.body;
        const userId = req.body.userId || req.headers['x-user-id'] || null;

        if (!survey_id || !rating_score) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin survey_id hoặc rating_score' });
        }

        await surveyService.saveFeedback(survey_id, rating_score, comment, userId);
        res.status(201).json({ success: true, message: 'Cảm ơn bạn đã gửi phản hồi!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    initSurvey,
    submitSurvey,
    feedbackSurvey
};
