# Product Requirements Document (PRD): The Auto-TA Exam Generator

## 1. Project Overview & Objectives
**Auto-TA** is an interactive, multi-agent AI exam generator and architecture simulator. It enables educators (Professors/Teachers) to generate customized, high-quality exam papers through a collaborative workflow of specialized AI agents. The application visualizes the entire multi-agent lifecycle in real-time and supports Human-in-the-Loop (HITL) review for editing, revising, and approving generated exams.

---

## 2. Core Features & Capabilities

### 2.1. Authentication & User Management
- **NextAuth.js Integration**: Secure authentication using the Credentials provider.
- **Password Hashing**: `bcryptjs` for secure password storage.
- **Dashboard Access**: Protected routes ensuring only authenticated professors can access the generator workspace and saved exam library.

### 2.2. Interactive Multi-Agent Exam Generator (The Simulation)
- **Professor Input Panel**: Users specify:
  - Subject Name (e.g., Computer Science, Mathematics)
  - Topics/Syllabus details (e.g., Random Forests, Gini Impurity, Python algorithms)
  - Total Marks (e.g., 50 marks, 100 marks)
  - Difficulty Level (Easy, Medium, Hard)
  - Inclusions: Conceptual Theory (MCQs/SAQs), Programming Tasks, or Mathematical Problems.
- **Real-Time Pipeline Visualization**: An animated flow showing:
  - **The Manager (Router)** splitting tasks.
  - **Agent A (Concept Writer)**, **Agent B (Programmer)**, and **Agent C (Mathematician)** executing tasks in parallel (Fan-Out).
  - **The Editor (Compiler)** aggregating responses to match target marks (Fan-In).
  - **The Checkpoint (Human-in-the-Loop)** pausing execution for review.
  - **Feedback Loop** routing revisions back to agents.

### 2.3. Multi-Agent Orchestration (LangGraph Workflow)
The AI system is built on **LangGraph** using Google Gemini API (`@langchain/google-genai`) and Tavily (`@langchain/tavily`) for search:
1. **Manager (Router Node)**: Parses the user input, divides marks among relevant categories, checks web resources via Tavily if needed, and kicks off parallel execution.
2. **Concept Writer Node**: Generates conceptual theory questions (Multiple Choice and Short Answer Questions) with solutions and grading rubrics.
3. **Programmer Node**: Generates coding problems (e.g., Python algorithms, code debugging) with reference solutions and test cases.
4. **Mathematician Node**: Generates numerical and equation-based problems with step-by-step mathematical proofs.
5. **Editor (Compiler Node)**: Combines all questions, ensures the total marks align with the user's request, formats the exam into a structured JSON payload, and formats it for readability.
6. **Human-in-the-Loop Node (Checkpoint)**: Pauses state and saves the draft exam.

### 2.4. Human-In-The-Loop (HITL) & Revision Loop
- **Draft Review Panel**: Interactive UI showing all generated questions.
- **Editing & Refining**: The Professor can:
  - Re-order questions.
  - Manually edit question texts, marks, or options.
  - Click "Reject & Revise" and supply feedback (e.g., *"The math question is too easy, make it advanced level."*).
- **Revision Routing**: Submitting feedback resumes the LangGraph loop, triggering the Manager to re-route specific tasks back to the Concept Writer, Programmer, or Mathematician agent for corrections.
- **Approval & Export**: Upon clicking "Approve Exam", the exam is saved to the SQLite database, and the user can download it as a styled PDF.

---

## 3. Database Schema (Prisma + SQLite)

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String   // hashed using bcryptjs
  createdAt DateTime @default(now())
  exams     Exam[]
}

model Exam {
  id             String         @id @default(uuid())
  userId         String
  user           User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject        String
  topics         String
  totalMarks     Int
  difficulty     String
  status         String         // "DRAFT" | "APPROVED"
  currentVersion Int            @default(1)
  questions      String         // JSON serialized list of questions
  createdAt      DateTime       @default(now())
  revisions      ExamRevision[]
}

model ExamRevision {
  id             String   @id @default(uuid())
  examId         String
  exam           Exam     @relation(fields: [examId], references: [id], onDelete: Cascade)
  version        Int
  feedback       String?  // The revision request text if rejected
  questions      String   // JSON serialized questions at this version
  createdAt      DateTime @default(now())
}
```

---

## 4. UI/UX & Styling Requirements

- **No Tailwind CSS**: Built entirely with standard CSS in `src/app/globals.css` and CSS module files.
- **Theme**: Premium dark mode/glassmorphism aesthetics. Deep charcoal backgrounds (`#0B0F19`), neon blue/cyan accents (`#00E5FF`), emerald green for approvals (`#10B981`), and soft border glows.
- **Interactive Visualization**:
  - SVG lines/connectors with animated dashed dashes (`stroke-dasharray`) representing data packages traveling between agent nodes.
  - Active-state pulse animations on Agent nodes when they are "processing".
- **Typography**: Google Fonts - Outfit and JetBrains Mono for code tasks.

---

## 5. Non-Functional Requirements & Security
- **Next.js 16 App Router**: Structure utilizing server and client components efficiently.
- **State Management**: React state or Context for handling the simulator state machine.
- **Validation**: Strict input validation for subject names, marks (>0), and formats.
- **Error Handling**: Graceful error displays for failed API connections or limit breaches.
