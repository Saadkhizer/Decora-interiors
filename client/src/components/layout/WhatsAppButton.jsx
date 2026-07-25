import { whatsappLink } from '../../config/site.js';

// Floating WhatsApp contact button (bottom-left, clear of the toast stack).
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lift transition-transform duration-200 hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden="true">
        <path d="M16.04 4C9.48 4 4.16 9.32 4.16 15.88c0 2.34.68 4.52 1.86 6.36L4 28l5.96-1.96a11.8 11.8 0 0 0 6.08 1.68h.01c6.56 0 11.88-5.32 11.88-11.88S22.6 4 16.04 4zm0 21.5h-.01a9.6 9.6 0 0 1-4.9-1.34l-.35-.21-3.62 1.18 1.2-3.53-.23-.36a9.6 9.6 0 0 1-1.47-5.13c0-5.31 4.32-9.63 9.64-9.63 2.57 0 4.99 1 6.81 2.82a9.56 9.56 0 0 1 2.82 6.81c0 5.32-4.32 9.62-9.64 9.62zm5.29-7.21c-.29-.15-1.71-.84-1.98-.94-.27-.1-.46-.15-.65.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.77.36-.26.29-1.01.99-1.01 2.41s1.04 2.79 1.18 2.98c.15.19 2.04 3.12 4.95 4.37.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
      </svg>
      <span className="absolute right-16 hidden whitespace-nowrap rounded-full bg-walnut px-3 py-1.5 text-xs text-cream shadow-card group-hover:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
