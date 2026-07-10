import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { QuickCareerAdvisor } from "./components/QuickCareerAdvisor";
import { Stats } from "./components/Stats";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { PersonalInfo } from "./screens/PersonalInfo";
import { Assessment } from "./screens/Assessment";
import { AuthGate } from "./screens/AuthGate";
import { Results } from "./screens/Results";
import { Dashboard } from "./screens/Dashboard";
import { CareerRecommendation } from "./screens/CareerRecommendation";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import UserGuide from "./screens/UserGuide";
import AboutSystem from "./screens/AboutSystem";

// Khai báo biến API_URL dự phòng nếu chưa định nghĩa trong cấu hình dự án
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type Screen =
  | "home"
  | "mode-selection"
  | "personal-info"
  | "assessment"
  | "auth-gate"
  | "results"
  | "dashboard"
  | "career-recommendation"
  | "privacy-policy"
  | "user-guide"
  | "about-system";

export type AssessmentMode = "targeted" | "discovery";

export interface UserData {
  name: string;
  age: number;
  education: string;
  location: string;
  hobby: string;
  desiredCareer?: string;
  subjectScores?: { [key: string]: number };
  gpa?: number;
  status: 'student' | 'working';
  studentScores?: {
    Toan: number;
    Van: number;
    Anh: number;
    Ly: number;
    Hoa: number;
    Sinh: number;
    Su: number;
    Dia: number;
    GDCD: number;
  };
  workerScores?: {
    gpa: number;
  };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  profile?: any;
}

type EvaluationResult = any;
export type Answers = Record<number, string>;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<AssessmentMode>("targeted");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [claimedEvaluation, setClaimedEvaluation] = useState<EvaluationResult | null>(null);
  const [recommendedCareer, setRecommendedCareer] = useState<string | null>(null);

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const career = mode === "targeted" ? userData?.desiredCareer ?? "" : recommendedCareer ?? "";

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-white">
        <Navigation
          onStartAssessment={() => navigate("personal-info")}
          isLoggedIn={!!authUser}
          onDashboard={() => navigate("dashboard")}
          onDirectLogin={(user) => { 
            setAuthUser(user); 
            localStorage.setItem("user", JSON.stringify(user));
            navigate("dashboard"); 
          }}
        />
        <Hero onStart={() => navigate("personal-info")} />
        <Services />
        <QuickCareerAdvisor />
        <Stats />
        <CTA onStart={() => navigate("personal-info")} />
        <Footer
          onPrivacy={() => navigate("privacy-policy")}
          onGuide={() => navigate("user-guide")}
          onAbout={() => navigate("about-system")}
        />
      </div>
    );
  }

  if (screen === "personal-info") {
    return (
      <PersonalInfo
        authUser={authUser} // Pass authUser to PersonalInfo
        onSubmit={(data, determinedMode) => {
          setUserData(data);
          setMode(determinedMode);
          navigate("assessment");

          const profileUpdatePayload: any = {
            fullName: data.name,
            age: data.age,
            educationLevel: data.education,
            location: data.location,
            interests: data.hobby,
            studyStatus: data.status,
          };

          if (data.studentScores) {
            profileUpdatePayload.studentScores = data.studentScores;
          }
          if (data.workerScores) {
            profileUpdatePayload.workerScores = data.workerScores;
          }

          if (authUser) {
            fetch(`${API_URL}/api/profile/${authUser.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profileUpdatePayload),
            })
              .then(res => res.json())
              .then(result => {
                if (!result.success) {
                  console.error("Failed to save profile data:", result.message);
                }
              })
              .catch(err => console.error("Error saving profile data:", err));
          }
        }}
        onBack={() => navigate("home")}
      />
    );
  }

  if (screen === "assessment") {
    return (
      <Assessment
        type={mode}
        career={career}
        authUser={authUser}
        userData={userData}
        onComplete={(completedSessionId, result) => {
          setSessionId(completedSessionId);

          if (result && result.requiresLogin === false && result.evaluation) {
            setClaimedEvaluation(result.evaluation);
            if (mode === 'discovery') {
              navigate("career-recommendation");
            } else {
              navigate("results");
            }
            return;
          }

          if (authUser) {
            setClaimedEvaluation(null);
            if (mode === 'discovery') {
              navigate("career-recommendation");
            } else {
              navigate("results");
            }
            return;
          }

          setClaimedEvaluation(null);
          navigate("auth-gate");
        }}
        onBack={() => navigate("personal-info")}
      />
    );
  }

  if (screen === "auth-gate") {
    return (
      <AuthGate
        onLogin={(user) => {
          setAuthUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          if (mode === 'discovery') {
            navigate("career-recommendation");
          } else {
            navigate("results");
          }
        }}
        onBack={() => navigate("assessment")}
      />
    );
  }

  if (screen === "results") {
    if (!authUser || !sessionId) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.50",
            p: 2,
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            Dữ liệu phiên làm việc không tồn tại hoặc bạn chưa đăng nhập.
          </Typography>
          <Button variant="contained" onClick={() => navigate("home")}>
            Quay về trang chủ
          </Button>
        </Box>
      );
    }
    return (
      <Results
        authUser={authUser}
        sessionId={sessionId}
        onDashboard={() => navigate("dashboard")}
        onHome={() => navigate("home")}
      />
    );
  }

  if (screen === "career-recommendation") {
    if (!authUser || !sessionId) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.50",
            p: 2,
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            Dữ liệu phiên làm việc không tồn tại hoặc bạn chưa đăng nhập.
          </Typography>
          <Button variant="contained" onClick={() => navigate("home")}>
            Quay về trang chủ
          </Button>
        </Box>
      );
    }
    return (
      <CareerRecommendation
        authUser={authUser}
        sessionId={sessionId}
        initialEvaluation={claimedEvaluation}
        onContinue={(selectedCareer) => {
          setMode("targeted");
          setUserData(prev => ({ ...prev!, desiredCareer: selectedCareer }));
          navigate("assessment");
        }}
        onHome={() => navigate("home")}
      />
    );
  }

  if (screen === "dashboard") {
    if (!authUser) {
      navigate("home");
      return null;
    }
    return (
      <Dashboard
        authUser={authUser}
        career={career}
        careerAnswers={{}}
        onLogout={() => {
          setAuthUser(null);
          localStorage.removeItem("user");
          navigate("home");
        }}
        onHome={() => navigate("home")}
      />
    );
  }

  if (screen === "privacy-policy") {
    return <PrivacyPolicy onBack={() => navigate("home")} />;
  }

  if (screen === "user-guide") {
    return <UserGuide onBack={() => navigate("home")} />;
  }

  if (screen === "about-system") {
    return <AboutSystem onBack={() => navigate("home")} />;
  }

  return null;
}