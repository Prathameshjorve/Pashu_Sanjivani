// AI Chatbot Controller - Refactored for Guided Symptom Flow
// Behaves like a friendly veterinary assistant

async function chat(req, res) {
  const { message, history, language, currentStep, selectedSymptoms } = req.body;
  const lowerMessage = message?.toLowerCase() || "";
  const lang = ['en', 'hi', 'mar'].includes(language) ? language : 'en';

  const content = {
    en: {
      step1: "How is your animal feeling? Please select the symptoms you observe:",
      step2: (sym) => `I see you selected ${sym}. Could you tell me more? For example, since how many days has this been happening?`,
      step3: "Thank you for the details. Now, please upload a clear photo of the animal (especially the affected area) for an AI diagnosis.",
      followups: {
        "Not Eating": "Since how many days? Is it drinking water properly? Any vomiting?",
        "Fever": "How high is the fever? Is the animal shivering? Any nasal discharge?",
        "Reduced Milk Production": "Is the reduction sudden or gradual? Any udder swelling or redness?",
        "Skin Infection": "Are there lumps, rashes, or hair loss? Is the animal scratching?",
        "Diarrhea": "Is there blood in the stool? How many times a day? Any weakness?"
      },
      fallback: "I understand. Is there anything else you'd like to add before we proceed to the image upload?"
    },
    hi: {
      step1: "आपका पशु कैसा महसूस कर रहा है? कृपया वे लक्षण चुनें जो आप देख रहे हैं:",
      step3: "विवरण के लिए धन्यवाद। अब, कृपया एआई निदान के लिए पशु की एक स्पष्ट फोटो (विशेष रूप से प्रभावित क्षेत्र) अपलोड करें।",
      followups: {
        "Not Eating": "कितने दिनों से? क्या वह ठीक से पानी पी रहा है? क्या कोई उल्टी हुई है?",
        "Fever": "बुखार कितना तेज है? क्या पशु कांप रहा है? क्या नाक से पानी बह रहा है?"
      }
    },
    mar: {
      step1: "तुमचा प्राणी कसा वाटत आहे? कृपया तुम्हाला दिसणारी लक्षणे निवडा:",
      step3: "तपशीलांबद्दल धन्यवाद. आता, कृपया AI निदानासाठी प्राण्याचे स्पष्ट छायाचित्र (विशेषतः बाधित भाग) अपलोड करा.",
      followups: {
        "Not Eating": "किती दिवसांपासून? तो व्यवस्थित पाणी पित आहे का? उलटी झाली आहे का?"
      }
    }
  };

  const c = content[lang] || content['en'];
  let response = "";
  let nextStep = currentStep;

  if (currentStep === 0) {
    response = c.step1;
    nextStep = 1;
  } else if (currentStep === 1) {
    // Check if symptoms were selected
    if (selectedSymptoms && selectedSymptoms.length > 0) {
      const primarySymptom = selectedSymptoms[0];
      response = c.followups[primarySymptom] || c.step2(primarySymptom);
      nextStep = 2;
    } else {
      response = c.step1;
    }
  } else if (currentStep === 2) {
    response = c.step3;
    nextStep = 3;
  } else {
    response = c.fallback || "Please upload an image to continue.";
  }

  res.json({ response, nextStep });
}

module.exports = { chat };
