# WealthMap — Clear Financial Direction, Wherever You Start

> _Your money. Your moves. Mapped out clearly._

---

## The Problem

Across Africa and the developing world, millions of young people earn money, save small amounts, and have real skills — but have no idea what to do next.

Not because they lack ambition. Because nobody told them.

A 22-year-old in Nairobi with KSh 5,000 saved doesn't know whether to put it in a Money Market Fund, buy NSE stocks, join a SACCO, or invest in crypto. A graphic designer in Lagos doesn't know that their skills are worth $40/hour on international freelance platforms. A software developer in Kigali doesn't know there are remote jobs paying in dollars they can apply to today.

Financial illiteracy is not a character flaw. It is an information gap.

The tools that exist either talk down to people, require existing wealth to be useful, or are built exclusively for Western markets. There is no simple, honest, personalized tool that looks at where someone actually is — their age, their country, their amount, their skills — and shows them every path forward.

That is the gap WealthMap fills.

---

## What WealthMap Does

WealthMap is a personal financial decision engine. It takes five inputs from a user — their name, country, investable amount, age, and field of work — and generates a complete, personalized financial roadmap in seconds.

The roadmap has two sides working simultaneously:

**Grow Your Money** — Every investment option available in the user's specific country, from the safest (Money Market Funds, Government Bonds) to the boldest (Stocks, Crypto, REITs), with real live prices, minimum amounts, expected returns, risk levels, and direct links to get started.

**Grow Your Income** — Real job listings and income opportunities matched to the user's skill and country, alongside freelance platforms, certifications, and remote work options they can act on immediately.

Above everything sits a personalized AI insight — written specifically for the user's age, amount, country, and field — giving them one clear investment move and one clear income move to make right now.

The entire results page is filterable by risk level and category, sortable by risk and name, and fully searchable — so users can navigate their options with precision.

---

## Live Demo

Accessible via load balancer at: `http://[LB01-IP]`

Also accessible directly at:

- Web Server 1: `http://[WEB01-IP]`
- Web Server 2: `http://[WEB02-IP]`

---

## Features

- Personalized investment map based on country, age, and investable amount
- Real-time Bitcoin price in local currency via Alpha Vantage API
- Live currency conversion via ExchangeRate API
- Real job and internship listings via Adzuna API
- AI-generated personal financial insight via Claude AI (Anthropic)
- Country-specific investment options for Kenya, Nigeria, Ghana, South Africa, Rwanda, Tanzania, Uganda, Ethiopia, USA, UK
- Filter by risk level, investment type, and opportunity type
- Sort by risk level and name
- Full text search across all cards
- Graceful fallback for every API — app never breaks
- Fully responsive on mobile and desktop
- Clean, premium UI with no frameworks — pure HTML, CSS, and JavaScript

---

## APIs Used

| API                                                                      | Purpose                                   | Documentation                                     |
| ------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------------------------- |
| [Alpha Vantage](https://www.alphavantage.co/documentation/)              | Real-time Bitcoin and stock prices        | https://www.alphavantage.co/documentation/        |
| [Adzuna](https://developer.adzuna.com/docs/search)                       | Live job and internship listings          | https://developer.adzuna.com/docs/search          |
| [ExchangeRate API](https://www.exchangerate-api.com/docs/overview)       | Live currency conversion                  | https://www.exchangerate-api.com/docs/overview    |
| [Anthropic Claude AI](https://docs.anthropic.com/en/api/getting-started) | Personalized financial insight generation | https://docs.anthropic.com/en/api/getting-started |

---

## Project Structure

```
wealthmap/
├── index.html       # Application structure and markup
├── styles.css       # Complete styling and responsive design
├── app.js           # All application logic and API integrations
├── config.js        # API keys — local only, never committed
├── .gitignore       # Excludes config.js and sensitive files
└── README.md        # This file
```

---

## Running Locally

**1. Clone the repository**

```bash
git clone https://github.com/raphaelmstudios/wealthmap.git
cd wealthmap
```

**2. Create your config file**

```bash
nano config.js
```

Paste the following with your own API keys:

```javascript
const CONFIG = {
  ADZUNA_APP_ID: "your_adzuna_app_id",
  ADZUNA_APP_KEY: "your_adzuna_app_key",
  EXCHANGE_RATE_KEY: "your_exchangerate_key",
  ALPHA_VANTAGE_KEY: "your_alphavantage_key",
  CLAUDE_API_KEY: "your_claude_api_key",
};
```

**3. Open in browser**

Simply open `index.html` in any modern browser. No build step, no server, no dependencies.

```bash
# On Linux/Mac
open index.html

# Or just double-click the file in your file explorer
```

---

## Deployment

The application is deployed on two web servers with an Nginx load balancer distributing traffic between them.

### Server Setup (Web01 and Web02)

**1. SSH into each web server**

```bash
ssh ubuntu@[WEB01-IP]
ssh ubuntu@[WEB02-IP]
```

**2. Install Nginx**

```bash
sudo apt update
sudo apt install nginx -y
```

**3. Copy application files**

```bash
sudo mkdir -p /var/www/wealthmap
sudo cp index.html styles.css app.js /var/www/wealthmap/
```

**4. Create config.js on each server** (never transferred via Git)

```bash
sudo nano /var/www/wealthmap/config.js
```

Paste your CONFIG object with real API keys.

**5. Configure Nginx on each web server**

```bash
sudo nano /etc/nginx/sites-available/wealthmap
```

Paste:

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/wealthmap;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
        add_header X-Served-By $hostname;
    }
}
```

**6. Enable the site**

```bash
sudo ln -s /etc/nginx/sites-available/wealthmap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Load Balancer Setup (Lb01)

**1. SSH into the load balancer**

```bash
ssh ubuntu@[LB01-IP]
```

**2. Install Nginx**

```bash
sudo apt update
sudo apt install nginx -y
```

**3. Configure load balancer**

```bash
sudo nano /etc/nginx/sites-available/wealthmap-lb
```

Paste:

```nginx
upstream wealthmap_servers {
    server [WEB01-IP];
    server [WEB02-IP];
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://wealthmap_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        add_header X-Served-By $upstream_addr;
    }
}
```

**4. Enable and reload**

```bash
sudo ln -s /etc/nginx/sites-available/wealthmap-lb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**5. Verify load balancing is working**

```bash
curl -I http://[LB01-IP]
# Repeat several times — X-Served-By header should alternate between Web01 and Web02
```

---

## Challenges and Solutions

**CORS on Claude API** — Direct browser calls to the Anthropic API require the `anthropic-dangerous-direct-browser-access` header. This was added to all Claude API requests to allow client-side calls without a backend proxy.

**Adzuna coverage gaps** — Adzuna has limited listings for some African countries. Solved by mapping low-coverage countries to the UK database which has the largest English-language job pool, while still filtering by relevant keywords.

**API key security** — GitHub's push protection blocked commits containing the Claude API key. Solved by adding `config.js` to `.gitignore` before any further commits and storing keys locally only.

**Alpha Vantage rate limits** — The free tier allows 25 requests per day. Solved by limiting live price fetches to Bitcoin only, keeping well within the daily limit even under regular use.

**Graceful degradation** — Every single API call has a try/catch with meaningful fallback data, ensuring the application never shows a broken state to the user regardless of which API fails.

---

## Credits

- [Alpha Vantage](https://www.alphavantage.co/) — Financial market data API
- [Adzuna](https://www.adzuna.com/) — Job search API
- [ExchangeRate-API](https://www.exchangerate-api.com/) — Currency conversion API
- [Anthropic](https://www.anthropic.com/) — Claude AI API
- [Google Fonts](https://fonts.google.com/) — David Libre and Chivo typefaces
- [Investopedia](https://www.investopedia.com/) — Financial education links used in learn more resources

---

## Author

Built by Raphael Mumo — African Leadership University  
Web Infrastructure Summative Assignment  
March 2026
