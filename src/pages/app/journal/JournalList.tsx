import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const entryTypes = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'reflexao_livre', label: 'Reflexão livre' },
  { value: 'ansiedade', label: 'Ansiedade' },
  { value: 'conflito', label: 'Conflito' },
  { value: 'decisao', label: 'Decisão' },
  { value: 'impulso', label: 'Impulso' },
  { value: 'medo', label: 'Medo' },
  { value: 'frustracao', label: 'Frustração' },
  { value: 'autocontrole', label: 'Autocontrole' },
  { value: 'gratidao', label: 'Gratidão' },
  { value: 'revisao_comportamento', label: 'Revisão' },
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'relacao', label: 'Relação' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'saude', label: 'Saúde' },
  { value: 'familia', label: 'Família' },
];

const JournalList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      let query = supabase.from('journal_entries').select('*')
        .eq('user_id', user.id).is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (typeFilter !== 'all') query = query.eq('entry_type', typeFilter);
      if (search.trim()) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      const { data } = await query.limit(50);
      setEntries(data || []);
      setLoading(false);
    };
    fetch();
  }, [user, typeFilter, search]);

  const typeLabels: Record<string, string> = Object.fromEntries(entryTypes.filter(t => t.value !== 'all').map(t => [t.value, t.label]));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Diário Guiado</h1>
          <p className="text-sm text-muted-foreground mt-1">Registre, reflita e organize seus pensamentos</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/diario/rapido">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Rápido
            </Button>
          </Link>
          <Link to="/app/diario/novo">
            <Button size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Novo registro
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar registros..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {entryTypes.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />)}</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl mb-2">Nenhum registro encontrado</h3>
          <p className="text-sm text-muted-foreground mb-4">Comece registrando algo que está em sua mente</p>
          <Link to="/app/diario/novo">
            <Button><Plus className="h-4 w-4 mr-1" /> Criar primeiro registro</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <Link key={entry.id} to={`/app/diario/${entry.id}`}>
              <Card className="border-border/40 hover:border-copper/20 hover:shadow-sm transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{entry.title || 'Sem título'}</p>
                      {entry.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {typeLabels[entry.entry_type] || entry.entry_type}
                        </span>
                        {entry.primary_emotion && (
                          <span className="text-[11px] text-muted-foreground">{entry.primary_emotion}</span>
                        )}
                        {entry.emotional_intensity && (
                          <span className="text-[11px] text-muted-foreground">Intensidade: {entry.emotional_intensity}/10</span>
                        )}
                        {entry.is_draft && <span className="text-[11px] text-copper">Rascunho</span>}
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 ml-3">
                      {new Date(entry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
