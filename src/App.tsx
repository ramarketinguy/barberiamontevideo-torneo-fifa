import { useState, useEffect, useRef } from 'react';
import { sendMetaEvent } from './utils/meta-events';


// Logo de la Barbería (imagen proporcionada)
const BARBERSHOP_LOGO = '/logo-barberia.png';

// Components
const NeonButton = ({ children, variant = 'blue', className = '', onClick }: { children: React.ReactNode; variant?: 'blue' | 'red'; className?: string; onClick?: () => void }) => {
  const baseClasses = "relative px-8 py-4 font-orbitron font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 cursor-pointer cyber-button";
  const variantClasses = variant === 'blue'
    ? "bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] animate-border-glow"
    : "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500/20 hover:shadow-[0_0_30px_rgba(255,0,64,0.5)] animate-border-glow-red";

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const SectionTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className="relative mb-16">
    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-center neon-text-blue animate-neon-pulse ${className}`}>
      {children}
    </h2>
    <div className="flex items-center justify-center mt-4 gap-4">
      <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-cyan-400"></div>
      <div className="w-2 h-2 bg-cyan-400 rotate-45 animate-pulse"></div>
      <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-cyan-400"></div>
    </div>
  </div>
);

const GlassCard = ({ children, className = '', glowColor = 'blue' }: { children: React.ReactNode; className?: string; glowColor?: 'blue' | 'red' }) => (
  <div className={`glass-card rounded-xl p-6 md:p-8 ${glowColor === 'blue' ? 'animate-border-glow' : 'animate-border-glow-red'} ${className}`}>
    {children}
  </div>
);

// Animated Counter with intersection observer
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Enhanced Prize Card - Sin valores
const PrizeCard = ({ position, prize, icon }: { position: string; prize: string; icon: string }) => {
  const colors = {
    '1er': {
      border: 'border-yellow-400',
      text: 'text-yellow-400',
      glow: '0 0 30px rgba(250, 204, 21, 0.4), 0 0 60px rgba(250, 204, 21, 0.2)',
      gradient: 'from-yellow-400/20 to-transparent',
      metallic: 'metallic-gold'
    },
    '2do': {
      border: 'border-gray-300',
      text: 'text-gray-300',
      glow: '0 0 30px rgba(209, 213, 219, 0.4), 0 0 60px rgba(209, 213, 219, 0.2)',
      gradient: 'from-gray-300/20 to-transparent',
      metallic: 'metallic-silver'
    },
    '3er': {
      border: 'border-orange-500',
      text: 'text-orange-500',
      glow: '0 0 30px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)',
      gradient: 'from-orange-500/20 to-transparent',
      metallic: 'metallic-bronze'
    },
  };
  const color = colors[position as keyof typeof colors] || colors['3er'];

  return (
    <div
      className={`glass-card rounded-2xl p-8 border-2 ${color.border} transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden`}
      style={{ boxShadow: color.glow }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${color.gradient} opacity-50`}></div>

      {/* Animated corner accents */}
      <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 ${color.border} opacity-50 transition-all duration-300 group-hover:w-20 group-hover:h-20`}></div>
      <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 ${color.border} opacity-50 transition-all duration-300 group-hover:w-20 group-hover:h-20`}></div>

      <div className="relative z-10">
        <div className="text-7xl mb-6 text-center animate-float group-hover:animate-none group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <div className={`text-2xl md:text-3xl font-orbitron font-bold ${color.metallic} text-center mb-4`}>{position} LUGAR</div>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent mx-auto mb-4 opacity-50"></div>
        <p className="text-white text-center font-rajdhani text-lg md:text-xl leading-relaxed">{prize}</p>
      </div>
    </div>
  );
};

// Floating Particle
const FloatingParticle = ({ delay, size, left, duration }: { delay: number; size: number; left: string; duration: number }) => (
  <div
    className="absolute bg-cyan-400 rounded-full opacity-30 animate-particle-float"
    style={{
      width: size,
      height: size,
      left: left,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      filter: 'blur(1px)',
    }}
  />
);

// Hexagon decoration
const HexDecoration = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`absolute pointer-events-none ${className}`} style={style}>
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))' }}>
      <polygon
        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
        fill="none"
        stroke="rgba(0, 240, 255, 0.2)"
        strokeWidth="1"
      />
    </svg>
  </div>
);
// WhatsApp Floating Button - New Component
const WhatsAppFloating = () => {
  const whatsappUrl = "https://wa.me/59898057705?text=tengo%20dudas%20sobre%20el%20torneo";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => sendMetaEvent('Contact')}
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      {/* Glow effect around the button */}
      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-300"></div>

      {/* Label that shows on hover */}
      <div className="absolute right-full mr-4 px-4 py-2 bg-black/90 border border-green-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 hidden md:block">
        <span className="text-green-500 font-orbitron text-xs whitespace-nowrap tracking-wider font-bold">¿DUDAS? ESCRÍBENOS</span>
      </div>

      {/* Main button */}
      <div className="relative w-16 h-16 bg-black border-2 border-green-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]">
        {/* Animated ring inside */}
        <div className="absolute inset-1 border border-green-500/30 rounded-full animate-ping opacity-40"></div>

        <svg
          className="w-9 h-9 text-green-500 group-hover:text-green-400 transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
    </a>
  );
};

// Main App

// Main App
export function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Track page view
    sendMetaEvent('ViewContent');
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Background Grid + Hex Pattern */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none"></div>
      <div className="fixed inset-0 hex-pattern opacity-30 pointer-events-none"></div>

      {/* Data Stream Effect */}
      <div className="fixed inset-0 data-stream-bg opacity-20 pointer-events-none"></div>

      {/* Enhanced Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={Math.random() * 5}
            size={Math.random() * 4 + 1}
            left={`${Math.random() * 100}%`}
            duration={5 + Math.random() * 5}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Animated Background Circles - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-cyan-500/20 animate-rotate-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full border border-red-500/20 animate-rotate-reverse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 animate-rotate-slow" style={{ animationDuration: '40s' }}></div>

          {/* Hexagon decorations */}
          <HexDecoration className="top-20 left-10 w-24 h-24 animate-hex-rotate opacity-30" />
          <HexDecoration className="bottom-32 right-20 w-32 h-32 animate-hex-rotate opacity-20" style={{ animationDelay: '5s' } as React.CSSProperties} />
          <HexDecoration className="top-1/3 right-1/4 w-16 h-16 animate-hex-rotate opacity-40" style={{ animationDelay: '10s' } as React.CSSProperties} />
        </div>

        <div className={`text-center z-10 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          {/* Logo Container - Enhanced */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              {/* Outer pulsing rings */}
              <div className="absolute -inset-8 rounded-full border border-cyan-400/20 animate-ring-expand"></div>
              <div className="absolute -inset-8 rounded-full border border-cyan-400/30 animate-ring-expand" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -inset-8 rounded-full border border-cyan-400/40 animate-ring-expand" style={{ animationDelay: '2s' }}></div>

              {/* Main logo circle */}
              <div className="logo-circle w-36 h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center animate-logo-breathe">
                {!logoError ? (
                  <img
                    src={BARBERSHOP_LOGO}
                    alt="Logo Barbería"
                    className={`w-[85%] h-[85%] object-contain transition-opacity duration-500 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-5xl md:text-6xl">💈</span>
                )}
              </div>

              {/* Corner accent lines */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-red-500/50"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-red-500/50"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50"></div>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-cyan-400 font-rajdhani text-xl md:text-2xl tracking-[0.3em] animate-cyber-flicker">PRESENTA</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black mb-4">
            <span className="neon-text-blue animate-neon-pulse inline-block animate-text-glow">TORNEO</span>
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black mb-8">
            <span className="neon-text-red animate-neon-pulse-red inline-block">FIFA PS5</span>
          </h1>

          {/* Year with cyber styling */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="cyber-line w-20 md:w-32"></div>
            <span className="text-3xl md:text-4xl font-orbitron text-white tracking-widest">2025</span>
            <div className="cyber-line w-20 md:w-32"></div>
          </div>

          <p className="text-xl md:text-2xl font-rajdhani text-gray-300 mb-6 tracking-wide">
            <span className="text-cyan-400">32</span> JUGADORES • <span className="text-red-400">8</span> GRUPOS • <span className="text-yellow-400">1</span> CAMPEÓN
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="glass-card-premium px-6 py-3 rounded-lg">
              <span className="text-cyan-400 font-orbitron flex items-center gap-2">
                <span className="animate-pulse">📍</span> Rivera 3184 esq La Gaceta
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24 md:mb-28">
            <NeonButton variant="blue" onClick={() => scrollToSection('inscripcion')}>
              ¡Inscríbete Ahora!
            </NeonButton>
            <NeonButton variant="red" onClick={() => scrollToSection('premios')}>
              Ver Premios
            </NeonButton>
          </div>
        </div>

        {/* Enhanced Scroll indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-cyan-400/50 text-xs font-rajdhani tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 px-4 relative gradient-overlay-blue">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 32, label: 'JUGADORES', suffix: '', icon: '👥' },
              { value: 8, label: 'GRUPOS', suffix: '', icon: '🎯' },
              { value: 4, label: 'FECHAS', suffix: '', icon: '📅' },
              { value: 2, label: 'CONTROLES', suffix: '', icon: '🎮' },
            ].map((stat, i) => (
              <GlassCard key={i} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-orbitron font-bold neon-text-blue mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 font-rajdhani text-sm md:text-base tracking-wider">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes Section - Enhanced, sin valores */}
      <section id="premios" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <SectionTitle>🏆 PREMIOS</SectionTitle>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:order-2 md:-mt-8">
              <PrizeCard
                position="1er"
                prize="Camiseta del equipo o selección que elijas + Servicio Platinum completo"
                icon="🥇"
              />
            </div>
            <div className="md:order-1 md:mt-8">
              <PrizeCard
                position="2do"
                prize="Servicio VIP completo en la barbería"
                icon="🥈"
              />
            </div>
            <div className="md:order-3 md:mt-8">
              <PrizeCard
                position="3er"
                prize="2 cortes de cabello gratis"
                icon="🥉"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Format Section - Enhanced */}
      <section id="formato" className="py-24 px-4 relative gradient-overlay-red">
        <div className="max-w-6xl mx-auto">
          <SectionTitle>⚽ FORMATO DEL TORNEO</SectionTitle>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <GlassCard className="transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-2xl font-orbitron font-bold text-cyan-400 mb-6 flex items-center gap-3 relative z-10">
                <span className="text-3xl animate-float">🎮</span> ESTRUCTURA
              </h3>
              <ul className="space-y-5 font-rajdhani text-lg relative z-10">
                {[
                  '8 grupos de 4 jugadores cada uno (estilo Mundial)',
                  '2 partidos por grupo',
                  <>Eliminación directa: <span className="text-red-400 font-bold">si perdés, quedás fuera</span></>,
                  'El que gana en su grupo, clasifica',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <span className="text-cyan-400 text-xl group-hover/item:scale-125 transition-transform">▹</span>
                    <span className="group-hover/item:text-cyan-100 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group" glowColor="red">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-2xl font-orbitron font-bold text-red-400 mb-6 flex items-center gap-3 relative z-10">
                <span className="text-3xl animate-float-delayed">⚙️</span> CONFIGURACIÓN
              </h3>
              <ul className="space-y-5 font-rajdhani text-lg relative z-10">
                {[
                  'Configuración estándar de patada inicial',
                  <>Puedes elegir <span className="text-cyan-400 font-bold">cualquier equipo o selección</span></>,
                  <>Duración: <span className="text-yellow-400 font-bold">4 minutos por tiempo</span></>,
                  <>Regla especial: <span className="text-red-400 font-bold">5-0 en el primer tiempo = K.O. automático</span></>,
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <span className="text-red-400 text-xl group-hover/item:scale-125 transition-transform">▹</span>
                    <span className="group-hover/item:text-red-100 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="mt-12 text-center">
            <GlassCard className="inline-block px-8 py-4">
              <p className="font-rajdhani text-lg flex items-center gap-3">
                <span className="text-cyan-400 text-2xl animate-pulse">💡</span>
                Solo debes asistir el día que te toque jugar, <span className="text-cyan-400 font-bold">no es necesario ir las 4 fechas</span>
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle>🎁 BENEFICIOS PARA PARTICIPANTES</SectionTitle>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🍴', title: 'REFRIGERIO INCLUIDO', desc: 'Tequeños + Brownie + Gaseosa', color: 'blue' },
              { icon: '💇', title: '15% DESCUENTO', desc: 'En todos los servicios de la barbería', note: '*Válido durante las 2 semanas del torneo', color: 'red' },
              { icon: '👥', title: 'TRAE ACOMPAÑANTES', desc: 'Los espectadores son bienvenidos', color: 'blue' },
            ].map((benefit, i) => (
              <GlassCard
                key={i}
                className="text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group"
                glowColor={benefit.color as 'blue' | 'red'}
              >
                <div className="text-6xl md:text-7xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">{benefit.icon}</div>
                <h3 className={`text-xl font-orbitron font-bold ${benefit.color === 'blue' ? 'text-cyan-400' : 'text-red-400'} mb-4`}>{benefit.title}</h3>
                <p className="font-rajdhani text-gray-300 text-lg">{benefit.desc}</p>
                {benefit.note && <p className="font-rajdhani text-sm text-gray-500 mt-2">{benefit.note}</p>}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section - Enhanced */}
      <section id="inscripcion" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>📝 INSCRIPCIÓN</SectionTitle>

          <GlassCard className="mb-10">
            <div className="text-center mb-10">
              <div className="inline-block bg-red-500/20 border-2 border-red-500 rounded-xl px-8 py-4 animate-pulse">
                <span className="text-red-400 font-orbitron font-bold text-xl md:text-2xl">⏰ INSCRIPCIONES HASTA: 1 DE MARZO</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="group">
                <h3 className="text-xl font-orbitron font-bold text-cyan-400 mb-6 flex items-center gap-3">
                  <span className="text-2xl group-hover:rotate-12 transition-transform">🏦</span> Transferencia Bancaria
                </h3>
                <div className="bg-black/60 rounded-xl p-6 font-mono text-sm space-y-4 border border-cyan-400/20 group-hover:border-cyan-400/40 transition-colors">
                  <div>
                    <p className="text-gray-400 mb-2">Banco Santander</p>
                    <p className="text-cyan-400 font-bold mb-1">Dentro de Santander:</p>
                    <p className="text-white">Cuenta: <span className="text-yellow-400">1557530</span></p>
                    <p className="text-white">Sucursal: <span className="text-yellow-400">67 - Parque Batlle</span></p>
                    <p className="text-white">Moneda: <span className="text-yellow-400">UYU</span></p>
                  </div>
                  <div className="border-t border-gray-700/50 pt-4">
                    <p className="text-cyan-400 font-bold mb-1">Desde otros bancos:</p>
                    <p className="text-white">Cuenta: <span className="text-yellow-400">0067000001557530</span></p>
                    <p className="text-white">Moneda: <span className="text-yellow-400">UYU</span></p>
                  </div>
                </div>
              </div>

              <div className="group">
                <h3 className="text-xl font-orbitron font-bold text-red-400 mb-6 flex items-center gap-3">
                  <span className="text-2xl group-hover:rotate-12 transition-transform">💳</span> Pago Presencial
                </h3>
                <div className="bg-black/60 rounded-xl p-6 space-y-4 border border-red-400/20 group-hover:border-red-400/40 transition-colors">
                  <p className="font-rajdhani text-lg text-gray-300">
                    También puedes pagar con <span className="text-cyan-400 font-bold">débito o crédito</span> directamente en la barbería.
                  </p>
                  <div className="flex items-center gap-4 text-5xl justify-center py-4">
                    <span className="hover:scale-125 transition-transform cursor-default">💳</span>
                    <span className="hover:scale-125 transition-transform cursor-default">💈</span>
                  </div>
                </div>

                <div className="mt-6 bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4 group-hover:border-red-500 transition-colors">
                  <p className="text-red-400 font-rajdhani text-center font-semibold flex items-center justify-center gap-2">
                    <span className="animate-pulse">⚠️</span> No se reserva lugar sin el pago de la inscripción
                  </p>
                </div>
              </div>
            </div>

            {/* Botón Enviar Comprobante */}
            <div className="mt-10 text-center">
              <a
                href="https://wa.me/59898057705?text=Hola%21+Quiero+reservar+mi+lugar+para+el+torneo+de+FIFA.+Adjunto+el+comprobante+de+transferencia.+Mi+nombre+es%3A+"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sendMetaEvent('Purchase', { value: "1000.00", currency: "UYU" })}

                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-orbitron font-bold text-lg md:text-xl rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] animate-pulse"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                ENVIAR COMPROBANTE
              </a>
            </div>
          </GlassCard>

          {/* FAQ - Enhanced */}
          <GlassCard>
            <h3 className="text-xl md:text-2xl font-orbitron font-bold text-cyan-400 mb-8 text-center flex items-center justify-center gap-3">
              <span className="animate-float">❓</span> PREGUNTAS FRECUENTES
            </h3>
            <div className="space-y-6 font-rajdhani">
              {[
                { q: '¿Hay restricción de edad?', a: 'No, puede participar cualquier persona.' },
                { q: '¿Qué pasa si no se completan los 32 jugadores?', a: 'El torneo se juega con los participantes que haya.' },
                { q: '¿Tengo que traer mi control?', a: 'No es necesario, hay 2 controles disponibles.' },
                { q: '¿Tengo que ir todos los días?', a: 'No, solo debes asistir el día que te toque jugar.' },
              ].map((faq, i) => (
                <div key={i} className={`${i < 3 ? 'border-b border-gray-700/50 pb-6' : ''} group cursor-default`}>
                  <p className="text-cyan-400 font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">{faq.q}</p>
                  <p className="text-gray-300 group-hover:text-white transition-colors">{faq.a}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Location Section - Enhanced */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SectionTitle>📍 UBICACIÓN</SectionTitle>

          <GlassCard glowColor="red" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-cyan-500/5"></div>
            <div className="relative z-10">
              <div className="text-7xl md:text-8xl mb-8 animate-float">💈</div>
              <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">Rivera 3184 esq La Gaceta</h3>
              <p className="text-gray-400 font-rajdhani text-xl mb-8">Montevideo, Uruguay</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 rounded-xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors group">
                  <p className="text-cyan-400 font-orbitron mb-2 flex items-center justify-center gap-2">
                    <span className="group-hover:rotate-12 transition-transform">🕐</span> Duración del torneo
                  </p>
                  <p className="text-gray-300 font-rajdhani text-lg">2 semanas de competencia</p>
                </div>
                <div className="bg-black/40 rounded-xl p-6 border border-red-400/20 hover:border-red-400/40 transition-colors group">
                  <p className="text-red-400 font-orbitron mb-2 flex items-center justify-center gap-2">
                    <span className="group-hover:rotate-12 transition-transform">📅</span> Fecha límite inscripción
                  </p>
                  <p className="text-gray-300 font-rajdhani text-lg">1 de Marzo de 2025</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-red-500/20 blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-red-500/10 blur-2xl"></div>
            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer opacity-30"></div>
              <div className="relative z-10 py-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-4">
                  <span className="neon-text-white">¿LISTO PARA</span>
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-8">
                  <span className="neon-text-blue animate-neon-pulse">DEMOSTRAR TU NIVEL?</span>
                </h2>
                <p className="text-xl md:text-2xl font-rajdhani text-gray-300 mb-10">
                  Inscríbete ahora y compite por premios increíbles
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <NeonButton variant="blue" onClick={() => scrollToSection('inscripcion')}>
                    ¡QUIERO PARTICIPAR!
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="py-12 px-4 border-t border-gray-800/50 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="cyber-line w-16 md:w-24"></div>
            <span className="text-3xl flex gap-2">
              <span className="hover:scale-125 transition-transform cursor-default">🎮</span>
              <span className="hover:scale-125 transition-transform cursor-default">⚽</span>
              <span className="hover:scale-125 transition-transform cursor-default">💈</span>
            </span>
            <div className="cyber-line w-16 md:w-24"></div>
          </div>
          <p className="font-rajdhani text-gray-500 text-lg">
            Torneo FIFA PS5 - Barbería © 2025
          </p>
          <p className="font-rajdhani text-gray-600 text-sm mt-2">
            Rivera 3184 esq La Gaceta, Montevideo
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloating />
    </div>
  );
}
