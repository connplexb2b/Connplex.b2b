import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import NewsArticle from '@/models/NewsArticle';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_NEWS = [
  {
    slug: "next-gen-auditorium",
    date: "20 MAY 2024",
    title: "Connplex Unveils Its Next-Gen Auditorium",
    imagePath: "/news/news_1.jpeg",
    shortDesc: "A new era of cinematic luxury is here. Experience bigger screens, immersive sound, and unmatched comfort.",
    body: `<p><strong>Connplex Cinemas is proud to announce the official launch of our Next-Generation Auditorium, setting a new benchmark for cinematic luxury in India.</strong></p>
<p>Designed for the ultimate film connoisseur, the new auditorium features a state-of-the-art 4K Dual Laser Projection system that delivers stunning contrast, incredible brightness, and millions of vibrant colors. Accompanying this visual masterpiece is a customized 64-channel Dolby Atmos sound system, enveloping the audience in realistic audio from all directions.</p>
<p>But the innovation doesn't stop at screen and sound. The auditorium offers premium leather recliners with private USB charging ports, heated seating options, and an integrated waiter-on-call service so you can enjoy gourmet meals during your movie without leaving your seat.</p>
<ul>
    <li><span><strong>Visuals:</strong> Dual Laser 4K Projection System with HDR10 support.</span></li>
    <li><span><strong>Acoustics:</strong> 64-Channel immersive Dolby Atmos surround sound.</span></li>
    <li><span><strong>Seating:</strong> Premium plush Italian leather full-recliners.</span></li>
    <li><span><strong>Service:</strong> Personal digital butler for in-seat gourmet dining.</span></li>
</ul>
<p>Experience the future of movies today. Bookings are now open for all upcoming blockbuster releases.</p>`,
    buttonText: "BOOK TICKETS NOW",
    isActive: true,
    order: 0
  },
  {
    slug: "movie-mania",
    date: "10 MAY 2024",
    title: "Monthly Movie Mania",
    imagePath: "/news/news_2.jpeg",
    shortDesc: "Enjoy amazing films at exclusive prices all month long. Don't miss out on the magic!",
    body: `<p><strong>Unleash your passion for cinema with our monthly Movie Mania, featuring unprecedented ticket pricing, exclusive combos, and double loyalty rewards.</strong></p>
<p>Every Tuesday and Thursday throughout the month, Connplex Premium Cinemas invites you to experience selected masterpieces at a flat price. This promotion is designed to celebrate both Hollywood blockbusters and regional cinema favorites, making high-end movie-going accessible to all our patrons.</p>
<p>Additionally, our concession stands are offering a 30% discount on gourmet snack combos, including our famous golden truffle popcorn and bespoke sparkling mocktails. Connplex Privilege members will also earn double reward points on all purchases made during Movie Mania days.</p>
<ul>
    <li><span><strong>Flat Ticket Prices</strong> on all standard screenings every Tuesday & Thursday.</span></li>
    <li><span><strong>30% Off</strong> on all gourmet concession combos.</span></li>
    <li><span><strong>Double Reward Points</strong> for Privilege Card members.</span></li>
    <li><span><strong>Exclusive Giveaways</strong> during select weekend screenings.</span></li>
</ul>
<p>Gather your family and friends, and join us to indulge in pure cinematic joy. Terms and conditions apply.</p>`,
    buttonText: "EXPLORE SHOWTIMES",
    isActive: true,
    order: 1
  },
  {
    slug: "private-screenings",
    date: "02 MAY 2024",
    title: "Introducing Private Screenings",
    imagePath: "/news/news_3.jpeg",
    shortDesc: "Celebrate your special moments with personalized screenings in a luxurious setting.",
    body: `<p><strong>Transform your next gathering into an extraordinary red-carpet event with Connplex Private Screenings.</strong></p>
<p>Whether you are celebrating a milestone birthday, hosting a corporate product launch, or planning an intimate family reunion, our private cinema rentals offer an unmatched level of privacy, luxury, and customization. You can choose to screen the latest theatrical releases, classic movies, or even stream personal gaming tournaments on the giant silver screen.</p>
<p>Our dedicated events team will curate every detail of your evening, from custom red-carpet arrivals and ambient floral design to a tailored multi-course menu prepared by our executive chefs.</p>
<ul>
    <li><span><strong>Exclusive Cinema Access:</strong> Fully private auditorium hire.</span></li>
    <li><span><strong>Custom Playlists:</strong> Latest blockbusters, timeless classics, or gaming setups.</span></li>
    <li><span><strong>Bespoke Catering:</strong> Tailored menus, fine wines, and artisanal mocktails.</span></li>
    <li><span><strong>Red Carpet Service:</strong> VIP entrance, photography, and dedicated event butler.</span></li>
</ul>
<p>Let us create memories that last a lifetime. Get in touch with our event curators today to request a quote.</p>`,
    buttonText: "INQUIRE ABOUT PRIVATE SCREENINGS",
    isActive: true,
    order: 2
  },
  {
    slug: "privilege-card",
    date: "25 APR 2024",
    title: "Privilege Card Benefits Just Got Better!",
    imagePath: "/news/news_4.jpeg",
    shortDesc: "More rewards, more experiences, more reasons to be a part of the Connplex family.",
    body: `<p><strong>Elevate your lifestyle with the newly enhanced Connplex Privilege Membership, offering a gateway to ultimate cinema luxury.</strong></p>
<p>We are delighted to introduce a premium suite of privileges designed to reward our most loyal patrons. The Connplex Privilege Card is not just a loyalty program; it is your passport to curated entertainment, offering priority booking, exclusive lounge access, and premium ticket upgrades.</p>
<p>New cardholders will immediately receive complimentary welcome vouchers, free popcorn upgrades, and invitations to exclusive member-only advance movie previews. Experience cinema the way it was always meant to be experienced.</p>
<ul>
    <li><span><strong>15% Reward Back:</strong> Earn points on every ticket and concession spend.</span></li>
    <li><span><strong>Priority Lounge Access:</strong> Relax in luxury before your show starts.</span></li>
    <li><span><strong>Free Ticket Upgrades:</strong> Complimentary upgrades to gold recliner seating.</span></li>
    <li><span><strong>Advance Previews:</strong> Invites to exclusive screenings before official release.</span></li>
</ul>
<p>Apply for your Connplex Privilege Card online or visit any of our box office locations to join today.</p>`,
    buttonText: "APPLY FOR PRIVILEGE CARD",
    isActive: true,
    order: 3
  }
];

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Auto-seed if empty
    const count = await NewsArticle.countDocuments();
    if (count === 0) {
      await NewsArticle.insertMany(DEFAULT_NEWS);
    }

    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all') === 'true';

    const filter = getAll ? {} : { isActive: true };
    const articles = await NewsArticle.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(articles);
  } catch (err: any) {
    console.error("News GET api error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const article = await NewsArticle.create(body);
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
