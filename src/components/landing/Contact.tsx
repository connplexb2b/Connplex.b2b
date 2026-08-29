import { Mail, MapPin, Phone, Globe } from "lucide-react";

const items = [
  { icon: Phone, label: "Phone", value: "+91 99245 77557", href: "tel:+919924577557" },
  { icon: Mail, label: "Email", value: "marketing@theconnplex.com", href: "mailto:marketing@theconnplex.com" },
  { icon: Globe, label: "Website", value: "www.theconnplex.com", href: "https://www.theconnplex.com" },
  { icon: MapPin, label: "Head Office", value: "Ahmedabad, Gujarat", href: undefined },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-5">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Get In Touch</span>
        <h2 className="mt-5 text-4xl sm:text-6xl">Contact Us</h2>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.label} className="bg-background p-8">
              <i.icon className="size-6 text-gold" strokeWidth={1.4} />
              <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
                {i.label}
              </p>
              {i.href ? (
                <a href={i.href} className="mt-1 block text-lg transition-colors hover:text-gold">
                  {i.value}
                </a>
              ) : (
                <p className="mt-1 text-lg">{i.value}</p>
              )}
            </div>
          ))}
        </div>

        <footer className="mt-20 flex flex-col items-center gap-3 border-t border-border pt-10 text-center">
          <p className="font-display text-3xl tracking-[0.3em] text-gradient-gold">CONNPLEX</p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            India&apos;s Smart Luxury Cinema Chain · NSE Emerge Listed
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Connplex Cinemas. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
}
