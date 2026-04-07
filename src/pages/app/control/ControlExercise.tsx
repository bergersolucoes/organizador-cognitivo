import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save, Compass } from 'lucide-react';

const ControlExercise = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ situation:'', facts:'', assumptions:'', fears:'', expectations:'', possible_actions:'', under_control:'', outside_control:'', acceptance_needed:'', practical_action:'', rational_conclusion:'' });
  const u = (f:string,v:string)=>setForm(p=>({...p,[f]:v}));
  const handleSave = async () => {
    if(!user||!form.situation.trim()){toast.error('Descreva a situação');return;}
    setSaving(true);
    const{error}=await supabase.from('control_exercises').insert({...form,user_id:user.id});
    setSaving(false);
    if(error)toast.error('Erro ao salvar');else{toast.success('Exercício salvo');navigate('/app/controle');}
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={()=>navigate('/app/controle')}><ArrowLeft className="h-4 w-4"/></Button><div><h1 className="font-display text-2xl font-semibold">Controle × Não Controle</h1><p className="text-xs text-muted-foreground mt-0.5">Separe o que depende de você</p></div></div>
      <Card className="border-copper/20 bg-copper/5"><CardContent className="p-5"><p className="text-sm text-foreground/80 italic font-display">"Que eu tenha serenidade para aceitar o que não posso mudar, coragem para mudar o que posso, e sabedoria para distinguir um do outro."</p></CardContent></Card>
      <Card className="border-border/40"><CardContent className="p-5 space-y-4">
        <div className="space-y-2"><Label className="text-xs">Situação *</Label><Textarea value={form.situation} onChange={e=>u('situation',e.target.value)} placeholder="O que está acontecendo?" rows={3}/></div>
        <div className="space-y-2"><Label className="text-xs">Fatos observáveis</Label><Textarea value={form.facts} onChange={e=>u('facts',e.target.value)} placeholder="O que de fato ocorreu, sem interpretação?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Suposições</Label><Textarea value={form.assumptions} onChange={e=>u('assumptions',e.target.value)} placeholder="O que estou assumindo que pode não ser verdade?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Medos</Label><Textarea value={form.fears} onChange={e=>u('fears',e.target.value)} placeholder="O que temo que aconteça?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Expectativas</Label><Textarea value={form.expectations} onChange={e=>u('expectations',e.target.value)} rows={2}/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 p-4 rounded-lg bg-sage/10 border border-sage/20"><Label className="text-xs text-sage font-semibold">✓ Sob meu controle</Label><Textarea value={form.under_control} onChange={e=>u('under_control',e.target.value)} placeholder="Minhas ações, reações, escolhas..." rows={4} className="border-sage/20"/></div>
          <div className="space-y-2 p-4 rounded-lg bg-muted border border-border"><Label className="text-xs text-muted-foreground font-semibold">✗ Fora do meu controle</Label><Textarea value={form.outside_control} onChange={e=>u('outside_control',e.target.value)} placeholder="Reações alheias, resultados..." rows={4}/></div>
        </div>
        <div className="space-y-2"><Label className="text-xs">Aceitação necessária</Label><Textarea value={form.acceptance_needed} onChange={e=>u('acceptance_needed',e.target.value)} placeholder="O que preciso aceitar aqui?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Ação prática imediata</Label><Textarea value={form.practical_action} onChange={e=>u('practical_action',e.target.value)} placeholder="O que posso fazer agora?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Conclusão racional</Label><Textarea value={form.rational_conclusion} onChange={e=>u('rational_conclusion',e.target.value)} placeholder="Frase que resume sua posição lúcida" rows={2}/></div>
      </CardContent></Card>
      <div className="flex justify-end pb-8"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1"/>{saving?'Salvando...':'Salvar exercício'}</Button></div>
    </div>
  );
};
export default ControlExercise;
