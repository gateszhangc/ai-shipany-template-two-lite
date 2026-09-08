import {
  ArrowRight,
  Check,
  Globe,
  Languages,
  LineChart,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { FalconAction } from '@/shared/blocks/falcon2/site';

export const revalidate = 3600;

const highlights = [
  [
    'Open, multilingual, and multimodal',
    'Falcon 2 extends Falcon’s model stack with text-first performance and vision-to-language capabilities.',
  ],
  [
    '11B leads on quality',
    'Falcon 2 11B outperforms newer Llama 3 8B and stays in the same tier as high-performing open models.',
  ],
  [
    'Efficient deployment',
    'The model family is designed to run efficiently on smaller clusters and lighter infrastructures.',
  ],
  [
    'Clear licensing',
    'Falcon 2 uses an open, permissive TII Falcon 2.0 license with responsible-use guidance.',
  ],
] as const;

const workflowSteps = [
  [
    '01',
    'Deploy',
    'Load Falcon 2 on your stack and connect your preferred inference gateway.',
  ],
  [
    '02',
    'Build prompts and context',
    'Use rich multilingual inputs for coding, search, analysis, and content generation.',
  ],
  [
    '03',
    'Validate responses',
    'Review outputs and adjust generation style, safety filters, and constraints.',
  ],
  [
    '04',
    'Scale',
    'Use Falcon 2 as the base for products, internal tooling, and enterprise AI workflows.',
  ],
] as const;

const featureTable = [
  ['Use case', 'Falcon 2', 'What it improves'],
  [
    'Text generation',
    '11B and VLM variants',
    'Better factual recall and concise reasoning.',
  ],
  [
    'Vision-aware tasks',
    'Falcon 2 11B VLM',
    'Image-to-text and context-aware interpretation in one model family.',
  ],
  [
    'Multilingual workloads',
    'Core + VLM',
    'Broader language support for Arabic, English, French, Spanish, German, and Portuguese.',
  ],
  [
    'Enterprise deployment',
    'Base 11B',
    'Lower hardware footprint than large 70B-class models.',
  ],
] as const;

const impactRows = [
  'Healthcare documentation workflows.',
  'Financial compliance review assistants.',
  'E-commerce catalog enrichment and indexing.',
  'Education copilots and search assistants.',
  'Legal and policy analysis support.',
  'Accessibility pipelines for visual content.',
] as const;

const quotes = [
  [
    'H.E. Faisal Al Bannai',
    'Secretary General of ATRC and advisor on technology',
    '“Falcon 2 is a major step for open AI in the region. It brings strong model quality with practical, privacy-conscious deployment options and keeps the Falcon foundation open for teams to adopt.”',
  ],
  [
    'Dr. Hakim Hacid',
    'Executive Director and Acting Chief Researcher',
    '“Smaller models are becoming the most effective way to scale AI infrastructure. Falcon 2 shows how we can keep power high while reducing compute strain and enabling broader deployment.”',
  ],
] as const;

const faqs = [
  [
    'What is Falcon 2?',
    'Falcon 2 is TII’s latest multilingual and multimodal model series, including Falcon 2 11B and Falcon 2 11B VLM.',
  ],
  [
    'What is the difference between Falcon 2 11B and Falcon 2 11B VLM?',
    'The VLM variant adds vision-to-language capabilities, so it can process and describe image context in text-aware workflows.',
  ],
  [
    'Can I use Falcon 2 in commercial products?',
    'Falcon 2 is released under the TII Falcon 2.0 license, which is designed to be permissive while requiring responsible usage.',
  ],
  [
    'Does Falcon 2 support multiple languages?',
    'Yes. It supports key languages including Arabic, English, French, Spanish, German, and Portuguese, with multilingual behavior across core generation tasks.',
  ],
  [
    'Will Falcon 2 replace large commercial APIs for me?',
    'Falcon 2 is designed for teams that need a strong open model stack with better controllability, deployment flexibility, and lower compute requirements.',
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
        <div className="gen-hero-overlay" />
        <div className="gen-hero-content">
          <span className="gen-pill">
            <ShieldCheck /> Falcon 2 · Open Source & Multimodal
          </span>
          <h1>
            <b>Meet Falcon 2</b>
          </h1>
          <p>
            Introducing Falcon 2, a multilingual and multimodal model series
            from TII. Falcon 2 combines open research progress with practical
            enterprise readiness.
          </p>
          <div className="gen-hero-actions">
            <FalconAction className="gen-gradient-button">
              Generate with Falcon 2 <ArrowRight />
            </FalconAction>
            <a href="#highlights">View Highlights</a>
          </div>
          <div className="gen-benefits">
            {[
              'Multilingual',
              'Vision-to-language',
              'Open License',
              'Efficient Inference',
              'Model Comparison',
            ].map((x) => (
              <span key={x}>
                <Check />
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="gen-section" id="highlights">
        <SectionTitle
          eyebrow="Falcon 2 Soars: Highlights"
          title="Falcon 2 is a practical open model for real-world use"
          copy="We benchmarked and refined Falcon 2 to balance performance with deployment realism across multiple domains."
        />
        <div className="gen-card-grid">
          {highlights.map(([title, copy], i) => (
            <article key={title}>
              <span>
                {i % 3 === 0 ? (
                  <ShieldCheck />
                ) : i % 3 === 1 ? (
                  <LineChart />
                ) : (
                  <Languages />
                )}
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gen-section gen-alt" id="whats-new">
        <SectionTitle
          eyebrow="What’s New"
          title="Falcon 2 Family Release Notes"
          copy="Falcon 2 introduces two flagship variants to cover both classic LLM generation and vision-grounded workflows."
        />
        <div className="gen-generator">
          <div className="gen-generator-main">
            <label>Variant</label>
            <span className="gen-select">
              Falcon 2 11B (Multilingual + efficient inference)
            </span>
            <div className="gen-workflow-tabs">
              <b>Falcon 2 11B</b>
              <span>Falcon 2 11B VLM</span>
            </div>
            <div className="gen-upload-card">
              <strong>Core notes</strong>
              <span>
                11B: 5.5T tokens · VLM adds visual grounding to the same stack
              </span>
            </div>
          </div>
          <aside className="gen-settings-card">
            <label>Key positioning</label>
            <div className="gen-options">
              <b>Best-in-class multilingual quality</b>
              <span>Image-to-text support in VLM mode</span>
            </div>
            <label>Deployment profile</label>
            <div className="gen-options">
              <b>Lower GPU footprint</b>
              <span>Edge-adjacent integration ready</span>
            </div>
            <label>Roadmap focus</label>
            <div className="gen-options">
              <b>Mixture of Experts (MoE)</b>
              <span>Future efficiency and specialization improvements</span>
            </div>
            <FalconAction className="gen-gradient-button">
              Validate with Credits <ArrowRight />
            </FalconAction>
          </aside>
        </div>
      </section>

      <section className="gen-section" id="performance">
        <SectionTitle
          eyebrow="How does the Falcon fare?"
          title="Falcon 2 performance and positioning"
          copy="Open performance testing places Falcon 2 as a top-tier open option in its class while preserving transparency and flexibility."
        />
        <div className="gen-table">
          {featureTable.map((row, idx) => (
            <div key={row[0]}>
              {row.map((cell, cellIdx) => (
                <span key={`${idx}-${cellIdx}`}>
                  <b>{cellIdx === 0 ? row[0] : cell}</b>
                </span>
              ))}
            </div>
          ))}
        </div>
        <blockquote>
          Falcon 2 is designed for teams who need strong model ability, clear
          licensing, and practical deployment economics.
        </blockquote>
      </section>

      <section className="gen-section gen-alt" id="multilingual">
        <SectionTitle
          eyebrow="Multilingual and Multimodal"
          title="Support across languages, text, and vision inputs"
          copy="Falcon 2 is prepared for international workloads while opening visual understanding paths for broader applications."
        />
        <div className="gen-use-grid">
          {impactRows.map((x) => (
            <article key={x}>
              <span>
                <Globe />
                Use Case
              </span>
              <h3>{x}</h3>
              <p>
                Deploy Falcon 2 variants where consistency, language diversity,
                and multimodal context matter.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="gen-section" id="word-of-mouth">
        <SectionTitle
          eyebrow="Word of mouth"
          title="Falcon 2 in leadership views"
          copy="Leaders highlighted Falcon 2 as a strategic open model and a privacy-conscious infrastructure choice."
        />
        <div className="gen-faq">
          {quotes.map(([name, title, quote]) => (
            <details key={name} open>
              <summary>
                {name}
                <span>+</span>
              </summary>
              <p>{title}</p>
              <p>{quote}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="gen-section gen-alt" id="whats-next">
        <SectionTitle
          eyebrow="What’s Next"
          title="Mixture of Experts and deeper multimodal adaptation"
          copy="Falcon 2 will continue expanding capabilities with specialization strategies aimed at higher performance and flexible composition."
        />
        <div className="gen-steps">
          {workflowSteps.map(([n, title, copy]) => (
            <article key={n}>
              <b>{n}</b>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gen-section" id="faq">
        <SectionTitle
          eyebrow="Frequently asked questions"
          title="Falcon 2 FAQ"
          copy="Quick answers on Falcon 2 capabilities, usage, and model family scope."
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

      <section className="gen-cta" id="start">
        <MessageSquareText />
        <h2>Build on Falcon 2 now</h2>
        <p>
          Generate, test, and integrate Falcon 2 workflows with a single
          account.
        </p>
        <div>
          <FalconAction className="gen-gradient-button">
            Start creating
            <ArrowRight />
          </FalconAction>
          <a href="#whats-new">Read release notes</a>
        </div>
      </section>
    </main>
  );
}
