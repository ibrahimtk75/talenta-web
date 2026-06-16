import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Layout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary"><ArrowLeft size={15} /> Home</Link>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-mute">Last updated: 2026 · Talenta</p>
      <div className="mt-4 rounded-xl border border-amber/30 bg-amber/[0.06] p-4 text-[13px] text-amber">
        ⚠️ This is a starter template. Have it reviewed by a qualified lawyer before launch.
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function Sec({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold">{h}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-mute">{children}</p>
    </section>
  );
}

export function Terms() {
  return (
    <Layout title="Terms of Service">
      <Sec h="1. Acceptance">By creating an account or using Talenta ("the platform"), you agree to these Terms. If you do not agree, do not use the platform.</Sec>
      <Sec h="2. Who can use Talenta">Players, clubs, scouts, academies, schools and universities may register. Users under 18 require verifiable parent/guardian consent, and minors are contacted only through the platform with guardians notified.</Sec>
      <Sec h="3. Accounts & content">You are responsible for the accuracy of your profile, the content you upload (including videos), and for having the rights to any media you post. We may verify identity, age and affiliations.</Sec>
      <Sec h="4. Subscriptions & fees">Players join free; an optional Pro plan and club/academy subscriptions are billed as shown on the Pricing page. Talenta charges a 3% commission on deals successfully signed through the platform. Fees are non-refundable except where required by law.</Sec>
      <Sec h="5. Conduct">No harassment, fraud, fake profiles, scraping, or circumventing the platform to avoid commission. We may suspend accounts that breach these Terms.</Sec>
      <Sec h="6. Deals & disclaimer">Talenta is a marketplace that connects players and clubs. We are not an agent, employer, or party to any contract between users, and we do not guarantee trials, signings or outcomes.</Sec>
      <Sec h="7. Liability">The platform is provided "as is". To the extent permitted by law, Talenta is not liable for indirect or consequential losses arising from use of the platform.</Sec>
      <Sec h="8. Changes & contact">We may update these Terms; continued use means acceptance. Questions: aisolutons@gmail.com.</Sec>
    </Layout>
  );
}

export function Privacy() {
  return (
    <Layout title="Privacy Policy">
      <Sec h="1. What we collect">Account details (name, email, phone), profile data (date of birth, physical & career details, stats), uploaded media, messages, and usage data. For minors, guardian details and consent.</Sec>
      <Sec h="2. Why we use it">To run the platform: build profiles, power AI matching and search, enable contact between players and clubs, process subscriptions and deals, verify identity/age, and improve the service.</Sec>
      <Sec h="3. Video hosting">Skill reels and match videos are uploaded to YouTube (as Unlisted) and embedded back. YouTube's terms and privacy policy also apply to that content.</Sec>
      <Sec h="4. Sharing">Your public profile is visible to registered clubs, academies & scouts. We do not sell personal data. We use processors such as payment and hosting providers under appropriate agreements.</Sec>
      <Sec h="5. Minors">We apply additional safeguards for players under 18: guardian consent, guardian notification on contact, and restricted visibility options.</Sec>
      <Sec h="6. Your rights">Subject to local law (including GDPR where applicable), you may access, correct, export or delete your data, and withdraw consent. Contact us to exercise these rights.</Sec>
      <Sec h="7. Security & retention">We use reasonable safeguards and retain data only as long as needed for the purposes above or as required by law.</Sec>
      <Sec h="8. Contact">Privacy questions: aisolutons@gmail.com.</Sec>
    </Layout>
  );
}
