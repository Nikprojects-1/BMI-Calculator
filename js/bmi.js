/**
 * BMI calculation and health recommendations
 */
const BMI = (() => {
  const CATEGORIES = [
    { max: 18.5, key: 'underweight', label: 'Underweight', class: 'underweight' },
    { max: 25, key: 'normal', label: 'Normal', class: 'normal' },
    { max: 30, key: 'overweight', label: 'Overweight', class: 'overweight' },
    { max: Infinity, key: 'obese', label: 'Obese', class: 'obese' }
  ];

  const RECOMMENDATIONS = {
    underweight: [
      'Increase caloric intake with nutrient-dense foods',
      'Include strength training to build lean muscle',
      'Eat regular meals with adequate protein',
      'Consult a healthcare provider if unintentional weight loss'
    ],
    normal: [
      'Maintain a balanced diet with whole foods',
      'Stay active with 150+ minutes of exercise weekly',
      'Keep hydrated and get 7-9 hours of sleep',
      'Continue regular health check-ups'
    ],
    overweight: [
      'Create a moderate caloric deficit through diet',
      'Increase daily physical activity and walking',
      'Focus on portion control and whole foods',
      'Set realistic weekly weight loss goals (0.5-1 kg)'
    ],
    obese: [
      'Consult a healthcare professional for a personalized plan',
      'Start with low-impact exercises like walking or swimming',
      'Track meals and prioritize vegetables and lean protein',
      'Consider gradual lifestyle changes for sustainable results'
    ]
  };

  const MESSAGES = {
    underweight: 'Your BMI suggests you are underweight. Focus on healthy weight gain through balanced nutrition.',
    normal: 'Great job! Your BMI is in the healthy range. Keep maintaining your active lifestyle.',
    overweight: 'Your BMI indicates you are overweight. Small consistent changes can make a big difference.',
    obese: 'Your BMI falls in the obese range. Consider speaking with a healthcare provider for guidance.'
  };

  function lbsToKg(lbs) { return lbs * 0.453592; }
  function kgToLbs(kg) { return kg * 2.20462; }
  function ftInToCm(ft, inches) { return (ft * 12 + inches) * 2.54; }

  function calculate(heightCm, weightKg) {
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  function getCategory(bmi) {
    if (bmi == null) return null;
    return CATEGORIES.find(c => bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
  }

  function idealWeightRange(heightCm) {
    if (!heightCm) return { min: 0, max: 0 };
    const heightM = heightCm / 100;
    const min = Math.round(18.5 * heightM * heightM * 10) / 10;
    const max = Math.round(24.9 * heightM * heightM * 10) / 10;
    return { min, max };
  }

  function calculateBMR(weightKg, heightCm, age, gender) {
    if (!weightKg || !heightCm || !age) return null;
    if (gender === 'female') {
      return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    }
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }

  function calculateDailyCalories(bmr, activityFactor, fitnessGoal) {
    if (!bmr) return null;
    let tdee = Math.round(bmr * activityFactor);
    const adjustments = { loss: -500, maintain: 0, gain: 300, muscle: 400 };
    return tdee + (adjustments[fitnessGoal] || 0);
  }

  function estimateBodyFat(bmi, age, gender) {
    if (bmi == null || !age) return null;
    let bf;
    if (gender === 'female') {
      bf = (1.20 * bmi) + (0.23 * age) - 5.4;
    } else {
      bf = (1.20 * bmi) + (0.23 * age) - 16.2;
    }
    return Math.max(5, Math.min(50, Math.round(bf * 10) / 10));
  }

  function bmiToGaugePercent(bmi) {
    if (!bmi) return 0;
    const min = 15, max = 40;
    return Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100));
  }

  function bmiToCirclePercent(bmi) {
    if (!bmi) return 0;
    const ideal = 22;
    const diff = Math.abs(bmi - ideal);
    return Math.max(0, Math.min(100, 100 - diff * 8));
  }

  function getAIRecommendation(bmi, category, fitnessGoal) {
    if (!bmi) return 'Complete your BMI calculation to receive personalized health recommendations.';
    const tips = {
      loss: 'Based on your profile, focus on a 300-500 calorie deficit with cardio and resistance training.',
      maintain: 'Your metrics suggest maintaining current habits with balanced macros and regular activity.',
      gain: 'Consider a slight caloric surplus with emphasis on protein (1.6-2.2g per kg body weight).',
      muscle: 'Prioritize progressive overload training and adequate protein intake for muscle development.'
    };
    return `${MESSAGES[category?.key] || ''} ${tips[fitnessGoal] || tips.maintain}`;
  }

  return {
    calculate,
    getCategory,
    idealWeightRange,
    calculateBMR,
    calculateDailyCalories,
    estimateBodyFat,
    bmiToGaugePercent,
    bmiToCirclePercent,
    getRecommendations: (key) => RECOMMENDATIONS[key] || [],
    getMessage: (key) => MESSAGES[key] || '',
    getAIRecommendation,
    lbsToKg,
    kgToLbs,
    ftInToCm
  };
})();
