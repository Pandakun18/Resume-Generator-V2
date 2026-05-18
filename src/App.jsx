import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Download, FileText, Loader2, Plus, X, ChevronDown, ChevronUp,
  Edit3, RotateCcw, Check, Lock, Camera, User
} from 'lucide-react';

/* ============================================================
   DATA MODEL
   ============================================================ */

const EMPTY_RESUME = {
  name: "",
  photo: null, // base64 data URL
  contact: { phone: "", email: "", location: "", linkedin: "", website: "" },
  summary: { tagline: "", bullets: [], skills: [] },
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  awards: [],
};

const SAMPLE_RESUME = {
  name: "Jordan Ellis",
  photo: null,
  contact: {
    phone: "+1 (415) 882-4410",
    email: "jordan.ellis@email.com",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/jordanellis",
    website: "jordanellis.design",
  },
  summary: {
    tagline: "Senior Product Designer with 9 years crafting intuitive digital experiences.",
    bullets: [
      "Led end-to-end design for products used by 4M+ users across mobile and web platforms.",
      "Scaled design systems from 0 to 1 at two early-stage startups, reducing design-to-dev handoff time by 40%.",
      "Deep collaborator with engineering and product — comfortable in high-velocity agile environments.",
    ],
    skills: [
      "Figma", "Prototyping", "User Research", "Design Systems",
      "Interaction Design", "Usability Testing", "Accessibility", "React (basic)",
    ],
  },
  experience: [
    {
      title: "Senior Product Designer",
      company: "Lattice",
      location: "San Francisco, CA",
      start: "Mar 2021",
      end: "Present",
      summary: "Leading product design for the core HR platform across performance, engagement, and compensation modules.",
      bullets: [
        "Redesigned the performance review flow, reducing completion time by 28% and increasing manager satisfaction scores from 62 to 81.",
        "Established a company-wide Figma design system adopted by all 11 product teams.",
        "Mentored 3 mid-level designers and ran weekly design critique sessions across the org.",
      ],
    },
    {
      title: "Product Designer",
      company: "Notion",
      location: "San Francisco, CA",
      start: "Jun 2018",
      end: "Feb 2021",
      summary: "Contributed to the core editor and templates experience during a period of rapid 10× user growth.",
      bullets: [
        "Designed the Notion template gallery — now the #1 onboarding path for new users.",
        "Led accessibility audit and remediation, bringing WCAG AA compliance to 94% of core surfaces.",
        "Improved activation rate by 19% through a redesigned onboarding funnel.",
      ],
    },
    {
      title: "UX Designer",
      company: "IDEO",
      location: "San Francisco, CA",
      start: "Aug 2015",
      end: "May 2018",
      summary: "Human-centred design projects for clients in healthcare, fintech, and consumer technology.",
      bullets: [
        "Facilitated 30+ discovery workshops and design sprints for Fortune 500 clients.",
        "Delivered end-to-end design for a telehealth platform used by 180,000 patients.",
      ],
    },
  ],
  education: [
    {
      degree: "B.F.A. Interaction Design",
      school: "California College of the Arts",
      location: "San Francisco, CA",
      date: "2015",
      honors: "Graduated with Distinction · Senior thesis awarded Best in Show",
    },
  ],
  certifications: [
    { name: "Google UX Design Professional Certificate", org: "Google / Coursera", date: "2022" },
    { name: "CPACC — Certified Professional in Accessibility Core Competencies", org: "IAAP", date: "2021" },
  ],
  projects: [
    {
      name: "Pebble Icons — Open-Source Icon Library",
      description: "A free, MIT-licensed icon set with 1,200+ icons optimised for product UI. Used by teams at Vercel, Linear, and Loom.",
      bullets: [
        "Built the full design pipeline in Figma with automated SVG exports via a custom Node.js script.",
        "Reached 8,400 GitHub stars within 6 months of launch.",
      ],
    },
  ],
  awards: [
    "Webby Award — Best UX, Mobile Apps (2023)",
    "Fast Company Innovation By Design Finalist — Digital Design (2022)",
    "Dribbble Top Shot of the Year — Product Design (2020)",
  ],
};


/* ============================================================
   FONT STACKS
   ============================================================ */

const INTER      = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';
const OUTFIT     = '"Outfit", "Inter", "Helvetica Neue", Arial, sans-serif';
const DM_SANS    = '"DM Sans", "Inter", "Helvetica Neue", Arial, sans-serif';
const PLUS_JAKARTA = '"Plus Jakarta Sans", "Inter", Arial, sans-serif';
const SORA       = '"Sora", "Inter", Arial, sans-serif';
const FRAUNCES   = '"Fraunces", Georgia, "Times New Roman", serif';
const LIBRE_B    = '"Libre Baskerville", Georgia, Cambria, serif';
const PLAYFAIR   = '"Playfair Display", Georgia, "Times New Roman", serif';
const MONO_FACE  = '"JetBrains Mono", "IBM Plex Mono", Menlo, Consolas, monospace';

/* ============================================================
   12 COMPLETELY REDESIGNED MODERN TEMPLATES
   ============================================================ */

const TEMPLATES = {

  /* ─── 1. CORPORATE ─── */
  'corporate-boardroom': {
    label: 'Apex',
    blurb: 'Dark header band with photo, geometric accent bar.',
    category: 'corporate',
    accent: '#0F2744',
    nameFont: OUTFIT,
    bodyFont: INTER,
    layout: 'dark-header',
    photoShape: 'circle',
    sectionDeco: 'left-bar',
  },
  'corporate-partner': {
    label: 'Meridian',
    blurb: 'Split header: photo left, name + contact right.',
    category: 'corporate',
    accent: '#1B3A5C',
    nameFont: PLUS_JAKARTA,
    bodyFont: PLUS_JAKARTA,
    layout: 'split-header',
    photoShape: 'rounded-square',
    sectionDeco: 'dot-line',
  },

  /* ─── 2. TECH ─── */
  'tech-builder': {
    label: 'Stack',
    blurb: 'Monospace accents, skill chips, left accent strip.',
    category: 'tech',
    accent: '#0D47A1',
    nameFont: SORA,
    bodyFont: INTER,
    layout: 'accent-strip',
    photoShape: 'hexagon',
    sectionDeco: 'mono-label',
  },
  'tech-architect': {
    label: 'Blueprint',
    blurb: 'Dark sidebar with photo, grid-inspired layout.',
    category: 'tech',
    accent: '#162032',
    nameFont: SORA,
    bodyFont: INTER,
    layout: 'dark-sidebar',
    photoShape: 'circle',
    sectionDeco: 'bracket',
  },

  /* ─── 3. CREATIVE ─── */
  'creative-editorial': {
    label: 'Verso',
    blurb: 'Editorial asymmetry with oversized name, photo inline.',
    category: 'creative',
    accent: '#B84A2A',
    accent2: '#2A5C4E',
    nameFont: FRAUNCES,
    bodyFont: DM_SANS,
    layout: 'editorial',
    photoShape: 'organic',
    sectionDeco: 'italic-rule',
  },
  'creative-studio': {
    label: 'Canvas',
    blurb: 'Full color sidebar with photo, bold typographic header.',
    category: 'creative',
    accent: '#5C1F6B',
    nameFont: PLAYFAIR,
    bodyFont: DM_SANS,
    layout: 'color-sidebar',
    photoShape: 'circle',
    sectionDeco: 'soft-band',
  },

  /* ─── 4. HEALTHCARE ─── */
  'healthcare-practitioner': {
    label: 'Clarity',
    blurb: 'Clean two-tone header, photo in accent circle.',
    category: 'healthcare',
    accent: '#0E6B5E',
    nameFont: PLUS_JAKARTA,
    bodyFont: PLUS_JAKARTA,
    layout: 'two-tone-header',
    photoShape: 'circle',
    sectionDeco: 'teal-rule',
  },
  'healthcare-educator': {
    label: 'Align',
    blurb: 'Structured columns, credential-forward layout.',
    category: 'healthcare',
    accent: '#1B5E6B',
    nameFont: DM_SANS,
    bodyFont: DM_SANS,
    layout: 'structured-cols',
    photoShape: 'rounded-square',
    sectionDeco: 'pill-header',
  },

  /* ─── 5. ACADEMIC ─── */
  'academic-scholar': {
    label: 'Folio',
    blurb: 'Classical serif with modern proportions and photo.',
    category: 'academic',
    accent: '#6B1F35',
    nameFont: FRAUNCES,
    bodyFont: LIBRE_B,
    layout: 'folio',
    photoShape: 'circle',
    sectionDeco: 'serif-rule',
  },
  'academic-researcher': {
    label: 'Thesis',
    blurb: 'Dense CV layout, accent left-column, publication-ready.',
    category: 'academic',
    accent: '#2C3E6B',
    nameFont: LIBRE_B,
    bodyFont: LIBRE_B,
    layout: 'cv-dense',
    photoShape: 'rounded-square',
    sectionDeco: 'rule-number',
  },

  /* ─── 6. TRADES ─── */
  'trades-operator': {
    label: 'Forge',
    blurb: 'High-contrast dark header, bold type, certification badges.',
    category: 'trades',
    accent: '#1A1A1A',
    accent2: '#E05C20',
    nameFont: OUTFIT,
    bodyFont: OUTFIT,
    layout: 'dark-header',
    photoShape: 'rounded-square',
    sectionDeco: 'orange-bar',
    boldHeader: true,
  },
  'trades-foreman': {
    label: 'Ironclad',
    blurb: 'Diagonal accent band header, rugged sans-serif.',
    category: 'trades',
    accent: '#2B2B2B',
    accent2: '#D4500F',
    nameFont: OUTFIT,
    bodyFont: INTER,
    layout: 'diagonal-band',
    photoShape: 'circle',
    sectionDeco: 'thick-rule',
  },

  /* ─── 7. MODERN ─── */
  'modern-sidebar': {
    label: 'The Sidebar',
    blurb: 'Two-column: accent sidebar with contact/skills, content on right.',
    category: 'modern',
    accent: '#1A3A4A',
    nameFont: INTER,
    bodyFont: INTER,
    layout: 'sidebar-classic',
    photoShape: 'circle',
    sectionDeco: 'sidebar-rule',
    twoColumn: true,
  },
  'modern-director': {
    label: 'The Director',
    blurb: 'Full-width color header band, bold name on accent background.',
    category: 'modern',
    accent: '#1A3A4A',
    nameFont: INTER,
    bodyFont: INTER,
    layout: 'header-band',
    photoShape: 'circle',
    sectionDeco: 'small-caps-rule',
    headerBand: true,
  },
};

const CATEGORIES = [
  { id: 'corporate',  label: 'Corporate',     variants: ['corporate-boardroom', 'corporate-partner'] },
  { id: 'tech',       label: 'Tech',          variants: ['tech-builder', 'tech-architect'] },
  { id: 'creative',   label: 'Creative',      variants: ['creative-editorial', 'creative-studio'] },
  { id: 'healthcare', label: 'Health / Edu',  variants: ['healthcare-practitioner', 'healthcare-educator'] },
  { id: 'academic',   label: 'Academic',      variants: ['academic-scholar', 'academic-researcher'] },
  { id: 'trades',     label: 'Trades',        variants: ['trades-operator', 'trades-foreman'] },
  { id: 'modern',     label: 'Modern',        variants: ['modern-sidebar', 'modern-director'] },
];

const ACCENT_PRESETS = [
  { name: 'Navy',     value: '#0F2744' },
  { name: 'Cobalt',   value: '#0D47A1' },
  { name: 'Teal',     value: '#0E6B5E' },
  { name: 'Forest',   value: '#1A4731' },
  { name: 'Burgundy', value: '#6B1F35' },
  { name: 'Plum',     value: '#5C1F6B' },
  { name: 'Clay',     value: '#B84A2A' },
  { name: 'Slate',    value: '#2C3E6B' },
  { name: 'Charcoal', value: '#2B2B2B' },
  { name: 'Obsidian', value: '#1A1A1A' },
];

/* ============================================================
   UTILITIES
   ============================================================ */

function hexToRgba(hex, alpha) {
  const h = (hex || '#000000').replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex, pct) {
  const h = (hex || '#000000').replace('#', '');
  const r = Math.min(255, parseInt(h.slice(0,2),16) + Math.round(255 * pct));
  const g = Math.min(255, parseInt(h.slice(2,4),16) + Math.round(255 * pct));
  const b = Math.min(255, parseInt(h.slice(4,6),16) + Math.round(255 * pct));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

/* ============================================================
   PHOTO COMPONENT — renders differently per shape
   ============================================================ */

function ResumePhoto({ src, shape, size = '1in', border, bgColor }) {
  const dim = { width: size, height: size, flexShrink: 0 };

  if (!src) {
    return (
      <div style={{
        ...dim,
        borderRadius: shape === 'circle' ? '50%' : shape === 'rounded-square' ? '0.1in' : '0',
        background: border ? hexToRgba(border, 0.2) : '#ddd',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: border ? `2px solid ${hexToRgba(border, 0.3)}` : 'none',
      }}>
        <div style={{ color: border || '#aaa', opacity: 0.5, fontSize: '0.3in' }}>✦</div>
      </div>
    );
  }

  if (shape === 'circle') {
    return (
      <div style={{
        ...dim,
        borderRadius: '50%',
        overflow: 'hidden',
        border: border ? `3px solid ${border}` : '3px solid rgba(255,255,255,0.3)',
        flexShrink: 0,
      }}>
        <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  if (shape === 'rounded-square') {
    return (
      <div style={{
        ...dim,
        borderRadius: '0.08in',
        overflow: 'hidden',
        border: border ? `2px solid ${hexToRgba(border,0.25)}` : 'none',
        flexShrink: 0,
      }}>
        <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  if (shape === 'organic') {
    return (
      <div style={{
        ...dim,
        borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
        overflow: 'hidden',
        border: border ? `2px solid ${hexToRgba(border,0.3)}` : 'none',
        flexShrink: 0,
      }}>
        <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  if (shape === 'hexagon') {
    return (
      <div style={{ ...dim, flexShrink: 0, position: 'relative' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <clipPath id="hex-clip">
              <polygon points="50,2 93,25 93,75 50,98 7,75 7,25" />
            </clipPath>
          </defs>
          <image href={src} x="0" y="0" width="100" height="100"
            preserveAspectRatio="xMidYMid slice" clipPath="url(#hex-clip)" />
          <polygon points="50,2 93,25 93,75 50,98 7,75 7,25"
            fill="none" stroke={border || 'rgba(255,255,255,0.3)'} strokeWidth="2" />
        </svg>
      </div>
    );
  }
  // default square
  return (
    <div style={{ ...dim, overflow: 'hidden', flexShrink: 0 }}>
      <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

/* ============================================================
   SHARED SECTION CONTENT RENDERERS
   ============================================================ */

function ContactLine({ data, separator = '  ·  ', style = {} }) {
  const items = [
    data.contact?.location, data.contact?.phone,
    data.contact?.email, data.contact?.linkedin, data.contact?.website,
  ].filter(Boolean);
  if (!items.length) return null;
  return <div style={style}>{items.join(separator)}</div>;
}

function ContactStack({ data, style = {}, itemStyle = {}, labelStyle = {} }) {
  const items = [
    { label: 'Location', value: data.contact?.location },
    { label: 'Phone',    value: data.contact?.phone },
    { label: 'Email',    value: data.contact?.email },
    { label: 'LinkedIn', value: data.contact?.linkedin },
    { label: 'Website',  value: data.contact?.website },
  ].filter(x => x.value);
  return (
    <div style={style}>
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: '0.05in', ...itemStyle }}>
          {labelStyle && Object.keys(labelStyle).length > 0 && (
            <div style={labelStyle}>{item.label}</div>
          )}
          <div style={{ wordBreak: 'break-word' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children, deco, accent, bodyFont, accent2 }) {
  const base = {
    fontFamily: bodyFont,
    letterSpacing: '0.15em',
    fontSize: '9pt',
    fontWeight: 700,
    textTransform: 'uppercase',
  };

  if (deco === 'left-bar') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1in', margin: '0.18in 0 0.08in 0' }}>
      <div style={{ width: '3px', height: '0.18in', background: accent, borderRadius: '2px', flexShrink: 0 }} />
      <div style={{ ...base, color: accent }}>{children}</div>
    </div>
  );

  if (deco === 'dot-line') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.08in', margin: '0.18in 0 0.08in 0' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
      <div style={{ ...base, color: accent, flex: 1 }}>{children}</div>
      <div style={{ flex: 1, height: '1px', background: hexToRgba(accent, 0.2) }} />
    </div>
  );

  if (deco === 'mono-label') return (
    <div style={{ margin: '0.18in 0 0.08in 0', display: 'flex', alignItems: 'center', gap: '0.1in' }}>
      <div style={{ ...base, fontFamily: MONO_FACE, color: accent, fontSize: '8pt' }}>
        {'// '}{children}
      </div>
      <div style={{ flex: 1, height: '1px', background: hexToRgba(accent, 0.18) }} />
    </div>
  );

  if (deco === 'bracket') return (
    <div style={{ margin: '0.18in 0 0.08in 0' }}>
      <div style={{ ...base, color: accent, fontFamily: MONO_FACE, fontSize: '8.5pt' }}>
        <span style={{ opacity: 0.5 }}>{'{'}</span>{' '}{children}{' '}<span style={{ opacity: 0.5 }}>{'}'}</span>
      </div>
      <div style={{ height: '1px', background: hexToRgba(accent, 0.15), marginTop: '0.04in' }} />
    </div>
  );

  if (deco === 'italic-rule') return (
    <div style={{ margin: '0.2in 0 0.08in 0', paddingBottom: '0.04in', borderBottom: `1px solid ${hexToRgba(accent, 0.35)}` }}>
      <div style={{ ...base, fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.12em', color: accent, fontSize: '10pt' }}>{children}</div>
    </div>
  );

  if (deco === 'soft-band') return (
    <div style={{
      background: hexToRgba(accent, 0.08),
      padding: '0.05in 0.1in',
      margin: '0.16in -0.1in 0.08in -0.1in',
      borderLeft: `3px solid ${accent}`,
    }}>
      <div style={{ ...base, color: accent }}>{children}</div>
    </div>
  );

  if (deco === 'teal-rule') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1in', margin: '0.18in 0 0.08in 0' }}>
      <div style={{ ...base, color: accent, whiteSpace: 'nowrap' }}>{children}</div>
      <div style={{ flex: 1, height: '2px', background: `linear-gradient(to right, ${accent}, transparent)` }} />
    </div>
  );

  if (deco === 'pill-header') return (
    <div style={{ margin: '0.18in 0 0.08in 0' }}>
      <span style={{
        ...base,
        color: '#fff',
        background: accent,
        padding: '0.025in 0.12in',
        borderRadius: '50px',
        fontSize: '8pt',
      }}>{children}</span>
    </div>
  );

  if (deco === 'serif-rule') return (
    <div style={{
      margin: '0.2in 0 0.08in 0',
      paddingBottom: '0.04in',
      borderBottom: `1.5px solid ${accent}`,
      display: 'flex', alignItems: 'baseline', gap: '0.1in',
    }}>
      <div style={{ ...base, fontFamily: FRAUNCES, textTransform: 'none', fontSize: '11pt', fontWeight: 600, letterSpacing: '0.02em', color: accent }}>{children}</div>
    </div>
  );

  if (deco === 'rule-number') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.08in', margin: '0.18in 0 0.06in 0' }}>
      <div style={{ ...base, color: accent }}>{children}</div>
      <div style={{ flex: 1, height: '1px', background: hexToRgba(accent, 0.25) }} />
    </div>
  );

  if (deco === 'orange-bar') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1in', margin: '0.16in 0 0.08in 0' }}>
      <div style={{ width: '0.18in', height: '2px', background: accent2 || accent, flexShrink: 0 }} />
      <div style={{ ...base, color: '#fff', letterSpacing: '0.2em' }}>{children}</div>
    </div>
  );

  if (deco === 'thick-rule') return (
    <div style={{ margin: '0.16in 0 0.08in 0', paddingBottom: '0.04in', borderBottom: `2.5px solid ${accent2 || accent}` }}>
      <div style={{ ...base, color: '#1c1c1c', letterSpacing: '0.2em' }}>{children}</div>
    </div>
  );

  if (deco === 'sidebar-rule') return (
    <div style={{
      margin: '0.18in 0 0.07in 0',
      paddingBottom: '0.03in',
      borderBottom: `2px solid ${accent}`,
      ...base,
      color: accent,
    }}>{children}</div>
  );

  if (deco === 'small-caps-rule') return (
    <div style={{
      margin: '0.2in 0 0.08in 0',
      paddingBottom: '0.03in',
      borderBottom: `1px solid ${accent}`,
      ...base,
      color: accent,
    }}>{children}</div>
  );

  // fallback
  return (
    <div style={{ ...base, color: accent, margin: '0.18in 0 0.08in 0', paddingBottom: '0.03in', borderBottom: `1px solid ${hexToRgba(accent, 0.3)}` }}>
      {children}
    </div>
  );
}

function ExperienceBlock({ exp, bodyFont, accent, i, total, density, darkBg }) {
  const textColor = darkBg ? 'rgba(255,255,255,0.92)' : '#111';
  const subColor  = darkBg ? 'rgba(255,255,255,0.65)' : '#444';
  const bulletColor = darkBg ? 'rgba(255,255,255,0.85)' : '#1c1c1c';

  return (
    <div style={{ marginBottom: i === total - 1 ? 0 : (density === 'compact' ? '0.1in' : '0.15in') }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.2in' }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 700, color: textColor, fontSize: '10.5pt' }}>
          {exp.title}
          {exp.company && <span style={{ fontWeight: 400, color: subColor }}>{' — '}{exp.company}</span>}
          {exp.location && <span style={{ fontWeight: 400, color: subColor, fontSize: '9.5pt' }}>{', '}{exp.location}</span>}
        </div>
        <div style={{ fontFamily: bodyFont, color: subColor, whiteSpace: 'nowrap', fontSize: '9.5pt', flexShrink: 0 }}>
          {[exp.start, exp.end].filter(Boolean).join(' – ')}
        </div>
      </div>
      {exp.summary && (
        <div style={{ fontFamily: bodyFont, color: subColor, margin: '0.03in 0', fontSize: '10pt', fontStyle: 'italic' }}>{exp.summary}</div>
      )}
      {exp.bullets?.length > 0 && (
        <ul style={{ margin: '0.03in 0 0 0', paddingLeft: '0.2in' }}>
          {exp.bullets.map((b, j) => (
            <li key={j} style={{ marginBottom: '0.02in', fontFamily: bodyFont, fontSize: '10pt', color: bulletColor }}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationBlock({ ed, bodyFont, accent, darkBg }) {
  const textColor = darkBg ? 'rgba(255,255,255,0.92)' : '#111';
  const subColor  = darkBg ? 'rgba(255,255,255,0.65)' : '#444';
  return (
    <div style={{ marginBottom: '0.1in' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.2in' }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 600, color: textColor, fontSize: '10.5pt' }}>
          {ed.degree}
          {ed.school && <span style={{ fontWeight: 400, color: subColor }}>{' — '}{ed.school}</span>}
          {ed.location && <span style={{ fontWeight: 400, color: subColor, fontSize: '9.5pt' }}>{', '}{ed.location}</span>}
        </div>
        <div style={{ fontFamily: bodyFont, color: subColor, whiteSpace: 'nowrap', fontSize: '9.5pt', flexShrink: 0 }}>{ed.date}</div>
      </div>
      {ed.honors && <div style={{ fontFamily: bodyFont, fontStyle: 'italic', color: subColor, marginTop: '0.02in', fontSize: '9.5pt' }}>{ed.honors}</div>}
    </div>
  );
}

/* ============================================================
   LAYOUT RENDERERS — one per layout type
   ============================================================ */

/* ── dark-header ── */
function LayoutDarkHeader({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, photoShape, sectionDeco, boldHeader } = template;
  const s = data.summary || {};
  const a2 = accent2 || template.accent2;

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Dark header band */}
      <div style={{ background: accent, padding: '0.42in 0.65in', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
        {/* Geometric accent */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '2.5in', height: '100%', background: hexToRgba('#fff', 0.04), clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        {a2 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: a2 }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3in', position: 'relative' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.05in" border={hexToRgba('#fff', 0.3)} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: nameFont, fontSize: boldHeader ? '32pt' : '28pt', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: boldHeader ? '0.06em' : '-0.01em', textTransform: boldHeader ? 'uppercase' : 'none' }}>
              {data.name || 'Your Name'}
            </h1>
            {s.tagline && <div style={{ color: hexToRgba('#fff', 0.7), fontSize: '10pt', marginTop: '0.07in', fontStyle: 'italic' }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  ·  " style={{ color: hexToRgba('#fff', 0.72), fontSize: '8.5pt', marginTop: '0.1in', fontFamily: bodyFont }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0.4in 0.65in 0.6in', boxSizing: 'border-box' }}>
        {(s.bullets?.length > 0 || s.skills?.length > 0) && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Summary</SectionTitle>
            {s.bullets?.map((b,i)=> <div key={i} style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#1c1c1c', marginBottom:'0.04in', paddingLeft:'0.14in', borderLeft: `2px solid ${hexToRgba(accent,0.2)}` }}>{b}</div>)}
            {s.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.05in', marginTop: '0.06in' }}>
                {s.skills.map((sk,i) => (
                  <span key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', background: hexToRgba(accent, 0.08), color: accent, padding: '0.02in 0.1in', borderRadius: '3px', fontWeight: 600, border: `1px solid ${hexToRgba(accent,0.2)}` }}>{sk}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Certifications</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>
              {data.certifications.map((c,i) => (
                <li key={i} style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#1c1c1c', marginBottom: '0.03in' }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>{c.org && `, ${c.org}`}{c.date && <span style={{ color: '#666' }}> ({c.date})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Projects</SectionTitle>
            {data.projects.map((p,i) => (
              <div key={i} style={{ marginBottom: '0.1in' }}>
                <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: '10.5pt' }}>{p.name}</div>
                {p.description && <div style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#444', margin: '0.02in 0' }}>{p.description}</div>}
                {p.bullets?.length > 0 && <ul style={{ margin: '0.02in 0 0', paddingLeft: '0.2in' }}>{p.bullets.map((b,j)=><li key={j} style={{ fontFamily: bodyFont, fontSize:'10pt' }}>{b}</li>)}</ul>}
              </div>
            ))}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Awards &amp; Honors</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily: bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── split-header ── */
function LayoutSplitHeader({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Split header */}
      <div style={{ display: 'flex', borderBottom: `3px solid ${accent}` }}>
        {/* Left: accent photo box */}
        <div style={{ width: '2.5in', background: accent, padding: '0.4in 0.35in', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.15in', flexShrink: 0 }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.15in" border="rgba(255,255,255,0.4)" />
          <ContactStack data={data}
            style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, textAlign: 'center', fontFamily: bodyFont }}
            labelStyle={{ fontSize: '6.5pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', marginBottom: '1px' }}
          />
        </div>
        {/* Right: name + tagline + skills */}
        <div style={{ flex: 1, padding: '0.4in 0.5in', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: nameFont, fontSize: '30pt', fontWeight: 800, color: accent, margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{data.name || 'Your Name'}</h1>
          {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#555', marginTop: '0.08in', fontStyle: 'italic' }}>{s.tagline}</div>}
          {s.bullets?.length > 0 && (
            <ul style={{ margin: '0.1in 0 0', paddingLeft: '0.18in' }}>
              {s.bullets.map((b,i) => <li key={i} style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#333', marginBottom: '0.03in' }}>{b}</li>)}
            </ul>
          )}
          {s.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.05in', marginTop: '0.1in' }}>
              {s.skills.map((sk,i) => <span key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', background: hexToRgba(accent,0.08), color: accent, padding: '0.025in 0.1in', borderRadius: '50px', fontWeight: 600 }}>{sk}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0.35in 0.55in 0.6in', boxSizing: 'border-box' }}>
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>
              {data.certifications.map((c,i) => <li key={i} style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#1c1c1c', marginBottom: '0.03in' }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.org && `, ${c.org}`}{c.date && <span style={{ color: '#666' }}> ({c.date})</span>}</li>)}
            </ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i) => <div key={i} style={{ marginBottom:'0.1in' }}><div style={{ fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt' }}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── accent-strip (Tech Builder / Stack) ── */
function LayoutAccentStrip({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, boxSizing: 'border-box', display: 'flex', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Left accent strip */}
      <div style={{ width: '0.18in', background: accent, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: '0.55in 0.55in 0.6in 0.45in', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3in', marginBottom: '0.2in' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: nameFont, fontSize: '30pt', fontWeight: 700, color: '#0d0d0d', margin: 0, lineHeight: 1.1 }}>{data.name || 'Your Name'}</h1>
            {s.tagline && <div style={{ fontFamily: MONO_FACE, fontSize: '8.5pt', color: accent, marginTop: '0.07in' }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  |  " style={{ fontFamily: MONO_FACE, fontSize: '7.5pt', color: '#555', marginTop: '0.08in', letterSpacing: '0.02em' }} />
          </div>
          <ResumePhoto src={data.photo} shape={photoShape} size="1in" border={hexToRgba(accent, 0.4)} />
        </div>

        {/* Skills row */}
        {s.skills?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.05in', padding: '0.1in 0.12in', background: hexToRgba(accent, 0.05), borderRadius: '4px', marginBottom: '0.05in', border: `1px solid ${hexToRgba(accent,0.12)}` }}>
            {s.skills.map((sk,i) => <span key={i} style={{ fontFamily: MONO_FACE, fontSize: '8pt', color: accent, fontWeight: 500 }}>{sk}{i < s.skills.length-1 ? <span style={{ opacity: 0.4, marginLeft: '0.06in' }}>·</span> : ''}</span>)}
          </div>
        )}

        {s.bullets?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
            {s.bullets.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#1c1c1c', marginBottom: '0.04in' }}>{b}</div>)}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>{data.certifications.map((c,i) => <li key={i} style={{ fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in' }}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i) => <div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── dark-sidebar (Tech Architect / Blueprint) ── */
function LayoutDarkSidebar({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, display: 'flex', boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Dark left sidebar */}
      <div style={{ width: '2.35in', background: accent, padding: '0.5in 0.3in 0.5in 0.35in', boxSizing: 'border-box', flexShrink: 0 }}>
        <ResumePhoto src={data.photo} shape={photoShape} size="1.05in" border="rgba(255,255,255,0.25)" />
        <div style={{ marginTop: '0.18in', fontFamily: nameFont, fontSize: '16pt', fontWeight: 700, color: '#fff', lineHeight: 1.2, wordBreak: 'break-word' }}>{data.name || 'Your Name'}</div>
        {s.tagline && <div style={{ fontFamily: MONO_FACE, fontSize: '7.5pt', color: hexToRgba('#fff',0.6), marginTop: '0.08in', lineHeight: 1.4 }}>{s.tagline}</div>}

        <div style={{ marginTop: '0.2in', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.15in' }}>
          <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Contact</div>
          <ContactStack data={data}
            style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}
            labelStyle={{ fontSize: '6.5pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}
          />
        </div>

        {s.skills?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.15in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Skills</div>
            {s.skills.map((sk,i) => (
              <div key={i} style={{ fontFamily: MONO_FACE, fontSize: '8pt', color: 'rgba(255,255,255,0.85)', marginBottom: '0.04in', paddingLeft: '0.1in', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>{sk}</div>
            ))}
          </div>
        )}

        {data.certifications?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.15in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Certifications</div>
            {data.certifications.map((c,i) => (
              <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.82)', marginBottom: '0.07in' }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                {c.org && <div style={{ color: 'rgba(255,255,255,0.55)' }}>{c.org}</div>}
                {c.date && <div style={{ color: 'rgba(255,255,255,0.45)' }}>{c.date}</div>}
              </div>
            ))}
          </div>
        )}

        {data.education?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.15in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Education</div>
            {data.education.map((ed,i) => (
              <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.82)', marginBottom: '0.08in' }}>
                <div style={{ fontWeight: 600 }}>{ed.degree}</div>
                {ed.school && <div style={{ color: 'rgba(255,255,255,0.65)' }}>{ed.school}</div>}
                {ed.date && <div style={{ color: 'rgba(255,255,255,0.45)' }}>{ed.date}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '0.5in 0.5in 0.6in 0.4in', boxSizing: 'border-box' }}>
        {s.bullets?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
            {s.bullets.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#1c1c1c', marginBottom: '0.04in' }}>{b}</div>)}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i) => <div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── editorial (Creative Editorial / Verso) ── */
function LayoutEditorial({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};
  const a2 = accent2 || template.accent2;

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FEFEFE', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.12)' }}>
      {/* Editorial header */}
      <div style={{ padding: '0.55in 0.7in 0.3in', boxSizing: 'border-box', borderBottom: `1px solid ${hexToRgba(accent, 0.15)}`, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.3in' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: nameFont, fontSize: '42pt', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.0, letterSpacing: '-0.02em' }}>{data.name || 'Your Name'}</h1>
            {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: accent, marginTop: '0.08in', fontStyle: 'italic' }}>{s.tagline}</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1in' }}>
            <ResumePhoto src={data.photo} shape={photoShape} size="1.1in" border={hexToRgba(accent, 0.3)} />
            <ContactLine data={data} separator=" · " style={{ fontFamily: bodyFont, fontSize: '8pt', color: '#666', textAlign: 'right', maxWidth: '2.5in', lineHeight: 1.6 }} />
          </div>
        </div>
        {/* Decorative line with accent block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1in', marginTop: '0.2in' }}>
          <div style={{ width: '0.4in', height: '3px', background: accent }} />
          <div style={{ flex: 1, height: '1px', background: hexToRgba(accent, 0.15) }} />
          {a2 && <div style={{ width: '0.15in', height: '3px', background: a2 }} />}
        </div>
      </div>

      <div style={{ padding: '0.3in 0.7in 0.6in', boxSizing: 'border-box' }}>
        {(s.bullets?.length > 0 || s.skills?.length > 0) && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
            {s.bullets?.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#333', marginBottom: '0.04in', fontStyle: 'italic' }}>{b}</div>)}
            {s.skills?.length > 0 && (
              <div style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#444', marginTop: '0.06in' }}>
                {s.skills.join('  ·  ')}
              </div>
            )}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── color-sidebar (Creative Studio / Canvas) ── */
function LayoutColorSidebar({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, display: 'flex', boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Color sidebar */}
      <div style={{ width: '2.6in', background: accent, padding: '0.5in 0.32in', boxSizing: 'border-box', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2in' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.15in" border="rgba(255,255,255,0.35)" />
        </div>
        <h1 style={{ fontFamily: nameFont, fontSize: '18pt', fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.2, textAlign: 'center', letterSpacing: '0.01em' }}>{data.name || 'Your Name'}</h1>
        {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: 'rgba(255,255,255,0.7)', marginTop: '0.08in', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.4 }}>{s.tagline}</div>}

        <div style={{ marginTop: '0.22in', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '0.18in' }}>
          <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.1in' }}>Contact</div>
          <ContactStack data={data}
            style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55 }}
            labelStyle={{}}
          />
        </div>

        {s.skills?.length > 0 && (
          <div style={{ marginTop: '0.2in', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '0.18in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.1in' }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.05in' }}>
              {s.skills.map((sk,i) => <span key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', padding: '0.03in 0.09in', borderRadius: '3px', fontWeight: 500 }}>{sk}</span>)}
            </div>
          </div>
        )}

        {data.certifications?.length > 0 && (
          <div style={{ marginTop: '0.2in', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '0.18in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.1in' }}>Certifications</div>
            {data.certifications.map((c,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.85)', marginBottom: '0.07in' }}><div style={{fontWeight:600}}>{c.name}</div>{c.org&&<div style={{color:'rgba(255,255,255,0.6)'}}>{c.org}</div>}{c.date&&<div style={{color:'rgba(255,255,255,0.45)'}}>{c.date}</div>}</div>)}
          </div>
        )}

        {data.education?.length > 0 && (
          <div style={{ marginTop: '0.2in', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '0.18in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.1in' }}>Education</div>
            {data.education.map((ed,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.85)', marginBottom: '0.08in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'rgba(255,255,255,0.65)'}}>{ed.school}</div>}{ed.date&&<div style={{color:'rgba(255,255,255,0.45)'}}>{ed.date}</div>}</div>)}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '0.5in 0.5in 0.6in 0.4in', boxSizing: 'border-box' }}>
        {s.bullets?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Profile</SectionTitle>
            {s.bullets.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#333', marginBottom: '0.04in', lineHeight: 1.55 }}>{b}</div>)}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── two-tone-header (Healthcare Clarity) ── */
function LayoutTwoToneHeader({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Two-tone header */}
      <div style={{ display: 'flex', height: '1.6in' }}>
        <div style={{ background: accent, flex: '0 0 2.8in', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.1in" border="rgba(255,255,255,0.35)" />
        </div>
        <div style={{ flex: 1, background: hexToRgba(accent, 0.06), padding: '0.3in 0.5in', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: `3px solid ${accent}` }}>
          <h1 style={{ fontFamily: nameFont, fontSize: '26pt', fontWeight: 700, color: accent, margin: 0, lineHeight: 1.1 }}>{data.name || 'Your Name'}</h1>
          {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#555', marginTop: '0.07in', fontStyle: 'italic' }}>{s.tagline}</div>}
          <ContactLine data={data} separator="  ·  " style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: '#666', marginTop: '0.08in' }} />
        </div>
      </div>

      <div style={{ padding: '0.38in 0.6in 0.6in', boxSizing: 'border-box' }}>
        {(s.bullets?.length > 0 || s.skills?.length > 0) && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
            {s.bullets?.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#333', marginBottom: '0.04in' }}>{b}</div>)}
            {s.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.05in', marginTop: '0.06in' }}>
                {s.skills.map((sk,i) => <span key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', background: hexToRgba(accent,0.08), color: accent, padding: '0.025in 0.1in', borderRadius: '50px', fontWeight: 600 }}>{sk}</span>)}
              </div>
            )}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications &amp; Licenses</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.04in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── structured-cols (Healthcare Educator / Align) ── */
function LayoutStructuredCols({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Header */}
      <div style={{ padding: '0.5in 0.65in 0.3in', boxSizing: 'border-box', background: '#fff', borderBottom: `2px solid ${hexToRgba(accent, 0.12)}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3in' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1in" border={hexToRgba(accent, 0.3)} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: nameFont, fontSize: '28pt', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.1 }}>{data.name || 'Your Name'}</h1>
            {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: accent, marginTop: '0.06in', fontWeight: 500 }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  |  " style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: '#666', marginTop: '0.09in' }} />
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', padding: '0.35in 0.65in 0.6in', gap: '0.4in', boxSizing: 'border-box' }}>
        {/* Left narrow */}
        <div style={{ width: '2.1in', flexShrink: 0 }}>
          {s.skills?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Skills</SectionTitle>
              {s.skills.map((sk,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '9pt', color: '#333', marginBottom: '0.04in', paddingLeft: '0.08in', borderLeft: `2px solid ${hexToRgba(accent, 0.3)}` }}>{sk}</div>)}
            </div>
          )}
          {data.certifications?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Credentials</SectionTitle>
              {data.certifications.map((c,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: '#333', marginBottom: '0.08in' }}><div style={{fontWeight:600,fontSize:'9pt'}}>{c.name}</div>{c.org&&<div style={{color:'#666'}}>{c.org}</div>}{c.date&&<div style={{color:accent,fontWeight:500}}>{c.date}</div>}</div>)}
            </div>
          )}
          {data.education?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
              {data.education.map((ed,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: '#333', marginBottom: '0.1in' }}><div style={{fontWeight:600,fontSize:'9pt'}}>{ed.degree}</div>{ed.school&&<div>{ed.school}</div>}{ed.date&&<div style={{color:accent,fontWeight:500}}>{ed.date}</div>}{ed.honors&&<div style={{fontStyle:'italic',color:'#666'}}>{ed.honors}</div>}</div>)}
            </div>
          )}
          {data.awards?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards</SectionTitle>
              <ul style={{margin:0,paddingLeft:'0.15in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'8.5pt',color:'#333',marginBottom:'0.04in'}}>{a}</li>)}</ul>
            </div>
          )}
        </div>
        {/* Right main */}
        <div style={{ flex: 1 }}>
          {s.bullets?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
              {s.bullets.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#333', marginBottom: '0.05in' }}>{b}</div>)}
            </div>
          )}
          {data.experience?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
              {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
            </div>
          )}
          {data.projects?.length > 0 && (
            <div>
              <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
              {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── folio (Academic Scholar) ── */
function LayoutFolio({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FEFDF9', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.14)' }}>
      {/* Header */}
      <div style={{ padding: '0.6in 0.75in 0.35in', boxSizing: 'border-box', textAlign: 'center', position: 'relative', borderBottom: `1px solid ${hexToRgba(accent, 0.2)}` }}>
        <div style={{ position: 'absolute', top: '0.5in', right: '0.7in' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1in" border={hexToRgba(accent, 0.3)} />
        </div>
        <h1 style={{ fontFamily: nameFont, fontSize: '34pt', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.1 }}>{data.name || 'Your Name'}</h1>
        {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '11pt', color: '#555', marginTop: '0.09in', fontStyle: 'italic' }}>{s.tagline}</div>}
        <ContactLine data={data} separator="  ·  " style={{ fontFamily: bodyFont, fontSize: '9pt', color: '#666', marginTop: '0.12in' }} />
        {/* Decorative accent rule */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.12in', marginTop: '0.2in' }}>
          <div style={{ width: '0.6in', height: '1px', background: hexToRgba(accent, 0.3) }} />
          <div style={{ width: '6px', height: '6px', background: accent, transform: 'rotate(45deg)' }} />
          <div style={{ width: '0.6in', height: '1px', background: hexToRgba(accent, 0.3) }} />
        </div>
      </div>

      <div style={{ padding: '0.35in 0.75in 0.6in', boxSizing: 'border-box' }}>
        {(s.bullets?.length > 0 || s.skills?.length > 0) && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Research Interests</SectionTitle>
            {s.bullets?.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#333', marginBottom: '0.04in', lineHeight: 1.6 }}>{b}</div>)}
            {s.skills?.length > 0 && <div style={{ fontFamily: bodyFont, fontSize: '10pt', color: '#555', marginTop: '0.06in', fontStyle: 'italic' }}>{s.skills.join('  ·  ')}</div>}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Academic &amp; Professional Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications &amp; Training</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10.5pt',color:'#1c1c1c',marginBottom:'0.04in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Publications &amp; Projects</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:600,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0',fontStyle:'italic'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Honors &amp; Awards</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10.5pt',color:'#1c1c1c',marginBottom:'0.04in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── cv-dense (Academic Researcher / Thesis) ── */
function LayoutCvDense({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, display: 'flex', boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Narrow left column */}
      <div style={{ width: '2.1in', background: hexToRgba(accent, 0.05), borderRight: `2px solid ${hexToRgba(accent, 0.12)}`, padding: '0.5in 0.28in', boxSizing: 'border-box', flexShrink: 0 }}>
        <ResumePhoto src={data.photo} shape={photoShape} size="0.95in" border={hexToRgba(accent, 0.3)} />
        <div style={{ marginTop: '0.15in', fontFamily: nameFont, fontSize: '13pt', fontWeight: 700, color: '#111', lineHeight: 1.2, wordBreak: 'break-word' }}>{data.name || 'Your Name'}</div>
        {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '8pt', color: '#666', marginTop: '0.07in', fontStyle: 'italic', lineHeight: 1.4 }}>{s.tagline}</div>}
        <div style={{ marginTop: '0.18in', borderTop: `1px solid ${hexToRgba(accent, 0.2)}`, paddingTop: '0.15in' }}>
          <ContactStack data={data}
            style={{ fontFamily: bodyFont, fontSize: '8pt', color: '#444', lineHeight: 1.5 }}
            labelStyle={{ fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}
          />
        </div>
        {s.skills?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: `1px solid ${hexToRgba(accent, 0.2)}`, paddingTop: '0.15in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.15em', color: accent, fontWeight: 700, marginBottom: '0.08in' }}>Expertise</div>
            {s.skills.map((sk,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: '#333', marginBottom: '0.04in' }}>{sk}</div>)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: `1px solid ${hexToRgba(accent, 0.2)}`, paddingTop: '0.15in' }}>
            <div style={{ fontFamily: bodyFont, fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.15em', color: accent, fontWeight: 700, marginBottom: '0.08in' }}>Education</div>
            {data.education.map((ed,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: '#333', marginBottom: '0.1in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'#555'}}>{ed.school}</div>}{ed.date&&<div style={{color:accent,fontWeight:500}}>{ed.date}</div>}{ed.honors&&<div style={{fontStyle:'italic',color:'#777'}}>{ed.honors}</div>}</div>)}
          </div>
        )}
      </div>

      {/* Right main */}
      <div style={{ flex: 1, padding: '0.5in 0.5in 0.6in 0.38in', boxSizing: 'border-box' }}>
        {s.bullets?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Research Profile</SectionTitle>
            {s.bullets.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#333', marginBottom: '0.05in', lineHeight: 1.6 }}>{b}</div>)}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} density="compact" />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects &amp; Publications</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.09in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0',fontStyle:'italic'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Honors &amp; Awards</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── diagonal-band (Trades Foreman / Ironclad) ── */
function LayoutDiagonalBand({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const a2 = accent2 || template.accent2;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#F8F8F8', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.22)' }}>
      {/* Diagonal header */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '1.8in', background: accent }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: a2 || '#555', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: a2 || '#555' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.3in', padding: '0.3in 0.65in', height: '100%', boxSizing: 'border-box' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.1in" border="rgba(255,255,255,0.35)" />
          <div>
            <h1 style={{ fontFamily: nameFont, fontSize: '30pt', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{data.name || 'Your Name'}</h1>
            {s.tagline && <div style={{ fontFamily: bodyFont, fontSize: '9.5pt', color: 'rgba(255,255,255,0.72)', marginTop: '0.07in' }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  ·  " style={{ fontFamily: bodyFont, fontSize: '8.5pt', color: 'rgba(255,255,255,0.68)', marginTop: '0.07in' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0.38in 0.65in 0.6in', boxSizing: 'border-box' }}>
        {(s.bullets?.length > 0 || s.skills?.length > 0) && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Summary</SectionTitle>
            {s.bullets?.map((b,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '10.5pt', color: '#1c1c1c', marginBottom: '0.04in' }}>{b}</div>)}
            {s.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.05in', marginTop: '0.06in' }}>
                {s.skills.map((sk,i) => <span key={i} style={{ fontFamily: bodyFont, fontSize: '8.5pt', background: hexToRgba(accent,0.08), color: accent, padding: '0.025in 0.1in', borderRadius: '3px', fontWeight: 600, border: `1px solid ${hexToRgba(accent,0.2)}` }}>{sk}</span>)}
              </div>
            )}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Certifications &amp; Licenses</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10.5pt',color:'#1c1c1c',marginBottom:'0.04in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Projects</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={a2}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── sidebar-classic (Modern Sidebar) ── */
function LayoutSidebarClassic({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, display: 'flex', boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      {/* Sidebar */}
      <div style={{ width: '2.45in', background: accent, padding: '0.55in 0.3in', boxSizing: 'border-box', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.18in' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.05in" border="rgba(255,255,255,0.3)" />
        </div>
        <div style={{ fontFamily: nameFont, fontSize: '18pt', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '0.06in', letterSpacing: '-0.01em', wordBreak: 'break-word' }}>{data.name || 'Your Name'}</div>
        {s.tagline && <div style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.72)', marginBottom: '0.22in', lineHeight: 1.45, fontStyle: 'italic' }}>{s.tagline}</div>}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.15in' }}>
          <div style={{ fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Contact</div>
          <ContactStack data={data}
            style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, fontFamily: bodyFont }}
            labelStyle={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
        </div>
        {s.skills?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.15in' }}>
            <div style={{ fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Skills</div>
            {s.skills.map((sk,i) => <div key={i} style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.88)', marginBottom: '0.025in', display: 'flex', alignItems: 'center', gap: '0.06in' }}><span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0, display: 'inline-block' }} />{sk}</div>)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.15in' }}>
            <div style={{ fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Certifications</div>
            {data.certifications.map((c,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.88)', marginBottom: '0.07in' }}><div style={{fontWeight:600}}>{c.name}</div>{c.org&&<div style={{color:'rgba(255,255,255,0.6)'}}>{c.org}</div>}{c.date&&<div style={{color:'rgba(255,255,255,0.5)'}}>{c.date}</div>}</div>)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div style={{ marginTop: '0.18in', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.15in' }}>
            <div style={{ fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.08in' }}>Education</div>
            {data.education.map((ed,i) => <div key={i} style={{ fontFamily: bodyFont, fontSize: '8pt', color: 'rgba(255,255,255,0.88)', marginBottom: '0.08in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'rgba(255,255,255,0.7)'}}>{ed.school}</div>}{ed.date&&<div style={{color:'rgba(255,255,255,0.55)'}}>{ed.date}</div>}</div>)}
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: '0.55in 0.45in 0.55in 0.4in', boxSizing: 'border-box' }}>
        {s.bullets?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
            <ul style={{ margin: 0, paddingLeft: '0.2in' }}>{s.bullets.map((b,i) => <li key={i} style={{ marginBottom: '0.04in', fontSize: '10pt', color: '#1c1c1c', fontFamily: bodyFont }}>{b}</li>)}</ul>
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── header-band (Modern Director) ── */
function LayoutHeaderBand({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template;
  const s = data.summary || {};

  return (
    <div style={{ width: '8.5in', minHeight: '11in', background: '#FAFAFA', fontFamily: bodyFont, boxSizing: 'border-box', boxShadow: '0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ background: accent, padding: '0.42in 0.75in 0.38in', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '0.3in' }}>
        <ResumePhoto src={data.photo} shape={photoShape} size="1in" border="rgba(255,255,255,0.3)" />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: nameFont, fontSize: '34pt', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{data.name || 'Your Name'}</div>
          <ContactLine data={data} separator="  ·  " style={{ color: 'rgba(255,255,255,0.75)', fontSize: '9pt', marginTop: '0.12in', fontFamily: bodyFont }} />
          {s.tagline && <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10pt', marginTop: '0.09in', fontStyle: 'italic', fontFamily: bodyFont }}>{s.tagline}</div>}
        </div>
      </div>
      <div style={{ padding: '0.45in 0.75in 0.65in', boxSizing: 'border-box' }}>
        {(s.bullets?.length > 0 || s.skills?.length > 0) && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>
            {s.bullets?.map((b,i) => <li key={i} style={{listStyle:'none',fontFamily:bodyFont,fontSize:'10.5pt',color:'#333',marginBottom:'0.04in'}}>{b}</li>)}
            {s.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.06in', marginTop: '0.04in' }}>
                {s.skills.map((sk,i) => <span key={i} style={{ border: `1.5px solid ${hexToRgba(accent,0.35)}`, color: accent, padding: '0.02in 0.1in', borderRadius: '0.04in', fontSize: '9pt', fontWeight: 500, fontFamily: bodyFont }}>{sk}</span>)}
              </div>
            )}
          </div>
        )}
        {data.experience?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
            {data.experience.map((exp,i) => <ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
            {data.education.map((ed,i) => <EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}
          </div>
        )}
        {data.certifications?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications &amp; Licenses</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.22in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10.5pt',color:'#1c1c1c',marginBottom:'0.03in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#555'}}> ({c.date})</span>}</li>)}</ul>
          </div>
        )}
        {data.projects?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>
            {data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:600,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.22in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}
          </div>
        )}
        {data.awards?.length > 0 && (
          <div>
            <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle>
            <ul style={{margin:0,paddingLeft:'0.22in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATE PREVIEW ROUTER
   ============================================================ */

const TemplatePreview = React.forwardRef(function TemplatePreview({ template, data, accent, accent2 }, ref) {
  const eff = useMemo(() => ({ ...template, accent2: accent2 || template.accent2 }), [template, accent2]);
  const props = { data, template: eff, accent, accent2: accent2 || template.accent2 };

  const inner = (() => {
    switch (eff.layout) {
      case 'dark-header':      return <LayoutDarkHeader {...props} />;
      case 'split-header':     return <LayoutSplitHeader {...props} />;
      case 'accent-strip':     return <LayoutAccentStrip {...props} />;
      case 'dark-sidebar':     return <LayoutDarkSidebar {...props} />;
      case 'editorial':        return <LayoutEditorial {...props} />;
      case 'color-sidebar':    return <LayoutColorSidebar {...props} />;
      case 'two-tone-header':  return <LayoutTwoToneHeader {...props} />;
      case 'structured-cols':  return <LayoutStructuredCols {...props} />;
      case 'folio':            return <LayoutFolio {...props} />;
      case 'cv-dense':         return <LayoutCvDense {...props} />;
      case 'diagonal-band':    return <LayoutDiagonalBand {...props} />;
      case 'sidebar-classic':  return <LayoutSidebarClassic {...props} />;
      case 'header-band':      return <LayoutHeaderBand {...props} />;
      default:                 return <LayoutDarkHeader {...props} />;
    }
  })();

  return <div ref={ref}>{inner}</div>;
});

/* ============================================================
   PHOTO UPLOAD CONTROL
   ============================================================ */

function PhotoUpload({ photo, onChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="field-label">Profile Photo</label>
      <div className="header-left">
        {/* Preview */}
        <div className="photo-preview">
          {photo
            ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            : <User style={{width:"22px",height:"22px",color:"#ccc"}} />
          }
        </div>
        <div className="photo-actions">
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-photo"
          >
            <Camera style={{width:"14px",height:"14px"}} />
            {photo ? 'Change photo' : 'Upload photo'}
          </button>
          {photo && (
            <button
              onClick={() => onChange(null)}
              className="btn-remove-photo"
            >
              Remove photo
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

/* ============================================================
   FORM COMPONENTS
   ============================================================ */





function ListInput({ label, items, onChange, placeholder = "Add item" }) {
  const update = (i, v) => onChange(items.map((it, idx) => idx === i ? v : it));
  const add = () => onChange([...items, ""]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="field-label">{label}</label>
      <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
        {items.map((item, i) => (
          <div key={i} className="list-input-row">
            <input className="field-input" value={item} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} />
            <button onClick={() => remove(i)} className="btn-remove">
              <X style={{width:"16px",height:"16px"}} />
            </button>
          </div>
        ))}
        <button onClick={add} className="btn-add">
          <Plus style={{width:"14px",height:"14px"}} /> Add
        </button>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible">
      <button onClick={() => setOpen(!open)} className="collapsible-btn">
        <span className="collapsible-title">{title}</span>
        {open ? <ChevronUp style={{width:"16px",height:"16px",color:"#aaa"}} /> : <ChevronDown style={{width:"16px",height:"16px",color:"#aaa"}} />}
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}

function ResumeForm({ data, setData }) {
  const update = (path, value) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const updateExp  = (i, key, val) => setData(prev => ({ ...prev, experience: prev.experience.map((e, idx) => idx === i ? { ...e, [key]: val } : e) }));
  const updateEdu  = (i, key, val) => setData(prev => ({ ...prev, education: prev.education.map((e, idx) => idx === i ? { ...e, [key]: val } : e) }));
  const updateCert = (i, key, val) => setData(prev => ({ ...prev, certifications: prev.certifications.map((e, idx) => idx === i ? { ...e, [key]: val } : e) }));

  return (
    <div className="form-wrap">
      <CollapsibleSection title="Identity & Contact">
        <PhotoUpload photo={data.photo} onChange={v => update('photo', v)} />
        <div>
          <label className="field-label">Full name</label>
          <input className="field-input" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
        </div>
        <div className="grid-2">
          <div><label className="field-label">Phone</label><input className="field-input" value={data.contact.phone} onChange={e => update('contact.phone', e.target.value)} /></div>
          <div><label className="field-label">Email</label><input className="field-input" value={data.contact.email} onChange={e => update('contact.email', e.target.value)} /></div>
          <div><label className="field-label">Location</label><input className="field-input" value={data.contact.location} onChange={e => update('contact.location', e.target.value)} /></div>
          <div><label className="field-label">LinkedIn</label><input className="field-input" value={data.contact.linkedin} onChange={e => update('contact.linkedin', e.target.value)} /></div>
          <div className="col-span-2"><label className="field-label">Website</label><input className="field-input" value={data.contact.website} onChange={e => update('contact.website', e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Summary">
        <div><label className="field-label">Tagline</label><input className="field-input" value={data.summary.tagline} onChange={e => update('summary.tagline', e.target.value)} placeholder="e.g. Senior Product Designer with 10+ years" /></div>
        <ListInput label="Bullets" items={data.summary.bullets} onChange={v => update('summary.bullets', v)} placeholder="A short summary point" />
        <ListInput label="Skills" items={data.summary.skills} onChange={v => update('summary.skills', v)} placeholder="A skill" />
      </CollapsibleSection>

      <CollapsibleSection title="Experience">
        {data.experience.map((exp, i) => (
          <div key={i} className="sub-card">
            <div className="sub-card-header">
              <span className="sub-card-label">Role {i + 1}</span>
              <button onClick={() => setData(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))} className="btn-remove"><X style={{width:"16px",height:"16px"}} /></button>
            </div>
            <div className="sub-card-body">
              <div className="grid-2">
                <input className="field-input" placeholder="Title" value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} />
                <input className="field-input" placeholder="Company" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} />
                <input className="field-input" placeholder="Location" value={exp.location} onChange={e => updateExp(i, 'location', e.target.value)} />
                <div className="grid-2">
                  <input className="field-input" placeholder="Start" value={exp.start} onChange={e => updateExp(i, 'start', e.target.value)} />
                  <input className="field-input" placeholder="End" value={exp.end} onChange={e => updateExp(i, 'end', e.target.value)} />
                </div>
              </div>
              <textarea className="field-input" rows={2} placeholder="Optional summary paragraph" value={exp.summary} onChange={e => updateExp(i, 'summary', e.target.value)} />
              <ListInput label="Bullets" items={exp.bullets} onChange={v => updateExp(i, 'bullets', v)} placeholder="A bullet point" />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p => ({ ...p, experience: [...p.experience, { title:"",company:"",location:"",start:"",end:"",summary:"",bullets:[] }] }))} className="btn-dashed">
          <Plus style={{width:"16px",height:"16px"}} /> Add role
        </button>
      </CollapsibleSection>

      <CollapsibleSection title="Education">
        {data.education.map((ed, i) => (
          <div key={i} className="sub-card">
            <div className="sub-card-header">
              <span className="sub-card-label">Entry {i + 1}</span>
              <button onClick={() => setData(p => ({ ...p, education: p.education.filter((_, j) => j !== i) }))} className="btn-remove"><X style={{width:"16px",height:"16px"}} /></button>
            </div>
            <div className="grid-2">
              <input className="field-input" placeholder="Degree" value={ed.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} />
              <input className="field-input" placeholder="School" value={ed.school} onChange={e => updateEdu(i, 'school', e.target.value)} />
              <input className="field-input" placeholder="Location" value={ed.location} onChange={e => updateEdu(i, 'location', e.target.value)} />
              <input className="field-input" placeholder="Date" value={ed.date} onChange={e => updateEdu(i, 'date', e.target.value)} />
              <input className="field-input col-span-2" placeholder="Honors (optional)" value={ed.honors} onChange={e => updateEdu(i, 'honors', e.target.value)} />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p => ({ ...p, education: [...p.education, { degree:"",school:"",location:"",date:"",honors:"" }] }))} className="btn-dashed">
          <Plus style={{width:"16px",height:"16px"}} /> Add education
        </button>
      </CollapsibleSection>

      <CollapsibleSection title="Certifications" defaultOpen={false}>
        {data.certifications.map((c, i) => (
          <div key={i} className="sub-card">
            <div className="sub-card-header">
              <span className="sub-card-label">Certification {i + 1}</span>
              <button onClick={() => setData(p => ({ ...p, certifications: p.certifications.filter((_, j) => j !== i) }))} className="btn-remove"><X style={{width:"16px",height:"16px"}} /></button>
            </div>
            <div className="grid-2">
              <input className="field-input col-span-2" placeholder="Name" value={c.name} onChange={e => updateCert(i, 'name', e.target.value)} />
              <input className="field-input" placeholder="Date" value={c.date} onChange={e => updateCert(i, 'date', e.target.value)} />
              <input className="field-input col-span-2" placeholder="Issuing organization" value={c.org} onChange={e => updateCert(i, 'org', e.target.value)} />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p => ({ ...p, certifications: [...p.certifications, { name:"",org:"",date:"" }] }))} className="btn-dashed">
          <Plus style={{width:"16px",height:"16px"}} /> Add certification
        </button>
      </CollapsibleSection>

      <CollapsibleSection title="Awards" defaultOpen={false}>
        <ListInput label="Awards & Honors" items={data.awards} onChange={v => update('awards', v)} placeholder="An award or honor" />
      </CollapsibleSection>
    </div>
  );
}

/* ============================================================
   EXPORT HELPERS
   ============================================================ */

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.rel = 'noopener'; a.style.display = 'none';
  document.body.appendChild(a); a.click();
  setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1500);
}

function exportToPDF(printAreaEl, data) {
  if (!printAreaEl) return;
  const resumeHTML = printAreaEl.innerHTML;
  const fullDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${(data.name || 'Resume').replace(/[<>&"']/g,'')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
  @page { size: letter; margin: 0; }
  html, body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @media print { body { background: white; } }
</style>
</head>
<body>
${resumeHTML}
<script>
(function() {
  function go() { try { window.focus(); window.print(); } catch(e) { console.error(e); } }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function() { setTimeout(go, 150); }); }
  else { setTimeout(go, 700); }
})();
</script>
</body>
</html>`;
  const w = window.open('', '_blank', 'width=900,height=1100');
  if (!w) {
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, ((data.name || 'resume').replace(/[^a-z0-9]+/gi,'_').toLowerCase()) + '.html');
    alert("Pop-ups are blocked, so we downloaded an HTML file instead — open it in your browser and use Ctrl/Cmd+P to save as PDF.");
    return;
  }
  w.document.open(); w.document.write(fullDoc); w.document.close();
}

function rtfEscape(s) {
  if (s == null) return '';
  return String(s).replace(/\\/g,'\\\\').replace(/\{/g,'\\{').replace(/\}/g,'\\}').replace(/[\u0080-\uFFFF]/g, c=>`\\u${c.charCodeAt(0)}?`).replace(/\t/g,'\\tab ').replace(/\n/g,'\\line ');
}

function hexToRtfColor(hex) {
  const h = (hex||'#000000').replace('#','');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}

function exportToWord(data, template, accent, accent2, name) {
  const filename = (name||'resume').replace(/[^a-z0-9]+/gi,'_').toLowerCase() + '.rtf';
  const accentRGB = hexToRtfColor(accent);
  const accent2RGB = accent2 ? hexToRtfColor(accent2) : null;
  let colorTable = `{\\colortbl;\\red17\\green17\\blue17;\\red60\\green60\\blue60;\\red232\\green232\\blue232;\\red${accentRGB.r}\\green${accentRGB.g}\\blue${accentRGB.b};`;
  if (accent2RGB) colorTable += `\\red${accent2RGB.r}\\green${accent2RGB.g}\\blue${accent2RGB.b};`;
  colorTable += '}';
  const useSerif = template.bodyFont?.includes('Garamond') || template.bodyFont?.includes('Baskerville') || template.bodyFont?.includes('Playfair');
  const fontTable = useSerif ? `{\\fonttbl{\\f0\\froman\\fcharset0 Garamond;}{\\f1\\fswiss\\fcharset0 Arial;}}` : `{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Garamond;}}`;
  const out = [];
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat`);
  out.push(fontTable); out.push(colorTable);
  out.push(`\\paperw12240\\paperh15840\\margl1080\\margr1080\\margt1080\\margb1080`);
  out.push(`\\f0\\fs22\\cf1`);
  if (data.name) out.push(`{\\pard\\ql\\sb0\\sa120\\fs52\\b\\cf1 ${rtfEscape(data.name)}\\par}`);
  const contactItems = [data.contact.location,data.contact.phone,data.contact.email,data.contact.linkedin,data.contact.website].filter(Boolean);
  if (contactItems.length) out.push(`{\\pard\\ql\\sb0\\sa240\\fs19\\cf2 ${rtfEscape(contactItems.join('  |  '))}\\par}`);
  const sh = (text) => { out.push(`{\\pard\\ql\\sb240\\sa60\\cf4\\fs19\\b ${rtfEscape(text.toUpperCase())}\\b0\\par}`); out.push(`{\\pard\\ql\\sb0\\sa120\\brdrb\\brdrs\\brdrw10\\brdrcf4\\par}`); };
  const s = data.summary || {};
  if (s.tagline||s.bullets?.length||s.skills?.length) {
    sh('Summary');
    if (s.bullets?.length) s.bullets.forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa60\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(b)}\\par}`));
    if (s.tagline) out.push(`{\\pard\\ql\\sa60\\cf1\\fs22\\i ${rtfEscape(s.tagline)}\\i0\\par}`);
    if (s.skills?.length) out.push(`{\\pard\\ql\\sa120\\cf1\\fs22 ${rtfEscape(s.skills.join('  ·  '))}\\par}`);
  }
  if (data.experience?.length) {
    sh('Experience');
    data.experience.forEach(exp => {
      const tl = [exp.title?`{\\b ${rtfEscape(exp.title)}\\b0}`:'',exp.company?` \\u8212? ${rtfEscape(exp.company)}`:'',exp.location?`, ${rtfEscape(exp.location)}`:''].join('');
      const dr = [exp.start,exp.end].filter(Boolean).join(' \\u8212? ');
      out.push(`{\\pard\\ql\\sb120\\sa40\\tx9000\\tqr\\tx9000\\cf1\\fs22 ${tl}\\tab ${rtfEscape(dr)}\\par}`);
      if (exp.summary) out.push(`{\\pard\\ql\\sa40\\cf1\\fs22\\i ${rtfEscape(exp.summary)}\\i0\\par}`);
      if (exp.bullets?.length) exp.bullets.forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa30\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(b)}\\par}`));
      out.push(`{\\pard\\sb60\\par}`);
    });
  }
  if (data.education?.length) {
    sh('Education');
    data.education.forEach(ed => {
      const l=[ed.degree?`{\\b ${rtfEscape(ed.degree)}\\b0}`:'',ed.school?` \\u8212? ${rtfEscape(ed.school)}`:'',ed.location?`, ${rtfEscape(ed.location)}`:''].join('');
      out.push(`{\\pard\\ql\\sb80\\sa40\\tx9000\\tqr\\tx9000\\cf1\\fs22 ${l}\\tab ${rtfEscape(ed.date||'')}\\par}`);
      if (ed.honors) out.push(`{\\pard\\ql\\sa40\\cf2\\fs21\\i ${rtfEscape(ed.honors)}\\i0\\par}`);
    });
  }
  if (data.certifications?.length) {
    sh('Certifications & Licenses');
    data.certifications.forEach(c=>out.push(`{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab {\\b ${rtfEscape(c.name)}\\b0}${c.org?`, ${rtfEscape(c.org)}`:''}${c.date?` (${rtfEscape(c.date)})`:''}`));
  }
  if (data.projects?.length) {
    sh('Projects');
    data.projects.forEach(p=>{
      if(p.name) out.push(`{\\pard\\ql\\sb80\\sa40\\cf1\\fs22\\b ${rtfEscape(p.name)}\\b0\\par}`);
      if(p.description) out.push(`{\\pard\\ql\\sa40\\cf1\\fs22\\i ${rtfEscape(p.description)}\\i0\\par}`);
      if(p.bullets?.length) p.bullets.forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa30\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(b)}\\par}`));
    });
  }
  if (data.awards?.length) { sh('Awards & Honors'); data.awards.forEach(a=>out.push(`{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(a)}\\par}`)); }
  out.push(`}`);
  const blob = new Blob([out.join('\n')], { type: 'application/rtf' });
  downloadBlob(blob, filename);
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const TOOL_FONTS_CSS = null;


  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [data, setData] = useState(SAMPLE_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState('creative-editorial');
  const [activeCategory, setActiveCategory] = useState('creative');
  const [accentOverrides, setAccentOverrides] = useState({});
  const [isExporting, setIsExporting] = useState(null);
  const [previewScale, setPreviewScale] = useState(0.78);
  const [previewHeight, setPreviewHeight] = useState(11 * 96);
  const previewRef = useRef(null);
  const previewWrapRef = useRef(null);
  const printAreaRef = useRef(null);

  useEffect(() => {
    const fit = () => {
      if (!previewWrapRef.current) return;
      const w = previewWrapRef.current.clientWidth;
      const next = Math.min(1, (w - 32) / (8.5 * 96));
      setPreviewScale(Math.max(0.35, next));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [unlocked]);

  useEffect(() => {
    if (!previewRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const e of entries) setPreviewHeight(e.contentRect.height + 32);
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [unlocked, selectedTemplate, data]);

  const template = TEMPLATES[selectedTemplate];
  const overrides = accentOverrides[selectedTemplate] || {};
  const effectiveAccent = overrides.accent || template.accent;
  const effectiveAccent2 = overrides.accent2 || template.accent2;
  const hasOverride = !!(overrides.accent || overrides.accent2);

  const setAccent  = c => setAccentOverrides(p => ({ ...p, [selectedTemplate]: { ...(p[selectedTemplate]||{}), accent: c } }));
  const setAccent2 = c => setAccentOverrides(p => ({ ...p, [selectedTemplate]: { ...(p[selectedTemplate]||{}), accent2: c } }));
  const resetAccent = () => setAccentOverrides(p => { const n={...p}; delete n[selectedTemplate]; return n; });

  const pickCategory = catId => {
    setActiveCategory(catId);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat && !cat.variants.includes(selectedTemplate)) setSelectedTemplate(cat.variants[0]);
  };

  const handleUnlock = () => {
    if (pwInput === 'resumev2') { setUnlocked(true); setPwError(false); }
    else { setPwError(true); setPwInput(''); }
  };

  const handleExportPDF = () => {
    setIsExporting('pdf');
    try { exportToPDF(printAreaRef.current, data); }
    catch (err) { console.error(err); alert('PDF export failed: ' + (err?.message||'Unknown error')); }
    finally { setTimeout(() => setIsExporting(null), 500); }
  };

  const handleExportDocx = () => {
    setIsExporting('docx');
    try { exportToWord(data, template, effectiveAccent, effectiveAccent2, data.name); }
    catch (err) { console.error(err); alert('Word export failed.'); }
    finally { setTimeout(() => setIsExporting(null), 400); }
  };

  /* ── PASSWORD GATE ── */
  if (!unlocked) {
    return (
      <div className="gate">
        <div className="gate-inner">
          <div className="gate-header">
            <div className="gate-icon">
              <Lock style={{width:"18px",height:"18px",color:"#fff"}} />
            </div>
            <h1 className="gate-title">Résumé</h1>
            <p className="gate-subtitle">Enter the password to continue.</p>
          </div>
          <div className="gate-card">
            <input type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }} onKeyDown={e => e.key === 'Enter' && handleUnlock()} placeholder="Password" autoFocus
              className={`gate-input${pwError ? ' error' : ''}`} />
            <div className="gate-footer">
              {pwError ? <span className="gate-error">Incorrect password — try again.</span> : <span />}
              <button onClick={handleUnlock} className="btn-unlock">Unlock</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── EDITOR ── */
  return (
    <div className="app">

      <header className="header">
        <div className="header-left">
          <div className="header-logo">Résumé</div>
          <span className="header-divider">|</span>
          <span className="header-label">Editor</span>
        </div>
        <div className="header-actions">
          <button onClick={() => { setData(SAMPLE_RESUME); setSelectedTemplate('creative-editorial'); setActiveCategory('creative'); }} className="btn-ghost">
            <RotateCcw style={{width:"14px",height:"14px"}} /> Load sample
          </button>
          <button onClick={() => setData(EMPTY_RESUME)} className="btn-ghost-bordered">
            <X style={{width:"14px",height:"14px"}} /> Clear
          </button>
        </div>
      </header>

      <div className="editor-grid">
        {/* LEFT: Edit panel */}
        <aside className="left-panel">
          <div className="left-inner">
            <div className="panel-heading">
              <Edit3 style={{width:"16px",height:"16px",color:"#888"}} />
              <h2 className="panel-title">Edit</h2>
            </div>
            <p className="panel-subtitle">Fill in your details. The preview updates as you type.</p>
            <ResumeForm data={data} setData={setData} />
          </div>
        </aside>

        {/* RIGHT: Template picker + preview */}
        <main className="right-panel">
          {/* Template picker */}
          <div className="tpl-picker">
            <div className="cat-tabs">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => pickCategory(cat.id)}
                  className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="tpl-variants">
              {CATEGORIES.find(c => c.id === activeCategory).variants.map(tplId => {
                const tpl = TEMPLATES[tplId];
                const active = tplId === selectedTemplate;
                const tplAccent = (accentOverrides[tplId]?.accent) || tpl.accent;
                return (
                  <button key={tplId} onClick={() => setSelectedTemplate(tplId)}
                    className={`tpl-btn ${active ? 'active' : ''}`}>
                    <div className="tpl-btn-row">
                      <span className="tpl-dot" style={{ background: tplAccent }} />
                      <span className="font-medium">{tpl.label}</span>
                      {active && <Check className="w-3 h-3 ml-1" />}
                    </div>
                    <div className="tpl-blurb">{tpl.blurb}</div>
                  </button>
                );
              })}
            </div>

            {/* Accent controls */}
            <div className="accent-bar">
              <span className="accent-label">Accent</span>
              <div className="color-swatch-wrap" style={{display:"flex",alignItems:"center",gap:"6px"}}>
                <label className="color-swatch">
                  <input type="color" value={effectiveAccent} onChange={e => setAccent(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                  <span className="absolute inset-0 pointer-events-none" style={{ background: effectiveAccent }} />
                </label>
                <input type="text" value={effectiveAccent.toUpperCase()}
                  onChange={e => { const v=e.target.value.trim(); if(/^#?[0-9a-fA-F]{0,6}$/.test(v)) setAccent(v.startsWith('#')?v:'#'+v); }}
                  className="hex-input" />
              </div>
              <div className="presets">
                {ACCENT_PRESETS.map(p => {
                  const active = effectiveAccent.toLowerCase() === p.value.toLowerCase();
                  return <button key={p.value} onClick={() => setAccent(p.value)} className={`preset-dot ${active ? 'active' : ''}`} style={{ background: p.value }} title={p.name} aria-label={p.name} />;
                })}
              </div>
              {template.accent2 && (
                <>
                  <span style={{color:"#ccc"}}>|</span>
                  <span className="accent-label">Secondary</span>
                  <label className="color-swatch">
                    <input type="color" value={effectiveAccent2 || '#E05C20'} onChange={e => setAccent2(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                    <span className="absolute inset-0 pointer-events-none" style={{ background: effectiveAccent2 || '#E05C20' }} />
                  </label>
                </>
              )}
              {hasOverride && <button onClick={resetAccent} className="reset-btn">Reset</button>}
            </div>
          </div>

          {/* Preview */}
          <div ref={previewWrapRef} className="preview-area">
            <div style={{ width: `${8.5 * previewScale}in`, height: `${previewHeight * previewScale}px`, flexShrink: 0 }}>
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: '8.5in' }}>
                <TemplatePreview ref={previewRef} template={template} data={data} accent={effectiveAccent} accent2={effectiveAccent2} />
              </div>
            </div>
          </div>

          {/* Export bar */}
          <div className="export-bar">
            <div className="export-info">
              <div className="export-label">Currently</div>
              <div className="export-tpl">{template.label}</div>
            </div>
            <div className="export-btns">
              <button onClick={handleExportDocx} disabled={isExporting !== null}
                className="btn-word">
                {isExporting === 'docx' ? <Loader2 style={{width:"16px",height:"16px"}} /> : <FileText style={{width:"16px",height:"16px"}} />}
                Download Word
              </button>
              <button onClick={handleExportPDF} disabled={isExporting !== null}
                className="btn-pdf">
                {isExporting === 'pdf' ? <Loader2 style={{width:"16px",height:"16px"}} /> : <Download style={{width:"16px",height:"16px"}} />}
                Download PDF
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Off-screen print area */}
      <div ref={printAreaRef} className="pdf-print-area" aria-hidden="true">
        <TemplatePreview template={template} data={data} accent={effectiveAccent} accent2={effectiveAccent2} />
      </div>
    </div>
  );
}

export default ResumeGenerator;
