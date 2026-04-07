import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Plus } from 'lucide-react';

const ControlList = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    supabase.from('control_exercises').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setExercises(data || []); setLoading(false); });
  }, [user]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-semibold">Controle × Não Controle</h1><p className="text-sm text-muted-foreground mt-1">Separe o que depende de você do que não depende</p></div>
        <Link to="/app/controle/novo"><Button size="sm"><Plus className="h-3 w-3 mr-1"/> Novo exercício</Button></Link>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-muted animate-pulse rounded-lg"/>)}</div>
      : exercises.length===0 ? (
        <div className="text-center py-16"><Compass className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4"/><h3 className="font-display text-xl mb-2">Nenhum exercício ainda</h3><p className="text-sm text-muted-foreground mb-4">Use esta ferramenta quando precisar de clareza</p><Link to="/app/controle/novo"><Button><Plus className="h-4 w-4 mr-1"/>Primeiro exercício</Button></Link></div>
      ) : (
        <div className="space-y-2">{exercises.map(ex=>(
          <Card key={ex.id} className="border-border/40"><CardContent className="p-4"><p className="text-sm font-medium line-clamp-2">{ex.situation}</p><span className="text-[11px] text-muted-foreground">{new Date(ex.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span></CardContent></Card>
        ))}</div>
      )}
    </div>
  );
};
export default ControlList;
