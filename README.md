# Research Saturday Nexus 🔬✨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-Gemini%20API-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python: 3.12](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)

> **An intelligent research collaboration and hybrid semantic matching system.** Nexus connects researchers to the experts, datasets, methodologies, funding streams, and opportunities they need across the entire research lifecycle. It provides real-time personalized recommendations to accelerate discovery and scientific breakthroughs.

---

## 📖 Overview

Traditional research directories are static, fragmented, and siloed. **Research Saturday Nexus** transforms collaboration discovery into an active intelligence workflow. Through a natural-language query interface (**"What do you need right now?"**), researchers can articulate complex, multi-dimensional needs (e.g., *"I need a statistician who understands agricultural finance and can work with Kenyan datasets"*). 

The platform uses Google Gemini via the `@google/genai` SDK and hybrid search algorithms to instantly extract entities, analyze constraints, and return ranked experts, relevant open microdata, targeted grant opportunities, and methodological frameworks.

---

## 🌟 Key Features

- 🔍 **Natural Language Intelligence Engine**: Ask what you need in free text; extract skills, geographic regions, domain constraints, and intent using Gemini structured outputs.
- 🎯 **Multi-Attribute Hybrid Matching**: Combines semantic embeddings, BM25 keyword overlap, geographic proximity, and availability factors into confidence-ranked recommendations.
- 🔄 **5-Layer Research Lifecycle Navigation**:
  1. **Discover**: Find collaborators, mentors, data repositories, and grant calls.
  2. **Build**: Transform concepts into active project workspaces, manage teams, track milestones, and maintain literature binders.
  3. **Publish**: Match paper abstracts to indexed journals by scope/impact factor and plan co-authorship equity.
  4. **Connect**: Engage with peer research networks, RSVP to bi-weekly symposiums, and explore industry challenges.
  5. **Impact**: Map outputs to UN Sustainable Development Goals (SDGs), log policy briefs, and track spin-off runways.
- 🛡️ **Role-Based Access Control (RBAC) & Security Matrix**: Real-time role enforcement adhering to the Principle of Least Privilege across Researchers, Mentors, Industry Partners, Institutional Admins, and System Moderators.
- 📑 **Comprehensive Technical Blueprint**: Interactive 14-section architectural specification covering Django models, RESTful OpenAPI schemas, pgvector queries, Celery background tasks, and zero-downtime migration plans.

---

## 🤖 Models & APIs Used

| Component | Technology / Model | Role in Nexus |
| :--- | :--- | :--- |
| **Entity Extraction & Query Parsing** | `gemini-1.5-flash` / `gemini-2.5-flash` | Extracts research domain, target geography, datasets, and methods with **Structured Outputs (JSON Schema)**. |
| **Synthesis & Recommendation** | `gemini-1.5-pro` | Generates context-rich match rationales and connects paper abstracts to journal aims. |
| **System Instructions** | Google AI Studio Prompt Studio | Constrains responses strictly to validated scholarly ontologies and research domains. |
| **SDK** | `@google/genai` (v2.4+) | Modern, typed Google Gen AI TypeScript SDK for fast server-side and client-side execution. |

---

## 📋 Prerequisites

Before running the project locally, ensure you have:

1. **Google AI Studio API Key**:
   - Obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. **Node.js**:
   - Version `20.0.0` or higher (compatible with npm, pnpm, or bun).
3. *(Optional for Backend Specification)* **Python**:
   - Python `3.12+` with PostgreSQL 16 + `pgvector` extension if executing the backend Django services.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/research-saturday-nexus.git
cd research-saturday-nexus
```

### 2. Configure Environment Variables
Create a local `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add your Google AI Studio API key in `.env`:
```env
GEMINI_API_KEY="AIzaSyYourGoogleAIStudioKeyHere"
APP_URL="http://localhost:3000"
```

### 3. Install Dependencies
```bash
# Using npm
npm install

# Or using bun
bun install
```

### 4. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Usage & Examples

### Running the Matching Engine via CLI / TypeScript
```typescript
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function parseResearchNeed(userInput: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: userInput,
    config: {
      systemInstruction: 'You are the Research Saturday Nexus Query Intelligence parser. Extract structured entities for research collaboration matching.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skillsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetGeography: { type: Type.STRING },
          targetDomain: { type: Type.STRING },
          datasetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['skillsNeeded', 'targetGeography', 'targetDomain']
      }
    }
  });

  return JSON.parse(response.text);
}

// Example Execution
const need = await parseResearchNeed(
  "I need a statistician who understands agricultural finance and can work with Kenyan datasets."
);
console.log(need);
```

### Running Unit Tests
Unit tests are implemented using Node's built-in test runner (`node:test`):

```bash
node --test src/utils/matchingEngine.test.ts
```

---

## 🏗️ Architecture & How It Works

```
                                  [ User Input ]
                                        │
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │            Google AI Studio / Gemini API             │
             │   - System Instructions: Scholarly taxonomy parser   │
             │   - Structured Outputs: JSON entity extraction       │
             └──────────────────────────┬───────────────────────────┘
                                        │
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │             Hybrid Intelligent Matcher               │
             │   ├── pgvector / Semantic Cosine Similarity (35%)    │
             │   ├── BM25 Keyword & Skill Overlap (25%)             │
             │   ├── Geographic & Regional Affiliation (15%)        │
             │   ├── Dataset Repository Familiarity (15%)           │
             │   └── Availability & Collaboration Willingness (10%) │
             └──────────────────────────┬───────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 Ranked Outputs                                  │
│  ├── Ranked Researchers & Specialists (with match confidence % & rationales)    │
│  ├── Relevant Open & Licensed Datasets (KNBS, KALRO, CGIAR)                    │
│  ├── Matching Grants & Open Funding Calls (Gates Foundation, IDRC, Wellcome)   │
│  └── Recommended Methodologies (Callaway-Sant'Anna DiD, Spatial Geostatistics)  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

1. **Prompt Engineering & System Instructions**: The AI Studio system prompt instructs Gemini to classify inputs along established academic fields, extract geographic scope, and identify empirical methodologies.
2. **Structured Outputs**: Guarantees clean, deterministic JSON schema responses for skills, regions, and dataset tags without markdown formatting overhead.
3. **Hybrid Ranking Fusion**: Scores each candidate against the parsed constraints, giving researchers full visibility into *why* a particular match is suggested.

---

## ⚙️ Environment Variables

| Variable | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | API key from Google AI Studio | **Yes** | `AIzaSy...` |
| `APP_URL` | Base application URL for CORS and links | No | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string with pgvector | No | `postgres://user:pass@localhost:5432/nexus` |

---

## 🤝 Contributing

Contributions are welcomed! To get started:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "feat: add citation network visualization"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

Please ensure all tests pass (`node --test src/utils/matchingEngine.test.ts`) and adhere to TypeScript typing conventions before opening a pull request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 💬 Acknowledgments

- Built with [Google AI Studio](https://aistudio.google.com/) and the [Gemini API](https://ai.google.dev/).
- Inspired by the [Research Saturday](https://researchsaturday.org) collaborative research intelligence initiative.
