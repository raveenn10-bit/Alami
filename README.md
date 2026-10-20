# Alami Villa — Premium Editorial Preview

Open dist/index.html to view the responsive site. Hosted static directory: dist.

## Added
- Local 19-second H.264 cinematic photo-motion film (1280×720, muted autoplay, loop, poster, play/pause control).
- Centered editorial hero, villa highlights strip, arched interior and bedroom images.
- Interactive conceptual villa selector, day-in-the-villa editorial section, immersive pool interlude.
- Scroll fade-in/out reveals, hero fade-out, subtle pool parallax, progress line, animated tropical footer.
- Expandable booking FAQ, enquiry validation, nights count, clipboard fallback, mobile booking CTA.
- Reduced-motion support and keyboard-visible focus.

## Media and launch configuration
This is a concept preview. The film is made from illustrative Unsplash photographs with cinematic camera motion; it is not actual villa footage. The villa diagram is conceptual, not an architectural plan. External images and Google Fonts require network access.

In dist/index.html, update VILLA_CONFIG.heroVideo with approved villa footage and VILLA_CONFIG.whatsapp with the owner's international digits-only WhatsApp number. With no owner number configured, the form prepares/copies an enquiry and does not send it. No live availability, reservation confirmation or backend exists. Confirm all property media, address, capacity, amenities, prices and policies before public launch.

Validation: JavaScript syntax, section anchors, duplicate IDs, local media paths, MP4 codec/dimensions/duration. Browser visual QA was unavailable in this environment.

## Multi-page editorial update
Seven linked pages: Home, The Villa, Location, Experiences, Gallery, FAQs, Book Your Stay. Charcoal and champagne visual system with overlapping image/content panels inspired by the supplied Amare screenshot; content is original and does not borrow Amare's amenities, pricing, reviews or contact details. Location remains awaiting confirmation. Gallery category filters/fullscreen keyboard controls, FAQ search, accessible navigation and enquiry flow are implemented. Photos and the motion film are now hosted locally. Google Fonts remains an external dependency.

## Mobile update
Responsive phone/tablet navigation, compact headings and image heights, safe-area-aware booking CTA, 16px form fields, swipe gallery, inline muted video, short scroll reveals and gentle mobile parallax. Animations respect Reduce Motion. Browser/device visual testing remains outstanding.

For Vercel, select Other with no build command and set Output Directory to `dist`.
