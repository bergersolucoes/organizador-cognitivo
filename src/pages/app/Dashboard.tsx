import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Moon, Scale, Zap, Shield, Users, MessageCircle,
  Plus, Brain, Eye, Target, TrendingUp, ArrowRight, Compass
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    journalCount: 0,
    reviewCount: 0,
    decisionCount: 0,
    triggerCount: 0,
  });
  const [latestMood, setLatestMood] = useState<any>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, journalRes, reviewRes, decisionRes, triggerRes, moodRes, recentRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('deleted_at', null),
        supabase.from('nightly_reviews').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('decisions').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('deleted_at', null),
        supabase.from('triggers').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('mood_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('journal_entries').select('*').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false }).limit(5),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      setStats({
        journalCount: journalRes.count || 0,
        reviewCount: reviewRes.count || 0,
        decisionCount: decisionRes.count || 0,
        triggerCount: triggerRes.count || 0,
      });
      if (moodRes.data?.[0]) setLatestMood(moodRes.data[0]);
      if (recentRes.data) setRecentEntries(recentRes.data);
    };
    fetchData();
  }, [user]);

  const quickActions = [
    { icon: BookOpen, label: 'Novo registro', path: '/app/diario/novo', color: 'text-deep-blue' },
    { icon: Moon, label: 'Revisão noturna', path: '/app/revisao/nova', color: 'text-copper' },
    { icon: Scale, label: 'Nova decisão', path: '/app/decisoes/nova', color: 'text-sage' },
    { icon: MessageCircle, label: 'Assistente', path: '/app/assistente', color: 'text-copper' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const entryTypeLabels: Record<string, string> = {
    reflexao_livre: 'Reflexão livre',
    ansiedade: 'Ansiedade',
    conflito: 'Conflito',
    decisao: 'Decisão',
    impulso: 'Impulso',
    medo: 'Medo',
    frustracao: 'Frustração',
    autocontrole: 'Autocontrole',
    gratidao: 'Gratidão',
    revisao_comportamento: 'Revisão',
    planejamento: 'Planejamento',
    relacao: 'Relação',
    trabalho: 'Trabalho',
    saude: 'Saúde',
    familia: 'Família',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">
          {greeting()}{profile?.display_name ? `, ${profile.display_name.split(' ')[0]}` : ''}.
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          O que merece sua atenção lúcida hoje?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Card className="border-border/40 hover:border-copper/30 hover:shadow-sm transition-all cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-xs text-center font-medium">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Registros', value: stats.journalCount, icon: BookOpen },
          { label: 'Revisões', value: stats.reviewCount, icon: Moon },
          { label: 'Decisões', value: stats.decisionCount, icon: Scale },
          { label: 'Gatilhos', value: stats.triggerCount, icon: Zap },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-display font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Mood */}
      {latestMood && (
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">Último registro de humor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {latestMood.mood && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Humor</p>
                  <p className="font-medium">{latestMood.mood}</p>
                </div>
              )}
              {latestMood.clarity_level && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Clareza</p>
                  <p className="font-medium">{latestMood.clarity_level}/10</p>
                </div>
              )}
              {latestMood.anxiety_level && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Ansiedade percebida</p>
                  <p className="font-medium">{latestMood.anxiety_level}/10</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg">Registros recentes</CardTitle>
            <Link to="/app/diario">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Nenhum registro ainda</p>
              <Link to="/app/diario/novo">
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Fazer primeiro registro
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <Link key={entry.id} to={`/app/diario/${entry.id}`} className="block">
                  <div className="flex items-start justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.title || 'Sem título'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                          {entryTypeLabels[entry.entry_type] || entry.entry_type}
                        </span>
                        {entry.primary_emotion && (
                          <span className="text-[11px] text-muted-foreground">{entry.primary_emotion}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                      {new Date(entry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reflective Prompts */}
      <Card className="border-copper/20 bg-copper/5">
        <CardContent className="p-6">
          <p className="text-xs text-copper tracking-widest uppercase mb-3 font-body">Reflexão do momento</p>
          <p className="font-display text-lg italic text-foreground/80">
            "O que mais está pesando em sua mente agora? E quanto disso depende de você?"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
