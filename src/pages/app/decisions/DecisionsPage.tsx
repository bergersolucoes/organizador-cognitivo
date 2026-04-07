import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Scale, Plus, ArrowLeft, Save } from 'lucide-react';

const statusLabels: Record<string,string> = { aberta:'Aberta', maturando:'Maturando', decidida:'Decidida', revisando:'Revisando', encerrada:'Encerrada' };

export const DecisionsList = () => {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    supabase.from('decisions').select('*').eq('user_id', user.id).is('deleted_at', null)
      .order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setDecisions(data || []); setLoading(false); });
  }, [user]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-semibold">Decisões</h1><p className="text-sm text-muted-foreground mt-1">Analise com clareza antes de agir</p></div>
        <Link to="/app/decisoes/nova"><Button size="sm"><Plus className="h-3 w-3 mr-1" /> Nova decisão</Button></Link>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-muted animate-pulse rounded-lg"/>)}</div>
      : decisions.length === 0 ? (
        <div className="text-center py-16"><Scale className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4"/><h3 className="font-display text-xl mb-2">Nenhuma decisão registrada</h3><p className="text-sm text-muted-foreground mb-4">Registre decisões difíceis para analisar com mais clareza</p><Link to="/app/decisoes/nova"><Button><Plus className="h-4 w-4 mr-1"/>Primeira decisão</Button></Link></div>
      ) : (
        <div className="space-y-2">{decisions.map(d=>(
          <Card key={d.id} className="border-border/40 hover:shadow-sm transition-all"><CardContent className="p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-medium">{d.title}</p><div className="flex gap-2 mt-1"><span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{statusLabels[d.status]||d.status}</span>{d.category&&<span className="text-[11px] text-muted-foreground">{d.category}</span>}</div></div><span className="text-[11px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span></div></CardContent></Card>
        ))}</div>
      )}
    </div>
  );
};

export const DecisionForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title:'', category:'', context:'', core_problem:'', urgency:'', impact:'', rational_scenario:'', impulsive_scenario:'', fear_involved:'', desire_involved:'', under_control:'', outside_control:'', worst_scenario:'', best_scenario:'', cost_of_action:'', cost_of_inaction:'', values_involved:'', virtues_involved:'', emotional_noise:'', provisional_verdict:'', notes:'' });
  const u = (f:string,v:string)=>setForm(p=>({...p,[f]:v}));
  const handleSave = async () => {
    if(!user||!form.title.trim()){toast.error('Informe um título');return;}
    setSaving(true);
    const{error}=await supabase.from('decisions').insert({...form,user_id:user.id});
    setSaving(false);
    if(error)toast.error('Erro ao salvar');else{toast.success('Decisão registrada');navigate('/app/decisoes');}
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={()=>navigate('/app/decisoes')}><ArrowLeft className="h-4 w-4"/></Button><div><h1 className="font-display text-2xl font-semibold">Nova Decisão</h1><p className="text-xs text-muted-foreground mt-0.5">Analise antes de agir</p></div></div>
      <Card className="border-border/40"><CardContent className="p-5 space-y-4">
        <div className="space-y-2"><Label className="text-xs">Título *</Label><Input value={form.title} onChange={e=>u('title',e.target.value)} placeholder="Qual decisão precisa ser tomada?"/></div>
        <div className="space-y-2"><Label className="text-xs">Categoria</Label><Input value={form.category} onChange={e=>u('category',e.target.value)} placeholder="Ex: carreira, relação, saúde..."/></div>
        <div className="space-y-2"><Label className="text-xs">Contexto</Label><Textarea value={form.context} onChange={e=>u('context',e.target.value)} placeholder="Descreva o contexto dessa decisão" rows={3}/></div>
        <div className="space-y-2"><Label className="text-xs">Problema central</Label><Textarea value={form.core_problem} onChange={e=>u('core_problem',e.target.value)} placeholder="Qual o cerne da questão?" rows={2}/></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Cenário racional</Label><Textarea value={form.rational_scenario} onChange={e=>u('rational_scenario',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Cenário impulsivo</Label><Textarea value={form.impulsive_scenario} onChange={e=>u('impulsive_scenario',e.target.value)} rows={2}/></div></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Medo envolvido</Label><Textarea value={form.fear_involved} onChange={e=>u('fear_involved',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Desejo envolvido</Label><Textarea value={form.desire_involved} onChange={e=>u('desire_involved',e.target.value)} rows={2}/></div></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Sob meu controle</Label><Textarea value={form.under_control} onChange={e=>u('under_control',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Fora do meu controle</Label><Textarea value={form.outside_control} onChange={e=>u('outside_control',e.target.value)} rows={2}/></div></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Pior cenário realista</Label><Textarea value={form.worst_scenario} onChange={e=>u('worst_scenario',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Melhor cenário realista</Label><Textarea value={form.best_scenario} onChange={e=>u('best_scenario',e.target.value)} rows={2}/></div></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Custo de agir</Label><Textarea value={form.cost_of_action} onChange={e=>u('cost_of_action',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Custo de não agir</Label><Textarea value={form.cost_of_inaction} onChange={e=>u('cost_of_inaction',e.target.value)} rows={2}/></div></div>
        <div className="space-y-2"><Label className="text-xs">Ruídos emocionais atuais</Label><Textarea value={form.emotional_noise} onChange={e=>u('emotional_noise',e.target.value)} placeholder="O que pode estar distorcendo sua visão?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Veredito provisório</Label><Textarea value={form.provisional_verdict} onChange={e=>u('provisional_verdict',e.target.value)} placeholder="Qual sua inclinação racional agora?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Notas adicionais</Label><Textarea value={form.notes} onChange={e=>u('notes',e.target.value)} rows={2}/></div>
      </CardContent></Card>
      <div className="flex justify-end pb-8"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1"/>{saving?'Salvando...':'Salvar decisão'}</Button></div>
    </div>
  );
};

export default DecisionsList;
