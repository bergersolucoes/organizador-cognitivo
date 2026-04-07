import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const PatternsPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div><h1 className="font-display text-3xl font-semibold">Padrões e Histórico</h1><p className="text-sm text-muted-foreground mt-1">Visualize tendências e evolução ao longo do tempo</p></div>
    <Card className="border-border/40"><CardContent className="p-10 text-center">
      <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4"/>
      <h3 className="font-display text-xl mb-2">Em construção</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">Os gráficos de humor, ansiedade, gatilhos recorrentes e linha do tempo aparecerão aqui conforme você registra dados nos outros módulos.</p>
    </CardContent></Card>
  </div>
);
export default PatternsPage;
