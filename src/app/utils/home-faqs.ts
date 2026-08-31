/**
 * The FAQs shown on the home page.
 *
 * They live here rather than inside HomeComponent because AppComponent builds
 * the FAQPage JSON-LD from this same list: the answers a reader sees and the
 * ones search engines are told about must never drift apart.
 *
 * No isOpen flag — whether an entry is expanded is the component's business.
 */
export interface HomeFaq {
  question: string;
  answer: string;
}

export const HOME_FAQS: HomeFaq[] = [
  {
    question: 'What is YT Creator?',
    answer: 'YT Creator is a free toolkit for YouTube and social media creators. It brings together a YouTube SEO tool, a caption and hashtag generator, equipment guides and practical articles, so you can plan, optimize and publish from one place.'
  },
  {
    question: 'Do I need an account to use the tools?',
    answer: 'No. The tools run without a login or any technical setup. Open the tool you need, enter your topic, and use the results straight away.'
  },
  {
    question: 'What does the YouTube SEO tool do?',
    answer: 'It optimizes the parts of a video that search depends on: titles for relevance, descriptions for indexing and clicks, relevant tags and keyword context, thumbnail guidance, and chapters and timestamps for discoverability. It also reports an overall YouTube SEO performance score.'
  },
  {
    question: 'How do I use the YouTube SEO tool?',
    answer: 'Enter your draft title, add your main topic or keyword, run Generate Content, then apply the suggestions you agree with. It works for new uploads as well as videos you have already published.'
  },
  {
    question: 'Will the YouTube SEO tool guarantee more views?',
    answer: 'No tool can guarantee rankings. It strengthens the signals YouTube reads from your video — title relevance, description, tags and structure — while watch time, retention and the quality of the video itself still decide how far it travels.'
  },
  {
    question: 'What does the Caption & Hashtag Generator do?',
    answer: 'It writes social media captions along with relevant, topic-based hashtags in platform-friendly styles. It suits reels, shorts, posts and stories.'
  },
  {
    question: 'How do I get captions and hashtags for my post?',
    answer: 'Enter your post idea, topic or keyword, choose the content type or platform, generate, then copy the caption and hashtags into your post. No writing experience is required.'
  }
];
