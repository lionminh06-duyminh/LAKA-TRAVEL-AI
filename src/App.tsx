import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Check, Copy, MapPin, Calendar, ChevronRight, 
  ChevronLeft, Plus, Search, Award, Sparkles, Lock, 
  Unlock, Smile, LogOut, RefreshCw, Flame, Gift, 
  Smartphone, Heart, Info, Coffee, Utensils, Laptop, Eye, CheckSquare, Square
} from 'lucide-react';
import { 
  VibeType, RequirementState, Activity, DayPlan, 
  Itinerary, SavedTrip, UserStats, Voucher 
} from './types';
import { 
  PRESET_CITIES, VIBE_DETAILS, DEFAULT_VOUCHERS, 
  PASSPORT_STICKERS, CustomSticker 
} from './data';

export default function App() {
  // Navigation states
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'faceid' | 'login' | 'dashboard' | 'loading' | 'itinerary'>('splash');
  const [phoneTab, setPhoneTab] = useState<'planner' | 'trips' | 'passport' | 'vouchers'>('planner');
  
  // Auth simulation states
  const [userEmail, setUserEmail] = useState('nguyenbaoduyminh@gmail.com');
  const [isFaceIdScanning, setIsFaceIdScanning] = useState(false);
  const [faceIdSuccess, setFaceIdSuccess] = useState(false);
  
  // Search and planning wizard states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0]);
  const [customDestination, setCustomDestination] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<VibeType>('Chill');
  const [wizardStep, setWizardStep] = useState(1);
  
  // Requirements state
  const [requirements, setRequirements] = useState<RequirementState>({
    days: 3,
    budget: 'moderate',
    companions: 'friends',
    pace: 'balanced',
    priorities: ['Ăn uống 🍜', 'Sống ảo 📸', 'Khám phá 🗺️']
  });

  // Custom priority list options
  const PRIORITY_OPTIONS = [
    'Sống ảo 📸', 'Ăn uống 🍜', 'Nghỉ dưỡng 🍃', 'Quẩy đêm 🍻', 
    'Nghệ thuật 🎸', 'Săn mây ☁️', 'Mua sắm 🛍️', 'Khám phá 🗺️'
  ];

  // AI Planner states
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loadingText, setLoadingText] = useState('Đang khởi hành tâm hồn...');
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    tripsCount: 0,
    unlockedVibes: [],
    scannedStamps: [],
    vouchersClaimed: []
  });
  
  // Vouchers state
  const [vouchers, setVouchers] = useState<Voucher[]>(DEFAULT_VOUCHERS);
  const [claimedVoucherPopup, setClaimedVoucherPopup] = useState<Voucher | null>(null);
  const [activityCheckedStates, setActivityCheckedStates] = useState<Record<string, boolean>>({});
  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);

  // Load state from localStorage on startup
  useEffect(() => {
    try {
      const storedTrips = localStorage.getItem('laka_saved_trips');
      if (storedTrips) setSavedTrips(JSON.parse(storedTrips));

      const storedStats = localStorage.getItem('laka_user_stats');
      if (storedStats) {
        setUserStats(JSON.parse(storedStats));
      } else {
        // Safe default initial stats
        const initialStats: UserStats = {
          tripsCount: 1,
          unlockedVibes: ['Chill'],
          scannedStamps: ['Đà Lạt'],
          vouchersClaimed: []
        };
        setUserStats(initialStats);
        localStorage.setItem('laka_user_stats', JSON.stringify(initialStats));
      }
      
      const storedVouchers = localStorage.getItem('laka_vouchers');
      if (storedVouchers) setVouchers(JSON.parse(storedVouchers));
    } catch (e) {
      console.error("Error reading from localStorage", e);
    }
  }, []);

  // Update user stats and localStorage helpers
  const saveUserData = (updatedTrips: SavedTrip[], updatedStats: UserStats, updatedVouchers?: Voucher[]) => {
    setSavedTrips(updatedTrips);
    setUserStats(updatedStats);
    localStorage.setItem('laka_saved_trips', JSON.stringify(updatedTrips));
    localStorage.setItem('laka_user_stats', JSON.stringify(updatedStats));
    if (updatedVouchers) {
      setVouchers(updatedVouchers);
      localStorage.setItem('laka_vouchers', JSON.stringify(updatedVouchers));
    }
  };

  // Face ID animation simulator
  const handleTriggerFaceId = () => {
    setIsFaceIdScanning(true);
    setFaceIdSuccess(false);
    
    setTimeout(() => {
      setFaceIdSuccess(true);
      setTimeout(() => {
        setIsFaceIdScanning(false);
        setCurrentScreen('dashboard');
        // Add default starting trip to stats if empty
        if (userStats.tripsCount === 0) {
          const freshStats = {
            ...userStats,
            tripsCount: 1,
            unlockedVibes: ['Chill' as VibeType],
            scannedStamps: ['Đà Lạt']
          };
          setUserStats(freshStats);
          localStorage.setItem('laka_user_stats', JSON.stringify(freshStats));
        }
      }, 1200);
    }, 2200);
  };

  // Filter preset cities
  const filteredCities = PRESET_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.slogan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle priority selection
  const handleTogglePriority = (item: string) => {
    setRequirements(prev => {
      const exists = prev.priorities.includes(item);
      const newPriorities = exists 
        ? prev.priorities.filter(p => p !== item)
        : [...prev.priorities, item];
      return { ...prev, priorities: newPriorities };
    });
  };

  // API Client-side calling (proxied server-side via Express)
  const handleBuildItinerary = async () => {
    setCurrentScreen('loading');
    setWizardStep(1); // Reset step back
    
    const loadingSentences = [
      'Đang tút tát hành lý gọn gàng... 🎒',
      'Đang kết nối tần số tâm linh du hí... 🔮',
      'LaKa đang chất vấn các thổ địa bản xứ... 🗺️',
      'Đang mài trơn la bàn định vị toạ độ thơ... 🧭',
      'Sắp đặt mốc thời gian sáng - trưa - chiều - tối... ⏰',
      'Đang rủ sếp cho nghỉ phép chữa lành... 💼',
      'Hoàn tất bốc quẻ chuyến đi cực cháy! 🚀'
    ];

    let sentenceIndex = 0;
    const interval = setInterval(() => {
      if (sentenceIndex < loadingSentences.length - 1) {
        setLoadingText(loadingSentences[sentenceIndex]);
        sentenceIndex++;
      }
    }, 900);

    const destinationName = customDestination ? customDestination : selectedCity.name;

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destinationName,
          vibe: selectedVibe,
          requirements: requirements
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: Itinerary = await response.json();
      
      clearInterval(interval);
      setLoadingText('Mở quẻ thành công! 🌟');
      
      setTimeout(() => {
        setItinerary(data);
        setCurrentScreen('itinerary');
      }, 500);

    } catch (error) {
      console.error("AI Planner generation failed:", error);
      clearInterval(interval);
      setLoadingText('Có lỗi xảy ra nhưng LaKa đã dự phòng lịch trình xịn đét cho bạn! ⚡');
      
      // Fallback local calculations if network fails
      setTimeout(() => {
        // Simulating the dynamic response
        const fallback: Itinerary = {
          destination: destinationName,
          vibe: selectedVibe,
          days: requirements.days,
          budget: requirements.budget,
          title: `Oanh Tạc ${destinationName}: Chuyến Đi ${selectedVibe} Cực Keo Lỳ!`,
          tagline: `LaKa đi, nghỉ làm chi! Lên đồ check-in cùng hội bạn cạ cứng thôi nào!`,
          estimatedTotal: requirements.budget === 'economy' ? "1.500.000đ / người" : requirements.budget === 'moderate' ? "3.000.000đ / người" : "6.500.000đ / người",
          daysPlan: Array.from({ length: requirements.days }).map((_, idx) => ({
            dayNumber: idx + 1,
            theme: `Hết Nấc Ngày ${idx + 1}: Chinh phục các toạ độ hot`,
            activities: [
              {
                title: "Ăn sáng tràn trề năng lượng",
                description: `Bắt đầu ngày oanh tạc tại quán đặc sản có lịch sử lâu đời ở ${destinationName}. Thưởng thức hương vị nóng hổi thanh mát quyến rũ dã man!`,
                location: `Hẻm ăn uống trung tâm`,
                timeOfDay: "Morning",
                approxCost: "50.000đ",
                tip: "Mang theo máy ảnh sạc sẵn pin để chụp sương sương ánh bình minh nha."
              },
              {
                title: "Check-in sống ảo cực dính",
                description: "Một góc chill độc quyền của cộng đồng địa phương với background chất chơi, lên outfit retro cực kỳ hợp rơ.",
                location: "Con dốc hoa hoặc Tiệm đồ cũ hoài niệm",
                timeOfDay: "Noon",
                approxCost: "Miễn phí",
                tip: "Góc máy từ dưới lên giúp hack chiều cao tuyệt hảo."
              },
              {
                title: "Thưởng thức ly nước sạc pin tâm hồn",
                description: "Ghé tiệm cafe vibe cực keo lỳ để uống ly bạc xỉu thơm ngon dã man hoặc trà trái cây giải nhiệt mát lạnh tê lưỡi.",
                location: "Tiệm cafe khu mật cũ",
                timeOfDay: "Afternoon",
                approxCost: "60.000đ",
                tip: "Có ngồi gác lửng hướng tầm mắt ngắm mặt trời rụng cực thơ mộng."
              },
              {
                title: "Quẩy ẩm thực lẩu nướng khói sương",
                description: "Chốt hạ ngày dài tuyệt hảo với bữa lẩu gánh thơm điếc mũi. Ăn no lết sập bánh xe, nói cười rôm rả xả stress hăm hở.",
                location: "Hẻm nướng lung linh ánh đèn",
                timeOfDay: "Evening",
                approxCost: "180.000đ",
                tip: "Nên mang một chiếc áo khoác nhẹ dịu đề phòng sương lạnh buông xuống."
              }
            ]
          })),
          genZRecommendations: [
            "Lên đồ tone-sur-tone cá tính cùng cạ cứng để gom ảnh ngàn tim cực cháy.",
            "Tặng các cô chú nụ cười tươi rói để được freeship thêm đồ ăn vặt nhé.",
            "Dọn sạch bộ nhớ điện thoại trước khi đi kẻo tiếc hùi hụi."
          ],
          localSlangs: [
            { word: "Cháy máy", meaning: "Chụp hình búng tay tanh tách hàng nghìn pô không biết mỏi." },
            { word: "Chill xỉu", meaning: "Cảm giác bình yên sảng khoái cực đỉnh, quên sạch deadline rượt đuổi." }
          ]
        };
        setItinerary(fallback);
        setCurrentScreen('itinerary');
      }, 1000);
    }
  };

  // Convert current vibe choice to theme color hexes for brutalist components
  const getThemeColorClass = (v: VibeType) => {
    switch (v) {
      case 'Chill': return 'bg-[#38B765]';
      case 'Foodie': return 'bg-[#FFD600]';
      case 'Indie': return 'bg-[#3D78D8]';
      case 'Maximalism': return 'bg-[#FF2D7A]';
      case 'Nightlife': return 'bg-[#FF6B00]';
    }
  };

  const getThemeTextColorClass = (v: VibeType) => {
    switch (v) {
      case 'Chill': return 'text-[#38B765]';
      case 'Foodie': return 'text-[#FFD600]';
      case 'Indie': return 'text-[#3D78D8]';
      case 'Maximalism': return 'text-[#FF2D7A]';
      case 'Nightlife': return 'text-[#FF6B00]';
    }
  };

  const currentThemeBgColorClass = getThemeColorClass(selectedVibe);

  // Handle saving the current generated itinerary to list of trips
  const handleSaveTrip = () => {
    if (!itinerary) return;

    // Check if details already saved
    const exists = savedTrips.some(t => t.destination === itinerary.destination && t.vibe === itinerary.vibe);
    if (exists) {
      alert("Chuyến đi này đã được lưu giữ trong Passport của bạn rồi nè!");
      setPhoneTab('trips');
      return;
    }

    const newTrip: SavedTrip = {
      id: 'TRIP_' + Date.now(),
      destination: itinerary.destination,
      vibe: itinerary.vibe,
      days: itinerary.days,
      itinerary: itinerary,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      completed: false
    };

    // Update stats, unlock vibe + stamp if not already unlocked
    const newUnlockedVibes = userStats.unlockedVibes.includes(itinerary.vibe)
      ? userStats.unlockedVibes
      : [...userStats.unlockedVibes, itinerary.vibe];

    const newScannedStamps = userStats.scannedStamps.includes(itinerary.destination)
      ? userStats.scannedStamps
      : [...userStats.scannedStamps, itinerary.destination];

    const updatedTrips = [newTrip, ...savedTrips];
    const updatedStats: UserStats = {
      ...userStats,
      tripsCount: updatedTrips.length,
      unlockedVibes: newUnlockedVibes,
      scannedStamps: newScannedStamps
    };

    // Auto claim voucher for this vibe
    const targetVoucher = vouchers.find(v => v.vibeRequired === itinerary.vibe && !v.claimed);
    let updatedVouchers = [...vouchers];
    if (targetVoucher) {
      updatedVouchers = vouchers.map(v => 
        v.id === targetVoucher.id ? { ...v, claimed: true } : v
      );
      setClaimedVoucherPopup(targetVoucher);
      
      const newClaimed = [...userStats.vouchersClaimed, targetVoucher.id];
      updatedStats.vouchersClaimed = newClaimed;
    }

    saveUserData(updatedTrips, updatedStats, updatedVouchers);
    setPhoneTab('trips');
  };

  // Toggle checkout list in active trip
  const handleToggleActivityCheck = (actId: string) => {
    setActivityCheckedStates(prev => ({
      ...prev,
      [actId]: !prev[actId]
    }));
  };

  const handleCopyVoucherCode = (voucher: Voucher) => {
    navigator.clipboard.writeText(voucher.code);
    setCopiedVoucherId(voucher.id);
    setTimeout(() => {
      setCopiedVoucherId(null);
    }, 2000);
  };

  const handleMarkTripCompleted = (tripId: string) => {
    const updated = savedTrips.map(t => 
      t.id === tripId ? { ...t, completed: !t.completed } : t
    );
    const updatedStats = {
      ...userStats,
      // Playful addition
    };
    saveUserData(updated, updatedStats);
  };

  const handleDeleteTrip = (tripId: string) => {
    const tripToDelete = savedTrips.find(t => t.id === tripId);
    if (!tripToDelete) return;
    
    if (confirm(`Bạn có chắc muốn xoá chuyến đi lãng mạn tới ${tripToDelete.destination} không?`)) {
      const updated = savedTrips.filter(t => t.id !== tripId);
      const updatedStats = {
        ...userStats,
        tripsCount: updated.length
      };
      saveUserData(updated, updatedStats);
    }
  };

  return (
    <div className="main-container halftone min-h-screen w-full flex flex-col justify-center items-center py-4 px-2 sm:py-8 sm:px-4 select-none">
      
      {/* MAIN WORKSPACE: Fully optimized PC & Mobile responsive card container */}
      <main className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex flex-col items-center relative">
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-sans font-black text-laka-navy tracking-tighter uppercase" style={{ WebkitTextStroke: '1.5px #163A6B' }}>
            LAKA TRAVEL
          </h1>
          <p className="text-xs font-mono text-laka-navy/70 uppercase tracking-widest mt-1">
            "LaKa đi, nghỉ làm chi! 🚀"
          </p>
        </div>

        {/* Real responsive console container - NO iPhone/smartphone mockup frame limits */}
        <div className="w-full min-h-[640px] h-[780px] md:h-[820px] max-h-[90vh] bg-white border-4 md:border-[6px] border-laka-navy rounded-[32px] md:rounded-[40px] shadow-[8px_8px_0_#163A6B] md:shadow-[14px_14px_0_#163A6B] relative flex flex-col overflow-hidden">
          
          {/* MAIN INTERACTIVE CONSOLE CONTROLLER - Notch eliminated, pt adjusted to 0 */}
          <div className="flex-1 pt-0 pb-16 overflow-y-auto bg-laka-cream/30 relative flex flex-col">
            
            <AnimatePresence mode="wait">
              
              {/* SCREEN 1: SPLASH SCREEN */}
              {currentScreen === 'splash' && (
                <motion.div 
                  id="screen-splash"
                  key="splash"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col items-center justify-between p-6 bg-laka-cream relative overflow-hidden"
                >
                  {/* Decorative corner stickers */}
                  <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-laka-yellow border-2 border-laka-navy opacity-40"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-laka-pink border-2 border-laka-navy opacity-30 transform rotate-12"></div>
                  <div className="absolute top-1/4 right-3 text-3xl animate-bounce">🛵</div>
                  <div className="absolute bottom-1/4 left-3 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🥥</div>

                  <div className="w-full flex justify-end mt-4">
                    <span className="bg-laka-orange text-white px-2 py-1 rounded-full text-[10px] font-mono border-2 border-laka-navy font-bold shadow-sm">
                      DÂN CHƠI VIỆT NAM 🇻🇳
                    </span>
                  </div>

                  {/* Brand center focus */}
                  <div className="text-center my-auto flex flex-col items-center">
                    <div className="w-24 h-24 bg-laka-yellow rounded-full border-4 border-laka-navy flex items-center justify-center shadow-lg transform -rotate-6 relative mb-6">
                      <Compass className="w-14 h-14 text-laka-navy animate-spin-slow" />
                      <div className="absolute top-0 right-0 bg-laka-pink text-white w-7 h-7 rounded-full border-2 border-laka-navy flex items-center justify-center text-xs font-black">
                        AI
                      </div>
                    </div>

                    <h2 className="text-5xl font-black text-laka-orange tracking-tight leading-none" style={{ WebkitTextStroke: '1.5px #163A6B' }}>
                      LAKA
                    </h2>
                    <p className="text-sm font-mono uppercase tracking-widest text-[#163A6B] font-bold mt-1">
                      Travel Planner
                    </p>
                    
                    <p className="text-xs bg-white text-laka-navy mt-4 px-4 py-2 rounded-xl border-2 border-dashed border-laka-navy font-display font-medium text-center retro-shadow-sm max-w-[220px]">
                      "LaKa đi, nghỉ làm chi! Sát cánh cùng con tim thèm đi xê dịch" 🚀
                    </p>
                  </div>

                  {/* Trigger Face ID Authentication or Manual Social Login */}
                  <div className="w-full space-y-3 mt-auto">
                    <button 
                      id="btn-goto-faceid"
                      onClick={() => setCurrentScreen('faceid')}
                      className="w-full h-14 rounded-full bg-laka-navy text-white flex items-center justify-center gap-3 font-display font-black text-sm border-2 border-laka-navy shadow-[4px_4px_0px_0px_#FF2D7A] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    >
                      <Smartphone className="w-5 h-5 text-laka-yellow" />
                      QUÉT FACE ID ĐỂ CHƠI 🤳
                    </button>
                    
                    <button 
                      id="btn-goto-login"
                      onClick={() => setCurrentScreen('login')}
                      className="w-full h-11 rounded-full bg-white text-laka-navy flex items-center justify-center gap-2 font-mono text-xs font-bold border-2 border-laka-navy shadow-sm hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      Đăng nhập bằng Email / Zalo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 2: FACE ID BIOMETRIC ANIMATED SCREEN */}
              {currentScreen === 'faceid' && (
                <motion.div 
                  id="screen-faceid"
                  key="faceid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-between p-6 bg-laka-navy text-white text-center"
                >
                  <div className="w-full flex justify-between items-center mt-2">
                    <button 
                      id="btn-faceid-back"
                      onClick={() => setCurrentScreen('splash')} 
                      className="text-white hover:text-laka-yellow transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 border-2 border-white rounded-full" />
                    </button>
                    <span className="text-xs font-mono tracking-widest text-laka-yellow">LAKA SECURE LOCK</span>
                    <div className="w-6 h-6"></div>
                  </div>

                  {/* Animated Biometric Scanner */}
                  <div className="my-auto flex flex-col items-center">
                    
                    {/* The Scan Frame */}
                    <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-laka-blue flex items-center justify-center p-6 animate-pulse mb-6">
                      
                      {/* Green Scan Laser Overlay */}
                      {isFaceIdScanning && (
                        <motion.div 
                          initial={{ y: -70 }}
                          animate={{ y: 70 }}
                          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut" }}
                          className="absolute left-0 right-0 h-1 bg-laka-green shadow-[0_0_8px_#38B765] z-10"
                        />
                      )}
                      
                      {/* Matching Target Icon or Face Avatar representation */}
                      <div className="w-36 h-36 rounded-full bg-white/10 flex items-center justify-center relative overflow-hidden">
                        {faceIdSuccess ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            type="spring"
                            className="text-7xl"
                          >
                            🎉
                          </motion.div>
                        ) : (
                          <span className="text-7xl filter grayscale contrast-120 animate-bounce">
                            🧑‍🎤
                          </span>
                        )}

                        {/* Scanner overlay circle */}
                        <div className="absolute inset-0 border-2 border-laka-yellow/30 rounded-full animate-ping"></div>
                      </div>

                      {/* Surrounding Ring Animation details */}
                      <div className="absolute -inset-1 border-2 border-laka-pink/40 rounded-full animate-spin-slow"></div>
                    </div>

                    <h3 className="text-xl font-display font-black tracking-wider text-laka-yellow uppercase">
                      {faceIdSuccess ? "XÁC MINH OK! 👌" : isFaceIdScanning ? "ĐANG ĐỌC NĂNG LƯỢNG GG..." : "XÁC THỰC LAKA ID"}
                    </h3>
                    <p className="text-xs text-white/70 max-w-[240px] mt-2 font-mono leading-relaxed">
                      {faceIdSuccess 
                        ? "Hệ thống nhận diện thành công vị khách cực phong cách. Hãy quẩy thôi!"
                        : isFaceIdScanning 
                          ? "Quét góc 3D sống động của khuôn mặt điển trai/xinh gái để sạc pin du hí..." 
                          : "Đã thiết lập khoá bảo mật vân sinh trắc học Gen Z cực xịn."}
                    </p>
                  </div>

                  {/* Bottom Scan Actions */}
                  <div className="w-full space-y-3 mt-auto">
                    {!isFaceIdScanning && !faceIdSuccess ? (
                      <button 
                        id="btn-start-faceid-scan"
                        onClick={handleTriggerFaceId}
                        className="w-full h-14 bg-laka-green text-laka-navy rounded-full font-display font-black tracking-wider uppercase text-sm border-2 border-white shadow-[4px_4px_0_#FFF] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                      >
                        BẮT ĐẦU QUÉT KHUÔN MẶT 🤳
                      </button>
                    ) : (
                      <div className="py-4 font-mono text-sm text-laka-green flex items-center justify-center gap-2">
                        {faceIdSuccess ? (
                          <>
                            <Check className="w-5 h-5 animate-bounce stroke-[3]" />
                            ĐANG ĐƯA BẠN VÀO HỆ THỐNG...
                          </>
                        ) : (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-laka-green border-t-transparent rounded-full animate-spin"></span>
                            SCANNING LAKA_EYE_SCAN.EXE
                          </>
                        )}
                      </div>
                    )}

                    <button 
                      id="btn-skip-faceid"
                      onClick={() => setCurrentScreen('login')}
                      className="text-xs text-white/50 underline hover:text-white block mx-auto py-2 font-mono"
                    >
                      Bỏ qua vân tay/Face ID
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 3: SOCIAL / EMAIL LOGIN SCREEN */}
              {currentScreen === 'login' && (
                <motion.div 
                  id="screen-login"
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col justify-between p-6 bg-laka-cream text-laka-navy"
                >
                  <div className="w-full flex justify-between items-center mt-2">
                    <button 
                      id="btn-login-back"
                      onClick={() => setCurrentScreen('splash')} 
                      className="text-laka-navy hover:text-laka-orange"
                    >
                      <ChevronLeft className="w-6 h-6 border-2 border-laka-navy rounded-full" />
                    </button>
                    <span className="text-xs font-mono font-bold tracking-widest text-laka-navy">ĐĂNG NHẬP LAKA</span>
                    <div className="w-6 h-6"></div>
                  </div>

                  {/* Form detail */}
                  <div className="my-auto space-y-6">
                    <div className="text-center">
                      <span className="text-5xl">🎒</span>
                      <h3 className="text-2xl font-sans font-black tracking-tight mt-3">Chào Bạn Trở Lại!</h3>
                      <p className="text-xs text-laka-navy/60 font-mono mt-1">Đăng nhập cực lẹ để lấy vé sạc pin du lịch</p>
                    </div>

                    <div className="space-y-4">
                      {/* Email block */}
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-laka-navy/75 block">Email du học / du lịch</label>
                        <input 
                          id="input-login-email"
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="nhapmail@genz.com"
                          className="w-full h-12 rounded-xl border-3 border-laka-navy px-4 bg-white font-mono text-xs focus:ring-0 focus:outline-none transition-all placeholder:opacity-50"
                        />
                      </div>

                      {/* Password mockup block */}
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-laka-navy/75 block">Mật mã thần kỳ</label>
                        <input 
                          id="input-login-password"
                          type="password"
                          defaultValue="••••••••"
                          className="w-full h-12 rounded-xl border-3 border-laka-navy px-4 bg-white font-mono text-xs focus:ring-0 focus:outline-none transition-all placeholder:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Social button rows */}
                    <div className="space-y-3 pt-2">
                      <button 
                        id="btn-login-submit"
                        onClick={() => setCurrentScreen('dashboard')}
                        className="w-full h-12 bg-laka-orange text-white rounded-full font-display font-black text-sm tracking-wide border-2 border-laka-navy shadow-[4px_4px_0_#163A6B] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                      >
                        BẤT CHẤP ĐI TIẾP 🚀
                      </button>

                      <div className="flex items-center gap-2">
                        <hr className="flex-1 border-laka-navy/20" />
                        <span className="text-[10px] font-mono text-laka-navy/40">HOẶC DÙNG SOCIAL</span>
                        <hr className="flex-1 border-laka-navy/20" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          id="btn-login-zalo"
                          onClick={() => {
                            setUserEmail('zalo_user@zalo.vn');
                            setCurrentScreen('dashboard');
                          }}
                          className="h-11 bg-[#3D78D8] text-white rounded-full font-sans font-bold text-xs border-2 border-laka-navy flex items-center justify-center gap-1 shadow-sm active:translate-y-[2px] cursor-pointer"
                        >
                          <span className="font-extrabold">Z</span> Zalo siêu tốc
                        </button>
                        <button 
                          id="btn-login-google"
                          onClick={() => {
                            setUserEmail('nguyenbaoduyminh@gmail.com');
                            setCurrentScreen('dashboard');
                          }}
                          className="h-11 bg-white text-laka-navy rounded-full font-sans font-bold text-xs border-2 border-laka-navy flex items-center justify-center gap-1 shadow-sm active:translate-y-[2px] cursor-pointer"
                        >
                          <span className="text-red-500 font-extrabold">G</span> Google lẹ
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Foot credits */}
                  <div className="text-center font-mono text-[10px] text-laka-navy/40 mt-auto">
                    LaKa cam kết bảo mật 100% không share bừa tin nhắn xin nghỉ của bạn!
                  </div>
                </motion.div>
              )}

              {/* SCREEN 4: HOME & REQUIREMENTS CAPTURE WIZARD */}
              {currentScreen === 'dashboard' && (
                <motion.div 
                  id="screen-dashboard"
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col text-laka-navy"
                >
                  
                  {/* Internal Tab Views switcher inside Phone mockup */}
                  <div className="sticky top-0 bg-laka-cream p-4 border-b-3 border-laka-navy z-20">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-[10px] font-mono font-bold text-laka-navy/60 uppercase">CHào mừng quay lại! 👋</p>
                        <h3 className="text-md font-sans font-black text-laka-orange truncate max-w-[190px]">
                          {userEmail.split('@')[0]}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-laka-yellow text-[10px] font-mono font-bold px-2 py-1 rounded-md border-2 border-laka-navy retro-shadow-sm flex items-center gap-1">
                          🔥 {userStats.unlockedVibes?.length || 1} Vibes Unlocked
                        </span>
                      </div>
                    </div>

                    {/* Secondary Navigation Tags inside simulated phone app */}
                    <div className="flex justify-around bg-white p-1 rounded-xl border-2 border-laka-navy">
                      <button 
                        id="tab-planner"
                        onClick={() => { setPhoneTab('planner'); setWizardStep(1); }}
                        className={`flex-1 py-1 rounded-lg text-center font-monospace text-xs font-bold transition-all cursor-pointer ${phoneTab === 'planner' ? 'bg-laka-orange text-white' : 'text-laka-navy hover:bg-zinc-100'}`}
                      >
                        Lên Lịch AI
                      </button>
                      <button 
                        id="tab-trips"
                        onClick={() => setPhoneTab('trips')}
                        className={`flex-1 py-1 rounded-lg text-center font-monospace text-xs font-bold transition-all cursor-pointer ${phoneTab === 'trips' ? 'bg-laka-orange text-white' : 'text-laka-navy hover:bg-zinc-100'}`}
                      >
                        Gần Đây ({savedTrips.length})
                      </button>
                      <button 
                        id="tab-vouchers"
                        onClick={() => setPhoneTab('vouchers')}
                        className={`flex-1 py-1 rounded-lg text-center font-monospace text-xs font-bold transition-all cursor-pointer ${phoneTab === 'vouchers' ? 'bg-laka-orange text-white' : 'text-laka-navy hover:bg-zinc-100'}`}
                      >
                        Hộp Quà
                      </button>
                    </div>
                  </div>

                  {/* SUB-PANEL 4.1: MAIN AI PLANNER WIZARD */}
                  {phoneTab === 'planner' && (
                    <div className="p-4 flex-1 flex flex-col space-y-4">
                      
                      {wizardStep === 1 && (
                        <motion.div 
                          id="planner-step-1"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <div>
                            <span className="bg-laka-pink text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-laka-navy">
                              BƯỚC 1/3: TOẠ ĐỘ & VIBE
                            </span>
                            <h4 className="text-xl font-sans font-black tracking-tight mt-1">Bạn muốn "Đi trốn" ở đâu?</h4>
                            <p className="text-xs text-laka-navy/60 font-mono">Nhập tự do hoặc click nhanh preset xịn</p>
                          </div>

                          {/* Free-text Destination Search Input */}
                          <div className="relative">
                            <input 
                              id="input-destination-search"
                              type="text"
                              value={customDestination}
                              onChange={(e) => {
                                setCustomDestination(e.target.value);
                                // Deselect preset if they write custom name
                              }}
                              placeholder="Nhập địa điểm tuỳ hứng (ví dụ: Phú Quý, Sa Pa...)"
                              className="w-full h-11 rounded-xl border-3 border-laka-navy pl-10 pr-4 bg-white font-mono text-xs focus:ring-0 focus:outline-none placeholder:opacity-50"
                            />
                            <Search className="w-4 h-4 text-laka-navy absolute left-3.5 top-3.5" />
                            {customDestination && (
                              <button 
                                onClick={() => setCustomDestination('')} 
                                className="absolute right-3 top-3 text-[10px] bg-zinc-200 px-2 py-0.5 rounded font-mono font-bold"
                              >
                                Xoá
                              </button>
                            )}
                          </div>

                          {/* Quick selection preset list with micro-images */}
                          {!customDestination && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-laka-navy/60">☀️ GỢI Ý THỔ ĐỊA QUỐC DÂN</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                                {PRESET_CITIES.map((city) => (
                                  <button
                                    id={`preset-city-${city.name}`}
                                    key={city.name}
                                    onClick={() => {
                                      setSelectedCity(city);
                                      // Visually update
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-xl border-2 text-left transition-all ${selectedCity.name === city.name && !customDestination ? 'border-laka-orange bg-laka-yellow/20 retro-shadow-sm' : 'border-laka-navy hover:bg-zinc-50 bg-white'}`}
                                  >
                                    <img 
                                      src={city.image} 
                                      alt={city.name} 
                                      referrerPolicy="no-referrer"
                                      className="w-8 h-8 rounded-lg object-cover border border-laka-navy shrink-0" 
                                    />
                                    <div className="overflow-hidden">
                                      <p className="text-xs font-black truncate">{city.name}</p>
                                      <p className="text-[8px] opacity-65 truncate font-mono">"{city.tags[2]}"</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* VIBE CAROUSEL SELECTION */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-laka-navy/60">✨ TẦN SỐ NĂNG LƯỢNG (VIBE)</p>
                              <span className="text-[11px] font-bold font-mono text-laka-orange underline uppercase bg-laka-yellow/10 px-1 rounded">
                                {selectedVibe}
                              </span>
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 pr-1 custom-scroll">
                              {VIBE_DETAILS.map((v) => (
                                <button
                                  id={`vibe-choice-${v.vibe}`}
                                  key={v.vibe}
                                  onClick={() => setSelectedVibe(v.vibe)}
                                  className={`flex-none w-[110px] p-3 rounded-2xl border-3 text-center transition-all cursor-pointer ${selectedVibe === v.vibe ? 'border-laka-navy bg-white retro-shadow-sm scale-[1.02]' : 'border-laka-navy/55 bg-white/60 opacity-60 hover:opacity-100'}`}
                                >
                                  <span className="text-3xl block filter drop-shadow mb-1 animate-bounce" style={{ animationDuration: '3s' }}>
                                    {v.emoji}
                                  </span>
                                  <p className="text-xs font-sans font-black tracking-tight">{v.vibe}</p>
                                  <p className="text-[8px] font-mono opacity-70 mt-1 truncate uppercase">{v.label}</p>
                                </button>
                              ))}
                            </div>

                            <div className="p-3 bg-white border-2 border-laka-navy rounded-xl text-xs font-mono text-laka-navy leading-normal">
                              {VIBE_DETAILS.find(item => item.vibe === selectedVibe)?.desc}
                            </div>
                          </div>

                          <button 
                            id="btn-planner-next-1"
                            onClick={() => setWizardStep(2)}
                            className="w-full h-12 bg-laka-navy text-white rounded-full font-display font-black text-xs tracking-wider flex items-center justify-center gap-2 border-2 border-laka-navy shadow-[4px_4px_0_#38B765] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-4 cursor-pointer"
                          >
                            ĐI TIẾP BƯỚC 2/3
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </motion.div>
                      )}

                      {wizardStep === 2 && (
                        <motion.div 
                          id="planner-step-2"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <div>
                            <span className="bg-laka-yellow text-laka-navy text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-laka-navy">
                              BƯỚC 2/3: LỊCH TRÌNH & CHI PHÍ
                            </span>
                            <h4 className="text-xl font-sans font-black tracking-tight mt-1">Cơ cấu và Nhịp Độ thế nào?</h4>
                            <p className="text-xs text-laka-navy/60 font-mono">Điều chỉnh tham số để AI tính toán cho đúng tần số</p>
                          </div>

                          {/* Days choice slider/buttons */}
                          <div className="space-y-2">
                            <div className="flex justify-between font-mono text-xs">
                              <span className="font-bold uppercase tracking-wider text-laka-navy/70">Số ngày ham muốn:</span>
                              <span className="text-laka-orange font-black text-sm underline">{requirements.days} ngày</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {[1, 2, 3, 4, 5].map(d => (
                                <button
                                  key={d}
                                  onClick={() => setRequirements(prev => ({ ...prev, days: d }))}
                                  className={`py-2 rounded-xl border-2 font-mono font-bold text-xs ${requirements.days === d ? 'border-laka-navy bg-laka-yellow' : 'bg-white border-laka-navy/30'}`}
                                >
                                  {d}N
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Budget segment selections */}
                          <div className="space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-laka-navy/70 block">Bầu ví thế nào sếp?</span>
                            <div className="grid grid-cols-3 gap-2">
                              {['economy', 'moderate', 'luxury'].map((b) => (
                                <button
                                  key={b}
                                  onClick={() => setRequirements(prev => ({ ...prev, budget: b as any }))}
                                  className={`py-2 px-1 rounded-xl border-2 text-center font-sans font-black text-xs transition-all ${requirements.budget === b ? 'border-laka-navy bg-laka-orange text-white retro-shadow-sm' : 'bg-white border-laka-navy/30 text-laka-navy pb-2'}`}
                                >
                                  {b === 'economy' ? '💸 Sinh Viên' : b === 'moderate' ? '💳 Vừa Vặn' : '💎 Sang Chảnh'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Travel companion */}
                          <div className="space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-laka-navy/70 block">Bạn đồng hành?</span>
                            <div className="grid grid-cols-4 gap-2">
                              {['solo', 'couple', 'friends', 'family'].map((comp) => (
                                <button
                                  key={comp}
                                  onClick={() => setRequirements(prev => ({ ...prev, companions: comp as any }))}
                                  className={`py-1.5 rounded-lg border-2 font-sans font-black text-[10px] text-center ${requirements.companions === comp ? 'bg-laka-navy text-white border-laka-navy' : 'bg-white border-laka-navy/30 text-laka-navy'}`}
                                >
                                  {comp === 'solo' ? 'Một mình' : comp === 'couple' ? 'Ng.Yêu' : comp === 'friends' ? 'Cạ Cứng' : 'Gia Đình'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Travel pace */}
                          <div className="space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-laka-navy/70 block">Nhịp độ hành trình:</span>
                            <div className="grid grid-cols-3 gap-2">
                              {['relaxed', 'balanced', 'fast'].map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setRequirements(prev => ({ ...prev, pace: p as any }))}
                                  className={`py-1.5 rounded-lg border-2 text-xs font-bold font-mono text-center ${requirements.pace === p ? 'bg-[#3D78D8] text-white border-laka-navy' : 'bg-white border-laka-navy/30 text-laka-navy'}`}
                                >
                                  {p === 'relaxed' ? 'Thong thả 🐌' : p === 'balanced' ? 'Cân bằng ⚖️' : 'Cháy máy 🏎️'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => setWizardStep(1)}
                              className="w-1/3 h-11 bg-white border-2 border-laka-navy rounded-full font-display font-bold text-xs"
                            >
                              LÙI LẠI
                            </button>
                            <button 
                              id="btn-planner-next-2"
                              onClick={() => setWizardStep(3)}
                              className="w-2/3 h-11 bg-laka-navy text-white rounded-full font-display font-black text-xs tracking-wider border-2 border-laka-navy shadow-[2px_2px_0_#FF2D7A]"
                            >
                              BƯỚC TIẾP THEO
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {wizardStep === 3 && (
                        <motion.div 
                          id="planner-step-3"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <div>
                            <span className="bg-laka-pink text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-laka-navy">
                              BƯỚC 3/3: ƯU TIÊN SỐNG CÒN
                            </span>
                            <h4 className="text-xl font-sans font-black tracking-tight mt-1">Điều gì quan trọng nhất?</h4>
                            <p className="text-xs text-laka-navy/60 font-mono">Chọn tối đa nhu cầu thoả mãn cá tính</p>
                          </div>

                          {/* Multi select priority elements */}
                          <div className="grid grid-cols-2 gap-2">
                            {PRIORITY_OPTIONS.map((item) => {
                              const isSelected = requirements.priorities.includes(item);
                              return (
                                <button
                                  key={item}
                                  onClick={() => handleTogglePriority(item)}
                                  className={`p-2 rounded-xl border-2 text-left font-sans font-black text-xs flex items-center justify-between transition-all ${isSelected ? 'border-laka-navy bg-laka-yellow retro-shadow-sm' : 'border-laka-navy/20 bg-white opacity-80'}`}
                                >
                                  <span>{item}</span>
                                  {isSelected ? (
                                    <span className="w-4 h-4 rounded-full bg-laka-navy text-white flex items-center justify-center text-[8px] font-black">✓</span>
                                  ) : (
                                    <span className="w-4 h-4 rounded-full border border-laka-navy/30"></span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <div className="bg-laka-yellow/20 border-2 border-dashed border-laka-yellow p-3 rounded-xl">
                            <p className="text-[10px] font-mono italic text-laka-navy/90 leading-tight">
                              💡 <strong>Mẹo Gen Z:</strong> Du lịch tự túc không sợ cô đơn, LaKa sẽ bổ sung tiếng lóng bản địa cùng mẹo săn góc check-in tuyệt đỉnh!
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => setWizardStep(2)}
                              className="w-1/3 h-11 bg-white border-2 border-laka-navy rounded-full font-display font-medium text-xs text-laka-navy"
                            >
                              LÙI LẠI
                            </button>
                            
                            <button 
                              id="btn-trigger-ai-build"
                              onClick={handleBuildItinerary}
                              disabled={requirements.priorities.length === 0}
                              className={`w-2/3 h-11 text-white rounded-full font-display font-black text-xs tracking-wider flex items-center justify-center gap-1.5 border-2 border-laka-navy shadow-[4px_4px_0_#163A6B] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer ${requirements.priorities.length === 0 ? 'bg-zinc-400 border-zinc-500 cursor-not-allowed opacity-50' : 'bg-laka-orange'}`}
                            >
                              <Sparkles className="w-4 h-4 text-laka-yellow animate-bounce" />
                              BỐC QUẺ AI NGAY! 🚀
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  )}

                  {/* SUB-PANEL 4.2: LIST OF PREVIOUS SAVED TRIPS */}
                  {phoneTab === 'trips' && (
                    <div className="p-4 flex-1 overflow-y-auto space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-2xl font-sans font-black tracking-tight uppercase">Bộ Sưu Tập Passport 🗺️</h4>
                          <p className="text-xs text-laka-navy/60 font-mono">Các cuộc phiêu lưu đã lên quẻ thành công</p>
                        </div>
                      </div>

                      {/* STICKERS ALBUM GRID */}
                      <div className="p-5 bg-white text-laka-navy border-3 border-laka-navy rounded-[24px] retro-shadow-sm bg-radial">
                        <p className="text-[10px] font-mono text-laka-navy/60 font-bold mb-3 uppercase tracking-wider border-b border-dashed border-laka-navy/20 pb-2">
                          🎖️ STICKERS & STAMPS ĐÃ SỞ HỮU ({userStats.scannedStamps.length} / 6)
                        </p>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {Object.keys(PASSPORT_STICKERS).map((key) => {
                            const s = PASSPORT_STICKERS[key];
                            const isUnlocked = userStats.scannedStamps.includes(s.destination);
                            return (
                              <div 
                                id={`stamp-${s.destination}`}
                                key={s.destination}
                                title={isUnlocked ? `Đã sở hữu Stamp ${s.destination} - ${s.unlockedMsg}` : `Khoá! Hãy lập chuyến du hí ${s.destination} để mở khoá.`}
                                className={`aspect-square rounded-2xl border-2 border-laka-navy relative flex flex-col items-center justify-center p-2 transition-all ${isUnlocked ? s.color + ' transform -rotate-2 hover:rotate-3 shadow-xs' : 'bg-zinc-100 opacity-30 select-none'}`}
                              >
                                <span className="text-2xl filter drop-shadow">
                                  {isUnlocked ? s.emoji : '🔒'}
                                </span>
                                <span className="text-[9px] font-sans font-black tracking-tight mt-1 truncate max-w-full uppercase">
                                  {s.destination}
                                </span>
                                
                                {isUnlocked && (
                                  <div className="absolute -top-1 -right-1 bg-laka-pink border border-laka-navy rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-3.5 text-[9.5px] font-mono text-laka-navy/70 leading-normal bg-laka-yellow/10 p-2.5 rounded-xl border border-dashed border-laka-yellow/35">
                          💡 <strong>Phá đảo thế giới:</strong> Tích luỹ thêm các Stamps xịn bằng cách nhấn nút "LƯU TRIP" sau khi AI thiết kế kế hoạch du lịch của bạn!
                        </div>
                      </div>

                      {/* LIST OF TRIPS HEADER */}
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-laka-navy/70 border-b-2 border-dashed border-laka-navy/20 pb-1.5 pt-2">
                        📒 CHUYẾN ĐI ĐÃ LẬP QUẺ
                      </p>

                      {savedTrips.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-laka-navy/40 p-4">
                          <span className="text-4xl">📭</span>
                          <p className="text-sm font-sans font-black mt-2">Trống trơn như ví tiền cuối tháng!</p>
                          <p className="text-xs text-laka-navy/60 font-mono mt-1">Hãy thiết lập một chuyến đi ngay bên tab Lên Lịch nhé!</p>
                          <button 
                            onClick={() => setPhoneTab('planner')}
                            className="bg-laka-orange text-white px-4 py-2 rounded-full border-2 border-laka-navy font-black text-xs mt-4 retro-shadow-sm active:translate-y-[2px]"
                          >
                            Thiết Kế Ngay 🎒
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {savedTrips.map((trip) => (
                            <div 
                              key={trip.id}
                              className="bg-white border-3 border-laka-navy rounded-[24px] p-4 shadow-[4px_4px_0_#163A6B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all relative overflow-hidden"
                            >
                              {/* Background sticker tag representation */}
                              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 bg-laka-pink text-white text-[8px] font-mono font-bold px-3 py-1 rounded-bl-xl border-l-2 border-b-2 border-laka-navy tracking-widest">
                                {trip.createdAt}
                              </div>

                              <div className="flex items-center gap-2 mb-2 pr-12">
                                <span className="text-xl">
                                  {VIBE_DETAILS.find(item => item.vibe === trip.vibe)?.emoji || '⚡'}
                                </span>
                                <h5 className="font-sans font-black text-base truncate uppercase">
                                  🧭 {trip.destination}
                                </h5>
                              </div>

                              <p className="text-xs text-laka-navy/80 font-mono leading-tight mb-2 italic">
                                "{trip.itinerary.title}"
                              </p>

                              <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                                <span className="bg-laka-yellow px-2 py-0.5 rounded border border-laka-navy font-bold">
                                  {trip.days} NGÀY
                                </span>
                                <span className="bg-laka-cream px-2 py-0.5 rounded border border-laka-navy font-bold uppercase truncate max-w-[120px]">
                                  Vibe {trip.vibe}
                                </span>
                                <span className={`px-2 py-0.5 rounded border border-laka-navy font-bold text-white ${trip.completed ? 'bg-laka-green' : 'bg-laka-orange'}`}>
                                  {trip.completed ? 'ĐÃ HOÀN TẤT' : 'CHƯA ĐI'}
                                </span>
                              </div>

                              <div className="flex gap-2 border-t pt-3 border-dashed border-laka-navy/20">
                                <button 
                                  onClick={() => {
                                    setItinerary(trip.itinerary);
                                    // Make sure selected stats display correctly
                                    setSelectedVibe(trip.vibe);
                                    setCustomDestination(trip.destination);
                                    setCurrentScreen('itinerary');
                                  }}
                                  className="flex-1 h-8 bg-laka-navy text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1.5 retro-shadow-sm active:translate-y-[1px]"
                                >
                                  <Eye className="w-3 h-3 text-laka-yellow" /> Xem Chi Tiết
                                </button>

                                <button 
                                  onClick={() => handleMarkTripCompleted(trip.id)}
                                  className={`h-8 px-2.5 rounded-lg text-[10px] font-black uppercase border-2 border-laka-navy flex items-center justify-center gap-1 transition-all ${trip.completed ? 'bg-zinc-100 text-zinc-500' : 'bg-laka-yellow text-laka-navy font-bold shadow-sm'}`}
                                >
                                  {trip.completed ? 'Huỷ Tích' : 'Xong Lịch'}
                                </button>

                                <button 
                                  onClick={() => handleDeleteTrip(trip.id)}
                                  className="h-8 w-8 hover:bg-red-50 text-red-500 border-2 border-red-200 rounded-lg text-xs flex items-center justify-center"
                                  title="Xoá lịch"
                                >
                                  ✕
                                </button>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                  {/* SUB-PANEL 4.3: DIGITAL REWARDS & ACTIVE VOUCHERS WALLET */}
                  {phoneTab === 'vouchers' && (
                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                      <div>
                        <h4 className="text-xl font-sans font-black tracking-tight">Kho Voucher Khủng 🎁</h4>
                        <p className="text-xs text-laka-navy/60 font-mono">Unlock tự động khi oanh tạc các vibe khác nhau</p>
                      </div>

                      <div className="p-3 bg-laka-yellow/20 border-2 border-laka-navy rounded-xl text-center space-y-1">
                        <p className="text-xs font-sans font-black text-laka-orange">🚀 ĐỘC QUYỀN LAKA TRAVEL CODES</p>
                        <p className="text-[10px] font-mono text-laka-navy/80">Sao chép mã, qua ứng dụng đối tác (ZaloPay, Grab, Coffee,...) dán vào lấy giảm giá ngay tắp lự!</p>
                      </div>

                      <div className="space-y-3">
                        {vouchers.map((voucher) => {
                          const isClaimed = voucher.claimed || userStats.unlockedVibes.includes(voucher.vibeRequired);
                          return (
                            <div 
                              key={voucher.id}
                              className={`border-3 border-laka-navy rounded-2xl p-3 relative overflow-hidden transition-all flex items-center justify-between shadow-sm bg-white`}
                            >
                              {/* Left pattern decoration */}
                              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-dashed border-r border-laka-navy/20 " style={{ backgroundColor: isClaimed ? '#FFD600' : '#E4E4E7' }}></div>

                              <div className="pl-3 pr-2 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="text-lg">{voucher.logo}</span>
                                  <h5 className="font-sans font-extrabold text-xs text-laka-navy truncate">
                                    {voucher.partnerName}
                                  </h5>
                                  {!isClaimed && (
                                    <span className="bg-zinc-100 text-[8px] border border-dashed border-zinc-400 text-zinc-500 px-1.5 rounded-sm shrink-0 uppercase font-mono">
                                      Khoá 🔒
                                    </span>
                                  )}
                                </div>
                                <p className="text-lg font-black text-laka-orange leading-none">{voucher.discount}</p>
                                <p className="text-[9px] text-laka-navy/60 font-mono mt-1 leading-tight">
                                  {voucher.description}
                                </p>
                                <p className="text-[8px] bg-laka-navy/10 px-1 py-0.5 inline-block rounded text-laka-navy font-bold font-mono mt-1 uppercase">
                                  Yêu Cầu: Vibe {voucher.vibeRequired}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-between self-stretch pl-2 shrink-0">
                                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Code</span>
                                <span className="font-mono font-black text-laka-navy text-sm bg-laka-cream/70 border border-laka-navy/40 px-1.5 py-0.5 rounded-md mb-2">
                                  {voucher.code}
                                </span>
                                
                                {isClaimed ? (
                                  <button 
                                    onClick={() => handleCopyVoucherCode(voucher)}
                                    className="h-8 px-2 rounded-lg bg-laka-orange text-white text-[10px] font-black border border-laka-navy tracking-tight retro-shadow-sm active:translate-y-[1px] flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedVoucherId === voucher.id ? 'COPIED! ✓' : 'COPY'}
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      alert(`Mở khoá voucher cực xịn bằng cách lên lịch du hí với Vibe "${voucher.vibeRequired}" ngay sếp ơi!`);
                                      setPhoneTab('planner');
                                      setSelectedVibe(voucher.vibeRequired);
                                    }}
                                    className="h-8 px-2 rounded-lg bg-zinc-100 text-zinc-400 text-[10px] font-bold border border-zinc-300 cursor-pointer"
                                  >
                                    MỞ KHÓA
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* BOTTOM MENU INDICATOR FOR SMARTPHONE FRAME */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t-3 border-laka-navy flex justify-around items-center px-4 z-40 select-none">
                    <button 
                      id="navbar-btn-home"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setPhoneTab('planner');
                      }} 
                      className={`flex flex-col justify-center items-center text-center p-2 relative ${phoneTab === 'planner' && currentScreen === 'dashboard' ? 'text-laka-orange scale-110' : 'text-laka-navy/60 hover:text-laka-navy'}`}
                    >
                      <span className="text-xl">🏠</span>
                      <span className="text-[8px] font-mono font-black uppercase mt-0.5">Planner</span>
                    </button>

                    <button 
                      id="navbar-btn-trips"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setPhoneTab('trips');
                      }}
                      className={`flex flex-col justify-center items-center text-center p-2 relative ${phoneTab === 'trips' && currentScreen === 'dashboard' ? 'text-laka-orange scale-110' : 'text-laka-navy/60 hover:text-laka-navy'}`}
                    >
                      <span className="text-xl">🗺️</span>
                      <span className="text-[8px] font-mono font-black uppercase mt-0.5">Passport</span>
                    </button>

                    {/* Quick AI generation mid action spacer circle floating icon */}
                    <button 
                      id="navbar-btn-quick"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setPhoneTab('planner');
                        setWizardStep(1);
                      }}
                      className="w-12 h-12 rounded-full bg-laka-yellow border-3 border-laka-navy shadow-sm flex items-center justify-center text-xl -mt-6 transform active:scale-95 transition-transform"
                      title="Lên lịch lẹ"
                    >
                      ✨
                    </button>

                    <button 
                      id="navbar-btn-vouchers"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setPhoneTab('vouchers');
                      }}
                      className={`flex flex-col justify-center items-center text-center p-2 relative ${phoneTab === 'vouchers' && currentScreen === 'dashboard' ? 'text-laka-orange scale-110' : 'text-laka-navy/60 hover:text-laka-navy'}`}
                    >
                      <span className="text-xl">🎁</span>
                      <span className="text-[8px] font-mono font-black uppercase mt-0.5">Voucher</span>
                    </button>

                    <button 
                      id="navbar-btn-logout"
                      onClick={() => {
                        if (confirm("Sếp có muốn đăng xuất Laka ID để bắt đầu hành trình splash không?")) {
                          setCurrentScreen('splash');
                        }
                      }}
                      className="flex flex-col justify-center items-center text-center p-2 text-laka-navy/60 hover:text-red-500"
                      title="Đăng xuất"
                    >
                      <span className="text-xl">👤</span>
                      <span className="text-[8px] font-mono font-black uppercase mt-0.5 font-bold">Thoát</span>
                    </button>
                  </div>

                </motion.div>
              )}

              {/* SCREEN 5: AI BUILDING LOADING WITH RETRO SPINNING ANIMATION */}
              {currentScreen === 'loading' && (
                <motion.div 
                  id="screen-loading"
                  key="loading"
                  className="flex-1 flex flex-col items-center justify-center p-6 bg-laka-cream relative overflow-hidden"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-dashed border-laka-navy/15 rounded-full animate-spin-slow"></div>

                  <div className="text-center space-y-6 relative z-10">
                    <div className="w-28 h-28 bg-laka-orange rounded-full border-4 border-laka-navy flex items-center justify-center mx-auto shadow-lg relative animate-bounce" style={{ animationDuration: '2.5s' }}>
                      <Compass className="w-16 h-16 text-white animate-spin-slow" />
                      <span className="absolute bottom-1 right-1 bg-laka-yellow border-2 border-laka-navy text-xs px-1.5 py-0.5 font-mono font-black rounded-lg">
                        LAKA
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-2xl font-sans font-black uppercase text-laka-navy tracking-tight leading-none">
                        LAKA ĐANG KHỞI QUẺ...
                      </h4>
                      <p className="text-xs bg-laka-yellow text-laka-navy py-1.5 px-3 rounded-lg border-2 border-laka-navy font-mono max-w-[260px] mx-auto min-h-[48px] flex items-center justify-center shadow-sm">
                        "{loadingText}"
                      </p>
                    </div>

                    <div className="w-48 bg-white border-3 border-laka-navy h-4 rounded-full overflow-hidden mx-auto p-[1px]">
                      <div className="bg-laka-pink h-full rounded-full animate-pulse" style={{ width: '80%' }}></div>
                    </div>

                    <p className="text-[10px] font-mono text-laka-navy/50 leading-relaxed uppercase max-w-[200px] mx-auto">
                      Đang phân rã dữ liệu bản đồ bằng mô hình Gemini 3.5 Flash siêu tốc cực xịn sò...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 6: ITINERARY TRIP PLANNER RESULTS DETAILS */}
              {currentScreen === 'itinerary' && itinerary && (
                <motion.div 
                  id="screen-itinerary"
                  key="itinerary"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col text-laka-navy bg-white"
                >
                  
                  {/* Results Top Header bar */}
                  <div className="sticky top-0 bg-white border-b-3 border-laka-navy p-3 z-30 flex justify-between items-center">
                    <button 
                      id="btn-itinerary-back"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setPhoneTab('planner');
                        setWizardStep(1);
                      }}
                      className="bg-white hover:bg-zinc-100 p-1.5 rounded-lg border-2 border-laka-navy cursor-pointer flex items-center gap-1 font-mono text-[10px] font-black"
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" /> TRỞ LẠI
                    </button>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-laka-navy/60 px-2 py-1 rounded bg-laka-yellow/20 border border-laka-navy/10 truncate max-w-[150px]">
                      📍 {itinerary.destination}
                    </span>

                    <button 
                      id="btn-itinerary-save"
                      onClick={handleSaveTrip}
                      className="bg-laka-green hover:bg-laka-green/90 text-laka-navy h-8 px-2.5 rounded-lg border-2 border-laka-navy font-display font-black text-[10px] flex items-center gap-1 shadow-sm active:translate-y-[2px]"
                    >
                      LƯU TRIP 📁
                    </button>
                  </div>

                  {/* Results dynamic display with visual items */}
                  <div className="p-4 flex-grow overflow-y-auto space-y-4">
                    
                    {/* Splash Trip Banner Card */}
                    <div className="p-5 bg-laka-cream border-3 border-laka-navy rounded-[28px] shadow-[4px_4px_0_#163A6B] relative overflow-hidden">
                      <div className="absolute top-2 right-2 rounded-full border border-laka-navy px-2 py-0.5 text-[9px] font-bold font-mono tracking-wider bg-white transform rotate-3">
                        Vibe {itinerary.vibe}
                      </div>

                      <div className="flex items-center gap-1 bg-laka-navy text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-md inline-block uppercase mb-2">
                        <span>🔥</span>
                        <span>Ước Tính: {itinerary.estimatedTotal}</span>
                      </div>

                      <h4 className="text-xl font-sans font-black tracking-tight leading-tight uppercase">
                        {itinerary.title}
                      </h4>
                      <p className="text-xs text-laka-navy/80 italic mt-1 font-mono">
                        "{itinerary.tagline}"
                      </p>
                    </div>

                    {/* Day-by-day Itinerary Accordions list details */}
                    <div className="space-y-4">
                      {itinerary.daysPlan.map((day) => (
                        <div 
                          key={day.dayNumber}
                          className="border-3 border-laka-navy rounded-[24px] overflow-hidden bg-[#FBFBFF] retrofit-box"
                        >
                          <div className={`p-3 border-b-2 border-laka-navy flex justify-between items-center ${currentThemeBgColorClass} text-white`}>
                            <h5 className="font-sans font-black text-xs uppercase tracking-tight">
                              🏕️ {day.theme}
                            </h5>
                            <span className="font-mono text-[9px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded">
                              Day 0{day.dayNumber}
                            </span>
                          </div>

                          <div className="divide-y divide-laka-navy/15">
                            {day.activities.map((act, index) => {
                              const actId = `${day.dayNumber}_${index}`;
                              const isChecked = !!activityCheckedStates[actId];
                              return (
                                <div 
                                  key={index}
                                  className={`p-3.5 space-y-1.5 transition-all ${isChecked ? 'bg-zinc-50 opacity-65' : ''}`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex gap-2">
                                      {/* Done checkbox checklist */}
                                      <button 
                                        onClick={() => handleToggleActivityCheck(actId)}
                                        className="mt-0.5 focus:outline-none shrink-0"
                                      >
                                        {isChecked ? (
                                          <CheckSquare className="w-[18px] h-[18px] text-laka-green stroke-[3]" />
                                        ) : (
                                          <Square className="w-[18px] h-[18px] text-laka-navy/60 hover:text-laka-navy stroke-[2.5]" />
                                        )}
                                      </button>

                                      <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-1.5 rounded bg-laka-navy text-white tracking-widest text-[8px]">
                                            {act.timeOfDay === 'Morning' ? 'SÁNG 🌅' : act.timeOfDay === 'Noon' ? 'TRƯA ☀️' : act.timeOfDay === 'Afternoon' ? 'CHIỀU 🌇' : 'TỐI 🍻'}
                                          </span>
                                          <p className={`font-sans font-black text-xs text-laka-navy ${isChecked ? 'line-through decoration-laka-navy/40' : ''}`}>
                                            {act.title}
                                          </p>
                                        </div>
                                        <p className="text-[10px] text-laka-navy/50 font-mono mt-0.5">
                                          📍 {act.location} • <span className="font-bold text-laka-orange">{act.approxCost}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-[10px] text-laka-navy/80 leading-normal pl-6 font-mono">
                                    {act.description}
                                  </p>

                                  <div className="bg-laka-yellow/15 p-2 rounded-lg border border-dashed border-laka-yellow pl-6 flex items-start gap-1">
                                    <span className="text-xs shrink-0 select-none">📸</span>
                                    <p className="text-[9px] font-mono text-laka-navy/80 italic leading-snug">
                                      <strong>Góc đẹp:</strong> {act.tip}
                                    </p>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gen Z Local Slang Lexicon / Tiếng lóng bản xứ */}
                    {itinerary.localSlangs && itinerary.localSlangs.length > 0 && (
                      <div className="p-4 bg-laka-navy text-white rounded-[24px] border-3 border-laka-navy space-y-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🇻🇳</span>
                          <h5 className="font-display font-black text-sm text-laka-yellow uppercase tracking-tight">
                            TỪ ĐIỂN TIẾNG LÓNG ĐỊA PHƯƠNG
                          </h5>
                        </div>
                        <p className="text-[10px] font-mono text-white/70 leading-normal">
                          Lưu ngay vài câu cửa miệng chuẩn vị dân địa bàn bảnh tỏn:
                        </p>
                        
                        <div className="space-y-2 pt-1 border-t border-white/10">
                          {itinerary.localSlangs.map((sl, sIdx) => (
                            <div key={sIdx} className="space-y-0.5">
                              <p className="text-xs font-mono font-black text-laka-pink">
                                • "{sl.word}"
                              </p>
                              <p className="text-[10px] text-white/80 pl-3 leading-snug font-mono">
                                {sl.meaning}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vital Recommendation / Lời khuyên sống còn */}
                    <div className="p-4 bg-white border-3 border-laka-navy rounded-[24px] space-y-3">
                      <h5 className="font-sans font-black text-xs uppercase tracking-wider text-laka-orange">
                        ⚠️ LỜI KHUYÊN SỐNG CÒN CỦA LAKA
                      </h5>
                      <ul className="space-y-1.5 pl-1">
                        {itinerary.genZRecommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="text-[10px] font-mono leading-normal flex items-start gap-1.5 text-laka-navy/90">
                            <span className="text-laka-pink font-bold shrink-0">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Refresh reset row */}
                    <div className="py-4 text-center">
                      <button 
                        onClick={() => {
                          setCurrentScreen('dashboard');
                          setPhoneTab('planner');
                          setWizardStep(1);
                        }}
                        className="h-11 px-6 bg-white text-laka-navy rounded-full font-display font-black text-xs border-2 border-laka-navy hover:bg-zinc-50 active:translate-y-[2px] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> LẬP KẾ HOẠCH KHÁC
                      </button>
                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Confetti unlocked voucher popup simulation (retained for active smartphone events) */}
      <AnimatePresence>
        {claimedVoucherPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-laka-navy"
          >
            <div className="bg-laka-cream border-4 border-laka-navy rounded-[32px] p-6 max-w-[325px] w-full text-center relative retro-shadow-lg">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-5xl transform -rotate-12 animate-bounce">
                🎉
              </div>
              
              <h4 className="text-xl font-sans font-black tracking-tight mt-2 text-laka-orange">
                BẠN NGOAN QUÁ, UNLOCKED 🎁!
              </h4>
              <p className="text-xs text-laka-navy/70 font-mono mt-1">
                Đã khui thành công quà độc quyền từ đối tác Laka
              </p>

              <div className="my-5 p-4 bg-white border-3 border-laka-navy rounded-2xl relative overflow-hidden">
                <span className="text-4xl block filter drop-shadow mb-1">
                  {claimedVoucherPopup.logo}
                </span>
                <p className="text-sm font-sans font-black text-laka-navy uppercase">
                  {claimedVoucherPopup.partnerName}
                </p>
                <p className="text-2xl font-black text-laka-pink leading-none my-1">
                  {claimedVoucherPopup.discount}
                </p>
                <p className="text-xs font-mono text-laka-navy/60">
                  Mã áp dụng: <strong className="text-laka-orange text-sm bg-laka-cream border border-laka-navy px-1.5 rounded">{claimedVoucherPopup.code}</strong>
                </p>
              </div>

              <p className="text-[10px] font-mono text-laka-navy/60 leading-snug mb-4">
                "{claimedVoucherPopup.description}"
              </p>

              <button 
                id="btn-claim-voucher-dismiss"
                onClick={() => {
                  handleCopyVoucherCode(claimedVoucherPopup);
                  setClaimedVoucherPopup(null);
                }}
                className="w-full h-11 bg-laka-navy text-white rounded-full font-display font-black text-xs tracking-wider border-2 border-laka-navy shadow-[4px_4px_0_#38B765] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                COPY MÃ & ĐÓNG LẠI ✓
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
