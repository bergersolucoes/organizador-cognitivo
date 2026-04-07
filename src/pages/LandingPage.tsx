import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, BookOpen, Moon, Scale, Zap, Shield, Users,
  TrendingUp, MessageCircle, Brain, ChevronRight, Lock,
  Eye, Target, Heart, ArrowRight, CheckCircle2, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const LandingPage = () => {
  const painPoints = [
    { icon: Brain, text: 'Mente acelerada que não desliga' },
    { icon: Zap, text: 'Ansiedade por excesso de pensamento' },
    { icon: Scale, text: 'Dificuldade em tomar decisões' },
    { icon: Eye, text: 'Ruminação constante' },
    { icon: Target, text: 'Impulsividade na ação e na fala' },
    { icon: Compass, text: 'Confusão interna e falta de direção' },
    { icon: Heart, text: 'Dificuldade em organizar o que sente' },
    { icon: Shield, text: 'Incapacidade de separar controle e não-controle' },
  ];

  const modules = [
    { icon: BookOpen, title: 'Diário Guiado', desc: 'Registros estruturados com profundidade emocional e racional' },
    { icon: Moon, title: 'Revisão Noturna', desc: 'Autoexame diário inspirado em práticas filosóficas' },
    { icon: Compass, title: 'Mapa de Controle', desc: 'Separe o que depende de você do que não depende' },
    { icon: Scale, title: 'Decisões Difíceis', desc: 'Análise racional de cenários, custos e valores' },
    { icon: Zap, title: 'Gatilhos Emocionais', desc: 'Observe padrões de reação e impulso' },
    { icon: Shield, title: 'Virtudes e Conduta', desc: 'Sabedoria, coragem, temperança e justiça aplicadas' },
    { icon: Users, title: 'Relações e Conflitos', desc: 'Análise de vínculos, expectativas e atritos' },
    { icon: MessageCircle, title: 'Assistente Estoico', desc: 'Filósofo particular, sóbrio e útil' },
    { icon: TrendingUp, title: 'Padrões e Histórico', desc: 'Gráficos, tendências e evolução pessoal' },
    { icon: Target, title: 'Painel Pessoal', desc: 'Visão geral do dia, humor e clareza' },
  ];

  const steps = [
    { num: '01', title: 'Registrar', desc: 'Anote o que pensa, sente e vive' },
    { num: '02', title: 'Refletir', desc: 'Separe fato de interpretação' },
    { num: '03', title: 'Organizar', desc: 'Classifique por emoção, tipo e controle' },
    { num: '04', title: 'Decidir', desc: 'Analise com clareza racional' },
    { num: '05', title: 'Revisar', desc: 'Faça o autoexame noturno' },
    { num: '06', title: 'Perceber', desc: 'Identifique padrões recorrentes' },
    { num: '07', title: 'Agir melhor', desc: 'Aja com lucidez e coerência' },
  ];

  const benefits = [
    'Mais clareza sobre o que sente e pensa',
    'Menos ruminação e excesso de pensamento',
    'Decisões mais conscientes e fundamentadas',
    'Revisão de impulsos antes de agir',
    'Organização emocional e cognitiva',
    'Coerência entre pensamento e ação',
    'Melhor leitura de padrões pessoais',
    'Regulação emocional prática e aplicável',
  ];

  const faqs = [
    { q: 'Isso é terapia?', a: 'Não. O Organizador Cognitivo é uma ferramenta de reflexão e organização pessoal. Não substitui acompanhamento psicológico ou psiquiátrico.' },
    { q: 'Isso substitui psicólogo?', a: 'De forma alguma. O produto complementa — nunca substitui — o trabalho de profissionais de saúde mental.' },
    { q: 'Preciso conhecer estoicismo?', a: 'Não. O app usa princípios práticos que qualquer pessoa pode aplicar, sem exigir conhecimento filosófico prévio.' },
    { q: 'Posso usar só como diário?', a: 'Sim. Você pode usar apenas o módulo de diário guiado, sem obrigação de explorar os demais.' },
    { q: 'O assistente me dá respostas prontas?', a: 'Não. Ele ajuda você a pensar melhor, não pensa no seu lugar. Usa perguntas, organização e clareza — sem frases motivacionais vazias.' },
    { q: 'Isso é para ansiedade?', a: 'Pode ser útil para quem sente ansiedade, mas não é tratamento médico. É uma ferramenta de organização cognitiva e reflexão.' },
    { q: 'Posso usar no celular?', a: 'Sim. O app é otimizado para celular e pode ser instalado como um aplicativo na tela inicial.' },
    { q: 'Existe modo privado?', a: 'Todo o app é privado. Seus dados são protegidos e só você tem acesso.' },
    { q: 'Posso exportar minhas reflexões?', a: 'A estrutura está preparada para exportação futura dos seus dados.' },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Compass className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">Organizador Cognitivo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/entrar">
              <Button variant="ghost" size="sm" className="font-body text-sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm" className="font-body text-sm">Começar agora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 font-body">
              Autogoverno · Clareza · Reflexão
            </p>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight mb-6"
          >
            Organize seu pensamento.{' '}
            <span className="text-copper">Governe suas ações.</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ferramenta de organização cognitiva, reflexão guiada e tomada de decisão. 
            Inspirada em estoicismo prático, discernimento racional e regulação emocional. 
            Para quem busca clareza, e não respostas fáceis.
          </motion.p>
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/cadastro">
              <Button size="lg" className="font-body px-8 text-base">
                Começar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="outline" size="lg" className="font-body px-8 text-base">
                Ver como funciona
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-copper mb-3">Para quem é</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              Se você se reconhece aqui
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Este produto foi pensado para pessoas que precisam de uma ferramenta de clareza — não de mais conteúdo motivacional.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {painPoints.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <Card className="border-border/40 hover:border-copper/30 transition-colors h-full">
                  <CardContent className="flex items-start gap-3 p-5">
                    <item.icon className="h-5 w-5 text-copper shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você encontra */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-copper mb-3">Módulos</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              O que você encontra
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <Card className="border-border/40 hover:shadow-md transition-all h-full">
                  <CardContent className="p-6">
                    <mod.icon className="h-6 w-6 text-deep-blue mb-3" />
                    <h3 className="font-display text-lg font-semibold mb-1">{mod.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-copper mb-3">Processo</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              Como funciona
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.slice(0, 4).map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="text-center"
              >
                <p className="text-3xl font-display font-light text-copper/60 mb-2">{step.num}</p>
                <h3 className="font-display text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mt-6 max-w-3xl mx-auto">
            {steps.slice(4).map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i + 4}
                className="text-center"
              >
                <p className="text-3xl font-display font-light text-copper/60 mb-2">{step.num}</p>
                <h3 className="font-display text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assistente Estoico */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <MessageCircle className="h-10 w-10 text-copper mx-auto mb-4" />
          <p className="text-xs tracking-[0.3em] uppercase text-copper mb-3">Assistente</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6">
            Seu filósofo particular
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
            Um orientador racional que ajuda você a pensar — não pensa no seu lugar. 
            Sem viagens, sem delírio, sem bajulação. Sempre pé no chão. 
            Separa fato de interpretação, organiza raciocínios e aponta incoerências com respeito.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
            {[
              'Ajuda a separar fato de interpretação',
              'Separa controle de não-controle',
              'Reduz dramatização',
              'Faz perguntas socráticas',
              'Apoia em decisões difíceis',
              'Mantém tom sóbrio e firme',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-sage shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-copper mb-3">Benefícios</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              O que você ganha
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border/40"
              >
                <CheckCircle2 className="h-5 w-5 text-sage shrink-0" />
                <span className="text-sm">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacidade */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Lock className="h-10 w-10 text-copper mx-auto mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6">
            Privacidade e ética
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
            Seus dados são pessoais e protegidos. Este é um espaço privado de reflexão. 
            Ninguém além de você acessa seus registros, pensamentos e decisões.
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
            O Organizador Cognitivo não substitui acompanhamento profissional de saúde mental. 
            Ele é uma ferramenta de organização e reflexão — nunca de diagnóstico ou tratamento.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-copper mb-3">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              Perguntas frequentes
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/40 rounded-lg px-4 bg-background">
                <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            Comece a organizar sua mente
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Clareza não vem de mais informação. Vem de reflexão organizada, discernimento prático e ação consciente.
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="font-body px-8 text-base">
              Criar minha conta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Compass className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-semibold">Organizador Cognitivo</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Termos</span>
              <span>Privacidade</span>
              <span>Contato</span>
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
            Este produto não substitui acompanhamento psicológico, psiquiátrico ou qualquer tratamento de saúde mental. 
            É uma ferramenta de organização cognitiva e reflexão pessoal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
