// ===================== AI CHATBOX WIDGET =====================

// Gemini API Configuration
const GEMINI = {
  API_KEY: "AIzaSyAAnuKSMjpJvg33_1gqquiIlfaXhV-3PsQ", // Leave empty for user to fill
  MODEL: "gemini-pro",
  ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/"
};

// Comprehensive Pet Care Knowledge Base
const PET_CARE_ADVICE = {
  // Dog Care
  dog: {
    grooming: {
      title: "Dog Grooming Masterclass 🛁",
      content: `**Daily Care:**
      • Brush short-haired dogs 2-3x/week, long-haired breeds daily
      • Check ears for redness, odor, or discharge
      • Wipe eyes gently with damp cloth if needed
      • Brush teeth 3-4x/week with dog-specific toothpaste

      **Weekly Routine:**
      • Trim nails (if you hear clicking on floors, they're too long)
      • Check paw pads for cuts or foreign objects
      • Clean ears with vet-approved solution
      • Brush coat thoroughly to remove dead hair

      **Monthly Spa Day:**
      • Bath with dog-specific shampoo (every 4-8 weeks)
      • Full coat trim if needed (or professional grooming)
      • Anal gland check (vet or groomer recommended)
      • Deep dental cleaning inspection

      **Pro Tips:**
      • Start grooming routines when your dog is young
      • Use positive reinforcement with treats and praise
      • Different brushes for different coat types
      • Never use human shampoo (wrong pH balance)
      `
    },
    nutrition: {
      title: "Complete Dog Nutrition Guide 🍖",
      content: `**Feeding Schedule by Age:**
      • Puppies (8-12 weeks): 4 meals daily
      • Puppies (3-6 months): 3 meals daily  
      • Adult dogs (6+ months): 2 meals daily
      • Senior dogs (7+ years): 2 smaller meals daily

      **Portion Control:**
      • Follow package guidelines based on weight
      • Adjust for activity level (active dogs need more)
      • Monitor body condition - you should feel ribs under thin fat layer
      • Use measuring cups, not scoops

      **Foods to NEVER Feed:**
      • Chocolate, grapes, onions, garlic, avocado
      • Xylitol (artificial sweetener), alcohol, caffeine
      • Cooked bones, macadamia nuts, raw dough with yeast
      • High-fat foods can cause pancreatitis

      **Special Dietary Needs:**
      • Large breeds: Controlled calcium for proper bone growth
      • Small breeds: Higher calorie density for faster metabolism
      • Active/working dogs: Higher protein and fat content
      • Overweight dogs: Reduced calorie, increased fiber

      **Hydration:**
      • Fresh water available at all times
      • Clean bowl daily
      • Monitor water intake (changes can indicate health issues)
      `
    },
    training: {
      title: "Dog Training Academy 🎓",
      content: `**Puppy Training (8-16 weeks):**
      • Socialization window - expose to everything!
      • Basic commands: Sit, Down, Come, Stay
      • House training: Take out every 2 hours
      • Bite inhibition: Yelp and stop play if biting

      **Basic Obedience (3-6 months):**
      • Heel on leash without pulling
      • Come when called (reliable recall)
      • Leave it/Drop it commands
      • Place command (go to mat/bed)

      **Advanced Training (6+ months):**
      • Off-leash reliability
      • Distance commands
      • Trick training (roll over, shake, etc.)
      • Agility or specialty training

      **Training Principles:**
      • Positive reinforcement only (treats, praise, toys)
      • Short sessions (5-15 minutes) multiple times daily
      • End on success - always finish with a win!
      • Consistency is key - same commands, same rules

      **Problem Solving:**
      • Jumping: Ignore, reward four paws on floor
      • Barking: Identify trigger, teach "quiet" command
      • Separation anxiety: Gradual desensitization
      • Leash pulling: Stop moving when pulling starts
      `
    },
    exercise: {
      title: "Dog Exercise & Activity Guide 🏃‍♂️",
      content: `**Daily Exercise Needs by Breed:**
      • High energy (Border Collie, Husky): 2+ hours daily
      • Medium energy (Labrador, Beagle): 1-2 hours daily
      • Low energy (Bulldog, Basset Hound): 30-60 minutes daily
      • Giant breeds (Great Dane, Mastiff): Moderate, joint-conscious exercise

      **Types of Exercise:**
      • Walking: 2-3 walks daily, different routes for mental stimulation
      • Running: Only for fully grown dogs (18+ months)
      • Swimming: Excellent low-impact exercise
      • Fetch/Frisbee: High intensity in short bursts
      • Agility training: Physical and mental workout

      **Mental Stimulation:**
      • Puzzle toys and treat dispensers
      • Training sessions (learning new tricks)
      • Nose work and scent games
      • Social interaction with other dogs
      • New environments and experiences

      **Exercise Safety:**
      • Build up gradually, especially for puppies
      • Avoid exercise 1 hour before/after meals
      • Watch for overheating (panting, lagging behind)
      • Paw pad protection in extreme weather
      • Senior dogs need gentler, shorter sessions
      `
    },
    health: {
      title: "Dog Health & Wellness Guide 🏥",
      content: `**Daily Health Checks:**
      • Appetite and water consumption
      • Energy level and behavior
      • Stool quality and urination frequency
      • Breathing pattern (should be easy, not labored)
      • Gum color (should be pink, not pale or blue)

      **Vaccination Schedule:**
      • 6-8 weeks: First DHPP (distemper, hepatitis, parvovirus, parainfluenza)
      • 10-12 weeks: DHPP booster, Leptospirosis
      • 14-16 weeks: DHPP final, Rabies
      • 12-16 months: Adult boosters
      • Then: Boosters every 1-3 years as recommended

      **Common Health Warning Signs:**
      • Loss of appetite for more than 24 hours
      • Vomiting or diarrhea lasting more than a day
      • Excessive thirst or urination
      • Difficulty breathing or persistent coughing
      • Lethargy or depression
      • Aggression or personality changes

      **Preventive Care:**
      • Annual vet check-ups
      • Dental cleanings as recommended
      • Parasite prevention (fleas, ticks, heartworms)
      • Weight management
      • Regular blood work for senior dogs

      **Emergency Situations:**
      • Difficulty breathing
      • Unconsciousness or seizures
      • Severe bleeding
      • Inability to urinate or defecate
      • Suspected poisoning
      • Trauma (hit by car, fall from height)
      `
    }
  },

  // Cat Care
  cat: {
    grooming: {
      title: "Cat Grooming Essentials ✨",
      content: `**Daily Grooming:**
      • Short-haired cats: Brush 2-3x/week
      • Long-haired cats (Persian, Maine Coon): Daily brushing
      • Check for mats behind ears and under legs
      • Wipe eyes with damp cloth if discharge present

      **Weekly Care:**
      • Trim front claws every 2-3 weeks
      • Check ears for mites or infections
      • Dental check - look for red gums or tartar
      • Paw pad inspection for cuts or foreign objects

      **Bathing Cats:**
      • Most cats don't need regular baths
      • Only bathe if extremely dirty or has skin condition
      • Use cat-specific shampoo (never human products)
      • Prepare everything before starting - cats hate waiting!
      • Trim nails before bath for safety

      **Professional Grooming:**
      • Consider for long-haired breeds
      • Lion cuts for hot weather (if cat tolerates)
      • Senior cats who can't groom themselves
      • Show cats before competitions
      `
    },
    nutrition: {
      title: "Feline Nutrition Mastery 🐱",
      content: `**Feeding Schedule:**
      • Adult cats: 2-3 small meals daily
      • Kittens (under 6 months): 3-4 meals daily
      • Senior cats (7+ years): 2-3 smaller meals
      • Free feeding can lead to obesity

      **Protein Requirements:**
      • Cats are obligate carnivores - need meat!
      • Minimum 26% protein for adults, 30% for kittens
      • Taurine is essential (amino acid found in meat)
      • Wet food often better than dry only

      **Foods Toxic to Cats:**
      • Onions, garlic, chives (causes anemia)
      • Chocolate, caffeine, alcohol
      • Grapes and raisins
      • Xylitol (artificial sweetener)
      • Raw dough with yeast
      • Most human medications

      **Special Considerations:**
      • Indoor cats need fewer calories
      • Urinary tract health: Wet food helps hydration
      • Hairball control: Special formulas available
      • Weight management: Portion control crucial
      • Kidney disease: Prescription diets available

      **Water Intake:**
      • Cats have low thirst drive (desert ancestors)
      • Wet food provides moisture
      • Multiple water bowls around house
      • Some cats prefer running water (fountains)
      • Clean bowls daily
      `
    },
    training: {
      title: "Cat Training & Behavior Guide 🎯",
      content: `**Litter Box Training:**
      • Kittens usually learn from mother
      • Place in quiet, accessible location
      • Keep very clean (scoop daily, change weekly)
      • One box per cat plus one extra
      • Unscented clumping litter usually best

      **Basic Commands:**
      • Come when called (use treats, call at mealtime)
      • Sit (hold treat above head, reward when sits)
      • Stay (gradually increase duration)
      • High five/paw (touch paw, say command, reward)

      **Behavioral Training:**
      • Scratching posts: Place near furniture, reward use
      • Carrier training: Leave out, put treats inside
      • Nail trimming: Start young, reward tolerance
      • Brushing: Short sessions with treats

      **Problem Behaviors:**
      • Scratching furniture: Provide alternatives, use deterrents
      • Aggression: Identify triggers, gradual desensitization
      • Inappropriate elimination: Rule out medical issues first
      • Excessive meowing: Don't reward with attention

      **Enrichment Activities:**
      • Puzzle feeders for meals
      • Clicker training sessions
      • Window perches for bird watching
      • Interactive toys and play sessions
      • Cat trees and climbing structures
      `
    },
    exercise: {
      title: "Cat Exercise & Play Guide 🎾",
      content: `**Daily Play Requirements:**
      • 2-3 play sessions of 10-15 minutes each
      • Interactive play (with you) most important
      • Rotate toys to maintain interest
      • Morning and evening sessions (peak activity times)

      **Types of Play:**
      • Hunting games: Wand toys, laser pointers
      • Fetch: Some cats retrieve toys
      • Puzzle toys: Treat dispensers, food puzzles
      • Climbing: Cat trees, shelves, window perches
      • Solo play: Balls, catnip toys, crinkly toys

      **Exercise by Age:**
      • Kittens: High energy, frequent short play sessions
      • Adults: Structured play, maintain healthy weight
      • Seniors: Gentle exercise, maintain mobility
      • Indoor cats: Need more intentional exercise

      **Creating Exercise Opportunities:**
      • Place food in different locations
      • Use treat-dispensing toys instead of bowls
      • Create vertical spaces for climbing
      • Window perches for visual stimulation
      • Rotate toys weekly to prevent boredom

      **Exercise Safety:**
      • Never use string toys unsupervised
      • Avoid laser pointer frustration - end with catchable toy
      • Provide escape routes in multi-cat households
      • Watch for overexertion (panting, exhaustion)
      • Senior cats need gentler activities
      `
    },
    health: {
      title: "Cat Health & Wellness Complete Guide 🩺",
      content: `**Daily Health Monitoring:**
      • Appetite changes (eating more/less than usual)
      • Litter box habits (frequency, consistency)
      • Energy level and activity
      • Breathing pattern (should be quiet and easy)
      • Eye and nose discharge

      **Vaccination Schedule:**
      • 6-8 weeks: First FVRCP (feline viral rhinotracheitis, calicivirus, panleukopenia)
      • 10-12 weeks: FVRCP booster
      • 14-16 weeks: FVRCP final, Rabies
      • Feline Leukemia (FeLV) for outdoor cats
      • Adult boosters every 1-3 years

      **Common Health Issues:**
      • Urinary tract problems (especially male cats)
      • Dental disease (very common in cats)
      • Hairballs and digestive issues
      • Upper respiratory infections
      • Kidney disease (especially seniors)

      **Warning Signs:**
      • Not eating for more than 24 hours
      • Straining in litter box
      • Vomiting more than once in 24 hours
      • Hiding or personality changes
      • Difficulty breathing
      • Unexplained weight loss

      **Preventive Care:**
      • Annual vet examinations
      • Dental care (brushing, dental treats)
      • Parasite prevention (fleas, ticks, heartworms)
      • Weight management
      • Environmental enrichment
      • Spay/neuter unless breeding

      **Emergency Situations:**
      • Cannot urinate (especially male cats)
      • Severe breathing difficulty
      • Trauma or injury
      • Poisoning exposure
      • Seizures or unconsciousness
      • Severe vomiting/diarrhea with blood
      `
    }
  },

  // Rabbit Care
  rabbit: {
    grooming: {
      title: "Rabbit Grooming Guide 🐰",
      content: `**Daily Grooming:**
      • Check for mats, especially around tail and neck
      • Remove loose fur with gentle brushing
      • Check for signs of mites or skin problems
      • Clean food from around mouth area

      **Weekly Care:**
      • Full body brush-out
      • Nail trim (every 4-6 weeks)
      • Check ears for wax or mites
      • Inspect teeth for overgrowth

      **Seasonal Shedding:**
      • Rabbits shed 3-4 times per year
      • Increase brushing during heavy sheds
      • Remove loose fur to prevent hairballs
      • Some breeds need professional grooming

      **Bathing:**
      • Rabbits should NOT be bathed (stressful and dangerous)
      • Spot clean with damp cloth if needed
      • Dry shampoo for rabbits if necessary
      • Keep living area clean to prevent need for bathing
      `
    },
    nutrition: {
      title: "Rabbit Nutrition Essentials 🥕",
      content: `**Daily Diet (80% hay):**
      • Unlimited timothy hay (or other grass hays)
      • Alfalfa only for young, pregnant, or nursing rabbits
      • Hay provides fiber for digestive health
      • Helps wear down constantly growing teeth

      **Fresh Vegetables (15%):**
      • Dark leafy greens: romaine, cilantro, parsley, dandelion greens
      • Other veggies: bell peppers, carrots (limited), broccoli leaves
      • Introduce new vegetables gradually
      • Avoid: iceberg lettuce, potatoes, beans, rhubarb

      **Pellets (5% max):**
      • High-fiber pellets (18%+ fiber)
      • Adult rabbits: 1/4 cup per 5 lbs body weight
      • Avoid mixes with seeds, dried fruit, or colored bits
      • Timothy-based pellets preferred

      **Treats (sparingly):**
      • Fresh fruits: apple (no seeds), banana, berries
      • Dried fruits (no added sugar)
      • Commercial rabbit treats
      • Never more than 1-2 tablespoons per day

      **Foods to Avoid:**
      • All human processed foods
      • Chocolate, candy, bread, pasta
      • Onions, garlic, leeks
      • Iceberg lettuce (causes diarrhea)
      • Houseplants (many are toxic)
      `
    },
    housing: {
      title: "Rabbit Housing & Environment 🏠",
      content: `**Cage Requirements:**
      • Minimum: 4x feet of floor space per rabbit
      • Height: Tall enough for rabbit to stand on hind legs
      • Wire flooring needs solid areas for feet rest
      • Easy to clean and disinfect

      **Exercise Area:**
      • Rabbits need 3-4 hours daily exercise time
      • Bunny-proofed area with no electrical cords
      • Safe from other pets
      • Litter box access during exercise

      **Bedding:**
      • Paper-based bedding or aspen shavings
      • Avoid cedar or pine shavings (toxic)
      • Change bedding 2-3 times per week
      • Spot clean daily

      **Environmental Needs:**
      • Temperature: 60-70°F (15-21°C)
      • Good ventilation but no drafts
      • Quiet area away from loud noises
      • 12-hour light/dark cycle
      • Hiding places for security

      **Litter Training:**
      • Rabbits naturally use one corner
      • Place litter box in preferred corner
      • Use paper-based or wood pellet litter
      • Clean daily, change weekly
      `
    },
    health: {
      title: "Rabbit Health Monitoring 🏥",
      content: `**Daily Health Checks:**
      • Eating and drinking normally
      • Poop production (should be plentiful and round)
      • Activity level and behavior
      • Breathing (quiet, not labored)
      • Eyes and nose (clear, no discharge)

      **Common Health Issues:**
      • Dental problems (overgrown teeth)
      • Gastrointestinal stasis (not eating/pooping)
      • Ear mites and infections
      • Respiratory infections
      • Sore hocks (feet problems)

      **Warning Signs:**
      • Not eating for more than 12 hours
      • Small or no fecal pellets
      • Lethargy or hiding
      • Grinding teeth (sign of pain)
      • Head tilt or balance problems
      • Difficulty breathing

      **Preventive Care:**
      • Annual vet check-ups (find rabbit-savvy vet)
      • Spay/neuter (prevents cancer, reduces aggression)
      • Regular nail trims
      • Dental checks
      • Parasite prevention

      **Emergency Kit:**
      • Critical Care food (for syringe feeding)
      • Infant gas drops (simethicone)
      • Thermometer
      • Vet contact information
      • Carrier for transport
      `
    }
  },

  // Bird Care
  bird: {
    housing: {
      title: "Bird Housing & Environment 🦜",
      content: `**Cage Requirements:**
      • Minimum width: 1.5x wingspan for flight birds
      • Height: Enough for vertical flight (parrots need tall cages)
      • Bar spacing appropriate for species (too wide = escape risk)
      • Multiple perches of different sizes and materials
      • Easy to clean design

      **Cage Placement:**
      • Away from kitchen (fumes can be toxic)
      • Not in direct sunlight or drafts
      • Quiet area for sleeping
      • Social area for interaction
      • Away from other pets

      **Perches & Accessories:**
      • Natural wood perches (different diameters)
      • Rope perches for comfort
      • Concrete perches for nail trimming
      • Swings and ladders for enrichment
      • Food and water dishes (stainless steel preferred)

      **Environmental Enrichment:**
      • Toys rotated weekly to prevent boredom
      • Foraging opportunities
      • Bathing opportunities (shallow dish or misting)
      • Out-of-cage time in safe area
      • Visual stimulation (window view, but not stressful)
      `
    },
    nutrition: {
      title: "Bird Nutrition Guide 🌾",
      content: `**Species-Specific Diets:**
      • Parrots: 60-80% pellets, 20-40% fresh foods
      • Canaries/Finches: Seed mix plus fresh foods
      • Cockatiels: Pellets plus some seed
      • Avoid all-seed diets (nutritionally incomplete)

      **Fresh Foods (daily):**
      • Dark leafy greens: kale, collards, mustard greens
      • Other vegetables: carrots, sweet potato, bell peppers
      • Limited fruits: berries, apple (no seeds), melon
      • Cooked grains: brown rice, quinoa, oats

      **Foods to Avoid:**
      • Avocado (toxic to many birds)
      • Chocolate, caffeine, alcohol
      • Onions, garlic, mushrooms
      • Fruit seeds/pits (apple seeds contain cyanide)
      • High-fat, high-salt human foods
      • Xylitol (artificial sweetener)

      **Feeding Schedule:**
      • Fresh food daily (remove after 4 hours)
      • Pellets available at all times
      • Fresh water daily, sometimes twice
      • Monitor food intake (changes indicate illness)

      **Special Considerations:**
      • Calcium needs (especially for laying females)
      • Vitamin A deficiency common in seed-only diets
      • Obesity prevention (limit high-fat foods)
      • Convert seed-eaters to pellets gradually
      `
    },
    health: {
      title: "Bird Health & Wellness 🩺",
      content: `**Daily Health Monitoring:**
      • Eating and drinking habits
      • Droppings (color, consistency, frequency)
      • Activity level and vocalization
      • Feather condition and preening behavior
      • Breathing (should be quiet, no tail bobbing)

      **Common Health Problems:**
      • Feather plucking (stress, medical, behavioral)
      • Respiratory infections
      • Psittacine beak and feather disease (PBFD)
      • Egg binding in females
      • Heavy metal poisoning
      • Nutritional deficiencies

      **Warning Signs:**
      • Fluffed feathers for extended periods
      • Sitting on cage bottom
      • Loss of appetite
      • Changes in droppings
      • Discharge from eyes, nose, or mouth
      • Difficulty breathing
      • Bleeding or injury

      **Preventive Care:**
      • Annual vet check-ups (avian vet preferred)
      • Regular nail/beak trims if needed
      • Wing clipping (if desired, done properly)
      • Bathing opportunities for feather health
      • Clean environment to prevent disease

      **Emergency Preparedness:**
      • Avian vet contact information
      • Safe transport carrier
      • Heat source for transport
      • Basic first aid supplies
      • Knowledge of common toxins
      `
    }
  },

  // Fish Care
  fish: {
    aquarium: {
      title: "Fish Aquarium Setup & Maintenance 🐠",
      content: `**Tank Setup:**
      • Cycle tank before adding fish (2-6 weeks)
      • Appropriate size for species (bigger is better)
      • Proper filtration system
      • Heater for tropical fish (maintain 76-80°F)
      • Thermometer to monitor temperature
      • Lighting appropriate for plants and fish

      **Water Quality:**
      • Test water weekly (ammonia, nitrite, nitrate, pH)
      • Ammonia and nitrite should be 0 ppm
      • Nitrate below 20 ppm
      • pH appropriate for species (6.5-7.5 for community)
      • Water changes: 25% weekly for most setups

      **Filtration:**
      • Mechanical filtration (removes particles)
      • Biological filtration (beneficial bacteria)
      • Chemical filtration (activated carbon)
      • Flow rate: 4-6x tank volume per hour
      • Clean filter media in tank water, not tap water

      **Maintenance Schedule:**
      • Daily: Check fish behavior, temperature, equipment
      • Weekly: Test water, 25% water change, gravel vacuum
      • Monthly: Clean filter, check equipment, prune plants
      • As needed: Replace filter media, clean glass
      `
    },
    nutrition: {
      title: "Fish Feeding Guide 🍤",
      content: `**Feeding Schedule:**
      • Most fish: Once or twice daily
      • Only what they can eat in 2-3 minutes
      • Skip one day per week (beneficial for digestion)
      • Different species have different needs
      • Observe eating to ensure all fish get food

      **Food Types:**
      • Flakes: Good for surface feeders
      • Pellets: Sink for mid/bottom feeders
      • Frozen foods: Bloodworms, brine shrimp
      • Live foods: Brine shrimp, blackworms
      • Algae wafers for herbivores

      **Species-Specific Diets:**
      • Goldfish: Plant-based foods, limit protein
      • Bettas: High-protein, meat-based foods
      • Cichlids: Varies by species (some need plants)
      • Catfish: Sinking pellets, algae wafers
      • Tetras: Small flakes or micro-pellets

      **Overfeeding Dangers:**
      • Leads to poor water quality
      • Can cause swim bladder problems
      • Obesity in fish
      • Algae blooms from excess nutrients
      • Ammonia spikes from uneaten food

      **Feeding Tips:**
      • Soak dry food before feeding
      • Rotate food types for variety
      • Target feed with pipette for shy fish
      • Remove uneaten food after 5 minutes
      `
    },
    health: {
      title: "Fish Health Management 💊",
      content: `**Daily Health Checks:**
      • Swimming behavior (normal vs erratic)
      • Appetite and feeding response
      • Color brightness
      • Gill movement (should be steady, not rapid)
      • Interaction with tank mates

      **Common Diseases:**
      • Ich (white spot disease)
      • Fin rot (bacterial infection)
      • Swim bladder disorder
      • Fungal infections
      • Parasites (internal and external)
      • Ammonia/nitrite poisoning

      **Disease Prevention:**
      • Quarantine new fish for 2-4 weeks
      • Maintain excellent water quality
      • Don't overcrowd tank
      • Provide proper nutrition
      • Minimize stress (proper handling, stable conditions)

      **Treatment Basics:**
      • Identify disease before treating
      • Use quarantine tank for treatment
      • Follow medication instructions exactly
      • Remove carbon from filter during treatment
      • Complete full treatment course

      **When to Seek Help:**
      • Multiple fish showing symptoms
      • Fish not responding to treatment
      • Unusual symptoms you can't identify
      • Fish dying without obvious cause
      • Need for prescription medications
      `
    }
  },

  // General Pet Care Tips
  general: {
    daily_care: {
      title: "Daily Pet Care Checklist 📋",
      content: `**Morning Routine:**
      • Check food and water levels
      • Observe pet's energy and appetite
      • Quick health check (eyes, nose, behavior)
      • Clean up any messes from overnight
      • Provide fresh water if needed

      **Evening Routine:**
      • Feed dinner according to schedule
      • Exercise and play time
      • Grooming if needed (brushing, nail check)
      • Clean litter box/cage as needed
      • Observe behavior for any changes

      **Weekly Tasks:**
      • Thorough cleaning of living areas
      • Weigh pet to monitor health
      • Check and rotate toys
      • Deep grooming session
      • Review and restock supplies

      **Monthly Tasks:**
      • Flea/tick prevention application
      • Deep clean all pet areas
      • Check expiration dates on food/medications
      • Schedule vet appointments if needed
      • Update emergency contact information
      `
    },
    seasonal_care: {
      title: "Seasonal Pet Care Guide 🌤️",
      content: `**Spring Care:**
      • Increase exercise as weather improves
      • Spring cleaning of pet areas
      • Allergy season - watch for reactions
      • Flea/tick season begins - prevention crucial
      • Shedding season - increase grooming

      **Summer Care:**
      • Heat safety - never leave in hot car
      • Provide extra water and shade
      • Exercise during cooler hours
      • Paw protection from hot pavement
      • Pool/beach safety if applicable

      **Fall Care:**
      • Prepare for holiday stress
      • Adjust exercise for shorter days
      • Check heating systems for safety
      • Holiday decorations - pet-proof
      • Cold weather preparation

      **Winter Care:**
      • Cold weather protection
      • Indoor exercise alternatives
      • Holiday food dangers
      • Antifreeze poisoning prevention
      • Dry skin care from heating systems

      **Year-Round Safety:**
      • Pet-proof your home regularly
      • Keep emergency kit updated
      • Maintain consistent routines
      • Monitor for seasonal allergies
      • Adjust care for senior pets
      `
    },
    emergency_care: {
      title: "Pet Emergency Preparedness 🚨",
      content: `**Emergency Kit Essentials:**
      • Pet first aid supplies
      • 3-day supply of food and water
      • Medications and medical records
      • Recent photos of your pet
      • Leash, collar, and ID tags
      • Carrier or crate
      • Emergency contact list

      **Common Emergencies:**
      • Poisoning: Contact vet/poison control immediately
      • Choking: Learn pet Heimlich maneuver
      • Bleeding: Apply pressure, seek vet care
      • Seizures: Keep pet safe, time the seizure
      • Heat stroke: Cool gradually, get to vet
      • Trauma: Minimize movement, transport carefully

      **First Aid Basics:**
      • Wound cleaning and bandaging
      • Temperature taking (normal ranges)
      • CPR for pets (learn proper technique)
      • Recognizing shock symptoms
      • When to induce vomiting (only if instructed)

      **Emergency Contacts:**
      • Regular veterinarian
      • 24-hour emergency vet clinic
      • Pet poison control hotline
      • Pet insurance information
      • Trusted pet sitter/friend
      • Local animal control

      **Prevention Tips:**
      • Pet-proof your home
      • Keep toxic substances secured
      • Regular vet check-ups
      • Maintain current vaccinations
      • Learn your pet's normal behavior
      `
    },
    bonding: {
      title: "Building Strong Pet Bonds 💕",
      content: `**Daily Bonding Activities:**
      • Quality one-on-one time
      • Gentle petting and massage
      • Interactive play sessions
      • Training and learning together
      • Quiet cuddle time

      **Communication Skills:**
      • Learn your pet's body language
      • Respond to their needs promptly
      • Use consistent commands and cues
      • Respect their boundaries
      • Positive reinforcement always

      **Trust Building:**
      • Be patient and consistent
      • Never use punishment
      • Create positive associations
      • Respect their space when needed
      • Be predictable in your actions

      **Enrichment Together:**
      • Explore new places safely
      • Try new activities
      • Meet new people and pets
      • Learn new tricks together
      • Create routines they enjoy

      **Special Moments:**
      • Morning greetings
      • Bedtime routines
      • Celebration of good behavior
      • Comfort during stressful times
      • Simply being present and attentive
      `
    }
  }
};

// Cart Manager Class
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.updateUI();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('petShopCart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('petShopCart', JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    this.saveCart();
    this.updateUI();
    this.showNotification(`Added ${product.name} to cart`);
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateUI();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateUI();
  }

  updateUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = this.getItemCount();
      cartCount.style.display = this.getItemCount() > 0 ? 'flex' : 'none';
    }
    
    this.renderCartItems();
  }

  renderCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-price');
    
    if (!cartItems || !cartTotal) return;

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <p>🛒 Your cart is empty</p>
          <small>Start shopping to add items here</small>
        </div>
      `;
      cartTotal.textContent = '$0.00';
      return;
    }

    cartItems.innerHTML = this.cart.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="qty-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            <button class="remove-item" onclick="cartManager.removeItem('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// AI Chatbot Class
class AIChatbot {
  constructor() {
    console.log('AIChatbot constructor called');
    
    this.elements = {
      chatBubble: document.querySelector('.chat-bubble'),
      chatBox: document.querySelector('.ai-chatbox'),
      closeBtn: document.querySelector('.close-btn'),
      minimizeBtn: document.querySelector('.minimize-btn'),
      chatInput: document.getElementById('chatInput'),
      sendBtn: document.querySelector('.send-btn'),
      chatBody: document.querySelector('.chat-body'),
      cartBtn: document.querySelector('.cart-btn'),
      miniCart: document.querySelector('.mini-cart'),
      cartOverlay: document.querySelector('.cart-overlay'),
      cartClose: document.querySelector('.cart-close'),
      checkoutBtn: document.querySelector('.checkout-btn')
    };

    console.log('Chat elements found:', this.elements);
    this.isOpen = false;
    this.isMinimized = false;
    
    this.init();
    console.log('AIChatbot initialized successfully!');
  }

  init() {
    // Event listeners
    this.elements.chatBubble?.addEventListener('click', () => this.toggleChat());
    this.elements.closeBtn?.addEventListener('click', () => this.closeChat());
    this.elements.minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
    this.elements.sendBtn?.addEventListener('click', () => this.sendMessage());
    this.elements.chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    this.elements.cartBtn?.addEventListener('click', () => this.toggleCart());
    this.elements.cartClose?.addEventListener('click', () => this.closeCart());
    this.elements.cartOverlay?.addEventListener('click', () => this.closeCart());
    this.elements.checkoutBtn?.addEventListener('click', () => this.checkout());

    // Quick suggestion buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const message = e.target.textContent;
        this.elements.chatInput.value = message;
        this.sendMessage();
      });
    });

    // Add initial welcome message
    this.addBotMessage("Hello! 🐾 I'm your pet care assistant. I can help you find the perfect products for your furry friends or provide expert pet care advice. What can I help you with today?");
    
    // Show quick suggestions
    this.showQuickSuggestions();
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.elements.chatBox.classList.remove('hidden');
    this.elements.chatBubble.style.display = 'none';
    this.isOpen = true;
    this.elements.chatInput?.focus();
  }

  closeChat() {
    this.elements.chatBox.classList.add('hidden');
    this.elements.chatBubble.style.display = 'flex';
    this.isOpen = false;
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.elements.chatBox.classList.toggle('minimized');
  }

  toggleCart() {
    if (this.elements.miniCart.classList.contains('hidden')) {
      this.openCart();
    } else {
      this.closeCart();
    }
  }

  openCart() {
    this.elements.miniCart.classList.remove('hidden');
    this.elements.cartOverlay.classList.remove('hidden');
  }

  closeCart() {
    this.elements.miniCart.classList.add('hidden');
    this.elements.cartOverlay.classList.add('hidden');
  }

  addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-msg';
    messageDiv.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div class="msg-content">${message}</div>
    `;
    this.elements.chatBody.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-msg';
    messageDiv.innerHTML = `
      <div class="msg-avatar">🐾</div>
      <div class="msg-content">${message}</div>
    `;
    this.elements.chatBody.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addProductCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'bot-msg';
    cardDiv.innerHTML = `
      <div class="msg-avatar">🐾</div>
      <div class="msg-content">
        <div class="product-card">
          <div class="product-card-header">
            <img src="${product.thumbnail}" alt="${product.name}" class="product-image">
            <div class="product-info">
              <h4>${product.name}</h4>
              <div class="product-price">$${product.price.current.toFixed(2)}</div>
              <div class="product-rating">⭐ ${product.rating.avg}/5 (${product.rating.count} reviews)</div>
              <div class="product-category">${product.category}</div>
            </div>
          </div>
          <button class="add-to-cart-btn" onclick="aiChatbot.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    this.elements.chatBody.appendChild(cardDiv);
    this.scrollToBottom();
  }

  addAdviceCard(advice) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'bot-msg';
    cardDiv.innerHTML = `
      <div class="msg-avatar">🐾</div>
      <div class="msg-content">
        <div class="advice-card">
          <div class="advice-title">${advice.title}</div>
          <div class="advice-content">${advice.content}</div>
          <ul class="advice-tips">
            ${advice.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    this.elements.chatBody.appendChild(cardDiv);
    this.scrollToBottom();
  }

  showQuickSuggestions() {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'quick-suggestions';
    suggestionsDiv.innerHTML = `
      <button class="quick-btn">🐕 Dog food under $30</button>
      <button class="quick-btn">🐈 Cat grooming tips</button>
      <button class="quick-btn">🐶 Puppy training help</button>
      <button class="quick-btn">🛍️ Best pet toys</button>
    `;
    this.elements.chatBody.appendChild(suggestionsDiv);
    this.scrollToBottom();
  }

  addToCart(product) {
    // Create a simplified product object for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price.current,
      image: product.thumbnail
    };
    cartManager.addItem(cartProduct);
    this.addBotMessage(`Great choice! I've added ${product.name} to your cart. 🛒`);
  }

  async sendMessage() {
    const message = this.elements.chatInput.value.trim();
    console.log('sendMessage called with:', message);
    if (!message) return;

    this.addUserMessage(message);
    this.elements.chatInput.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Process the query
    console.log('Processing query:', message);
    await this.processQuery(message);
    
    // Hide typing indicator
    this.hideTypingIndicator();
  }

  showTypingIndicator() {
    this.typingDiv = document.createElement('div');
    this.typingDiv.className = 'bot-msg typing-indicator';
    this.typingDiv.innerHTML = `
      <div class="msg-avatar">🐾</div>
      <div class="msg-content">
        <div class="loading"></div>
      </div>
    `;
    this.elements.chatBody.appendChild(this.typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    if (this.typingDiv) {
      this.typingDiv.remove();
      this.typingDiv = null;
    }
  }

  async processQuery(message) {
    console.log('processQuery called with:', message);
    try {
      // First try to detect intent locally
      const intent = this.detectIntent(message);
      console.log('Detected intent:', intent);
      
      if (intent.type === 'product_search') {
        console.log('Handling as product search');
        this.handleProductSearch(intent);
      } else if (intent.type === 'advice_request') {
        console.log('Handling as advice request');
        this.handleAdviceRequest(intent);
      } else {
        // If intent is unclear, try Gemini API if available
        if (GEMINI.API_KEY) {
          console.log('Calling Gemini API');
          await this.callGeminiAPI(message);
        } else {
          console.log('Handling as fallback query');
          this.handleFallbackQuery(message);
        }
      }
    } catch (error) {
      console.error('Error processing query:', error);
      this.addBotMessage("I'm sorry, I encountered an error. Please try again or ask me something else.");
    }
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Enhanced animal detection with more patterns
    let animal = null;
    const animalPatterns = {
      dog: ['dog', 'dogs', 'puppy', 'puppies', 'pooch', 'canine', 'chó', 'cún', 'chó con'],
      cat: ['cat', 'cats', 'kitten', 'kittens', 'kitty', 'feline', 'mèo', 'mèo con'],
      rabbit: ['rabbit', 'rabbits', 'bunny', 'bunnies', 'hare', 'thỏ', 'con thỏ'],
      bird: ['bird', 'birds', 'parrot', 'canary', 'budgie', 'chim', 'vẹt'],
      fish: ['fish', 'fishes', 'goldfish', 'betta', 'aquarium', 'cá', 'cá cảnh']
    };
    
    for (const [animalType, patterns] of Object.entries(animalPatterns)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        animal = animalType;
        break;
      }
    }

    // Enhanced product category detection
    let category = null;
    const categoryPatterns = {
      food: ['food', 'feed', 'feeding', 'eat', 'diet', 'nutrition', 'thức ăn', 'ăn uống'],
      toys: ['toy', 'toys', 'play', 'playing', 'game', 'fun', 'entertainment', 'đồ chơi'],
      grooming: ['groom', 'grooming', 'brush', 'brushing', 'bath', 'clean', 'hygiene', 'chăm sóc', 'tắm'],
      treats: ['treat', 'treats', 'snack', 'reward', 'biscuit', 'đồ ăn vặt'],
      beds: ['bed', 'beds', 'sleep', 'sleeping', 'rest', 'mat', 'blanket', 'giường', 'nệm'],
      health: ['health', 'healthy', 'medicine', 'vitamin', 'supplement', 'sức khỏe', 'thuốc'],
      accessories: ['collar', 'leash', 'harness', 'bowl', 'carrier', 'phụ kiện', 'vòng cổ']
    };
    
    for (const [catType, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        category = catType;
        break;
      }
    }

    // Enhanced price range detection
    let priceRange = null;
    const pricePatterns = [
      /\$(\d+)/,
      /under\s*\$(\d+)/,
      /less\s+than\s+\$(\d+)/,
      /below\s+\$(\d+)/,
      /(\d+)\s*dollars?/,
      /(\d+)k/,
      /budget\s+of\s+\$(\d+)/
    ];
    
    for (const pattern of pricePatterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        let maxPrice = parseInt(match[1]);
        if (match[0].includes('k')) {
          maxPrice *= 1000;
        }
        priceRange = { min: 0, max: maxPrice };
        break;
      }
    }

    // Enhanced advice type detection with more comprehensive patterns
    let adviceType = null;
    const advicePatterns = {
      grooming: [
        'groom', 'grooming', 'brush', 'brushing', 'bath', 'bathing', 'shampoo', 
        'hair', 'fur', 'coat', 'nail', 'nails', 'trim', 'clean', 'hygiene',
        'tắm', 'chải', 'lông', 'móng', 'vệ sinh'
      ],
      nutrition: [
        'feed', 'feeding', 'food', 'nutrition', 'diet', 'eat', 'eating', 'meal', 
        'meals', 'portion', 'water', 'drink', 'hungry', 'weight', 'obesity',
        'ăn', 'thức ăn', 'nước', 'khẩu phần', 'dinh dưỡng'
      ],
      training: [
        'train', 'training', 'teach', 'teaching', 'learn', 'learning', 'behavior', 
        'behaviors', 'obedience', 'command', 'commands', 'trick', 'tricks',
        'huấn luyện', 'dạy', 'học', 'cách', 'lệnh'
      ],
      exercise: [
        'exercise', 'walk', 'walking', 'run', 'running', 'play', 'playing', 
        'activity', 'activities', 'sport', 'energy', 'fitness', 'walks',
        'tập thể dục', 'đi dạo', 'chạy', 'chơi', 'vận động'
      ],
      health: [
        'health', 'healthy', 'sick', 'illness', 'disease', 'medicine', 'vet', 
        'veterinarian', 'vaccine', 'vaccination', 'symptom', 'symptoms', 
        'checkup', 'check up', 'emergency', 'sức khỏe', 'bệnh', 'thú y', 'khám'
      ],
      housing: [
        'house', 'housing', 'home', 'cage', 'tank', 'aquarium', 'bed', 'beds', 
        'environment', 'setup', 'room', 'space', 'shelter', 'litter', 'box',
        'nhà', 'chuồng', 'chuồng', 'bể', 'môi trường', 'chỗ ở'
      ]
    };
    
    for (const [adviceCat, patterns] of Object.entries(advicePatterns)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        adviceType = adviceCat;
        break;
      }
    }

    // Enhanced intent type determination with more sophisticated logic
    let type = 'unknown';
    
    // Check for specific product-related keywords
    const productKeywords = [
      'buy', 'purchase', 'shop', 'shopping', 'product', 'products', 'store', 
      'available', 'recommend', 'suggestion', 'show me', 'find', 'looking',
      'mua', 'mua sắm', 'sản phẩm', 'cửa hàng', 'giới thiệu', 'tìm'
    ];
    
    // Check for advice-related keywords
    const adviceKeywords = [
      'advice', 'tips', 'help', 'guide', 'how to', 'what should', 'care', 
      'caring', 'tips', 'information', 'info', 'tell me', 'explain',
      'tư vấn', 'mẹo', 'hướng dẫn', 'làm sao', 'chăm sóc', 'thông tin'
    ];
    
    // Determine primary intent with better logic
    const hasProductIntent = productKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasAdviceIntent = adviceKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasProductIntent || category || priceRange) {
      type = 'product_search';
    } else if (hasAdviceIntent || adviceType) {
      type = 'advice_request';
    } else if (animal && !category && !priceRange) {
      // If only animal is mentioned, assume advice request
      type = 'advice_request';
    }

    return { type, animal, category, priceRange, adviceType };
  }

  handleProductSearch(intent) {
    let products = [...window.PRODUCTS_DATA];

    // Filter by animal (detect from category)
    if (intent.animal) {
      if (intent.animal === 'dog') {
        products = products.filter(p => p.category.toLowerCase().includes('dog'));
      } else if (intent.animal === 'cat') {
        products = products.filter(p => p.category.toLowerCase().includes('cat'));
      } else if (intent.animal === 'puppy') {
        products = products.filter(p => p.category.toLowerCase().includes('dog') && (p.lifeStage === 'Puppy' || p.lifeStage === 'All'));
      }
    }

    // Filter by category
    if (intent.category) {
      if (intent.category === 'food') {
        products = products.filter(p => p.type === 'food');
      } else if (intent.category === 'toys') {
        products = products.filter(p => p.type === 'toy');
      } else if (intent.category === 'grooming') {
        products = products.filter(p => p.category.toLowerCase().includes('grooming'));
      }
    }

    // Filter by price range
    if (intent.priceRange) {
      products = products.filter(p => p.price.current <= intent.priceRange.max);
    }

    // Sort by rating
    products.sort((a, b) => b.rating.avg - a.rating.avg);

    if (products.length === 0) {
      this.addBotMessage("I couldn't find any products matching your criteria. Try adjusting your search or ask me for recommendations!");
      return;
    }

    const animalText = intent.animal ? `${intent.animal} ` : '';
    const categoryText = intent.category ? `${intent.category} ` : '';
    const priceText = intent.priceRange ? `under $${intent.priceRange.max} ` : '';
    
    this.addBotMessage(`I found ${products.length} ${animalText}${categoryText}products ${priceText}for you:`);
    
    // Show top 3 products
    products.slice(0, 3).forEach(product => {
      this.addProductCard(product);
    });

    if (products.length > 3) {
      this.addBotMessage(`And ${products.length - 3} more options available! Ask me to see more or refine your search.`);
    }
  }

  handleAdviceRequest(intent) {
    const adviceCategory = intent.adviceType;
    const animalType = intent.animal;
    
    let advice = null;
    
    // First try to find specific advice for animal + category combination
    if (adviceCategory && animalType && PET_CARE_ADVICE[animalType] && PET_CARE_ADVICE[animalType][adviceCategory]) {
      advice = PET_CARE_ADVICE[animalType][adviceCategory];
    }
    // If not found, try general advice for the animal type
    else if (animalType && PET_CARE_ADVICE[animalType]) {
      // If we have the animal but no specific category, provide overview
      const animalData = PET_CARE_ADVICE[animalType];
      const categories = Object.keys(animalData);
      
      let overviewMessage = `**${animalType.charAt(0).toUpperCase() + animalType.slice(1)} Care Complete Guide** 🐾\n\n`;
      overviewMessage += `I have comprehensive care information for ${animalType}s. Here are the main care categories:\n\n`;
      
      categories.forEach(category => {
        const categoryData = animalData[category];
        if (categoryData && categoryData.title) {
          overviewMessage += `**${categoryData.title}**\n`;
          if (categoryData.content) {
            // Show first few lines of content
            const contentPreview = categoryData.content.split('\n').slice(0, 3).join('\n');
            overviewMessage += `${contentPreview}\n\n`;
          }
        }
      });
      
      overviewMessage += `Ask me about any specific aspect of ${animalType} care for detailed information!`;
      this.addBotMessage(overviewMessage);
      return;
    }
    // Try general pet care tips
    else if (adviceCategory && PET_CARE_ADVICE.general && PET_CARE_ADVICE.general[adviceCategory]) {
      advice = PET_CARE_ADVICE.general[adviceCategory];
    }
    
    if (advice && advice.title && advice.content) {
      this.addBotMessage(`**${advice.title}**\n\n${advice.content}`);
      this.addBotMessage("Is there anything specific about this topic you'd like to know more about?");
    } else {
      // Provide comprehensive general advice
      const generalAdvice = `**Comprehensive Pet Care Guide** 🐾\n\n` +
        `I can provide detailed care information for dogs, cats, rabbits, birds, and fish.\n\n` +
        `**Available Care Categories:**\n` +
        `• **Grooming**: Daily routines, professional care, seasonal needs\n` +
        `• **Nutrition**: Feeding schedules, portion control, special diets\n` +
        `• **Training**: Basic commands, behavior modification, problem solving\n` +
        `• **Exercise**: Daily requirements, activity types, safety tips\n` +
        `• **Health**: Daily monitoring, preventive care, emergency signs\n` +
        `• **Housing**: Environment setup, enrichment, safety\n\n` +
        `**Try asking me:**\n` +
        `• "Show me dog grooming tips"\n` +
        `• "How do I train my cat?"\n` +
        `• "What should I feed my rabbit?"\n` +
        `• "Tell me about bird health care"\n` +
        `• "Give me fish tank maintenance tips"\n\n` +
        `For specific advice, just tell me what type of pet you have and what you'd like to know!`;
      
      this.addBotMessage(generalAdvice);
    }
  }

  handleFallbackQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced fallback responses based on common pet-related questions
    const fallbackResponses = {
      // Greeting responses
      greeting: [
        "Hello! 👋 I'm your AI pet care assistant. I can help you find pet products and provide expert care advice. Try asking me 'Show me dog food' or 'How do I care for my cat?'",
        "Hi there! 🐾 I'm here to help with all your pet needs. What can I assist you with today?",
        "Welcome! I'm your pet care expert. Ask me about products, care tips, or anything pet-related!"
      ],
      
      // Time-related questions
      time: [
        "The best time to feed pets is usually morning and evening, but it depends on your pet's specific needs. Would you like feeding schedule advice for a particular pet?",
        "Exercise timing varies by pet type - dogs often need morning and evening walks, while cats are more flexible. Let me know what pet you have!"
      ],
      
      // Emergency questions
      emergency: [
        "🚨 If this is a pet emergency, please contact your veterinarian or emergency animal hospital immediately. For general health advice, I can help guide you.",
        "For urgent pet health concerns, always contact your vet first. I can provide general health information to help you understand common issues."
      ],
      
      // General pet care
      general: [
        "I can provide comprehensive pet care advice for dogs, cats, rabbits, birds, and fish! Try asking me about grooming, nutrition, training, exercise, health, or housing for any pet type.",
        "**Pet Care Categories I Cover:** 🐾\n• Grooming & Hygiene\n• Nutrition & Feeding\n• Training & Behavior\n• Exercise & Activity\n• Health & Wellness\n• Housing & Environment\n\nJust tell me your pet type and what you'd like to know!",
        "I'm here to help with all aspects of pet care! Whether you need product recommendations or care advice, just let me know what pet you have and what you're looking for."
      ],
      
      // Product recommendations
      products: [
        "I can help you find the perfect products for your pet! Try asking me 'Show me dog food under $30' or 'What toys do you recommend for cats?'",
        "Looking for pet products? I can search by pet type, category, and price range. Just tell me what you need!"
      ]
    };
    
    // Determine which type of response to give based on message content
    let responseType = 'general';
    
    // Check for greetings
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'chào', 'xin chào'];
    if (greetings.some(greeting => lowerMessage.includes(greeting))) {
      responseType = 'greeting';
    }
    
    // Check for time-related questions
    const timeWords = ['time', 'when', 'schedule', 'hour', 'day', 'giờ', 'lúc nào', 'thời gian'];
    if (timeWords.some(word => lowerMessage.includes(word))) {
      responseType = 'time';
    }
    
    // Check for emergency keywords
    const emergencyWords = ['emergency', 'urgent', 'help', 'sick', 'dying', 'critical', 'accident', 'poison', 'cấp cứu', 'khẩn cấp'];
    if (emergencyWords.some(word => lowerMessage.includes(word))) {
      responseType = 'emergency';
    }
    
    // Check for product-related words
    const productWords = ['product', 'buy', 'shop', 'store', 'recommend', 'suggestion', 'mua', 'sản phẩm'];
    if (productWords.some(word => lowerMessage.includes(word))) {
      responseType = 'products';
    }
    
    // Select random response from appropriate category
    const responses = fallbackResponses[responseType] || fallbackResponses.general;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    this.addBotMessage(randomResponse);
    
    // Always follow up with helpful suggestions
    const helpfulSuggestions = [
      "**Quick Examples:**\n• 'Show me cat food under $25'\n• 'How do I train my puppy?'\n• 'What grooming tools for rabbits?'\n• 'Tell me about bird health'",
      "**Popular Questions:**\n• 'Best food for senior dogs'\n• 'How often to feed cats'\n• 'Exercise tips for indoor cats'\n• 'Fish tank maintenance'"
    ];
    
    // Add suggestions after a short delay
    setTimeout(() => {
      const randomSuggestion = helpfulSuggestions[Math.floor(Math.random() * helpfulSuggestions.length)];
      this.addBotMessage(randomSuggestion);
    }, 1000);
  }

  async callGeminiAPI(message) {
    try {
      // Check if API key is valid
      if (!GEMINI.API_KEY || GEMINI.API_KEY === "AIzaSyAAnuKSMjpJvg33_1gqquiIlfaXhV-3PsQ") {
        this.handleFallbackQuery(message);
        return;
      }

      const prompt = this.buildGeminiPrompt(message);
      const response = await fetch(`${GEMINI.ENDPOINT}${GEMINI.MODEL}:generateContent?key=${GEMINI.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        console.log('Gemini API failed, falling back to local logic');
        this.handleFallbackQuery(message);
        return;
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        this.addBotMessage(aiResponse);
      } else {
        this.handleFallbackQuery(message);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      this.handleFallbackQuery(message);
    }
  }

  buildGeminiPrompt(message) {
    return `You are a helpful pet shop assistant. The user asked: "${message}"

Please provide a helpful response. If they're asking about products, suggest relevant pet products. If they're asking for advice, provide helpful pet care tips. Keep your response friendly and concise.

Available product categories: food, toys, grooming, treats, beds for dogs, cats, rabbits, birds, and fish.

If suggesting products, mention that you can show them specific items with prices and let them add to cart.`;
  }

  checkout() {
    this.addBotMessage("🎉 Great! Your order has been placed successfully. You'll receive a confirmation email shortly. Thank you for shopping with us!");
    cartManager.clearCart();
    this.closeCart();
  }

  scrollToBottom() {
    this.elements.chatBody.scrollTop = this.elements.chatBody.scrollHeight;
  }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing chatbot...');
  
  // Wait for products data to be available
  const initializeChatbot = () => {
    console.log('Checking for PRODUCTS_DATA...');
    console.log('PRODUCTS_DATA available:', !!window.PRODUCTS_DATA);
    console.log('PRODUCTS_DATA length:', window.PRODUCTS_DATA ? window.PRODUCTS_DATA.length : 'undefined');
    
    if (window.PRODUCTS_DATA && window.PRODUCTS_DATA.length > 0) {
      console.log('Products data found, initializing components...');
      
      // Initialize cart manager
      window.cartManager = new CartManager();
      console.log('CartManager initialized');
      
      // Initialize AI chatbot
      window.aiChatbot = new AIChatbot();
      console.log('AIChatbot initialized');
      
      // Add cart notification styles
      const style = document.createElement('style');
      style.textContent = `
        .cart-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4d2b12;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 1003;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(77, 43, 18, 0.3);
        }
        .cart-notification.show {
          transform: translateX(0);
        }
      `;
      document.head.appendChild(style);
      console.log('Chatbot initialization complete!');
    } else {
      console.log('Products data not available, retrying...');
      // Retry after a short delay if products data is not yet available
      setTimeout(initializeChatbot, 100);
    }
  };
  
  initializeChatbot();
});
