import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Shield, Plus, ArrowLeft, Save } from 'lucide-react';

const virtues = [
  { value: 'sabedoria', label: 'Sabedoria', desc: 'Discernir o que é verdadeiro, importante e prático.' },
  { value: 'coragem', label: 'Coragem', desc: 'Agir corretamente mesmo diante do medo ou desconforto.' },
  { value: 'temperanca', label: 'Temperança', desc: 'Exercer moderação, autocontrole e equilíbrio.' },
  { value: 'justica', label: 'Justiça', desc: 'Tratar os outros com dignidade, equidade e respeito.' },
];

export const VirtuesList = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if(!user)return; supabase.from('virtues_log').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{setLogs(data||[]);setLoading(false);}); }, [user]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-3xl font-semibold">Virtudes e Conduta</h1><p className="text-sm text-muted-foreground mt-1">Pratique sabedoria, coragem, temperança e justiça</p></div><Link to="/app/virtudes/novo"><Button size="sm"><Plus className="h-3 w-3 mr-1"/>Novo registro</Button></Link></div>
      <div className="grid sm:grid-cols-2 gap-3">{virtues.map(v=>(<Card key={v.value} className="border-border/40"><CardContent className="p-4"><h3 className="font-display text-lg font-semibold capitalize">{v.label}</h3><p className="text-xs text-muted-foreground mt-1">{v.desc}</p></CardContent></Card>))}</div>
      {loading?<div className="h-16 bg-muted animate-pulse rounded-lg"/>:logs.length===0?(<div className="text-center py-10"><p className="text-sm text-muted-foreground">Nenhum registro de virtude ainda</p></div>):(<div className="space-y-2">{logs.map(l=>(<Card key={l.id} className="border-border/40"><CardContent className="p-4"><div className="flex items-center gap-2"><span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary capitalize">{l.virtue}</span>{l.progress_rating&&<span className="text-[11px] text-muted-foreground">Progresso: {l.progress_rating}/10</span>}</div>{l.situation&&<p className="text-sm mt-2">{l.situation}</p>}</CardContent></Card>))}</div>)}
    </div>
  );
};

export const VirtueForm = () => {
  const { user } = useAuth(); const navigate = useNavigate(); const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({virtue:'sabedoria',situation:'',actual_response:'',ideal_response:'',learning:'',progress_rating:5});
  const u=(f:string,v:any)=>setForm(p=>({...p,[f]:v}));
  const handleSave=async()=>{if(!user){return;}setSaving(true);const{error}=await supabase.from('virtues_log').insert({...form,user_id:user.id});setSaving(false);if(error)toast.error('Erro');else{toast.success('Registro salvo');navigate('/app/virtudes');}};
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={()=>navigate('/app/virtudes')}><ArrowLeft className="h-4 w-4"/></Button><h1 className="font-display text-2xl font-semibold">Registrar Virtude</h1></div>
      <Card className="border-border/40"><CardContent className="p-5 space-y-4">
        <div className="space-y-2"><Label className="text-xs">Virtude testada</Label><Select value={form.virtue} onValueChange={v=>u('virtue',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{virtues.map(v=><SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs">Situação</Label><Textarea value={form.situation} onChange={e=>u('situation',e.target.value)} placeholder="O que aconteceu?" rows={3}/></div>
        <div className="space-y-2"><Label className="text-xs">Como respondi</Label><Textarea value={form.actual_response} onChange={e=>u('actual_response',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Como deveria ter respondido</Label><Textarea value={form.ideal_response} onChange={e=>u('ideal_response',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Aprendizado</Label><Textarea value={form.learning} onChange={e=>u('learning',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Progresso percebido: {form.progress_rating}/10</Label><Slider value={[form.progress_rating]} onValueChange={v=>u('progress_rating',v[0])} min={1} max={10} step={1}/></div>
      </CardContent></Card>
      <div className="flex justify-end pb-8"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1"/>{saving?'Salvando...':'Salvar'}</Button></div>
    </div>
  );
};
export default VirtuesList;
