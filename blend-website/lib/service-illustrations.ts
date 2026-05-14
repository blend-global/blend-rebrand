const serviceIllustrationBySlug = {
  "video-production": "/services-illustrations/video-production.svg",
  photography: "/services-illustrations/photography.svg",
  animation: "/services-illustrations/animation.svg",
  "design-creative": "/services-illustrations/design-creative.svg",
  "web-development": "/services-illustrations/web-development.svg",
  "live-streaming": "/services-illustrations/live-streaming.svg",
  "hybrid-virtual-events": "/services-illustrations/hybrid-virtual-events.svg",
  "marketing-advertising-social-media": "/services-illustrations/marketing-advertising-social-media.svg",
  "event-production-management": "/services-illustrations/event-production-management.svg",
  "venue-decor-entertainment": "/services-illustrations/venue-decor-management.svg",
  "rsvp-management": "/services-illustrations/rsvp-management.svg",
  "guest-logistics": "/services-illustrations/guest-logistics.svg",
  "swag-gifting": "/services-illustrations/swag-gifting.svg",
  "food-beverage": "/services-illustrations/food-beverage.svg",
  staffing: "/services-illustrations/staffing.svg",
  "experiential-marketing-brand-activations": "/services-illustrations/experiential-marketing-brand-design.svg",
} as const;

export const getServiceIllustration = (slug: string) =>
  serviceIllustrationBySlug[slug as keyof typeof serviceIllustrationBySlug] ?? null;
