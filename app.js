// ============================================
// WealthMap — Core Application
// Built with vanilla JavaScript, no frameworks
// ============================================

// Holds all generated cards and the current filter state
let allCards = [];
let activeFilter = "all";

// SVG icons for each card type — clean line-art, no emojis
const ICONS = {
  MMF: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/><line x1="12" y1="14" x2="12" y2="17"/></svg>`,
  EQ: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  BOND: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  BTC: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9V8z"/><path d="M9 13h5a2.5 2.5 0 0 1 0 5H9V13z"/><line x1="9" y1="8" x2="9" y2="18"/><line x1="7" y1="9" x2="9" y2="9"/><line x1="7" y1="17" x2="9" y2="17"/><line x1="7" y1="13" x2="9" y2="13"/></svg>`,
  REIT: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>`,
  SACCO: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="18" cy="7" r="2"/><path d="M22 21v-1a3 3 0 0 0-3-3h-1"/></svg>`,
  MPESA: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.5"/><line x1="9" y1="6" x2="15" y2="6"/></svg>`,
  SAVE: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  TFSA: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  IRA: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  JOB: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  WORK: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  CERT: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  REMOTE: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

// Messages that cycle on the loading screen while APIs are being called
const loadingMessages = [
  "Analyzing your profile...",
  "Mapping investment options...",
  "Finding opportunities for you...",
  "Building your WealthMap...",
  "Almost ready...",
];

// Currency and stock exchange info per country
const COUNTRY_DATA = {
  KE: {
    name: "Kenya",
    currency: "KES",
    symbol: "KSh",
    exchange: "Nairobi Securities Exchange (NSE)",
  },
  NG: {
    name: "Nigeria",
    currency: "NGN",
    symbol: "₦",
    exchange: "Nigerian Exchange Group (NGX)",
  },
  GH: {
    name: "Ghana",
    currency: "GHS",
    symbol: "GH₵",
    exchange: "Ghana Stock Exchange (GSE)",
  },
  ZA: {
    name: "South Africa",
    currency: "ZAR",
    symbol: "R",
    exchange: "Johannesburg Stock Exchange (JSE)",
  },
  RW: {
    name: "Rwanda",
    currency: "RWF",
    symbol: "RWF",
    exchange: "Rwanda Stock Exchange (RSE)",
  },
  TZ: {
    name: "Tanzania",
    currency: "TZS",
    symbol: "TSh",
    exchange: "Dar es Salaam Stock Exchange (DSE)",
  },
  UG: {
    name: "Uganda",
    currency: "UGX",
    symbol: "USh",
    exchange: "Uganda Securities Exchange (USE)",
  },
  ET: {
    name: "Ethiopia",
    currency: "ETB",
    symbol: "Br",
    exchange: "Ethiopian Securities Exchange (ESX)",
  },
  US: {
    name: "United States",
    currency: "USD",
    symbol: "$",
    exchange: "New York Stock Exchange (NYSE)",
  },
  GB: {
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    exchange: "London Stock Exchange (LSE)",
  },
  OTHER: {
    name: "Global",
    currency: "USD",
    symbol: "$",
    exchange: "Global Markets",
  },
};

// Maps each country to the closest Adzuna job database
// Some African countries use the UK database as it has the largest English-language pool
const ADZUNA_COUNTRY_MAP = {
  KE: "gb",
  NG: "ng",
  ZA: "za",
  GB: "gb",
  US: "us",
  GH: "gh",
  TZ: "tz",
  UG: "ug",
  RW: "gb",
  ET: "gb",
  OTHER: "gb",
};

// Translates the user's chosen field into a real search keyword Adzuna understands
const FIELD_KEYWORDS = {
  technology: "software developer",
  design: "graphic designer",
  business: "business analyst",
  health: "healthcare",
  education: "teacher",
  engineering: "engineer",
  media: "media communications",
  agriculture: "agriculture",
  other: "internship",
};

// Shows the loading overlay and starts cycling through messages
function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
  let i = 0;
  window.loadingInterval = setInterval(() => {
    i = (i + 1) % loadingMessages.length;
    document.getElementById("loadingText").textContent = loadingMessages[i];
  }, 1500);
}

// Hides the loading overlay
function hideLoading() {
  clearInterval(window.loadingInterval);
  document.getElementById("loadingOverlay").style.display = "none";
}

// Updates the loading text to reflect what's actually happening
function updateLoadingText(msg) {
  const el = document.getElementById("loadingText");
  if (el) el.textContent = msg;
}

// Shows an error message below the form
function showError(msg) {
  document.getElementById("formError").textContent = msg;
}

// Clears any existing error message
function clearError() {
  document.getElementById("formError").textContent = "";
}

// Called when the user clicks "Get My Map"
// Validates the form, saves the profile, and kicks off all the API calls
async function buildWealthMap() {
  clearError();

  const name = document.getElementById("userName").value.trim();
  const country = document.getElementById("userCountry").value;
  const amount = document.getElementById("userAmount").value.trim();
  const age = document.getElementById("userAge").value.trim();
  const field = document.getElementById("userField").value;

  if (!name) return showError("Please enter your name.");
  if (!country) return showError("Please select your country.");
  if (!amount || isNaN(amount) || Number(amount) < 0)
    return showError("Please enter a valid amount.");
  if (Number(amount) > 1000000000)
    return showError("Please enter a realistic investment amount.");
  if (!age || isNaN(age) || Number(age) < 16 || Number(age) > 100)
    return showError("Please enter a valid age (16–100).");
  if (!field) return showError("Please select your field.");

  window.userProfile = {
    name,
    country,
    amount: Number(amount),
    age: Number(age),
    field,
  };

  showLoading();
  document.getElementById("resultsSection").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    await generateResults();
  } catch (err) {
    hideLoading();
    showError("Something went wrong. Please try again.");
    console.error(err);
  }
}

// Fetches the live exchange rate for the user's currency using ExchangeRate API
// Falls back to USD if the request fails so the app never breaks
async function getExchangeRate(countryCode) {
  try {
    const currency = COUNTRY_DATA[countryCode]?.currency || "USD";
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${CONFIG.EXCHANGE_RATE_KEY}/latest/USD`,
    );
    if (!res.ok) throw new Error("Exchange rate API failed");

    const data = await res.json();
    const rate = data.conversion_rates[currency] || 1;

    return {
      currency,
      symbol: COUNTRY_DATA[countryCode]?.symbol || "$",
      rate,
      usdAmount: window.userProfile.amount / rate,
    };
  } catch (err) {
    console.warn("Exchange rate fetch failed, using USD fallback:", err);
    return {
      currency: "USD",
      symbol: "$",
      rate: 1,
      usdAmount: window.userProfile.amount,
    };
  }
}

// Builds the investment cards for the user's country
// Every country gets 6 universal options plus country-specific extras
function getInvestmentCards(countryCode, fx) {
  const { symbol } = fx;
  const country = COUNTRY_DATA[countryCode];

  const baseCards = [
    {
      id: "mmf",
      type: "invest",
      icon: ICONS.MMF,
      title: "Money Market Funds",
      description:
        "Low-risk funds that pool money into short-term investments. Earns more than a savings account with easy access to your money anytime.",
      risk: "low",
      riskLabel: "Very Low Risk",
      meta: [`Min: ${symbol}1,000`, "Return: ~10%/yr", "Liquid"],
      learnMore: "https://www.investopedia.com/terms/m/money-marketfund.asp",
      actionLabel: "How to Start",
      category: "invest",
    },
    {
      id: "stocks",
      type: "invest",
      icon: ICONS.EQ,
      title: "Stocks & Equities",
      description: `Buy small ownership in companies listed on the ${country.exchange}. Value grows as companies grow. Best for medium to long term.`,
      risk: "medium",
      riskLabel: "Medium Risk",
      meta: [`Exchange: ${country.exchange}`, "Return: ~15%/yr", "Long-term"],
      learnMore: "https://www.investopedia.com/terms/s/stock.asp",
      actionLabel: "How to Start",
      category: "invest",
    },
    {
      id: "bonds",
      type: "invest",
      icon: ICONS.BOND,
      title: "Government Bonds",
      description:
        "Lend money to the government and earn guaranteed interest. The safest investment available — backed by the state.",
      risk: "low",
      riskLabel: "Very Low Risk",
      meta: [`Min: ${symbol}5,000`, "Return: ~8%/yr", "Guaranteed"],
      learnMore: "https://www.investopedia.com/terms/g/government-bond.asp",
      actionLabel: "How to Start",
      category: "invest",
    },
    {
      id: "crypto",
      type: "invest",
      icon: ICONS.BTC,
      title: "Cryptocurrency",
      description:
        "Digital currencies like Bitcoin and Ethereum. High potential returns but prices can drop sharply. Only invest what you can afford to lose.",
      risk: "high",
      riskLabel: "High Risk",
      meta: ["BTC · ETH · USDT", "Volatile", "Digital"],
      learnMore: "https://www.investopedia.com/terms/c/cryptocurrency.asp",
      actionLabel: "View Prices",
      category: "invest",
    },
    {
      id: "reits",
      type: "invest",
      icon: ICONS.REIT,
      title: "Real Estate (REITs)",
      description: `Invest in property from as little as ${symbol}1,000 through Real Estate Investment Trusts. Get rental income without owning physical property.`,
      risk: "low",
      riskLabel: "Low-Medium Risk",
      meta: [`Min: ${symbol}1,000`, "Return: ~12%/yr", "Passive Income"],
      learnMore: "https://www.investopedia.com/terms/r/reit.asp",
      actionLabel: "How to Start",
      category: "invest",
    },
    {
      id: "sacco",
      type: "invest",
      icon: ICONS.SACCO,
      title: "SACCOs & Community Groups",
      description:
        "Join a savings and credit cooperative. Pool resources with others, earn dividends, and access loans at low interest rates.",
      risk: "low",
      riskLabel: "Very Low Risk",
      meta: ["Community-based", "Dividends", "Loan Access"],
      learnMore: "https://www.investopedia.com/terms/c/cooperative.asp",
      actionLabel: "Find One Near You",
      category: "invest",
    },
  ];

  // Extra cards specific to each country
  const countryExtras = {
    KE: [
      {
        id: "mpesa",
        type: "invest",
        icon: ICONS.MPESA,
        title: "M-Pesa & Mobile Savings",
        description:
          "Use M-Shwari, KCB M-Pesa, or Fuliza savings features to grow money directly from your phone with zero paperwork.",
        risk: "low",
        riskLabel: "Very Low Risk",
        meta: ["M-Shwari", "KCB M-Pesa", "Mobile"],
        learnMore:
          "https://www.safaricom.co.ke/personal/m-pesa/m-pesa-financial-services/m-shwari",
        actionLabel: "Get Started",
        category: "invest",
      },
    ],
    NG: [
      {
        id: "piggy",
        type: "invest",
        icon: ICONS.SAVE,
        title: "PiggyVest & Cowrywise",
        description:
          "Nigerian fintech platforms that make saving and investing simple. Start from ₦1,000 with automated savings and investment plans.",
        risk: "low",
        riskLabel: "Low Risk",
        meta: ["From ₦1,000", "Automated", "Regulated"],
        learnMore: "https://www.piggyvest.com",
        actionLabel: "Start Saving",
        category: "invest",
      },
    ],
    RW: [
      {
        id: "umurenge",
        type: "invest",
        icon: ICONS.SACCO,
        title: "Umurenge SACCO",
        description:
          "Government-backed community savings groups across every sector in Rwanda. Accessible, trusted, and locally run.",
        risk: "low",
        riskLabel: "Very Low Risk",
        meta: ["Government-backed", "Local", "Accessible"],
        learnMore: "https://www.bnr.rw",
        actionLabel: "Find Your SACCO",
        category: "invest",
      },
    ],
    ZA: [
      {
        id: "tfsa",
        type: "invest",
        icon: ICONS.TFSA,
        title: "Tax-Free Savings Account",
        description:
          "Invest up to R36,000/year completely tax-free. All returns — interest, dividends, capital gains — are exempt from tax.",
        risk: "low",
        riskLabel: "Very Low Risk",
        meta: ["R36k/yr limit", "Tax-Free", "Any bank"],
        learnMore: "https://www.sars.gov.za",
        actionLabel: "Open Account",
        category: "invest",
      },
    ],
    US: [
      {
        id: "roth",
        type: "invest",
        icon: ICONS.IRA,
        title: "Roth IRA & 401(k)",
        description:
          "Tax-advantaged retirement accounts. Roth IRA grows tax-free. 401(k) reduces your taxable income now. Start early for massive compound growth.",
        risk: "low",
        riskLabel: "Low Risk",
        meta: ["Tax-advantaged", "$7k/yr limit", "Long-term"],
        learnMore: "https://www.investopedia.com/terms/r/rothira.asp",
        actionLabel: "Learn More",
        category: "invest",
      },
    ],
  };

  return [...baseCards, ...(countryExtras[countryCode] || [])];
}

// Fetches real job listings from Adzuna based on the user's field and country
// If the API fails or returns nothing, fallback cards are shown instead
async function getAdzunaOpportunities(countryCode, field) {
  try {
    const adzunaCountry = ADZUNA_COUNTRY_MAP[countryCode] || "gb";
    const keyword = FIELD_KEYWORDS[field] || "internship";
    const url = `https://api.adzuna.com/v1/api/jobs/${adzunaCountry}/search/1?app_id=${CONFIG.ADZUNA_APP_ID}&app_key=${CONFIG.ADZUNA_APP_KEY}&results_per_page=6&what=${encodeURIComponent(keyword)}&content-type=application/json`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Adzuna API failed");

    const jobs = (await res.json()).results || [];

    return jobs.map((job) => ({
      id: job.id,
      type: "earn",
      icon: ICONS.JOB,
      title: job.title,
      description: job.description
        ? job.description.slice(0, 120) + "..."
        : "Click to view full details about this opportunity.",
      risk: "low",
      riskLabel: "Income Opportunity",
      meta: [
        job.company?.display_name || "Company Listed",
        job.location?.display_name || "Location Available",
        job.salary_min
          ? `~$${Math.round(job.salary_min).toLocaleString()}/yr`
          : "Salary Listed",
      ],
      learnMore: job.redirect_url,
      actionLabel: "View & Apply",
      category: "earn",
    }));
  } catch (err) {
    console.warn("Adzuna fetch failed, using fallback cards:", err);
    return [
      {
        id: "freelance",
        type: "earn",
        icon: ICONS.WORK,
        title: "Start Freelancing",
        description:
          "Offer your skills on Upwork, Fiverr, or Toptal. Set your own rates and work from anywhere in the world.",
        risk: "low",
        riskLabel: "Income Opportunity",
        meta: ["Upwork", "Fiverr", "Remote"],
        learnMore: "https://www.upwork.com",
        actionLabel: "Get Started",
        category: "earn",
      },
      {
        id: "coursera",
        type: "free",
        icon: ICONS.CERT,
        title: "Free Certifications",
        description:
          "Boost your earning potential with free courses on Coursera, edX, and Google Career Certificates.",
        risk: "low",
        riskLabel: "Skill Building",
        meta: ["Coursera", "edX", "Free"],
        learnMore: "https://www.coursera.org",
        actionLabel: "Start Learning",
        category: "free",
      },
      {
        id: "remote",
        type: "earn",
        icon: ICONS.REMOTE,
        title: "Remote Work Platforms",
        description:
          "Find remote jobs worldwide on Remote.co, We Work Remotely, and LinkedIn Remote Jobs.",
        risk: "low",
        riskLabel: "Income Opportunity",
        meta: ["Remote.co", "LinkedIn", "Global"],
        learnMore: "https://remote.co/remote-jobs",
        actionLabel: "Find Jobs",
        category: "earn",
      },
    ];
  }
}

// Fetches the live Bitcoin price via Alpha Vantage and converts it to the user's currency
// Falls back to "Price unavailable" if the request fails
async function getLivePrices(fx) {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${CONFIG.ALPHA_VANTAGE_KEY}`,
    );
    const data = await res.json();
    const btcUSD = parseFloat(
      data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"] || 0,
    );
    const btcLocal = btcUSD * fx.rate;

    return {
      btcUSD,
      btcLocal,
      btcFormatted:
        btcLocal > 0
          ? `${fx.symbol}${Math.round(btcLocal).toLocaleString()}`
          : "Price unavailable",
    };
  } catch (err) {
    console.warn("Alpha Vantage fetch failed:", err);
    return { btcUSD: 0, btcLocal: 0, btcFormatted: "Price unavailable" };
  }
}

// Sends the user's profile to Claude AI and returns a personalized 4-paragraph financial roadmap
// Falls back to a pre-written insight if the API call fails
async function getAIInsight(profile, fx, prices) {
  try {
    const prompt = `You are WealthMap, a personal finance advisor for young people globally.

User profile:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Country: ${COUNTRY_DATA[profile.country]?.name || profile.country}
- Amount to invest: ${fx.symbol}${profile.amount.toLocaleString()} (${fx.currency})
- Field/Skill: ${profile.field}
- Bitcoin price today: ${prices.btcFormatted}

Write a personalized financial roadmap in exactly this structure — plain English, no jargon:

1. SITUATION (1 sentence): Acknowledge their exact amount, age, and country positively.
2. INVEST NOW (2 sentences): Give ONE specific investment recommendation for their exact amount and country with a real platform name they can google. Explain why it suits them specifically.
3. GROW INCOME (2 sentences): Give ONE specific action for their exact field they can do THIS WEEK. Name a real platform or resource.
4. LEARN MORE (1 sentence): Recommend ONE free resource — a book, website, or course — specific to their country or field.

Be warm, direct, and specific. Use their actual numbers. Name real platforms.
Write in flowing paragraphs only. No bold text, no headers, no bullet points, no numbering, no markdown formatting of any kind. Just natural, conversational sentences that flow into each other like a trusted advisor speaking directly to them.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CONFIG.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 250,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("Claude API failed");
    const data = await response.json();
    return data.content[0]?.text || getFallbackInsight(profile, fx);
  } catch (err) {
    console.warn("Claude API failed, using fallback insight:", err);
    return getFallbackInsight(profile, fx);
  }
}

// Pre-written fallback insight used if Claude AI is unavailable
function getFallbackInsight(profile, fx) {
  const countryName = COUNTRY_DATA[profile.country]?.name || "your country";
  return `${profile.name}, with ${fx.symbol}${profile.amount.toLocaleString()} you are already ahead of most people your age — the fact that you are thinking about this now is your biggest advantage. Start with a Money Market Fund in ${countryName} this month; it is low risk, liquid, and earns far more than a regular savings account. While your money grows, spend one hour this week building your profile on a freelance platform like Upwork or Fiverr — your ${profile.field} skills can start earning you income online immediately.`;
}

// Orchestrates all API calls in sequence and builds the final results page
async function generateResults() {
  const profile = window.userProfile;

  updateLoadingText("Fetching exchange rates...");
  const fx = await getExchangeRate(profile.country);
  window.fxData = fx;

  updateLoadingText("Building your investment map...");
  const investmentCards = getInvestmentCards(profile.country, fx);

  updateLoadingText("Finding opportunities for you...");
  const opportunityCards = await getAdzunaOpportunities(
    profile.country,
    profile.field,
  );

  updateLoadingText("Getting live market prices...");
  const prices = await getLivePrices(fx);
  window.livePrices = prices;

  // Update the crypto card with the live Bitcoin price
  const cryptoCard = investmentCards.find((c) => c.id === "crypto");
  if (cryptoCard && prices.btcLocal > 0) {
    cryptoCard.meta = [
      `BTC: ${prices.btcFormatted}`,
      "Live Price",
      "High Volatility",
    ];
    cryptoCard.description = `Bitcoin is currently trading at ${prices.btcFormatted}. Digital currencies offer high potential returns but prices can drop sharply. Only invest what you can afford to lose.`;
  }

  updateLoadingText("Generating your personal insight...");
  const aiInsight = await getAIInsight(profile, fx, prices);
  document.getElementById("aiInsightText").textContent = aiInsight;

  allCards = [...investmentCards, ...opportunityCards];
  renderCards(allCards);

  document.getElementById("resultsSection").style.display = "block";
  document.getElementById("resultsTitle").textContent =
    `${profile.name}'s WealthMap`;
  document.getElementById("resultsCount").textContent =
    `${allCards.length} options found`;
  document
    .getElementById("resultsSection")
    .scrollIntoView({ behavior: "smooth" });

  hideLoading();
}

// Renders the card grid — takes an array of cards and injects them into the DOM
function renderCards(cards) {
  const grid = document.getElementById("cardsGrid");
  const empty = document.getElementById("emptyState");

  if (cards.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = cards
    .map(
      (card) => `
    <div class="card type-${card.type}" data-risk="${card.risk}" data-category="${card.category}" data-title="${card.title.toLowerCase()}">
      <div class="card-header">
        <div class="card-icon icon-${card.type}">${card.icon}</div>
        <div class="card-badge">
          <span class="badge badge-${card.type}">● ${card.type === "invest" ? "Invest" : card.type === "earn" ? "Earn" : "Free"}</span>
        </div>
      </div>
      <h3 class="card-title">${card.title}</h3>
      <p class="card-description">${card.description}</p>
      <div class="card-meta">
        ${card.meta.map((m) => `<span class="meta-item">${m}</span>`).join("")}
      </div>
      <div class="risk-indicator">
        <span class="risk-dot ${card.risk}"></span>
        ${card.riskLabel}
      </div>
      <div class="card-actions">
        <button class="btn-primary btn-${card.type}" onclick="window.open('${card.learnMore}', '_blank')">
          ${card.actionLabel} →
        </button>
        <a class="btn-secondary" href="${card.learnMore}" target="_blank">Learn More</a>
      </div>
    </div>
  `,
    )
    .join("");

  document.getElementById("resultsCount").textContent =
    `${cards.length} options found`;
}

// Handles filter button clicks — updates the active filter and re-renders
function setFilter(filter, btn) {
  activeFilter = filter;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  filterAndSearch();
}

// Applies the active filter and search term together on every keystroke
function filterAndSearch() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  const filtered = allCards.filter((card) => {
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "low"
          ? card.risk === "low"
          : activeFilter === "medium"
            ? card.risk === "medium"
            : activeFilter === "high"
              ? card.risk === "high"
              : activeFilter === "free"
                ? card.category === "free"
                : activeFilter === "invest"
                  ? card.category === "invest"
                  : activeFilter === "earn"
                    ? card.category === "earn"
                    : true;

    const matchesSearch =
      searchTerm === ""
        ? true
        : card.title.toLowerCase().includes(searchTerm) ||
          card.description.toLowerCase().includes(searchTerm) ||
          card.meta.some((m) => m.toLowerCase().includes(searchTerm));

    return matchesFilter && matchesSearch;
  });

  renderCards(filtered);
}

// Sorts all cards by risk level or name and re-renders
function sortCards(value) {
  const riskOrder = { low: 1, medium: 2, high: 3 };
  const sorted = [...allCards];

  if (value === "risk-low")
    sorted.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
  if (value === "risk-high")
    sorted.sort((a, b) => riskOrder[b.risk] - riskOrder[a.risk]);
  if (value === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));

  renderCards(sorted);
}

// Catches any unhandled promise rejections across the app
// This is the last line of defense — ensures the loading screen never gets stuck
window.addEventListener("unhandledrejection", (event) => {
  console.warn("Unhandled promise rejection:", event.reason);
  hideLoading();
  showError("Something went wrong loading your data. Please try again.");
});
