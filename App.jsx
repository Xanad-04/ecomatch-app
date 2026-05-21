import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  X, 
  MessageCircle, 
  User, 
  Award, 
  MapPin, 
  Clock, 
  Check, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Info, 
  Flame, 
  Compass, 
  Briefcase, 
  Share2, 
  CheckCircle2, 
  BookOpen, 
  AlertCircle,
  Undo2
} from 'lucide-react';

// === DEMO-DATEN FÜR NACHHALTIGKEITSPROJEKTE (FOKUS JADE-REGION & GLOBAL) ===
const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Kräutergarten Jade-Campus",
    org: "Green Office HAW",
    location: "Wilhelmshaven",
    distance: "0.8 km",
    duration: "2 Std./Woche",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    description: "Hilf uns, den ungenutzten Campusgarten in ein blühendes Bienenparadies und Kräuteroase zu verwandeln! Wir pflanzen, pflegen und ernten gemeinsam.",
    skills: ["Gärtnern", "Teamgeist"],
    category: "Urban Gardening",
    type: "Instant",
    karma: 50,
    welcomeMsg: "Moin! 🌿 Großartig, dass du unseren Campus-Kräutergarten unterstützen willst. Wir treffen uns jeden Donnerstag um 15:00 Uhr direkt hinter dem Hauptgebäude. Komm einfach in Arbeitskleidung vorbei! Hier ist der Link zu unserer Signal-Gruppe: https://signal.group/jade-campus"
  },
  {
    id: 2,
    title: "Strandreinigung Südstrand",
    org: "Küste im Wandel e.V.",
    location: "Wilhelmshaven",
    distance: "2.4 km",
    duration: "Einmalig (Sa.)",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80",
    description: "Gemeinsam befreien wir den Südstrand von Plastikmüll und Mikroplastik. Für Ausrüstung (Zangen, Beutel) und kalte Limonade danach ist gesorgt!",
    skills: ["Muskelkraft", "Gute Laune"],
    category: "Klimaschutz",
    type: "Instant",
    karma: 30,
    welcomeMsg: "Moin moin! 🌊 Danke für dein Like! Wir starten am Samstag um 10:00 Uhr am Helgolandkai. Handschuhe und Müllsäcke teilen wir vor Ort aus. Freuen uns riesig auf deine helfenden Hände!"
  },
  {
    id: 3,
    title: "Solar-Bilanzierung Friesland",
    org: "Solargenossenschaft Nordwest",
    location: "Sande & Remote",
    distance: "7.1 km",
    duration: "4 Std./Woche",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    description: "Suche nach klugen Köpfen, die uns bei der ökonomischen und ökologischen Datenanalyse von Dachanlagen helfen. Perfekt für Nachhaltigkeitsmanagement-Studierende!",
    skills: ["Finanzen", "Datenanalyse"],
    category: "Energiewende",
    type: "Review",
    karma: 120,
    welcomeMsg: "Hallo! ☀️ Vielen Dank für dein Interesse an unserer Solargenossenschaft. Dein Profil passt super zu unseren Anforderungen im Bereich Nachhaltigkeitsmanagement. Wann hättest du Zeit für ein kurzes Kennenlerngespräch via Teams?"
  },
  {
    id: 4,
    title: "Krötenzaun-Wache Friesland",
    org: "NABU Kreisgruppe",
    location: "Schortens",
    distance: "12.0 km",
    duration: "3 Std./Woche",
    image: "https://images.unsplash.com/photo-1507984211203-76701d7bb120?auto=format&fit=crop&w=600&q=80",
    description: "Frühaufsteher gesucht! Hilf uns, die Eimer an den Krötenzäunen zu kontrollieren und Amphibien sicher über die Straße zu tragen.",
    skills: ["Naturbegeistert", "Frühaufsteher"],
    category: "Artenschutz",
    type: "Instant",
    karma: 60,
    welcomeMsg: "Quak! 🐸 Toll, dass du dich für die Amphibienrettung engagieren möchtest. Unsere Schichten sind meist morgens zwischen 07:00 und 08:30 Uhr. Passt das bei dir?"
  },
  {
    id: 5,
    title: "Social Media Campaigning",
    org: "Weltladen Wilhelmshaven",
    location: "Hybrid / Remote",
    distance: "1.2 km",
    duration: "Flexible Zeiteinteilung",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
    description: "Wir wollen jünger werden! Gestalte unseren Instagram-Kanal mit ansprechenden Storys über fairen Handel und ökologische Lieferketten.",
    skills: ["Marketing", "Canva / Design"],
    category: "Kreislaufwirtschaft",
    type: "Review",
    karma: 80,
    welcomeMsg: "Hi! 📸 Super cool, dass du unseren Social-Media-Auftritt aufpeppen willst. Wir würden dir gerne unsere aktuellen Produkte zeigen. Hast du nächste Woche Zeit für einen Kaffee im Weltladen?"
  }
];

export default function App() {
  // === STATE MANAGEMENT ===
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('swipe'); // 'swipe', 'dashboard', 'matches', 'create'
  const [selectedChat, setSelectedChat] = useState(null); // holds matched project object for active chat
  const [chatMessages, setChatMessages] = useState({}); // { projectId: [messages] }
  const [typedMessage, setTypedMessage] = useState("");
  const [userKarma, setUserKarma] = useState(150);
  const [streakDays, setStreakDays] = useState(14);
  const [dailyHabits, setDailyHabits] = useState([
    { id: 1, text: "Heute emissionsfrei gependelt (Fahrrad/ÖPNV)", done: true, karma: 10 },
    { id: 2, text: "Eigene Mehrwegbox/Becher genutzt", done: false, karma: 5 },
    { id: 3, text: "1 Stunde für Umwelt-Projekt recherchiert", done: false, karma: 15 },
  ]);
  const [showMatchOverlay, setShowMatchOverlay] = useState(false);
  const [matchedProject, setMatchedProject] = useState(null);
  
  // Custom Project Creator State
  const [newTitle, setNewTitle] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newLocation, setNewLocation] = useState("Wilhelmshaven");
  const [newDuration, setNewDuration] = useState("3 Std./Woche");
  const [newCategory, setNewCategory] = useState("Urban Gardening");
  const [newDesc, setNewDesc] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newImage, setNewImage] = useState("");

  // Swipe Animation States
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left', 'right', 'super'
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // === MOCK AUTO RESPONSES ===
  const MOCK_REPLIES = [
    "Das klingt fantastisch! Lass uns das auf jeden Fall so machen. 🙌",
    "Danke für deine Nachricht! Ich bespreche das kurz im Team-Meeting heute Abend und melde mich direkt wieder.",
    "Bist du diese Woche vielleicht schon am Campus? Dann könnten wir uns ganz ungezwungen kurz treffen. ☕",
    "Perfekt! Du brauchst nichts weiter mitzubringen außer deiner Motivation und Motivation ist alles! 🌱",
  ];

  // === HANDLERS ===
  
  // Habit toggling
  const toggleHabit = (id) => {
    setDailyHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const nextState = !habit.done;
        setUserKarma(prevK => prevK + (nextState ? habit.karma : -habit.karma));
        return { ...habit, done: nextState };
      }
      return habit;
    }));
  };

  // Swipe Logic
  const handleSwipe = (direction) => {
    if (currentIndex >= projects.length) return;
    
    setSwipeDirection(direction);
    const currentProj = projects[currentIndex];

    setTimeout(() => {
      if (direction === 'right' || direction === 'super') {
        // Trigger Match
        setMatches(prev => [...prev, currentProj]);
        setMatchedProject(currentProj);
        setShowMatchOverlay(true);
        setUserKarma(prev => prev + currentProj.karma);
        
        // Initialize chat message
        setChatMessages(prev => ({
          ...prev,
          [currentProj.id]: [
            { id: 1, sender: 'org', text: currentProj.welcomeMsg, time: '11:00' }
          ]
        }));
      }
      
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setTouchOffset({ x: 0, y: 0 });
    }, 300);
  };

  // Drag Gesture Simulation for Tinder Vibe
  const handleTouchStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setTouchStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const offsetX = clientX - touchStart.x;
    const offsetY = clientY - touchStart.y;
    setTouchOffset({ x: offsetX, y: offsetY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 120;
    if (touchOffset.x > threshold) {
      handleSwipe('right');
    } else if (touchOffset.x < -threshold) {
      handleSwipe('left');
    } else if (touchOffset.y < -100) {
      handleSwipe('super');
    } else {
      // snap back
      setTouchOffset({ x: 0, y: 0 });
    }
  };

  // Messaging sending
  const sendMessage = () => {
    if (!typedMessage.trim() || !selectedChat) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
    }));
    
    const tempMessage = typedMessage;
    setTypedMessage("");

    // Simulate coordinator reply
    setTimeout(() => {
      const randomReply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'org',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), replyMsg]
      }));
    }, 1500);
  };

  // Create Project Submit
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle || !newOrg || !newDesc) return;

    const customProject = {
      id: Date.now(),
      title: newTitle,
      org: newOrg,
      location: newLocation,
      distance: "Lokal",
      duration: newDuration,
      image: newImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      description: newDesc,
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      category: newCategory,
      type: "Instant",
      karma: 70,
      welcomeMsg: `Moin! Danke für deine Unterstützung bei "${newTitle}". Wir freuen uns sehr auf dich!`
    };

    setProjects(prev => [customProject, ...prev]);
    setCurrentIndex(0); // Reset index so user swipes new project first!
    setActiveTab('swipe');
    
    // Reset form
    setNewTitle("");
    setNewOrg("");
    setNewDesc("");
    setNewSkills("");
    setNewImage("");
  };

  // Helper calculation for swiping rotation & movement styles
  const getCardStyle = () => {
    if (isDragging) {
      return {
        transform: `translate(${touchOffset.x}px, ${touchOffset.y}px) rotate(${touchOffset.x * 0.05}deg)`,
        transition: 'none'
      };
    }
    if (swipeDirection === 'right') {
      return {
        transform: 'translate(500px, 50px) rotate(30deg)',
        opacity: 0,
        transition: 'all 0.3s ease-out'
      };
    }
    if (swipeDirection === 'left') {
      return {
        transform: 'translate(-500px, 50px) rotate(-30deg)',
        opacity: 0,
        transition: 'all 0.3s ease-out'
      };
    }
    if (swipeDirection === 'super') {
      return {
        transform: 'translateY(-600px)',
        opacity: 0,
        transition: 'all 0.3s ease-out'
      };
    }
    return {
      transform: 'translate(0px, 0px) rotate(0deg)',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
  };

  return (
    <div className="min-h-screen bg-[#DCE9C5] flex items-center justify-center font-sans p-2 sm:p-6 text-[#111111] selection:bg-[#BCE467]/50 selection:text-black">
      
      {/* Decorative desktop background blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#BCE467]/30 rounded-full filter blur-3xl -z-10 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#18181B]/10 rounded-full filter blur-2xl -z-10 pointer-events-none hidden lg:block" />

      {/* Main smartphone/tablet container */}
      <div className="w-full max-w-md bg-[#F3F8EC] rounded-[2.5rem] shadow-2xl border-4 border-[#111111] overflow-hidden flex flex-col relative" style={{ height: '880px' }}>
        
        {/* Dynamic Status Bar (iOS mock) */}
        <div className="bg-[#F3F8EC] px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold text-[#111111] border-b border-[#111111]/5 z-10">
          <span>09:41 Uhr</span>
          <div className="w-24 h-4 bg-[#111111] rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 top-2 hidden sm:block" />
          <div className="flex items-center space-x-1">
            <span>5G</span>
            <div className="w-4 h-2.5 bg-[#111111] rounded-sm inline-block" />
          </div>
        </div>

        {/* Global App Header */}
        <header className="px-6 py-3 flex justify-between items-center bg-[#F3F8EC] border-b border-[#111111]/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-[#BCE467]">
              <Sparkles className="w-4 h-4 fill-[#BCE467]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">EcoMatch</span>
          </div>

          {/* User Karma Bubble */}
          <div className="flex items-center space-x-1 bg-[#111111] text-white py-1 px-3 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-[#BCE467]" />
            <span className="text-[#BCE467]">{userKarma} KP</span>
          </div>
        </header>

        {/* ==============================================
            TAB VIEW 1: SWIPING ENGINE (TINDER)
            ============================================== */}
        {activeTab === 'swipe' && (
          <div className="flex-1 flex flex-col justify-between p-4 relative overflow-hidden select-none">
            
            {/* Swiper Filter Indicator */}
            <div className="flex justify-between items-center px-2 mb-2 text-xs font-bold text-[#111111]/60">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Wilhelmshaven & Umgebung
              </span>
              <button className="p-1 rounded bg-[#111111]/5 hover:bg-[#111111]/10 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </div>

            {/* Swipeable Card Deck Container */}
            <div className="flex-1 relative flex items-center justify-center">
              {currentIndex < projects.length ? (
                // Render upcoming stack cards (visually behind the active card)
                projects.slice(currentIndex, currentIndex + 3).map((project, idx) => {
                  const isTopCard = idx === 0;
                  const scale = 1 - idx * 0.04;
                  const translateY = idx * 12;
                  
                  return (
                    <div
                      key={project.id}
                      className={`absolute w-full h-full max-h-[480px] rounded-[2rem] bg-white border-2 border-[#111111] overflow-hidden shadow-lg flex flex-col justify-between`}
                      style={{
                        zIndex: 10 - idx,
                        scale: isTopCard ? undefined : scale,
                        transform: isTopCard ? undefined : `translateY(${translateY}px)`,
                        display: idx > 1 ? 'none' : 'flex', // only render top two for optimal performance
                        ...(isTopCard ? getCardStyle() : {})
                      }}
                      onTouchStart={isTopCard ? handleTouchStart : undefined}
                      onTouchMove={isTopCard ? handleTouchMove : undefined}
                      onTouchEnd={isTopCard ? handleTouchEnd : undefined}
                      onMouseDown={isTopCard ? handleTouchStart : undefined}
                      onMouseMove={isTopCard ? handleTouchMove : undefined}
                      onMouseUp={isTopCard ? handleTouchEnd : undefined}
                      onMouseLeave={isTopCard ? (isDragging ? handleTouchEnd : undefined) : undefined}
                    >
                      {/* Swipe Stamp Overlays */}
                      {isTopCard && touchOffset.x > 50 && (
                        <div className="absolute top-10 left-10 z-50 border-4 border-emerald-500 text-emerald-500 font-extrabold text-2xl uppercase tracking-widest px-4 py-2 rounded-xl rotate-[-12deg] bg-white/90 pointer-events-none">
                          Eco Match
                        </div>
                      )}
                      {isTopCard && touchOffset.x < -50 && (
                        <div className="absolute top-10 right-10 z-50 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl uppercase tracking-widest px-4 py-2 rounded-xl rotate-[12deg] bg-white/90 pointer-events-none">
                          Nächstes
                        </div>
                      )}

                      {/* Card Image section */}
                      <div className="relative h-1/2 w-full bg-zinc-200">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover pointer-events-none"
                        />
                        
                        {/* Overlay Category Pill */}
                        <span className="absolute top-4 left-4 bg-[#111111] text-[#BCE467] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {project.category}
                        </span>

                        {/* Distance / Location Indicator */}
                        <div className="absolute bottom-3 left-3 bg-[#111111]/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#BCE467]" />
                          <span>{project.location} ({project.distance})</span>
                        </div>
                      </div>

                      {/* Card Details Section */}
                      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-extrabold text-xl leading-tight text-[#111111]">{project.title}</h3>
                            <span className="bg-[#BCE467]/20 text-[#111111] text-xs font-bold px-2 py-0.5 rounded border border-[#111111]/10 shrink-0 ml-2">
                              +{project.karma} KP
                            </span>
                          </div>
                          <p className="text-xs font-bold text-emerald-600 mb-2">von {project.org}</p>
                          <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-3">
                            {project.description}
                          </p>
                        </div>

                        {/* Needed Skills & Info row */}
                        <div>
                          <div className="flex items-center justify-between border-t border-[#111111]/5 pt-3">
                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-1 max-w-[70%]">
                              {project.skills.map((skill, idx) => (
                                <span key={idx} className="bg-zinc-100 text-[#111111] text-[10px] font-bold px-2 py-1 rounded-md">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            
                            {/* Duration Indicator */}
                            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{project.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* No Cards Left view */
                <div className="w-full text-center p-6 bg-white border-2 border-[#111111] rounded-[2rem] flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#BCE467]/20 flex items-center justify-center text-[#111111] mb-4 border-2 border-dashed border-[#111111]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-lg mb-1">Alles abgeswipt!</h3>
                  <p className="text-xs text-zinc-500 max-w-[240px] leading-relaxed mb-6">
                    Großartig! Du hast alle aktuellen Projekte in Wilhelmshaven bewertet. Komm später wieder oder erstelle ein eigenes!
                  </p>
                  <button 
                    onClick={() => {
                      setCurrentIndex(0);
                      setProjects(INITIAL_PROJECTS);
                    }}
                    className="bg-[#111111] hover:bg-zinc-800 text-[#BCE467] font-bold text-xs py-2.5 px-6 rounded-full transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Undo2 className="w-3.5 h-3.5" /> Stapel neu laden
                  </button>
                </div>
              )}
            </div>

            {/* Swipe Control Buttons */}
            {currentIndex < projects.length && (
              <div className="flex justify-center items-center space-x-6 py-4">
                {/* Dislike/Nope button */}
                <button 
                  onClick={() => handleSwipe('left')}
                  className="w-14 h-14 bg-[#111111] hover:bg-zinc-800 text-[#F1F8E6] hover:text-[#BCE467] rounded-full border-2 border-[#111111] flex items-center justify-center transition-transform active:scale-90 shadow-md"
                  aria-label="Dislike"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>

                {/* Info button */}
                <button 
                  onClick={() => alert(`Details zu: ${projects[currentIndex].title}\n\nDieses Projekt wurde vom ${projects[currentIndex].org} initiiert. Swipst du nach rechts, wirst du direkt mit ihnen gematcht und erhältst eine Einladung zur Koordination.`)}
                  className="w-10 h-10 bg-white hover:bg-zinc-100 text-[#111111] rounded-full border-2 border-[#111111] flex items-center justify-center transition-transform active:scale-90"
                  aria-label="Info"
                >
                  <Info className="w-5 h-5" />
                </button>

                {/* Like/Match button */}
                <button 
                  onClick={() => handleSwipe('right')}
                  className="w-14 h-14 bg-[#BCE467] hover:bg-[#A9D845] text-[#111111] rounded-full border-2 border-[#111111] flex items-center justify-center transition-transform active:scale-90 shadow-md"
                  aria-label="Like"
                >
                  <Heart className="w-6 h-6 stroke-[3] fill-[#111111]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==============================================
            TAB VIEW 2: INTERAKTIVES DASHBOARD (STATS / HABITS)
            ============================================== */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* User Profile Vibe Row */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-3xl border-2 border-[#111111]">
              <div className="w-14 h-14 rounded-2xl bg-[#BCE467] border-2 border-[#111111] overflow-hidden flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Willkommen zurück</span>
                <h2 className="text-lg font-black leading-tight text-[#111111]">Anna Jastin</h2>
                <p className="text-xs text-zinc-500 font-semibold flex items-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> 
                  <span>{streakDays} Tage Green-Streak</span>
                </p>
              </div>
            </div>

            {/* Daily Streak Tracker (Mon - Sun) */}
            <div className="bg-[#111111] text-white p-4 rounded-3xl border-2 border-[#111111]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-zinc-400">Deine Wochenaktivität</span>
                <span className="text-xs font-bold text-[#BCE467] bg-[#BCE467]/10 px-2 py-0.5 rounded">Level 3: Setzling</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((day, i) => {
                  const active = i < 5; // Simulating active streak from Mon to Fri
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-400 mb-1 font-bold">{day}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${active ? 'bg-[#BCE467] border-[#BCE467] text-[#111111]' : 'border-zinc-700 text-zinc-500'}`}>
                        {active ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-[10px] font-bold">{i+1}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Habit Challenge Row */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-[#111111]/70 uppercase tracking-wider">Tägliche Grüne Gewohnheiten</h3>
              <div className="space-y-2">
                {dailyHabits.map((habit) => (
                  <div 
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-[#111111] cursor-pointer hover:bg-[#F1F8E6]/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3 pr-2">
                      <div className={`w-6 h-6 rounded-lg border-2 border-[#111111] flex items-center justify-center shrink-0 ${habit.done ? 'bg-[#BCE467]' : 'bg-transparent'}`}>
                        {habit.done && <Check className="w-4 h-4 stroke-[3] text-[#111111]" />}
                      </div>
                      <span className={`text-xs font-bold leading-snug ${habit.done ? 'line-through text-zinc-400' : 'text-[#111111]'}`}>
                        {habit.text}
                      </span>
                    </div>
                    <span className="text-[10px] font-black bg-zinc-100 px-2 py-1 rounded border border-[#111111]/10 text-emerald-600 shrink-0">
                      +{habit.karma} KP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Board Graphic (as seen in screenshots) */}
            <div className="bg-white p-4 rounded-3xl border-2 border-[#111111] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400">Laufende Projekte</span>
                <span className="text-xs font-black text-[#111111] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 80% Fortschritt
                </span>
              </div>
              
              <div className="space-y-3">
                {/* Visual Gantt Bar Mimic */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Campus Kräutergarten</span>
                    <span className="text-emerald-600">Erde aufgelockert ✔</span>
                  </div>
                  <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-[#111111]/15 relative">
                    <div className="h-full bg-[#BCE467] rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Strandreinigung Südstrand</span>
                    <span className="text-[#111111]/50">Geplant: Sa. 10:00</span>
                  </div>
                  <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-[#111111]/15 relative">
                    <div className="h-full bg-[#111111] rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Fact / Eco Tip Card */}
            <div className="bg-[#BCE467] text-[#111111] p-4 rounded-3xl border-2 border-[#111111] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>
              <h4 className="font-extrabold text-sm mb-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4 fill-[#111111]" /> Tages-Eco-Tipp
              </h4>
              <p className="text-xs font-medium leading-relaxed">
                Wusstest du schon? Am Jade-Campus sparen wir jährlich rund 1,2 Tonnen CO₂, allein indem wir die Heizungen am Wochenende absenken. Jede kleine Tat zählt!
              </p>
            </div>

          </div>
        )}

        {/* ==============================================
            TAB VIEW 3: MATCHES & ACTIVE CHATS
            ============================================== */}
        {activeTab === 'matches' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {!selectedChat ? (
              // Chat/Match List Screen
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Active Matches Carousel */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">Neue EcoMatches</h3>
                  
                  {matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-[#111111] border-dashed">
                      <Heart className="w-8 h-8 text-zinc-300 mb-2" />
                      <p className="text-xs font-bold text-zinc-400 text-center">Noch keine Matches. Geh swipen!</p>
                    </div>
                  ) : (
                    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                      {matches.map((proj) => (
                        <div 
                          key={proj.id} 
                          onClick={() => setSelectedChat(proj)}
                          className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-full border-2 border-[#111111] overflow-hidden relative p-0.5 bg-[#BCE467]">
                            <img 
                              src={proj.image} 
                              alt={proj.title} 
                              className="w-full h-full object-cover rounded-full" 
                            />
                            {/* Unread indicator */}
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white" />
                          </div>
                          <span className="text-[10px] font-bold text-center max-w-[64px] truncate text-[#111111]">{proj.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Messages List */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">Unterhaltungen</h3>
                  
                  {matches.length === 0 ? (
                    <p className="text-xs text-zinc-400 pl-1">Sobald du Matches hast, werden hier deine Chats gestartet.</p>
                  ) : (
                    matches.map((proj) => {
                      const messagesForProj = chatMessages[proj.id] || [];
                      const lastMessage = messagesForProj[messagesForProj.length - 1];

                      return (
                        <div 
                          key={proj.id}
                          onClick={() => setSelectedChat(proj)}
                          className="flex items-center space-x-3 p-3 bg-white hover:bg-[#F1F8E6]/30 rounded-2xl border-2 border-[#111111] cursor-pointer transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#111111]/20 bg-zinc-100 shrink-0">
                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-xs font-extrabold truncate text-[#111111]">{proj.title}</h4>
                              <span className="text-[9px] text-zinc-400 font-bold shrink-0">{lastMessage ? lastMessage.time : "Jetzt"}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-bold truncate mt-0.5">{proj.org}</p>
                            <p className="text-xs text-zinc-600 truncate mt-1">
                              {lastMessage ? lastMessage.text : "Starte das Gespräch..."}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              // Active Chat view
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 bg-[#F3F8EC] border-b border-[#111111]/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setSelectedChat(null)}
                      className="p-1 rounded hover:bg-zinc-200"
                    >
                      <X className="w-5 h-5 text-[#111111]" />
                    </button>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#111111]/20">
                      <img src={selectedChat.image} alt={selectedChat.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#111111]">{selectedChat.title}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold">Koordinator: {selectedChat.org}</p>
                    </div>
                  </div>
                  
                  {/* Option Menu (Info shortcut) */}
                  <button 
                    onClick={() => alert(`Über ${selectedChat.title}:\n\n📍 Ort: ${selectedChat.location}\n⏰ Zeitaufwand: ${selectedChat.duration}\n🛠 Nötige Skills: ${selectedChat.skills.join(', ')}`)}
                    className="p-2 bg-white rounded-full border border-[#111111]/10 hover:bg-zinc-100"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFDF8]">
                  <div className="text-center my-2">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-200">
                      Du wurdest mit diesem Projekt gematcht! 🎉
                    </span>
                  </div>

                  {(chatMessages[selectedChat.id] || []).map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-3 text-xs ${
                          isUser 
                            ? 'bg-[#111111] text-white rounded-tr-none' 
                            : 'bg-zinc-100 text-[#111111] rounded-tl-none border border-[#111111]/10'
                        }`}>
                          <p className="leading-relaxed font-medium">{msg.text}</p>
                          <span className={`text-[9px] block text-right mt-1.5 font-semibold ${
                            isUser ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat input box */}
                <div className="p-3 bg-white border-t border-[#111111]/10 flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1 bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#111111]"
                  />
                  <button 
                    onClick={sendMessage}
                    className="bg-[#BCE467] text-[#111111] p-2.5 rounded-xl border-2 border-[#111111] hover:bg-[#A9D845] transition-colors active:scale-95 shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ==============================================
            TAB VIEW 4: ADD/CREATE PROJECTS (INITIATOR MODE)
            ============================================== */}
        {activeTab === 'create' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-white p-4 rounded-3xl border-2 border-[#111111]">
              <h3 className="text-sm font-black text-[#111111] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 stroke-[3]" /> Eigenes Projekt inserieren
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                Hast du eine Müllsammelaktion, eine studentische Arbeitsgruppe oder suchst Hilfe im Urban Gardening am Campus? Erstelle deine Karte in Sekunden!
              </p>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 bg-white p-5 rounded-3xl border-2 border-[#111111]">
              <div>
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Projekt-Titel</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Z.B. Fahrrad-Reparaturstation bauen"
                  className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Initiative / Organisation</label>
                  <input 
                    type="text" 
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="Z.B. Green Office"
                    className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Zeitaufwand</label>
                  <input 
                    type="text" 
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="Z.B. 2 Std./Woche"
                    className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Ort</label>
                  <input 
                    type="text" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Z.B. Wilhelmshaven"
                    className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Kategorie</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111] font-semibold"
                  >
                    <option value="Urban Gardening">Urban Gardening</option>
                    <option value="Klimaschutz">Klimaschutz</option>
                    <option value="Energiewende">Energiewende</option>
                    <option value="Artenschutz">Artenschutz</option>
                    <option value="Kreislaufwirtschaft">Kreislaufwirtschaft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Projektbeschreibung (max. 280 Zeichen)</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Beschreibe kurz, worum es geht und wie Helfer einen Impact hinterlassen können..."
                  rows="3"
                  maxLength="280"
                  className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111] leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Benötigte Skills (Kommagetrennt)</label>
                <input 
                  type="text" 
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Z.B. Handwerk, Organisation, Grafikdesign"
                  className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase mb-1">Bild-URL (Optional)</label>
                <input 
                  type="url" 
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-50 border-2 border-[#111111]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#BCE467] hover:bg-[#A9D845] text-[#111111] font-bold py-3 px-4 rounded-xl border-2 border-[#111111] transition-transform active:scale-95 flex items-center justify-center gap-1.5 mt-2 text-xs"
              >
                <Sparkles className="w-4 h-4" /> Projektkarte live schalten
              </button>
            </form>
          </div>
        )}

        {/* ==============================================
            INTERACTIVE MATCH OVERLAY (BOOM MODAL)
            ============================================== */}
        {showMatchOverlay && matchedProject && (
          <div className="absolute inset-0 bg-[#111111]/95 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
            
            {/* Success Micro Animation */}
            <div className="animate-bounce mb-4">
              <Sparkles className="w-16 h-16 text-[#BCE467] fill-[#BCE467]" />
            </div>

            <h2 className="text-4xl font-black tracking-tight text-[#BCE467] uppercase mb-1 scale-105 transition-transform duration-300">
              BUMM!
            </h2>
            <p className="text-lg font-bold mb-8">Ein neues EcoMatch für dich!</p>

            {/* Avatar Collision Mimic */}
            <div className="flex items-center justify-center -space-x-4 mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-[#BCE467] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Dein Profil" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-[#BCE467] overflow-hidden bg-white">
                <img 
                  src={matchedProject.image} 
                  alt={matchedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h3 className="font-extrabold text-xl mb-1">{matchedProject.title}</h3>
            <p className="text-xs text-zinc-400 font-semibold mb-8">initiiert von {matchedProject.org}</p>

            {/* Action buttons inside Overlay */}
            <div className="w-full space-y-3 px-4">
              <button 
                onClick={() => {
                  setShowMatchOverlay(false);
                  setActiveTab('matches');
                  setSelectedChat(matchedProject);
                }}
                className="w-full bg-[#BCE467] text-[#111111] font-extrabold py-3.5 px-4 rounded-full border-2 border-[#BCE467] transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> Direkt Nachricht schreiben
              </button>
              
              <button 
                onClick={() => setShowMatchOverlay(false)}
                className="w-full bg-transparent hover:bg-white/10 text-white font-bold py-3 px-4 rounded-full border-2 border-white/20 transition-colors text-xs"
              >
                Weiter swipen
              </button>
            </div>
          </div>
        )}

        {/* Global Bottom Navigation bar (Matching your designs) */}
        <nav className="bg-[#111111] py-4 px-6 flex justify-between items-center border-t-2 border-[#111111] relative z-20">
          
          {/* Nav Item: Swipe (Tinder Deck) */}
          <button 
            onClick={() => { setActiveTab('swipe'); setSelectedChat(null); }}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'swipe' ? 'text-[#BCE467]' : 'text-zinc-500'}`}
          >
            <Compass className="w-5.5 h-5.5 stroke-[2.5]" />
            <span className="text-[10px] font-bold">Entdecken</span>
          </button>

          {/* Nav Item: Dashboard (Habits & Karma) */}
          <button 
            onClick={() => { setActiveTab('dashboard'); setSelectedChat(null); }}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-[#BCE467]' : 'text-zinc-500'}`}
          >
            <TrendingUp className="w-5.5 h-5.5 stroke-[2.5]" />
            <span className="text-[10px] font-bold">Aktivität</span>
          </button>

          {/* Quick-Action: Create Project Card */}
          <button 
            onClick={() => { setActiveTab('create'); setSelectedChat(null); }}
            className={`w-12 h-12 rounded-2xl border-2 border-[#111111] flex items-center justify-center -mt-8 shadow-md transition-transform active:scale-95 ${
              activeTab === 'create' ? 'bg-[#111111] text-[#BCE467] border-[#BCE467]' : 'bg-[#BCE467] text-[#111111]'
            }`}
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Nav Item: Matches / Chat */}
          <button 
            onClick={() => setActiveTab('matches')}
            className={`flex flex-col items-center space-y-1 relative ${activeTab === 'matches' ? 'text-[#BCE467]' : 'text-zinc-500'}`}
          >
            <MessageCircle className="w-5.5 h-5.5 stroke-[2.5]" />
            <span className="text-[10px] font-bold">Matches</span>
            {matches.length > 0 && (
              <span className="absolute -top-1.5 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#111111]" />
            )}
          </button>

          {/* Mock Nav Item: Profile (Triggers Alert) */}
          <button 
            onClick={() => alert(`Anna Jastin\n\nStudiengang: Nachhaltigkeitsmanagement (M.Sc.)\nKarma-Level: 3 (Setzling)\nMitglied seit: Mai 2026`)}
            className="flex flex-col items-center space-y-1 text-zinc-500"
          >
            <User className="w-5.5 h-5.5 stroke-[2.5]" />
            <span className="text-[10px] font-bold">Profil</span>
          </button>

        </nav>

      </div>
    </div>
  );
