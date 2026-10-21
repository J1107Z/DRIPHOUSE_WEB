import type { Metadata } from 'next';
import { Inter, UnifrakturMaguntia } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const unifraktur = UnifrakturMaguntia({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gothic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DRIP HOUSE | Luxury Streetwear & Exclusividad',
  description:
    'Tienda virtual oficial de DRIP HOUSE. Streetwear de lujo importado: Godspeed, Jordan, Nike, Life Hustlers, Mixed Emotion, Prestige, Sneakers y Sprayground.',
  icons: {
    icon: '/ICONOAPP.png?v=2',
    shortcut: '/ICONOAPP.png?v=2',
    apple: '/ICONOAPP.png?v=2',
  },
};

/**
 * Script preventivo que limpia en tiempo real los atributos inyectados por extensiones
 * del navegador (como Bitdefender TrafficLight: bis_skin_checked, bis_register, __processed_*)
 * antes de que React 19 ejecute la hidratación del DOM.
 */
const CLEAN_EXTENSION_ATTRS_SCRIPT = `
(function () {
  function isExtensionAttr(name) {
    return (
      name === 'bis_skin_checked' ||
      name === 'bis_register' ||
      name.indexOf('bis_') === 0 ||
      name.indexOf('__processed_') === 0
    );
  }

  function cleanElement(el) {
    if (!el || !el.attributes) return;
    for (var i = el.attributes.length - 1; i >= 0; i--) {
      var attrName = el.attributes[i].name;
      if (isExtensionAttr(attrName)) {
        el.removeAttribute(attrName);
      }
    }
  }

  function cleanTree(root) {
    if (!root) return;
    cleanElement(root);
    if (root.querySelectorAll) {
      var nodes = root.querySelectorAll('*');
      for (var i = 0; i < nodes.length; i++) {
        cleanElement(nodes[i]);
      }
    }
  }

  cleanTree(document.documentElement);

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === 'attributes' && m.attributeName && isExtensionAttr(m.attributeName)) {
        m.target.removeAttribute(m.attributeName);
      } else if (m.type === 'childList') {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node.nodeType === 1) {
            cleanTree(node);
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  document.addEventListener('readystatechange', function () {
    cleanTree(document.documentElement);
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    cleanTree(document.documentElement);
  }, true);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${unifraktur.variable} dark`}
    >
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: CLEAN_EXTENSION_ATTRS_SCRIPT }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="marble-bg min-h-screen text-zinc-100 antialiased selection:bg-white selection:text-black"
      >
        <div className="flex min-h-screen" suppressHydrationWarning>
          <Sidebar />
          <main
            className="flex-1 lg:pl-20 pt-16 lg:pt-0 min-h-screen flex flex-col transition-all duration-300"
            suppressHydrationWarning
          >
            <div className="flex-1" suppressHydrationWarning>
              {children}
            </div>
            <footer
              className="border-t border-zinc-900 bg-black/70 px-6 py-8 text-xs text-zinc-500"
              suppressHydrationWarning
            >
              <div
                className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
                suppressHydrationWarning
              >
                <div className="flex items-center gap-3" suppressHydrationWarning>
                  <img
                    src="/ICONOAPP.png?v=2"
                    alt="DRIP HOUSE"
                    className="w-6 h-6 rounded object-cover border border-zinc-800"
                  />
                  <span className="font-gothic text-base text-zinc-300 tracking-wide">
                    Drip House
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span>Streetwear Luxury Imports</span>
                </div>
                <div className="flex items-center gap-6" suppressHydrationWarning>
                  <a
                    href="https://www.instagram.com/driphouse_imports/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    @driphouse_imports
                  </a>
                  <a
                    href="mailto:contacto@driphouse.com"
                    className="hover:text-white transition"
                  >
                    contacto@driphouse.com
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
