import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Plus } from 'lucide-react';

const NightlyReviewList = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('nightly_reviews').select('*').eq('user_id', user.id)
      .order('review_date', { ascending: false }).limit(30)
      .then(({ data }) => { setReviews(data || []); setLoading(false); });
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Revisão Noturna</h1>
          <p className="text-sm text-muted-foreground mt-1">Autoexame diário e encerramento do dia</p>
        </div>
        <Link to="/app/revisao/nova"><Button size="sm"><Plus className="h-3 w-3 mr-1" /> Nova revisão</Button></Link>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-muted animate-pulse rounded-lg"/>)}</div>
      : reviews.length === 0 ? (
        <div className="text-center py-16">
          <Moon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl mb-2">Nenhuma revisão ainda</h3>
          <p className="text-sm text-muted-foreground mb-4">Encerre seu dia com reflexão e clareza</p>
          <Link to="/app/revisao/nova"><Button><Plus className="h-4 w-4 mr-1" /> Primeira revisão</Button></Link>
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.map(r => (
            <Card key={r.id} className="border-border/40">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{new Date(r.review_date).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {r.final_mood && <span>Humor: {r.final_mood}</span>}
                    {r.day_rating && <span>Nota: {r.day_rating}/10</span>}
                    {r.is_completed && <span className="text-sage">✓ Concluída</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default NightlyReviewList;
