import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Subscription Plans
  console.log('Creating plans...');
  const plans = [
    {
      name: 'Silver Club',
      slug: 'silver-club',
      price: 999.0,
      duration: 1,
      tier: 'SILVER',
      description: 'Perfect for beginners starting their fitness journey. Access to your home gym and standard training equipment.',
      features: JSON.stringify([
        'Access to single home gym location',
        'Standard cardio & strength equipment',
        'Basic workout library access',
        'Locker room & shower access',
        'Free Wi-Fi'
      ]),
      popular: false,
      active: true,
    },
    {
      name: 'Gold Club',
      slug: 'gold-club',
      price: 1999.0,
      duration: 1,
      tier: 'GOLD',
      description: 'Our most popular plan. Access to all gyms across India, group fitness classes, and advanced amenities.',
      features: JSON.stringify([
        'All-India gym franchise access (25+ branches)',
        'Unlimited group fitness classes (Yoga, Zumba, HIIT)',
        'Access to CrossFit zones & steam rooms',
        'Premium workout plans & goals logging',
        '1 complimentary fitness assessment per month',
        '10% discount at the health cafe'
      ]),
      popular: true,
      active: true,
    },
    {
      name: 'Platinum Elite',
      slug: 'platinum-elite',
      price: 3499.0,
      duration: 1,
      tier: 'PLATINUM',
      description: 'The ultimate VIP experience. Personal trainers, custom diet plans, and premium wellness facilities.',
      features: JSON.stringify([
        'All-India franchise access + priority entry',
        '4 personal trainer sessions per month',
        'Customized nutrition & diet plans',
        'Unlimited group & premium masterclasses',
        'Access to recovery zone & spa facilities',
        'Complimentary gym apparel kit',
        '20% discount at the health cafe'
      ]),
      popular: false,
      active: true,
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  // 2. Exercises (20+)
  console.log('Creating exercises...');
  const exercisesData = [
    // Chest
    {
      name: 'Barbell Bench Press',
      slug: 'barbell-bench-press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Lie flat on a bench. Grip the barbell with hands slightly wider than shoulder-width. \n2. Unrack the bar and hold it straight over your chest. \n3. Lower the bar slowly to your mid-chest level. \n4. Push the bar back up explosively until your arms are fully extended.',
      tips: JSON.stringify(['Keep your feet flat on the floor', 'Do not bounce the bar off your chest', 'Retract your scapula before starting']),
    },
    {
      name: 'Incline Dumbbell Press',
      slug: 'incline-dumbbell-press',
      muscleGroup: 'Chest',
      equipment: 'Dumbbells',
      difficulty: 'Intermediate',
      instructions: '1. Set an incline bench to 30-45 degrees. \n2. Sit back with a dumbbell in each hand, resting on your thighs. \n3. Press the dumbbells up to arm length over your chest. \n4. Lower them slowly to the sides of your chest, then press back up.',
      tips: JSON.stringify(['Maintain a neutral wrist position', 'Control the descent', 'Focus on upper chest contraction']),
    },
    {
      name: 'Cable Crossover',
      slug: 'cable-crossover',
      muscleGroup: 'Chest',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: '1. Set pulleys to the high position. Grab handles and step forward. \n2. Lean slightly forward, arms extended out to the sides but slightly bent. \n3. Bring your hands together in a wide arc in front of your waist. \n4. Return slowly to the start position.',
      tips: JSON.stringify(['Squeeze your chest at the contraction peak', 'Do not use excessive momentum', 'Keep a slight bend in your elbows']),
    },
    // Back
    {
      name: 'Deadlift',
      slug: 'deadlift',
      muscleGroup: 'Back',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      instructions: '1. Stand with feet hip-width apart, barbell over mid-foot. \n2. Bend at the hips and knees, grab the bar with a shoulder-width grip. \n3. Flatten your back, brace your core, and drive through your heels to lift the bar. \n4. Stand tall, lock your hips, then lower the bar with control.',
      tips: JSON.stringify(['Never round your lower back', 'Keep the bar close to your shins', 'Engage your lats throughout the lift']),
    },
    {
      name: 'Lat Pulldown',
      slug: 'lat-pulldown',
      muscleGroup: 'Back',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: '1. Sit at a pulldown station and adjust the knee pad. \n2. Grab the bar with a wide overhand grip. \n3. Pull the bar down to your upper chest while leaning slightly back. \n4. Squeeze your lats, then slowly return the bar to the start.',
      tips: JSON.stringify(['Pull with your elbows, not your hands', 'Keep your shoulders down and back', 'Avoid jerking the weight']),
    },
    {
      name: 'Bent Over Barbell Row',
      slug: 'bent-over-barbell-row',
      muscleGroup: 'Back',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Hold a barbell with an overhand grip, feet shoulder-width apart. \n2. Bend at your hips and knees, lowering your torso until it is almost parallel to the floor. \n3. Pull the bar to your lower chest/abdomen. \n4. Lower the bar slowly to the starting position.',
      tips: JSON.stringify(['Keep your neck in a neutral line', 'Do not stand up as you lift', 'Squeeze your shoulder blades together']),
    },
    // Shoulders
    {
      name: 'Overhead Barbell Press',
      slug: 'overhead-barbell-press',
      muscleGroup: 'Shoulders',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      instructions: '1. Stand with feet shoulder-width apart. Rest the bar on your upper chest. \n2. Grip the bar slightly wider than shoulder-width, elbows forward. \n3. Press the bar straight up overhead, moving your face back slightly to clear it. \n4. Lockout at the top, then lower the bar to your chest.',
      tips: JSON.stringify(['Brace your core and squeeze your glutes', 'Keep your wrists aligned over your elbows', 'Do not bend your knees to assist (use strict form)']),
    },
    {
      name: 'Dumbbell Lateral Raise',
      slug: 'dumbbell-lateral-raise',
      muscleGroup: 'Shoulders',
      equipment: 'Dumbbells',
      difficulty: 'Beginner',
      instructions: '1. Stand tall with a dumbbell in each hand, palms facing in. \n2. Keeping a slight bend in your elbows, raise your arms out to the sides until parallel to the floor. \n3. Pause briefly at the top, then lower the weights slowly.',
      tips: JSON.stringify(['Lead with your elbows', 'Do not swing the weights', 'Pour out the pitcher at the top (pinky fingers slightly higher)']),
    },
    // Legs
    {
      name: 'Barbell Back Squat',
      slug: 'barbell-back-squat',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      instructions: '1. Rest the barbell on your upper back/traps. Stand with feet shoulder-width apart. \n2. Initiate by bending at the hips, then knees, as if sitting in a chair. \n3. Lower down until thighs are parallel to the floor or lower. \n4. Drive through your heels to return to the standing position.',
      tips: JSON.stringify(['Keep your chest up and back flat', 'Push your knees outward', 'Keep your heels glued to the floor']),
    },
    {
      name: 'Romanian Deadlift',
      slug: 'romanian-deadlift',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Stand holding a barbell at your hips. \n2. Keep knees slightly bent and slide the barbell down your thighs by pushing your hips backwards. \n3. Lower until you feel a deep stretch in your hamstrings, keeping your back flat. \n4. Drive hips forward and squeeze your glutes to stand up.',
      tips: JSON.stringify(['Focus on horizontal hip movement', 'Keep the bar in contact with your legs', 'Do not lower the bar below mid-shin if it rounds your back']),
    },
    {
      name: 'Leg Press',
      slug: 'leg-press',
      muscleGroup: 'Legs',
      equipment: 'Leg Press Machine',
      difficulty: 'Beginner',
      instructions: '1. Sit in the machine and place feet hip-width apart on the sled. \n2. Release the safety locks and lower the platform towards your chest until knees are at 90 degrees. \n3. Press the platform back up by pushing through your heels.',
      tips: JSON.stringify(['Do not lock out your knees at the top', 'Keep your tailbone flat against the seat', 'Control the eccentric phase']),
    },
    // Arms (Biceps/Triceps)
    {
      name: 'Dumbbell Bicep Curl',
      slug: 'dumbbell-bicep-curl',
      muscleGroup: 'Arms',
      equipment: 'Dumbbells',
      difficulty: 'Beginner',
      instructions: '1. Stand with a dumbbell in each hand, arms hanging down, palms facing forward. \n2. Keep your elbows tucked close to your torso. \n3. Curl the weights while contracting your biceps. \n4. Lower the dumbbells slowly back to the starting position.',
      tips: JSON.stringify(['Do not swing your elbows forward', 'Keep your wrists straight', 'Squeeze the biceps at the peak']),
    },
    {
      name: 'Tricep Rope Pushdown',
      slug: 'tricep-rope-pushdown',
      muscleGroup: 'Arms',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: '1. Attach a rope to a high pulley. Grab handles and stand close. \n2. Pin your elbows to your ribcage. \n3. Push the rope down, spreading the ends at the bottom of the movement. \n4. Slowly release back to elbow height.',
      tips: JSON.stringify(['Only move your forearms', 'Squeeze triceps at lockout', 'Keep torso steady']),
    },
    {
      name: 'Hammer Curl',
      slug: 'hammer-curl',
      muscleGroup: 'Arms',
      equipment: 'Dumbbells',
      difficulty: 'Beginner',
      instructions: '1. Stand holding dumbbells with a neutral grip (palms facing each other). \n2. Curl the dumbbells upward while keeping your palms facing inward. \n3. Lower with control.',
      tips: JSON.stringify(['Works the brachialis and forearm muscles', 'Minimize body sway']),
    },
    // Core
    {
      name: 'Abdominal Crunch',
      slug: 'abdominal-crunch',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      instructions: '1. Lie on your back with knees bent and feet flat. \n2. Place hands lightly behind your head. \n3. Flex your spine to lift your shoulders off the mat. \n4. Lower slowly under control.',
      tips: JSON.stringify(['Do not pull on your neck', 'Focus on contracting the abs', 'Exhale as you crunch up']),
    },
    {
      name: 'Hanging Leg Raise',
      slug: 'hanging-leg-raise',
      muscleGroup: 'Core',
      equipment: 'Pull-up Bar',
      difficulty: 'Intermediate',
      instructions: '1. Hang from a pull-up bar with straight arms. \n2. Keeping your legs straight, raise them until they are parallel to the floor. \n3. Lower them slowly, resisting the urge to swing.',
      tips: JSON.stringify(['Engage your lats to stabilize your body', 'Move slowly to avoid using momentum', 'Perform knee raises if straight leg is too difficult']),
    },
    {
      name: 'Plank',
      slug: 'plank',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      instructions: '1. Place elbows directly under shoulders on the floor. \n2. Extend legs straight back, resting on toes. \n3. Align ears, shoulders, hips, and heels in a straight line. \n4. Hold this position while bracing your core.',
      tips: JSON.stringify(['Do not let your hips sag', 'Breathe normally', 'Squeeze your glutes and quads']),
    },
    // Full Body & Cardio
    {
      name: 'Kettlebell Swing',
      slug: 'kettlebell-swing',
      muscleGroup: 'Full Body',
      equipment: 'Kettlebell',
      difficulty: 'Intermediate',
      instructions: '1. Stand over a kettlebell, feet wider than shoulder-width. \n2. Hinge at your hips, grab the handle, and pull the bell back between legs. \n3. Snap your hips forward forcefully to swing the kettlebell to shoulder height. \n4. Let it guide back down and repeat.',
      tips: JSON.stringify(['This is a hip hinge, not a squat', 'Keep your core tight', 'Power comes from glutes and hamstrings, not arms']),
    },
    {
      name: 'Burpee',
      slug: 'burpee',
      muscleGroup: 'Full Body',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      instructions: '1. Stand tall, drop into a squat, and place hands on the floor. \n2. Jump your feet back into a push-up position. \n3. Perform a push-up, then jump feet back to your hands. \n4. Jump straight up explosively, reaching hands overhead.',
      tips: JSON.stringify(['Land softly on your feet', 'Maintain a flat back during push-up', 'Keep a steady breathing rhythm']),
    },
    {
      name: 'Dumbbell Thruster',
      slug: 'dumbbell-thruster',
      muscleGroup: 'Full Body',
      equipment: 'Dumbbells',
      difficulty: 'Intermediate',
      instructions: '1. Hold dumbbells at shoulder height, stand with feet shoulder-width apart. \n2. Perform a full squat. \n3. As you stand up, use the upward momentum to press the dumbbells overhead. \n4. Lower dumbbells to shoulders and repeat.',
      tips: JSON.stringify(['Ensure a fluid transition between squat and press', 'Keep your heels down', 'Drive hard through legs']),
    }
  ];

  const exercises: { [key: string]: any } = {};

  for (const ex of exercisesData) {
    const createdEx = await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: ex,
      create: ex,
    });
    exercises[ex.slug] = createdEx;
  }

  // 3. Workout Plans (8+) & WorkoutExercises mapping
  console.log('Creating workout plans...');
  const plansData = [
    {
      name: 'Full Body Blast',
      slug: 'full-body-blast',
      category: 'Strength & Conditioning',
      difficulty: 'Intermediate',
      duration: 45,
      calories: 400,
      description: 'A comprehensive full-body training program designed to build muscle and burn calories simultaneously.',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
      featured: true,
      exercises: [
        { slug: 'barbell-back-squat', sets: 4, reps: '10', restSeconds: 90, order: 1 },
        { slug: 'barbell-bench-press', sets: 4, reps: '8', restSeconds: 90, order: 2 },
        { slug: 'lat-pulldown', sets: 3, reps: '10', restSeconds: 60, order: 3 },
        { slug: 'dumbbell-lateral-raise', sets: 3, reps: '12', restSeconds: 60, order: 4 },
        { slug: 'plank', sets: 3, reps: '60 secs', restSeconds: 45, order: 5 }
      ]
    },
    {
      name: 'Upper Body Power',
      slug: 'upper-body-power',
      category: 'Hypertrophy',
      difficulty: 'Intermediate',
      duration: 50,
      calories: 350,
      description: 'Target the chest, back, shoulders, and arms to build structural strength and density.',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60',
      featured: true,
      exercises: [
        { slug: 'barbell-bench-press', sets: 4, reps: '8', restSeconds: 90, order: 1 },
        { slug: 'bent-over-barbell-row', sets: 4, reps: '8', restSeconds: 90, order: 2 },
        { slug: 'overhead-barbell-press', sets: 3, reps: '8', restSeconds: 90, order: 3 },
        { slug: 'dumbbell-bicep-curl', sets: 3, reps: '12', restSeconds: 60, order: 4 },
        { slug: 'tricep-rope-pushdown', sets: 3, reps: '12', restSeconds: 60, order: 5 }
      ]
    },
    {
      name: 'Leg Day Destroyer',
      slug: 'leg-day-destroyer',
      category: 'Strength',
      difficulty: 'Advanced',
      duration: 60,
      calories: 500,
      description: 'An intense, high-volume leg routine targeting the quadriceps, hamstrings, and glutes.',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60',
      featured: true,
      exercises: [
        { slug: 'barbell-back-squat', sets: 4, reps: '8', restSeconds: 120, order: 1 },
        { slug: 'romanian-deadlift', sets: 4, reps: '10', restSeconds: 90, order: 2 },
        { slug: 'leg-press', sets: 3, reps: '12', restSeconds: 90, order: 3 },
        { slug: 'kettlebell-swing', sets: 3, reps: '15', restSeconds: 60, order: 4 }
      ]
    },
    {
      name: 'Push Day Split',
      slug: 'push-day-split',
      category: 'Hypertrophy',
      difficulty: 'Intermediate',
      duration: 45,
      calories: 320,
      description: 'Focus on pushing movements targeting chest, shoulders, and triceps.',
      imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=60',
      featured: false,
      exercises: [
        { slug: 'incline-dumbbell-press', sets: 4, reps: '10', restSeconds: 90, order: 1 },
        { slug: 'overhead-barbell-press', sets: 3, reps: '8', restSeconds: 90, order: 2 },
        { slug: 'cable-crossover', sets: 3, reps: '12', restSeconds: 60, order: 3 },
        { slug: 'tricep-rope-pushdown', sets: 3, reps: '12', restSeconds: 60, order: 4 }
      ]
    },
    {
      name: 'Pull Day Split',
      slug: 'pull-day-split',
      category: 'Hypertrophy',
      difficulty: 'Intermediate',
      duration: 45,
      calories: 330,
      description: 'Focus on pulling exercises targeting back, biceps, and rear delts.',
      imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=800&auto=format&fit=crop&q=60',
      featured: false,
      exercises: [
        { slug: 'bent-over-barbell-row', sets: 4, reps: '8', restSeconds: 90, order: 1 },
        { slug: 'lat-pulldown', sets: 4, reps: '10', restSeconds: 75, order: 2 },
        { slug: 'dumbbell-bicep-curl', sets: 3, reps: '12', restSeconds: 60, order: 3 },
        { slug: 'hammer-curl', sets: 3, reps: '10', restSeconds: 60, order: 4 }
      ]
    },
    {
      name: 'HIIT Fat Burner',
      slug: 'hiit-fat-burner',
      category: 'Cardio',
      difficulty: 'Beginner',
      duration: 30,
      calories: 450,
      description: 'High Intensity Interval Training designed to skyrocket your metabolic rate and burn fat.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=60',
      featured: false,
      exercises: [
        { slug: 'burpee', sets: 4, reps: '30 secs', restSeconds: 30, order: 1 },
        { slug: 'kettlebell-swing', sets: 4, reps: '45 secs', restSeconds: 30, order: 2 },
        { slug: 'dumbbell-thruster', sets: 4, reps: '30 secs', restSeconds: 30, order: 3 },
        { slug: 'plank', sets: 4, reps: '60 secs', restSeconds: 30, order: 4 }
      ]
    },
    {
      name: 'Core Crusher',
      slug: 'core-crusher',
      category: 'Core',
      difficulty: 'Beginner',
      duration: 20,
      calories: 150,
      description: 'A quick abdominal circuit to tighten and strengthen the entire core musculature.',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
      featured: false,
      exercises: [
        { slug: 'hanging-leg-raise', sets: 3, reps: '12', restSeconds: 45, order: 1 },
        { slug: 'abdominal-crunch', sets: 3, reps: '20', restSeconds: 30, order: 2 },
        { slug: 'plank', sets: 3, reps: '60 secs', restSeconds: 30, order: 3 }
      ]
    },
    {
      name: 'Strength Builder',
      slug: 'strength-builder',
      category: 'Strength',
      difficulty: 'Advanced',
      duration: 60,
      calories: 450,
      description: 'Build foundational absolute power using compound lifts: Squats, Deadlifts, and Overhead Presses.',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
      featured: false,
      exercises: [
        { slug: 'deadlift', sets: 5, reps: '5', restSeconds: 150, order: 1 },
        { slug: 'barbell-back-squat', sets: 5, reps: '5', restSeconds: 150, order: 2 },
        { slug: 'overhead-barbell-press', sets: 5, reps: '5', restSeconds: 120, order: 3 }
      ]
    }
  ];

  for (const wp of plansData) {
    const createdPlan = await prisma.workoutPlan.upsert({
      where: { slug: wp.slug },
      update: {
        name: wp.name,
        category: wp.category,
        difficulty: wp.difficulty,
        duration: wp.duration,
        calories: wp.calories,
        description: wp.description,
        imageUrl: wp.imageUrl,
        featured: wp.featured,
      },
      create: {
        name: wp.name,
        slug: wp.slug,
        category: wp.category,
        difficulty: wp.difficulty,
        duration: wp.duration,
        calories: wp.calories,
        description: wp.description,
        imageUrl: wp.imageUrl,
        featured: wp.featured,
      },
    });

    // Delete existing exercises mapping for this plan to avoid duplicates
    await prisma.workoutExercise.deleteMany({
      where: { workoutPlanId: createdPlan.id },
    });

    // Add exercises
    for (const exMapping of wp.exercises) {
      const exercise = exercises[exMapping.slug];
      if (exercise) {
        await prisma.workoutExercise.create({
          data: {
            workoutPlanId: createdPlan.id,
            exerciseId: exercise.id,
            sets: exMapping.sets,
            reps: exMapping.reps,
            restSeconds: exMapping.restSeconds,
            order: exMapping.order,
          },
        });
      }
    }
  }

  // 4. Gym Locations (25+ across major Indian cities)
  console.log('Creating gym locations...');
  const locationsData = [
    { name: 'Colaba Elite', city: 'Mumbai', state: 'Maharashtra', address: 'Taj Mahal Palace, Colaba', phone: '022-22841234', email: 'colaba@abfitness.com', lat: 18.9217, lng: 72.8333, rating: 4.9 },
    { name: 'Andheri CrossFit Hub', city: 'Mumbai', state: 'Maharashtra', address: 'Link Road, Andheri West', phone: '022-26345678', email: 'andheri@abfitness.com', lat: 19.1136, lng: 72.8697, rating: 4.7 },
    { name: 'Bandra Platinum Lounge', city: 'Mumbai', state: 'Maharashtra', address: 'Carter Road, Bandra West', phone: '022-26412233', email: 'bandra@abfitness.com', lat: 19.0544, lng: 72.8402, rating: 4.8 },
    
    { name: 'Connaught Place Elite', city: 'Delhi', state: 'Delhi', address: 'Radisson Blu, Outer Circle CP', phone: '011-41512345', email: 'cp@abfitness.com', lat: 28.6304, lng: 77.2177, rating: 4.9 },
    { name: 'Saket Arena', city: 'Delhi', state: 'Delhi', address: 'MGF Metropolitan Mall, Saket', phone: '011-26510099', email: 'saket@abfitness.com', lat: 28.5283, lng: 77.2195, rating: 4.6 },
    { name: 'Dwarka Power Zone', city: 'Delhi', state: 'Delhi', address: 'Sector 10 Metro Station, Dwarka', phone: '011-28034455', email: 'dwarka@abfitness.com', lat: 28.5811, lng: 77.0597, rating: 4.5 },
    
    { name: 'Indiranagar Prime', city: 'Bengaluru', state: 'Karnataka', address: '100 Feet Road, Indiranagar', phone: '080-25218899', email: 'indiranagar@abfitness.com', lat: 12.9719, lng: 77.6412, rating: 4.8 },
    { name: 'Koramangala Fitness Club', city: 'Bengaluru', state: 'Karnataka', address: '80 Feet Road, Koramangala 4th Block', phone: '080-41223344', email: 'koramangala@abfitness.com', lat: 12.9352, lng: 77.6244, rating: 4.7 },
    { name: 'HSR Layout Powerhouse', city: 'Bengaluru', state: 'Karnataka', address: 'Sector 3, HSR Layout', phone: '080-49591234', email: 'hsr@abfitness.com', lat: 12.9105, lng: 77.6450, rating: 4.6 },
    
    { name: 'Koregaon Park Platinum', city: 'Pune', state: 'Maharashtra', address: 'Lane 7, Koregaon Park', phone: '020-26159988', email: 'kp@abfitness.com', lat: 18.5362, lng: 73.8940, rating: 4.9 },
    { name: 'Kothrud Strength Box', city: 'Pune', state: 'Maharashtra', address: 'Karve Road, Kothrud', phone: '020-25441122', email: 'kothrud@abfitness.com', lat: 18.5074, lng: 73.8077, rating: 4.6 },
    { name: 'Wakad CrossFit Studio', city: 'Pune', state: 'Maharashtra', address: 'Dange Chowk Road, Wakad', phone: '020-46721111', email: 'wakad@abfitness.com', lat: 18.5987, lng: 73.7686, rating: 4.5 },
    
    { name: 'Jubilee Hills Elite', city: 'Hyderabad', state: 'Telangana', address: 'Road No. 36, Jubilee Hills', phone: '040-23556677', email: 'jubilee@abfitness.com', lat: 17.4325, lng: 78.4075, rating: 4.9 },
    { name: 'Gachibowli Tech Fitness', city: 'Hyderabad', state: 'Telangana', address: 'Outer Ring Road, Gachibowli', phone: '040-40203344', email: 'gachibowli@abfitness.com', lat: 17.4401, lng: 78.3489, rating: 4.7 },
    { name: 'Kondapur Studio', city: 'Hyderabad', state: 'Telangana', address: 'Botanical Garden Road, Kondapur', phone: '040-42012345', email: 'kondapur@abfitness.com', lat: 17.4622, lng: 78.3568, rating: 4.6 },
    
    { name: 'Nungambakkam Gym', city: 'Chennai', state: 'Tamil Nadu', address: 'Khader Nawaz Khan Road, Nungambakkam', phone: '044-42112233', email: 'nungambakkam@abfitness.com', lat: 13.0607, lng: 80.2462, rating: 4.8 },
    { name: 'Adyar Wellness Center', city: 'Chennai', state: 'Tamil Nadu', address: 'Sardar Patel Road, Adyar', phone: '044-24419988', email: 'adyar@abfitness.com', lat: 13.0012, lng: 80.2565, rating: 4.7 },
    
    { name: 'Satellite Club', city: 'Ahmedabad', state: 'Gujarat', address: 'Satellite Road, Ramdev Nagar', phone: '079-40019922', email: 'satellite@abfitness.com', lat: 23.0300, lng: 72.5000, rating: 4.6 },
    { name: 'C.G. Road Fit hub', city: 'Ahmedabad', state: 'Gujarat', address: 'Samartheshwar Mahadev Road, C.G. Road', phone: '079-26442233', email: 'cgroad@abfitness.com', lat: 23.0252, lng: 72.5583, rating: 4.5 },
    
    { name: 'Salt Lake City Studio', city: 'Kolkata', state: 'West Bengal', address: 'Sector V, Salt Lake', phone: '033-40049988', email: 'saltlake@abfitness.com', lat: 22.5726, lng: 88.4339, rating: 4.7 },
    { name: 'Park Street Premium', city: 'Kolkata', state: 'West Bengal', address: 'Park Street, Chowringhee', phone: '033-22495566', email: 'parkstreet@abfitness.com', lat: 22.5539, lng: 88.3533, rating: 4.9 },
    
    { name: 'DLF Phase 3 Vault', city: 'Gurugram', state: 'Haryana', address: 'Cyber City, Phase 3', phone: '0124-4056677', email: 'cybercity@abfitness.com', lat: 28.4901, lng: 77.0902, rating: 4.8 },
    { name: 'Golf Course Road Club', city: 'Gurugram', state: 'Haryana', address: 'Sector 54, Golf Course Road', phone: '0124-4202233', email: 'golfcourse@abfitness.com', lat: 28.4412, lng: 77.1009, rating: 4.8 },
    
    { name: 'Salt Lake Sector 1', city: 'Kolkata', state: 'West Bengal', address: 'Block CF, Sector 1', phone: '033-23348899', email: 'saltlake1@abfitness.com', lat: 22.5855, lng: 88.4111, rating: 4.6 },
    { name: 'Whitefield Power Box', city: 'Bengaluru', state: 'Karnataka', address: 'ITPL Main Road, Whitefield', phone: '080-49692233', email: 'whitefield@abfitness.com', lat: 12.9698, lng: 77.7500, rating: 4.7 }
  ];

  const amenitiesList = [
    'Cardio Zone',
    'CrossFit Rig',
    'Strength Machines',
    'Steam Room',
    'Locker Room',
    'Health Cafe',
    'Free Wi-Fi',
    'Yoga Studio',
    'Personal Training'
  ];

  const images = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=60'
  ];

  for (let i = 0; i < locationsData.length; i++) {
    const loc = locationsData[i];
    
    // Assign 4 random amenities from the list
    const shuffledAmenities = [...amenitiesList].sort(() => 0.5 - Math.random());
    const amenities = shuffledAmenities.slice(0, 5);
    
    // Timings
    const timings = 'Mon-Sat: 06:00 AM - 10:00 PM, Sun: 08:00 AM - 04:00 PM';
    
    // Choose one of the 4 gym images sequentially
    const imageUrl = images[i % images.length];

    await prisma.gymLocation.create({
      data: {
        name: loc.name,
        city: loc.city,
        state: loc.state,
        address: loc.address,
        phone: loc.phone,
        email: loc.email,
        lat: loc.lat,
        lng: loc.lng,
        amenities: JSON.stringify(amenities),
        timings: timings,
        rating: loc.rating,
        active: true,
        imageUrl: imageUrl,
      }
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
