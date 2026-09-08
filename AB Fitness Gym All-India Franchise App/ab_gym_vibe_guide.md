# Vibe Coding Guide — AB Fitness Gym All-India Franchise App
This guide contains a series of **9 sequential prompts** designed for students to build a premium, full-stack gym franchise web application with Next.js, Prisma (SQLite), NextAuth.js, and Razorpay. 

By feeding these prompts to an AI coding assistant (like Gemini, Claude, or ChatGPT) step-by-step, students can construct the exact architecture, functionalities, and interactive pages of the **AB Fitness Gym** app, while customizing the colors, style, and branding to their liking.

---

## Technical Architecture & Setup Rules

To ensure students do not run into common Next.js, database, or library bugs, the prompts incorporate specific guardrails for these known pain points:
1. **Windows C++ Compiler Restrictions**: Downgrade Prisma to version `6` (`^6.4.0`) to use the built-in Rust query engine. This avoids native C++ driver adapters (like `better-sqlite3`) that require Visual Studio build tools on Windows.
2. **Lucide React CASING & Icons**: Use `lucide-react` version `0.475.0` to preserve brand social icons (`Instagram`, `Twitter`, `Youtube`, `Facebook`).
3. **styled-jsx inside Server Components**: Keep Server Components pure. Never write `styled-jsx` directly in database-fetching Server Components; instead, extract dashboard CSS to dedicated stylesheets.
4. **React Hydration Mismatch**: Random client particle animations or dates must be deferred to post-mount (`useEffect`) to guarantee client-rendered HTML matches server-rendered HTML.
5. **Keyless Payments (Sandbox Simulator)**: Allow testing payments locally without actual Razorpay keys by creating a fallback sandbox simulator checkout modal in the frontend and signature bypass in the API endpoints.

---

# Prompt Sequence

### Step 1: Scaffolding, Theme Customization & Global CSS
> **Student Action**: Copy and paste the prompt below to start the project. Tell the AI what custom colors (e.g., Cyberpunk Purple, Forest Green, Sleek Crimson) you want to use.

```text
Initialize a new Next.js 15+ project with TypeScript, App Router, and a `src` directory in the current folder. 
Do not use TailwindCSS; we want to write custom, modern vanilla CSS for maximum design control.

Let's setup the design system and scaffolding:
1. Install core dependencies: `prisma`, `@prisma/client`, `next-auth`, `razorpay`, `recharts`, `lucide-react@0.475.0`, `bcryptjs`, `zod`. (Ensure lucide-react is exactly 0.475.0 for social icon compatibility).
2. Create `src/app/globals.css`. Set up CSS custom properties (variables) for a premium dark mode theme. Include tokens for background, card backgrounds, borders, typography, and vibrant accents (e.g. electric gradient colors, glow shadow effects, glassmorphism border-radius, and smooth micro-animations). Let's use a harmonious color palette (specify your chosen primary/accent colors here, e.g., Electric Violet or Emerald Green).
3. Set up custom utility classes for buttons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-lg`), badges, card-gradients, and responsive grids.
4. Create the root `layout.tsx` incorporating Google Fonts (Inter + Outfit) and SEO metadata. Make sure all pages include responsive styling.
```

---

### Step 2: Database Schema (Prisma & SQLite)
> **Student Action**: Run this prompt next to build the relational database schema.

```text
Let's build the relational database schema using Prisma for our gym franchise. 
Create `prisma/schema.prisma` targeting SQLite database provider. Ensure you define the following models:
1. `User` (id, name, email, password, phone, city, role [default 'MEMBER'], image, timestamps, relations to memberships, payments, goals, logs, progress, accounts, sessions).
2. `Account` & `Session` & `VerificationToken` (standard models for NextAuth session adapters).
3. `Plan` (id, name, slug [unique], price, duration [months], tier [SILVER/GOLD/PLATINUM], description, features [JSON string list], popular [Boolean], active [Boolean], timestamps).
4. `Membership` (id, userId, planId, status [ACTIVE/EXPIRED/PENDING], cardNumber [unique], startDate, endDate, autoRenew, timestamps).
5. `Payment` (id, userId, membershipId [optional], amount, currency, status [PENDING/SUCCESS/FAILED], razorpayOrderId, razorpayPaymentId, razorpaySignature, description, timestamps).
6. `GymLocation` (id, name, city, state, address, phone, email, lat, lng, amenities [JSON string list], timings, rating, active, imageUrl).
7. `WorkoutPlan` (id, name, slug [unique], category, difficulty, duration [mins], calories, description, imageUrl, featured, relation to exercises).
8. `Exercise` (id, name, slug [unique], muscleGroup, equipment, difficulty, instructions, tips [JSON string list], videoUrl, imageUrl, relation to workoutPlans).
9. `WorkoutExercise` (connector join table: id, workoutPlanId, exerciseId, sets, reps [string like '12' or 'to failure'], restSeconds, order).
10. `FitnessGoal` (id, userId, type, title, target, current, unit [kg/reps/mins], deadline, status, timestamps).
11. `WorkoutLog` (id, userId, exerciseId, sets, reps, weight, duration, notes, date, timestamps).
12. `ProgressEntry` (id, userId, weight, bodyFat, chest, waist, hips, biceps, thighs, notes, date, timestamps).

After generating the schema, run `npx prisma generate` to build the Prisma Client.
```

---

### Step 3: Database Seeding
> **Student Action**: Run this prompt to populate the database with default gym locations, exercises, and workout splits.

```text
Create a Prisma seeding script in `prisma/seed.ts` that will populate the database when we run `npx prisma db seed`.
The seed script must populate:
1. Three core subscription plans:
   - Silver (₹999/mo, basic workout plans, access to home gym).
   - Gold (₹1,999/mo, popular, All-India gym access, group classes).
   - Platinum (₹3,499/mo, All-India gym access, 4 personal trainer sessions, nutrition plan).
2. 20+ Exercises across muscle groups (Chest, Back, Shoulders, Arms, Legs, Core, Full Body) with detailed step-by-step instructions and tips.
3. 8+ Workout Plans (Full Body Blast, Upper Body Power, Leg Day Destroyer, Push Day, Pull Day, HIIT Fat Burner, Core Crusher) using the connector table to map specific exercises, sets, reps, and rest timers.
4. 25+ Gym Locations across major Indian cities (Mumbai, Delhi, Bengaluru, Pune, Hyderabad, Chennai, Ahmedabad, Kolkata, Gurugram, etc.) with custom amenities (WiFi, Cardio Zone, CrossFit, Cafe) and ratings.

Ensure the seed file compiles properly. Configure the `prisma.seed` command in your `package.json` and tell me how to run the migration and seed the database.
```

---

### Step 4: Authentication Core & Route Protection
> **Student Action**: Run this prompt to set up NextAuth session management and route validation.

```text
Let's implement credentials authentication:
1. Create a Prisma client singleton at `src/lib/db.ts` to prevent multiple client instances during hot-reloading.
2. Set up NextAuth configuration in `src/lib/auth.ts` with a CredentialsProvider. Implement email/password validation by fetching from the SQLite user table and comparing passwords using `bcryptjs`.
3. Expose session and role variables (MEMBER, ADMIN) inside the JWT token and Session callbacks.
4. Create the Catchall NextAuth API route handler at `src/app/api/auth/[...nextauth]/route.ts`.
5. Create a registration API endpoint at `src/app/api/auth/register/route.ts` that validates email uniqueness, hashes passwords with bcrypt, and registers a new User.
6. Set up route protection middleware in `src/proxy.ts` (Next.js 16 Proxy convention or standard middleware) that redirects unauthenticated users trying to access `/dashboard` routes back to `/login`, and redirects logged-in users away from `/login`/`/register` to `/dashboard`.
```

---

### Step 5: Auth UI Pages (Login & Register)
> **Student Action**: Create the forms for user signups.

```text
Create beautiful, responsive split-screen pages for Authentication:
1. Create an auth page layout in `src/app/(auth)/layout.tsx` that displays a premium gym branding block on the left (e.g. background with abstract gym art, a motivating quote, and key statistics) and the form inputs on the right.
2. Create the Login page `src/app/(auth)/login/page.tsx` using custom CSS. Validate email and password inputs client-side, showing error indicators. Integrate the NextAuth `signIn('credentials')` action and handle post-login redirects.
3. Create the Register page `src/app/(auth)/register/page.tsx` containing fields for Name, Email, Password, Phone Number, and a City dropdown representing major Indian cities.
Ensure both forms look premium, use glassmorphism inputs, smooth hover scales, and clear validation logic.
```

---

### Step 6: Navigation, Hero & Marketing Landing Page
> **Student Action**: Build the public marketing pages.

```text
Let's assemble the public homepage and layout navigation:
1. Build a sticky Glassmorphism `Navbar.tsx` component in `src/components/Navbar.tsx`. Make it responsive with a toggleable burger menu on mobile. The navbar must read the NextAuth auth session and show a "Dashboard" link if logged in, and a "Login / Get Started" CTA button if not.
2. Build a modern `HeroSection.tsx` component. It should feature a large display heading, a bold gradient tagline, call-to-action buttons, and clean decorative particle circles. 
   - CRITICAL: To prevent React hydration mismatches, ensure any dynamic properties (like random coordinates or client-only elements) are deferred by rendering particles only after mounting (e.g. using `useState` and `useEffect` client-side).
3. Build a `FeaturesGrid.tsx` detailing gym amenities and franchise benefits (e.g., All-India card, modern equipment, certified trainers, progress logs).
4. Build a `Footer.tsx` component featuring links, descriptions, contact info, and social brand icons using `lucide-react` (Instagram, Twitter, YouTube, Facebook). Add `use client` to Footer if it utilizes styled-jsx tags to prevent rendering errors.
5. Create the main landing page `src/app/page.tsx`. Fetch the active pricing plans from the database, render the Hero, Features Grid, locations map preview, Testimonials Carousel, and the plans sections.
```

---

### Step 7: Razorpay Payment API & Sandbox Simulator Gateway
> **Student Action**: Implement this prompt to build the payment workflow with a keyless fallback modal.

```text
Let's set up the payments workflow supporting both real Razorpay transactions and a mock/development sandbox simulator:
1. Create a Razorpay helper file `src/lib/razorpay.ts` that instantiates the Razorpay client using `process.env.RAZORPAY_KEY_ID` and `process.env.RAZORPAY_KEY_SECRET`. Add helper utilities for formatting currency in INR (₹) and generating sequential gym card numbers (e.g., prefixed with 'ABF').
2. Create a POST endpoint `/api/payments/create-order/route.ts` that retrieves the selected `planId`, fetches the pricing, and checks if keys are default placeholders (e.g. `rzp_test_yourkeyhere`).
   - If keys are default placeholders, return a mock order payload (`isMock: true`, fake order ID like `order_mock_...`).
   - If keys are valid, call `razorpay.orders.create` to generate a real Razorpay order ID.
   - Insert a `PENDING` transaction record in the `Payment` table.
3. Create a verification POST endpoint `/api/payments/verify/route.ts` that validates signature parameters:
   - If `orderId` starts with `order_mock_`, check if `signature === 'mock_signature'`.
   - Otherwise, verify the HMAC SHA-256 hash using the Razorpay key secret.
   - On successful payment, mark the payment as `SUCCESS`, create/extend the customer's `ACTIVE` membership with their unique gym card number, and link it to the user's profile.
4. Modify `PricingCards.tsx` to handle order responses:
   - If `orderData.isMock` is returned, open a beautiful, custom glassmorphism **Sandbox Simulator checkout overlay modal** inside the Pricing Card showing Plan Name, Price, and Order ID. Add two buttons: "Simulate Success" (calls `/api/payments/verify` with mock signature) and "Cancel".
   - If real keys are present, load the Razorpay SDK script dynamically and prompt the native Razorpay payment overlay.
   - Redirect successful checkouts to `/dashboard/membership`.
```

---

### Step 8: Member Dashboard & Digital Gym Card
> **Student Action**: Build the main private customer panels.

```text
Let's build the customer workspace dashboard:
1. Create a shared sidebar navigation layout at `src/app/dashboard/layout.tsx` providing links to: Overview, Membership, Fitness Goals, Progress Tracking, and Workout Logger.
2. Build the Main Overview dashboard home page `src/app/dashboard/page.tsx`. Fetch user session details and display a welcoming banner, quick action cards, a Summary Grid showing membership status, active goals, workout counts, and a timeline list of recent workouts.
3. Build the Membership Detail page `src/app/dashboard/membership/page.tsx`:
   - If the user has an active membership, render a digital **Virtual Gym Card** designed with CSS gradients, card numbers, user name, plan tier, valid dates, and a decorative QR Code. Include a list showing payment history.
   - If no membership exists, render a card stating "No Active Membership" linking back to the pricing plans page.
   - CRITICAL: Save all component styles inside a dedicated `membership.css` file and import it directly. Do not use styled-jsx within server-rendered pages to prevent styled-jsx hydration mismatches.
```

---

### Step 9: Workout Library, Locator, Tips & Fitness Tracker
> **Student Action**: Complete the auxiliary components: Exercises, Locations, Tips, Goals, and Logger.

```text
Let's complete the features for workout tracking and navigation:
1. **Gym Locator** (`src/app/locations/page.tsx`): Fetch seeded gym locations and build a filterable UI where users can search by city name or state, viewing gym details, contact phones, and amenities list.
2. **Exercises & Workouts Catalog** (`src/app/workouts/page.tsx` and `src/app/exercises/page.tsx`): 
   - A searchable library of exercises categorized by muscle groups (chest, back, legs) and equipment (barbell, dumbbell, bodyweight).
   - A catalogue of workout plans. Clicking a workout plan routes to a dynamic detail page (`src/app/workouts/[id]/page.tsx`) mapping the list of exercises, sets, reps, rest periods, and detailed step-by-step instructions.
3. **Fitness Tips** (`src/app/tips/page.tsx`): A clean FAQ accordion component showcasing form safety tips, recovery guides, and nutrition suggestions.
4. **Fitness Goals Tracker** (`src/app/dashboard/goals/page.tsx`): Build a CRUD interface connected to `/api/goals` where members can define goals (e.g. target weight, reps), modify progress, view completion rings, and archive old milestones.
5. **Workout Logger** (`src/app/dashboard/log/page.tsx`): Build a log entry form that posts sets, reps, and weight to `/api/workout-log`, tracking exercise logs under the user's profile. Expose progress charts over time.
6. **Progress Tracker** (`src/app/dashboard/progress/page.tsx`): Fetch progress logs and render weight and body fat trends over time using Recharts lines and logs list.
```

---

## Tips for Success (Vibe Coding)

* **Customize Colors**: Students can adjust the CSS custom properties in `globals.css` (like `--primary`, `--bg-secondary`, `--radius-xl`) to instantly change the theme from neon orange/dark grey to electric blue, emerald cyber, or pastel minimal.
* **Troubleshooting Compilation**: If Next.js fails to compile styled-jsx or throws client/server mismatches, verify you have added `'use client';` at the top of interactive components (like navigation, carousels, lists, and forms).
* **Database Reset**: To wipe the SQLite database and start fresh with seed data, run:
  ```bash
  npx prisma db push --force-reset
  npx prisma db seed
  ```
