// content-defaults.js
//
// Fallback content used when the API isn't configured yet (site-config.js
// BASE_URL is empty) or a content request fails. This is the SAME data
// that api/scripts/seed-content.js loads into the database, so the site
// looks identical whether it's reading from here or from your live API.
// Once the API is connected, this file is only a safety net.

window.FNB_DEFAULT_CONTENT = {
  "global": {
    "brand": {
      "short": "FnB",
      "tagline": "Diaspora Investment Advisory",
      "fullName": "Forward in Business"
    },
    "contact": {
      "phone": "+255 742 460 508",
      "location": "Dar es Salaam, Tanzania"
    }
  },
  "home": {
    "hero": {
      "eyebrow": "Tanzania · Diaspora Investment Advisory",
      "title": "Invest with Confidence. Stay Connected. See What Is Happening on the Ground.",
      "body": "Forward in Business closes the trust gap between the East African diaspora and their home-based contacts through independent verification, project assurance, and a secure evidence portal that gives you visibility into your money and your projects from anywhere in the world.",
      "primaryCta": {
        "label": "Get the Diaspora Investment Report",
        "href": "research.html#report"
      },
      "secondaryCta": {
        "label": "See how it works",
        "href": "roadmap.html"
      },
      "photo": "https://images.unsplash.com/photo-1589177900326-900782f88a55?q=80&w=2200&auto=format&fit=crop",
      "photoCaption": "Dar es Salaam - where FnB verifies and executes on the ground",
      "badges": [
        "PhD-led research team",
        "Registered in Tanzania (BRELA)",
        "AML/KYC from day one",
        "Zero client fund custody in Phase 1"
      ]
    },
    "stats": [
      {
        "count": 8,
        "label": "Non-negotiable trust controls, built in from day one"
      },
      {
        "count": 8,
        "label": "Service pillars, from research to financial oversight"
      },
      {
        "count": 0,
        "suffix": "%",
        "label": "Client funds held or pooled by FnB in Phase 1"
      },
      {
        "count": 6,
        "label": "Stages in the client journey - Discover to Assure"
      }
    ],
    "compare": {
      "eyebrow": "Transparency, in practice",
      "title": "From verified plot to finished home - drag to see the difference trust makes.",
      "body": "Every FnB project starts with independent land and title verification, long before the first brick is laid.",
      "before": "https://images.unsplash.com/photo-1714402587825-359435f71bbc?q=80&w=1800&auto=format&fit=crop",
      "after": "https://images.unsplash.com/photo-1763909130793-68be9aaa3407?q=80&w=1800&auto=format&fit=crop",
      "beforeTag": "Verified plot",
      "afterTag": "Completed home"
    },
    "trustIntro": {
      "eyebrow": "A service-led trust system",
      "title": "Not a replacement for family. A professional layer around it.",
      "body": "FnB combines independent research, hands-on concierge execution, and a secure digital portal so you gain a professionally accountable partner on the ground, without giving up the relationships you already trust.",
      "linkLabel": "See the full client journey →",
      "linkHref": "roadmap.html"
    },
    "stages": [
      {
        "num": "I",
        "label": "Research",
        "title": "Investment Research & Screening",
        "body": "Market and sector research, opportunity screening, and investor education without regulated securities recommendations.",
        "photo": "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1200&auto=format&fit=crop"
      },
      {
        "num": "II",
        "label": "Concierge",
        "title": "Due Diligence & Project Assurance",
        "body": "We never pool client money, we coordinate verification and execute the project on your behalf: title checks, procurement oversight, construction supervision.",
        "photo": "https://images.unsplash.com/photo-1681505531034-8d67054e07f6?q=80&w=800&auto=format&fit=crop"
      }
    ],
    "gallery": {
      "eyebrow": "Site diary",
      "title": "What supervision actually looks like",
      "items": [
        {
          "image": "https://images.unsplash.com/photo-1680538993407-aeacacd7354a?q=80&w=800&auto=format&fit=crop",
          "caption": "Foundation & structure"
        },
        {
          "image": "https://images.unsplash.com/photo-1614127938540-a1139bee1841?q=80&w=800&auto=format&fit=crop",
          "caption": "On-site supervision"
        },
        {
          "image": "https://images.unsplash.com/photo-1760597307051-67946f9cf865?q=80&w=800&auto=format&fit=crop",
          "caption": "Progress inspection"
        },
        {
          "image": "https://images.unsplash.com/photo-1761401395640-5c45422f2a99?q=80&w=800&auto=format&fit=crop",
          "caption": "Handover"
        },
        {
          "image": "https://images.unsplash.com/photo-1763909130793-68be9aaa3407?q=80&w=800&auto=format&fit=crop",
          "caption": "Property management"
        }
      ]
    },
    "final": {
      "eyebrow": "Why FnB exists",
      "title": "A family in London, finally completing a house in Tanzania - without losing money.",
      "body": "That’s the outcome FnB is built around. Everything else the research, the reports, the portal exists to make that ordinary.",
      "photo": "https://images.unsplash.com/photo-1761401395640-5c45422f2a99?q=80&w=2000&auto=format&fit=crop",
      "cta": {
        "label": "Join the first cohort",
        "href": "research.html#report"
      }
    }
  },
  "roadmap": {
    "hero": {
      "eyebrow": "Client journey & decision rights",
      "title": "You always keep the decision. We’re accountable for the evidence.",
      "body": "FnB never asks you to hand over control. At every stage, our accountability and your decision rights are written down before work begins - from first conversation to project closeout.",
      "photo": "https://images.unsplash.com/photo-1672380135241-c024f7fbfa13?q=80&w=800&auto=format&fit=crop"
    },
    "stages": [
      {
        "num": 1,
        "label": "Discover",
        "title": "Education, intake & qualification",
        "body": "FnB is accountable for transparent qualification and education. You retain the decision on whether to proceed at all.",
        "tag": "You decide: whether to proceed",
        "photo": "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1200&auto=format&fit=crop"
      },
      {
        "num": 2,
        "label": "Define",
        "title": "KYC, scope & conflict screening",
        "body": "We run risk-based source of funds checks and scope the engagement. You set the objectives, budget, and risk boundary.",
        "tag": "You decide: objectives & budget",
        "photo": "https://images.unsplash.com/photo-1681505504714-4ded1bc247e7?q=80&w=800&auto=format&fit=crop"
      },
      {
        "num": 3,
        "label": "Verify",
        "title": "Independent verification",
        "body": "We coordinate evidence from independent, appropriately qualified specialists identity, title, technical, and supplier checks. You accept the scope and material risks.",
        "tag": "You decide: acceptance of risk",
        "photo": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
      },
      {
        "num": 4,
        "label": "Decide",
        "title": "Findings, without concealing risk",
        "body": "We present findings, limitations, and options in full - including adverse facts. The investment and supplier decision stays yours.",
        "tag": "You decide: investment & supplier",
        "photo": "https://images.unsplash.com/photo-1759310610325-2c7cb621e5e3?q=80&w=800&auto=format&fit=crop"
      },
      {
        "num": 5,
        "label": "Execute",
        "title": "Tracking instructions & evidence",
        "body": "We track authorised instructions and evidence, and never move money through informal cash routes. Payment approval always runs through regulated channels - and stays with you.",
        "tag": "You decide: payment approval",
        "photo": "https://images.unsplash.com/photo-1760597307051-67946f9cf865?q=80&w=800&auto=format&fit=crop"
      },
      {
        "num": 6,
        "label": "Assure",
        "title": "Progress, budget & closeout",
        "body": "We report progress, budget, and issues, and escalate early. Change approval and final acceptance of the completed project remain yours.",
        "tag": "You decide: final acceptance",
        "photo": "https://images.unsplash.com/photo-1763909130793-68be9aaa3407?q=80&w=800&auto=format&fit=crop"
      }
    ],
    "final": {
      "eyebrow": "Eight non-negotiable controls",
      "title": "Every stage above is backed by written controls, not good intentions.",
      "body": "See the research, verification, and evidence work behind the client journey.",
      "photo": "https://images.unsplash.com/photo-1761401395640-5c45422f2a99?q=80&w=2000&auto=format&fit=crop",
      "cta": {
        "label": "View the research hub",
        "href": "research.html"
      }
    }
  },
  "services": {
    "hero": {
      "eyebrow": "Eight service pillars",
      "title": "What FnB does while you’re abroad.",
      "body": "Fee-for-service, project by project - you keep ownership and every decision right, we handle verification and coordination on the ground. FnB does not pool, hold, or invest client funds in Phase 1.",
      "photo": "https://images.unsplash.com/photo-1718010564464-5888d08ef5e6?q=80&w=2200&auto=format&fit=crop"
    },
    "processIntro": {
      "eyebrow": "Example: building a house from abroad",
      "title": "A diaspora family, building at home - four pillars in practice"
    },
    "process": [
      {
        "step": "01 - Verify",
        "title": "Legal & title verification",
        "body": "Ownership and title checks, coordinated through qualified specialists, before funds move.",
        "photo": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
      },
      {
        "step": "02 - Screen",
        "title": "Procurement oversight",
        "body": "Bids compared and suppliers screened, so decisions rest on evidence, not word of mouth.",
        "photo": "https://images.unsplash.com/photo-1681505504714-4ded1bc247e7?q=80&w=800&auto=format&fit=crop"
      },
      {
        "step": "03 - Monitor",
        "title": "Project management & monitoring",
        "body": "Milestones tracked, evidence verified before you approve each payment.",
        "photo": "https://images.unsplash.com/photo-1760597307051-67946f9cf865?q=80&w=700&auto=format&fit=crop"
      },
      {
        "step": "04 - Report",
        "title": "Financial oversight & reporting",
        "body": "Budget-to-actual tracking and a closeout pack you can review from anywhere.",
        "photo": "https://images.unsplash.com/photo-1672380135241-c024f7fbfa13?q=80&w=800&auto=format&fit=crop"
      }
    ],
    "pillarsIntro": {
      "eyebrow": "The eight service pillars",
      "title": "Every engagement draws from the same eight pillars"
    },
    "pillars": [
      {
        "pillar": "Secure digital client evidence portal",
        "outcome": "Role-based access, document versioning, approval logs, budget-to-actual tracking, milestone evidence, and an exportable closeout pack."
      },
      {
        "pillar": "Investment research & opportunity screening",
        "outcome": "Market and sector research and readiness planning, without regulated securities recommendations."
      },
      {
        "pillar": "Due diligence & verification",
        "outcome": "Identity, ownership, legal, tax, technical, and supplier checks coordinated through qualified, and where required licensed, specialists."
      },
      {
        "pillar": "Legal & title verification",
        "outcome": "Independent confirmation of ownership and title before any funds are committed."
      },
      {
        "pillar": "Project management & monitoring",
        "outcome": "Baseline scope, budget, and milestones set; progress monitored; issues documented and escalated early."
      },
      {
        "pillar": "Procurement oversight",
        "outcome": "Bids compared and suppliers screened before you choose, so the decision rests on evidence."
      },
      {
        "pillar": "Financial oversight & reporting",
        "outcome": "Budget-to-actual tracking and evidence verified before you approve each payment."
      },
      {
        "pillar": "Training, webinars & corporate partnerships",
        "outcome": "Diaspora education, market briefs, and partner training - without selling unlicensed investments."
      }
    ],
    "trustIntro": {
      "eyebrow": "Eight non-negotiable trust controls",
      "title": "What we will never compromise on",
      "body": "These controls are written into every engagement, regardless of size - they are what makes FnB a professional intermediary rather than another informal arrangement."
    },
    "trustControls": [
      {
        "title": "Verified identity & credentials",
        "body": "Identity, beneficial ownership, and professional credentials verified before engagement begins."
      },
      {
        "title": "Written scope & fees",
        "body": "Deliverables, assumptions, exclusions, decision rights, and an escalation path - all in writing."
      },
      {
        "title": "Conflict-of-interest screening",
        "body": "Disclosed for founders, employees, specialists, suppliers, and referral partners alike."
      },
      {
        "title": "Separation of duties",
        "body": "Recommendation, supplier selection, evidence verification, and payment approval kept separate wherever practical."
      },
      {
        "title": "No custody of client funds",
        "body": "In Phase 1, payments move through regulated banks and approved providers directly to contracted recipients - never through FnB."
      },
      {
        "title": "Evidence linked to every milestone",
        "body": "Contract, invoice, inspection, photographs or location data, budget variance, issue log, and acceptance record."
      },
      {
        "title": "Time-stamped audit trail",
        "body": "Role-based access, multi-factor authentication, backup, and incident-response procedures."
      },
      {
        "title": "Documented complaints & remediation",
        "body": "A formal process for complaints, remediation, whistleblowing, quality review, and partner suspension."
      }
    ],
    "final": {
      "eyebrow": "Start with a conversation",
      "title": "Tell us what you’re trying to do back home.",
      "body": "Whether it’s due diligence on a plot or a full build supervised end to end start with a consultation.",
      "photo": "https://images.unsplash.com/photo-1759310610325-2c7cb621e5e3?q=80&w=2000&auto=format&fit=crop",
      "cta": {
        "label": "Meet the founder",
        "href": "about.html"
      }
    }
  },
  "about": {
    "intro": {
      "eyebrow": "Origin story",
      "title": "Built from lived experience, not a market gap on paper.",
      "photo": "https://images.unsplash.com/photo-1589177900326-900782f88a55?q=80&w=800&auto=format&fit=crop",
      "paragraphs": [
        "Forward in Business was conceived in 2023 and formally established in mid-2026 by a team with direct, lived experience of the problem it now solves. Our founding Managing Director spent more than fifteen years living abroad and, over that period, witnessed a recurring pattern among fellow diaspora members: mismanaged construction projects, unexplained loss of funds sent home for investment, and most damaging of all, family relationships strained by informal financial arrangements never built to withstand distance, time, or disagreement.",
        "That experience is FnB’s core insight: the problem diaspora investors face is rarely a shortage of capital or opportunity. It’s a shortage of trustworthy, professionally accountable intermediaries who can stand between the investor and the market, verify what’s real, and report back honestly and consistently."
      ]
    },
    "founder": {
      "name": "Dr. Frank Kassongo",
      "role": "Founder & Managing Director",
      "credentials": [
        {
          "label": "Background",
          "value": "PhD, Development Studies · MTech, Public Relations Management"
        },
        {
          "label": "University",
          "value": "University of the Western Cape · Cape Peninsula University of Technology"
        },
        {
          "label": "Current role",
          "value": "Postgraduate supervisor · MBA Capstone Project (Johannesburg)"
        },
        {
          "label": "Contact",
          "value": "+255 742 460 508"
        }
      ]
    },
    "visionMission": {
      "eyebrow": "Vision & mission",
      "title": "What we’re building toward",
      "items": [
        {
          "tag": "V",
          "title": "Vision",
          "body": "To become the most trusted, technology-enabled diaspora investment ecosystem connecting global African investors with sustainable opportunities across East Africa."
        },
        {
          "tag": "M",
          "title": "Mission",
          "body": "To empower diaspora investors through transparent governance, professional investment management, digital innovation, investor education, and measurable impact."
        }
      ]
    },
    "principlesIntro": {
      "eyebrow": "Founding principles",
      "title": "Six values that don’t move"
    },
    "principles": [
      {
        "title": "Transparency",
        "body": "Every client can see what is being done with their money and why."
      },
      {
        "title": "Evidence-based management",
        "body": "Decisions are grounded in verified data and documented due diligence, not assumption."
      },
      {
        "title": "Regulatory compliance",
        "body": "FnB operates strictly within Tanzanian company, tax, and investment-advisory law."
      },
      {
        "title": "Innovation",
        "body": "Technology closes distance and information gaps - it isn’t used as a marketing gloss."
      },
      {
        "title": "Long-term sustainability",
        "body": "Client relationships and firm reputation are managed for the long run, not a single transaction."
      },
      {
        "title": "Measurable impact",
        "body": "Success is tracked against verified assets, completed projects, and informed decisions - not just revenue."
      }
    ],
    "teamIntro": {
      "eyebrow": "Founding team",
      "title": "A complementary skill set, not a solo founder story",
      "body": "Development-sector research credibility, data and systems engineering, and IT delivery experience - built by people who’ve lived the problem from more than one angle."
    },
    "team": [
      {
        "initials": "FK",
        "name": "Dr Frank Kassongo",
        "role": "Founder / Managing Director",
        "bg": "PhD, Development Studies; MTech, Public Relations Management",
        "uni": "University of the Western Cape · Cape Peninsula University of Technology"
      },
      {
        "initials": "SK",
        "name": "Safi Kasongo",
        "role": "Co-founder / Director, Systems Engineering",
        "bg": "BSc, Data Science",
        "university": "The Eastern Africa Statistical Training Centre, Tanzania"
      },

    ],
    "quote": {
      "text": "To become the most trusted, technology-enabled diaspora investment ecosystem connecting global African investors with sustainable opportunities across East Africa - and to get there through transparent governance, not just growth.",
      "name": "Dr. Frank Kassongo",
      "role": "Founder & Managing Director",
      "initials": "FK"
    },
    "governanceIntro": {
      "eyebrow": "Governance philosophy",
      "title": "Seven pillars that answer the trust deficit directly",
      "body": "FnB is registered as a private limited liability company in Tanzania, through BRELA, and operates strictly as a fee-based advisory and project management service, it does not pool, hold, or invest client funds on a discretionary basis at this stage."
    },
    "governance": [
      {
        "title": "Evidence-based decision-making",
        "body": "Every recommendation is grounded in verified data, not assumption."
      },
      {
        "title": "Technology-driven operations",
        "body": "The secure evidence portal isn’t a feature, it’s how oversight actually happens."
      },
      {
        "title": "Trust & transparency by design",
        "body": "Built into the process from the first engagement, not bolted on after."
      },
      {
        "title": "Accountability at every level",
        "body": "From field verification staff to the Board."
      },
      {
        "title": "Strict legal compliance",
        "body": "BRELA filings, Tanzania Revenue Authority obligations, and AML/KYC from inception."
      },
      {
        "title": "Respect for cultural diversity",
        "body": "Across a geographically dispersed, multi-country client base."
      },
      {
        "title": "Open, two-way communication",
        "body": "With clients and partners, at every stage of the relationship."
      }
    ],
    "final": {
      "eyebrow": "Get in touch",
      "title": "Have land, a build, or a question about investing back home?",
      "body": "Start with a conversation, no commitment, no custody of your funds, just a first look at what you’re trying to do.",
      "photo": "https://images.unsplash.com/photo-1568216681201-1edacc6c8048?q=80&w=2000&auto=format&fit=crop",
      "cta": {
        "label": "Call +255 742 460 508",
        "href": "tel:+255742460508"
      }
    }
  }
};
