import { FaqEntry } from '../faq-accordion/faq-accordion.component';

/**
 * The FAQ block shown at the foot of the content pages.
 *
 * Grouped here rather than inside each component so the answers are edited in
 * one file, and so a page's questions can be fed to FAQ structured data later
 * without hunting through templates. Home and the YouTube SEO tool keep their
 * own lists in [[home-faqs]] and [[ytseo-faqs]].
 */

/** /socialmedia — the social media tools hub. */
export const SOCIAL_MEDIA_FAQS: FaqEntry[] = [
  {
    question: 'What social media tools does YT Creator offer?',
    answer:
      'A caption and hashtag generator, a trending music finder, and a social media bio ' +
      'generator. All of them are free and need no login.'
  },
  {
    question: 'Which platforms do these tools support?',
    answer:
      'The captions, hashtags and bios are written to suit the major platforms — Instagram, ' +
      'YouTube, Facebook, LinkedIn and X — and work for reels, shorts, posts and stories alike.'
  },
  {
    question: 'How do hashtags actually help a post?',
    answer:
      'Hashtags give a platform extra context about what your post is about, which helps it ' +
      'surface your content to people interested in that subject. They support discovery; ' +
      'they do not replace a post worth discovering.'
  },
  {
    question: 'How many hashtags should I use?',
    answer:
      'It varies by platform, and a focused set that genuinely matches your post beats a long ' +
      'list of loosely related tags. Padding a post with unrelated hashtags gives the platform ' +
      'a weaker signal, not a stronger one.'
  },
  {
    question: 'What is the best time to post on social media?',
    answer:
      'It depends on your own audience rather than any universal rule. Weekday mornings and ' +
      'early afternoons are a reasonable starting point, but your account insights will show ' +
      'when your followers are actually active.'
  },
  {
    question: 'Do I need to write my own captions as well?',
    answer:
      'The generated caption is a strong starting draft, not a finished post. Reading it back ' +
      'in your own voice, and checking it matches what is actually in the video or image, is ' +
      'what makes it yours.'
  },
  {
    question: 'Is a social media bio really worth optimizing?',
    answer:
      'Yes. It is the one piece of text every visitor to your profile reads, and it decides ' +
      'whether someone who found one post follows you for the rest.'
  },
  {
    question: 'Will using these tools guarantee more followers?',
    answer:
      'No. They help you publish clearer, more discoverable posts more quickly, but reach and ' +
      'follower growth still depend on the content itself and on how people respond to it.'
  }
];

/** /socialmedia/captiongenerator — the caption and hashtag tool. */
export const CAPTION_GENERATOR_FAQS: FaqEntry[] = [
  {
    question: 'What does the Caption & Hashtag Generator do?',
    answer:
      'It writes social media captions along with relevant, topic-based hashtags in ' +
      'platform-friendly styles. It suits reels, shorts, posts and stories.'
  },
  {
    question: 'How do I get captions and hashtags for my post?',
    answer:
      'Enter your post idea, topic or keyword, choose the content type or platform, generate, ' +
      'then copy the caption and hashtags into your post. No writing experience is required.'
  },
  {
    question: 'Do I need an account to use the caption generator?',
    answer:
      'No. The tool is free and needs no login or technical setup — open it, enter your topic, ' +
      'and use the results straight away.'
  },
  {
    question: 'Can I edit the caption it generates?',
    answer:
      'Yes, and you should. Treat the output as a first draft: adjust the wording to your own ' +
      'voice and make sure it accurately describes what you are actually posting.'
  },
  {
    question: 'Are the hashtags it suggests trending?',
    answer:
      'They are chosen for relevance to the topic you enter rather than for raw popularity. A ' +
      'hashtag that matches your post reaches a smaller but far more interested audience than ' +
      'a trending one that does not.'
  },
  {
    question: 'Can I use the same caption on more than one platform?',
    answer:
      'You can, but each platform rewards a slightly different length and tone. Generating for ' +
      'the specific platform gives you a caption that reads naturally there.'
  },
  {
    question: 'Does the tool store what I type?',
    answer:
      'Your input is processed to generate the caption and hashtags you asked for. The tool ' +
      'does not store channel credentials or personal data.'
  },
  {
    question: 'Will a better caption get me more views?',
    answer:
      'A clear caption and relevant hashtags help the right people find and understand your ' +
      'post, but no caption can guarantee views. The content itself still does the work.'
  }
];

/** /learninghub — the guides and answers hub. */
export const LEARNING_HUB_FAQS: FaqEntry[] = [
  {
    question: 'What is the Learning Hub?',
    answer:
      'A collection of practical guides and answers for creators — covering monetization, ' +
      'platform issues, community questions, and a searchable FAQ library.'
  },
  {
    question: 'Who is the Learning Hub for?',
    answer:
      'New YouTubers finding their footing, experienced creators sharpening specific skills, ' +
      'educators and teams, and anyone growing an audience without paid shortcuts.'
  },
  {
    question: 'How do I start growing a YouTube channel?',
    answer:
      'Pick a subject you can publish on consistently, research what people actually search ' +
      'for in it, and optimize your titles, descriptions and tags before you upload rather ' +
      'than after.'
  },
  {
    question: 'How do I monetize my channel?',
    answer:
      'The YouTube Partner Programme has watch-hour and subscriber thresholds that change over ' +
      'time, so check the current requirements on YouTube itself. Beyond ads, most creators ' +
      'earn through sponsorships, affiliate links and their own products.'
  },
  {
    question: 'Do I need expensive equipment to start?',
    answer:
      'No. A recent phone and free editing software are enough to begin. Our equipment guides ' +
      'cover what is genuinely worth upgrading first, and when.'
  },
  {
    question: 'Why did my views suddenly drop?',
    answer:
      'A drop usually reflects a change in click-through rate or retention on recent uploads, ' +
      'or a shift in what your audience is watching — rather than a penalty. Compare your ' +
      'recent videos against your own averages in YouTube Studio before changing course.'
  },
  {
    question: 'How often should I publish?',
    answer:
      'A schedule you can sustain beats a demanding one you abandon. Consistency matters more ' +
      'than frequency, because it is what gives an audience a reason to come back.'
  },
  {
    question: 'Is the Learning Hub free to use?',
    answer:
      'Yes. Every guide, answer and tool on YT Creator is free, with no login required.'
  }
];
