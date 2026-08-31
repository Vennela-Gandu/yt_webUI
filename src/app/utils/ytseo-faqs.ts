/**
 * The FAQs shown on the YouTube SEO tool page.
 *
 * Kept beside the home page list in [[home-faqs]] rather than inside the
 * component, so the answers stay editable in one place and can be fed to the
 * FAQ structured data if that page ever emits it.
 *
 * No isOpen flag — whether an entry is expanded is the component's business.
 */
export interface YtseoFaq {
  question: string;
  answer: string;
}

export const YTSEO_FAQS: YtseoFaq[] = [
  {
    question: 'What is YouTube SEO?',
    answer:
      'YouTube SEO is the practice of writing and structuring your video metadata — the ' +
      'title, description, tags and keyword context — so YouTube understands what your ' +
      'video is about and shows it to the right viewers in Search and Suggested Videos.'
  },
  {
    question: 'What does the YT Creator YouTube SEO tool generate?',
    answer:
      'It generates SEO-optimized titles, descriptions, tags and relevant FAQs for your ' +
      'video topic, so the parts of your upload that search depends on are written before ' +
      'you publish rather than after.'
  },
  {
    question: 'How do I use the YouTube SEO tool?',
    answer:
      'Enter your draft title, add your main topic or keyword, run Generate Content, then ' +
      'review the suggestions and apply the ones that genuinely fit your video.'
  },
  {
    question: 'Do I need an account to use the tool?',
    answer:
      'No. The YouTube SEO tool is free and needs no login or technical setup — open it, ' +
      'enter your topic, and use the results straight away.'
  },
  {
    question: 'Can I use it on videos I have already published?',
    answer:
      'Yes. The tool works for new uploads and existing videos alike. You can refresh the ' +
      'metadata on an underperforming or evergreen video without re-uploading it.'
  },
  {
    question: 'Does YouTube SEO work for Shorts?',
    answer:
      'Metadata still helps YouTube classify a Short and match it to interested viewers, ' +
      'but discovery in the Shorts feed leans much more on watch behaviour than on search. ' +
      'Treat the title and description as context rather than as the main lever.'
  },
  {
    question: 'How many tags should a YouTube video have?',
    answer:
      'There is no magic number. A focused set that genuinely describes the video is worth ' +
      'more than a long list of loosely related terms — tags supply context, and padding ' +
      'them with unrelated keywords gives YouTube a weaker signal, not a stronger one.'
  },
  {
    question: 'Will optimizing my metadata guarantee more views?',
    answer:
      'No. Optimization improves how well YouTube understands and surfaces your video, but ' +
      'it cannot guarantee rankings, views, impressions, click-through rate or monetization. ' +
      'Watch time, retention and the quality of the video itself still decide how far it travels.'
  }
];
