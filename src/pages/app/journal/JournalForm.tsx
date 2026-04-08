import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Save, ChevronDown, ArrowLeft } from 'lucide-react';

const entryTypes = [
  { value: 'reflexao_livre', label: 'Reflexão livre' },
  { value: 'ansiedade', label: 'Ansiedade' },
  { value: 'conflito', label: 'Conflito' },
  { value: 'decisao', label: 'Decisão' },
  { value: 'impulso', label: 'Impulso' },
  { value: 'medo', label: 'Medo' },
  { value: 'frustracao', label: 'Frustração' },
  { value: 'autocontrole', label: 'Autocontrole' },
  { value: 'gratidao', label: 'Gratidão' },
  { value: 'revisao_comportamento', label: 'Revisão de comportamento' },
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'relacao', label: 'Relação' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'saude', label: 'Saúde' },
  { value: 'familia', label: 'Família' },
];

const emotions = [
  'Ansiedade', 'Medo', 'Raiva', 'Tristeza', 'Frustração', 'Culpa', 'Vergonha',
  'Alegria', 'Gratidão', 'Alívio', 'Esperança', 'Orgulho', 'Serenidade',
  'Confusão', 'Arrependimento', 'Ciúme', 'Inveja', 'Tédio', 'Solidão',
  'Indignação', 'Desamparo', 'Determinação', 'Curiosidade', 'Compaixão',
];

const Section = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => (
  <Collapsible defaultOpen={defaultOpen}>
    <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium text-foreground hover:text-copper transition-colors group">
      <span>{title}</span>
      <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-4 pb-4">
      {children}
    </CollapsibleContent>
  </Collapsible>
);

const JournalForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isQuick = window.location.pathname.includes('/rapido');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    entry_type: 'reflexao_livre',
    context: '',
    description: '',
    primary_emotion: '',
    secondary_emotions: [] as string[],
    emotional_intensity: 5,
    trigger_event: '',
    automatic_thought: '',
    interpretation: '',
    observable_fact: '',
    under_control: '',
    outside_control: '',
    initial_impulse: '',
    actual_response: '',
    ideal_response: '',
    virtue_tested: '',
    pattern_noticed: '',
    related_person: '',
    final_note: '',
    is_draft: false,
    is_quick: isQuick,
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async (draft = false) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('journal_entries').insert({
      ...form,
      user_id: user.id,
      is_draft: draft,
      secondary_emotions: form.secondary_emotions.length > 0 ? form.secondary_emotions : null,
    });
    setSaving(false);
    if (error) {
      toast.error('Erro ao salvar registro');
    } else {
      toast.success(draft ? 'Rascunho salvo' : 'Registro salvo com sucesso');
      navigate('/app/diario');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/diario')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {isQuick ? 'Registro Rápido' : 'Novo Registro'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isQuick ? 'Registre o essencial de forma ágil' : 'Explore seus pensamentos com profundidade'}
          </p>
        </div>
      </div>

      <Card className="border-border/40">
        <CardContent className="p-5 space-y-0 divide-y divide-border/40">
          {/* Essencial - sempre aberto */}
          <Section title="Essencial" defaultOpen>
            <div className="space-y-2">
              <Label className="text-xs">Título</Label>
              <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="O que resume este registro?" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Tipo de registro</Label>
              <Select value={form.entry_type} onValueChange={v => update('entry_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {entryTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Descreva o que está sentindo, pensando ou vivendo..." rows={4} />
            </div>
          </Section>

          {/* Emoções */}
          <Section title="Emoções" defaultOpen={!isQuick}>
            <div className="space-y-2">
              <Label className="text-xs">Emoção principal</Label>
              <Select value={form.primary_emotion} onValueChange={v => update('primary_emotion', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {emotions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Intensidade emocional: {form.emotional_intensity}/10</Label>
              <Slider value={[form.emotional_intensity]} onValueChange={v => update('emotional_intensity', v[0])}
                min={1} max={10} step={1} className="py-2" />
            </div>
          </Section>

          {!isQuick && (
            <>
              {/* Contexto e Gatilho */}
              <Section title="Contexto e gatilho">
                <div className="space-y-2">
                  <Label className="text-xs">Contexto</Label>
                  <Textarea value={form.context} onChange={e => update('context', e.target.value)}
                    placeholder="Onde você estava? O que acontecia?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Evento gatilho</Label>
                  <Textarea value={form.trigger_event} onChange={e => update('trigger_event', e.target.value)}
                    placeholder="O que disparou isso?" rows={2} />
                </div>
              </Section>

              {/* Pensamento e Interpretação */}
              <Section title="Pensamento e interpretação">
                <div className="space-y-2">
                  <Label className="text-xs">Pensamento automático</Label>
                  <Textarea value={form.automatic_thought} onChange={e => update('automatic_thought', e.target.value)}
                    placeholder="Qual foi o primeiro pensamento que veio?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Interpretação que fiz</Label>
                  <Textarea value={form.interpretation} onChange={e => update('interpretation', e.target.value)}
                    placeholder="Como interpretei a situação?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Fato observável</Label>
                  <Textarea value={form.observable_fact} onChange={e => update('observable_fact', e.target.value)}
                    placeholder="O que de fato aconteceu, sem interpretação?" rows={2} />
                </div>
              </Section>

              {/* Controle */}
              <Section title="Controle e não-controle">
                <div className="space-y-2">
                  <Label className="text-xs">O que está sob meu controle</Label>
                  <Textarea value={form.under_control} onChange={e => update('under_control', e.target.value)}
                    placeholder="Minhas ações, reações, escolhas..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">O que não está sob meu controle</Label>
                  <Textarea value={form.outside_control} onChange={e => update('outside_control', e.target.value)}
                    placeholder="Reações alheias, resultados, circunstâncias..." rows={2} />
                </div>
              </Section>

              {/* Resposta e Virtude */}
              <Section title="Resposta e conduta">
                <div className="space-y-2">
                  <Label className="text-xs">Impulso inicial</Label>
                  <Textarea value={form.initial_impulse} onChange={e => update('initial_impulse', e.target.value)}
                    placeholder="O que você quis fazer de imediato?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Resposta que tive</Label>
                  <Textarea value={form.actual_response} onChange={e => update('actual_response', e.target.value)}
                    placeholder="Como de fato respondi?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Resposta que gostaria de ter tido</Label>
                  <Textarea value={form.ideal_response} onChange={e => update('ideal_response', e.target.value)}
                    placeholder="Qual seria a resposta mais lúcida?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Virtude testada</Label>
                  <Select value={form.virtue_tested} onValueChange={v => update('virtue_tested', v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sabedoria">Sabedoria</SelectItem>
                      <SelectItem value="coragem">Coragem</SelectItem>
                      <SelectItem value="temperanca">Temperança</SelectItem>
                      <SelectItem value="justica">Justiça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Section>

              {/* Padrões e Relações */}
              <Section title="Padrões e relações">
                <div className="space-y-2">
                  <Label className="text-xs">Padrão percebido</Label>
                  <Textarea value={form.pattern_noticed} onChange={e => update('pattern_noticed', e.target.value)}
                    placeholder="Isso já aconteceu antes? Há um padrão?" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Pessoa envolvida</Label>
                  <Input value={form.related_person} onChange={e => update('related_person', e.target.value)}
                    placeholder="Alguém está envolvido nessa situação?" />
                </div>
              </Section>

              {/* Nota Final */}
              <Section title="Nota final">
                <div className="space-y-2">
                  <Label className="text-xs">Reflexão de encerramento</Label>
                  <Textarea value={form.final_note} onChange={e => update('final_note', e.target.value)}
                    placeholder="O que você conclui ao final deste registro?" rows={3} />
                </div>
              </Section>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end pb-8">
        <Button variant="outline" onClick={() => handleSave(true)} disabled={saving}>
          Salvar rascunho
        </Button>
        <Button onClick={() => handleSave(false)} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar registro'}
        </Button>
      </div>
    </div>
  );
};

export default JournalForm;
