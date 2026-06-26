import { useState } from "react";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { HowItWorks } from "./components/HowItWorks";
import { Stats } from "./components/Stats";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { ModeSelection } from "./screens/ModeSelection";
import { PersonalInfo } from "./screens/PersonalInfo";
import { Assessment } from "./screens/Assessment";
import { CareerRecommendation } from "./screens/CareerRecommendation";
import { AuthGate } from "./screens/AuthGate";
import { Results } from "./screens/Results";
import { Dashboard } from "./screens/Dashboard";

export type Screen =
  | "home"
  | "mode-selection"
  | "personal-info"
  | "assessment-personality"
  | "career-recommendation"
  | "assessment-career"
  | "auth-gate"
  | "results"
  | "dashboard";

export type AssessmentMode = "targeted" | "discovery";

export interface UserData {
  name: string;
  age: number;
  education: string;
  currentStatus: string;
  location: string;
  skills: string;
  targetCareer?: string;
  hobbies: string;
}

export interface AuthUser {
  name: string;
  email: string;
}

export type Answers = Record<number, string>;

function computeCareer(answers: Answers): string {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((v) => {
    if (v in counts) counts[v]++;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const map: Record<string, string> = {
    A: "Kỹ sư phần mềm",
    B: "Thiết kế UX/UI",
    C: "Quản lý nhân sự",
    D: "Quản lý dự án",
  };
  return map[top] ?? "Kỹ sư phần mềm";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<AssessmentMode>("targeted");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personalityAnswers, setPersonalityAnswers] = useState<Answers>({});
  const [careerAnswers, setCareerAnswers] = useState<Answers>({});
  const [recommendedCareer, setRecommendedCareer] = useState("Kỹ sư phần mềm");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const career =
    mode === "discovery" ? recommendedCareer : userData?.targetCareer ?? "";

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-white">
        <Navigation
          onStartAssessment={() => navigate("mode-selection")}
          isLoggedIn={!!authUser}
          onDashboard={() => navigate("dashboard")}
          onDirectLogin={(user) => { setAuthUser(user); navigate("dashboard"); }}
        />
        <Hero onStart={() => navigate("mode-selection")} />
        <Services />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CTA onStart={() => navigate("mode-selection")} />
        <Footer />
      </div>
    );
  }

  if (screen === "mode-selection") {
    return (
      <ModeSelection
        onSelect={(m) => {
          setMode(m);
          navigate("personal-info");
        }}
        onBack={() => navigate("home")}
      />
    );
  }

  if (screen === "personal-info") {
    return (
      <PersonalInfo
        mode={mode}
        onSubmit={(data) => {
          setUserData(data);
          navigate(
            mode === "discovery"
              ? "assessment-personality"
              : "assessment-career"
          );
        }}
        onBack={() => navigate("mode-selection")}
      />
    );
  }

  if (screen === "assessment-personality") {
    return (
      <Assessment
        type="personality"
        career=""
        onComplete={(answers) => {
          setPersonalityAnswers(answers);
          setRecommendedCareer(computeCareer(answers));
          navigate("career-recommendation");
        }}
        onBack={() => navigate("personal-info")}
      />
    );
  }

  if (screen === "career-recommendation") {
    return (
      <CareerRecommendation
        career={recommendedCareer}
        onContinue={() => navigate("assessment-career")}
        onBack={() => navigate("home")}
       
      />
    );
  }

  if (screen === "assessment-career") {
    return (
      <Assessment
        type="career"
        career={career}
        onComplete={(answers) => {
          setCareerAnswers(answers);
          navigate("auth-gate");
        }}
        onBack={() =>
          navigate(
            mode === "discovery" ? "career-recommendation" : "personal-info"
          )
        }
      />
    );
  }

  if (screen === "auth-gate") {
    return (
      <AuthGate
        onLogin={(user) => {
          setAuthUser(user);
          navigate("results");
        }}
        onBack={() => navigate("assessment-career")}
      />
    );
  }

  if (screen === "results") {
    return (
      <Results
        mode={mode}
        userData={userData!}
        personalityAnswers={personalityAnswers}
        careerAnswers={careerAnswers}
        career={career}
        authUser={authUser!}
        onDashboard={() => navigate("dashboard")}
        onHome={() => navigate("home")}
      />
    );
  }

  if (screen === "dashboard") {
    return (
      <Dashboard
        authUser={authUser ?? { name: "Người dùng", email: "user@example.com" }}
        career={career || "Kỹ sư phần mềm"}
        careerAnswers={careerAnswers}
        onLogout={() => {
          setAuthUser(null);
          navigate("home");
        }}
        onHome={() => navigate("home")}
      />
    );
  }

  return null;
}
