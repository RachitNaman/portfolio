/*
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE (sourced from Rachit's resume).
 *  Edit this file to change any text, link, project or stat.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE = {
  name: "Rachit Naman",
  shortName: "Rachit",
  codeName: "rn", // sticker on the laptop lid
  role: "Software Engineer",
  availability: "B.Tech EEE · BIT Mesra '27",
  email: "r.naman771@gmail.com",
  resume: "assets/Rachit_Naman_Resume.pdf",

  // Primary "talk to me" link (hero button, FAQ card). Email works without any extra setup.
  contactUrl: "mailto:r.naman771@gmail.com",

  // Social links, shown in the order listed. icon: linkedin | github | leetcode | x | instagram | rss | mail
  socials: [
    { icon: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/rachit-naman-6j05" },
    { icon: "github", label: "GitHub", url: "https://github.com/RachitNaman" },
    { icon: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/Rachit_Naman/" },
    { icon: "mail", label: "Email", url: "mailto:r.naman771@gmail.com" },
  ],
  // The two round buttons in the floating "Speak to me" bar
  dock: {
    dark: { icon: "linkedin", label: "Find me on LinkedIn", url: "https://linkedin.com/in/rachit-naman-6j05" },
    light: { icon: "mail", label: "Email me", url: "mailto:r.naman771@gmail.com" },
    sub: "Email or LinkedIn",
  },

  // Lines typed on the laptop screen during the intro scroll
  terminal: [
    "> attackgraph --status  online ✓",
    "> C++ + Python + TypeScript",
    "> 7-hop attack paths in <300ms",
    "> status: building with LLMs",
  ],

  hero: {
    light: ["From", "idea", "to"],
    bold: "production.",
    strong: "I build AI agents, Graph RAG systems, and full-stack web apps",
    muted: "— from a rough idea to reliable software that ships.",
    cta: "Start a conversation",
  },

  projects: [
    {
      slug: "attackgraph",
      title: "AttackGraph",
      category: "Attack Path Analysis Platform",
      year: "2026",
      image: "assets/projects/attackgraph.svg",
      brandLabel: "Graph RAG for threat modeling",
      client: "Personal project / Def-Space capstone",
      description:
        "A Graph RAG platform that combines Neo4j graph traversal with Qdrant vector search to discover attack paths, measure blast radius, and generate remediation plans with a multi-agent LLM pipeline.",
      metrics: [
        { value: "7-hop", label: "escalation chains mapped" },
        { value: "<300ms", label: "across 5,000+ nodes" },
        { value: "15K+", label: "entities, sub-second queries" },
      ],
      scope: ["Python & FastAPI", "Neo4j + Qdrant", "LangChain & LangGraph", "Gemini", "Next.js", "Docker"],
      links: [{ label: "GitHub", url: "https://github.com/RachitNaman/attackGraph-ai" }],
      storyHeading: "Seeing how an attacker would move before they do.",
      story: [
        "Security teams usually see vulnerabilities as a flat list. The dangerous part is how they chain together: one foothold leads to a privilege escalation, which leads to the next machine.",
        "AttackGraph models a network as a graph so those chains become visible. It pairs graph traversal with semantic retrieval, so an LLM can explain threats using precise context instead of guesses.",
        "I later deployed it as my capstone at the Def-Space Summer Internship (BSERC), demonstrating automated attack-path discovery for defence networks.",
      ],
      capabilitiesHeading: "From a vulnerability list to a remediation plan.",
      capabilitiesIntro:
        "The platform turns raw vulnerability data into an explorable graph, ranks the paths that matter, and hands back structured fixes.",
      capabilities: [
        { title: "Graph RAG retrieval", description: "Combines Neo4j traversal with Qdrant vector search for high-precision threat context over 200+ simulated vulnerabilities." },
        { title: "Blast-radius analysis", description: "BFS/DFS traversal APIs map up to 7-hop privilege-escalation chains across 5,000+ mock nodes in under 300ms." },
        { title: "Hybrid semantic search", description: "Pairs dense vector search with Cypher queries, filtering the vector space before LLM generation to cut pipeline time." },
        { title: "Multi-agent remediation", description: "A LangGraph pipeline orchestrates 4 concurrent agents to produce structured remediation JSON in under 5 seconds per threat." },
        { title: "Interactive dashboard", description: "A Next.js dashboard on async FastAPI endpoints renders 1,000+ live graph elements at over 30fps." },
      ],
      technicalHeading: "A graph database, a vector store and a team of agents.",
      technical: [
        "The Neo4j schema uses 6 node types and 5 relationship types with targeted indexing, keeping query plans under a second on a generated database of 15,000+ entities.",
        "FastAPI serves traversal and retrieval endpoints asynchronously. The LangGraph agents run in containers orchestrated with Docker Compose, using Gemini for generation.",
      ],
      pipeline: ["Vulnerabilities", "Neo4j graph", "Hybrid retrieval", "Agent remediation"],
      roleHeading: "Solo builder, from schema design to deployment.",
      role: [
        "I designed the graph schema, built the traversal and retrieval APIs, wrote the multi-agent pipeline, and shipped the Next.js dashboard.",
        "The hardest part was keeping retrieval precise. Filtering the vector space with graph context before generation made answers both faster and more grounded.",
      ],
      quote: "An attack is a path, not a point, so the tooling should think in graphs.",
    },
    {
      slug: "signalist",
      title: "Signalist",
      category: "Smart Stock Watchlist Platform",
      year: "2025",
      image: "assets/projects/signalist.svg",
      brandLabel: "Real-time market watchlist",
      client: "Personal project",
      description:
        "A full-stack watchlist platform delivering real-time financial data for 10K+ stocks, with event-driven price alerts, daily market summaries, and secure authentication.",
      metrics: [
        { value: "10K+", label: "stocks with live data" },
        { value: "Daily", label: "automated market summaries" },
        { value: "Event-driven", label: "price alerts via Inngest" },
      ],
      scope: ["Next.js & React", "TypeScript", "Tailwind CSS", "Inngest", "Finnhub API", "Better Auth", "Vercel"],
      links: [{ label: "GitHub", url: "https://github.com/RachitNaman/stock_app" }],
      storyHeading: "Market insight that comes to you.",
      story: [
        "Checking stock prices by hand is noisy and easy to forget. Signalist lets people build a personal watchlist and get notified when something actually matters.",
        "It streams real-time data for 10K+ stocks from the Finnhub API and turns it into personalized insights.",
      ],
      capabilitiesHeading: "A watchlist that works in the background.",
      capabilitiesIntro: "Background workflows do the watching, so users only hear about the moves they care about.",
      capabilities: [
        { title: "Real-time market data", description: "Live prices and details for 10K+ stocks through the Finnhub API." },
        { title: "Automated price alerts", description: "Event-driven Inngest workflows trigger alerts when a watched stock crosses a threshold." },
        { title: "Daily market summaries", description: "Scheduled workflows send a daily digest, keeping users engaged with timely notifications." },
        { title: "Secure accounts", description: "Authentication and session management with Better Auth to protect user data and access." },
      ],
      technicalHeading: "Event-driven workflows on a modern React stack.",
      technical: [
        "The app is built with Next.js, React and TypeScript, styled with Tailwind CSS, and deployed on Vercel.",
        "Inngest runs the event-driven and scheduled jobs (alerts and summaries) outside the request cycle, so the UI stays fast.",
      ],
      pipeline: ["Finnhub data", "Watchlist", "Inngest events", "Alerts & digests"],
      roleHeading: "Full-stack developer.",
      role: ["I built the product end to end: UI, data integration, background workflows and authentication."],
      quote: "The best alert is the one you didn't have to go looking for.",
    },
  ],

  // Optional client quote under the work grid. Set to null to hide (no testimonial yet).
  testimonial: null,

  services: {
    light: "I build AI",
    bold: ["agents &", "platforms."],
    items: [
      { label: "AI Agents", icon: "bot" },
      { label: "RAG Pipelines", icon: "puzzle" },
      { label: "Full-Stack Web Apps", icon: "monitor" },
      { label: "Backend APIs", icon: "layout" },
      { label: "Graph Databases", icon: "graph" },
      { label: "Docker & CI/CD", icon: "wrench" },
      { label: "Real-time Products", icon: "rocket" },
    ],
    // file names in assets/tech/ (from simpleicons.org)
    stack: ["cplusplus", "python", "javascript", "typescript", "react", "nextdotjs", "fastapi", "langchain", "neo4j", "googlegemini", "docker", "git", "tailwindcss", "vercel", "github"],
  },

  about: {
    left: "Software",
    right: "Engineer",
    copy: "I build AI agents, Graph RAG systems, and full-stack web apps.",
    portraitFront: "assets/portrait-front.svg",
    portraitBack: "assets/portrait-back.svg",
    capabilitiesTitle: "What I can build for you",
    capabilitiesCopy: "From LLM agents to real-time dashboards, I build the product and the systems behind it.",
    capabilities: [
      { label: "AI Agents & RAG", image: "assets/projects/cap-1.svg", details: ["LangGraph multi-agent pipelines", "Graph RAG with Neo4j + vector search", "LangChain and Gemini integrations", "Structured, JSON-first LLM outputs"] },
      { label: "Full-Stack Web Apps", image: "assets/projects/cap-2.svg", details: ["Next.js and React interfaces", "FastAPI backends", "Authentication and sessions", "Real-time data and event-driven alerts"] },
      { label: "Graph & Data Systems", image: "assets/projects/cap-3.svg", details: ["Neo4j schema design and Cypher", "BFS/DFS traversal APIs", "Qdrant vector search", "SQL and DBMS fundamentals"] },
      { label: "DevOps & Deployment", image: "assets/projects/cap-4.svg", details: ["Docker and Docker Compose", "CI/CD with Git", "Vercel deployments", "Linux and WSL2 workflows"] },
    ],
    bio: "Hi, I'm Rachit, an Electrical & Electronics Engineering student at BIT Mesra (Class of 2027) and a Def-Space Summer Intern at BSERC. I build AI agents, Graph RAG systems, and full-stack products end to end.",
    stats: [
      { value: "8.09", label: "CGPA at BIT Mesra" },
      { value: "2", label: "Full-stack projects" },
      { value: "100+", label: "Students taught Python" },
    ],
  },

  pricing: {
    light: "Got an idea?",
    bold: "Let's make it real.",
    introStrong: "You don't need a perfect brief.",
    intro: " A problem, a sketch, or a half-formed idea is enough to start.",
    steps: [
      { icon: "chat", title: "Discuss", text: ["We talk through your goal,", "users, and what needs to exist."] },
      { icon: "code", title: "Build", text: ["I turn the plan into a working", "agent, app, or API."] },
      { icon: "rocket", title: "Ship", text: ["We polish the details, test the", "flow, and get it ready to launch."] },
    ],
    pill: "Projects & internships",
    floatMuted: "AI agents, apps, and APIs",
    floatWhite: "built directly with me.",
    status: "Open to opportunities",
    workTitle: "Work with me",
    workCopy: "Bring an AI workflow, product idea, or backend problem. I'll help shape it, build it, and ship it.",
    planTitle: "Project Build",
    planCopy: "Start with a clear plan and a single, predictable price.",
    planSub: "For AI agents, web apps, internal tools, and automations.",
    price: "$999", // ← placeholder: set your own rate (or ask me to remove the pricing section)
    priceUnit: "/ project",
    features: ["One-time project fee", "Clearly defined scope", "3 revision rounds", "AI agent, app, or API", "Deployment support", "Direct communication"],
    retainerTitle: "Internships & Roles",
    retainerCopy: "Looking for a software engineer who ships?",
    retainerMuted: " I'm open to internship and full-time conversations.",
    retainer: ["AI / LLM engineering", "Full-stack development", "Backend & APIs", "Graph & data systems"],
  },

  faq: [
    { q: "What kind of software do you build?", a: "AI agents and Graph RAG pipelines (LangChain, LangGraph, Neo4j, Qdrant), and full-stack web apps with Next.js, React and FastAPI, containerized with Docker." },
    { q: "What are you working on right now?", a: "AttackGraph, a Graph RAG platform that maps attack paths through networks and generates remediation plans with a multi-agent LLM pipeline. I deployed it as my capstone during the Def-Space Summer Internship at BSERC." },
    { q: "Which languages are you strongest in?", a: "C++ for data structures and algorithms, Python for AI and backend work, and TypeScript and JavaScript for web apps. I'm also comfortable with SQL and Cypher." },
    { q: "Can you integrate AI into an existing app?", a: "Yes. I build retrieval pipelines, tool-using agents and structured LLM outputs, plus the APIs, databases and containers needed to run them reliably." },
    { q: "How can I reach you?", a: "Email r.naman771@gmail.com or message me on LinkedIn. You can also use the contact form on this site." },
  ],

  contactOptions: ["Internship / full-time role", "Freelance project", "AI agent / RAG system", "Collaboration", "Just saying hi"],

  story: {
    heading: "My story",
    paragraphs: [
      "I'm an Electrical and Electronics Engineering student at BIT Mesra, Ranchi (expected 2027, CGPA 8.09). I finished school at Delhi Public School, Dhanbad.",
      "My path into software runs from C++ and data structures to building real products: first Signalist, a real-time stock watchlist, then AttackGraph, a Graph RAG platform for attack-path analysis.",
      "In 2024 I trained at BSNL Hyderabad, mapping data-transmission protocols across broadband infrastructure and assessing IoT cloud platforms. In 2026 I joined the Def-Space Summer Internship at BSERC, where I deployed AttackGraph as my capstone.",
      "Outside class I've been Tech Team Coordinator for IEEE at BIT Mesra, running a hands-on Python workshop for 100+ students, and I qualified for Smart India Hackathon 2024.",
    ],
  },
};
