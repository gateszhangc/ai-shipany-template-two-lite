import Image from 'next/image';
import {
  ArrowRight,
  Check,
  Film,
  ImageIcon,
  Mic,
  Play,
  Sparkles,
  Upload,
  Video,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { GenjutsuAction } from '@/shared/blocks/genjutsu/site-chrome';

export const revalidate = 3600;

const examples = [
  ['minimax-h3-game-ui-design.webp', 'Cinematic game worlds'],
  ['minimax-h3-ad.webp', 'Product advertising'],
  ['minimax-h3-2k.webp', 'High-detail motion'],
  ['minimax-h3-opening-credits.webp', 'Opening sequences'],
  ['minimax-h3-poster.webp', 'Animated posters'],
  ['minimax-h3-stereo-audio.webp', 'Sound-led stories'],
  ['minimax-h3-multimodal-context-understanding.webp', 'Image-to-video scenes'],
] as const;
const features = [
  [
    'Generate from Text',
    'Describe the subject, action, setting, lighting, and camera movement. Higgsfield Genjutsu turns your prompt into a polished short video.',
  ],
  [
    'Animate Any Image',
    'Upload a starting image and bring it to life while preserving its subject, composition, and visual identity.',
  ],
  [
    'Create with References',
    'Add images to give the model clearer context for characters, products, locations, and visual style.',
  ],
  [
    'Guide Motion and Camera',
    'Describe pans, zooms, tracking shots, static shots, and cinematic camera directions in your prompt.',
  ],
  [
    'Produce Social-Ready Video',
    'Generate concise video clips suited to ads, stories, concepts, and short-form social content.',
  ],
  [
    'Shape Subject and Style Details',
    'Use precise language and reference images to guide atmosphere, lighting, action, and consistency.',
  ],
] as const;
const steps = [
  [
    '01',
    'Create an Account',
    'Create your account and use your starter credits to begin generating videos.',
  ],
  [
    '02',
    'Choose a Workflow',
    'Start with a written prompt or upload an image you want to animate.',
  ],
  [
    '03',
    'Write a Prompt and Add an Image',
    'Describe the scene, movement, camera, mood, and details you want to see.',
  ],
  [
    '04',
    'Generate and Explore',
    'Choose your settings, generate the video, and explore the result.',
  ],
] as const;
const workflows = [
  ['Text-to-Video', 'A written prompt', 'Exploring a new scene from scratch'],
  [
    'Image-to-Video',
    'A prompt and source image',
    'Animating a still image or visual concept',
  ],
  [
    'Reference-Guided Video',
    'A prompt with visual references',
    'Keeping subjects and visual style consistent',
  ],
] as const;
const uses = [
  [
    'Product Marketing',
    'Marketing & Product Teams',
    'Turn a product image into a short ad concept before planning a full production.',
  ],
  [
    'Ecommerce Content',
    'Ecommerce Teams',
    'Animate product photos into lifestyle video concepts for storefronts and campaigns.',
  ],
  [
    'Social Media Videos',
    'Creators & Social Teams',
    'Explore short-form video concepts for Reels, Shorts, TikTok, and social feeds.',
  ],
  [
    'Film Previsualization',
    'Filmmakers & Creative Teams',
    'Test shot direction, framing, movement, and scene mood before filming.',
  ],
  [
    'Game Concept Development',
    'Game & Concept Teams',
    'Turn character and environment art into motion studies for early concepts.',
  ],
  [
    'Motion Design',
    'Motion & Brand Designers',
    'Explore animated posters, campaigns, and visual identity concepts.',
  ],
] as const;
const packs = [
  ['Starter', '$9.90', '370', 'Up to 18 short video generations'],
  ['Creator', '$29.90', '1,300', 'Up to 65 short video generations'],
  ['Studio', '$49.90', '2,500', 'Up to 125 short video generations'],
  ['Business', '$99.90', '5,550', 'Up to 277 short video generations'],
] as const;
const faqs = [
  [
    'What is Higgsfield Genjutsu?',
    'Higgsfield Genjutsu is an AI video creation experience for turning text prompts and still images into expressive short videos.',
  ],
  [
    'How do I use Higgsfield Genjutsu online?',
    'Sign in, choose text-to-video or image-to-video, describe your scene, select your settings, and generate.',
  ],
  [
    'Can it create videos from text?',
    'Yes. Describe the subject, action, environment, lighting, style, and camera motion in natural language.',
  ],
  [
    'Can it turn an image into a video?',
    'Yes. Upload an image and explain how the scene, subject, and camera should move.',
  ],
  [
    'What makes a good prompt?',
    'Use a clear subject, action, setting, mood, lighting, and camera direction. Keep the most important details explicit.',
  ],
  [
    'Can I guide camera movement?',
    'Yes. Prompts can request pans, zooms, tracking shots, handheld movement, or a static camera.',
  ],
  [
    'What image formats are supported?',
    'Use common image formats such as JPG, PNG, and WEBP for image-to-video workflows.',
  ],
  [
    'How are credits used?',
    'The generation interface shows the credit estimate before you continue. Credit usage depends on the selected workflow and settings.',
  ],
  [
    'How many free credits do I get?',
    'New accounts receive starter credits when the active offer is available. Your balance appears after sign-in.',
  ],
  [
    'Is Higgsfield Genjutsu an official Higgsfield product?',
    'This is an independent Genjutsu experience built for exploring the model in a focused creative workspace.',
  ],
] as const;

const SectionTitle = ({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) => (
  <header className="gen-section-title">
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    <p>{copy}</p>
  </header>
);

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="home">
      <section className="gen-hero">
        <Image
          src="/genjutsu/hero.webp"
          alt="Cinematic AI video collage"
          fill
          priority
          sizes="100vw"
        />
        <div className="gen-hero-overlay" />
        <div className="gen-hero-content">
          <span className="gen-pill">
            <Video /> Create videos from text and images
          </span>
          <h1>
            <b>Genjutsu</b> Video Generator
          </h1>
          <p>
            Create cinematic AI videos from text prompts and images. Guide
            motion, camera, atmosphere, and visual style in seconds.
          </p>
          <div className="gen-hero-actions">
            <GenjutsuAction className="gen-gradient-button">
              Generate a Video <ArrowRight />
            </GenjutsuAction>
            <a href="#examples">View Examples</a>
          </div>
          <div className="gen-benefits">
            {[
              'Starter Credits',
              'Text-to-Video',
              'Image-to-Video',
              'Cinematic Motion',
              'Fast AI Generation',
            ].map((x) => (
              <span key={x}>
                <Check />
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="gen-section gen-generator-section" id="generator">
        <SectionTitle
          eyebrow="Create with Higgsfield Genjutsu"
          title="Create Videos with Higgsfield Genjutsu"
          copy="Generate expressive videos from a written prompt or animate an image. Customize the motion, framing, aspect ratio, and creative direction."
        />
        <div className="gen-generator">
          <div className="gen-generator-main">
            <label>AI Model</label>
            <button className="gen-select" type="button">
              <Sparkles /> Higgsfield Genjutsu <span>Fast · Cinematic</span>
            </button>
            <div className="gen-workflow-tabs">
              <b>Image to Video</b>
              <span>Text to Video</span>
            </div>
            <label>
              Describe your video <span>0 / 4000</span>
            </label>
            <textarea placeholder="Describe the subject, action, camera movement, lighting, and mood…" />
            <div className="gen-upload-card">
              <Upload />
              <b>Click to upload an image</b>
              <span>JPG, PNG or WEBP · maximum 30 MB</span>
            </div>
          </div>
          <aside className="gen-settings-card">
            <label>Aspect Ratio</label>
            <div className="gen-options">
              <b>Auto</b>
              <span>16:9</span>
              <span>9:16</span>
              <span>1:1</span>
            </div>
            <label>Creative Mode</label>
            <div className="gen-options">
              <b>Normal</b>
              <span>Fun</span>
              <span>Spicy</span>
            </div>
            <label>Duration</label>
            <div className="gen-options">
              <b>6s</b>
              <span>10s</span>
            </div>
            <GenjutsuAction className="gen-gradient-button">
              Generate Video <span>20 Credits</span>
            </GenjutsuAction>
          </aside>
        </div>
        <div className="gen-guide">
          <div>
            <span>Prompt Guide</span>
            <h3>Describe the moment you want to see.</h3>
            <p>
              Include the subject, action, environment, lighting, mood, and
              camera direction. For image-to-video, explain what should move
              while preserving the important visual details.
            </p>
          </div>
          <div>
            <span>Supported Inputs</span>
            <ul>
              <li>Text prompts up to 4,000 characters</li>
              <li>JPG, PNG, or WEBP source images</li>
              <li>Landscape, square, and portrait output</li>
              <li>Normal, Fun, and Spicy creative modes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="gen-section" id="examples">
        <SectionTitle
          eyebrow="Creative starting points"
          title="Higgsfield Genjutsu Examples"
          copy="Explore AI video concepts built from text prompts and images across ads, games, cinematic scenes, and creative work."
        />
        <div className="gen-example-grid">
          {examples.map(([src, title], i) => (
            <article className={i === 0 || i === 5 ? 'wide' : ''} key={title}>
              <Image
                src={`/genjutsu/examples/${src}`}
                alt={title}
                fill
                sizes="(max-width: 700px) 100vw, 40vw"
              />
              <span>
                <Play />
                {title}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="gen-section gen-alt" id="features">
        <SectionTitle
          eyebrow="Flexible creative controls"
          title="Key Features of Higgsfield Genjutsu"
          copy="Explore tools for text-to-video, image animation, expressive motion, cinematic camera direction, and fast visual storytelling."
        />
        <div className="gen-card-grid">
          {features.map(([title, copy], i) => (
            <article key={title}>
              <span>
                {i % 3 === 0 ? <Film /> : i % 3 === 1 ? <ImageIcon /> : <Mic />}
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gen-section" id="how-it-works">
        <SectionTitle
          eyebrow="Four-step workflow"
          title="How to Use Higgsfield Genjutsu Online"
          copy="Choose a workflow, add your prompt or image, customize the creative settings, and generate your video."
        />
        <div className="gen-steps">
          {steps.map(([n, title, copy]) => (
            <article key={n}>
              <b>{n}</b>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <blockquote>
          <b>Example prompt:</b> A silver sports car rests beneath neon city
          lights. Rain reflects across the street as the camera slowly pushes
          forward. Cinematic commercial style.
        </blockquote>
      </section>

      <section className="gen-section gen-alt" id="workflows">
        <SectionTitle
          eyebrow="Choose the right input"
          title="Which Video Workflow Should You Use?"
          copy="Compare Higgsfield Genjutsu workflows by the input you have and the level of creative control you need."
        />
        <div className="gen-table">
          <div>
            <b>Workflow</b>
            <b>What you provide</b>
            <b>Good for</b>
          </div>
          {workflows.map((row) => (
            <div key={row[0]}>
              {row.map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="gen-section">
        <SectionTitle
          eyebrow="Real project workflows"
          title="Higgsfield Genjutsu Use Cases"
          copy="Use Higgsfield Genjutsu to explore product ads, social videos, film shots, game concepts, and motion design before full production."
        />
        <div className="gen-use-grid">
          {uses.map(([title, audience, copy]) => (
            <article key={title}>
              <span>{audience}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ArrowRight />
            </article>
          ))}
        </div>
      </section>

      <section className="gen-section gen-alt" id="pricing">
        <SectionTitle
          eyebrow="Plans and credits"
          title="Choose a Higgsfield Genjutsu Credit Pack"
          copy="Buy credits once and create AI videos whenever inspiration strikes. Purchased credits do not expire."
        />
        <div className="gen-price-grid">
          {packs.map(([name, price, credits, copy], i) => (
            <article className={i === 2 ? 'featured' : ''} key={name}>
              {i === 2 && <em>Best value</em>}
              <h3>{name}</h3>
              <div className="gen-price">
                {price}
                <small> one time</small>
              </div>
              <b>{credits}</b>
              <span>Credits</span>
              <p>{copy}</p>
              <GenjutsuAction>
                Buy {name}
                <ArrowRight />
              </GenjutsuAction>
            </article>
          ))}
        </div>
        <div className="gen-included">
          <h3>Included with every credit pack</h3>
          {[
            'One-time purchase, no subscription',
            'Purchased credits never expire',
            'Text and image video workflows',
            'Share-ready video exports',
          ].map((x) => (
            <span key={x}>
              <Check />
              {x}
            </span>
          ))}
        </div>
      </section>

      <section className="gen-section" id="faq">
        <SectionTitle
          eyebrow="Frequently asked questions"
          title="Higgsfield Genjutsu FAQ"
          copy="Get answers about generating videos, choosing inputs, writing prompts, and understanding credit usage."
        />
        <div className="gen-faq">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="gen-cta">
        <Sparkles />
        <h2>Turn Your Idea Into a Video</h2>
        <p>
          Start with text or an image and create a cinematic AI video with
          Higgsfield Genjutsu.
        </p>
        <div>
          <GenjutsuAction className="gen-gradient-button">
            Generate a Video <ArrowRight />
          </GenjutsuAction>
          <a href="#examples">View Examples</a>
        </div>
      </section>
    </main>
  );
}
