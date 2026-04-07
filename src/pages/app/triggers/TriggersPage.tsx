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
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Zap, Plus, ArrowLeft, Save } from 'lucide-react';

const emotions = ['Ansiedade','Medo','Raiva','Tristeza','Frustração','Culpa','Vergonha','Indignação','Desamparo','Confusão'];

export const TriggersList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if(!user)return; supabase.from('triggers').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{setItems(data||[]);setLoading(false);}); }, [user]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-3xl font-semibold">Gatilhos e Impulsos</h1><p className="text-sm text-muted-foreground mt-1">Observe padrões de reação</p></div><Link to="/app/gatilhos/novo"><Button size="sm"><Plus className="h-3 w-3 mr-1"/>Novo gatilho</Button></Link></div>
      {loading?<div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-muted animate-pulse rounded-lg"/>)}</div>
      :items.length===0?(<div className="text-center py-16"><Zap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4"/><h3 className="font-display text-xl mb-2">Nenhum gatilho registrado</h3><p className="text-sm text-muted-foreground mb-4">Registre seus gatilhos para identificar padrões</p><Link to="/app/gatilhos/novo"><Button><Plus className="h-4 w-4 mr-1"/>Registrar primeiro gatilho</Button></Link></div>)
      :(<div className="space-y-2">{items.map(t=>(<Card key={t.id} className="border-border/40"><CardContent className="p-4"><p className="text-sm font-medium">{t.trigger_description}</p><div className="flex gap-2 mt-1">{t.emotion&&<span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t.emotion}</span>}{t.intensity&&<span className="text-[11px] text-muted-foreground">Intensidade: {t.intensity}/10</span>}{t.is_recurring&&<span className="text-[11px] text-copper">Recorrente</span>}</div></CardContent></Card>))}</div>)}
    </div>
  );
};

export const TriggerForm = () => {
  const { user } = useAuth(); const navigate = useNavigate(); const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({trigger_description:'',context:'',emotion:'',intensity:5,impulse:'',actual_reaction:'',ideal_reaction:'',is_recurring:false,frequency:'',associated_person:'',time_period:'',observation:''});
  const u=(f:string,v:any)=>setForm(p=>({...p,[f]:v}));
  const handleSave=async()=>{if(!user||!form.trigger_description.trim()){toast.error('Descreva o gatilho');return;}setSaving(true);const{error}=await supabase.from('triggers').insert({...form,user_id:user.id});setSaving(false);if(error)toast.error('Erro');else{toast.success('Gatilho salvo');navigate('/app/gatilhos');}};
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={()=>navigate('/app/gatilhos')}><ArrowLeft className="h-4 w-4"/></Button><div><h1 className="font-display text-2xl font-semibold">Novo Gatilho</h1></div></div>
      <Card className="border-border/40"><CardContent className="p-5 space-y-4">
        <div className="space-y-2"><Label className="text-xs">Gatilho *</Label><Textarea value={form.trigger_description} onChange={e=>u('trigger_description',e.target.value)} placeholder="O que disparou a reação?" rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Contexto</Label><Textarea value={form.context} onChange={e=>u('context',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Emoção gerada</Label><Select value={form.emotion} onValueChange={v=>u('emotion',v)}><SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger><SelectContent>{emotions.map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs">Intensidade: {form.intensity}/10</Label><Slider value={[form.intensity]} onValueChange={v=>u('intensity',v[0])} min={1} max={10} step={1}/></div>
        <div className="space-y-2"><Label className="text-xs">Impulso gerado</Label><Textarea value={form.impulse} onChange={e=>u('impulse',e.target.value)} rows={2}/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Reação real</Label><Textarea value={form.actual_reaction} onChange={e=>u('actual_reaction',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Reação ideal</Label><Textarea value={form.ideal_reaction} onChange={e=>u('ideal_reaction',e.target.value)} rows={2}/></div></div>
        <div className="space-y-2"><Label className="text-xs">Pessoa/situação associada</Label><Input value={form.associated_person} onChange={e=>u('associated_person',e.target.value)}/></div>
        <div className="space-y-2"><Label className="text-xs">Observação</Label><Textarea value={form.observation} onChange={e=>u('observation',e.target.value)} rows={2}/></div>
      </CardContent></Card>
      <div className="flex justify-end pb-8"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1"/>{saving?'Salvando...':'Salvar gatilho'}</Button></div>
    </div>
  );
};
export default TriggersList;
