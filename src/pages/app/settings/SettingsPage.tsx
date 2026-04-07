import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings, Save } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ display_name: '' });
  const [settings, setSettings] = useState({ assistant_tone: 'balanced', assistant_mode: 'exploratory', use_auto_context: true, main_goal: '', main_difficulty: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
    ]).then(([p, s]) => {
      if (p.data) setProfile({ display_name: p.data.display_name || '' });
      if (s.data) setSettings({ assistant_tone: s.data.assistant_tone || 'balanced', assistant_mode: s.data.assistant_mode || 'exploratory', use_auto_context: s.data.use_auto_context ?? true, main_goal: s.data.main_goal || '', main_difficulty: s.data.main_difficulty || '' });
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ display_name: profile.display_name }).eq('user_id', user.id);
    const { data: existing } = await supabase.from('user_settings').select('id').eq('user_id', user.id).single();
    if (existing) {
      await supabase.from('user_settings').update(settings).eq('user_id', user.id);
    } else {
      await supabase.from('user_settings').insert({ ...settings, user_id: user.id });
    }
    setSaving(false);
    toast.success('Configurações salvas');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div><h1 className="font-display text-3xl font-semibold">Configurações</h1><p className="text-sm text-muted-foreground mt-1">Personalize sua experiência</p></div>

      <Card className="border-border/40"><CardHeader className="pb-2"><CardTitle className="font-display text-lg">Perfil</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="space-y-2"><Label className="text-xs">Nome de exibição</Label><Input value={profile.display_name} onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))} /></div>
        <div className="space-y-2"><Label className="text-xs">E-mail</Label><Input value={user?.email || ''} disabled className="opacity-60" /></div>
      </CardContent></Card>

      <Card className="border-border/40"><CardHeader className="pb-2"><CardTitle className="font-display text-lg">Aparência</CardTitle></CardHeader><CardContent>
        <div className="space-y-2"><Label className="text-xs">Tema</Label><Select value={theme} onValueChange={v => setTheme(v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem><SelectItem value="system">Sistema</SelectItem></SelectContent></Select></div>
      </CardContent></Card>

      <Card className="border-border/40"><CardHeader className="pb-2"><CardTitle className="font-display text-lg">Assistente Estoico</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="space-y-2"><Label className="text-xs">Tom do assistente</Label><Select value={settings.assistant_tone} onValueChange={v => setSettings(s => ({ ...s, assistant_tone: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="balanced">Equilibrado</SelectItem><SelectItem value="direct">Mais direto</SelectItem><SelectItem value="gentle">Mais acolhedor</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs">Modo do assistente</Label><Select value={settings.assistant_mode} onValueChange={v => setSettings(s => ({ ...s, assistant_mode: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="exploratory">Exploratório</SelectItem><SelectItem value="direct">Direto</SelectItem><SelectItem value="socratic">Socrático</SelectItem></SelectContent></Select></div>
        <div className="flex items-center justify-between"><div><Label className="text-xs">Usar contexto automático</Label><p className="text-[11px] text-muted-foreground">Incluir registros recentes nas conversas</p></div><Switch checked={settings.use_auto_context} onCheckedChange={v => setSettings(s => ({ ...s, use_auto_context: v }))} /></div>
      </CardContent></Card>

      <Card className="border-border/40"><CardHeader className="pb-2"><CardTitle className="font-display text-lg">Objetivos</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="space-y-2"><Label className="text-xs">Objetivo principal</Label><Input value={settings.main_goal} onChange={e => setSettings(s => ({ ...s, main_goal: e.target.value }))} placeholder="O que busca com o Organizador Cognitivo?" /></div>
        <div className="space-y-2"><Label className="text-xs">Principal dificuldade</Label><Input value={settings.main_difficulty} onChange={e => setSettings(s => ({ ...s, main_difficulty: e.target.value }))} placeholder="O que mais precisa trabalhar?" /></div>
      </CardContent></Card>

      <div className="flex justify-end pb-8"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" />{saving ? 'Salvando...' : 'Salvar configurações'}</Button></div>
    </div>
  );
};
export default SettingsPage;
