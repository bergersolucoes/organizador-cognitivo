
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User Settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system',
  main_goal TEXT,
  assistant_tone TEXT DEFAULT 'balanced',
  assistant_mode TEXT DEFAULT 'exploratory',
  ai_provider TEXT DEFAULT 'lovable',
  ai_model TEXT DEFAULT 'google/gemini-3-flash-preview',
  use_auto_context BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  main_difficulty TEXT,
  focus_areas TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tags
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tags" ON public.tags FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_tags_user_id ON public.tags(user_id);

-- Journal Entries
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  entry_type TEXT DEFAULT 'reflexao_livre',
  context TEXT,
  description TEXT,
  primary_emotion TEXT,
  secondary_emotions TEXT[],
  emotional_intensity INTEGER CHECK (emotional_intensity >= 1 AND emotional_intensity <= 10),
  trigger_event TEXT,
  automatic_thought TEXT,
  interpretation TEXT,
  observable_fact TEXT,
  under_control TEXT,
  outside_control TEXT,
  initial_impulse TEXT,
  actual_response TEXT,
  ideal_response TEXT,
  virtue_tested TEXT,
  pattern_noticed TEXT,
  related_decision_id UUID,
  related_person TEXT,
  final_note TEXT,
  is_draft BOOLEAN DEFAULT false,
  is_quick BOOLEAN DEFAULT false,
  entry_date TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_journal_entries_user_date ON public.journal_entries(user_id, entry_date DESC);
CREATE INDEX idx_journal_entries_type ON public.journal_entries(user_id, entry_type);
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Journal Entry Tags
CREATE TABLE public.journal_entry_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(entry_id, tag_id)
);
ALTER TABLE public.journal_entry_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own entry tags" ON public.journal_entry_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.journal_entries WHERE id = entry_id AND user_id = auth.uid()));

-- Nightly Reviews
CREATE TABLE public.nightly_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  answers JSONB DEFAULT '{}',
  checklist JSONB DEFAULT '[]',
  free_text TEXT,
  day_rating INTEGER CHECK (day_rating >= 1 AND day_rating <= 10),
  final_mood TEXT,
  learning TEXT,
  tomorrow_commitment TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nightly_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reviews" ON public.nightly_reviews FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_nightly_reviews_user_date ON public.nightly_reviews(user_id, review_date DESC);
CREATE TRIGGER update_nightly_reviews_updated_at BEFORE UPDATE ON public.nightly_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Decisions
CREATE TYPE public.decision_status AS ENUM ('aberta', 'maturando', 'decidida', 'revisando', 'encerrada');

CREATE TABLE public.decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  context TEXT,
  core_problem TEXT,
  urgency TEXT,
  impact TEXT,
  deadline TIMESTAMPTZ,
  rational_scenario TEXT,
  impulsive_scenario TEXT,
  fear_involved TEXT,
  desire_involved TEXT,
  under_control TEXT,
  outside_control TEXT,
  worst_scenario TEXT,
  best_scenario TEXT,
  cost_of_action TEXT,
  cost_of_inaction TEXT,
  values_involved TEXT,
  virtues_involved TEXT,
  emotional_noise TEXT,
  provisional_verdict TEXT,
  final_decision TEXT,
  decision_date TIMESTAMPTZ,
  status public.decision_status DEFAULT 'aberta',
  notes TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own decisions" ON public.decisions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_decisions_user_status ON public.decisions(user_id, status);
CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON public.decisions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Decision Options
CREATE TABLE public.decision_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_id UUID REFERENCES public.decisions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.decision_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own decision options" ON public.decision_options FOR ALL
  USING (EXISTS (SELECT 1 FROM public.decisions WHERE id = decision_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.decisions WHERE id = decision_id AND user_id = auth.uid()));

-- Control Exercises
CREATE TABLE public.control_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  situation TEXT NOT NULL,
  facts TEXT,
  assumptions TEXT,
  fears TEXT,
  expectations TEXT,
  possible_actions TEXT,
  under_control TEXT,
  outside_control TEXT,
  acceptance_needed TEXT,
  practical_action TEXT,
  rational_conclusion TEXT,
  related_journal_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  related_decision_id UUID REFERENCES public.decisions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.control_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own exercises" ON public.control_exercises FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_control_exercises_updated_at BEFORE UPDATE ON public.control_exercises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Triggers (emotional)
CREATE TABLE public.triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trigger_description TEXT NOT NULL,
  context TEXT,
  emotion TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  impulse TEXT,
  actual_reaction TEXT,
  ideal_reaction TEXT,
  is_recurring BOOLEAN DEFAULT false,
  frequency TEXT,
  associated_person TEXT,
  time_period TEXT,
  observation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.triggers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own triggers" ON public.triggers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_triggers_user ON public.triggers(user_id, created_at DESC);
CREATE TRIGGER update_triggers_updated_at BEFORE UPDATE ON public.triggers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Virtues Log
CREATE TABLE public.virtues_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  virtue TEXT NOT NULL,
  situation TEXT,
  actual_response TEXT,
  ideal_response TEXT,
  learning TEXT,
  progress_rating INTEGER CHECK (progress_rating >= 1 AND progress_rating <= 10),
  log_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.virtues_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own virtues log" ON public.virtues_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_virtues_log_user ON public.virtues_log(user_id, log_date DESC);

-- Relationship Reflections
CREATE TABLE public.relationship_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  person_or_context TEXT NOT NULL,
  bond_type TEXT,
  problem TEXT,
  observed_fact TEXT,
  interpretation TEXT,
  my_expectation TEXT,
  their_expectation TEXT,
  emotion TEXT,
  under_control TEXT,
  outside_control TEXT,
  dignified_conduct TEXT,
  ideal_communication TEXT,
  needs_distance BOOLEAN DEFAULT false,
  needs_conversation BOOLEAN DEFAULT false,
  needs_acceptance BOOLEAN DEFAULT false,
  learning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.relationship_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reflections" ON public.relationship_reflections FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_relationship_reflections_updated_at BEFORE UPDATE ON public.relationship_reflections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mood Logs
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT,
  clarity_level INTEGER CHECK (clarity_level >= 1 AND clarity_level <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  note TEXT,
  weighing_today TEXT,
  under_control_today TEXT,
  next_lucid_action TEXT,
  log_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own mood logs" ON public.mood_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_mood_logs_user_date ON public.mood_logs(user_id, log_date DESC);

-- Chat Conversations
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Nova conversa',
  mode TEXT DEFAULT 'reflexao_livre',
  use_context BOOLEAN DEFAULT true,
  direct_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON public.chat_conversations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id, updated_at DESC);
CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Chat Messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON public.chat_messages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid()));
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id, created_at ASC);
