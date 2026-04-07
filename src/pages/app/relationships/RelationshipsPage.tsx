import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Users, Plus, ArrowLeft, Save } from 'lucide-react';

export const RelationshipsList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if(!user)return; supabase.from('relationship_reflections').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{setItems(data||[]);setLoading(false);}); }, [user]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-3xl font-semibold">Relações e Conflitos</h1><p className="text-sm text-muted-foreground mt-1">Analise vínculos, expectativas e atritos</p></div><Link to="/app/relacoes/novo"><Button size="sm"><Plus className="h-3 w-3 mr-1"/>Nova reflexão</Button></Link></div>
      {loading?<div className="h-16 bg-muted animate-pulse rounded-lg"/>:items.length===0?(<div className="text-center py-16"><Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4"/><h3 className="font-display text-xl mb-2">Nenhuma reflexão registrada</h3><Link to="/app/relacoes/novo"><Button><Plus className="h-4 w-4 mr-1"/>Primeira reflexão</Button></Link></div>):(<div className="space-y-2">{items.map(r=>(<Card key={r.id} className="border-border/40"><CardContent className="p-4"><p className="text-sm font-medium">{r.person_or_context}</p>{r.problem&&<p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.problem}</p>}</CardContent></Card>))}</div>)}
    </div>
  );
};

export const RelationshipForm = () => {
  const { user } = useAuth(); const navigate = useNavigate(); const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({person_or_context:'',bond_type:'',problem:'',observed_fact:'',interpretation:'',my_expectation:'',their_expectation:'',emotion:'',under_control:'',outside_control:'',dignified_conduct:'',ideal_communication:'',needs_distance:false,needs_conversation:false,needs_acceptance:false,learning:''});
  const u=(f:string,v:any)=>setForm(p=>({...p,[f]:v}));
  const handleSave=async()=>{if(!user||!form.person_or_context.trim()){toast.error('Informe a pessoa ou contexto');return;}setSaving(true);const{error}=await supabase.from('relationship_reflections').insert({...form,user_id:user.id});setSaving(false);if(error)toast.error('Erro');else{toast.success('Reflexão salva');navigate('/app/relacoes');}};
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={()=>navigate('/app/relacoes')}><ArrowLeft className="h-4 w-4"/></Button><h1 className="font-display text-2xl font-semibold">Nova Reflexão Relacional</h1></div>
      <Card className="border-border/40"><CardContent className="p-5 space-y-4">
        <div className="space-y-2"><Label className="text-xs">Pessoa ou contexto *</Label><Input value={form.person_or_context} onChange={e=>u('person_or_context',e.target.value)}/></div>
        <div className="space-y-2"><Label className="text-xs">Tipo de vínculo</Label><Input value={form.bond_type} onChange={e=>u('bond_type',e.target.value)} placeholder="Familiar, amoroso, profissional..."/></div>
        <div className="space-y-2"><Label className="text-xs">Problema</Label><Textarea value={form.problem} onChange={e=>u('problem',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Fato observado</Label><Textarea value={form.observed_fact} onChange={e=>u('observed_fact',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Minha interpretação</Label><Textarea value={form.interpretation} onChange={e=>u('interpretation',e.target.value)} rows={2}/></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Minha expectativa</Label><Textarea value={form.my_expectation} onChange={e=>u('my_expectation',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Expectativa do outro</Label><Textarea value={form.their_expectation} onChange={e=>u('their_expectation',e.target.value)} rows={2}/></div></div>
        <div className="space-y-2"><Label className="text-xs">Emoção envolvida</Label><Input value={form.emotion} onChange={e=>u('emotion',e.target.value)}/></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="text-xs">Sob meu controle</Label><Textarea value={form.under_control} onChange={e=>u('under_control',e.target.value)} rows={2}/></div><div className="space-y-2"><Label className="text-xs">Fora do meu controle</Label><Textarea value={form.outside_control} onChange={e=>u('outside_control',e.target.value)} rows={2}/></div></div>
        <div className="space-y-2"><Label className="text-xs">Conduta mais digna</Label><Textarea value={form.dignified_conduct} onChange={e=>u('dignified_conduct',e.target.value)} rows={2}/></div>
        <div className="space-y-2"><Label className="text-xs">Comunicação ideal</Label><Textarea value={form.ideal_communication} onChange={e=>u('ideal_communication',e.target.value)} rows={2}/></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.needs_distance} onCheckedChange={v=>u('needs_distance',!!v)}/>Precisa de distância</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.needs_conversation} onCheckedChange={v=>u('needs_conversation',!!v)}/>Precisa de conversa</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.needs_acceptance} onCheckedChange={v=>u('needs_acceptance',!!v)}/>Precisa de aceitação</label>
        </div>
        <div className="space-y-2"><Label className="text-xs">Aprendizado</Label><Textarea value={form.learning} onChange={e=>u('learning',e.target.value)} rows={2}/></div>
      </CardContent></Card>
      <div className="flex justify-end pb-8"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1"/>{saving?'Salvando...':'Salvar reflexão'}</Button></div>
    </div>
  );
};
export default RelationshipsList;
