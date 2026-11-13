import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CornerDownLeft,
  MousePointer2,
  Volume2,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import {
  CursorGlyph,
  SwarmAction,
} from '@/shared/blocks/swarm/site';
import { SwarmStructuredData } from '@/shared/blocks/swarm/structured-data';

export const revalidate = 3600;

const metrics = [
  ['15', 'cursor agents'],
  ['4,000', 'layer ceiling'],
  ['0', 'network requests'],
  ['1 click', 'to wipe a page'],
] as const;

const rebuildCards = [
  {
    tag: 'RECT',
    title: 'Boxes become live geometry',
    body: 'A crosshair drags out every box with a live W × H badge, then the real fill fades in. Fills, borders, radii, shadows, gradients, masks and backdrop blur all survive the trip.',
    tone: 'blue',
    demo: 'box',
  },
  {
    tag: 'TYPE',
    title: 'Text is typed back into place',
    body: 'Text layers are cloned with their computed styles — fonts, links, inline code, icons and pseudo-elements — then retyped with an I-beam and a blinking caret.',
    tone: 'violet',
    demo: 'type',
  },
  {
    tag: 'PEN',
    title: 'Lines are drawn, not faked',
    body: 'Single-side borders and horizontal rules become pen-tool lines: anchor points first, then a rubber-band path that snaps the stroke down exactly where it belongs.',
    tone: 'coral',
    demo: 'pen',
  },
  {
    tag: 'MEDIA',
    title: 'Images and frames come back',
    body: 'Images, SVGs, video, canvas and iframes return as media layers. The real asset fades in from a grey placeholder, with images sweeping in from top to bottom.',
    tone: 'green',
    demo: 'media',
  },
  {
    tag: 'ALT + DRAG',
    title: 'Repeated parts multiply',
    body: 'Repeated siblings are detected as one master plus duplicates. The swarm alt-drags a copy, measures the red gap, then retypes the text, swaps the image or restyles it.',
    tone: 'amber',
    demo: 'duplicate',
  },
  {
    tag: 'GUIDE',
    title: 'Baselines snap together',
    body: 'Figma-style rulers slide in, red guides get pulled out, and text snaps onto shared left edges and baselines. The layout starts to feel measured again.',
    tone: 'pink',
    demo: 'guide',
  },
] as const;

const steps = [
  {
    number: '01',
    title: 'Snapshot',
    body: 'The extension walks the live DOM, including open shadow roots, and turns it into a blueprint. Page structure becomes rects, text layers, pen lines, media and guides. Repeated siblings become one master plus duplicates.',
  },
  {
    number: '02',
    title: 'Blank',
    body: 'A full-viewport layer, isolated from the page CSS in its own shadow root, covers the page with its own background color. A quick hidden scroll pass wakes lazy images and reveal-on-scroll content first.',
  },
  {
    number: '03',
    title: 'Rebuild',
    body: 'Each cursor runs a small generator script per task. Children wait for their parent box, duplicates wait for their master, and the whole page unlocks from top to bottom as you scroll.',
  },
  {
    number: '04',
    title: 'Go live',
    body: 'When the last layer lands, the cursors flock to your pointer. Go live fades back to the real, clickable page. Replay builds the whole thing again whenever you want to watch.',
  },
] as const;

const limits = [
  [
    'Chrome-only surfaces',
    'Chrome does not let extensions run on chrome:// pages, the Web Store or the PDF viewer. The toolbar icon shows a red × there.',
  ],
  [
    'A visual rebuild',
    'Animations freeze at the moment you click. Some decorative pseudo-elements are skipped when their position cannot be worked out.',
  ],
  [
    'Off-screen media',
    'Canvases, videos and iframes below the first screen become placeholders, because Chrome only allows the screenshot on the visible tab.',
  ],
  [
    'No scripts run twice',
    'Web components are rebuilt as plain styled elements. None of the page scripts execute inside the swarm layer.',
  ],
  [
    'Large pages are capped',
    'Very long pages stop at roughly 4,000 layers or 40,000 pixels. The rebuild stays fast rather than trying to clone forever.',
  ],
  [
    'Optional access',
    'Automatic play is off by default. If you enable it, Chrome asks for access to the sites you choose, and switching back gives that access up.',
  ],
] as const;

const faqs = [
  [
    'What does Swarm Rebuild do?',
    'Click the extension on any website and the page fades to nothing. A swarm of colorful multiplayer cursors gathers around the site logo, then rebuilds the page piece by piece in front of you.',
  ],
  [
    'Does Swarm Rebuild collect or send page data?',
    'No. The page is read in your browser, the snapshot lives in that tab and is discarded when you exit. The extension makes no network requests of its own. Sound is synthesized locally with the Web Audio API.',
  ],
  [
    'What can I watch the swarm rebuild?',
    'Boxes, text, borders, images, video, canvas, iframes, repeated cards, navigation rows and list items. The swarm also pulls ruler guides and snaps text to shared baselines as it goes.',
  ],
  [
    'Can I control the pace?',
    'Yes. Scroll and the swarm chases you, with more agents joining the faster you go. Tour auto-scrolls at a pace the swarm can keep up with, and 1× / 2× / 3× changes build speed.',
  ],
] as const;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SwarmStructuredData />

      <section className="sw-hero">
        <div className="sw-hero-copy">
          <div className="sw-kicker">
            <span className="sw-kicker-dot" />
            Chrome extension
            <i />
            built on the motion of Swarm
          </div>
          <h1>
            Wipe any page.
            <span>Watch the swarm rebuild it.</span>
          </h1>
          <p className="sw-lede">
            One click turns any website into a blank canvas. A flock of
            multiplayer cursors draws the boxes, types the text, pulls the
            guides and brings the page back, live — the way a design team would
            in a design tool.
          </p>
          <div className="sw-hero-actions">
            <SwarmAction
              className="sw-button sw-button-primary sw-button-large"
              ctaId="hero_act"
            >
              Activate the swarm
              <ArrowRight aria-hidden="true" />
            </SwarmAction>
            <Link href="#how-it-works" className="sw-button sw-button-quiet sw-button-large">
              See how it rebuilds
              <ArrowDown aria-hidden="true" />
            </Link>
          </div>
          <div className="sw-hero-note">
            <span className="sw-avatar-stack" aria-hidden="true">
              {['#FF6B62', '#F5B82E', '#39C274', '#0D99FF', '#8B5CF6'].map(
                (color) => (
                  <i key={color} style={{ background: color }}>
                    <CursorGlyph color="#fff" />
                  </i>
                )
              )}
            </span>
            <span>15 agents · 61 layers · no data leaves your browser</span>
          </div>
        </div>

        <div className="sw-hero-visual">
          <div className="sw-browser-shadow">
            <Image
              src="/swarm/hero-canvas.png"
              alt="A browser page being rebuilt by a swarm of colored cursors, with selection boxes, dimension badges, rulers and a floating agent toolbar."
              width={1440}
              height={980}
              priority
              sizes="(max-width: 980px) 94vw, 58vw"
            />
          </div>
          <div className="sw-hero-live">
            <span />
            15 cursors live
          </div>
          <div className="sw-hero-sticker sw-sticker-a">
            <MousePointer2 />
            Maya is dragging a box
          </div>
          <div className="sw-hero-sticker sw-sticker-b">
            <CornerDownLeft />
            Text snapped to baseline
          </div>
        </div>
      </section>

      <section className="sw-metrics" aria-label="Product facts">
        {metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="sw-section sw-intro">
        <div className="sw-section-heading sw-section-heading-split">
          <div>
            <p className="sw-eyebrow">The whole trick</p>
            <h2>The page is gone. The rebuild is the show.</h2>
          </div>
          <p>
            Swarm Rebuild is a Chrome extension that wipes any web page to a
            blank canvas and lets a swarm of multiplayer cursors build it back,
            live: crosshair-drawn boxes, typed text, pen-tool lines, ruler
            guides and alt-drag duplicates, until the page looks just like it
            did before.
          </p>
        </div>
      </section>

      <section className="sw-section sw-rebuilds" id="rebuilds">
        <div className="sw-section-heading">
          <p className="sw-eyebrow">Layer by layer</p>
          <h2>What the swarm rebuilds</h2>
          <p>
            The animation is not one screenshot fading back in. Every visible
            part is inspected, split into a task and performed by a cursor that
            knows how that kind of object is built.
          </p>
        </div>

        <div className="sw-rebuild-grid">
          {rebuildCards.map((card) => (
            <article className={`sw-rebuild-card is-${card.tone}`} key={card.tag}>
              <div className={`sw-card-demo sw-demo-${card.demo}`} aria-hidden="true">
                <span className="sw-demo-tag">{card.tag}</span>
                {card.demo === 'box' && (
                  <>
                    <span className="sw-demo-box" />
                    <span className="sw-demo-size">286 × 184</span>
                  </>
                )}
                {card.demo === 'type' && (
                  <span className="sw-demo-type">
                    Build it back<span className="sw-caret" />
                  </span>
                )}
                {card.demo === 'pen' && (
                  <svg viewBox="0 0 260 100">
                    <path d="M18 76C70 7 130 95 242 27" />
                    <circle cx="18" cy="76" r="4" />
                    <circle cx="242" cy="27" r="4" />
                  </svg>
                )}
                {card.demo === 'media' && <span className="sw-demo-media" />}
                {card.demo === 'duplicate' && (
                  <span className="sw-demo-duplicates">
                    <i />
                    <i />
                    <i />
                    <em>12 px</em>
                  </span>
                )}
                {card.demo === 'guide' && (
                  <span className="sw-demo-guide">
                    <i />
                    <em>snap</em>
                  </span>
                )}
              </div>
              <div className="sw-rebuild-body">
                <p className="sw-card-tag">{card.tag}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sw-section sw-how" id="how-it-works">
        <div className="sw-section-heading">
          <p className="sw-eyebrow">The choreography</p>
          <h2>How the rebuild happens</h2>
          <p>
            The extension captures the page once, gets out of the way, then
            runs a tiny generator script for each cursor. The order is the
            design.
          </p>
        </div>

        <div className="sw-steps">
          {steps.map((step) => (
            <article key={step.number} className="sw-step">
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sw-section sw-split sw-scroll-section">
        <div className="sw-split-copy">
          <p className="sw-eyebrow">Scroll is the timeline</p>
          <h2>The swarm chases you.</h2>
          <p>
            Scroll and the rebuild follows. Move faster and more agents join.
            Tour auto-scrolls at the pace the swarm can keep up with for a clean
            screen recording. 1×, 2× and 3× change the build speed. Hide clears
            the toolbar completely; any move or key brings it back.
          </p>
          <ul className="sw-check-list">
            <li>
              <Check /> <span>Tour mode for hands-free screen recordings.</span>
            </li>
            <li>
              <Check /> <span>Sound on by default, with one-key mute.</span>
            </li>
            <li>
              <Check /> <span>Replay any page without refreshing it.</span>
            </li>
          </ul>
        </div>
        <div className="sw-scroll-demo" aria-label="Swarm toolbar preview">
          <div className="sw-scroll-ruler">
            {['0', '100', '200', '300', '400', '500', '600'].map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <div className="sw-scroll-canvas">
            <span className="sw-guide-line" />
            <div className="sw-scroll-block sw-scroll-block-a">
              <i />
              <i />
              <i />
            </div>
            <div className="sw-scroll-block sw-scroll-block-b">
              <i />
              <i />
            </div>
            <div className="sw-scroll-block sw-scroll-block-c" />
            <CursorGlyph color="#FF6B62" className="sw-mini-cursor sw-cursor-a" />
            <CursorGlyph color="#8B5CF6" className="sw-mini-cursor sw-cursor-b" />
            <CursorGlyph color="#39C274" className="sw-mini-cursor sw-cursor-c" />
            <span className="sw-dim-badge sw-dim-a">169 × 47</span>
            <span className="sw-dim-badge sw-dim-b">296 × 123</span>
          </div>
          <div className="sw-scroll-toolbar">
            <span className="sw-agent-dots">
              {['#FF6B62', '#F5B82E', '#39C274', '#0D99FF', '#8B5CF6'].map(
                (color) => (
                  <i key={color} style={{ background: color }} />
                )
              )}
            </span>
            <strong>15 agents</strong>
            <span className="sw-toolbar-progress">
              <i />
            </span>
            <span>61 / 61</span>
            <span className="sw-toolbar-pill">Tour</span>
            <span className="sw-toolbar-pill">1×</span>
          </div>
        </div>
      </section>

      <section className="sw-section sw-split sw-sound-section">
        <div className="sw-sound-card" aria-label="Sound synthesis illustration">
          <div className="sw-sound-head">
            <span className="sw-sound-icon">
              <Volume2 />
            </span>
            <div>
              <strong>Sound is on</strong>
              <span>synthesized live · no audio files</span>
            </div>
            <span className="sw-sound-key">M</span>
          </div>
          <div className="sw-waveform">
            {Array.from({ length: 52 }, (_, index) => (
              <i
                key={index}
                style={{
                  height: `${22 + Math.abs(Math.sin(index * 0.63)) * 68}%`,
                  animationDelay: `${index * 0.025}s`,
                }}
              />
            ))}
          </div>
          <div className="sw-sound-legend">
            <span>typing</span>
            <span>clicks</span>
            <span>guides</span>
            <span>glass piano</span>
          </div>
        </div>
        <div className="sw-split-copy">
          <p className="sw-eyebrow">A clicky-clacky soundtrack</p>
          <h2>You can hear the page come together.</h2>
          <p>
            Typing is a mechanical keyboard. Every mouse press gets a
            press-and-release click. Guides snap with a crisp tick. Boxes,
            images and duplicates land as sparse glass-piano notes from an E
            major pentatonic, every sound panned to its cursor.
          </p>
          <p>
            An airy swell covers the page dissolve. A short arpeggio fans the
            swarm out. A soft E-major chord closes the build. Press M any time
            to mute.
          </p>
        </div>
      </section>

      <section className="sw-section sw-limits">
        <div className="sw-section-heading sw-section-heading-split">
          <div>
            <p className="sw-eyebrow">Built for real pages</p>
            <h2>Every page is a stress test.</h2>
          </div>
          <p>
            This is a visual rebuild, not a clone. The charm is watching a
            design tool think in public. The limits are part of the honesty.
          </p>
        </div>
        <div className="sw-limits-grid">
          {limits.map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sw-privacy-band">
        <div className="sw-privacy-inner">
          <p className="sw-eyebrow">Private by default</p>
          <h2>Nothing leaves the tab.</h2>
          <p>
            The page snapshot and the one media screenshot live only in that
            tab&apos;s memory. The extension collects no data, sends none and
            loads no remote code. By default it only touches the tab you click,
            at the moment you click.
          </p>
          <div className="sw-privacy-pills">
            <span>No analytics</span>
            <span>No uploads</span>
            <span>No remote code</span>
          </div>
        </div>
      </section>

      <section className="sw-section sw-faq">
        <div className="sw-section-heading">
          <p className="sw-eyebrow">Questions, answered</p>
          <h2>What people ask before letting the swarm loose</h2>
        </div>
        <div className="sw-faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="sw-final-cta">
        <div className="sw-final-card">
          <div className="sw-final-cursors" aria-hidden="true">
            <CursorGlyph color="#FF6B62" />
            <CursorGlyph color="#F5B82E" />
            <CursorGlyph color="#39C274" />
            <CursorGlyph color="#0D99FF" />
            <CursorGlyph color="#8B5CF6" />
          </div>
          <p className="sw-eyebrow">Ready when you are</p>
          <h2>Let the swarm loose.</h2>
          <p>
            Open any page, click act and watch the blank canvas turn back into
            the site you were just reading. Then do it again somewhere else.
          </p>
          <SwarmAction
            className="sw-button sw-button-primary sw-button-large"
            ctaId="footer_act"
          >
            Activate the swarm
            <ArrowRight aria-hidden="true" />
          </SwarmAction>
          <span className="sw-final-note">
            Plans from $9/mo, or $7/mo billed annually · Stripe checkout
          </span>
        </div>
      </section>

      <section className="sw-credit">
        <p>
          This project is a tribute to{' '}
          <a href="https://califa.github.io/swarm-site/" target="_blank" rel="noreferrer">
            Swarm by Joel Califa
          </a>
          . The cursor set, flocking physics, build choreography, rulers and
          overall look inherit his motion language. What this adds is the part
          that points it at any page: snapshotting a live DOM into a blueprint
          the swarm can rebuild.
        </p>
      </section>
    </>
  );
}
