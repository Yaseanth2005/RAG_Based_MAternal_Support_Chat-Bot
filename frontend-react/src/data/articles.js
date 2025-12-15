import { Heart, Baby, Apple, Pill, Brain, AlertCircle, Droplets, Dumbbell } from 'lucide-react';

export const articles = [
  {
    id: 'pregnancy-cycle',
    title: 'Pregnancy Cycle',
    icon: Heart,
    color: 'var(--color-pink-100)',
    textColor: 'var(--color-pink-700)',
    description: 'Understanding the stages of pregnancy from conception to birth.',
    content: {
      overview: 'Pregnancy typically lasts about 40 weeks and is divided into three trimesters. Each trimester brings its own set of changes for your body and your growing baby. Knowing what is normal in each phase can help you recognise when something needs attention, plan appointments, and feel more confident throughout the journey. While every pregnancy is unique, following general patterns can make the experience feel less overwhelming and more predictable.',
      keyPoints: [
        'First Trimester (0–13 weeks): Rapid development of major organs; nausea and fatigue are common for you.',
        'Second Trimester (14–26 weeks): Many people feel more energetic; you may first notice baby movements.',
        'Third Trimester (27–40 weeks): Baby gains weight, lungs mature, and your body prepares for labour and birth.'
      ],
      dosAndDonts: {
        dos: [
          'Take a daily prenatal vitamin with folic acid as advised by your clinician.',
          'Attend all scheduled prenatal visits and recommended screening tests.',
          'Stay hydrated and choose small, frequent meals to ease nausea.'
        ],
        donts: [
          'Smoke, drink alcohol, or use recreational drugs during pregnancy.',
          'Eat raw or undercooked meat, fish, or eggs, or unpasteurised dairy products.',
          'Ignore sudden changes in symptoms, such as severe pain or bleeding.'
        ]
      },
      warningSigns: [
        'Heavy vaginal bleeding, severe abdominal pain, or sudden gush of fluid from the vagina.',
        'Severe headache, vision changes, swelling of face/hands, or shortness of breath.',
        'Significantly decreased or absent fetal movements after you have been feeling them regularly.'
      ],
      tips: [
        'Keep a simple pregnancy journal or app log of symptoms, baby movements, and questions for your visits.',
        'Prepare a list of emergency contacts (clinic, hospital, support person) and keep it visible at home.',
        'Build a small support team—partner, family, or friends—who can help with appointments and daily tasks.'
      ],
      references: [
        { title: 'CDC: Planning for Pregnancy', url: 'https://www.cdc.gov/preconception/planning.html' },
        { title: 'WHO: Maternal Health', url: 'https://www.who.int/health-topics/maternal-health' },
        { title: 'WomensHealth.gov: Stages of Pregnancy', url: 'https://www.womenshealth.gov/pregnancy/you-are-pregnant/stages-pregnancy' }
      ]
    }
  },
  {
    id: 'child-care',
    title: 'Child Care',
    icon: Baby,
    color: 'var(--color-blue-100)',
    textColor: 'var(--color-blue-700)',
    description: 'Essential tips for newborn care and early development.',
    content: {
      overview: 'Caring for a newborn is a blend of practical tasks and emotional connection. In the first months, most of your time will be spent feeding, soothing, and helping your baby sleep, while also recovering from birth yourself. There is no single “right” way to parent; instead, small, consistent, responsive actions help your baby feel safe and secure. Learning to read your baby’s cues takes time and practice, and it is completely normal to need support.',
      keyPoints: [
        'Newborns often sleep 14–17 hours per day, but in short stretches of 2–4 hours.',
        'Responsive feeding (breast or formula) based on hunger cues supports growth and bonding.',
        'Supervised tummy time from birth strengthens neck, shoulder, and core muscles.'
      ],
      dosAndDonts: {
        dos: [
          'Place baby on their back to sleep on a firm, flat surface with no loose bedding (Safe Sleep).',
          'Wash or sanitise hands before feeding or handling baby, especially after changing nappies.',
          'Respond to crying with calm comfort—over time you will learn different cries and cues.'
        ],
        donts: [
          'Use soft pillows, bumpers, or stuffed toys in the crib or bassinet.',
          'Shake the baby at any time; gentle rocking is fine, vigorous shaking is dangerous.',
          'Expose baby to second-hand smoke or vaping indoors or in the car.'
        ]
      },
      warningSigns: [
        'Baby has difficulty breathing, grunts, or has flaring nostrils or chest pulling in with breaths.',
        'Persistent fever, poor feeding, or fewer wet nappies than usual.',
        'Very floppy or very rigid muscles, or unusually difficult to wake.'
      ],
      tips: [
        'Create a simple bedside caddy with nappies, wipes, spare clothes, and burp cloths for night-time care.',
        'Ask trusted visitors to help with chores instead of expecting to host them.',
        'Use safe baby-wearing or skin‑to‑skin contact to soothe baby while keeping your hands free.'
      ],
      references: [
        { title: 'CDC: Learn the Signs. Act Early.', url: 'https://www.cdc.gov/ncbddd/actearly/index.html' },
        { title: 'UNICEF: Parenting Tips', url: 'https://www.unicef.org/parenting/' },
        { title: 'HealthyChildren.org (AAP)', url: 'https://www.healthychildren.org/' }
      ]
    }
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    icon: Apple,
    color: 'var(--color-green-100)',
    textColor: 'var(--color-green-700)',
    description: 'Healthy eating habits for you and your growing baby.',
    content: {
      overview: 'A balanced, enjoyable eating pattern during pregnancy supports both your baby’s development and your own energy levels. Rather than “eating for two,” most people only need a modest increase in calories in the second and third trimesters, with a greater focus on nutrient-dense foods. Small, frequent meals, gentle movement, and listening to your body’s hunger and fullness cues can reduce discomforts like nausea and heartburn.',
      keyPoints: [
        'Folic acid before and early in pregnancy helps prevent neural tube defects.',
        'Iron supports red blood cell production and helps prevent anaemia and fatigue.',
        'Calcium and vitamin D are essential for strong bones and teeth for both you and baby.'
      ],
      dosAndDonts: {
        dos: [
          'Build meals around vegetables, fruits, whole grains, lean protein, and healthy fats.',
          'Include iron‑rich foods (beans, lentils, leafy greens, lean meats) and pair with vitamin C‑rich foods to enhance absorption.',
          'Limit caffeine to the amount recommended by your clinician, often around 200 mg per day.'
        ],
        donts: [
          'Eat high‑mercury fish such as shark, swordfish, king mackerel, or tilefish.',
          'Consume unpasteurised milk, soft cheeses made with unpasteurised milk, or raw sprouts.',
          'Skip meals regularly, especially if you feel light‑headed or weak.'
        ]
      },
      warningSigns: [
        'Persistent vomiting that prevents you from keeping down food or fluids (possible hyperemesis gravidarum).',
        'Signs of dehydration: very dark urine, dizziness, or inability to urinate regularly.',
        'Sudden, severe swelling, headache, or visual changes which may be linked to high blood pressure.'
      ],
      tips: [
        'Keep simple snacks like nuts, yoghurt, and fruit handy for when nausea eases and you feel briefly hungry.',
        'Drink water throughout the day; some people find sipping with a straw more comfortable.',
        'Discuss any special diets (vegan, vegetarian, gluten‑free) with a clinician or dietitian to ensure you meet nutrient needs.'
      ],
      references: [
        { title: 'WHO: Nutrition Counseling during Pregnancy', url: 'https://www.who.int/elena/titles/nutrition_counselling_pregnancy/en/' },
        { title: 'ACOG: Nutrition During Pregnancy', url: 'https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy' },
        { title: 'Mayo Clinic: Pregnancy Diet', url: 'https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy-nutrition/art-20045082' }
      ]
    }
  },
  {
    id: 'drug-awareness',
    title: 'Drug Awareness',
    icon: Pill,
    color: 'var(--color-purple-100)',
    textColor: 'var(--color-purple-700)',
    description: 'Safety guidelines for medications and substances.',
    content: {
      overview: 'Many medicines, supplements, and recreational substances can cross the placenta and affect your baby. Some prescription medicines are important and should be continued in pregnancy, while others may need adjustment or substitution. Because safety information can be complex and sometimes conflicting online, it is crucial to talk with a qualified clinician before starting, stopping, or changing any medication.',
      keyPoints: [
        'Some prescription medications have well‑studied safety profiles in pregnancy; others do not.',
        'Alcohol, tobacco, and recreational drugs such as cocaine or methamphetamine are unsafe in pregnancy.',
        'Herbal products and “natural” supplements are not automatically safe and may interact with medications.'
      ],
      dosAndDonts: {
        dos: [
          'Provide your clinician with an up‑to‑date list of all medicines, supplements, and herbal products you use.',
          'Use one pharmacy when possible so the pharmacist can check for interactions.',
          'Ask specifically about over‑the‑counter pain relievers, cold remedies, and sleep aids before using them.'
        ],
        donts: [
          'Stop prescribed medications on your own without consulting the prescriber.',
          'Use someone else’s prescription, even if you have similar symptoms.',
          'Assume CBD, THC, or other cannabis products are safe in pregnancy; follow medical guidance instead.'
        ]
      },
      warningSigns: [
        'Taking a medication and then developing rash, trouble breathing, or swelling of the face/lips (emergency allergic reaction).',
        'Accidental overdose or repeated doses beyond what was prescribed.',
        'Sudden change in mental status, extreme sleepiness, or confusion after starting a new medication.'
      ],
      tips: [
        'Keep a written or digital medication list and bring it to every appointment, including emergency visits.',
        'Store all medicines and supplements in their original containers and out of reach of children.',
        'If you are unsure about a product, pause and ask your clinician, pharmacist, or a teratogen information service before using it.'
      ],
      references: [
        { title: 'FDA: Medicine and Pregnancy', url: 'https://www.fda.gov/consumers/women/medicine-and-pregnancy' },
        { title: 'CDC: Treating for Two', url: 'https://www.cdc.gov/pregnancy/meds/treatingfortwo/index.html' },
        { title: 'MotherToBaby', url: 'https://mothertobaby.org/' }
      ]
    }
  },
  {
    id: 'mental-health',
    title: 'Mental Health',
    icon: Brain,
    color: 'var(--color-teal-100)',
    textColor: 'var(--color-teal-700)',
    description: 'Caring for your emotional well-being during pregnancy.',
    content: {
      overview: 'Pregnancy and the postpartum period are times of major emotional as well as physical change. It is normal to experience mood shifts, fears, and moments of feeling overwhelmed, but persistent sadness, anxiety, or loss of interest in usual activities may signal a mood or anxiety disorder. Perinatal mental health conditions are common and highly treatable, and seeking help is a sign of strength—not weakness.',
      keyPoints: [
        'Perinatal depression and anxiety affect many parents worldwide and can occur during pregnancy or after birth.',
        'Hormonal shifts, sleep disruption, and life stressors all influence mood.',
        'Early support from professionals, partners, family, and peers improves outcomes for both parent and baby.'
      ],
      dosAndDonts: {
        dos: [
          'Talk openly with trusted people about your feelings, even if they are mixed or difficult.',
          'Prioritise sleep where possible and accept help with night feeds or household tasks.',
          'Reach out to a clinician, therapist, or helpline if mood symptoms last more than two weeks or interfere with daily life.'
        ],
        donts: [
          'Isolate yourself or assume you must cope alone; mental health support is part of routine perinatal care.',
          'Blame yourself for intrusive thoughts, sadness, or irritability—these are symptoms, not character flaws.',
          'Ignore thoughts of self‑harm or of harming others; these require urgent professional support.'
        ]
      },
      warningSigns: [
        'Persistent sadness, hopelessness, or loss of interest in activities you usually enjoy.',
        'Intense anxiety, racing thoughts, or constant worry that interferes with sleep or caring for yourself.',
        'Thoughts of self‑harm, of not wanting to live, or of harming your baby (seek emergency help immediately).'
      ],
      tips: [
        'Schedule small, realistic acts of self‑care—short walks, gentle stretching, or time with supportive people.',
        'Join a prenatal or new‑parent support group (in person or online) to reduce isolation.',
        'Keep crisis hotline numbers or local emergency contacts written down in an easily visible place.'
      ],
      references: [
        { title: 'NIMH: Perinatal Depression', url: 'https://www.nimh.nih.gov/health/publications/perinatal-depression' },
        { title: 'Postpartum Support International', url: 'https://www.postpartum.net/' },
        { title: 'National Maternal Mental Health Hotline', url: 'https://mchb.hrsa.gov/national-maternal-mental-health-hotline' }
      ]
    }
  },
  {
    id: 'emergency',
    title: 'Emergency',
    icon: AlertCircle,
    color: 'var(--color-red-100)',
    textColor: 'var(--color-red-700)',
    description: 'Warning signs and when to seek immediate help.',
    content: {
      overview: 'Recognising urgent warning signs during pregnancy and after birth can save your life or your baby’s life. Many serious complications start with subtle symptoms that gradually worsen, so it is important to trust your instincts if something feels off. You never need to worry about “bothering” your care team or the emergency department—getting checked early is always safer than waiting.',
      keyPoints: [
        'Severe headache, vision changes, or swelling can signal dangerously high blood pressure.',
        'Heavy bleeding, chest pain, or difficulty breathing are emergencies that require immediate care.',
        'A noticeable decrease in baby’s movements after 28 weeks should be assessed promptly.'
      ],
      dosAndDonts: {
        dos: [
          'Go to the emergency department or call emergency services for heavy bleeding, chest pain, or severe breathing difficulty.',
          'Call your maternity unit or clinician if you notice reduced fetal movements, severe abdominal pain, or persistent contractions.',
          'Keep emergency and labour‑ward numbers saved in your phone and written somewhere visible at home.'
        ],
        donts: [
          'Wait hours to see if severe pain, heavy bleeding, or shortness of breath improves on its own.',
          'Ignore new vision changes, spots in front of your eyes, or sudden swelling of your face or hands.',
          'Drive yourself to hospital if you feel faint, dizzy, or unsteady—ask someone else to drive or call an ambulance.'
        ]
      },
      warningSigns: [
        'Sudden heavy vaginal bleeding, passing clots, or soaking a pad in less than an hour.',
        'Severe headache, visual disturbances, pain in the right upper abdomen, or significant swelling of face/hands.',
        'Chest pain, shortness of breath, or coughing up blood, which may suggest a blood clot.'
      ],
      tips: [
        'Prepare a simple “when to call” checklist from your clinician and keep it on your fridge or phone.',
        'Share key warning signs with your partner, family, or friends so they can help you notice changes.',
        'If you are unsure whether a symptom is serious, call your maternity unit or emergency line and describe it clearly.'
      ],
      references: [
        { title: 'CDC: Urgent Maternal Warning Signs', url: 'https://www.cdc.gov/hearher/maternal-warning-signs/index.html' },
        { title: 'ACOG: Preeclampsia Signs', url: 'https://www.acog.org/womens-health/faqs/preeclampsia-and-high-blood-pressure-during-pregnancy' }
      ]
    }
  },
  {
    id: 'breastfeeding-lactation',
    title: 'Breastfeeding & Lactation',
    icon: Droplets,
    color: 'var(--color-blue-100)',
    textColor: 'var(--color-blue-700)',
    description: 'Getting started with breastfeeding, milk supply, and common challenges.',
    content: {
      overview: 'Breastfeeding is a learned skill for both parent and baby. The first few weeks are often the most intense as you both practise latching, establish milk supply, and recover from birth. Many people experience sore nipples, doubts about milk supply, or pressure from others; none of this means you are failing. With practical support and good information, most breastfeeding challenges can be eased or resolved. Formula feeding is also a safe option, and some families choose to combine methods.',
      keyPoints: [
        'Early and frequent feeding (8–12 times in 24 hours) helps establish milk supply.',
        'A deep, comfortable latch reduces nipple pain and helps baby transfer milk well.',
        'You can combine breastfeeding with expressed milk or formula if that works best for your family.'
      ],
      dosAndDonts: {
        dos: [
          'Offer skin‑to‑skin contact soon after birth and as often as you can in the early days.',
          'Watch baby’s hunger cues—rooting, fist‑sucking, restlessness—rather than waiting for full crying.',
          'Seek early support from a lactation consultant, midwife, or peer counsellor if feeding is painful or stressful.'
        ],
        donts: [
          'Ignore intense or worsening nipple pain; this is a sign that latch or positioning needs adjustment.',
          'Assume you “have no milk” based only on how soft your breasts feel or how much you pump.',
          'Feel guilty if you choose to supplement or switch to formula—fed and safe is what matters most.'
        ]
      },
      warningSigns: [
        'Sharp, burning breast pain with redness, warmth, fever, or flu‑like symptoms (possible mastitis).',
        'Baby has fewer than six wet nappies per day after day five, or seems unusually sleepy and hard to rouse for feeds.',
        'Cracked, bleeding nipples that do not improve with help on positioning or latch.'
      ],
      tips: [
        'Use supportive pillows or a rolled towel to bring baby up to breast height, rather than hunching over baby.',
        'Keep a large water bottle and one‑handed snacks near your usual feeding spot to support hydration and energy.',
        'Practise different positions (laid‑back, side‑lying) to reduce strain on your back, shoulders, and wrists.'
      ],
      references: [
        { title: 'WHO: Breastfeeding', url: 'https://www.who.int/health-topics/breastfeeding' },
        { title: 'La Leche League International', url: 'https://www.llli.org/' },
        { title: 'CDC: Breastfeeding', url: 'https://www.cdc.gov/breastfeeding/index.htm' }
      ]
    }
  },
  {
    id: 'exercise-movement',
    title: 'Exercise & Safe Movement',
    icon: Dumbbell,
    color: 'var(--color-green-100)',
    textColor: 'var(--color-green-700)',
    description: 'Staying active safely during pregnancy and after birth.',
    content: {
      overview: 'Regular, moderate physical activity during pregnancy can improve mood, reduce back pain, support healthy weight gain, and even ease recovery after birth. Unless your clinician advises otherwise, many people can continue or adapt their usual activities with a few precautions. Focus on comfort, breathing, and how your body feels rather than on performance. After birth, returning to movement should be gradual and guided by your recovery and any pelvic floor symptoms.',
      keyPoints: [
        'Most pregnant people are encouraged to aim for around 150 minutes of moderate activity per week.',
        'Low‑impact options like walking, swimming, stationary cycling, and prenatal yoga are often well‑tolerated.',
        'Strength work that targets back, hips, and pelvic floor can reduce aches and prepare for labour and recovery.'
      ],
      dosAndDonts: {
        dos: [
          'Check with your clinician before starting or changing an exercise routine, especially if you have medical conditions.',
          'Warm up gently and cool down with stretching to protect joints and muscles.',
          'Listen to your body; being able to talk while exercising is a good guide to moderate intensity.'
        ],
        donts: [
          'Exercise to the point of exhaustion, breathlessness where you cannot talk, or feeling faint.',
          'Lie flat on your back for long periods after the first trimester if it makes you light‑headed or breathless.',
          'Ignore pelvic pain, leaking urine, or a feeling of heaviness/dragging in the pelvis—these warrant an assessment.'
        ]
      },
      warningSigns: [
        'Chest pain, severe shortness of breath, or sudden dizziness during or after activity.',
        'Painful contractions, vaginal bleeding, or fluid leakage while exercising.',
        'Calf pain or swelling that could indicate a blood clot (seek urgent assessment).'
      ],
      tips: [
        'Break movement into short 10–15 minute sessions throughout the day if longer sessions feel tiring.',
        'Choose supportive footwear and, if needed, a pregnancy‑specific support belt for comfort.',
        'Postpartum, start with gentle walking and pelvic floor exercises; increase intensity only when cleared by a clinician.'
      ],
      references: [
        { title: 'ACOG: Exercise During Pregnancy', url: 'https://www.acog.org/womens-health/faqs/exercise-during-pregnancy' },
        { title: 'RCOG: Physical activity and pregnancy', url: 'https://www.rcog.org.uk/for-the-public/browse-our-patient-information/physical-activity-and-pregnancy/' },
        { title: 'Pelvic Health Physiotherapy Resources', url: 'https://www.apta.org/patient-care/interventions/womens-health' }
      ]
    }
  },
  {
    id: 'postpartum-recovery',
    title: 'Postpartum Recovery',
    icon: Heart,
    color: 'var(--color-pink-100)',
    textColor: 'var(--color-pink-700)',
    description: 'Guidelines for healing and self-care after childbirth.',
    content: {
      overview: 'The postpartum period, often called the "fourth trimester," is a time of intense physical and emotional recovery. Your body is healing from birth, hormones are fluctuating, and you are adapting to life with a newborn. Prioritizing rest, nutrition, and support is just as important now as it was during pregnancy.',
      keyPoints: [
        'Physical recovery takes time; bleeding (lochia) can last up to 6 weeks.',
        'Pelvic floor exercises (Kegels) can help recovery, but start gently.',
        'Emotional ups and downs ("baby blues") are common in the first two weeks.'
      ],
      dosAndDonts: {
        dos: [
          'Rest as much as possible; sleep when the baby sleeps.',
          'Eat nutrient-dense foods to support healing and breastfeeding.',
          'Accept help with household chores and meals.'
        ],
        donts: [
          'Lift heavy objects or engage in strenuous exercise before being cleared.',
          'Ignore fever or severe pain; these could indicate infection.',
          'Hesitate to ask for support if you feel overwhelmed.'
        ]
      },
      warningSigns: [
        'Heavy bleeding (soaking a pad in an hour) or passing large clots.',
        'Fever higher than 100.4°F (38°C) or foul-smelling discharge.',
        'Severe headache, vision changes, or calf pain.'
      ],
      tips: [
        'Use ice packs or witch hazel pads for perineal soreness.',
        'Keep a water bottle and snacks nearby during feeds.',
        'Be patient with yourself; bonding and recovery take time.'
      ],
      references: [
        { title: 'ACOG: Postpartum Care', url: 'https://www.acog.org/womens-health/faqs/postpartum-care' },
        { title: 'Mayo Clinic: Postpartum recovery', url: 'https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/postpartum-care/art-20047233' }
      ]
    }
  },
  {
    id: 'baby-sleep',
    title: 'Baby Sleep Patterns',
    icon: Baby,
    color: 'var(--color-purple-100)',
    textColor: 'var(--color-purple-700)',
    description: 'Understanding newborn sleep and establishing healthy habits.',
    content: {
      overview: 'Newborn sleep is unpredictable and doesn\'t follow adult patterns. Babies have tiny stomachs and need to wake frequently to feed. Understanding sleep cycles and safe sleep practices can help you navigate these exhausting early months.',
      keyPoints: [
        'Newborns sleep 14-17 hours a day but in short bursts.',
        'Night waking is normal and protective against SIDS.',
        'Circadian rhythms (day/night patterns) develop around 3-4 months.'
      ],
      dosAndDonts: {
        dos: [
          'Follow the "Back to Sleep" rule for every nap and night.',
          'Create a calming bedtime routine (bath, book, bed).',
          'Keep the room dark and quiet at night to encourage sleepiness.'
        ],
        donts: [
          'Use loose bedding, pillows, or toys in the crib.',
          'Overheat the baby; a sleep sack is safer than loose blankets.',
          'Expect a newborn to "sleep through the night" immediately.'
        ]
      },
      warningSigns: [
        'Baby is consistently hard to wake for feeds.',
        'Loud snoring or pauses in breathing during sleep.',
        'Excessive irritability or inability to settle despite comfort.'
      ],
      tips: [
        'Swaddling can help soothe the startle reflex in younger babies.',
        'White noise machines can mimic the sounds of the womb.',
        'Take shifts with a partner if possible to get uninterrupted sleep.'
      ],
      references: [
        { title: 'Sleep Foundation: Newborn Sleep', url: 'https://www.sleepfoundation.org/baby-sleep/newborn-sleep-schedule' },
        { title: 'Safe to Sleep', url: 'https://safetosleep.nichd.nih.gov/' }
      ]
    }
  },
  {
    id: 'returning-to-work',
    title: 'Returning to Work',
    icon: Apple,
    color: 'var(--color-teal-100)',
    textColor: 'var(--color-teal-700)',
    description: 'Navigating the transition back to employment.',
    content: {
      overview: 'Returning to work after parental leave is a major transition. It involves logistical planning for childcare, emotional adjustments, and potentially managing breastfeeding or pumping. Preparation and open communication with your employer can smooth the process.',
      keyPoints: [
        'Start planning childcare well in advance.',
        'Practice your new routine with a "trial run" before the first day.',
        'Know your rights regarding breastfeeding and pumping breaks.'
      ],
      dosAndDonts: {
        dos: [
          'Discuss your return plan and schedule with your employer early.',
          'Prepare your clothes and baby\'s bag the night before.',
          'Be kind to yourself; the adjustment period is temporary.'
        ],
        donts: [
          'Feel guilty about working; quality time matters more than quantity.',
          'Skip pumping sessions if you are breastfeeding; this can lower supply.',
          'Try to do everything perfectly; "good enough" is okay.'
        ]
      },
      warningSigns: [
        'Overwhelming anxiety or guilt that affects your ability to work.',
        'Signs of mastitis from missed pumping sessions.',
        'Baby refusing the bottle completely (practice beforehand helps).'
      ],
      tips: [
        'Batch cook meals on weekends to save time during the week.',
        'Connect with other working parents for support and tips.',
        'Schedule "reconnection time" with your baby as soon as you get home.'
      ],
      references: [
        { title: 'Working Parents Support', url: 'https://hbr.org/topic/subject/working-parents' },
        { title: 'WomensHealth.gov: Breastfeeding and Work', url: 'https://www.womenshealth.gov/breastfeeding/breastfeeding-home-work-and-public/breastfeeding-and-going-back-work' }
      ]
    }
  },
  {
    id: 'partner-support',
    title: 'Partner Support',
    icon: Heart,
    color: 'var(--color-blue-100)',
    textColor: 'var(--color-blue-700)',
    description: 'How partners can be involved and supportive.',
    content: {
      overview: 'Partners play a crucial role in the pregnancy and postpartum journey. Their support can significantly reduce stress for the birthing parent and enhance the family bond. Active involvement from the start helps build confidence and connection.',
      keyPoints: [
        'Emotional support is just as important as physical help.',
        'Partners can bond with baby through bathing, changing, and soothing.',
        'Communication is key to navigating new roles together.'
      ],
      dosAndDonts: {
        dos: [
          'Attend prenatal appointments and childbirth classes together.',
          'Take initiative with household chores and baby care.',
          'Check in on your partner\'s mental health regularly.'
        ],
        donts: [
          'Assume the birthing parent knows everything naturally.',
          'Wait to be asked to help; jump in proactively.',
          'Neglect your own self-care; you need energy to support the family.'
        ]
      },
      warningSigns: [
        'Partner showing signs of depression or withdrawal.',
        'Frequent arguments or resentment building up.',
        'Feeling completely excluded from baby care.'
      ],
      tips: [
        'Learn soothing techniques like swaddling and rocking.',
        'Manage gatekeeping; encourage the partner to find their own way.',
        'Plan small "dates" or moments of connection without the baby.'
      ],
      references: [
        { title: 'National Fatherhood Initiative', url: 'https://www.fatherhood.org/' },
        { title: 'Mayo Clinic: Support for Partners', url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/parenting-tips-for-dads/art-20047395' }
      ]
    }
  },
  {
    id: 'common-discomforts',
    title: 'Common Discomforts',
    icon: AlertCircle,
    color: 'var(--color-green-100)',
    textColor: 'var(--color-green-700)',
    description: 'Managing aches, pains, and other pregnancy symptoms.',
    content: {
      overview: 'Pregnancy brings a host of physical changes, some of which can be uncomfortable. From morning sickness to back pain, most symptoms are normal and temporary. However, there are many strategies to manage relief safely.',
      keyPoints: [
        'Nausea ("morning sickness") can happen at any time of day.',
        'Back pain and pelvic girdle pain are common as the belly grows.',
        'Heartburn and indigestion often increase in the third trimester.'
      ],
      dosAndDonts: {
        dos: [
          'Eat small, mild meals to manage nausea and heartburn.',
          'Use pillows for support while sleeping (between knees, under belly).',
          'Wear comfortable shoes and support belts if needed.'
        ],
        donts: [
          'Stand for long periods without breaks.',
          'Take over-the-counter medications without checking if they are pregnancy-safe.',
          'Ignore sudden swelling or severe headaches.'
        ]
      },
      warningSigns: [
        'Constant vomiting leadng to dehydration.',
        'Severe, one-sided pain in the back or side (kidney infection).',
        'Pain with urination or blood in urine.'
      ],
      tips: [
        'Ginger tea or candies can help with mild nausea.',
        'Prenatal yoga or swimming can relieve back pressure.',
        'Elevate your feet when resting to reduce swelling.'
      ],
      references: [
        { title: 'ACOG: Back Pain During Pregnancy', url: 'https://www.acog.org/womens-health/faqs/back-pain-during-pregnancy' },
        { title: 'NHS: Common pregnancy problems', url: 'https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/' }
      ]
    }
  }
];
