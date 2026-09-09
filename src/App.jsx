import { useEffect, useMemo, useRef, useState } from 'react'
import PriceCompareChart from './components/charts/PriceCompareChart'
import InteractiveMarketScene from './components/landing/InteractiveMarketScene'
import LandingFooter from './components/landing/LandingFooter'
import LandingHeroPanel from './components/landing/LandingHeroPanel'
import LandingPriceGraph from './components/landing/LandingPriceGraph'
import { calcEnr } from './lib/enr'
import { createLot, createOffer, createProfile, getLots, getMarketPrices, getOffers, isSupabaseConfigured, signIn, signUp } from './lib/marketplaceApi'

const languageOptions = [
  { label: 'EN', value: 'en' },
  { label: 'हिं', value: 'hi' },
  { label: 'मर', value: 'mr' },
]

const landingCopy = {
  en: {
    nav: ['How it works', 'For farmers', 'For buyers', 'AI coach'], login: 'Log in', cta: 'Start selling smarter', eyebrow: "India's market-linkage network", title: 'Your harvest deserves a better deal.', intro: 'Farmly connects farmers and serious buyers with clear prices, verified lots, and decisions that protect your margin.', primary: 'Explore the marketplace', secondary: 'See how it works', trusted: "Built for the people who grow and move India's food.", stats: [['₹2.68k', 'best soybean offer'], ['94%', 'buyer match accuracy'], ['18 min', 'average listing time'], ['3.2k+', 'active network members']], featuresEyebrow: 'One source of truth', featuresTitle: 'From first price check to final settlement.', features: [['01', 'Know your real price', 'Compare mandi rates, transport, storage, and payment terms before you commit.'], ['02', 'Meet the right buyer', 'Verified buyers discover your lot by crop, grade, readiness, and location.'], ['03', 'Keep every promise visible', 'Offers, pickups, payments, and grievances stay in one transparent trail.']], howEyebrow: 'A clearer harvest journey', howTitle: 'Three moves from crop to cash.', how: [['01', 'List your lot', 'Add crop, quantity, quality, and the date you are ready to sell.'], ['02', 'Compare the whole deal', 'Farmly surfaces buyer offers and the net amount that reaches you.'], ['03', 'Trade with confidence', 'Choose a buyer, schedule pickup, and track settlement without guesswork.']], previewEyebrow: 'Inside Farmly', previewTitle: 'A command centre for every harvest.', aiEyebrow: 'Meet your AI coach', aiTitle: 'Ask a simple question. Make a sharper decision.', aiBody: '“Should I sell my soybean today?” Farmly reads your crop, market movement, storage window, and buyer demand to give you a plain-language next step.', aiCta: 'Ask the market', testimonialsEyebrow: 'Proof from the network', testimonialsTitle: 'More visibility. Better conversations.', testimonials: [['“For the first time, I could compare the buyer’s price with the cost of transport before saying yes.”', 'Meena P.', 'FPO member, Maharashtra'], ['“We find quality lots faster because every listing arrives with the context our procurement team needs.”', 'Amit Kulkarni', 'Procurement lead, AgroTrade']], finalTitle: 'Turn today’s harvest into tomorrow’s leverage.', finalBody: 'Join a marketplace designed around the value of your work, not just the nearest price board.', footer: 'Transparent trade for a stronger farm economy.',
  },
  hi: {
    nav: ['कैसे काम करता है', 'किसानों के लिए', 'खरीदारों के लिए', 'AI कोच'], login: 'लॉग इन', cta: 'बेहतर बेचें', eyebrow: 'भारत का बाजार नेटवर्क', title: 'आपकी फसल को बेहतर सौदा मिलना चाहिए।', intro: 'Farmly किसानों और भरोसेमंद खरीदारों को साफ कीमतों, सत्यापित लॉट और बेहतर फैसलों से जोड़ता है।', primary: 'मार्केटप्लेस देखें', secondary: 'जानें कैसे काम करता है', trusted: 'भारत का अन्न उगाने और पहुंचाने वालों के लिए।', stats: [['₹2.68k', 'सबसे अच्छा सोयाबीन भाव'], ['94%', 'खरीदार मिलान'], ['18 मिनट', 'लिस्टिंग समय'], ['3.2k+', 'सक्रिय सदस्य']], featuresEyebrow: 'एक भरोसेमंद तस्वीर', featuresTitle: 'पहली कीमत से अंतिम भुगतान तक।', features: [['01', 'अपनी असली कीमत जानें', 'मंडी भाव, परिवहन, भंडारण और भुगतान शर्तों की तुलना करें।'], ['02', 'सही खरीदार पाएं', 'खरीदार फसल, ग्रेड, तैयारी और स्थान के आधार पर आपका लॉट खोजते हैं।'], ['03', 'हर वादा साफ रखें', 'ऑफर, पिकअप, भुगतान और शिकायत एक ही जगह दिखते हैं।']], howEyebrow: 'आसान फसल सफर', howTitle: 'फसल से भुगतान तक तीन कदम।', how: [['01', 'लॉट बनाएं', 'फसल, मात्रा, गुणवत्ता और बिक्री की तारीख जोड़ें।'], ['02', 'पूरा सौदा तुलना करें', 'Farmly खरीदार ऑफर और आपके हाथ में आने वाली रकम दिखाता है।'], ['03', 'भरोसे से व्यापार करें', 'खरीदार चुनें, पिकअप तय करें और भुगतान ट्रैक करें।']], previewEyebrow: 'Farmly के अंदर', previewTitle: 'हर फसल के लिए कमांड सेंटर।', aiEyebrow: 'आपका AI कोच', aiTitle: 'सरल सवाल पूछें। बेहतर फैसला लें।', aiBody: '“क्या मुझे आज सोयाबीन बेचना चाहिए?” Farmly आपकी फसल, बाजार, भंडारण और मांग देखकर आसान सलाह देता है।', aiCta: 'बाजार से पूछें', testimonialsEyebrow: 'नेटवर्क की आवाज', testimonialsTitle: 'ज्यादा जानकारी। बेहतर बातचीत।', testimonials: [['“पहली बार मैंने कीमत के साथ परिवहन लागत भी देखकर फैसला लिया।”', 'मीना पी.', 'FPO सदस्य, महाराष्ट्र'], ['“हर लिस्टिंग में जरूरी जानकारी होती है, इसलिए सोर्सिंग तेज होती है।”', 'अमित कुलकर्णी', 'प्रोक्योरमेंट लीड']], finalTitle: 'आज की फसल को कल की ताकत बनाएं।', finalBody: 'आपके काम की पूरी कीमत को ध्यान में रखकर बना मार्केटप्लेस।', footer: 'मजबूत खेती अर्थव्यवस्था के लिए पारदर्शी व्यापार।',
  },
  mr: {
    nav: ['कसे काम करते', 'शेतकऱ्यांसाठी', 'खरेदीदारांसाठी', 'AI कोच'], login: 'लॉग इन', cta: 'हुशारीने विक्री करा', eyebrow: 'भारताचे बाजार नेटवर्क', title: 'तुमच्या मालाला योग्य भाव मिळायला हवा.', intro: 'Farmly शेतकरी आणि विश्वासू खरेदीदारांना स्पष्ट दर, पडताळलेले लॉट आणि चांगल्या निर्णयांशी जोडते.', primary: 'मार्केटप्लेस पहा', secondary: 'कसे काम करते ते पहा', trusted: 'भारताचे अन्न पिकवणाऱ्या आणि पोहोचवणाऱ्या लोकांसाठी.', stats: [['₹2.68k', 'सोयाबीनचा सर्वोत्तम दर'], ['94%', 'खरेदीदार जुळणी'], ['18 मिनिटे', 'लिस्टिंग वेळ'], ['3.2k+', 'सक्रिय सदस्य']], featuresEyebrow: 'एक स्पष्ट चित्र', featuresTitle: 'पहिल्या दरापासून अंतिम हिशेबापर्यंत.', features: [['01', 'तुमचा खरा दर जाणून घ्या', 'मंडी दर, वाहतूक, साठवणूक आणि पेमेंट अटींची तुलना करा.'], ['02', 'योग्य खरेदीदार मिळवा', 'खरेदीदार पीक, दर्जा, तयारी आणि स्थानानुसार तुमचा लॉट शोधतात.'], ['03', 'प्रत्येक व्यवहार स्पष्ट ठेवा', 'ऑफर, पिकअप, पेमेंट आणि तक्रारी एका ठिकाणी ठेवा.']], howEyebrow: 'सोपे पीक प्रवास', howTitle: 'पिकापासून पैशापर्यंत तीन पावले.', how: [['01', 'लॉट नोंदवा', 'पीक, प्रमाण, दर्जा आणि विक्रीची तारीख भरा.'], ['02', 'संपूर्ण व्यवहाराची तुलना करा', 'Farmly खरेदीदारांच्या ऑफर आणि तुमच्या हातात येणारी रक्कम दाखवते.'], ['03', 'विश्वासाने व्यवहार करा', 'खरेदीदार निवडा, पिकअप ठरवा आणि पेमेंटचा मागोवा घ्या.']], previewEyebrow: 'Farmly मध्ये', previewTitle: 'प्रत्येक पिकासाठी कमांड सेंटर.', aiEyebrow: 'तुमचा AI कोच', aiTitle: 'सोपे प्रश्न विचारा. चांगला निर्णय घ्या.', aiBody: '“मी आज सोयाबीन विकू का?” Farmly पीक, बाजार, साठवणूक आणि मागणी पाहून सोपा सल्ला देते.', aiCta: 'बाजाराला विचारा', testimonialsEyebrow: 'नेटवर्कचा विश्वास', testimonialsTitle: 'अधिक माहिती. चांगले व्यवहार.', testimonials: [['“दरासोबत वाहतूक खर्च पाहून निर्णय घेता आला.”', 'मीना पी.', 'FPO सदस्य, महाराष्ट्र'], ['“लॉटची माहिती पूर्ण असल्याने सोर्सिंग जलद होते.”', 'अमित कुलकर्णी', 'प्रोक्योरमेंट लीड']], finalTitle: 'आजच्या पिकाला उद्याची ताकद द्या.', finalBody: 'तुमच्या कष्टाची पूर्ण किंमत लक्षात घेऊन बनवलेले मार्केटप्लेस.', footer: 'मजबूत शेती अर्थव्यवस्थेसाठी पारदर्शी व्यापार.',
  },
}

function useCountUp(target, duration = 1600, start = true) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!start) return

    let startTime = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth ease-out
      const eased =
        1 - Math.pow(1 - progress, 3)

      const nextValue = Math.floor(target * eased)

      setValue(nextValue)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [target, duration, start])

  return value
}

function AnimatedStat({
  value,
  label,
  type = 'number',
  delay = 0,
}) {
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setStarted(true)
          }, delay)

          observer.disconnect()
        }
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

  const numericValue =
    type === 'percent'
      ? 94
      : type === 'minutes'
        ? 18
        : type === 'members'
          ? 3200
          : 2680

  const count = useCountUp(
    numericValue,
    1700,
    started,
  )

  const formattedValue = (() => {
    if (type === 'percent') {
      return `${count}%`
    }

    if (type === 'minutes') {
      return `${count} min`
    }

    if (type === 'members') {
      if (count < 1000) {
        return `${count}`
      }

      return `${(count / 1000).toFixed(1)}k+`
    }

    if (count < 1000) {
      return `₹${count}`
    }

    return `₹${(count / 1000).toFixed(2)}k`
  })()

  return (
    <div
      ref={ref}
      className="stat-card"
    >
      <div className="stat-number">
        {started ? formattedValue : '0'}
      </div>

      <div className="stat-label">
        {label}
      </div>
    </div>
  )
}

const effectCopy = {
  en: { title: 'Less uncertainty.', accent: 'More on every quintal.' },
  hi: { title: 'कम अनिश्चितता।', accent: 'हर क्विंटल पर अधिक लाभ।' },
  mr: { title: 'कमी अनिश्चितता.', accent: 'प्रत्येक क्विंटलवर अधिक.' },
}

const dashboardCopy = {
  en: {
    marketLinkages: 'Market linkages', buyerNetwork: 'Buyer network', overview: 'Overview', prices: 'Prices', myLots: 'My lots', offers: 'Offers', discover: 'Discover', bulk: 'Bulk', payments: 'Payments', switchRole: 'Switch role', farmerEyebrow: 'Farmer / FPO dashboard', farmerTitle: 'Clearer decisions, stronger bargaining power.', farmerBody: 'See nearby mandi prices, digital offers, and the likely best sale window for your crop in one place.', currentSignal: 'Current market signal', estimated: 'Estimated realised', mandiRate: 'Current mandi rate', bestOffer: 'Best offer', processorOffer: 'Processor offer', expectedGain: 'Expected gain', heldDays: 'If held 4 days', liveLots: 'Live lots', acrossFarm: 'Across your farm/FPO', priceDiscovery: 'Price discovery', nearbySignal: 'Nearby market signal', live: 'Live', marketRate: 'Market rate', buyerOffer: 'Buyer offer', digitalTrade: 'Digital trade', aiRecommendation: 'AI recommendation', saleWindow: 'Sale window', listing: 'Listing', createLot: 'Create a lot', crop: 'Crop', quantity: 'Quantity (quintals)', qualityGrade: 'Quality grade', location: 'Location', readyDate: 'Ready date', addLot: 'Add lot to market', yourLots: 'Your lots', activeListings: 'Active listings', liveOffers: 'live offers', incomingOffers: 'Incoming digital offers', review: 'Review', accept: 'Accept', accepted: 'Accepted', logistics: 'Logistics', storageTransport: 'Storage & transport', paymentsTitle: 'Track settlement', support: 'Support', raiseGrievance: 'Raise grievance', buyerEyebrow: 'Buyer dashboard', buyerTitle: 'Source compliant volume faster.', buyerBody: 'Rank lots by match quality, production readiness, and trust so your procurement team can act quickly.', demandMatch: 'Demand match', bestFit: 'Best fit for your likely order profile', matchingLots: 'Matching lots', sortedDemand: 'Sorted by demand fit', avgLot: 'Avg. lot value', nearbyLots: 'Across nearby lots', fastestPickup: 'Fastest pickup', readyDispatch: 'Ready for dispatch', trustScore: 'Trust score', pastBuyer: 'Past buyer health', filterLots: 'Filter lots by fit', resetFilters: 'Reset filters', matches: 'matches', bestMatch: 'Best match', highestPrice: 'Highest price', largestVolume: 'Largest volume', nearest: 'Nearest first', any: 'Any', readyBy: 'Ready by', recommendedSupply: 'Recommended supply', purchaseProfile: 'Purchase profile', makeOffer: 'Make digital offer', proposedPrice: 'Proposed price / qtl', terms: 'Terms', notes: 'Notes', sendOffer: 'Send offer', offerSent: 'Offer sent', bulkVolume: 'Bulk volume', combineLots: 'Combine nearby lots', commitment: 'Commitment tracking', noLots: 'No lots match these filters.', widenFilters: 'Try widening your radius or lowering the minimum quantity.', showAll: 'Show all lots', aiAssistant: 'AI assistant', askMarket: 'Ask the market', plainAnswer: 'Plain-language answer', ask: 'Ask', login: 'Log in', register: 'Register', welcome: 'Welcome back', joinWelcome: 'Join Farmly', workspace: 'Enter your Farmly workspace.', createWorkspace: 'Create your Farmly workspace.', demoAccount: 'Use a demo account to explore the platform. No real credentials are required.', registerBody: 'Create a demo account and start with the workspace that fits your role.', fullName: 'Full name', createAccount: 'Create account', mobileEmail: 'Mobile number or email', password: 'Password', opening: 'Opening workspace...', demoMode: 'Demo mode · your data stays in this browser session', farmerRole: 'Farmer / FPO', buyerRole: 'Buyer',
  },
  hi: {
    marketLinkages: 'बाजार संपर्क', buyerNetwork: 'खरीदार नेटवर्क', overview: 'सारांश', prices: 'भाव', myLots: 'मेरे लॉट', offers: 'ऑफर', discover: 'खोजें', bulk: 'थोक', payments: 'भुगतान', switchRole: 'भूमिका बदलें', farmerEyebrow: 'किसान / FPO डैशबोर्ड', farmerTitle: 'बेहतर फैसले, मजबूत सौदेबाजी।', farmerBody: 'मंडी भाव, डिजिटल ऑफर और अपनी फसल के सही बिक्री समय को एक ही जगह देखें।', currentSignal: 'वर्तमान बाजार संकेत', estimated: 'अनुमानित प्राप्ति', mandiRate: 'वर्तमान मंडी भाव', bestOffer: 'सबसे अच्छा ऑफर', processorOffer: 'प्रोसेसर ऑफर', expectedGain: 'अनुमानित लाभ', heldDays: '4 दिन रोकने पर', liveLots: 'सक्रिय लॉट', acrossFarm: 'आपके खेत / FPO से', priceDiscovery: 'भाव जानकारी', nearbySignal: 'नजदीकी बाजार संकेत', live: 'लाइव', marketRate: 'बाजार भाव', buyerOffer: 'खरीदार ऑफर', digitalTrade: 'डिजिटल व्यापार', aiRecommendation: 'AI सुझाव', saleWindow: 'बिक्री का समय', listing: 'लिस्टिंग', createLot: 'लॉट बनाएं', crop: 'फसल', quantity: 'मात्रा (क्विंटल)', qualityGrade: 'गुणवत्ता ग्रेड', location: 'स्थान', readyDate: 'तैयार तारीख', addLot: 'लॉट बाजार में जोड़ें', yourLots: 'आपके लॉट', activeListings: 'सक्रिय लिस्टिंग', liveOffers: 'लाइव ऑफर', incomingOffers: 'आने वाले डिजिटल ऑफर', review: 'देखें', accept: 'स्वीकार करें', accepted: 'स्वीकार किया', logistics: 'लॉजिस्टिक्स', storageTransport: 'भंडारण और परिवहन', paymentsTitle: 'भुगतान ट्रैक करें', support: 'सहायता', raiseGrievance: 'शिकायत दर्ज करें', buyerEyebrow: 'खरीदार डैशबोर्ड', buyerTitle: 'मानक के अनुरूप मात्रा जल्दी पाएं।', buyerBody: 'मिलान, तैयार मात्रा और भरोसे के आधार पर लॉट चुनें ताकि खरीद टीम जल्दी निर्णय ले सके।', demandMatch: 'मांग मिलान', bestFit: 'आपके ऑर्डर के लिए सबसे अच्छा मिलान', matchingLots: 'मिलते लॉट', sortedDemand: 'मांग के अनुसार', avgLot: 'औसत लॉट भाव', nearbyLots: 'नजदीकी लॉट पर', fastestPickup: 'सबसे तेज पिकअप', readyDispatch: 'भेजने के लिए तैयार', trustScore: 'भरोसा स्कोर', pastBuyer: 'पिछला खरीदार रिकॉर्ड', filterLots: 'मिलान के अनुसार लॉट छांटें', resetFilters: 'फिल्टर रीसेट', matches: 'मिलान', bestMatch: 'सबसे अच्छा मिलान', highestPrice: 'सबसे ऊंचा भाव', largestVolume: 'सबसे बड़ी मात्रा', nearest: 'सबसे नजदीक', any: 'कोई भी', readyBy: 'तैयार तारीख', recommendedSupply: 'सुझाई गई आपूर्ति', purchaseProfile: 'खरीद प्रोफाइल', makeOffer: 'डिजिटल ऑफर दें', proposedPrice: 'प्रस्तावित भाव / क्विंटल', terms: 'शर्तें', notes: 'नोट्स', sendOffer: 'ऑफर भेजें', offerSent: 'ऑफर भेज दिया', bulkVolume: 'थोक मात्रा', combineLots: 'नजदीकी लॉट मिलाएं', commitment: 'भुगतान प्रतिबद्धता', noLots: 'इन फिल्टर से कोई लॉट नहीं मिला।', widenFilters: 'दायरा बढ़ाएं या न्यूनतम मात्रा कम करें।', showAll: 'सभी लॉट दिखाएं', aiAssistant: 'AI सहायक', askMarket: 'बाजार से पूछें', plainAnswer: 'सरल उत्तर', ask: 'पूछें', login: 'लॉग इन', welcome: 'वापसी पर स्वागत है', workspace: 'अपने Farmly कार्यक्षेत्र में जाएं।', demoAccount: 'डेमो खाते से प्लेटफॉर्म देखें। असली जानकारी की जरूरत नहीं है।', mobileEmail: 'मोबाइल नंबर या ईमेल', password: 'पासवर्ड', opening: 'वर्कस्पेस खुल रहा है...', demoMode: 'डेमो मोड · आपका डेटा इसी ब्राउजर में रहेगा', farmerRole: 'किसान / FPO', buyerRole: 'खरीदार',
  },
  mr: {
    marketLinkages: 'बाजार जोडणी', buyerNetwork: 'खरेदीदार नेटवर्क', overview: 'आढावा', prices: 'दर', myLots: 'माझे लॉट', offers: 'ऑफर', discover: 'शोधा', bulk: 'मोठ्या प्रमाणात', payments: 'पेमेंट', switchRole: 'भूमिका बदला', farmerEyebrow: 'शेतकरी / FPO डॅशबोर्ड', farmerTitle: 'अधिक स्पष्ट निर्णय, मजबूत सौदेबाजी.', farmerBody: 'जवळचे मंडी दर, डिजिटल ऑफर आणि तुमच्या पिकासाठी योग्य विक्रीची वेळ एका ठिकाणी पहा.', currentSignal: 'सध्याचा बाजार संकेत', estimated: 'अंदाजे मिळकत', mandiRate: 'सध्याचा मंडी दर', bestOffer: 'सर्वोत्तम ऑफर', processorOffer: 'प्रोसेसर ऑफर', expectedGain: 'अंदाजे फायदा', heldDays: '4 दिवस थांबल्यास', liveLots: 'सक्रिय लॉट', acrossFarm: 'तुमच्या शेत / FPO मधून', priceDiscovery: 'दर शोध', nearbySignal: 'जवळचा बाजार संकेत', live: 'लाइव्ह', marketRate: 'बाजार दर', buyerOffer: 'खरेदीदार ऑफर', digitalTrade: 'डिजिटल व्यापार', aiRecommendation: 'AI सूचना', saleWindow: 'विक्रीची वेळ', listing: 'लिस्टिंग', createLot: 'लॉट तयार करा', crop: 'पीक', quantity: 'प्रमाण (क्विंटल)', qualityGrade: 'दर्जा', location: 'ठिकाण', readyDate: 'तयार तारीख', addLot: 'लॉट बाजारात जोडा', yourLots: 'तुमचे लॉट', activeListings: 'सक्रिय लिस्टिंग', liveOffers: 'लाइव्ह ऑफर', incomingOffers: 'आलेले डिजिटल ऑफर', review: 'पहा', accept: 'स्वीकारा', accepted: 'स्वीकारले', logistics: 'लॉजिस्टिक्स', storageTransport: 'साठवणूक आणि वाहतूक', paymentsTitle: 'पेमेंटचा मागोवा', support: 'मदत', raiseGrievance: 'तक्रार नोंदवा', buyerEyebrow: 'खरेदीदार डॅशबोर्ड', buyerTitle: 'योग्य दर्जाचा माल वेगाने मिळवा.', buyerBody: 'मिलान, तयार माल आणि विश्वासाच्या आधारे लॉट निवडा जेणेकरून खरेदी टीम पटकन निर्णय घेईल.', demandMatch: 'मागणी जुळणी', bestFit: 'तुमच्या ऑर्डरसाठी योग्य जुळणी', matchingLots: 'जुळणारे लॉट', sortedDemand: 'मागणीनुसार', avgLot: 'सरासरी लॉट दर', nearbyLots: 'जवळच्या लॉटमधून', fastestPickup: 'जलद पिकअप', readyDispatch: 'पाठवणीसाठी तयार', trustScore: 'विश्वास गुण', pastBuyer: 'मागील खरेदीदार रेकॉर्ड', filterLots: 'जुळण्यानुसार लॉट फिल्टर करा', resetFilters: 'फिल्टर रीसेट', matches: 'जुळणी', bestMatch: 'सर्वोत्तम जुळणी', highestPrice: 'सर्वोच्च दर', largestVolume: 'सर्वात मोठे प्रमाण', nearest: 'सर्वात जवळचे', any: 'कोणतेही', readyBy: 'तयार तारीख', recommendedSupply: 'शिफारस केलेला पुरवठा', purchaseProfile: 'खरेदी प्रोफाइल', makeOffer: 'डिजिटल ऑफर द्या', proposedPrice: 'सुचवलेला दर / क्विंटल', terms: 'अटी', notes: 'नोट्स', sendOffer: 'ऑफर पाठवा', offerSent: 'ऑफर पाठवला', bulkVolume: 'मोठ्या प्रमाणातील माल', combineLots: 'जवळचे लॉट एकत्र करा', commitment: 'पेमेंट बांधिलकी', noLots: 'या फिल्टरमध्ये कोणतेही लॉट नाहीत.', widenFilters: 'अंतर वाढवा किंवा किमान प्रमाण कमी करा.', showAll: 'सर्व लॉट दाखवा', aiAssistant: 'AI सहाय्यक', askMarket: 'बाजाराला विचारा', plainAnswer: 'सोपे उत्तर', ask: 'विचारा', login: 'लॉग इन', welcome: 'पुन्हा स्वागत आहे', workspace: 'तुमच्या Farmly कार्यक्षेत्रात जा.', demoAccount: 'डेमो खात्याने प्लॅटफॉर्म पहा. खरी माहिती आवश्यक नाही.', mobileEmail: 'मोबाइल नंबर किंवा ईमेल', password: 'पासवर्ड', opening: 'वर्कस्पेस उघडत आहे...', demoMode: 'डेमो मोड · तुमचा डेटा या ब्राउझरमध्ये राहील', farmerRole: 'शेतकरी / FPO', buyerRole: 'खरेदीदार',
  },
}

const MARKET_DATA = [
  { id: 'beed', market: 'Beed Mandi', price: 2450, change: '+1.8%', volume: '420 qtl', type: 'mandi' },
  { id: 'parbhani', market: 'Parbhani Yard', price: 2480, change: '+2.1%', volume: '360 qtl', type: 'mandi' },
  { id: 'nanded', market: 'Nanded', price: 2405, change: '-0.7%', volume: '305 qtl', type: 'mandi' },
  { id: 'processor', market: 'Processor offer', price: 2680, change: '+4.2%', volume: '18 qtl', type: 'processor' },
  { id: 'digital', market: 'Digital trading', price: 2615, change: '+3.5%', volume: '12 qtl', type: 'digital' },
]

const initialLots = [
  {
    id: 'LOT-001',
    crop: 'Soybean',
    quantity: 15,
    unit: 'quintals',
    grade: 'A',
    qualitySource: 'Self-declared + photo',
    location: 'Pimpalner, Beed',
    readyDate: '2026-09-12',
    status: 'Listed',
    offers: 3,
    trust: 86,
  },
  {
    id: 'LOT-002',
    crop: 'Tur',
    quantity: 10,
    unit: 'quintals',
    grade: 'B',
    qualitySource: 'Photo-based sample',
    location: 'Kille Dharur, Beed',
    readyDate: '2026-09-15',
    status: 'Offer received',
    offers: 2,
    trust: 91,
  },
  {
    id: 'LOT-003',
    crop: 'Jowar',
    quantity: 22,
    unit: 'quintals',
    grade: 'A',
    qualitySource: 'FPO verified',
    location: 'Ashti, Beed',
    readyDate: '2026-09-18',
    status: 'Negotiating',
    offers: 4,
    trust: 94,
  },
]

const incomingOffers = [
  {
    id: 'OFF-101',
    lotId: 'LOT-001',
    buyer: 'AgroTrade Processors',
    rating: 4.8,
    price: 2680,
    transport: 120,
    storage: 75,
    payment: 'Immediate',
    status: 'Pending',
    reliability: 'High',
  },
  {
    id: 'OFF-102',
    lotId: 'LOT-001',
    buyer: 'Maharashtra Pulse Co.',
    rating: 4.6,
    price: 2620,
    transport: 90,
    storage: 60,
    payment: '7 days',
    status: 'Pending',
    reliability: 'Good',
  },
  {
    id: 'OFF-103',
    lotId: 'LOT-002',
    buyer: 'Sahyadri Foods',
    rating: 4.9,
    price: 2720,
    transport: 140,
    storage: 80,
    payment: 'Immediate',
    status: 'Accepted',
    reliability: 'High',
  },
  {
    id: 'OFF-104',
    lotId: 'LOT-003',
    buyer: 'FarmLink Supply',
    rating: 4.4,
    price: 2460,
    transport: 110,
    storage: 55,
    payment: '14 days',
    status: 'Pending',
    reliability: 'Moderate',
  },
]

const paymentTimeline = [
  { label: 'Offer accepted', date: '08 Sep', value: '₹2,680/qtl', tone: 'done' },
  { label: 'Advance payment', date: '09 Sep', value: '₹40,200', tone: 'done' },
  { label: 'Pickup scheduled', date: '12 Sep', value: 'Parbhani', tone: 'progress' },
  { label: 'Final settlement', date: '15 Sep', value: 'Pending', tone: 'pending' },
]

const disputeCard = {
  title: 'Grievance status',
  status: 'In review',
  summary: 'Weight mismatch claim from buyer was raised and documented with photo evidence.',
}

const defaultLotForm = {
  crop: 'Soybean',
  quantity: 12,
  grade: 'A',
  location: 'Beed',
  readyDate: '2026-09-16',
}

const buyerProfiles = [
  { id: 'A', name: 'AgroTrade Processors', score: 96, type: 'Processor' },
  { id: 'B', name: 'Maharashtra Pulse Co.', score: 91, type: 'Trader' },
  { id: 'C', name: 'Sahyadri Foods', score: 98, type: 'Institutional buyer' },
]

const buyerLotCatalog = [
  {
    id: 'BUYER-LOT-201',
    crop: 'Soybean',
    quality: 'A',
    quantity: 18,
    location: 'Pimpalner, Beed',
    distance: '6 km',
    readyDate: '2026-09-12',
    farmer: 'Ramesh P.',
    match: 96,
    price: 2680,
    status: 'Verified',
    trust: 88,
  },
  {
    id: 'BUYER-LOT-202',
    crop: 'Tur',
    quality: 'B',
    quantity: 26,
    location: 'Kille Dharur, Beed',
    distance: '14 km',
    readyDate: '2026-09-15',
    farmer: 'Savitri D.',
    match: 89,
    price: 2890,
    status: 'Verified',
    trust: 92,
  },
  {
    id: 'BUYER-LOT-203',
    crop: 'Soybean',
    quality: 'A',
    quantity: 42,
    location: 'Ashti, Beed',
    distance: '18 km',
    readyDate: '2026-09-18',
    farmer: 'FPO Beed Collective',
    match: 94,
    price: 2610,
    status: 'Bulk',
    trust: 95,
  },
  {
    id: 'BUYER-LOT-204',
    crop: 'Jowar',
    quality: 'A',
    quantity: 12,
    location: 'Parli, Beed',
    distance: '9 km',
    readyDate: '2026-09-11',
    farmer: 'Shankar R.',
    match: 78,
    price: 2440,
    status: 'New',
    trust: 80,
  },
]

const buyerPaymentTracks = [
  { label: 'Offer submitted', date: '08 Sep', value: '₹2,680/qtl', tone: 'done' },
  { label: 'Advance commitment', date: '09 Sep', value: '₹36,000', tone: 'done' },
  { label: 'Quality check', date: '12 Sep', value: 'Pending', tone: 'progress' },
  { label: 'Final settlement', date: '15 Sep', value: 'Awaiting', tone: 'pending' },
]

const CROP_FORECASTS = {
  Soybean: {
    current: 2450,
    expected: 2585,
    gain: 135,
    bestWindow: '12 Sep',
    reason:
      'Soybean prices are trending upward and are expected to peak around 12 Sep. Your storage window is enough for a short hold without quality loss.',
    action: 'Hold 4 days',
    trend: [2450, 2470, 2495, 2515, 2545, 2575, 2585],
  },
  Tur: {
    current: 6820,
    expected: 7090,
    gain: 270,
    bestWindow: '16 Sep',
    reason:
      'Tur is rising with a steady pulse in nearby mandis. Holding a few days improves your harvest value while keeping storage risk low.',
    action: 'Hold 3 days',
    trend: [6820, 6880, 6920, 6985, 7040, 7075, 7090],
  },
  Jowar: {
    current: 3125,
    expected: 3265,
    gain: 140,
    bestWindow: '11 Sep',
    reason:
      'Jowar remains relatively stable, but a short hold before the next market cycle can improve realised value without a major storage burden.',
    action: 'Sell now',
    trend: [3125, 3140, 3180, 3210, 3230, 3250, 3265],
  },
}

function getMockForecast(crop = 'Soybean') {
  const snapshot = CROP_FORECASTS[crop] ?? CROP_FORECASTS.Soybean
  return {
    ...snapshot,
    action: snapshot.action,
    reason: snapshot.reason,
  }
}

function getSaleRecommendation(crop, currentPrice, storageDays) {
  // Placeholder for future model/API call.
  // Real implementation would use price-trend forecast + storage limit + demand volatility.
  const forecast = getMockForecast(crop)
  const holdThreshold = storageDays >= 3 ? forecast.expected - currentPrice : 0

  if (holdThreshold > 0) {
    return {
      action: 'Hold 4 days',
      reason: `${forecast.reason} This is a short-term hold because the expected lift is ${currency(forecast.gain)} per quintal before quality risk becomes material.`,
      expectedPrice: forecast.expected,
    }
  }

  return {
    action: 'Sell now',
    reason: `The current market price is competitive, and waiting may not create enough lift to cover storage cost or quality risk for ${crop.toLowerCase()}.`,
    expectedPrice: currentPrice,
  }
}

function rankBuyerMatches(lots, buyerProfile = { preferredCrops: ['Soybean', 'Tur'] }) {
  // Placeholder for future AI-powered buyer-lot matching.
  // Real model would combine crop fit, quality grade, proximity, timing, and historical buyer behaviour.
  return [...lots]
    .map((lot) => {
      let score = 70
      if (buyerProfile.preferredCrops?.includes(lot.crop)) score += 18
      if (lot.quality === 'A') score += 10
      if (Number(lot.quantity) > 20) score += 6
      if (lot.distance && Number(String(lot.distance).replace(/\D/g, '')) <= 15) score += 8
      if (lot.readyDate) score += 2
      return { ...lot, matchScore: Math.min(score, 99) }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

function getNLQueryResponse(query) {
  // Placeholder for future natural-language model integration.
  // Current logic is rule-based and uses mock forecast data for plain-language recommendations.
  const lower = (query || '').toLowerCase()
  const cropName = lower.includes('tur') ? 'Tur' : lower.includes('jowar') ? 'Jowar' : 'Soybean'
  const forecast = getMockForecast(cropName)

  if (lower.includes('when should i sell') || lower.includes('sell')) {
    return `For ${cropName}, the forecast suggests ${forecast.action}. Prices are currently around ${currency(forecast.current)} and are expected to rise to about ${currency(forecast.expected)} over the next few days. ${forecast.reason}`
  }

  if (lower.includes('price')) {
    return `${cropName} is currently tracking at ${currency(forecast.current)} per quintal, with a short-term expectation of ${currency(forecast.expected)} if you wait for the peak window.`
  }

  return `Based on the current market pattern, ${cropName} looks strongest if you ${forecast.action.toLowerCase()} rather than selling immediately. The nearest peak window is around ${forecast.bestWindow}.`
}

function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function Reveal({ children, className = '', delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function StatCard({ label, value, detail, tone = 'default' }) {
  return (
    <div className={`stat-card ${tone}`}>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

function RoleCard({ title, subtitle, description, icon, active, onClick }) {
  return (
    <button type="button" className={`role-card ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span className="role-icon" aria-hidden="true">{icon}</span>
      <span className="role-copy">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className="role-description">{description}</span>
    </button>
  )
}

function BuyerBadge({ score }) {
  const tone = score >= 90 ? 'high' : score >= 75 ? 'mid' : 'low'
  return <span className={`trust-pill ${tone}`}>{score}/100</span>
}

function AIQueryAssistant({ language }) {
  const copy = dashboardCopy[language]
  const [query, setQuery] = useState('When should I sell my soybean?')
  const [answer, setAnswer] = useState(getNLQueryResponse('When should I sell my soybean?'))

  return (
    <div className="panel ai-assistant-panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">{copy.aiAssistant}</p>
          <h2>{copy.askMarket}</h2>
        </div>
      </div>

      <div className="assistant-input-row">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Ask market assistant"
          placeholder="When should I sell my soybean?"
        />
        <button type="button" className="primary-btn compact-btn" onClick={() => setAnswer(getNLQueryResponse(query))}>
          {copy.ask}
        </button>
      </div>

      <div className="assistant-response">
        <strong>{copy.plainAnswer}</strong>
        <p>{answer}</p>
      </div>
    </div>
  )
}

function FarmerDashboard({ lots, setLots, setSelectedRole, language, setLanguage, user }) {
  const copy = dashboardCopy[language]
  const [form, setForm] = useState(defaultLotForm)
  const [highlightedLot, setHighlightedLot] = useState(lots[0]?.id ?? '')
  const [acceptedOffer, setAcceptedOffer] = useState(null)
  const [marketData, setMarketData] = useState(MARKET_DATA)
  const [offerData, setOfferData] = useState(incomingOffers)

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return
    Promise.all([getLots(), getOffers(), getMarketPrices()]).then(([lotsResult, offersResult, pricesResult]) => {
      if (lotsResult.data?.length) {
        setLots(lotsResult.data.map((lot) => ({ id: lot.id, crop: lot.crop, quantity: lot.quantity, unit: lot.unit, grade: lot.grade, qualitySource: lot.quality_source, location: lot.location, readyDate: lot.ready_date, status: lot.status, offers: 0, trust: 82 })))
      }
      if (offersResult.data?.length) {
        setOfferData(offersResult.data.map((offer) => ({ id: offer.id, lotId: offer.lot_id, buyer: 'Verified buyer', rating: 4.8, price: offer.price, transport: offer.transport, storage: offer.storage, payment: offer.payment_terms, status: offer.status, reliability: 'Verified' })))
      }
      if (pricesResult.data?.length) {
        setMarketData(pricesResult.data.map((price) => ({ id: price.id, market: price.market, price: price.price, change: `${price.change_percent >= 0 ? '+' : ''}${price.change_percent ?? 0}%`, volume: price.volume ?? '-', type: 'mandi' })))
      }
    })
  }, [setLots, user?.id])

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return
    getLots().then(({ data, error }) => {
      if (error || !data?.length) return
      setLots(data.map((lot) => ({
        id: lot.id,
        crop: lot.crop,
        quantity: lot.quantity,
        unit: lot.unit,
        grade: lot.grade,
        qualitySource: lot.quality_source,
        location: lot.location,
        readyDate: lot.ready_date,
        status: lot.status,
        offers: 0,
        trust: 82,
      })))
    })
  }, [setLots, user?.id])
  const forecast = useMemo(() => getMockForecast('Soybean'), [])

  const visibleLots = useMemo(
    () =>
      lots.map((lot) => ({
        ...lot,
        offerCount: offerData.filter((offer) => offer.lotId === lot.id).length,
      })),
    [lots, offerData],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextLot = {
      id: `LOT-${String(lots.length + 1).padStart(3, '0')}`,
      crop: form.crop,
      quantity: Number(form.quantity),
      unit: 'quintals',
      grade: form.grade,
      qualitySource: 'Self-declared + photo',
      location: `${form.location}, Beed`,
      readyDate: form.readyDate,
      status: 'Listed',
      offers: 0,
      trust: 82,
    }

    if (isSupabaseConfigured && user?.id) {
      createLot({
        farmer_id: user.id,
        crop: nextLot.crop,
        quantity: nextLot.quantity,
        unit: nextLot.unit,
        grade: nextLot.grade,
        quality_source: nextLot.qualitySource,
        location: nextLot.location,
        ready_date: nextLot.readyDate,
        status: nextLot.status,
      }).then(({ data, error }) => {
        if (!error && data) setLots((current) => [{ ...nextLot, id: data.id }, ...current])
      })
    } else {
      setLots((current) => [nextLot, ...current])
    }
    setHighlightedLot(nextLot.id)
    setForm(defaultLotForm)
  }

  const selectedLot = visibleLots.find((lot) => lot.id === highlightedLot) ?? visibleLots[0]
  const lotOffers = offerData.filter((offer) => offer.lotId === selectedLot?.id)

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <span className="brand-mark small">Farmly</span>
          <span className="brand-tag">{copy.marketLinkages}</span>
        </div>

        <nav className="topnav" aria-label="Dashboard navigation">
          <a href="#overview">{copy.overview}</a>
          <a href="#intelligence">ENR / 3D</a>
          <a href="#prices">{copy.prices}</a>
          <a href="#lots">{copy.myLots}</a>
          <a href="#offers">{copy.offers}</a>
        </nav>

        <div className="topbar-actions">
          <div className="segment-control" aria-label="Language toggle">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={language === option.value ? 'is-selected' : ''}
                onClick={() => setLanguage(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className="ghost-btn" type="button" onClick={() => setSelectedRole(null)}>
            {copy.switchRole}
          </button>
        </div>
      </header>

      <main className="dashboard-page" id="overview">
        <section className="hero-panel dashboard-hero">
          <div>
            <p className="eyebrow accent">{copy.farmerEyebrow}</p>
            <h1>{copy.farmerTitle}</h1>
            <p className="hero-copy">{copy.farmerBody}</p>
          </div>
          <div className="hero-summary">
            <span className="summary-chip">Soybean</span>
            <strong>₹2,450/qtl</strong>
            <small>{copy.currentSignal}</small>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard label={copy.estimated} value={currency(2450)} detail={copy.mandiRate} tone="gold" />
          <StatCard label={copy.bestOffer} value={currency(2680)} detail={copy.processorOffer} tone="green" />
          <StatCard label={copy.expectedGain} value={`+${currency(135)}`} detail={copy.heldDays} tone="soft" />
          <StatCard label={copy.liveLots} value={String(lots.length)} detail={copy.acrossFarm} tone="neutral" />
        </section>

        <section className="charts-showcase" id="intelligence">
          <Reveal delay={40} className="panel chart-panel">
            <PriceCompareChart />
          </Reveal>
        </section>

        <section className="content-grid" id="prices">
          <Reveal delay={80} className="panel wide-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.priceDiscovery}</p>
                <h2>{copy.nearbySignal}</h2>
              </div>
              <span className="status-dot success">{copy.live}</span>
            </div>

            <div className="price-list">
              {marketData.map((market) => (
                <div key={market.id} className="price-row">
                  <div>
                    <strong>{market.market}</strong>
                    <small>{market.type === 'mandi' ? copy.marketRate : market.type === 'processor' ? copy.buyerOffer : copy.digitalTrade}</small>
                  </div>
                  <div className="price-trend">
                    <span>{market.change}</span>
                    <strong>{currency(market.price)}</strong>
                  </div>
                  <em>{market.volume}</em>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={130} className="panel">
            <div className="panel-header compact">
              <div>
                <p className="eyebrow">{copy.aiRecommendation}</p>
                <h2>{copy.saleWindow}</h2>
              </div>
            </div>

            <div className="ai-card">
              <div className="recommendation-badge">{forecast.action}</div>
              <p>{forecast.reason}</p>
              <div className="ai-metrics">
                <div>
                  <span>Current</span>
                  <strong>{currency(forecast.current)}</strong>
                </div>
                <div>
                  <span>Expected</span>
                  <strong>{currency(forecast.expected)}</strong>
                </div>
              </div>
            </div>
          </Reveal>

          <AIQueryAssistant language={language} />
        </section>

        <section className="content-grid stacked-grid" id="lots">
          <Reveal delay={180} className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.listing}</p>
                <h2>{copy.createLot}</h2>
              </div>
            </div>

            <form className="lot-form" onSubmit={handleSubmit}>
              <label>
                {copy.crop}
                <select value={form.crop} onChange={(event) => setForm((current) => ({ ...current, crop: event.target.value }))}>
                  <option>Soybean</option>
                  <option>Tur</option>
                  <option>Jowar</option>
                  <option>Cotton</option>
                </select>
              </label>

              <label>
                {copy.quantity}
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                />
              </label>

              <label>
                {copy.qualityGrade}
                <select value={form.grade} onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value }))}>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </label>

              <label>
                {copy.location}
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                />
              </label>

              <label>
                {copy.readyDate}
                <input
                  type="date"
                  value={form.readyDate}
                  onChange={(event) => setForm((current) => ({ ...current, readyDate: event.target.value }))}
                />
              </label>

              <button type="submit" className="primary-btn">
                {copy.addLot}
              </button>
            </form>
          </Reveal>

          <Reveal delay={240} className="panel wide-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.yourLots}</p>
                <h2>{copy.activeListings}</h2>
              </div>
            </div>

            <div className="lot-cards">
              {visibleLots.map((lot) => (
                <button
                  key={lot.id}
                  type="button"
                  className={`lot-card ${highlightedLot === lot.id ? 'is-selected' : ''}`}
                  onClick={() => setHighlightedLot(lot.id)}
                >
                  <div className="lot-topline">
                    <strong>{lot.crop}</strong>
                    <span className="status-pill">{lot.status}</span>
                  </div>
                  <div className="lot-meta">
                    <span>{lot.quantity} {lot.unit}</span>
                    <span>Grade {lot.grade}</span>
                    <span>{lot.location}</span>
                  </div>
                  <div className="lot-bottomline">
                    <small>{lot.offerCount} {copy.liveOffers}</small>
                    <small>{lot.qualitySource}</small>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="two-column-layout" id="offers">
          <Reveal delay={320} className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.offers}</p>
                <h2>{copy.incomingOffers}</h2>
              </div>
            </div>

            <div className="offer-list">
              {lotOffers.map((offer) => {
                const net = calcEnr({
                  price: offer.price,
                  transport: offer.transport,
                  storage: offer.storage,
                  paymentRisk: offer.payment === 'Immediate' ? 10 : offer.payment === '7 days' ? 25 : 45,
                })
                return (
                <div key={offer.id} className="offer-card">
                  <div className="offer-head">
                    <div>
                      <strong>{offer.buyer}</strong>
                      <small>{offer.payment}</small>
                    </div>
                    <BuyerBadge score={Math.round((offer.rating / 5) * 100)} />
                  </div>

                  <div className="offer-amount">{currency(offer.price)}/qtl</div>
                  <div className="offer-enr">
                    <span>Expected net</span>
                    <strong>{currency(net)}/qtl</strong>
                  </div>

                  <div className="offer-grid">
                    <span>Transport</span>
                    <strong>{currency(offer.transport)}</strong>
                  </div>
                  <div className="offer-grid">
                    <span>Storage</span>
                    <strong>{currency(offer.storage)}</strong>
                  </div>
                  <div className="offer-grid">
                    <span>Payment</span>
                    <strong>{offer.payment}</strong>
                  </div>

                  <div className="offer-actions">
                    <button type="button" className="secondary-btn">{copy.review}</button>
                    <button type="button" className="primary-btn compact" onClick={() => setAcceptedOffer(offer.id)}>{acceptedOffer === offer.id ? copy.accepted : copy.accept}</button>
                  </div>
                </div>
                )
              })}
            </div>
          </Reveal>

          <div className="stacked-panels">
            <Reveal delay={360} className="panel">
              <div className="panel-header compact">
                <div>
                  <p className="eyebrow">{copy.logistics}</p>
                  <h2>{copy.storageTransport}</h2>
                </div>
              </div>

              <div className="logistics-list">
                <div className="mini-card">
                  <strong>Nearest storage</strong>
                  <span>FPO cold room · 4 km</span>
                  <em>₹90/qt storage</em>
                </div>
                <div className="mini-card">
                  <strong>Transport estimate</strong>
                  <span>To Parbhani yard</span>
                  <em>₹120 per trip</em>
                </div>
              </div>
            </Reveal>

            <Reveal delay={420} className="panel">
              <div className="panel-header compact">
                <div>
                  <p className="eyebrow">{copy.payments}</p>
                  <h2>{copy.paymentsTitle}</h2>
                </div>
              </div>

              <div className="timeline">
                {paymentTimeline.map((step) => (
                  <div key={step.label} className={`timeline-item ${step.tone}`}>
                    <span className="timeline-dot" aria-hidden="true" />
                    <div>
                      <strong>{step.label}</strong>
                      <small>{step.date}</small>
                    </div>
                    <em>{step.value}</em>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={480} className="panel grievance-panel">
              <div className="panel-header compact">
                <div>
                  <p className="eyebrow">{copy.support}</p>
                  <h2>{disputeCard.title}</h2>
                </div>
                <span className="status-dot warning">{disputeCard.status}</span>
              </div>

              <p>{disputeCard.summary}</p>
              <button type="button" className="secondary-btn wide">{copy.raiseGrievance}</button>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  )
}

function BuyerDashboard({ setSelectedRole, language, setLanguage, user }) {
  const copy = dashboardCopy[language]
  const [availableLots, setAvailableLots] = useState(buyerLotCatalog)
  const [filters, setFilters] = useState({
    crop: 'All',
    grade: 'Any',
    minQty: '10',
    radius: '25',
    ready: 'Any',
  })
  const [selectedLotId, setSelectedLotId] = useState(buyerLotCatalog[0].id)
  const [sortBy, setSortBy] = useState('match')
  const [savedLots, setSavedLots] = useState([])
  const [offerSent, setOfferSent] = useState(false)
  const [offerForm, setOfferForm] = useState({
    price: '2680',
    terms: 'Immediate pickup',
    notes: 'Quality A soybean available near Beed. Prefer same-day pickup for a 42 qtl lot.',
  })

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return
    getLots().then(({ data }) => {
      if (!data?.length) return
      setAvailableLots(data.map((lot) => ({ id: lot.id, sourceId: lot.id, crop: lot.crop, quality: lot.grade, quantity: lot.quantity, location: lot.location, distance: 'Nearby', readyDate: lot.ready_date, farmer: 'Verified farmer', match: 92, price: 0, status: lot.status, trust: 90 })))
    })
  }, [user?.id])

  const filteredLots = useMemo(() => {
    return availableLots.filter((lot) => {
      const cropMatch = filters.crop === 'All' || lot.crop === filters.crop
      const gradeMatch = filters.grade === 'Any' || lot.quality === filters.grade
      const qtyMatch = Number(lot.quantity) >= Number(filters.minQty || 0)
      const radiusMatch = Number(lot.distance.replace(/\D/g, '')) <= Number(filters.radius)
      const readyMatch = filters.ready === 'Any' || lot.readyDate <= filters.ready
      return cropMatch && gradeMatch && qtyMatch && radiusMatch && readyMatch
    })
  }, [availableLots, filters])

  const demandMatches = useMemo(() => {
    const matches = rankBuyerMatches(filteredLots)
    if (sortBy === 'price') return [...matches].sort((a, b) => b.price - a.price)
    if (sortBy === 'quantity') return [...matches].sort((a, b) => b.quantity - a.quantity)
    if (sortBy === 'distance') return [...matches].sort((a, b) => Number(a.distance.replace(/\D/g, '')) - Number(b.distance.replace(/\D/g, '')))
    return matches
  }, [filteredLots, sortBy])
  const selectedLot = filteredLots.find((lot) => lot.id === selectedLotId) ?? filteredLots[0] ?? availableLots[0]

  const resetFilters = () => setFilters({ crop: 'All', grade: 'Any', minQty: '10', radius: '25', ready: 'Any' })
  const toggleSavedLot = (lotId) => setSavedLots((current) => current.includes(lotId) ? current.filter((id) => id !== lotId) : [...current, lotId])
  const submitOffer = async () => {
    if (isSupabaseConfigured && user?.id && selectedLot?.sourceId) {
      const { error } = await createOffer({ lot_id: selectedLot.sourceId, buyer_id: user.id, price: Number(offerForm.price), payment_terms: offerForm.terms, notes: offerForm.notes })
      if (error) return
    }
    setOfferSent(true)
    window.setTimeout(() => setOfferSent(false), 3500)
  }

  const buyerSummary = [
    { label: copy.matchingLots, value: String(filteredLots.length), detail: copy.sortedDemand, tone: 'gold' },
    { label: copy.avgLot, value: '₹2,670/qtl', detail: copy.nearbyLots, tone: 'green' },
    { label: copy.fastestPickup, value: '11 Sep', detail: copy.readyDispatch, tone: 'soft' },
    { label: copy.trustScore, value: '94/100', detail: copy.pastBuyer, tone: 'neutral' },
  ]

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <span className="brand-mark small">Farmly</span>
          <span className="brand-tag">{copy.buyerNetwork}</span>
        </div>

        <nav className="topnav" aria-label="Buyer dashboard navigation">
          <a href="#discover">{copy.discover}</a>
          <a href="#offers">{copy.offers}</a>
          <a href="#bulk">{copy.bulk}</a>
          <a href="#payments">{copy.payments}</a>
        </nav>

        <div className="topbar-actions">
          <div className="segment-control" aria-label="Language toggle">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={language === option.value ? 'is-selected' : ''}
                onClick={() => setLanguage(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className="ghost-btn" type="button" onClick={() => setSelectedRole(null)}>
            {copy.switchRole}
          </button>
        </div>
      </header>

      <main className="dashboard-page" id="discover">
        <section className="hero-panel dashboard-hero buyer-hero">
          <div>
            <p className="eyebrow accent">{copy.buyerEyebrow}</p>
            <h1>{copy.buyerTitle}</h1>
            <p className="hero-copy">{copy.buyerBody}</p>
          </div>
          <div className="hero-summary buyer-summary">
            <span className="summary-chip">{copy.demandMatch}</span>
            <strong>94%</strong>
            <small>{copy.bestFit}</small>
          </div>
        </section>

        <section className="stats-grid">
          {buyerSummary.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} detail={item.detail} tone={item.tone} />
          ))}
        </section>

        <section className="content-grid">
          <Reveal delay={80} className="panel wide-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.discover}</p>
                <h2>{copy.filterLots}</h2>
              </div>
              <button type="button" className="text-button" onClick={resetFilters}>{copy.resetFilters}</button>
            </div>

            <div className="filter-grid">
              <label>
                Crop
                <select value={filters.crop} onChange={(event) => setFilters((current) => ({ ...current, crop: event.target.value }))}>
                  <option>All</option>
                  <option>Soybean</option>
                  <option>Tur</option>
                  <option>Jowar</option>
                </select>
              </label>

              <label>
                {copy.qualityGrade}
                <select value={filters.grade} onChange={(event) => setFilters((current) => ({ ...current, grade: event.target.value }))}>
                  <option>{copy.any}</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </label>

              <label>
                Min qty
                <input
                  type="number"
                  value={filters.minQty}
                  onChange={(event) => setFilters((current) => ({ ...current, minQty: event.target.value }))}
                />
              </label>

              <label>
                Radius
                <select value={filters.radius} onChange={(event) => setFilters((current) => ({ ...current, radius: event.target.value }))}>
                  <option value="15">15 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </label>

              <label>
                {copy.readyBy}
                <select value={filters.ready} onChange={(event) => setFilters((current) => ({ ...current, ready: event.target.value }))}>
                  <option value="Any">Any</option>
                  <option value="2026-09-12">12 Sep</option>
                  <option value="2026-09-15">15 Sep</option>
                  <option value="2026-09-18">18 Sep</option>
                </select>
              </label>
            </div>
          </Reveal>

          <Reveal delay={140} className="panel">
            <div className="panel-header compact">
              <div>
                <p className="eyebrow">AI match</p>
                <h2>Demand ranking</h2>
              </div>
            </div>

            <div className="match-toolbar">
              <span>{demandMatches.length} {copy.matches}</span>
              <select aria-label="Sort lots" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="match">{copy.bestMatch}</option>
                <option value="price">{copy.highestPrice}</option>
                <option value="quantity">{copy.largestVolume}</option>
                <option value="distance">{copy.nearest}</option>
              </select>
            </div>
            <div className="match-stack">
              {demandMatches.slice(0, 3).map((lot) => (
                <div key={lot.id} className="match-card">
                  <div className="offer-head">
                    <div>
                      <strong>{lot.crop}</strong>
                      <small>{lot.location}</small>
                    </div>
                    <BuyerBadge score={lot.matchScore} />
                  </div>
                  <p>{lot.farmer} · Grade {lot.quality} · {lot.quantity} qtl</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="content-grid stacked-grid" id="offers">
          <Reveal delay={180} className="panel wide-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.recommendedSupply}</p>
                <h2>{copy.recommendedSupply}</h2>
              </div>
            </div>

            <div className="lot-cards buyer-lot-cards">
              {filteredLots.length === 0 && <div className="empty-state"><strong>{copy.noLots}</strong><p>{copy.widenFilters}</p><button type="button" className="secondary-btn" onClick={resetFilters}>{copy.showAll}</button></div>}
              {filteredLots.map((lot) => (
                <button
                  key={lot.id}
                  type="button"
                  className={`lot-card buyer-lot-card ${selectedLot?.id === lot.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedLotId(lot.id)}
                >
                  <div className="lot-topline">
                    <strong>{lot.crop}</strong>
                    <span className="lot-actions"><span className="status-pill">Match {lot.match}%</span><span role="button" tabIndex="0" className={`save-lot ${savedLots.includes(lot.id) ? 'is-saved' : ''}`} onClick={(event) => { event.stopPropagation(); toggleSavedLot(lot.id) }} onKeyDown={(event) => { if (event.key === 'Enter') { event.stopPropagation(); toggleSavedLot(lot.id) } }} aria-label={savedLots.includes(lot.id) ? 'Remove saved lot' : 'Save lot'}>{savedLots.includes(lot.id) ? '★' : '☆'}</span></span>
                  </div>
                  <div className="lot-meta">
                    <span>{lot.quantity} qtl</span>
                    <span>Grade {lot.quality}</span>
                    <span>{lot.location}</span>
                  </div>
                  <div className="lot-bottomline">
                    <small>{lot.readyDate}</small>
                    <small>{lot.distance}</small>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>

          <div className="stacked-panels">
            <Reveal delay={220} className="panel">
              <div className="panel-header compact">
                <div>
                  <p className="eyebrow">{copy.buyerRole}</p>
                  <h2>{copy.purchaseProfile}</h2>
                </div>
              </div>

              <div className="buyer-profile-card">
                <div className="profile-header">
                  <strong>AgroTrade Processors</strong>
                  <BuyerBadge score={96} />
                </div>
                <div className="profile-row">
                  <span>Typical volume</span>
                  <strong>500 qtl/month</strong>
                </div>
                <div className="profile-row">
                  <span>Preferred lots</span>
                  <strong>Soybean · A-grade</strong>
                </div>
                <div className="profile-row">
                  <span>Reliability</span>
                  <strong>98.4% on-time</strong>
                </div>
              </div>
            </Reveal>

            <Reveal delay={260} className="panel">
              <div className="panel-header compact">
                <div>
                  <p className="eyebrow">{copy.offers}</p>
                  <h2>{copy.makeOffer}</h2>
                </div>
              </div>

              <div className="offer-form compact-offer-form">
                <label>
                  {copy.proposedPrice}
                  <input
                    type="number"
                    value={offerForm.price}
                    onChange={(event) => setOfferForm((current) => ({ ...current, price: event.target.value }))}
                  />
                </label>

                <label>
                  {copy.terms}
                  <select value={offerForm.terms} onChange={(event) => setOfferForm((current) => ({ ...current, terms: event.target.value }))}>
                    <option>Immediate pickup</option>
                    <option>7-day payout</option>
                    <option>15-day payout</option>
                    <option>Advance + balance</option>
                  </select>
                </label>

                <label>
                  {copy.notes}
                  <textarea
                    rows="3"
                    value={offerForm.notes}
                    onChange={(event) => setOfferForm((current) => ({ ...current, notes: event.target.value }))}
                  />
                </label>

                <button type="button" className="primary-btn wide" onClick={submitOffer}>{offerSent ? copy.offerSent : `${copy.sendOffer}${selectedLot ? ` · ${selectedLot.farmer}` : ''}`}</button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="content-grid" id="bulk">
          <Reveal delay={300} className="panel wide-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{copy.bulkVolume}</p>
                <h2>{copy.combineLots}</h2>
              </div>
            </div>

            <div className="bulk-grid">
              <div className="bulk-card">
                <strong>FPO Beed Collective</strong>
                <span>42 qtl · Grade A</span>
                <em>Ready 18 Sep</em>
              </div>
              <div className="bulk-card">
                <strong>Pimpalner cluster</strong>
                <span>18 qtl · Grade A</span>
                <em>Ready 12 Sep</em>
              </div>
              <div className="bulk-card highlight-card">
                <strong>Combined volume</strong>
                <span>60 qtl</span>
                <em>Best fit for 1 truck dispatch</em>
              </div>
            </div>
          </Reveal>

          <Reveal delay={340} className="panel" id="payments">
            <div className="panel-header compact">
              <div>
                <p className="eyebrow">{copy.payments}</p>
                <h2>{copy.commitment}</h2>
              </div>
            </div>

            <div className="timeline">
              {buyerPaymentTracks.map((step) => (
                <div key={step.label} className={`timeline-item ${step.tone}`}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <div>
                    <strong>{step.label}</strong>
                    <small>{step.date}</small>
                  </div>
                  <em>{step.value}</em>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  )
}

function LanguagePicker({ language, setLanguage }) {
  return (
    <div className="segment-control landing-language" aria-label="Language toggle">
      {languageOptions.map((option) => (
        <button key={option.value} type="button" className={language === option.value ? 'is-selected' : ''} onClick={() => setLanguage(option.value)}>{option.label}</button>
      ))}
    </div>
  )
}

function AuthModal({ language, setSelectedRole, onAuthenticated, onClose, initialMode = 'login' }) {
  const authLabels = language === 'hi'
    ? { register: 'रजिस्टर करें', joinWelcome: 'Farmly से जुड़ें', createWorkspace: 'अपना Farmly कार्यक्षेत्र बनाएं', registerBody: 'डेमो खाता बनाएं और अपनी भूमिका के अनुसार कार्यक्षेत्र शुरू करें।', fullName: 'पूरा नाम', createAccount: 'खाता बनाएं' }
    : language === 'mr'
      ? { register: 'नोंदणी करा', joinWelcome: 'Farmly मध्ये सामील व्हा', createWorkspace: 'तुमचे Farmly कार्यक्षेत्र तयार करा', registerBody: 'डेमो खाते तयार करा आणि तुमच्या भूमिकेनुसार कार्यक्षेत्र सुरू करा.', fullName: 'पूर्ण नाव', createAccount: 'खाते तयार करा' }
      : { register: 'Register', joinWelcome: 'Join Farmly', createWorkspace: 'Create your Farmly workspace.', registerBody: 'Create a demo account and start with the workspace that fits your role.', fullName: 'Full name', createAccount: 'Create account' }
  const copy = { ...dashboardCopy[language], ...authLabels }
  const [role, setRole] = useState('farmer')
  const [mode, setMode] = useState(initialMode)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitted(true)

    if (!isSupabaseConfigured) {
      window.setTimeout(() => setSelectedRole(role), 250)
      return
    }

    const result = mode === 'login'
      ? await signIn(form.email, form.password)
      : await signUp({ email: form.email, password: form.password, fullName: form.fullName, role })

    if (result.error) {
      setSubmitted(false)
      setError(result.error.message)
      return
    }

    const user = result.data?.user
    if (user && mode === 'register') {
      await createProfile({ id: user.id, full_name: form.fullName, role })
    }
    onAuthenticated(user, role)
  }

  return (
    <div className="login-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'login' ? copy.login : copy.register}>
      <div className="login-modal">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close login">×</button>
        <div className="auth-tabs"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setSubmitted(false) }}>{copy.login}</button><button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setSubmitted(false) }}>{copy.register}</button></div>
        <p className="eyebrow accent">{mode === 'login' ? copy.welcome : copy.joinWelcome}</p><h2>{mode === 'login' ? copy.workspace : copy.createWorkspace}</h2><p className="login-subtitle">{mode === 'login' ? copy.demoAccount : copy.registerBody}</p>
        <form className="login-form" onSubmit={handleSubmit}>{mode === 'register' && <label>{copy.fullName}<input required value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Your name" /></label>}<label>{copy.mobileEmail}<input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" /></label><label>{copy.password}<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="••••••••" /></label><div className="login-role-toggle"><button type="button" className={role === 'farmer' ? 'active' : ''} onClick={() => setRole('farmer')}>{copy.farmerRole}</button><button type="button" className={role === 'buyer' ? 'active' : ''} onClick={() => setRole('buyer')}>{copy.buyerRole}</button></div>{error && <p className="auth-error">{error}</p>}<button type="submit" className="primary-btn wide">{submitted ? copy.opening : mode === 'login' ? copy.login : copy.createAccount}</button></form>
        <small className="login-note">{copy.demoMode}</small>
      </div>
    </div>
  )
}

function ExploreModal({ language, setSelectedRole, onClose }) {
  const copy = dashboardCopy[language]
  return (
    <div className="login-backdrop explore-backdrop" role="dialog" aria-modal="true" aria-label="Explore Farmly">
      <div className="login-modal explore-modal">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close explorer">×</button>
        <p className="eyebrow accent">{copy.marketLinkages}</p>
        <h2>Choose your marketplace view.</h2>
        <p className="login-subtitle">Explore a role-based demo now. You can register when you are ready to keep your workspace.</p>
        <div className="explore-role-grid">
          <button type="button" className="explore-role-card" onClick={() => setSelectedRole('farmer')}>
            <strong>{copy.farmerRole}</strong>
            <span>Prices, lots, offers, and sale windows</span>
            <b>↗</b>
          </button>
          <button type="button" className="explore-role-card" onClick={() => setSelectedRole('buyer')}>
            <strong>{copy.buyerRole}</strong>
            <span>Verified supply, matching, and procurement</span>
            <b>↗</b>
          </button>
        </div>
        <button type="button" className="secondary-btn wide" onClick={onClose}>Back to Farmly</button>
      </div>
    </div>
  )
}

function LandingAICoach({ copy, onExploreWorkspace }) {
  const [messages, setMessages] = useState([
    { role: 'user', text: 'Should I sell my soybean today?' },
    {
      role: 'coach',
      title: 'My read: hold 4 days.',
      text: 'Prices are moving up. Your storage window is safe, and the best offer is currently ₹2,680/qtl.',
      meta: 'Based on 5 local signals',
    },
  ])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  const ask = (raw) => {
    const question = (raw || draft).trim()
    if (!question || busy) return
    setBusy(true)
    setMessages((current) => [...current, { role: 'user', text: question }])
    setDraft('')
    window.setTimeout(() => {
      const reply = getNLQueryResponse(question)
      setMessages((current) => [
        ...current,
        {
          role: 'coach',
          title: 'Farmly coach',
          text: reply,
          meta: 'Demo answer · grounded in sample Beed market data',
        },
      ])
      setBusy(false)
    }, 380)
  }

  return (
    <section className="ai-section" id="ai-coach">
      <div className="ai-copy">
        <p className="landing-eyebrow">{copy.aiEyebrow}</p>
        <h2>{copy.aiTitle}</h2>
        <p>{copy.aiBody}</p>
        <div className="ai-cta-row">
          <button
            type="button"
            className="light-button"
            onClick={() => {
              document.getElementById('ai-coach-input')?.focus()
              ask('When should I sell my soybean?')
            }}
          >
            {copy.aiCta}
            <span>↗</span>
          </button>
          <button type="button" className="ghost-light-btn" onClick={onExploreWorkspace}>
            Open full workspace
          </button>
        </div>
      </div>

      <div className="ai-chat">
        <div className="chat-top">
          <span className="ai-spark">✦</span>
          <div>
            <strong>Farmly Coach</strong>
            <small>Market intelligence · online</small>
          </div>
          <span className="chat-menu">•••</span>
        </div>

        <div className="chat-thread">
          {messages.map((message, index) =>
            message.role === 'user' ? (
              <div className="chat-message user-message" key={`u-${index}`}>{message.text}</div>
            ) : (
              <div className="chat-message coach-message" key={`c-${index}`}>
                <span>✦</span>
                <div>
                  <strong>{message.title}</strong>
                  <p>{message.text}</p>
                  <em>{message.meta}</em>
                </div>
              </div>
            ),
          )}
        </div>

        <form
          className="chat-input-form"
          onSubmit={(event) => {
            event.preventDefault()
            ask()
          }}
        >
          <input
            id="ai-coach-input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about a crop, price, or buyer"
            aria-label="Ask the market"
          />
          <button type="submit" disabled={busy || !draft.trim()}>↑</button>
        </form>
      </div>
    </section>
  )
}

function DashboardPreview() {
  const [selectedMetric, setSelectedMetric] = useState('sale')
  const metrics = {
    sale: { label: 'Sale window', value: 'Hold 4 days', detail: 'Prices are trending upward toward 12 Sep.' },
    offers: { label: 'Live offers', value: '03', detail: 'The highest verified buyer offer is ₹2,680/qtl.' },
    net: { label: 'Net realisation', value: '₹40,200', detail: 'Estimated amount after transport and storage.' },
  }
  const selected = metrics[selectedMetric]

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1f4d3a]/20 bg-[#123628] shadow-[0_20px_48px_rgba(18,53,40,0.22)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-sm font-semibold text-[#f7f3e9]">
          Farmly <small className="ml-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-white/45">farmer workspace</small>
        </span>
        <span className="text-[0.68rem] font-semibold text-emerald-300">● Live market</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/45">Today’s signal</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">
            ₹2,450<span className="ml-1 text-xs font-medium text-white/45">/qtl</span>
          </p>
          <p className="mt-1 text-xs text-white/55">
            Soybean · Beed Mandi <b className="ml-1 text-emerald-300">+1.8%</b>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{selected.detail}</p>
        </div>
        <div className="relative min-h-[120px] rounded-xl border border-white/10 bg-white/5 p-3">
          <svg viewBox="0 0 220 90" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="previewFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#e8b84b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M8 70 L45 58 L80 62 L115 40 L150 46 L210 18 L210 90 L8 90 Z" fill="url(#previewFill)" />
            <path d="M8 70 L45 58 L80 62 L115 40 L150 46 L210 18" fill="none" stroke="#e8b84b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="210" cy="18" r="4" fill="#e8b84b" />
          </svg>
          <span className="absolute right-3 top-2 text-[0.65rem] font-semibold text-[#e8b84b]">₹2,680 best offer</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          {Object.entries(metrics).map(([key, metric]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedMetric(key)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                selectedMetric === key
                  ? 'border-[#e8b84b]/50 bg-[#e8b84b]/15'
                  : 'border-white/10 bg-white/5 hover:bg-white/8'
              }`}
            >
              <small className="block text-[0.58rem] uppercase tracking-wide text-white/45">{metric.label}</small>
              <strong className="mt-1 block text-sm font-semibold text-white">{metric.value}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LandingPage({ language, setLanguage, onLogin, onRegister, onExplore }) {
  const copy = landingCopy[language]
  const landingRef = useRef(null)

  useEffect(() => {
    const root = landingRef.current
    if (!root) return undefined
    const revealItems = root.querySelectorAll('.landing-hero, .trusted-strip, .landing-section, .ai-section, .final-cta')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.16 })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page" ref={landingRef}>
      <header className="landing-nav"><a className="landing-brand" href="#top"><span>Farmly</span><small>market linkages</small></a><nav className="landing-links" aria-label="Primary navigation"><a href="#how-it-works">{copy.nav[0]}</a><a href="#features">{copy.nav[1]}</a><a href="#market-pulse">Prices</a><a href="#ai-coach">{copy.nav[3]}</a></nav><div className="landing-actions"><LanguagePicker language={language} setLanguage={setLanguage} /><button type="button" className="primary-btn nav-cta" onClick={onRegister}>{copy.cta}<span>↗</span></button></div></header>
      <main id="top">
        <section className="landing-hero landing-hero-premium">
          <div className="hero-content">
            <p className="landing-eyebrow">{copy.eyebrow} <span>•</span> 01</p>
            <h1>{copy.title}</h1>
            <p className="landing-intro">{copy.intro}</p>
            <div className="hero-actions">
              <button type="button" className="primary-btn hero-button" onClick={onExplore}>{copy.primary}<span>↗</span></button>
              <a className="text-link" href="#market-pulse">{copy.secondary} <span>↓</span></a>
            </div>
            <p className="hero-trust"><span className="trust-avatars"><i>MP</i><i>AK</i><i>SD</i></span>{copy.trusted}</p>
          </div>
          <div className="hero-art">
            <LandingHeroPanel />
          </div>
        </section>
        <div className="trusted-strip">
  <div className="rtl-marquee">

    <div className="trusted-copy">
      Built for the people who grow and move India's food.
    </div>

    <div className="trusted-partner">
      FPO NETWORK
    </div>

    <div className="trusted-partner">
      AGROTRADE
    </div>

    <div className="trusted-partner">
      SAHYADRI FOODS
    </div>

    <div className="trusted-partner">
      MAHA PULSE CO.
    </div>

    {/* Duplicate for seamless infinite loop */}

    <div className="trusted-copy">
      Built for the people who grow and move India's food.
    </div>

    <div className="trusted-partner">
      FPO NETWORK
    </div>

    <div className="trusted-partner">
      AGROTRADE
    </div>

    <div className="trusted-partner">
      SAHYADRI FOODS
    </div>

    <div className="trusted-partner">
      MAHA PULSE CO.
    </div>

  </div>
</div>
        <section className="landing-section stats-section">
  <div className="section-intro">
    <p className="landing-eyebrow">The Farmly effect</p>

    <h2>
      {effectCopy[language].title}
      <br />
      <em>{effectCopy[language].accent}</em>
    </h2>
  </div>

  <div className="landing-stats">
    <AnimatedStat
      value={2680}
      label={copy.stats[0][1]}
      type="price"
      delay={0}
    />

    <AnimatedStat
      value={94}
      label={copy.stats[1][1]}
      type="percent"
      delay={120}
    />

    <AnimatedStat
      value={18}
      label={copy.stats[2][1]}
      type="minutes"
      delay={240}
    />

    <AnimatedStat
      value={3200}
      label={copy.stats[3][1]}
      type="members"
      delay={360}
    />
  </div>
</section>
        <section className="landing-section feature-section" id="features"><div className="section-intro centered"><p className="landing-eyebrow">{copy.featuresEyebrow}</p><h2>{copy.featuresTitle}</h2></div><div className="feature-grid">{copy.features.map(([number, title, body]) => <article className="feature-card" key={number}><span className="feature-number">{number}</span><div><h3>{title}</h3><p>{body}</p></div><span className="feature-arrow">↗</span></article>)}</div></section>
        <section className="landing-section how-section" id="how-it-works"><div className="section-intro"><p className="landing-eyebrow">{copy.howEyebrow}</p><h2>{copy.howTitle}</h2></div><div className="how-grid">{copy.how.map(([number, title, body], index) => <article className="how-card" key={number}><div className="how-number">{number}<span>{index < 2 ? '→' : '✓'}</span></div><h3>{title}</h3><p>{body}</p></article>)}</div></section>

        <section className="landing-section market-pulse-section" id="market-pulse">
          <div className="section-intro mx-auto max-w-2xl text-center">
            <p className="landing-eyebrow">Price discovery</p>
            <h2 className="font-display">See the market move before you sell.</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/65">Compare crop trends and the mandi heat matrix — then open the workspace for full ENR ranking.</p>
          </div>
          <div className="mx-auto mt-6 grid max-w-5xl gap-4 px-4 lg:grid-cols-[1.35fr_0.65fr]">
            <LandingPriceGraph />
            <div className="flex flex-col gap-2.5">
              <article className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/50">Mandi</span>
                <strong className="mt-1 block text-xl font-semibold text-white">₹2,450</strong>
                <small className="text-xs text-white/50">Beed yard · today</small>
              </article>
              <article className="rounded-xl border border-farm-gold/35 bg-gradient-to-br from-farm-gold/20 to-farm-mid/30 px-4 py-3">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-farm-gold">Best net path</span>
                <strong className="mt-1 block text-xl font-semibold text-white">₹2,470 ENR</strong>
                <small className="text-xs text-white/65">Processor after costs</small>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/50">Sale window</span>
                <strong className="mt-1 block text-xl font-semibold text-white">Hold 4 days</strong>
                <small className="text-xs text-white/50">Trend still rising</small>
              </article>
              <article className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-xs leading-relaxed text-emerald-100/90">
                Tip: gold cells are peak yards — compare with ENR, not board price alone.
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section preview-section !bg-[#dce5d8]">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="preview-heading !p-0">
              <p className="landing-eyebrow">{copy.previewEyebrow}</p>
              <h2 className="!max-w-[16ch]">{copy.previewTitle}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4a5f52]">
                One calm view of prices, offers, quality, logistics, and the decision in front of you.
              </p>
              <div className="mt-5 hidden lg:block">
                <InteractiveMarketScene />
              </div>
            </div>
            <div className="space-y-4">
              <DashboardPreview />
              <div className="lg:hidden">
                <InteractiveMarketScene />
              </div>
            </div>
          </div>
        </section>

        <LandingAICoach copy={copy} onExploreWorkspace={onExplore} />

        <section className="landing-section social-section !bg-[#f4f1ea]">
          <div className="mx-auto max-w-5xl">
            <div className="section-intro centered mx-auto max-w-xl">
              <p className="landing-eyebrow">{copy.testimonialsEyebrow}</p>
              <h2 className="!mx-auto !max-w-[16ch]">{copy.testimonialsTitle}</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {copy.testimonials.map(([quote, name, role]) => (
                <article
                  key={name}
                  className="rounded-2xl border border-[#1f4d3a]/12 bg-white p-5 shadow-[0_12px_32px_rgba(20,53,40,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(20,53,40,0.12)]"
                >
                  <div className="text-3xl font-bold leading-none text-[#b17b2b]">“</div>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[#355345]">{quote}</p>
                  <footer className="mt-5 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d9b460] text-xs font-bold text-[#19382a]">
                      {name.split(' ').map((part) => part[0]).join('')}
                    </span>
                    <span>
                      <strong className="block text-sm text-[#143528]">{name}</strong>
                      <small className="text-xs text-[#748579]">{role}</small>
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta relative overflow-hidden !bg-gradient-to-br from-[#163d2c] via-[#1a4a35] to-[#0f2a20] !text-white !py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,160,23,0.2),transparent_42%)]" />
          <div className="relative z-[1] mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-sm sm:px-7 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="!text-farm-gold landing-eyebrow">Ready when your harvest is</p>
              <h2 className="!mt-2 !max-w-[18ch] !text-[clamp(1.55rem,2.8vw,2.2rem)] !leading-snug !text-white">{copy.finalTitle}</h2>
              <p className="!mt-2 !max-w-md !text-sm !leading-relaxed !text-white/65">{copy.finalBody}</p>
            </div>
            <button type="button" className="light-button !mt-0 shrink-0 !bg-farm-gold !text-farm-ink shadow-lg shadow-black/20" onClick={onRegister}>
              {copy.cta}
              <span>↗</span>
            </button>
          </div>
        </section>
      </main>
      <LandingFooter footerText={copy.footer} onRegister={onRegister} />
    </div>
  )
}

export default function App() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [language, setLanguage] = useState('en')
  const [lots, setLots] = useState(initialLots)
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [exploreOpen, setExploreOpen] = useState(false)

  const openLogin = () => setAuthMode('login')
  const openRegister = () => setAuthMode('register')
  const openExplore = () => setExploreOpen(true)

  return (
    <div className="page-shell">
      {!selectedRole && <LandingPage language={language} setLanguage={setLanguage} onLogin={openLogin} onRegister={openRegister} onExplore={openExplore} />}
      {selectedRole === 'farmer' && <FarmerDashboard lots={lots} setLots={setLots} setSelectedRole={setSelectedRole} language={language} setLanguage={setLanguage} user={user} />}
      {selectedRole === 'buyer' && <BuyerDashboard setSelectedRole={setSelectedRole} language={language} setLanguage={setLanguage} user={user} />}
      {authMode && !selectedRole && <AuthModal language={language} initialMode={authMode} onAuthenticated={(authenticatedUser, role) => { setUser(authenticatedUser); setSelectedRole(role); setAuthMode(null) }} setSelectedRole={(role) => { setSelectedRole(role); setAuthMode(null) }} onClose={() => setAuthMode(null)} />}
      {exploreOpen && !selectedRole && !authMode && <ExploreModal language={language} setSelectedRole={(role) => { setSelectedRole(role); setExploreOpen(false) }} onClose={() => setExploreOpen(false)} />}
    </div>
  )
}
