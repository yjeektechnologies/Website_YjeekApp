export const t = {
  en: {
    // Navbar
    nav: {
      howItWorks: "How it Works",
      partnerWithUs: "Partner With Us",
      becomeDriver: "Become a Driver",
      corporate: "Corporate",
      getTheApp: "Get the App",
      english: "English",
      arabic: "العربية",
    },

    // Hero
    hero: {
      badge: "Live right now in",
      headline1: "Your City.",
      headline2: "Delivered in Minutes.",
      subtext: (country: string) =>
        `Hungry? Running low on groceries? Need flowers and forgot it was an anniversary? Whatever — we'll get it to your door, fast. Even at midnight. Now in ${country}.`,
      cta: "it's free. no catch. just download.",
      appStore: "App Store",
      appStorePrefix: "Download on the",
      googlePlay: "Google Play",
      googlePlayPrefix: "Get it on",
      socialProof: "4.9★ · 100K+ people who didn't regret it",
      driverBadge: "Your driver is",
      driverMins: "4 mins away",
      orderStatus: "Your order",
      onTheWay: "On its way! 🎉",
    },

    // Categories
    categories: {
      heading1: "Name it.",
      heading2: "We deliver it.",
      subtext:
        "Food, groceries, flowers, gadgets, pet food, and honestly a lot more. If you can think of it at 11pm, we probably have it.",
      viewAll: "See everything we deliver",
      getTheApp: "Get the App",
      items: {
        food: { title: "Order Food", desc: "Your favourites, from round the corner or across town." },
        groceries: { title: "Groceries", desc: "Fresh groceries in 15 minutes. No, really." },
        flowers: { title: "Flowers", desc: "For someone special. Or yourself — we don't judge." },
        electronics: { title: "Electronics", desc: "Tech that shows up when you actually need it." },
        accessories: { title: "Accessories", desc: "Style delivered. Literally." },
        pets: { title: "Pet Supplies", desc: "They didn't ask to be here. Treat them well." },
      },
    },

    // How It Works
    howItWorks: {
      badge: "no, seriously. it's this easy.",
      heading: "ok, here's how it works",
      subtext: "You do three things. We handle everything else. Deal.",
      step: "Step",
      steps: [
        {
          title: "Tell us where you are",
          desc: "Drop a pin. That's literally it. We'll figure out the fastest route, nearest store, and all the boring logistics.",
          aside: "(takes about 5 seconds)",
        },
        {
          title: "Pick something (anything)",
          desc: "Hundreds of restaurants, groceries and shops. Scroll for 30 seconds. You'll want everything. Just pick something.",
          aside: "(warning: you will get hungry scrolling)",
        },
        {
          title: "Watch it show up",
          desc: "Track your order on the map as it makes its way to you. It's oddly satisfying. Don't fight it.",
          aside: "(way faster than you expect)",
        },
      ],
    },

    // Features
    features: {
      heading1: "Sounds too good?",
      heading2: "It really is.",
      subtext:
        "We've quietly fixed all the annoying delivery problems — slow drivers, hidden fees, 'restaurant closed' at 9pm. You're welcome.",
      items: [
        {
          title: "No more 'driver not found'",
          tag: "instant matching",
          desc: "We pair you with the nearest driver before you put your phone down. No queue, no retry, no frustration.",
        },
        {
          title: "Stalker mode (for your food)",
          tag: "live tracking",
          desc: "Watch your order move on the map, turn by turn. Yes, it's kind of addictive. No, we're not going to stop you.",
        },
        {
          title: "30 seconds to a driver",
          tag: "maybe 25",
          desc: "Actually less sometimes. The nearest driver gets your order the moment you tap confirm. You'll forget you were waiting.",
        },
        {
          title: "Sushi + Panadol in one order",
          tag: "one cart, one fee",
          desc: "Food, groceries, pharmacy — all in one cart, one delivery fee, one door. This used to require three separate apps.",
        },
        {
          title: "Your card info is safe with us",
          tag: "we're annoyingly serious about this",
          desc: "Payment data is encrypted end-to-end. We take security so seriously that talking about it is almost boring. Almost.",
        },
        {
          title: "2am and hungry? Same.",
          tag: "cloud kitchens, all night",
          desc: "We run kitchens specifically for people who get hungry at weird hours. You're not the only one. You're actually the target audience.",
        },
      ],
    },

    // App Download
    appDownload: {
      heading1: "Download once.",
      heading2: "Order forever.",
      subtext:
        "First order takes 2 minutes to set up. After that, your usual is literally one tap away. That's the whole pitch. We're done.",
      appStorePrefix: "Download on the",
      appStore: "App Store",
      googlePlayPrefix: "Get it on",
      googlePlay: "Google Play",
      stats: {
        restaurants: "partner businesses",
        orders: "happy deliveries",
        cities: "cities & counting",
      },
    },

    // Partners
    partners: {
      heading: "Let's do this together —",
      subtext:
        "Got a restaurant? We bring you orders. Got a vehicle? We pay you to drive. Both are a pretty good deal, honestly.",
      vendor: {
        title: "Got a restaurant? Join us.",
        desc: "Stop giving 30% commission to the other guys. We're fair, we're growing fast, and we actually care if your business does well.",
        perks: ["Free to get started", "Real-time sales dashboard", "A support team that picks up"],
        cta: "Get listed today",
      },
      driver: {
        title: "Drive with us. Earn more.",
        desc: "Set your own hours, pick your zone, and get paid well. Smart routing means more trips, less time driving in circles going nowhere.",
        perks: ["Competitive pay + tips on every order", "Paid 2–3 times a month, reliably", "In-app support that actually responds"],
        cta: "Start earning",
      },
    },

    // Testimonials
    testimonials: {
      heading: "Don't just take our word for it",
      subtext: "Rated 4.9★ by 100,000+ users. We're honestly a bit proud of that.",
      reviews: [
        {
          name: "Ahmed K.",
          role: "Regular customer",
          city: "Dubai, UAE",
          text: "The tracking is kind of insane — it literally shows which lane the driver is in. Fastest I've ever received anything in Dubai, no exaggeration.",
        },
        {
          name: "Sarah M.",
          role: "Restaurant owner",
          city: "Riyadh, KSA",
          text: "Since we joined Yjeek, delivery times dropped 40% and complaints basically disappeared. I genuinely didn't think that was possible.",
        },
        {
          name: "Tarek H.",
          role: "Driver partner",
          city: "Abu Dhabi, UAE",
          text: "I make more money in fewer hours because the app sends me on smart routes. It just makes sense — which is rare.",
        },
      ],
    },

    // Footer
    footer: {
      tagline: "Fast delivery, real people, zero drama. Born in Bahrain 🇧🇭, heading everywhere.",
      appStorePrefix: "Download on the",
      appStore: "App Store",
      googlePlayPrefix: "Get it on",
      googlePlay: "Google Play",
      company: "Company",
      companyLinks: ["About Us", "Careers", "Press", "Corporate", "Sustainability"],
      partner: "Partner",
      partnerLinks: ["Partner with us", "Drive with us", "Success Stories"],
      legal: "Legal",
      legalLinks: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Security", "FAQ"],
      popularCities: "Popular Cities in",
      topCuisines: "Top Cuisines",
      cuisines: ["Healthy", "Lebanese", "Italian", "Japanese", "Indian"],
      contact: "Contact",
      headquarters: "Headquarters",
      address: "Seef District,\nManama, Bahrain",
      copyright: (year: number) => `© ${year} Yjeek Technologies. All rights reserved. · yjeektech.com`,
    },
  },

  ar: {
    // Navbar
    nav: {
      howItWorks: "كيف يعمل يجيك",
      partnerWithUs: "شراكة معنا",
      becomeDriver: "انضم كسائق",
      corporate: "الشركات",
      getTheApp: "حمّل التطبيق",
      english: "English",
      arabic: "العربية",
    },

    // Hero
    hero: {
      badge: "متاح الآن في",
      headline1: "مدينتك.",
      headline2: "توصيل خلال دقائق.",
      subtext: (country: string) =>
        `جائع؟ محتاج بقالة؟ نسيت مناسبة وتحتاج زهور؟ مهما كان — نوصّله على بابك بسرعة. حتى نص الليل. نخدم ${country} الآن.`,
      cta: "مجاني. بدون أي شرط. بس حمّل.",
      appStore: "App Store",
      appStorePrefix: "حمّل من",
      googlePlay: "Google Play",
      googlePlayPrefix: "احصل عليه من",
      socialProof: "٤.٩★ · أكثر من ١٠٠ ألف شخص ما ندموا",
      driverBadge: "السائق على بُعد",
      driverMins: "٤ دقائق",
      orderStatus: "طلبك",
      onTheWay: "في الطريق! 🎉",
    },

    // Categories
    categories: {
      heading1: "قوله.",
      heading2: "بنوصّله.",
      subtext:
        "طعام، بقالة، زهور، إلكترونيات، مستلزمات حيوانات، والكثير غيرها. لو خطر ببالك الساعة ١١ ليل، على الأرجح عندنا.",
      viewAll: "شوف كل خدماتنا",
      getTheApp: "حمّل التطبيق",
      items: {
        food: { title: "اطلب الطعام", desc: "من مطبخك المفضّل، قريب أو بعيد." },
        groceries: { title: "البقالة", desc: "منتجات طازجة في ١٥ دقيقة. جدياً." },
        flowers: { title: "الزهور", desc: "لشخص مميّز. أو لنفسك — ما في حكم." },
        electronics: { title: "الإلكترونيات", desc: "تقنية تجيك لما تحتاجها بالضبط." },
        accessories: { title: "الإكسسوارات", desc: "الأناقة توصل على بابك، حرفياً." },
        pets: { title: "مستلزمات الحيوانات", desc: "ما اختاروا يجوا — دلّلهم." },
      },
    },

    // How It Works
    howItWorks: {
      badge: "بصراحة، أسهل مما تتخيّل.",
      heading: "ثلاث خطوات، بس.",
      subtext: "أنت تسوّي ثلاثة أشياء. احنا نتكفّل بالباقي.",
      step: "الخطوة",
      steps: [
        {
          title: "قولنا وين أنت",
          desc: "حدّد الموقع. بس هذا. احنا نحسب أسرع طريق، أقرب محل، وكل التفاصيل الثانية.",
          aside: "(يأخذ حوالي ٥ ثوانٍ)",
        },
        {
          title: "اختار اللي تبيه",
          desc: "مئات المطاعم والمحلات. تصفّح ٣٠ ثانية. بتحب كل شيء. بس اختار شيء.",
          aside: "(تحذير: بتجوع وأنت تتصفّح)",
        },
        {
          title: "شاهده يوصل",
          desc: "تابع طلبك على الخريطة وهو في طريقه إليك. ممتع بشكل غريب. ما تقاومه.",
          aside: "(أسرع مما تتوقع دائماً)",
        },
      ],
    },

    // Features
    features: {
      heading1: "يبدو جيداً جداً؟",
      heading2: "هو كذلك فعلاً.",
      subtext:
        "حلّينا كل مشاكل التوصيل المزعجة — سائقين بطيئين، رسوم مخفية، مطاعم 'مغلقة' في التاسعة مساءً. عفواً على الانتظار.",
      items: [
        {
          title: "لا مزيد من 'ما في سائق'",
          tag: "مطابقة فورية",
          desc: "نربطك بأقرب سائق قبل ما تحط هاتفك. بدون طابور، بدون إعادة محاولة، بدون إزعاج.",
        },
        {
          title: "وضع التتبّع (لطلبك)",
          tag: "تتبّع مباشر",
          desc: "شوف طلبك يتحرك على الخريطة منعطف بمنعطف. آه، إنه مسلٍّ. لا تحاول تقاومه.",
        },
        {
          title: "سائق خلال ٣٠ ثانية",
          tag: "أحياناً أقل",
          desc: "أقرب سائق يستلم طلبك فور ما تضغط تأكيد. مش هتحس إنك انتظرت.",
        },
        {
          title: "سوشي + دواء في طلب واحد",
          tag: "سلة واحدة، رسوم واحدة",
          desc: "طعام، بقالة، صيدلية — في سلة واحدة، رسوم توصيل واحدة، باب واحد. قبل كان يحتاج ثلاث تطبيقات.",
        },
        {
          title: "بياناتك الآمنة، مضمونة",
          tag: "نأخذها بجدية مزعجة",
          desc: "معلومات الدفع مشفّرة من الطرفين. اهتمامنا بالأمان أصبح شبه ممل من كثرته. تقريباً.",
        },
        {
          title: "جوعان نص الليل؟ احنا كذلك.",
          tag: "مطابخ سحابية، طوال الليل",
          desc: "عندنا مطابخ تشتغل طول الليل لهالأشخاص بالضبط. أنت مش الوحيد. أنت في الواقع عميلنا المثالي.",
        },
      ],
    },

    // App Download
    appDownload: {
      heading1: "حمّل مرة.",
      heading2: "اطلب دايماً.",
      subtext:
        "الطلب الأول يأخذ دقيقتين للإعداد. بعدها، طلبك المعتاد بلمسة واحدة. هذا كل شيء. ما عندنا أكثر.",
      appStorePrefix: "حمّل من",
      appStore: "App Store",
      googlePlayPrefix: "احصل عليه من",
      googlePlay: "Google Play",
      stats: {
        restaurants: "شريك تجاري",
        orders: "توصيلة ناجحة",
        cities: "مدينة وبنكمّل",
      },
    },

    // Partners
    partners: {
      heading: "نكبر سوا —",
      subtext:
        "عندك مطعم؟ نجيبلك طلبات. عندك سيارة؟ ندفع لك عليها. الاثنتين صفقة جيدة، صراحةً.",
      vendor: {
        title: "عندك مطعم؟ انضم.",
        desc: "بطّل تدفع عمولة ٣٠٪ للتطبيقات الثانية. نحن عادلين، نكبر بسرعة، ويهمنا فعلاً إن مشروعك ينجح.",
        perks: ["مجاناً للبداية", "لوحة مبيعات مباشرة", "فريق دعم يرد فعلاً"],
        cta: "انضم اليوم",
      },
      driver: {
        title: "اشتغل معنا. اكسب أكثر.",
        desc: "اختار وقتك، اختار منطقتك، وادفع بشكل جيد. التوجيه الذكي يعني رحلات أكثر ووقت ضائع أقل.",
        perks: ["أجر تنافسي + إكراميات على كل طلب", "دفعات ٢–٣ مرات شهرياً بانتظام", "دعم داخل التطبيق يستجيب فعلاً"],
        cta: "ابدأ الكسب",
      },
    },

    // Testimonials
    testimonials: {
      heading: "لا تأخذ كلامنا فقط",
      subtext: "تقييم ٤.٩★ من أكثر من ١٠٠,٠٠٠ مستخدم. فخورون بهذا بصدق.",
      reviews: [
        {
          name: "أحمد ك.",
          role: "زبون دائم",
          city: "دبي، الإمارات",
          text: "نظام التتبع لا يُصدَّق — يُظهر بالضبط في أي مسار السائق. أسرع توصيل جربته في دبي، بدون مبالغة.",
        },
        {
          name: "سارة م.",
          role: "صاحبة مطعم",
          city: "الرياض، السعودية",
          text: "من يوم انضممنا ليجيك، أوقات التوصيل قلّت ٤٠٪ والشكاوى اختفت تقريباً. ما كنت أتوقع هذا بصراحة.",
        },
        {
          name: "طارق ه.",
          role: "شريك سائق",
          city: "أبوظبي، الإمارات",
          text: "أكسب أكثر في وقت أقل لأن التطبيق يرسلني على مسارات منطقية. وهذا نادر بصدق.",
        },
      ],
    },

    // Footer
    footer: {
      tagline: "توصيل سريع، أناس حقيقيون، بلا تعقيدات. من البحرين 🇧🇭، في طريقنا لكل مكان.",
      appStorePrefix: "حمّل من",
      appStore: "App Store",
      googlePlayPrefix: "احصل عليه من",
      googlePlay: "Google Play",
      company: "الشركة",
      companyLinks: ["من نحن", "الوظائف", "الصحافة", "الشركات", "الاستدامة"],
      partner: "الشراكة",
      partnerLinks: ["شارك معنا", "اقُد معنا", "قصص النجاح"],
      legal: "القانونية",
      legalLinks: ["الشروط والأحكام", "سياسة الخصوصية", "سياسة الكوكيز", "الأمان", "الأسئلة الشائعة"],
      popularCities: "أبرز مدن",
      topCuisines: "أشهر المطابخ",
      cuisines: ["صحي", "لبناني", "إيطالي", "ياباني", "هندي"],
      contact: "تواصل معنا",
      headquarters: "المقر الرئيسي",
      address: "منطقة سيف،\nالمنامة، البحرين",
      copyright: (year: number) => `© ${year} يجيك تكنولوجيز. جميع الحقوق محفوظة. · yjeektech.com`,
    },
  },
};

export type Translations = typeof t.en;
