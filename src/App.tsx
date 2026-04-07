import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/app/Dashboard";
import JournalList from "./pages/app/journal/JournalList";
import JournalForm from "./pages/app/journal/JournalForm";
import JournalDetail from "./pages/app/journal/JournalDetail";
import NightlyReviewList from "./pages/app/reviews/NightlyReviewList";
import NightlyReviewForm from "./pages/app/reviews/NightlyReviewForm";
import DecisionsList, { DecisionForm } from "./pages/app/decisions/DecisionsPage";
import ControlList from "./pages/app/control/ControlList";
import ControlExercise from "./pages/app/control/ControlExercise";
import TriggersList, { TriggerForm } from "./pages/app/triggers/TriggersPage";
import VirtuesList, { VirtueForm } from "./pages/app/virtues/VirtuesPage";
import RelationshipsList, { RelationshipForm } from "./pages/app/relationships/RelationshipsPage";
import PatternsPage from "./pages/app/patterns/PatternsPage";
import AssistantPage from "./pages/app/assistant/AssistantPage";
import SettingsPage from "./pages/app/settings/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/entrar" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected App */}
              <Route path="/app" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
              <Route path="/app/diario" element={<ProtectedRoute><AppLayout><JournalList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/diario/novo" element={<ProtectedRoute><AppLayout><JournalForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/diario/rapido" element={<ProtectedRoute><AppLayout><JournalForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/diario/:id" element={<ProtectedRoute><AppLayout><JournalDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/app/revisao" element={<ProtectedRoute><AppLayout><NightlyReviewList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/revisao/nova" element={<ProtectedRoute><AppLayout><NightlyReviewForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/decisoes" element={<ProtectedRoute><AppLayout><DecisionsList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/decisoes/nova" element={<ProtectedRoute><AppLayout><DecisionForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/controle" element={<ProtectedRoute><AppLayout><ControlList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/controle/novo" element={<ProtectedRoute><AppLayout><ControlExercise /></AppLayout></ProtectedRoute>} />
              <Route path="/app/gatilhos" element={<ProtectedRoute><AppLayout><TriggersList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/gatilhos/novo" element={<ProtectedRoute><AppLayout><TriggerForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/virtudes" element={<ProtectedRoute><AppLayout><VirtuesList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/virtudes/novo" element={<ProtectedRoute><AppLayout><VirtueForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/relacoes" element={<ProtectedRoute><AppLayout><RelationshipsList /></AppLayout></ProtectedRoute>} />
              <Route path="/app/relacoes/novo" element={<ProtectedRoute><AppLayout><RelationshipForm /></AppLayout></ProtectedRoute>} />
              <Route path="/app/padroes" element={<ProtectedRoute><AppLayout><PatternsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/assistente" element={<ProtectedRoute><AppLayout><AssistantPage /></AppLayout></ProtectedRoute>} />
              <Route path="/app/configuracoes" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
