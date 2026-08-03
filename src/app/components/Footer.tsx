import { Instagram, Music2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      dir="rtl"
      className="border-t border-white/10 bg-[#16002E] px-6 py-8 text-white"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 md:flex-row">
        {/* وسائل التواصل */}
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#321064] transition hover:-translate-y-1 hover:bg-[#FACC15]"
          >
            <Instagram className="h-7 w-7" />
          </a>

          <a
            href="https://tiktok.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#321064] transition hover:-translate-y-1 hover:bg-[#FACC15]"
          >
            <Music2 className="h-7 w-7" />
          </a>
        </div>

        {/* الحقوق */}
        <p
          dir="ltr"
          className="text-center text-sm font-medium text-white/75"
        >
          Copyright {currentYear} Almaydan Ya Humaidan - All Rights Reserved ©
        </p>
      </div>
    </footer>
  );
}
