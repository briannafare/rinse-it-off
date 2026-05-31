'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './training.css';
import {
  TRAINING_MODULES,
  RESOURCE_LINKS,
  ELEVATOR_SPEECH,
  QUICK_REFERENCE,
  type TrainingModule,
  type Lesson,
} from './data';

// ---- Icons ----
const Icons = {
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  arrowLeft: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  externalLink: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  mic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  video: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="m22 7-5 3.5L22 14z"/></svg>,
  headphones: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  award: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  mapPin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  reset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  sparkle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  notebook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  table: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>,
  checkSquare: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  books: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
};

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  notebook: { icon: Icons.notebook, label: 'NotebookLM', color: '#457BF1', bg: 'rgba(69,123,241,0.08)' },
  video:    { icon: Icons.video,    label: 'Video',      color: '#457BF1', bg: 'rgba(69,123,241,0.08)' },
  audio:    { icon: Icons.headphones, label: 'Audio',    color: '#d4508c', bg: 'rgba(244,111,168,0.08)' },
  pdf:      { icon: Icons.file,     label: 'PDF',        color: '#d86843', bg: 'rgba(255,138,107,0.08)' },
  doc:      { icon: Icons.file,     label: 'Document',   color: '#457BF1', bg: 'rgba(69,123,241,0.08)' },
  image:    { icon: Icons.image,    label: 'Visual',     color: '#2a9d5c', bg: 'rgba(77,255,166,0.08)' },
  spreadsheet: { icon: Icons.table, label: 'Reference',  color: '#2a9d5c', bg: 'rgba(77,255,166,0.08)' },
  reference: { icon: Icons.notebook, label: 'Guide',     color: '#98A2A8', bg: '#F2F2EE' },
  checklist: { icon: Icons.checkSquare, label: 'Checklist', color: '#2a9d5c', bg: 'rgba(77,255,166,0.08)' },
  practice:  { icon: Icons.mic,    label: 'Practice',   color: '#8E7BFF', bg: 'rgba(142,123,255,0.08)' },
  quiz:      { icon: Icons.sparkle, label: 'Quiz',       color: '#2a9d5c', bg: 'rgba(77,255,166,0.08)' },
};

function getDriveLink(lesson: Lesson): string | null {
  if (lesson.driveUrl) return lesson.driveUrl;
  if (lesson.driveId) {
    if (lesson.type === 'spreadsheet') return `https://docs.google.com/spreadsheets/d/${lesson.driveId}/edit`;
    if (lesson.type === 'doc')         return `https://docs.google.com/document/d/${lesson.driveId}/edit`;
    return `https://drive.google.com/file/d/${lesson.driveId}/view`;
  }
  return null;
}

// ---- Progress Ring ----
function ProgressRing({ size = 36, stroke = 3, progress = 0 }: { size?: number; stroke?: number; progress?: number }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring" aria-hidden="true">
      <circle className="progress-ring-bg" cx={size / 2} cy={size / 2} r={radius} />
      <circle className="progress-ring-fill" cx={size / 2} cy={size / 2} r={radius}
        strokeDasharray={circ} strokeDashoffset={offset} />
    </svg>
  );
}

// ---- Sidebar ----
function Sidebar({
  activeView, onNavigate, completedLessons, modules, onQuickRef, sidebarOpen, onCloseSidebar,
}: {
  activeView: string;
  onNavigate: (view: string) => void;
  completedLessons: Set<string>;
  modules: TrainingModule[];
  onQuickRef: () => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getModuleProgress = (mod: TrainingModule) => {
    const done = mod.lessons.filter(l => completedLessons.has(l.id)).length;
    return mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0;
  };

  const weeks: Record<string, TrainingModule[]> = {};
  modules.forEach(m => {
    if (!weeks[m.week]) weeks[m.week] = [];
    weeks[m.week].push(m);
  });

  const nav = (view: string) => { onNavigate(view); onCloseSidebar(); };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <img src="/logo-dark.png" alt="Rinse It Off" />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-label">Overview</div>
        <div className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => nav('dashboard')}>
          <span className="nav-icon">{Icons.dashboard}</span>
          <span>Dashboard</span>
        </div>

        {Object.entries(weeks).map(([week, mods]) => (
          <div key={week}>
            <div className="sidebar-label">{week}</div>
            {mods.map((mod) => {
              const prog = getModuleProgress(mod);
              const isComplete = prog === 100;
              return (
                <div
                  key={mod.id}
                  className={`nav-item ${activeView === mod.id ? 'active' : ''} ${isComplete ? 'completed' : ''}`}
                  onClick={() => nav(mod.id)}
                  title={mod.title}
                >
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 500, opacity: 0.5, width: 18, textAlign: 'center', flexShrink: 0 }}>{mod.number}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.title}</span>
                  <span className="nav-badge">{prog}%</span>
                </div>
              );
            })}
          </div>
        ))}

        <div className="sidebar-label">Resources</div>
        <div className={`nav-item ${activeView === 'elevator-speech' ? 'active' : ''}`} onClick={() => nav('elevator-speech')}>
          <span className="nav-icon">{Icons.mic}</span>
          <span>Elevator Speech</span>
        </div>
        <div className={`nav-item ${activeView === 'resources' ? 'active' : ''}`} onClick={() => nav('resources')}>
          <span className="nav-icon">{Icons.books}</span>
          <span>Resource Library</span>
        </div>
        <div className="nav-item" onClick={() => { onQuickRef(); onCloseSidebar(); }}>
          <span className="nav-icon">{Icons.search}</span>
          <span>Quick Reference</span>
        </div>
      </nav>

      <div className="sidebar-progress">
        <div className="progress-text">
          <span>Overall progress</span>
          <span className="progress-pct">{overallProgress}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
          {completedCount} of {totalLessons} items complete
        </div>
      </div>
    </aside>
  );
}

// ---- Dashboard Home ----
function DashboardView({ modules, completedLessons, onNavigate }: {
  modules: TrainingModule[];
  completedLessons: Set<string>;
  onNavigate: (view: string) => void;
}) {
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const completedModules = modules.filter(m => m.lessons.every(l => completedLessons.has(l.id))).length;

  let nextLesson: Lesson | null = null;
  let nextModule: TrainingModule | null = null;
  for (const mod of modules) {
    for (const les of mod.lessons) {
      if (!completedLessons.has(les.id)) { nextLesson = les; nextModule = mod; break; }
    }
    if (nextLesson) break;
  }

  return (
    <div>
      <div className="welcome-banner">
        <div className="page-eyebrow">New Hire Training Portal</div>
        <h1 className="welcome-title">Welcome to <span className="accent-word">Rinse It Off</span></h1>
        <p className="welcome-sub">Complete each module at your own pace. 8 modules across 3 weeks — your reference for every assessment, call, and proposal.</p>
        <div className="welcome-actions">
          {nextLesson && nextModule && (
            <button className="timer-btn primary" onClick={() => onNavigate(nextModule!.id)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Continue training <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.arrowRight}</span>
            </button>
          )}
          <button className="timer-btn secondary" onClick={() => onNavigate('elevator-speech')}>
            Practice elevator speech
          </button>
        </div>
      </div>

      <div className="dash-grid">
        <div className="stat-card aura-tide">
          <div className="stat-card-label">Overall progress</div>
          <div className="stat-card-value">{pct}<span className="unit">%</span></div>
          <div className="progress-bar-bg" style={{ marginTop: 12 }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="stat-card aura-sunrise">
          <div className="stat-card-label">Modules</div>
          <div className="stat-card-value">{completedModules}<span className="unit">of {modules.length}</span></div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>{completedCount} of {totalLessons} total items</div>
        </div>
      </div>

      {nextLesson && nextModule && (
        <div>
          <div className="section-label">Continue where you left off</div>
          <div className="module-card" onClick={() => onNavigate(nextModule!.id)} style={{ marginBottom: 24 }}>
            <div className="module-card-icon" style={{ background: nextModule.iconBg }}>
              <img src={nextModule.icon} alt="" style={{ filter: 'brightness(0) saturate(100%)' }} />
            </div>
            <div className="module-card-info">
              <div className="module-card-name">{nextLesson.title}</div>
              <div className="module-card-desc">Module {nextModule.number}: {nextModule.title} · {nextLesson.duration}</div>
            </div>
            <span className="module-card-arrow" style={{ width: 18, height: 18 }}>{Icons.arrowRight}</span>
          </div>
        </div>
      )}

      <div className="section-label">Training Modules</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {modules.map((mod) => {
          const done = mod.lessons.filter(l => completedLessons.has(l.id)).length;
          const prog = Math.round((done / mod.lessons.length) * 100);
          return (
            <div key={mod.id} className="module-card" onClick={() => onNavigate(mod.id)}>
              <div className="module-card-icon" style={{ background: mod.iconBg }}>
                <img src={mod.icon} alt="" style={{ filter: 'brightness(0) saturate(100%)' }} />
              </div>
              <div className="module-card-info">
                <div className="module-card-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 500, color: 'var(--ink-3)' }}>{mod.number}</span>
                  {mod.title}
                </div>
                <div className="module-card-desc">{mod.week} · {mod.subtitle} · {mod.lessons.length} items</div>
              </div>
              <ProgressRing size={32} progress={prog} />
              <span className="module-card-arrow" style={{ width: 16, height: 16 }}>{Icons.arrowRight}</span>
            </div>
          );
        })}
      </div>

      <div className="section-label" style={{ marginTop: 36 }}>Key Facts</div>
      <div className="facts-grid">
        <div className="fact-card">
          <div className="fact-card-label">Core Differentiator</div>
          <div className="fact-card-value" style={{ fontSize: 14, lineHeight: 1.4 }}>Method-matching: right pressure, temp, chemistry for every surface</div>
        </div>
        <div className="fact-card">
          <div className="fact-card-label">Brand Voice</div>
          <div className="fact-card-value" style={{ fontSize: 14, lineHeight: 1.4 }}>Professional. Direct. No-fluff.</div>
        </div>
        <div className="fact-card">
          <div className="fact-card-label">Service Area</div>
          <div className="fact-card-value" style={{ fontSize: 14 }}>Portland Metro + Willamette Valley</div>
        </div>
        <div className="fact-card">
          <div className="fact-card-label">Phone</div>
          <div className="fact-card-value" style={{ fontSize: 14 }}>(503) 704-3755</div>
        </div>
      </div>
    </div>
  );
}

// ---- Module Detail View ----
function ModuleView({ module, completedLessons, onToggleLesson, onBack }: {
  module: TrainingModule;
  completedLessons: Set<string>;
  onToggleLesson: (id: string) => void;
  onBack: () => void;
}) {
  const done = module.lessons.filter(l => completedLessons.has(l.id)).length;
  const prog = Math.round((done / module.lessons.length) * 100);
  const allDone = done === module.lessons.length;

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.arrowLeft}</span> Back to dashboard
      </button>
      <div className="page-header">
        <div className="page-eyebrow">{module.week} · Module {module.number}</div>
        <h1 className="page-title">{module.title}</h1>
        <p className="page-subtitle">{module.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
          <div className="progress-bar-bg" style={{ flex: 1, maxWidth: 240 }}>
            <div className="progress-bar-fill" style={{ width: `${prog}%` }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>{done}/{module.lessons.length} complete</span>
        </div>
        {allDone && (
          <div className="completion-banner">
            <span style={{ width: 22, height: 22, display: 'flex' }}>{Icons.award}</span>
            <span>Module complete — great work!</span>
          </div>
        )}
        {module.notebookUrl && (
          <a href={module.notebookUrl} target="_blank" rel="noopener noreferrer" className="timer-btn secondary"
            style={{ marginTop: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.notebook}</span>
            Open in NotebookLM
            <span style={{ width: 14, height: 14, display: 'inline-flex', opacity: 0.5 }}>{Icons.externalLink}</span>
          </a>
        )}
      </div>

      <div className="section-label">Lessons & Resources</div>
      <div className="lesson-list">
        {module.lessons.map((les) => {
          const isChecked = completedLessons.has(les.id);
          const tc = typeConfig[les.type] || typeConfig.reference;
          const link = getDriveLink(les);
          return (
            <div key={les.id} className={`lesson-item ${isChecked ? 'checked-item' : ''}`}>
              <div
                className={`check-circle ${isChecked ? 'checked' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleLesson(les.id); }}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggleLesson(les.id); } }}
              >
                {Icons.check}
              </div>
              <div className="lesson-info"
                style={{ cursor: link ? 'pointer' : 'default' }}
                onClick={() => { if (link) window.open(link, '_blank'); }}>
                <div className="lesson-title">{les.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{les.description}</div>
                <div className="lesson-meta" style={{ marginTop: 6 }}>
                  <span className="lesson-tag" style={{ background: tc.bg, color: tc.color }}>
                    <span style={{ width: 11, height: 11, display: 'inline-flex' }}>{tc.icon}</span>
                    {tc.label}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{Icons.clock}</span>
                    {les.duration}
                  </span>
                  {link && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--electric)', fontSize: 12, fontWeight: 500 }}>
                      Open <span style={{ width: 11, height: 11, display: 'inline-flex' }}>{Icons.externalLink}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Elevator Speech View ----
function ElevatorSpeechView({ onBack }: { onBack: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isOver = seconds > 30;

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.arrowLeft}</span> Back to dashboard
      </button>
      <div className="page-header">
        <div className="page-eyebrow">Practice Mode</div>
        <h1 className="page-title">The 30-Second <span className="accent-word">Elevator Speech</span></h1>
        <p className="page-subtitle">{ELEVATOR_SPEECH.subtitle}</p>
      </div>

      <div className="speech-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--ink-3)' }}>
          <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.mic}</span>
          THE SCRIPT
        </div>
        <div className="speech-script">{ELEVATOR_SPEECH.script}</div>
        <div className="speech-timer">
          <div className="timer-display" style={{ color: isOver ? '#d86843' : 'var(--ink)' }}>{formatTime(seconds)}</div>
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            <button className={`timer-btn ${running ? 'secondary' : 'primary'}`} onClick={() => setRunning(!running)}>
              {running ? 'Pause' : (seconds > 0 ? 'Resume' : 'Start Timer')}
            </button>
            {seconds > 0 && (
              <button className="timer-btn secondary" onClick={() => { setRunning(false); setSeconds(0); }}>
                <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.reset}</span> Reset
              </button>
            )}
          </div>
        </div>
        {isOver && <div style={{ marginTop: 14, fontSize: 13, color: '#d86843', fontWeight: 500 }}>Over 30 seconds — tighten it up!</div>}
      </div>

      <div className="section-label" style={{ marginTop: 36 }}>Tips for delivery</div>
      <div className="lesson-list">
        {ELEVATOR_SPEECH.tips.map((tip, i) => (
          <div key={i} className="lesson-item" style={{ cursor: 'default' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div className="lesson-info"><div className="lesson-title">{tip}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Resource Library View ----
function ResourceLibraryView({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{Icons.arrowLeft}</span> Back to dashboard
      </button>
      <div className="page-header">
        <div className="page-eyebrow">Reference Materials</div>
        <h1 className="page-title">Resource <span className="accent-word">Library</span></h1>
        <p className="page-subtitle">Field guides, equipment specs, competitive intel, and reference materials. Bookmark what you use most.</p>
      </div>

      <div className="section-label">Master Knowledge Base</div>
      <a href="https://notebooklm.google.com/notebook/1f6cfdc0-3a1a-45d6-9e05-48e32c8a7265" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <div className="module-card" style={{ borderColor: 'rgba(69,123,241,0.2)', background: 'rgba(69,123,241,0.02)' }}>
          <div className="module-card-icon" style={{ background: 'rgba(69,123,241,0.08)' }}>
            <span style={{ width: 24, height: 24, display: 'flex', color: '#457BF1' }}>{Icons.sparkle}</span>
          </div>
          <div className="module-card-info">
            <div className="module-card-name">RIO Master Knowledge Base</div>
            <div className="module-card-desc">Ask any question about RIO — AI-powered reference in NotebookLM</div>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: 'var(--electric)' }}>
            Open <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{Icons.externalLink}</span>
          </span>
        </div>
      </a>

      <div className="section-label">Field Guides & Documents</div>
      <div className="lesson-list">
        {RESOURCE_LINKS.filter(r => r.id !== 'master-kb').map((res) => {
          const url = res.url || (res.driveId ? `https://drive.google.com/file/d/${res.driveId}/view` : null);
          return (
            <div key={res.id} className="lesson-item" style={{ cursor: url ? 'pointer' : 'default' }}
              onClick={() => { if (url) window.open(url, '_blank'); }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ width: 18, height: 18, display: 'flex', color: 'var(--ink-3)' }}>{Icons.file}</span>
              </div>
              <div className="lesson-info">
                <div className="lesson-title">{res.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{res.description}</div>
              </div>
              {url && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--electric)', flexShrink: 0 }}>
                  Open <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{Icons.externalLink}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="section-label" style={{ marginTop: 32 }}>All NotebookLM Modules</div>
      <div className="lesson-list">
        {TRAINING_MODULES.map((mod) => (
          <a key={mod.id} href={mod.notebookUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="lesson-item">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: mod.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={mod.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain', filter: 'brightness(0) saturate(100%)' }} />
              </div>
              <div className="lesson-info">
                <div className="lesson-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>{mod.number}</span>
                  {mod.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{mod.subtitle}</div>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--electric)', flexShrink: 0 }}>
                NotebookLM <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{Icons.externalLink}</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ---- Quick Reference Panel ----
function QuickReferencePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`qr-overlay ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <div className={`qr-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Quick Reference" aria-modal="true">
        <div className="qr-header">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 500, fontSize: 16 }}>Quick Reference</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            {Icons.x}
          </button>
        </div>

        <div className="qr-section">
          <div className="qr-section-title">Company</div>
          <div className="qr-item"><span style={{ width: 16, height: 16, display: 'inline-flex', flexShrink: 0 }}>{Icons.phone}</span><strong>{QUICK_REFERENCE.company.phone}</strong></div>
          <div className="qr-item"><span style={{ width: 16, height: 16, display: 'inline-flex', flexShrink: 0 }}>{Icons.mail}</span><strong>{QUICK_REFERENCE.company.email}</strong></div>
          <div className="qr-item"><span style={{ width: 16, height: 16, display: 'inline-flex', flexShrink: 0 }}>{Icons.mapPin}</span>{QUICK_REFERENCE.company.location}</div>
          <div className="qr-item" style={{ marginTop: 8, fontStyle: 'italic', fontSize: 13 }}>"{QUICK_REFERENCE.company.tagline}"</div>
        </div>

        <div className="qr-section">
          <div className="qr-section-title">Equipment Quick Specs</div>
          {QUICK_REFERENCE.keyFacts.map((f, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: i < QUICK_REFERENCE.keyFacts.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{f.label}</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 2, fontWeight: 450 }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div className="qr-section">
          <div className="qr-section-title">Service Area</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_REFERENCE.serviceArea.map(area => (
              <span key={area} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: 'var(--paper-2)', color: 'var(--ink-2)', fontWeight: 450 }}>{area}</span>
            ))}
          </div>
        </div>

        <div className="qr-section">
          <div className="qr-section-title">Services</div>
          {QUICK_REFERENCE.services.map((svc, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: i < QUICK_REFERENCE.services.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{svc.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{svc.desc}</div>
            </div>
          ))}
        </div>

        <div className="qr-section">
          <div className="qr-section-title">Brand Voice</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 500, fontSize: 16, color: 'var(--ink)', marginBottom: 8 }}>{QUICK_REFERENCE.brandVoice.tone}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 12 }}>{QUICK_REFERENCE.brandVoice.description}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {QUICK_REFERENCE.brandVoice.donts.map((d, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#d86843', fontWeight: 600, flexShrink: 0 }}>✕</span>{d}
              </div>
            ))}
          </div>
        </div>

        <div className="qr-section" style={{ borderBottom: 'none' }}>
          <a href="https://rinseitoff.com" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--electric)', textDecoration: 'none', padding: '6px 0' }}>
            rinseitoff.com <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{Icons.externalLink}</span>
          </a>
        </div>
      </div>
    </>
  );
}

// ---- Main App ----
export default function TrainingPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [qrOpen, setQrOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const savedView = localStorage.getItem('rio-active-view');
    if (savedView) setActiveView(savedView);
    try {
      const saved = localStorage.getItem('rio-completed-lessons');
      if (saved) setCompletedLessons(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('rio-active-view', activeView);
  }, [activeView, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('rio-completed-lessons', JSON.stringify([...completedLessons]));
  }, [completedLessons, hydrated]);

  const navigate = useCallback((view: string) => {
    setActiveView(view);
    const mainEl = document.querySelector('.main-content');
    if (mainEl) mainEl.scrollTop = 0;
  }, []);

  const toggleLesson = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  }, []);

  const activeModule = TRAINING_MODULES.find(m => m.id === activeView);

  const renderView = () => {
    if (activeView === 'dashboard') return <DashboardView modules={TRAINING_MODULES} completedLessons={completedLessons} onNavigate={navigate} />;
    if (activeView === 'elevator-speech') return <ElevatorSpeechView onBack={() => navigate('dashboard')} />;
    if (activeView === 'resources') return <ResourceLibraryView onBack={() => navigate('dashboard')} />;
    if (activeModule) return <ModuleView module={activeModule} completedLessons={completedLessons} onToggleLesson={toggleLesson} onBack={() => navigate('dashboard')} />;
    return <DashboardView modules={TRAINING_MODULES} completedLessons={completedLessons} onNavigate={navigate} />;
  };

  return (
    <div className="training-root">
      <div className="app-shell">
        <Sidebar
          activeView={activeView}
          onNavigate={navigate}
          completedLessons={completedLessons}
          modules={TRAINING_MODULES}
          onQuickRef={() => setQrOpen(true)}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
        <div className="main-content">
          <div className="mobile-header">
            <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open menu">
              {Icons.menu}
            </button>
            <img src="/logo-dark.png" alt="Rinse It Off" style={{ height: 22 }} />
            <div style={{ marginLeft: 'auto' }}>
              <button className="icon-btn" onClick={() => setQrOpen(true)} aria-label="Quick reference">
                {Icons.search}
              </button>
            </div>
          </div>
          <div className="main-inner">
            {renderView()}
          </div>
        </div>
        <QuickReferencePanel open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>
    </div>
  );
}
