# Requirements.md - NFC Tag Accessibility Website
## Project Overview

Build a mobile-responsive PWA app style website that provides accessible content for blind and visually impaired users who tap NFC tags placed on physical exhibits, didactics, or informational materials. Each NFC tag redirects to a unique URL on this website. PWA ensures that the site content can be accessed offline, if internet connection is not available.

### Target Users:

Blind and visually impaired individuals using screen readers
Users with iPhone (VoiceOver) and Android (TalkBack)
Users without specialized apps (native NFC support)
Users who may have limited technical expertise

### Core Requirements:

1. URL Structure
Use Dynamic routing for each exhibition. And for each work in the exhibition, use an anchor link. This way, when a user is browsing the exhibition in (clockwise throughout the physical gallery space) each work can be advanced to via the anchor links.

Dynamic routing: https://[domain]/exhibition/[unique-id]

Example: https://yoursite.com/exhibition/exhibition-title
Example: https://yoursite.com/exhibition/exhibition-title#work-in-exhibition


Each anchor link corresponds to one physical NFC tag on a didactic in physical space
Must support alphanumeric IDs (numbers and text)
URLs must use HTTPS (required for iPhone NFC)

1. Content Management
Backend system to manage tag content: Nuxt 3 Generate—static site generator
Each anchor link entry must include:

Unique tag ID
Content title
Content description/body text
Optional: location information
Optional: related tags/content
Created/updated timestamps

Ability to add, edit, and delete tag content
Bulk import capability (CSV preferred for spreadsheet workflow)

1. Accessibility Requirements (CRITICAL)
Screen Reader Compatibility

Proper HTML semantic structure:

Please review this link: https://sfu-galleries.github.io/digital-accessibility-strategic-plan for a style guide and layout example.

Use <header>, <main>, <article>, <nav> tags appropriately
Proper heading hierarchy (H1 → H2 → H3, no skipping)
Use <section> for distinct content areas

ARIA labels where needed:

aria-label for navigation elements
aria-describedby for complex content
role attributes when semantic HTML isn't sufficient

Skip-to-content links between each anchor representing a work
Focus management for keyboard navigation
No keyboard traps

Visual Accessibility

High contrast mode option (toggle button)
Large text option (toggle button, minimum 18px default)
Clear, readable fonts (sans-serif recommended)
Minimum color contrast ratio: 4.5:1 for normal text, 3:1 for large text
No information conveyed by color alone

Content Presentation

Content must load immediately (no splash screens or delays)
Content must be downloadable and stored to be accessed offline PWA-style
No auto-playing audio or video
All interactive elements must be keyboard accessible
Form inputs must have associated labels
Error messages must be clear and programmatically associated

4. User Experience
Mobile-First Design

Fully responsive (primary use case is mobile phones)
Touch targets minimum 44x44px
Easy one-handed navigation
Fast load times (under 2 seconds on 3G)
Check styles in the link: https://sfu-galleries.github.io/digital-accessibility-strategic-plan 
and use them throughout

Content Display

Clean, distraction-free layout
Content title displayed prominently (H1)
Body content in easily readable paragraphs
Optional "Read Aloud" button (uses Web Speech API or text-to-speech)
Option to adjust text size and contrast
Clear navigation to related content or back to home

Error Handling

Graceful handling of invalid tag IDs
User-friendly 404 page with clear message
Suggestion to check tag or contact support
No technical error messages shown to users

5. Technical Stack Suggestions
Frontend

Static site generator (Nuxt3, https://nuxt.com/, nuxt content)
No complex frameworks
Progressive Web App (PWA), beneficial for offline access

Hosting

Must support HTTPS
Fast CDN delivery
GitHub Pages

1. Content Features
Required

Display title and description for each tag
Responsive text sizing
Print-friendly view (optional but nice)

Optional Enhancements

Text-to-speech audio playback (Web Speech API)
Multiple language support
Image descriptions (if exhibits have associated images)
Related content suggestions
Breadcrumb navigation
Search functionality
QR code fallback (in addition to NFC)

7. Admin/Management Interface
Content Management Needs

Web-based admin panel (if using CMS) OR
CSV import/export for bulk updates OR
Direct file editing for JSON-based system
Preview content before publishing
Ability to see all tags and their status

Analytics (Optional)

Track which tags are accessed most frequently
Basic usage statistics
No user tracking or personal data collection

8. Performance Requirements

First Contentful Paint: < 1.5 seconds
Time to Interactive: < 3 seconds on 3G
Lighthouse Accessibility Score: 95+
Lighthouse Performance Score: 85+
Page size: < 500KB (excluding images)

9. Browser/Device Compatibility

iOS 13+ (Safari with NFC support)
Android 5.0+ (Chrome with NFC support)
Must work without JavaScript (progressive enhancement)
Graceful degradation for older browsers

10. Security & Privacy

HTTPS only (no mixed content)
No user authentication required (public access)
No cookies or tracking (unless explicitly needed and disclosed)
Content Security Policy headers
No external scripts except from trusted CDNs
GDPR/privacy compliance if collecting any data

11. Testing Requirements

Test with VoiceOver (iOS)
Test with TalkBack (Android)
Test with NVDA or JAWS (desktop screen readers)
Keyboard-only navigation testing
Color contrast validation
HTML validation (W3C validator)
Lighthouse audits

12. Documentation Needs

README with setup instructions
Content management guide
Deployment instructions
API documentation (if applicable)
Accessibility features documentation

Non-Requirements (Out of Scope)

User accounts or authentication
E-commerce functionality
Complex interactivity or animations
Social media integration (unless specifically requested)
Mobile app development (web-only)
Real-time features or websockets

Success Criteria

All tag URLs redirect to correct content
Screen reader users can access all content easily
Website loads quickly on mobile devices
Content can be updated without developer intervention
Site achieves 95+ accessibility score on Lighthouse
Zero critical WCAG 2.1 Level AA violations

Sample Tag Content Structure
json{
  "tag_id": "001",
  "title": "Starry Night by Vincent van Gogh",
  "location": "Gallery A, East Wall",
  "content": "This iconic painting from 1889 depicts a swirling night sky over a small French village. Van Gogh painted it from memory during his stay at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence.",
  "additional_info": "Oil on canvas, 73.7 cm × 92.1 cm. Currently housed at the Museum of Modern Art in New York.",
  "related_tags": ["002", "003"],
  "created_at": "2025-10-18",
  "updated_at": "2025-10-18"
}
Deliverables

Functional website deployed to hosting platform
Content management system or import process
Documentation for adding/editing content
Accessibility testing report
Deployment guide
Source code repository

Timeline Estimate

Phase 1: Basic site structure and routing (1-2 days)
Phase 2: Accessibility implementation (2-3 days)
Phase 3: Content management system (2-3 days)
Phase 4: Testing and refinement (1-2 days)
Phase 5: Deployment and documentation (1 day)

Total: 7-11 days for full implementation
Questions for Developer

Preferred tech stack or framework?
Hosting platform preference?
How many tags initially? (affects CMS choice)
Need for admin authentication?
Multi-language support needed?
Budget constraints for hosting/services?

Additional Context

Physical tags will be programmed using ACR122U NFC Reader
Tags are NTAG215 stickers on a roll
Tag URLs managed via Google Sheets initially
Target audience is museum/gallery visitors
Content will be primarily text-based descriptions
Project aims to make physical spaces more accessible