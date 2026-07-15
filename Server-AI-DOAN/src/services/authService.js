const bcrypt = require('bcrypt');
const { 
  Taikhoan: UserAccount, 
  NguoiDung: UserProfile,
  LichSuTest: SurveyModel // SỬA LỖI: Hãy thay đổi tên Model này đúng với tên Model Khảo sát/Bài test thực tế trong dự án của bạn (ví dụ: KhaoSat, Survey, hoặc AssessmentResult)
} = require('../models');
const { getSessionContext } = require('./sessionContextStore');

/**
 * Hàm kiểm tra đăng nhập bằng Email / Password
 */
const checkLogin = async (email, password, sessionId = null) => {
  try {
    const user = await UserAccount.findOne({ where: { email: email } });

    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại' };
    }

    if (!user.passwordHash) {
      return { success: false, message: 'Tài khoản không có mật khẩu, vui lòng liên hệ hỗ trợ' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: 'Mật khẩu không chính xác' };
    }
    
    if (user.isActive === false) {
      return { success: false, message: 'Tài khoản hiện đang bị khóa' };
    }

    // SỬA LỖI: Gộp 2 câu lệnh update làm 1 để tối ưu hiệu năng và tránh ghi đè dữ liệu tokenTest
    await UserAccount.update(
      { 
        tokenCount: 3,
        tokenTest: 3,
        lastLoginAt: new Date() 
      },
      { where: { id: user.id } }
    );

    // Xử lý liên kết dữ liệu cũ qua sessionId nếu có
    if (sessionId) {
      const { updateProfile, saveScores } = require('./profileService'); 
      const context = getSessionContext(sessionId);
      const userContext = context?.userContext;
      const academicData = context?.academicData;

      if (userContext) {
        await updateProfile(user.id, {
          fullName: userContext.fullName || user.fullName,
          age: userContext.age || null,
          educationLevel: userContext.education || null,
          location: userContext.location || null,
          interests: userContext.hobby || null,
        });
      }
      
      if (academicData) {
        await saveScores(user.id, academicData);
      }

      // SỬA LỖI QUAN TRỌNG: Cập nhật userId cho bản ghi bài khảo sát thực tế trong DB
      if (SurveyModel) {
        await SurveyModel.update(
          { userId: user.id },
          { where: { sessionId: sessionId } } 
        );
      }
    }

    // Tải thông tin profile mới nhất
    const profile = await UserProfile.findOne({
      where: { userId: user.id },
      attributes: ['fullName', 'educationLevel', 'interests', 'age', 'location'],
      include: ['StudentScores', 'WorkerScores'] 
    });

    let profileJson = null;
    if (profile) {
      profileJson = {
        fullName: profile.fullName,
        educationLevel: profile.educationLevel,
        interests: profile.interests,
        hobby: profile.interests,
        age: profile.age,
        location: profile.location,
        phone: user.phone, 
        avatarUrl: null, 
        careerFitResult: null,
        studentScores: profile.StudentScores || null,
        workerScores: profile.WorkerScores || null,
      };
    }

    return {
      success: true,
      message: 'Đăng nhập thành công',
      user: { id: user.id, email: user.email, role: user.role, isActive: user.isActive },
      profile: profileJson,
    };
  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    return { success: false, message: 'Lỗi hệ thống' };
  }
};

/**
 * Hàm đăng ký tài khoản mới bằng Email / Password
 */
const register = async (email, password, fullName, sessionId) => {
  try {
    const existingUser = await UserAccount.findOne({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Email này đã được sử dụng' };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await UserAccount.create({
      email,
      passwordHash,
      tokenCount: 3,  // Khởi tạo token mặc định cho tài khoản mới
      tokenTest: 3
    });

    const context = sessionId ? getSessionContext(sessionId) : null;
    const userContext = context?.userContext || {};

    const userProfile = await UserProfile.create({
      userId: newUser.id,
      fullName: fullName || userContext.fullName || '',
      age: userContext.age || null,
      educationLevel: userContext.education || null,
      location: userContext.location || null,
      interests: userContext.hobby || null,
    });

    if (context && context.academicData) {
      const { saveScores } = require('./profileService');
      await saveScores(newUser.id, context.academicData);
    }

    // SỬA LỖI QUAN TRỌNG: Cập nhật lại liên kết bảng Khảo sát về userId mới đăng ký
    if (sessionId && SurveyModel) {
      await SurveyModel.update(
        { userId: newUser.id },
        { where: { sessionId: sessionId } }
      );
    }

    const reloadedProfile = await UserProfile.findOne({
      where: { userId: newUser.id },
      attributes: ['fullName', 'educationLevel', 'interests', 'age', 'location'],
      include: ['StudentScores', 'WorkerScores'] 
    });

    return {
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      profile: reloadedProfile ? { 
        fullName: reloadedProfile.fullName,
        age: reloadedProfile.age,
        educationLevel: reloadedProfile.educationLevel,
        location: reloadedProfile.location,
        interests: reloadedProfile.interests,
        hobby: reloadedProfile.interests, 
        studentScores: reloadedProfile.StudentScores || null,
        workerScores: reloadedProfile.WorkerScores || null,
      } : null,
    };
  } catch (error) {
    console.error('Lỗi khi đăng ký tài khoản:', error);
    return { success: false, message: 'Lỗi hệ thống khi đăng ký' };
  }
};

module.exports = {
  checkLogin,
  register
};