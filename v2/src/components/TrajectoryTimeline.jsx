import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, GraduationCap, Heart } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { supabase } from '../supabase';

const PULSE_STYLE = `
  @keyframes tl-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.55); }
    50% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
  }
`;

function TypeIcon({ type, size = 15 }) {
  if (type === 'work') return <Briefcase size={size} />;
  if (type === 'study') return <GraduationCap size={size} />;
  return <Heart size={size} />;
}

function TiltCard({ children, disabled = false }) {
  const elRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function onMove(e) {
    if (disabled || !elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: -(py - 0.5) * 14, y: (px - 0.5) * 14 });
  }

  function onLeave() {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }

  return (
    <div
      ref={elRef}
      onMouseMove={onMove}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={onLeave}
      style={{ perspective: 900, transformStyle: 'preserve-3d' }}
    >
      <div
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 transition-colors duration-300 hover:bg-white/10 hover:border-white/20"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          transition: 'transform 0.12s ease, background 0.3s ease, border-color 0.3s ease',
          willChange: 'transform',
          boxShadow: hovered ? '0 8px 32px rgba(99,102,241,0.15)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TrajectoryItem({ item, idx, isLast, language }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const isLeft = idx % 2 === 0;

  const role = language === 'pt-BR' ? item.role_pt : item.role_en;
  const company = language === 'pt-BR' ? item.company_pt : item.company_en;
  const description = language === 'pt-BR' ? item.description_pt : item.description_en;
  const currentLabel = language === 'pt-BR' ? 'Atual' : 'Present';

  const typeLabel = {
    work: language === 'pt-BR' ? 'Trabalho' : 'Work',
    study: language === 'pt-BR' ? 'Estudo' : 'Study',
    volunteering: language === 'pt-BR' ? 'Voluntariado' : 'Volunteering',
  }[item.type] || item.type;

  function formatDate(str) {
    if (!str) return '';
    const [month, year] = str.split('/');
    const d = new Date(parseInt(year), parseInt(month) - 1);
    const locale = language === 'pt-BR' ? 'pt-BR' : 'en-US';
    const f = d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    return f.charAt(0).toUpperCase() + f.slice(1);
  }

  const cardContent = (
    <>
      <h3 className="text-base font-bold text-white leading-tight">{role}</h3>
      {company && (
        <p className="text-sm text-gray-300 mt-0.5">{company}</p>
      )}
      <p className="text-xs text-gray-500 italic mt-1">
        {formatDate(item.start_date)}{item.start_date ? ' — ' : ''}{item.end_date ? formatDate(item.end_date) : currentLabel}
      </p>
      {description && (
        <p className="text-sm text-gray-300 mt-2 leading-relaxed">{description}</p>
      )}
      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
        <TypeIcon type={item.type} size={11} />
        {typeLabel}
      </div>
    </>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-stretch"
    >
      {/* Desktop: left content or empty */}
      <div className="hidden md:block flex-1 pr-8 pb-10">
        {isLeft && <TiltCard>{cardContent}</TiltCard>}
      </div>

      {/* Separator */}
      <div className="flex flex-col items-center shrink-0 z-10">
        <div
          className="w-10 h-10 rounded-full bg-[#030014] border-2 border-primary flex items-center justify-center text-white shrink-0"
          style={{ animation: 'tl-pulse 2.4s ease-out infinite' }}
        >
          <TypeIcon type={item.type} />
        </div>
        {!isLast && (
          <div
            className="w-0.5 flex-1 origin-top"
            style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              transform: inView ? 'scaleY(1)' : 'scaleY(0)',
              transition: `transform 600ms ease-out ${idx * 0.12 + 0.2}s`,
            }}
          />
        )}
      </div>

      {/* Desktop: right content or empty */}
      <div className="hidden md:block flex-1 pl-8 pb-10">
        {!isLeft && <TiltCard>{cardContent}</TiltCard>}
      </div>

      {/* Mobile: always right of dot */}
      <div className="md:hidden flex-1 pl-5 pb-8">
        <TiltCard disabled>{cardContent}</TiltCard>
      </div>
    </motion.div>
  );
}

export default function TrajectoryTimeline() {
  const { language } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('trajectory')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        const list = data || [];
        setItems(list);
        localStorage.setItem('trajectory', JSON.stringify(list));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-4 space-y-0">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-stretch">
            <div className="hidden md:block flex-1 pr-8 pb-10">
              {i % 2 === 0 && <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />}
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse shrink-0" />
              {i < 2 && <div className="w-0.5 flex-1 min-h-16 bg-white/10" />}
            </div>
            <div className="hidden md:block flex-1 pl-8 pb-10">
              {i % 2 !== 0 && <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />}
            </div>
            <div className="md:hidden flex-1 pl-5 pb-8">
              <div className="h-28 rounded-2xl bg-white/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 text-sm">
        {language === 'pt-BR' ? 'Nenhum marco adicionado ainda.' : 'No milestones added yet.'}
      </div>
    );
  }

  return (
    <div className="relative py-4">
      <style>{PULSE_STYLE}</style>
      {items.map((item, idx) => (
        <TrajectoryItem
          key={item.id}
          item={item}
          idx={idx}
          isLast={idx === items.length - 1}
          language={language}
        />
      ))}
    </div>
  );
}
