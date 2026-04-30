01 — VISION DESIGN
Direction artistique
Tone : Institutionnel africain moderne — sobre, puissant, digne de confiance. Pas un site ONG générique. Un produit gouvernemental qui inspire confiance et modernité.
Différenciateur mémorable : Le motif géométrique Kente — utilisé comme texture subtile dans le Hero et le footer — ancre visuellement le projet en Guinée sans être folklorique.
Principe de mise en page : Asymétrie contrôlée. Sections qui alternent entre fond clair #F5FAF6 et fond sombre #0D1B12. Scroll narrative — chaque section répond à une question du jury.

02 — STACK TECHNIQUE
Framework     React 18 (Vite)
Styling       Tailwind CSS v3
Animations    Framer Motion
Fonts         Google Fonts — Sora + DM Sans + JetBrains Mono
Icons         Lucide React
Routing       Aucun (Single Page, ancres)
Build         Vite
Deploy        Vercel / Netlify (statique)
Installation
bashnpm create vite@latest identiguinee -- --template react
cd identiguinee
npm install tailwindcss framer-motion lucide-react
npx tailwindcss init

03 — DESIGN TOKENS
Palette complète
js// tailwind.config.js
colors: {
  green:   { DEFAULT: '#009A44', dark: '#007A36', light: '#E8F5EE' },
  gold:    { DEFAULT: '#FCD116', dark: '#D4A800' },
  red:     { DEFAULT: '#CE1126', light: '#FEE8EB' },
  dark:    { DEFAULT: '#0D1B12', 800: '#162419', 700: '#1F3320' },
  surface: '#FFFFFF',
  bg:      '#F5FAF6',
  border:  '#D0E8D8',
  text:    { primary: '#1A2E1F', muted: '#5A7A62' },
}
Typographie
jsfontFamily: {
  display: ['Sora', 'sans-serif'],      // Titres — weight 700/800
  body:    ['DM Sans', 'sans-serif'],   // Corps — weight 400/500
  mono:    ['JetBrains Mono', 'monospace'], // Hashes blockchain
}
Espacements clés
Section padding vertical    : py-24 (desktop) / py-16 (mobile)
Container max-width         : max-w-6xl mx-auto px-6
Card border-radius          : rounded-2xl
Navbar height               : h-16

04 — ARCHITECTURE DES COMPOSANTS
src/
├── main.jsx
├── App.jsx
├── index.css              ← @tailwind directives + custom CSS
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── Problem.jsx
│   │   ├── Solution.jsx
│   │   ├── Portal.jsx
│   │   ├── Blockchain.jsx
│   │   └── Impact.jsx
│   └── ui/
│       ├── StatCard.jsx
│       ├── StepCard.jsx
│       ├── OddBadge.jsx
│       ├── HashBadge.jsx
│       ├── SectionTitle.jsx
│       └── AnimatedCounter.jsx
└── hooks/
    └── useInView.js       ← Intersection Observer custom hook

05 — SPÉCIFICATIONS PAR COMPOSANT

Navbar.jsx
Comportement : Fixe en haut. Fond transparent au-dessus du Hero → fond blanc avec backdrop-blur au scroll.
Contenu :

Gauche : Logo (shield SVG vert + "IdentiGuinée" Sora bold)
Centre : Liens d'ancrage — Problème Solution Portail Blockchain Impact
Droite : Bouton Voir le prototype → (vert rempli, petit)

Animation : framer-motion — slide-down + fade-in au montage. Transition background au scroll avec useScroll.
Mobile : Menu hamburger avec drawer latéral animé.

Hero.jsx
Layout : 2 colonnes — texte gauche (55%) / visuel droite (45%).
Contenu gauche (ordre vertical) :

Badge pill : MIABE Hackathon 2026 · Projet GN-02 · Catégorie D06 — fond vert clair, texte vert
Titre H1 : "IdentiGuinée" — Sora 800, taille massive (text-7xl desktop)
Sous-titre : "Zéro corruption. Zéro intermédiaire. 100% automatisé." — DM Sans, text-xl, muted
Badges ODD : 2 pills côte à côte — ODD 10 or + ODD 16 vert
2 boutons CTA :

Principal : Voir la solution ↓ (vert rempli)
Secondaire : Voir le prototype → (outlined vert)



Contenu droite :

Mockup browser/phone avec screenshot Écran 01 (placeholder image avec fond vert clair si pas encore de screenshot)
Badge flottant en bas du mockup : NaissanceChain · En ligne ● fond sombre

Arrière-plan :

Fond #F5FAF6
Motif Kente SVG en overlay, opacity 4%, couvrant toute la section

Animations Framer Motion :

Texte gauche : staggered fade-up (délais 0.1s, 0.2s, 0.3s...)
Visuel droite : fade-in + légère translation depuis la droite
Badge hackathon : pulse subtil en boucle


Problem.jsx
Fond : #0D1B12 (dark) — contraste maximal pour choquer avec les chiffres.
Titre : "Obtenir un document d'identité en Guinée : un parcours semé de corruption" — Sora, blanc.
4 StatCards — grille 2×2 desktop / 1 col mobile :
Composant StatCardPropsvalue="150/180"label="Rang corruption TI 2023" color="red"value="70%"label="Guinéens victimes de paiements informels" color="gold"value="<25%"label="Communes avec système informatique" color="red"value="500 000 GNF"label="Prix d'un faux passeport" color="gold"
AnimatedCounter : chiffres comptent de 0 à leur valeur finale quand la section entre dans le viewport (Intersection Observer).
Timeline "Parcours du citoyen aujourd'hui" — 4 étapes rouges :

Composant vertical avec ligne connectrice rouge
Chaque étape : numéro cerclé rouge + texte blanc


Il se déplace au bureau d'état civil
Il attend des heures sans résultat
Un agent lui demande un paiement informel
S'il refuse de payer, il repart sans document

2 badges conséquences : ⚠ Fraude électorale + ⚠ Trafic d'identité — fond rouge translucide, texte rouge clair.
Source : petit texte bas de section — Transparency International 2023 · TI Guinée 2022
Animations : Chaque StatCard : fade-up avec délai croissant. Timeline : chaque étape apparaît avec délai en cascade.

Solution.jsx
Fond : #F5FAF6 (clair) — respiration après le dark.
Titre : "IdentiGuinée automatise tout. Zéro agent. Zéro pot-de-vin."
Flux 4 étapes — horizontal desktop / vertical mobile :

Composants StepCard connectés par flèche →
Chaque card : icône Lucide + numéro + titre + description courte

#TitreIcône1Créer un compteUserPlus2Soumettre la demandeFileText3Vérification automatiqueShield4Télécharger le documentDownload
Tableau "Avant / Avec" — 2 colonnes :

Colonne gauche ❌ : fond rouge très clair #FEE8EB, bordure rouge
Colonne droite ✅ : fond vert très clair #E8F5EE, bordure verte
5 lignes de comparaison (voir données Section 2.5 du CDC contenu)

4 cards utilisateurs finaux — grille 2×2 :

Citoyen guinéen · Administration publique · Écoles/Hôpitaux/Employeurs · Ministère


Portal.jsx
Fond : #0D1B12 — cohérence avec section Problem.
Titre : "Le portail IdentiGuinée en images"
3 sous-sections avec titres :
A — Espace Citoyen
Grille 2×2 de cards — chaque card :

Screenshot (image placeholder stylisé si pas de screenshot)
Numéro écran en badge vert
Titre + description

ÉcranTitreDescription01LandingAccès public, aucun intermédiaire requis02Formulaire4 types de documents · Upload pièces03Suivi de statutNaissanceChain live · Réf REQ-2026-0084704Document certifiéArmoiries · QR code · PDF signé
B — Vérification Tiers
2 cards côte à côte :

Card verte : état AUTHENTIQUE — checkmark + détails
Card rouge : état INVALIDE — ✗ + message d'erreur
Texte : "Vérifiable en 3 secondes par toute administration guinéenne"

C — Administration
1 card large — screenshot Écran 05
KPI badge central : 0 interventions manuelles = 0 corruption possible
Métriques sous la card : 247 demandes · 2min 14s · 100% automatisé
CTA centré : Voir le prototype interactif complet →

Blockchain.jsx
Fond : #F5FAF6
Titre : "La blockchain rend la corruption techniquement impossible"
3 colonnes de features :
IcôneTitreDescriptionEyeTransparentChaque action enregistrée, auditable par tousCpuAutomatiséSmart contracts, zéro décision humaineLockInfalsifiableSignature cryptographique vérifiable en 3s
Schéma flux NaissanceChain — composant visuel animé :
Nœuds connectés horizontalement avec flèches animées (Framer Motion path draw) :
[Citoyen] → [Portail] → [Smart Contract] → [NaissanceChain] → [Document + QR]
Hash affiché sous le schéma : 0x3f9a8c2b1e...d42c — JetBrains Mono, vert
Badge : Enregistré sur NaissanceChain ●
Bloc "Pourquoi pas une simple base de données ?" :
Card sombre #0D1B12 avec 3 points comparatifs :

❌ Une DB peut être modifiée discrètement par un administrateur
✅ Un smart contract s'exécute sans intervention possible
✅ La blockchain est auditée par tous, pas par un seul agent


Impact.jsx
Fond : #009A44 (vert fort) — section émotionnelle, couleur pleine.
Titre : "Ce que IdentiGuinée change pour les Guinéens" — blanc.
2 cards ODD — fond blanc translucide, backdrop-blur :

ODD 10 : "Les citoyens les plus pauvres accèdent enfin aux documents auxquels ils ont droit, sans payer de pot-de-vin"
ODD 16 : "La confiance dans les institutions publiques augmente. La corruption dans l'état civil recule structurellement."

Chiffre fort centré :
0 pot-de-vin. 2 minutes. 1 document certifié. — Sora 800, blanc, très grand.
Citation encadrée :

"Un système de délivrance automatique supprime les opportunités de corruption."
— Cahier des charges MIABE Hackathon 2026

Fond : blanc translucide, bordure gauche or #FCD116, italic, DM Sans.

Footer.jsx
Fond : #0D1B12
Layout 3 colonnes :

Gauche : Logo + tagline + badges ODD 10 / ODD 16
Centre : Projet GN-02 · Catégorie D06 · MIABE Hackathon 2026 + Darollo Technologies Corporation + www.miabehackathon.com + Thème : "La Blockchain, levier du développement durable africain"
Droite : Ministère de l'Administration du Territoire de Guinée + Lien prototype Stitch

Séparateur : ligne fine #D0E8D8 opacity 20%
Motif Kente en overlay, opacity 3%, fond du footer.

06 — ANIMATIONS — SPÉCIFICATIONS FRAMER MOTION
| Élément | Animation | Déclencheur |
| :--- | :--- | :--- |
| **Navbar** | Slide-down + fade | Montage page |
| **Hero texte** | Staggered fade-up (0.1s delay par élément) | Montage page |
| **Hero visuel** | Fade-in + translateX(40px→0) | Montage page |
| **Toutes les Sections** | **Fade-in global (opacity: 0→1, y: 30→0)** | **InView (entrée dans le viewport)** |
| **StatCards** | Fade-up en cascade (0.1s entre chaque) | InView |
| **AnimatedCounter** | Compteur 0 → valeur finale (1.5s ease-out) | InView |
| **Timeline étapes** | Apparition séquentielle (0.2s entre chaque) | InView |
| **StepCards** | Fade-up + échelle 0.95→1 | InView |
| **Schéma NaissanceChain** | Path draw SVG gauche→droite | InView |
| **Cards portail** | Hover : translateY(-4px) + shadow | Hover |
| **CTA buttons** | Hover : scale(1.02) + shadow | Hover |
Hook custom useInView :
js// hooks/useInView.js
import { useEffect, useRef, useState } from 'react'
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

07 — RESPONSIVE
BreakpointComportementMobile < 768pxNavbar → hamburger · Hero 1 col · Grilles → 1 col · Flux solution → verticalTablet 768–1024pxGrilles → 2 col · Hero 2 col compactDesktop > 1024pxLayout complet tel que spécifié

08 — PERFORMANCES & ACCESSIBILITÉ

Images : format WebP, lazy loading natif loading="lazy"
Fonts : display=swap Google Fonts
Couleurs : contraste WCAG AA minimum respecté (vert sur blanc ✓)
Balises sémantiques : <header> <main> <section> <footer> <nav>
aria-label sur tous les boutons et liens d'ancrage
prefers-reduced-motion : désactiver animations si activé


09 — ORDRE DE DÉVELOPPEMENT
1. Setup Vite + Tailwind config (tokens couleurs/fonts)
2. Navbar + Footer (layout global)
3. Hero (section la plus visible)
4. Problem (données chiffrées + compteurs)
5. Solution (flux + tableau avant/après)
6. Portal (galerie maquettes)
7. Blockchain (schéma animé)
8. Impact (section émotionnelle)
9. Animations Framer Motion globales
10. Responsive mobile
11. Optimisation performances