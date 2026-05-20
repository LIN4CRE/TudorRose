import { useState, useEffect } from 'react';

// Sample recommendations for the Plant Finder Quiz
const RECOMMENDATIONS = {
  'sun-beds-colour': {
    title: "Vibrant Sunny Perennials",
    plants: ["Lavender (Hidcote)", "Coneflowers (Echinacea)", "Salvia (Caradonna)", "Hardy Geraniums"],
    tips: "Plant in well-drained soil. Deadhead regularly to encourage new blooms all summer long!"
  },
  'sun-beds-foliage': {
    title: "Stunning Sun-Loving Shrubs",
    plants: ["Choisya (Mexican Orange Blossom)", "Hebe", "Euonymus", "Phormium"],
    tips: "Provide a good mulch in spring to retain moisture while these structural plants establish."
  },
  'sun-pots-colour': {
    title: "Show-Stopping Patio Displays",
    plants: ["Surfinia Petunias", "Geraniums (Pelargoniums)", "Lobelia", "Osteospermum"],
    tips: "Pots dry out quickly in the sun! Water daily in hot weather and feed weekly with tomato food."
  },
  'sun-pots-foliage': {
    title: "Aromatic Herbs & Ornamental Grasses",
    plants: ["Rosemary", "Thyme", "Pennisetum (Fountain Grass)", "Festuca glauca"],
    tips: "Use a free-draining compost mix with plenty of grit to keep the roots healthy."
  },
  'shade-beds-colour': {
    title: "Bright Shade-Loving Blooms",
    plants: ["Bleeding Heart (Dicentra)", "Foxgloves (Digitalis)", "Astilbe", "Japanese Anemones"],
    tips: "These plants love rich, organic soil. Dig in plenty of compost before planting."
  },
  'shade-beds-foliage': {
    title: "Lush Textured Foliage",
    plants: ["Hostas", "Ferns (Polystichum)", "Heuchera (Coral Bells)", "Sarcococca (Sweet Box)"],
    tips: "Watch out for slugs on Hostas! Sarcococca will give you sweet-scented flowers in winter."
  },
  'shade-pots-colour': {
    title: "Shady Container Brighteners",
    plants: ["Begonias (Non-stop)", "Busy Lizzies (Impatiens)", "Fuchsias", "Cyclamen"],
    tips: "Begonias perform incredibly well in shade and will flower continuously until the first frosts."
  },
  'shade-pots-foliage': {
    title: "Elegant Shady Pots",
    plants: ["Variegated Ivy", "Ophiopogon (Black Mondo Grass)", "Hachonechloa (Japanese Forest Grass)"],
    tips: "Mix different leaf textures and variegations to bring light to dark corners of your patio."
  }
};

export default function App() {
  // QoL 1: Scroll to top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // QoL 2: Plant Finder state
  const [sunlight, setSunlight] = useState<'sun' | 'shade'>('sun');
  const [location, setLocation] = useState<'beds' | 'pots'>('beds');
  const [goal, setGoal] = useState<'colour' | 'foliage'>('colour');
  const [finderResult, setFinderResult] = useState<any>(RECOMMENDATIONS['sun-beds-colour']);

  // QoL 3: Interactive FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // QoL 4: Live Open/Closed status
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // QoL 5: Copy notification state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Plant Finder recommendations when inputs change
  useEffect(() => {
    const key = `${sunlight}-${location}-${goal}` as keyof typeof RECOMMENDATIONS;
    setFinderResult(RECOMMENDATIONS[key] || RECOMMENDATIONS['sun-beds-colour']);
  }, [sunlight, location, goal]);

  // Check Open/Closed Status
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      // Adjust to UK local time (simplistic calculation, Barnsley is UK London time)
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        weekday: 'long'
      });
      const parts = formatter.formatToParts(now);
      const weekday = parts.find(p => p.type === 'weekday')?.value || "";
      const timeStr = parts.find(p => p.type === 'hour')?.value + ":" + parts.find(p => p.type === 'minute')?.value;
      const [currentHour, currentMin] = timeStr.split(':').map(Number);
      const currentMinutes = currentHour * 60 + currentMin;

      let openTime = 9 * 60; // 09:00
      let closeTime = 17 * 60; // 17:00 (5:00 PM)

      if (weekday === 'Sunday') {
        closeTime = 16 * 60; // 16:00 (4:00 PM)
      }

      if (currentMinutes >= openTime && currentMinutes < closeTime) {
        setIsOpenNow(true);
        const closingHour = weekday === 'Sunday' ? 4 : 5;
        setStatusMessage(`Open Now (Closes at ${closingHour}:00 PM)`);
      } else {
        setIsOpenNow(false);
        const openingDay = weekday === 'Sunday' ? 'Monday' : 'tomorrow';
        setStatusMessage(`Closed Now (Opens ${openingDay} at 9:00 AM)`);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const faqs = [
    {
      q: "Where exactly are you located in Barugh Green?",
      a: "We are at 222 Barugh Green Road, Barnsley, S75 1JY. You will find us easily on the main road, nestled between Higham and Barugh Green. Look out for our traditional TudorRose Nurseries signage!"
    },
    {
      q: "Is there parking available at the nursery?",
      a: "Yes! We have spaces for a few customer cars directly on site. If these are full, there is also ample roadside parking available on the main road with no yellow lines or restrictions."
    },
    {
      q: "Do you offer pre-made hanging baskets or custom plantings?",
      a: "Absolutely! We are famous locally for our beautiful hanging baskets and ready-planted pots. In spring/summer, we offer a massive selection of vibrant baskets, and we can also plant up your own containers if you bring them in."
    },
    {
      q: "Are dogs allowed in the garden centre?",
      a: "Yes, well-behaved dogs on leads are always welcome at TudorRose Nurseries. We love meeting your furry friends!"
    },
    {
      q: "Can I get expert gardening advice during my visit?",
      a: "Of course. David and the team have years of experience and are always happy to help you diagnose plant health issues, suggest choices for difficult spots (like dry shade), or offer care advice."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50/30 font-sans text-stone-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🌹</span>
              <div>
                <span className="text-lg sm:text-xl font-bold text-emerald-800 tracking-tight">TudorRose</span>
                <span className="text-lg sm:text-xl font-light text-stone-500"> Nurseries</span>
              </div>
            </div>
            
            {/* Live Indicator in Nav */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-stone-50">
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={isOpenNow ? 'text-emerald-700' : 'text-stone-600'}>
                {statusMessage}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
              <a href="#about" className="hover:text-emerald-700 transition-colors">About</a>
              <a href="#offerings" className="hover:text-emerald-700 transition-colors">What We Offer</a>
              <a href="#planner" className="hover:text-emerald-700 transition-colors">Plant Finder</a>
              <a href="#reviews" className="hover:text-emerald-700 transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-emerald-700 transition-colors">Contact</a>
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition-all shadow-md shadow-emerald-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 overflow-hidden">
        <div className="relative h-[70vh] sm:h-[80vh] min-h-[500px]">
          <img
            src="/images/hero-garden.jpg"
            alt="TudorRose Nurseries - Beautiful plants and flowers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-transparent" />
          <div className="relative z-10 flex items-center h-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/90 px-4 py-1.5 text-xs sm:text-sm font-medium text-white mb-6 backdrop-blur-sm shadow-md">
                <span className="text-yellow-300">★</span>
                <span>Best Garden Centre in Barnsley 2024</span>
                <span className="text-yellow-300">★</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif">
                TudorRose
                <span className="block text-emerald-300">Nurseries</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-stone-100 max-w-xl leading-relaxed">
                Your friendly family-run garden centre in Barugh Green, Barnsley. Growing quality plants, shrubs and flowers at prices that won't stretch your budget.
              </p>
              
              {/* Dynamic Status Badge (Hero) */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs sm:text-sm font-medium text-white">
                <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{statusMessage}</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/40">
                  Visit Us Today
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a href="#reviews" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition-all">
                  ★ 4.7 Rating (172 Reviews)
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">About Us</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900 font-serif leading-tight">
                A Local Family Business <span className="text-emerald-700">Since Day One</span>
              </h2>
              <div className="mt-6 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Welcome to <strong className="text-stone-800">TudorRose Nurseries</strong> – a small,
                  family-run garden centre nestled in the heart of <strong>Barugh Green, Barnsley</strong>.
                  We're proud to serve our local community with healthy, high-quality plants at prices
                  that are fair and sensible.
                </p>
                <p>
                  Our nursery is run by <strong className="text-stone-800">David Linacre</strong>, who
                  along with our friendly team, brings years of horticultural knowledge and a genuine
                  love for gardening. Whether you're an experienced gardener or just starting out,
                  we're here to help you find the perfect plants for your outdoor space.
                </p>
                <p>
                  Featured in <em>Best of Barnsley</em> as one of the <strong>7 Unique Garden Centres</strong>{" "}
                  across Barnsley, and proudly awarded <strong>The Best Garden Centre in Barnsley for 2024</strong>{" "}
                  by Quality Business Awards UK with an overall quality score exceeding 95%.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 font-bold text-sm">★</div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 font-bold text-sm">★</div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 font-bold text-sm">★</div>
                </div>
                <div className="text-sm text-stone-500">
                  <span className="font-semibold text-stone-800">4.7 ★</span> Google Rating
                  <br />from 172 happy customers
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/flowers.jpg"
                  alt="Beautiful plants and flowers at TudorRose Nurseries"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-emerald-700 text-white rounded-xl px-5 py-3 shadow-xl">
                <p className="text-lg font-bold">Est.</p>
                <p className="text-2xl font-bold">Local</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="offerings" className="py-16 sm:py-24 bg-emerald-50/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">What We Offer</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900 font-serif">
              Everything for Your <span className="text-emerald-700">Garden</span>
            </h2>
            <p className="mt-4 text-stone-600">
              From vibrant blooms to sturdy shrubs, discover a wonderful selection of plants and garden essentials
              — all at prices that won't break the bank.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🌸",
                title: "Flowers & Perennials",
                desc: "A stunning variety of colourful flowers and perennials to brighten up any garden border or container.",
              },
              {
                icon: "🌿",
                title: "Shrubs & Trees",
                desc: "From ornamental shrubs to specimen trees, perfect for adding structure and year-round interest.",
              },
              {
                icon: "🪴",
                title: "Hanging Baskets",
                desc: "Beautifully planted hanging baskets, ready to hang and enjoy — a local customer favourite!",
              },
              {
                icon: "🏺",
                title: "Pots & Planters",
                desc: "A lovely selection of pots, planters and containers in all shapes, sizes and materials.",
              },
              {
                icon: "🌱",
                title: "Garden Accessories",
                desc: "Compost, bark, tools and all the bits and bobs you need to keep your garden thriving.",
              },
              {
                icon: "🎄",
                title: "Seasonal Specials",
                desc: "From bedding plants in spring to artificial Christmas trees in winter — we've got you covered.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-xl bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-stone-100"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-stone-800">{item.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QoL 2: Interactive Plant Finder Tool */}
      <section id="planner" className="py-16 sm:py-24 bg-white border-y border-stone-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">Interactive Tool</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900 font-serif">
              TudorRose <span className="text-emerald-700">Plant Finder</span>
            </h2>
            <p className="mt-4 text-stone-600">
              Not sure what to plant? Select your garden options below to get custom suggestions of what to buy at our nursery.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Sunlight Selection */}
              <div>
                <span className="block text-sm font-semibold text-stone-700 mb-2">1. Sunlight Level</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSunlight('sun')}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      sunlight === 'sun'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    ☀️ Sunny / Partial Sun
                  </button>
                  <button
                    onClick={() => setSunlight('shade')}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      sunlight === 'shade'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    ☁️ Shady / North Facing
                  </button>
                </div>
              </div>

              {/* Location Selection */}
              <div>
                <span className="block text-sm font-semibold text-stone-700 mb-2">2. Where are you planting?</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLocation('beds')}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      location === 'beds'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🏡 Borders & Beds
                  </button>
                  <button
                    onClick={() => setLocation('pots')}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      location === 'pots'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🪴 Pots & Containers
                  </button>
                </div>
              </div>

              {/* Goal Selection */}
              <div>
                <span className="block text-sm font-semibold text-stone-700 mb-2">3. Primary Goal</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGoal('colour')}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      goal === 'colour'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🌸 Colorful Blooms
                  </button>
                  <button
                    onClick={() => setGoal('foliage')}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      goal === 'foliage'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🌿 Foliage & Structure
                  </button>
                </div>
              </div>
            </div>

            {/* Results Output */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  Our Recommendation
                </div>
                <h4 className="text-xl font-bold text-stone-800">{finderResult.title}</h4>
                
                <div className="mt-4">
                  <span className="block text-xs font-medium text-stone-400 uppercase tracking-wider">Top Choices at TudorRose:</span>
                  <ul className="mt-2 space-y-1.5">
                    {finderResult.plants.map((plant: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-stone-700">
                        <span className="text-emerald-500 font-bold">✓</span>
                        {plant}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 p-3.5 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">💡 Professional Tip:</span>
                  <p className="text-xs text-amber-900 leading-relaxed">{finderResult.tips}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-md"
                >
                  Enquire About Stock
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 sm:py-24 bg-stone-50/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">Customer Reviews</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900 font-serif">
              What Our Customers <span className="text-emerald-700">Say</span>
            </h2>
            <p className="mt-4 text-stone-600">
              Rated <strong className="text-stone-800">4.7 out of 5 stars</strong> on Google from 172 reviews.
              Here's what the community has to say about us.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rachel Donoghue",
                rating: 5,
                text: "Never fails to amaze me here.. The price and helpful friendly staff. Quality of the flowers. A*",
              },
              {
                name: "Timothy Dolan",
                rating: 5,
                text: "A great little garden centre with a broad selection of plants, shrubs, trees, flower pots and more, without paying mainstream garden centre prices. Highly recommended.",
              },
              {
                name: "Vicki W",
                rating: 5,
                text: "Great choice of plants and pots at a good price with very friendly helpful staff. Have bought from here before and would definitely recommend to others.",
              },
              {
                name: "Howard Turner",
                rating: 4,
                text: "Really nice place to visit. There are spaces for a few cars to park. Good selection of plants and shrubs, prices are reasonable. Staff very friendly. Well worth a visit.",
              },
              {
                name: "Robert Leishman",
                rating: 5,
                text: "Nice staff, very helpful, easy to park. Price of plants very reasonable. Good healthy plants, always open.",
              },
              {
                name: "Best of Barnsley",
                rating: 5,
                text: "Tudor Rose Nurseries exudes a rustic charm that beckons plant enthusiasts and novices alike. From vibrant perennials to rare shrubs, this haven boasts a diverse array of flora.",
              },
            ].map((review, i) => (
              <div key={i} className="rounded-xl bg-white p-6 border border-stone-100 hover:bg-emerald-50/50 hover:shadow-md transition-all duration-300">
                <div className="flex gap-1 text-yellow-500 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-current' : 'fill-stone-200 text-stone-200'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed italic">"{review.text}"</p>
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="font-semibold text-stone-800 text-sm">{review.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://absolutelandscapes.org/local/business/tudor-rose-nurseries-354188"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors border border-emerald-200 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              See all reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* QoL 3: Interactive FAQ Accordion */}
      <section className="py-16 sm:py-24 bg-white border-y border-stone-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900 font-serif">
              Frequently Asked <span className="text-emerald-700">Questions</span>
            </h2>
            <p className="mt-4 text-stone-600">
              Have a question before visiting? Browse our quick answers below.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-stone-800 hover:bg-emerald-50/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-emerald-700 transform transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaq === index ? 'max-h-96 opacity-100 border-t border-stone-200' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="p-5 text-sm text-stone-600 leading-relaxed bg-white">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours / Info Bar */}
      <section className="py-12 sm:py-16 bg-emerald-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            <div>
              <div className="text-2xl mb-3">🕐</div>
              <h3 className="font-bold text-lg">Opening Hours</h3>
              <div className="mt-3 space-y-1 text-emerald-100 text-sm">
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span>Mon - Sat</span>
                  <span className="font-medium text-white">9:00 AM – 5:00 PM</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span>Sunday</span>
                  <span className="font-medium text-white">9:00 AM – 4:00 PM</span>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-900/60 rounded-full px-3 py-1 text-xs font-semibold">
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{statusMessage}</span>
              </div>
            </div>
            <div>
              <div className="text-2xl mb-3">📍</div>
              <h3 className="font-bold text-lg">Find Us</h3>
              <p className="mt-3 text-emerald-100 text-sm leading-relaxed">
                222 Barugh Green Road<br />
                Barugh Green, Barnsley<br />
                South Yorkshire, S75 1JY
              </p>
            </div>
            <div>
              <div className="text-2xl mb-3">📞</div>
              <h3 className="font-bold text-lg">Call Us</h3>
              <p className="mt-3 text-emerald-100 text-sm">
                <a href="tel:01226380634" className="hover:text-white transition-colors">01226 380634</a>
              </p>
              <p className="text-emerald-100 text-sm mt-1">
                <a href="tel:07391428996" className="hover:text-white transition-colors">07391 428996</a>
              </p>
            </div>
            <div>
              <div className="text-2xl mb-3">🚗</div>
              <h3 className="font-bold text-lg">Parking</h3>
              <p className="mt-3 text-emerald-100 text-sm leading-relaxed">
                We have spaces for a few cars on site, plus roadside parking on the main road with no yellow lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">Get in Touch</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-stone-900 font-serif leading-tight">
                We'd Love to <span className="text-emerald-700">Hear From You</span>
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed mb-8">
                Whether you have a question about a specific plant, need advice for your garden,
                or just want to say hello — don't hesitate to get in touch!
              </p>

              {/* Clipboard Copy Notification */}
              {copiedText && (
                <div className="mb-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-2 rounded-full animate-bounce">
                  <span>✓</span> Copied {copiedText} to clipboard!
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-100/50 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800">Email</p>
                    <a href="mailto:davidlinacre@hotmail.co.uk" className="text-emerald-700 hover:text-emerald-600 transition-colors text-sm">
                      davidlinacre@hotmail.co.uk
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy("davidlinacre@hotmail.co.uk", "email")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-xs font-semibold text-stone-500 hover:text-emerald-700 bg-white rounded-lg shadow-sm border border-stone-200"
                    title="Copy email to clipboard"
                  >
                    📋 Copy
                  </button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-100/50 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800">Phone</p>
                    <a href="tel:01226380634" className="text-emerald-700 hover:text-emerald-600 transition-colors text-sm block">
                      Landline: 01226 380634
                    </a>
                    <a href="tel:07391428996" className="text-emerald-700 hover:text-emerald-600 transition-colors text-sm block">
                      Mobile: 07391 428996
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy("07391428996", "phone number")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-xs font-semibold text-stone-500 hover:text-emerald-700 bg-white rounded-lg shadow-sm border border-stone-200"
                    title="Copy phone to clipboard"
                  >
                    📋 Copy
                  </button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-100/50 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800">Visit Us</p>
                    <p className="text-stone-500 text-sm">
                      222 Barugh Green Road<br />
                      Barugh Green, Barnsley<br />
                      South Yorkshire, S75 1JY
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy("222 Barugh Green Road, Barnsley, S75 1JY", "address")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-xs font-semibold text-stone-500 hover:text-emerald-700 bg-white rounded-lg shadow-sm border border-stone-200"
                    title="Copy address to clipboard"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://www.google.com/maps/place/222+Barugh+Green+Rd,+Barugh+Green,+Higham,+Barnsley+S75+1JY/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions on Google Maps
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-100">
              <h3 className="text-xl font-bold text-stone-800 mb-6">Send Us a Message</h3>
              <form
                action={`https://formsubmit.co/${encodeURIComponent("davidlinacre@hotmail.co.uk")}`}
                method="POST"
                className="space-y-4"
              >
                <input type="hidden" name="_subject" value="New enquiry from TudorRose Nurseries website" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">Phone Number (optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="07123 456789"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                >
                  Send Message
                </button>
                <p className="text-xs text-stone-400 text-center mt-2">
                  We'll get back to you as soon as possible.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-stone-200 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2380.578!2d-1.524528!3d53.567127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDM0JzAxLjciTiAxwrAzMScyOC4zIlc!5e0!3m2!1sen!2suk!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TudorRose Nurseries Location"
          className="w-full h-full"
        />
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌹</span>
                <div>
                  <span className="text-lg font-bold text-white">TudorRose</span>
                  <span className="text-lg font-light text-stone-500"> Nurseries</span>
                </div>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Your friendly family-run garden centre serving the Barugh Green and Barnsley community
                with quality plants, friendly advice and fair prices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#offerings" className="hover:text-emerald-400 transition-colors">What We Offer</a></li>
                <li><a href="#planner" className="hover:text-emerald-400 transition-colors">Plant Finder</a></li>
                <li><a href="#reviews" className="hover:text-emerald-400 transition-colors">Reviews</a></li>
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>222 Barugh Green Rd</li>
                <li>Barugh Green, Barnsley</li>
                <li>S75 1JY</li>
                <li>
                  <a href="tel:01226380634" className="hover:text-emerald-400 transition-colors">01226 380634</a>
                </li>
                <li>
                  <a href="mailto:davidlinacre@hotmail.co.uk" className="hover:text-emerald-400 transition-colors break-all">
                    davidlinacre@hotmail.co.uk
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Hours</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Mon - Sat</span>
                  <span className="text-white">9AM - 5PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white">9AM - 4PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} TudorRose Nurseries. All rights reserved.</p>
            <p className="text-stone-600">
              Website by David Linacre | <a href="mailto:davidlinacre@hotmail.co.uk" className="hover:text-emerald-400 transition-colors">davidlinacre@hotmail.co.uk</a>
            </p>
          </div>
        </div>
      </footer>

      {/* QoL 5: Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-emerald-700 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
