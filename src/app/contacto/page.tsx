'use client';

import React, { useState } from 'react';
import {
  Mail,
  MessageCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
  Sparkles,
  Send,
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

const QUICK_MESSAGES = [
  {
    label: 'Cotizar prenda',
    text: 'Hola DRIP HOUSE 🖤, quiero cotizar una prenda del catálogo y conocer métodos de pago.',
  },
  {
    label: 'Consultar talla',
    text: 'Hola DRIP HOUSE 🖤, necesito asesoría con las medidas y disponibilidad de tallas.',
  },
  {
    label: 'Pedido mayorista',
    text: 'Hola DRIP HOUSE 🖤, me interesa información sobre compras al por mayor.',
  },
  {
    label: 'Estado de envío',
    text: 'Hola DRIP HOUSE 🖤, quisiera consultar el seguimiento de mi pedido.',
  },
];

export default function ContactoPage() {
  const [customMessage, setCustomMessage] = useState(
    'Hola DRIP HOUSE 🖤, me gustaría recibir atención personalizada sobre el catálogo.'
  );

  const encodedMessage = encodeURIComponent(
    customMessage.trim() || 'Hola DRIP HOUSE 🖤, quiero más información.'
  );

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
        {/* Columna 1: Líneas directas de WhatsApp con personalizador de mensaje */}
        <div className="marble-card rounded-2xl border border-zinc-800/90 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Líneas Oficiales de WhatsApp
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Respuesta inmediata de lunes a domingo
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                En línea
              </span>
            </div>

            {/* Personalizador de mensaje */}
            <div className="rounded-xl border border-zinc-800/90 bg-black/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="whatsapp-custom-msg"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Personaliza tu mensaje</span>
                </label>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Opcional
                </span>
              </div>

              {/* Botones rápidos de motivo */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_MESSAGES.map((item) => {
                  const isActive = customMessage === item.text;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setCustomMessage(item.text)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition border ${
                        isActive
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <textarea
                id="whatsapp-custom-msg"
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escribe aquí tu consulta antes de abrir WhatsApp..."
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Botones grandes apilados uno debajo del otro */}
          <div className="flex flex-col gap-3.5 pt-2">
            <a
              href={`https://wa.me/573017600570?text=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-5 py-4 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.18)]"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-black text-white">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-black uppercase tracking-[0.2em]">
                    Línea Principal
                  </span>
                  <span className="block text-[11px] font-medium text-zinc-700 mt-0.5">
                    Ventas directas, tallas y envíos &bull; +57 301 760 0570
                  </span>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={`https://wa.me/573003173419?text=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-700 bg-zinc-900/90 text-white hover:border-white hover:bg-zinc-900 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white group-hover:bg-white group-hover:text-black transition">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-black uppercase tracking-[0.2em]">
                    Línea 2
                  </span>
                  <span className="block text-[11px] text-zinc-400 mt-0.5">
                    Atención secundaria y soporte VIP &bull; +57 300 317 3419
                  </span>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
