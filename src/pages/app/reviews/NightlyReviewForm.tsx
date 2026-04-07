import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Moon, Save, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const reviewQuestions = [
  'O que fiz bem hoje?',
  'Onde fui guiado por impulso?',
  'Onde fui incoerente?',
  'Onde fui lúcido?',
  'O que me desorganizou?',
  'O que dependia de mim e eu negligenciei?',
  'O que não dependia de mim e mesmo assim tentei controlar?',
  'Onde pratiquei autocontrole?',
  'Onde falhei na fala, conduta ou reação?',
  'O que posso corrigir amanhã?',
  'O que aprendi hoje sobre mim?',
  'O que merece ser encerrado hoje?',
  'O que não levarei comigo para amanhã?',
];

const moods = ['Sereno', 'Calmo', 'Neutro', 'Inquieto', 'Agitado', 'Ansioso', 'Triste', 'Frustrado', 'Grato', 'Determinado'];

const NightlyReviewForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [freeText, setFreeText] = useState('');
  const [dayRating, setDayRating] = useState(5);
  const [finalMood, setFinalMood] = useState('');
  const [learning, setLearning] = useState('');
  const [tomorrowCommitment, setTomorrowCommitment] = useState('');

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('nightly_reviews').insert({
      user_id: user.id,
      answers,
      checklist: Object.entries(checklist).filter(([, v]) => v).map(([k]) => k),
      free_text: freeText,
      day_rating: dayRating,
      final_mood: finalMood,
      learning,
      tomorrow_commitment: tomorrowCommitment,
      is_completed: true,
    });
    setSaving(false);
    if (error) toast.error('Erro ao salvar revisão');
    else { toast.success('Revisão noturna salva'); navigate('/app/revisao'); }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/revisao')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-semibold">Revisão Noturna</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Autoexame do dia — {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Questions */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">Perguntas reflexivas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewQuestions.map((q, i) => (
            <div key={i} className="space-y-1.5">
              <Label className="text-xs font-medium">{q}</Label>
              <Textarea
                value={answers[q] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                rows={2} placeholder="Responda com honestidade..."
                className="text-sm"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating & Mood */}
      <Card className="border-border/40">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Nota do dia: {dayRating}/10</Label>
            <Slider value={[dayRating]} onValueChange={v => setDayRating(v[0])} min={1} max={10} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Humor final</Label>
            <Select value={finalMood} onValueChange={setFinalMood}>
              <SelectTrigger><SelectValue placeholder="Como está se sentindo?" /></SelectTrigger>
              <SelectContent>
                {moods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Aprendizado do dia</Label>
            <Textarea value={learning} onChange={e => setLearning(e.target.value)} rows={2} placeholder="O que aprendi hoje?" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Compromisso de amanhã</Label>
            <Textarea value={tomorrowCommitment} onChange={e => setTomorrowCommitment(e.target.value)} rows={2} placeholder="O que levarei para amanhã?" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Texto livre</Label>
            <Textarea value={freeText} onChange={e => setFreeText(e.target.value)} rows={3} placeholder="Qualquer reflexão adicional..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Concluir revisão'}
        </Button>
      </div>
    </div>
  );
};

export default NightlyReviewForm;
