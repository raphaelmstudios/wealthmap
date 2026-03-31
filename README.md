# WealthMap

**Your money. Your moves. Mapped out clearly.**

WealthMap is a personal financial decision engine built for young people who have money to grow and skills to monetize but no clear path forward. Enter five details about yourself and get a complete, personalized roadmap of every investment option available in your country alongside real income opportunities matched to your field. Powered by four live APIs and a Claude AI insight layer, WealthMap gives you the kind of advice that used to require a financial advisor.

Live at → **[https://www.raphaelmumo.tech](https://www.raphaelmumo.tech)**

---

## Why This Exists

Most finance apps assume you already know what you're doing. They show you stock tickers, crypto charts, and savings calculators but they never answer the actual question: _given exactly where I am right now, what should I do first?_

For a 21-year-old in Nairobi with KSh 5,000, that question matters. For a graphic designer in Lagos who doesn't know their skills are worth $40/hour internationally, it matters. For a developer in Kigali sitting on savings they don't know what to do with, it matters.

Financial illiteracy is not a character flaw. It is an information gap. WealthMap is built to close it.

---

## How It Works

You fill in five fields your name, country, investable amount, age, and field of work. You click one button. In the time it takes to load, WealthMap:

1. Fetches your live exchange rate and converts everything to your local currency
2. Builds a personalized map of every investment option available in your specific country from the safest (Money Market Funds, Government Bonds) to the boldest (Stocks, Crypto, REITs) with real live Bitcoin prices, minimum amounts, expected returns, and risk levels
3. Pulls real job listings from Adzuna filtered to your field and country
4. Sends your full profile to Claude AI and returns a personalized 4-paragraph financial roadmap written specifically for your age, amount, and situation

Every result is filterable by risk level and category, sortable by risk and name, and fully searchable. Nothing is generic. Everything is actionable.

---

## Tech Stack

Built entirely in vanilla HTML, CSS, and JavaScript. No frameworks. No build tools. No dependencies. Just three files that run in any browser.

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| Frontend       | HTML5, CSS3, Vanilla JavaScript                              |
| Fonts          | Google Fonts David Libre (headings) + Chivo (body)           |
| Hosting        | Nginx on Ubuntu 22.04                                        |
| Load Balancing | HAProxy with round-robin distribution                        |
| SSL            | Let's Encrypt via Certbot                                    |
| APIs           | Alpha Vantage, Adzuna, ExchangeRate API, Anthropic Claude AI |

---

## APIs

| API                                                   | What It Does                                                           | Documentation                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| [Alpha Vantage](https://www.alphavantage.co/)         | Fetches live Bitcoin price in USD, converted to local currency         | [docs](https://www.alphavantage.co/documentation/)        |
| [Adzuna](https://www.adzuna.com/)                     | Returns real job listings filtered by field and country                | [docs](https://developer.adzuna.com/docs/search)          |
| [ExchangeRate API](https://www.exchangerate-api.com/) | Converts USD to the user's local currency in real time                 | [docs](https://www.exchangerate-api.com/docs/overview)    |
| [Anthropic Claude AI](https://www.anthropic.com/)     | Generates a personalized financial insight based on the user's profile | [docs](https://docs.anthropic.com/en/api/getting-started) |

Every API call has a try/catch with meaningful fallback data. If any API goes down, the app continues working users never see a broken state.

---

## Features

- Country-specific investment maps for Kenya, Nigeria, Ghana, South Africa, Rwanda, Tanzania, Uganda, Ethiopia, USA, and UK
- Live Bitcoin price displayed in local currency
- Real job listings pulled from Adzuna filtered by skill and location
- Claude AI insight 4 paragraphs written specifically for the user's profile
- Filter cards by risk level (Low, Medium, High) or type (Invest, Earn, Free)
- Sort by risk level or alphabetically by name
- Full text search across all cards
- HTTP automatically redirects to HTTPS (301)
- Load balanced across two servers traffic alternates on every request
- Fully responsive on mobile and desktop

---

## Project Structure

```
wealthmap/
├── index.html    # All markup and structure
├── styles.css    # Complete design system and responsive layout
├── app.js        # All logic, API calls, rendering, and interactivity
├── config.js     # API keys  local only, never committed to GitHub
├── .gitignore    # Ensures config.js never reaches the repository
└── README.md     # This file
```

---

## Running Locally

**Clone the repo**

```bash
git clone https://github.com/raphaelmstudios/wealthmap.git
cd wealthmap
```

**Create your config file**

Create a file called `config.js` in the project root. This file is excluded from Git via `.gitignore` never commit it.

```javascript
const CONFIG = {
  ADZUNA_APP_ID: "your_adzuna_app_id",
  ADZUNA_APP_KEY: "your_adzuna_app_key",
  EXCHANGE_RATE_KEY: "your_exchangerate_key",
  ALPHA_VANTAGE_KEY: "your_alphavantage_key",
  CLAUDE_API_KEY: "your_claude_api_key",
};
```

**Open in browser**

Open `index.html` directly in any modern browser. No terminal, no server, no npm just open the file.

---

## Deployment

The application runs on two Nginx web servers behind an HAProxy load balancer. All traffic is served over HTTPS with automatic HTTP → HTTPS redirection.

### Infrastructure

| Server | Role                  | IP             |
| ------ | --------------------- | -------------- |
| Web01  | Nginx web server      | 18.234.240.227 |
| Web02  | Nginx web server      | 44.204.30.8    |
| Lb01   | HAProxy load balancer | 3.92.196.137   |

### Access Points

| URL                          | Description                     |
| ---------------------------- | ------------------------------- |
| https://www.raphaelmumo.tech | Primary HTTPS via load balancer |
| http://3.92.196.137          | Load balancer direct            |
| http://18.234.240.227        | Web01 direct                    |
| http://44.204.30.8           | Web02 direct                    |

### Web Server Setup (Repeat on Web01 and Web02)

```bash
sudo apt update && sudo apt install nginx -y
sudo mkdir -p /var/www/wealthmap
cd /var/www/wealthmap
sudo git clone https://github.com/raphaelmstudios/wealthmap.git .
sudo nano config.js  # Paste your CONFIG object here
sudo chown -R www-data:www-data /var/www/wealthmap
```

Nginx config at `/etc/nginx/sites-available/wealthmap`:

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

```bash
sudo ln -s /etc/nginx/sites-available/wealthmap /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Load Balancer Setup (Lb01)

HAProxy handles SSL termination and distributes traffic between both web servers using round-robin. HTTP traffic is automatically redirected to HTTPS with a 301.

**Generate SSL certificate**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d www.raphaelmumo.tech
sudo cat /etc/letsencrypt/live/www.raphaelmumo.tech/fullchain.pem \
        /etc/letsencrypt/live/www.raphaelmumo.tech/privkey.pem \
        | sudo tee /etc/haproxy/certs/www.raphaelmumo.tech.pem
```

HAProxy config at `/etc/haproxy/haproxy.cfg`:

```
frontend http_front
    bind *:80
    mode http
    redirect scheme https code 301 if !{ ssl_fc }

frontend https_front
    bind *:443 ssl crt /etc/haproxy/certs/www.raphaelmumo.tech.pem
    mode http
    default_backend http_back

backend http_back
    balance roundrobin
    mode http
    option forwardfor
    option http-server-close
    server web-01 18.234.240.227:80 check
    server web-02 44.204.30.8:80 check
```

**Verify load balancing**

```bash
curl -I https://www.raphaelmumo.tech
# Run multiple times  X-Served-By alternates between 7041-web-01 and 7041-web-02
```

---

## Challenges and How They Were Solved

**CORS on Claude API**
The Anthropic API does not allow direct browser calls by default. Fixed by adding the `anthropic-dangerous-direct-browser-access` header to every request, enabling client-side calls without a backend proxy.

**Adzuna coverage gaps**
Adzuna has limited job listings for several African countries. Fixed by mapping low-coverage countries to the UK database the largest English-language pool on the platform while keeping keyword filtering specific to the user's field.

**API key security**
GitHub's push protection detected and blocked a commit containing the Claude API key. Fixed by adding `config.js` to `.gitignore` immediately and storing all keys locally only. The exposed key was regenerated before continuing.

**Alpha Vantage rate limits**
The free tier allows 25 API calls per day. Fixed by limiting live price fetches to Bitcoin only one call per user session keeping usage well within the daily limit.

**Divergent git branches during deployment**
Local and remote branches fell out of sync during server setup. Fixed using `git config pull.rebase false` followed by a clean pull and push cycle.

---

## Credits

- [Alpha Vantage](https://www.alphavantage.co/) Financial market data
- [Adzuna](https://www.adzuna.com/) Job search API
- [ExchangeRate-API](https://www.exchangerate-api.com/) Currency conversion
- [Anthropic](https://www.anthropic.com/) Claude AI
- [Google Fonts](https://fonts.google.com/) David Libre and Chivo typefaces
- [Investopedia](https://www.investopedia.com/) Financial education reference links used throughout the app

---

## Author

**Raphael Mumo**
African Leadership University
Web Infrastructure Summative Assignment
March 2026
