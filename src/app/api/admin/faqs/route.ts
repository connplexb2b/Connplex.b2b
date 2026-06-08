import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FAQItem from '@/models/FAQItem';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_FAQS = [
  {
    question: 'What are the location requirements for starting a Connplex Cinemas franchise?',
    answer: `At Connplex Cinemas, we typically look for spaces ranging from 7,000 to 15,000 sq. ft., depending on the number of screens, seating capacity, and cinema format selected.\n\nThe ideal property should also offer:\n• Clear height ranging from 11 ft. to 24 ft. & more\n• Strong visibility and accessibility\n• High-footfall surroundings\n• Strong catchment potential\n• Entertainment and retail compatibility\n\nWe believe the right location becomes the heart of the city's entertainment ecosystem. Whether it's a mall, high street, mixed-use development, or standalone property — if your location has the potential to become a leisure destination, it could be the perfect fit for Connplex.`,
    order: 0,
    category: 'General',
    isActive: true
  },
  {
    question: 'Do I need to own a property to start a Connplex franchise?',
    answer: `Not necessarily. While owning a property is an advantage, it is not mandatory to partner with Connplex Cinemas.\n\nMany of our successful franchise partners operate from leased or long-term rental spaces that meet our cinema development standards.\n\nWhat matters most is:\n• The right location\n• Strong audience potential\n• Proper layout feasibility\n• Commercial viability\n\nWhether you own the property or plan to lease one, our team will help evaluate and guide the opportunity.`,
    order: 1,
    category: 'General',
    isActive: true
  },
  {
    question: 'What is the minimum investment required to open a Connplex Cinemas franchise?',
    answer: `The investment depends on the cinema format, city category, screen count, and property condition.\n\nTypically, Franchise investment starts from ₹2 Crore onwards for cinema or auditorium development.\n\nThis usually includes:\n• Interior development\n• Cinema seating\n• Projection systems\n• Sound & acoustics\n• F&B setup\n• Technology infrastructure\n• Branding elements\n\nThe overall investment may vary depending on:\n• Tier 1 / Tier 2 / Tier 3 city\n• Number of screens\n• Premium or luxury format selection\n• Existing site readiness`,
    order: 2,
    category: 'General',
    isActive: true
  },
  {
    question: 'What kind of returns and payback period can I expect?',
    answer: `Cinema is one of the few entertainment businesses with strong cash-flow potential, as customers pay upfront through ticketing and F&B purchases.\n\nWith Connplex's proven business model and operational support, franchise partners can typically expect:\n• Attractive ROI opportunities\n• Estimated payback within 18–24 months\n• Long-term recurring revenue potential\n• Multiple revenue streams through ticketing, F&B, advertising, and events\n\nActual returns may vary depending on location performance and operational scale.`,
    order: 3,
    category: 'General',
    isActive: true
  },
  {
    question: 'How soon can I launch my Connplex Cinemas after approval?',
    answer: `Once the location and agreement are finalized, the development process moves quickly.\n\nOn average, a Connplex Cinemas franchise can become operational within 3–6 months, depending on:\n• Site readiness\n• Construction requirements\n• Number of screens\n• Interior scope\n• Technology installation timelines\n\nFor ready-to-develop sites, timelines can be even faster.`,
    order: 4,
    category: 'General',
    isActive: true
  },
  {
    question: 'Do I need prior cinema or business experience to start?',
    answer: `Not at all.\n\nConnplex Cinemas is designed for entrepreneurs, developers, investors, and business owners who want to enter the entertainment industry with expert support.\n\nYou do not need prior cinema experience because our team provides:\n• End-to-end guidance\n• Operational training\n• SOP frameworks\n• Technology integration\n• Marketing support\n• Launch assistance\n\nAll you need is the vision to build a landmark entertainment destination — we'll help you bring it to life.`,
    order: 5,
    category: 'General',
    isActive: true
  },
  {
    question: 'What support will I receive as a Connplex franchise partner?',
    answer: `When you partner with Connplex, you gain access to a complete cinema ecosystem designed for long-term growth and operational success.\n\nOur Support Includes:\nLocation & Design Assistance\nSite evaluation, space planning, audience flow optimization, and premium cinema layout development.\n\nProject & Setup Guidance\nSupport for interiors, acoustics, projection systems, seating, sound engineering, and technology integration.\n\nOperations & Training\nComprehensive staff training, SOP implementation, and operational guidance to ensure smooth daily management.\n\nMarketing & Brand Support\nNational-level campaigns combined with localized marketing strategies to maximize awareness and footfalls.\n\nTechnology Integration\nAdvanced ticketing systems, automation tools, analytics dashboards, and digital infrastructure.\n\nOngoing Business Support\nContinuous assistance in operations, marketing, financial planning, and business optimization.\n\nAt Connplex, we don't just offer a franchise — we build long-term growth partnerships.`,
    order: 6,
    category: 'General',
    isActive: true
  },
  {
    question: 'Are there any franchise fees or revenue-sharing models?',
    answer: `Yes. Connplex Cinemas follows a transparent and performance-driven franchise model.\n\nThe Structure Typically Includes:\nOne-Time Franchise Fee\nA non-refundable fee that provides access to the Connplex brand, systems, expertise, and support ecosystem.\n\nRevenue Sharing Model\nA predefined revenue-sharing structure designed to ensure aligned growth for both Connplex and the franchise partner.\n\nTransparent Agreements\nClear commercial terms with no hidden operational surprises.\n\nOur goal is to create a sustainable and mutually profitable partnership.`,
    order: 7,
    category: 'General',
    isActive: true
  },
  {
    question: 'Will I get exclusivity in my city or region?',
    answer: `Yes, depending on the market size, city potential, and selected franchise format, Connplex may offer location-based exclusivity.\n\nThis helps:\n• Protect your market potential\n• Avoid brand saturation\n• Maintain premium positioning\n• Enable sustainable growth opportunities\n\nHowever, all exclusivity approvals are subject to Connplex management evaluation and final approval.`,
    order: 8,
    category: 'General',
    isActive: true
  },
  {
    question: 'What are the major revenue streams in a Connplex Cinemas franchise?',
    answer: `A Connplex franchise generates revenue through multiple channels, including:\n• Movie ticket sales\n• Food & beverage sales\n• Brand advertising\n• Celebrity & event activations\n• Sports screenings\n• Stand-up comedy & live shows\n• Gaming & experiential zones\n• Digital promotions\n\nThis diversified model helps maximize profitability.`,
    order: 9,
    category: 'General',
    isActive: true
  },
  {
    question: 'Can Connplex Cinemas be developed inside malls or mixed-use projects?',
    answer: `Yes. Connplex Cinemas can be integrated into:\n• Shopping malls\n• Commercial complexes\n• Mixed-use developments\n• High-street properties\n• Standalone entertainment hubs\n\nOur flexible cinema formats are designed to suit different real estate models.`,
    order: 10,
    category: 'General',
    isActive: true
  },
  {
    question: 'Does Connplex help with marketing before launch?',
    answer: `Absolutely.\n\nWe provide:\n• Pre-launch campaigns\n• Influencer marketing\n• PR & media coverage\n• Digital advertising\n• Outdoor branding\n• Launch event planning\n• Social media promotions\n\nOur objective is to create strong market buzz before your cinema opens.`,
    order: 11,
    category: 'General',
    isActive: true
  },
  {
    question: 'What cinema formats does Connplex offer?',
    answer: `Connplex offers multiple scalable formats including:\n• Luxuriance\n• Signature\n• Smart\n\nEach format is designed for different market sizes, audience segments, and investment capacities.`,
    order: 12,
    category: 'General',
    isActive: true
  },
  {
    question: 'Can I operate multiple Connplex franchise locations?',
    answer: `Yes. Connplex welcomes multi-location and regional expansion partnerships for qualified investors and developers.\n\nMany partners expand into multiple cities after successfully operating their first location.`,
    order: 13,
    category: 'General',
    isActive: true
  },
  {
    question: 'How do I apply for a Connplex Cinemas franchise?',
    answer: `You can apply by:\n• Filling out the franchise inquiry form\n• Sharing your property details\n• Connecting with our expansion team\n\nOnce submitted, our team will evaluate your location and discuss the next steps for partnership development.`,
    order: 14,
    category: 'General',
    isActive: true
  }
];

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Auto-seed if empty
    const count = await FAQItem.countDocuments();
    if (count === 0) {
      await FAQItem.insertMany(DEFAULT_FAQS);
    }

    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all') === 'true';

    const filter = getAll ? {} : { isActive: true };
    const faqs = await FAQItem.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(faqs);
  } catch (err: any) {
    console.error("MongoDB connection failed, falling back to default FAQs:", err);
    // Return mapped defaults so client has a valid payload format (e.g. question/answer instead of q/a if we use the backend schema keys)
    const mapped = DEFAULT_FAQS.map(item => ({
      _id: `faq-fallback-${item.order}`,
      question: item.question,
      answer: item.answer,
      order: item.order,
      category: item.category,
      isActive: item.isActive
    }));
    return NextResponse.json(mapped);
  }
}

// POST - Admin: create new FAQ
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const faq = await FAQItem.create(body);
    return NextResponse.json(faq, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
