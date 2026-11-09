export type ServiceImage = {
  src: string;
  alt: string;
  label: string;
  fit?: "contain";
  position?: string;
};

// Project assets selected from Pictures for marketing. Source links are recorded
// in content/service-image-sources.json; serve local WebP files without Drive access.
const images = {
  amazonFilm: { src: "/case-studies/videos/amazon-summer-2025.webp", alt: "A scene from Blend's Amazon Summer 2025 event film", label: "Amazon Summer 2025" },
  interview: { src: "/services/google-interview.webp", alt: "Interview with a speaker in the Google Cloud AI in Action event film", label: "Google Cloud · Interviews" },
  cloudPortrait: { src: "/services/google-cloud-speaker.webp", alt: "Speaker photographed at the Google Cloud South Africa region launch", label: "Google Cloud · Photography" },
  motion: { src: "/services/youtube-motion.webp", alt: "YouTube Works Awards motion graphics title from the event film", label: "YouTube Works · Motion" },
  wonderlandDesign: { src: "/services/wonderland-design.webp", alt: "Custom event graphics at AI in Wonderland in Cape Town", label: "AI in Wonderland · Design" },
  cloudDesign: { src: "/services/wonderland-signage.webp", alt: "Custom Curiouser and Curiouser event signage at AI in Wonderland", label: "AI in Wonderland · Branding" },
  website: { src: "/services/ryan-swag-store.webp", alt: "Ryan Swag Store website with branded clothing and merchandise", label: "Ryan · Web Development", fit: "contain" },
  rsvp: { src: "/services/exxaro-rsvp.webp", alt: "Exxaro event registration landing page designed for guest RSVPs", label: "Exxaro · RSVP", fit: "contain" },
  registration: { src: "/services/google-cloud-registration.webp", alt: "Event team assisting a guest at the Google Cloud registration desk", label: "Google Cloud · Registration" },
  checkIn: { src: "/services/google-cloud-check-in.webp", alt: "Event staff scanning a guest's phone at Google Cloud check-in", label: "Google Cloud · Check-in" },
  stage: { src: "/services/wonderland-speaker.webp", alt: "Presenter on a colourful custom stage at AI in Wonderland", label: "AI in Wonderland · Production" },
  stageScreen: { src: "/services/wonderland-stage.webp", alt: "Stage screens and lighting from the Google Cloud AI in Action event film", label: "Google Cloud · Stage" },
  venue: { src: "/services/wonderland-venue.webp", alt: "Oversized teacups and colourful stage decor at AI in Wonderland", label: "AI in Wonderland · Venue" },
  swag: { src: "/services/google-cloud-gifting.webp", alt: "Branded merchandise at the Google Cloud South Africa region launch", label: "Google Cloud · Gifting" },
  chef: { src: "/services/amazon-chef.webp", alt: "On-site chef carving food for guests at an Amazon event", label: "Amazon · Catering" },
  food: { src: "/services/amazon-catering.webp", alt: "Food prepared for guests at an Amazon event", label: "Amazon · Food & Beverage" },
  drinks: { src: "/services/youtube-hospitality.webp", alt: "Guests celebrating at the YouTube Works Awards reception", label: "YouTube Works · Reception" },
  activation: { src: "/services/amazon-activation.webp", alt: "Guests posing inside an oversized Amazon branded box installation", label: "Amazon · Brand Activation" },
  photobooth: { src: "/services/wonderland-photobooth.webp", alt: "Heart-shaped seat at the AI in Wonderland photo experience in Cape Town", label: "AI in Wonderland · Experience" },
} satisfies Record<string, ServiceImage>;

const serviceImagesBySlug: Record<string, ServiceImage[]> = {
  "video-production": [images.amazonFilm, images.interview, images.stage],
  photography: [images.cloudPortrait, images.photobooth, images.activation],
  animation: [images.motion],
  "design-creative": [images.wonderlandDesign, images.cloudDesign, images.venue],
  "web-development": [images.website, images.rsvp],
  "live-streaming": [images.stageScreen, images.cloudPortrait, images.stage],
  "hybrid-virtual-events": [images.stage, images.stageScreen, images.interview],
  "marketing-advertising-social-media": [images.activation, images.wonderlandDesign, images.motion],
  "event-production-management": [images.venue, images.stage, images.registration],
  "venue-decor-entertainment": [images.stage, images.venue, images.photobooth],
  "rsvp-management": [images.rsvp, images.registration, images.checkIn],
  "guest-logistics": [images.registration, images.checkIn, images.venue],
  "swag-gifting": [images.swag, images.website],
  "food-beverage": [images.chef, images.food, images.drinks],
  staffing: [images.checkIn, images.registration, images.drinks],
  "experiential-marketing-brand-activations": [images.activation, images.photobooth, images.cloudDesign],
};

export const getServiceImages = (slug: string): ServiceImage[] => serviceImagesBySlug[slug] ?? [];

