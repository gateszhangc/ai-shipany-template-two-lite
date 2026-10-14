import {
  ArrowRightFromLine,
  Brush,
  FileText,
  Forward,
  MessageSquareText,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Upload,
  VolumeX,
  Youtube,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { UdioAction } from '@/shared/blocks/udioai/site';
import { UdioStructuredData } from '@/shared/blocks/udioai/structured-data';

export const revalidate = 3600;

/** Deterministic waveform used for the hero and the editor demo. */
const heroWave = Array.from({ length: 200 }, (_, index) => {
  const noise = Math.abs(Math.sin(index * 12.9898) * 43758.5453) % 1;
  const shape = 0.3 + 0.7 * Math.sin((index / 199) * Math.PI);
  return Math.round(6 + shape * (24 + noise * 66));
});

const editorWave = Array.from({ length: 120 }, (_, index) => {
  const noise = Math.abs(Math.sin(index * 7.233) * 12543.21) % 1;
  return Math.round(18 + noise * 74);
});

const heroIcons = [
  ['Describe', MessageSquareText],
  ['Lyrics', FileText],
  ['Tuning', SlidersHorizontal],
  ['Generate', Sparkles],
] as const;

const covers = [
  '/udioai/cover-01.jpg',
  '/udioai/cover-02.jpg',
  '/udioai/cover-03.jpg',
  '/udioai/cover-04.jpg',
  '/udioai/cover-05.jpg',
  '/udioai/cover-06.jpg',
  '/udioai/cover-07.jpg',
  '/udioai/cover-08.jpg',
];

const songs = [
  {
    title: 'Other Brother - One More Time',
    tags: 'Progressive house · Big room',
    thumb: '/udioai/cover-01.jpg',
    duration: '4:35',
    active: true,
  },
  {
    title: 'You Could Be Mine',
    tags: 'Electro house · Ultra-lounge',
    thumb: '/udioai/cover-05.jpg',
    duration: '3:12',
  },
  {
    title: 'Scream with Your Inside Voice, Please (alternative version)',
    tags: 'Rock · Alternative rock',
    thumb: '/udioai/cover-06.jpg',
    duration: '2:58',
  },
  {
    title: 'Keep Your Faith',
    tags: 'Dark Pop · Teen Pop',
    thumb: '/udioai/cover-04.jpg',
    duration: '3:41',
  },
  {
    title: 'In Washington',
    tags: 'Northern american music · Contemporary country',
    thumb: '/udioai/cover-08.jpg',
    duration: '4:02',
  },
];

const discover = [
  ['Other Brother - One More Time', 'ViceroyFizz', '/udioai/grid-01.jpg'],
  ['You Could Be Mine', 'R2theM', '/udioai/grid-02.jpg'],
  [
    'Scream with Your Inside Voice, Please (alternative version)',
    'Elckerlijck',
    '/udioai/grid-03.jpg',
  ],
  ['Keep Your Faith', 'Skich Entertainment', '/udioai/grid-04.jpg'],
  ['In Washington', 'SeattleSysop', '/udioai/grid-05.jpg'],
  [
    'Rodeo Rebel - Country Rock Rap (alternative)',
    'Cyphertux',
    '/udioai/grid-06.jpg',
  ],
  [
    'Sugar and Wine (Granny Nan and The Banana Band)',
    'banana2™',
    '/udioai/grid-07.jpg',
  ],
  ['over the mooN', 'Redivider', '/udioai/grid-08.jpg'],
  ['Labyrinth of Sound (Instrumental)', 'Jaxon Wolfe', '/udioai/grid-09.jpg'],
  ['The Weirdness In My Dreams', 'Ascidity', '/udioai/grid-10.jpg'],
  ["Just Jammin'", 'Proxima Centauri b', '/udioai/grid-11.jpg'],
  ["Fool for Lovin' You", 'Bonham Lee', '/udioai/grid-12.jpg'],
  ['Dissident!', 'Fleetwood Hack', '/udioai/grid-13.jpg'],
  ['Lick My Lollipop', '-=ThePrompt👽HackeR=-', '/udioai/grid-14.jpg'],
  ['Zen', 'Spud Music', '/udioai/grid-15.jpg'],
] as const;

const editorTools = [
  ['Extend', ArrowRightFromLine, 'ua-chip-extend'],
  ['Inpaint', Brush, 'ua-chip-inpaint'],
  ['Remix', RotateCcw, 'ua-chip-remix'],
  ['Upload Song', Upload, ''],
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
      <UdioStructuredData />
      <section className="ua-hero">
        <h1 className="ua-hero-title">Make your music</h1>
        <p className="ua-hero-sub">Create any song. Just imagine it.</p>

        <div className="ua-hero-stage">
          <div className="ua-wave-glow" aria-hidden="true" />
          <div className="ua-wave" aria-hidden="true">
            {heroWave.map((height, index) => (
              <i key={index} style={{ height: `${height}px` }} />
            ))}
          </div>
          <UdioAction className="ua-btn ua-hero-cta" ctaId="hero_start_creating">
            <Play aria-hidden="true" />
            Start Creating
          </UdioAction>
        </div>

        <div className="ua-hero-icons">
          {heroIcons.map(([label, Icon]) => (
            <div className="ua-hero-icon" key={label}>
              <span>
                <Icon aria-hidden="true" />
              </span>
              {label}
            </div>
          ))}
        </div>

        <div className="ua-covers" aria-hidden="true">
          <div className="ua-covers-track">
            {[...covers, ...covers].map((src, index) => (
              <div className="ua-cover" key={index}>
                <img src={src} alt="" loading="lazy" />
                <span className="ua-cover-mute">
                  <VolumeX />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ua-section">
        <div className="ua-section-split">
          <div>
            <p className="ua-eyebrow">What Udio does</p>
            <h2 className="ua-h2">Create your life’s soundtrack</h2>
            <p className="ua-copy">
              Imagine creating personalized music for your life: a ballad for a
              romantic date, a banger for a night out with friends, a lo-fi
              track for meditation, or an upbeat song for your child’s
              birthday. If you can describe it in text, you can now express it
              in music.
            </p>
            <div className="ua-section-action">
              <UdioAction className="ua-btn ua-btn-dark" ctaId="soundtrack_cta">
                Create your first song
              </UdioAction>
            </div>
          </div>
          <div className="ua-songlist">
            {songs.map((song) => (
              <div
                className={`ua-songrow${song.active ? ' ua-active' : ''}`}
                key={song.title}
              >
                <div className="ua-songrow-thumb">
                  <img src={song.thumb} alt="" loading="lazy" />
                </div>
                <div className="ua-songrow-body">
                  <h4 className="ua-songrow-title">{song.title}</h4>
                  <p className="ua-songrow-tags">{song.tags}</p>
                </div>
                <div className="ua-songrow-play">
                  <Play aria-hidden="true" fill="currentColor" />
                  <span className="ua-songrow-duration">{song.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ua-section">
        <div className="ua-section-split ua-flip">
          <div className="ua-editor-card">
            <div className="ua-editor-head">
              <div className="ua-editor-cover">
                <img src="/udioai/editor-lost-love.jpg" alt="" loading="lazy" />
              </div>
              <div>
                <h3 className="ua-editor-title">Lost Love</h3>
                <p className="ua-editor-tags">Synthwave · Nostalgic · Serene</p>
              </div>
            </div>
            <div className="ua-editor-tools">
              {editorTools.map(([label, Icon, extra]) => (
                <span className={`ua-chip ${extra}`} key={label}>
                  <Icon aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
            <div className="ua-editor-wave">
              <div className="ua-wave" aria-hidden="true">
                {editorWave.map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="ua-region ua-region-inpaint">
                <Brush aria-hidden="true" />
                Inpaint
              </div>
              <div className="ua-region ua-region-extend">
                <ArrowRightFromLine aria-hidden="true" />
                Extend
              </div>
              <div className="ua-playhead" aria-hidden="true" />
            </div>
          </div>
          <div>
            <p className="ua-eyebrow">Empowering creators</p>
            <h2 className="ua-h2">A new tool for music makers</h2>
            <p className="ua-copy">
              From Grammy-winning producers to up-and-coming songwriters, Udio
              is a tool for realizing musical ideas. Professional musicians and
              passionate amateurs use Udio in their production process. Upload
              your own audio to experience Udio’s state-of-the-art AI-editing
              tools.
            </p>
            <div className="ua-section-action">
              <UdioAction className="ua-btn ua-btn-dark" ctaId="creation_tools">
                Check out our creation tools
              </UdioAction>
            </div>
          </div>
        </div>
      </section>

      <section className="ua-section">
        <div className="ua-section-split">
          <div>
            <p className="ua-eyebrow">Find your next favorite song</p>
            <h2 className="ua-h2">
              Discover new music and share your own creations
            </h2>
            <p className="ua-copy">
              Once you’ve created your masterpiece (or just a song you like),
              publish it on Udio for everyone to enjoy. Follow your favorite
              artists and join a vibrant community of creators, artists,
              musicians, and music-lovers.
            </p>
            <div className="ua-section-action">
              <UdioAction className="ua-btn ua-btn-dark" ctaId="start_listening">
                Start Listening
              </UdioAction>
            </div>
          </div>
          <div className="ua-grid ua-grid-3">
            {discover.map(([title, artist, src]) => (
              <div className="ua-grid-card" key={`${title}-${artist}`}>
                <div className="ua-grid-cover">
                  <img src={src} alt="" loading="lazy" />
                </div>
                <p className="ua-grid-title">{title}</p>
                <p className="ua-grid-artist">{artist}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ua-video-section">
        <h2 className="ua-video-heading">
          Generative music as a starting point
        </h2>
        <div className="ua-video">
          <img src="/udioai/video-banner.jpg" alt="" loading="lazy" />
          <div className="ua-video-overlay" aria-hidden="true" />
          <div className="ua-video-head">
            <div className="ua-video-avatar">
              <img src="/udioai/editor-lost-love.jpg" alt="" loading="lazy" />
            </div>
            <div className="ua-video-titles">
              <b>Udio: Make your music</b>
              <span>Udio</span>
            </div>
          </div>
          <div className="ua-video-share">
            <Forward aria-hidden="true" />
          </div>
          <a
            className="ua-video-watch"
            href="https://www.youtube.com/results?search_query=udio+make+your+music"
            target="_blank"
            rel="noreferrer"
          >
            Watch on
            <Youtube aria-hidden="true" />
            YouTube
          </a>
        </div>
      </section>

      <section className="ua-cta">
        <h2>Make your music</h2>
        <UdioAction className="ua-btn ua-btn-pink" ctaId="footer_cta">
          Create your first song
        </UdioAction>
      </section>
    </>
  );
}
