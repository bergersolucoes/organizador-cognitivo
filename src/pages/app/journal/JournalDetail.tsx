import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const JournalDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    supabase.from('journal_entries').select('*').eq('id', id).eq('user_id', user.id).single()
      .then(({ data }) => { setEntry(data); setLoading(false); });
  }, [user, id]);

  const handleDelete = async () => {
    if (!id) return;
    await supabase.from('journal_entries').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    toast.success('Registro removido');
    navigate('/app/diario');
  };

  if (loading) return <div className="h-40 animate-pulse bg-muted rounded-lg" />;
  if (!entry) return <p className="text-muted-foreground">Registro não encontrado</p>;

  const fields = [
    { label: 'Contexto', value: entry.context },
    { label: 'Descrição', value: entry.description },
    { label: 'Emoção principal', value: entry.primary_emotion },
    { label: 'Intensidade emocional', value: entry.emotional_intensity ? `${entry.emotional_intensity}/10` : null },
    { label: 'Evento gatilho', value: entry.trigger_event },
    { label: 'Pensamento automático', value: entry.automatic_thought },
    { label: 'Interpretação', value: entry.interpretation },
    { label: 'Fato observável', value: entry.observable_fact },
    { label: 'Sob meu controle', value: entry.under_control },
    { label: 'Fora do meu controle', value: entry.outside_control },
    { label: 'Impulso inicial', value: entry.initial_impulse },
    { label: 'Resposta real', value: entry.actual_response },
    { label: 'Resposta ideal', value: entry.ideal_response },
    { label: 'Virtude testada', value: entry.virtue_tested },
    { label: 'Padrão percebido', value: entry.pattern_noticed },
    { label: 'Pessoa envolvida', value: entry.related_person },
    { label: 'Nota final', value: entry.final_note },
  ].filter(f => f.value);

  const typeLabels: Record<string, string> = {
    reflexao_livre: 'Reflexão livre', ansiedade: 'Ansiedade', conflito: 'Conflito',
    decisao: 'Decisão', impulso: 'Impulso', medo: 'Medo', frustracao: 'Frustração',
    autocontrole: 'Autocontrole', gratidao: 'Gratidão', revisao_comportamento: 'Revisão',
    planejamento: 'Planejamento', relacao: 'Relação', trabalho: 'Trabalho', saude: 'Saúde', familia: 'Família',
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/diario')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-semibold">{entry.title || 'Sem título'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {typeLabels[entry.entry_type] || entry.entry_type}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-border/40">
        <CardContent className="p-5 space-y-5">
          {fields.map((f, i) => (
            <div key={i}>
              <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
              <p className="text-sm whitespace-pre-wrap">{f.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalDetail;
