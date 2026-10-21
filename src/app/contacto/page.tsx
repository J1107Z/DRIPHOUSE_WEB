import React from 'react';
import {
  Mail,
  MessageCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
} from 'lucide-react';

function InstagramIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactoPage() {
  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-5xl mx-auto space-y-10">
      <div className="border-b border-zinc-800/80 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
          Atención Personalizada &bull; Canales Oficiales
        </p>
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-wide mt-1">
          Contacto Drip House
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
          Comunícate directamente con nuestro equipo para cotizaciones, disponibilidad de
          tallas, pedidos mayoristas o seguimiento de envíos a nivel nacional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna 1: Líneas directas de WhatsApp */}
        <div className="marble-card rounded-2xl border border-zinc-800/90 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white text-black">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Líneas Oficiales de WhatsApp
                  </h2>
                  <p className="text-xs text-zinc-400">Respuesta inmediata de lunes a domingo</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4">
              Selecciona cualquiera de nuestras líneas oficiales para atención personalizada,
              consulta de disponibilidad de tallas y compras directas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://wa.me/573017600570"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition"
            >
              <span>Línea Principal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/573003173419"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest hover:border-white transition"
            >
              <span>Línea 2</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Columna 2: Instagram y Correo Electrónico */}
        <div className="space-y-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/driphouse_imports/"
            target="_blank"
            rel="noopener noreferrer"
            className="group marble-card block rounded-2xl border border-zinc-800/90 p-6 sm:p-8 hover:border-zinc-400 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white group-hover:bg-white group-hover:text-black transition">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
                    Red Social Oficial
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    @driphouse_imports
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    https://www.instagram.com/driphouse_imports/
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-white transition" />
            </div>
            <p className="mt-4 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4">
              Síguenos en Instagram para conocer los nuevos drops, historias de clientes
              reales y lanzamientos exclusivos cada semana.
            </p>
          </a>

          {/* Correo Electrónico */}
          <a
            href="mailto:contacto@driphouse.com"
            className="group marble-card block rounded-2xl border border-zinc-800/90 p-6 sm:p-8 hover:border-zinc-400 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white group-hover:bg-white group-hover:text-black transition">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
                    Correo Electrónico Oficial
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    contacto@driphouse.com
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Soporte comercial, colaboraciones y prensa
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-white transition" />
            </div>
          </a>

          {/* Información adicional */}
          <div className="marble-card rounded-2xl border border-zinc-800/90 p-6 grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider">Horario</p>
                <p className="text-zinc-400 mt-0.5">Atención continua 24/7 vía WhatsApp</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white uppercase tracking-wider">Autenticidad</p>
                <p className="text-zinc-400 mt-0.5">Importación directa verificada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
