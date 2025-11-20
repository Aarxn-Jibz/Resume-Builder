import React, { useState, useEffect } from 'react';
import { GripVertical, Printer, LayoutTemplate, User, Briefcase, GraduationCap, Award, Zap, Mail, Phone, MapPin, Linkedin, Loader2, Save } from 'lucide-react';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://kjaitekzidxtuxbcolxu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wlQhRPtvDbPiV1GlbFmM9g_H2n4EiWX';

// --- STATIC CONFIG ---
const SECTION_ICONS = {
  summary: <User size={16} />,
  experience: <Briefcase size={16} />,
  education: <GraduationCap size={16} />,
  skills: <Zap size={16} />,
  certifications: <Award size={16} />
};

// --- MOCK DATA (Fallback) ---
const INITIAL_DATA = {
  personal: {
    name: "Michael Harris",
    role: "Digital Marketing | SEO | SEM | Content Marketing",
    email: "michael.harris@email.com",
    phone: "+61 412 345 678",
    location: "Sydney, Australia",
    linkedin: "linkedin.com/in/michaelharris"
  },
  summary: {
    title: "Professional Summary",
    content: "Results-oriented marketing professional with over 5 years of experience in digital marketing, brand strategy, and content creation. Proven ability to drive brand growth, increase online engagement, and deliver data-driven results. Expert in utilizing digital tools and analytics to optimize marketing campaigns and achieve business objectives."
  },
  experience: {
    title: "Work Experience",
    items: [
      {
        role: "Marketing Manager",
        company: "XYZ Corporation",
        location: "Sydney, NSW",
        date: "January 2022 - Present",
        points: [
          "Lead a team of 5 in creating and executing digital marketing strategies across multiple platforms.",
          "Achieved a 35% increase in website traffic and 50% boost in social media engagement within the first year.",
          "Managed a marketing budget of $200,000, ensuring maximum ROI through cost-effective advertising strategies."
        ]
      },
      {
        role: "Digital Marketing Specialist",
        company: "ABC Solutions",
        location: "Melbourne, VIC",
        date: "June 2018 - December 2021",
        points: [
          "Developed and executed SEO and SEM strategies that increased organic search traffic by 25%.",
          "Created and managed Google Ads and Facebook Ads campaigns, resulting in a 20% increase in qualified leads.",
          "Produced engaging content for blogs, newsletters, and social media platforms to attract target audiences."
        ]
      }
    ]
  },
  education: {
    title: "Education",
    items: [
      {
        degree: "Bachelor of Marketing",
        school: "University of Sydney",
        location: "Sydney, NSW",
        date: "Graduated: 2018"
      }
    ]
  },
  skills: {
    title: "Skills",
    items: [
      "Digital Marketing Strategy", "SEO & SEM", "Google Analytics & SEMrush",
      "Social Media Marketing", "Content Creation & Copywriting", "Budget Management", "Data Analysis"
    ]
  },
  certifications: {
    title: "Certifications",
    items: [
      "Google Analytics Certified",
      "Facebook Blueprint Certification",
      "HubSpot Inbound Marketing Certification"
    ]
  }
};

// --- DRAG & DROP COMPONENT ---
const DraggableList = ({ items, onReorder, renderItem }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const onDragStart = (e, index) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
    const ghost = e.target.cloneNode(true);
    ghost.style.position = "absolute"; 
    ghost.style.top = "-1000px"; 
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const onDragOver = (index) => {
    const draggedOverItem = items[index];
    if (draggedItem === draggedOverItem) return;

    const itemsClone = items.filter(item => item !== draggedItem);
    itemsClone.splice(index, 0, draggedItem);
    onReorder(itemsClone);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
          className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-move group"
        >
          <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 p-1 rounded"
          >
            <GripVertical size={20} />
          </div>
          <div className="flex-1 select-none">
            {renderItem(item)}
          </div>
        </li>
      ))}
    </ul>
  );
};

// --- MAIN COMPONENT ---
export default function ResumeBuilder() {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [resumeData, setResumeData] = useState(INITIAL_DATA);
  // We track the DB ID to ensure we update the same row instead of creating duplicates
  const [dbId, setDbId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [layoutOrder, setLayoutOrder] = useState([
    { id: 'summary', label: 'Professional Summary' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' }
  ]);

  // --- 1. Load Supabase Script Dynamically ---
  useEffect(() => {
    if (window.supabase) {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      setSupabaseClient(client);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://unpkg.com/@supabase/supabase-js@2";
    script.async = true;
    script.onload = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        setSupabaseClient(client);
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup is optional for script tags, but good practice implies checking
    };
  }, []);

  // --- 2. Fetch Data when Client is Ready ---
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!supabaseClient) return;
      
      try {
        let { data, error } = await supabaseClient
          .from('resumes')
          .select('*')
          .limit(1); 
        
        if (error) throw error;

        if (data && data.length > 0) {
          const row = data[0];
          setDbId(row.id);

          // --- MAPPING: DB Schema -> React State ---
          const reconstructedData = {
            personal: {
              name: row.name || "",
              role: row.role || "",
              email: row.email || "",
              phone: row.phone || "",
              location: row.location || "",
              linkedin: row.linkedin || ""
            },
            // DB has summary as TEXT, state expects object { title, content }
            summary: {
              title: "Professional Summary", 
              content: row.summary || ""
            },
            // JSONB columns map directly if structure matches
            experience: row.experience || INITIAL_DATA.experience,
            education: row.education || INITIAL_DATA.education,
            skills: row.skills || INITIAL_DATA.skills,
            certifications: row.certifications || INITIAL_DATA.certifications
          };
          
          setResumeData(reconstructedData);
        }
      } catch (err) {
        console.error("Supabase Fetch Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, [supabaseClient]);

  // --- 3. Save Data Function ---
  const saveResumeData = async () => {
    if (!supabaseClient) {
      alert("Database connection not ready yet.");
      return;
    }

    setIsSaving(true);
    try {
      // --- MAPPING: React State -> DB Schema ---
      const payload = { 
        // Personal info flattened to columns
        name: resumeData.personal.name,
        role: resumeData.personal.role,
        email: resumeData.personal.email,
        phone: resumeData.personal.phone,
        location: resumeData.personal.location,
        linkedin: resumeData.personal.linkedin,

        // Summary is TEXT column
        summary: resumeData.summary.content,

        // Complex sections as JSONB
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        certifications: resumeData.certifications
      };

      // If we have a DB ID, include it to perform an UPDATE instead of INSERT
      if (dbId) {
        payload.id = dbId;
      }

      const { data, error } = await supabaseClient
        .from('resumes')
        .upsert([payload])
        .select(); 
        
      if (error) throw error;
      
      // Update local ID if we just created a new row
      if (data && data[0]?.id) {
        setDbId(data[0].id);
      }
      
      setTimeout(() => setIsSaving(false), 800);
    } catch (err) {
      console.error("Supabase Save Error:", err.message);
      alert(`Save failed: ${err.message}`);
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // --- RENDERERS ---
  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return (
          <div className="mb-6">
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {resumeData.summary?.content || ""}
            </p>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6 mb-6">
            {resumeData.experience?.items?.map((job, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{job.role}</h3>
                  <span className="text-sm text-gray-600 whitespace-nowrap">{job.date}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2 text-sm text-gray-700">
                  <span className="italic font-medium">{job.company}</span>
                  <span>{job.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
                  {job.points?.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-4 mb-6">
            {resumeData.education?.items?.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.school}, {edu.location}</p>
                </div>
                <span className="text-sm text-gray-600 font-medium">{edu.date}</span>
              </div>
            ))}
          </div>
        );
      case 'skills':
        return (
          <div className="mb-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 list-disc list-inside text-sm text-gray-700">
              {resumeData.skills?.items?.map((skill, idx) => (
                <li key={idx} className="marker:text-gray-400">{skill}</li>
              ))}
            </ul>
          </div>
        );
      case 'certifications':
        return (
          <div className="mb-6">
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {resumeData.certifications?.items?.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // --- TEMPLATES ---
  const ClassicTemplate = () => (
    <div className="bg-white h-full p-[15mm] shadow-sm text-left font-sans">
      <header className="text-center mb-8 border-b-2 border-transparent pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">{resumeData.personal.name}</h1>
        <p className="text-md font-medium text-gray-700 mb-3">{resumeData.personal.role}</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1"><MapPin size={14} /> {resumeData.personal.location}</span>
          <span className="flex items-center gap-1 text-blue-600 underline"><Mail size={14} /> {resumeData.personal.email}</span>
          <span className="flex items-center gap-1"><Phone size={14} /> {resumeData.personal.phone}</span>
          {resumeData.personal.linkedin && <span className="flex items-center gap-1 text-blue-600 underline"><Linkedin size={14} /> {resumeData.personal.linkedin}</span>}
        </div>
      </header>
      {layoutOrder.map((section) => (
        <section key={section.id} className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-300 mb-4 pb-1">
            {resumeData[section.id].title}
          </h2>
          {renderSectionContent(section.id)}
        </section>
      ))}
    </div>
  );

  const ElegantTemplate = () => (
    <div className="bg-white h-full p-[15mm] shadow-sm font-serif">
      <header className="mb-10 flex justify-between items-start border-b-4 border-black pb-6">
        <div className="text-right w-full">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 uppercase tracking-tight font-serif">{resumeData.personal.name}</h1>
          <div className="flex flex-col items-end text-sm text-gray-600 gap-1 font-sans">
            <span>{resumeData.personal.location} • {resumeData.personal.phone}</span>
            <span className="text-gray-800 font-medium">{resumeData.personal.email}</span>
          </div>
        </div>
      </header>
      {layoutOrder.map((section) => (
        <section key={section.id} className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest border-b border-black w-full pb-1">
              {resumeData[section.id].title}
            </h2>
          </div>
          <div className="font-sans">
            {renderSectionContent(section.id)}
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <div className="h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden print:hidden z-20 shadow-xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
              <LayoutTemplate className="w-6 h-6" />
              Resume Builder
            </h2>
            <div className="text-slate-500 text-xs mt-1 flex items-center gap-2">
               {!supabaseClient ? (
                 <span className="text-slate-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Loading DB...</span>
               ) : isSaving ? (
                 <span className="text-amber-600 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Saving to Supabase...</span>
               ) : (
                 <span className="text-green-600 flex items-center gap-1">● DB Connected</span>
               )}
            </div>
          </div>
        </div>

        {/* Tabs/Content Container */}
        <div className="flex-1 overflow-y-auto">
            
          {/* Template Selection */}
          <div className="p-6 border-b border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Select Template</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTemplate('classic')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${activeTemplate === 'classic' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                Classic
                <span className="block text-[10px] font-normal opacity-70 mt-1">Centered & Clean</span>
              </button>
              <button
                onClick={() => setActiveTemplate('elegant')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${activeTemplate === 'elegant' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                Elegant
                <span className="block text-[10px] font-normal opacity-70 mt-1">Serif & Right-Aligned</span>
              </button>
            </div>
          </div>

          {/* Layout Manager */}
          <div className="p-6 border-b border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Layout Order</label>
            <DraggableList
              items={layoutOrder}
              onReorder={setLayoutOrder}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{SECTION_ICONS[item.id]}</span>
                  <span className="font-medium text-sm text-slate-700">{item.label}</span>
                </div>
              )}
            />
          </div>

          {/* Edit Form */}
          <div className="p-6 pb-24">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Edit Personal Info</label>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personal.name}
                  onChange={(e) => updatePersonal('name', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Job Title</label>
                <input
                  type="text"
                  value={resumeData.personal.role}
                  onChange={(e) => updatePersonal('role', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Email</label>
                <input
                  type="text"
                  value={resumeData.personal.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Phone</label>
                <input
                  type="text"
                  value={resumeData.personal.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
               <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Location</label>
                <input
                  type="text"
                  value={resumeData.personal.location}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            
            <button
                onClick={saveResumeData}
                disabled={!supabaseClient}
                className={`w-full text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md mt-6 ${!supabaseClient ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
               {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save to Supabase'}
            </button>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <button
            onClick={handlePrint}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-indigo-500/30"
          >
            <Printer size={18} />
            Print / PDF
          </button>
        </div>
      </aside>

      {/* MAIN PREVIEW AREA */}
      <main className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-12 flex justify-center print:bg-white print:p-0 print:overflow-visible scrollbar-thin scrollbar-thumb-slate-300">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none transform origin-top transition-transform duration-200">
          {activeTemplate === 'classic' ? <ClassicTemplate /> : <ElegantTemplate />}
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { -webkit-print-color-adjust: exact; }
          aside { display: none !important; }
          main { padding: 0 !important; background: white !important; height: auto !important; overflow: visible !important; }
          /* Ensure single page content doesn't break awkwardly */
          section { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}