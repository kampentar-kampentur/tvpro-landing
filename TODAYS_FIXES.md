# 🚀 TVPro Implementation Plan

This document tracks the planned updates for the tvprousa.com landing page.

## 🔴 Stage 1: UI/UX, Mobile Version & Bug Fixes (High Priority)

### 1. Header & Main CTA
- [x] **Main CTA Button:** 
    - Update text to: *"Take the quiz and get $30 off now"* (or similar based on Slavik's request).
    - Ensure it links directly to the Quiz.
- [x] **City Navigation:** Add a city selector (dropdown) in the header or a visible location to allow users to switch cities.
- [x] **Typography:** Keep the current font. Removed all Montserrat references and FontSwitcher component.

### 2. Mobile Version Optimization
- [x] **Hero Banner:** 
    - Remove repetitions of "Professional, Same-Day".
    - Adjust layout so text and video fit on the first screen without excessive scrolling.
- [x] **Second Screen:** Optimize the 4 banners + TV sizes section to fit the screen better.

### 3. Team & Cards Section
- [x] **Department Logic:** 
    - Split into `Customer Service` (global) and `Technicians` (city-specific).
    - Added `department` field to technicians data (default: "technician")
    - Logic: If a city has < 6 technicians, fill the remaining slots with managers.
    - /our-team page: two sections "Our Management Team" and "Our Technical Specialists"
    - Main page: shows only technicians (managers fill gaps if needed)
- [x] **Mobile UI:** Implement a grid of 2-3 cards per screen with a click-to-expand feature (photo + text). Implemented as flip card on mobile (600px height, 88% width).

### 4. Gallery & Content
- [x] **Real TV Installations:** 
    - Move **Frame TV** to the first position in the list.
- [x] **Content Update:** Integrate "Slavik's version" and the new text for the 10 sites.

### 5. Quiz / Form Fixes
- [x] **UI/UX:** Fix the progress bar overlapping the discount offer on Step 2 (reverted progress bar, adjusted padding so elements do not overlap).
- [x] **TV Size Logic:** 
    - Change TV size options from 4 to 5 variants.
    - Add "Bull" option (Full-Motion mount) for $79 when 70-85" TV is selected.
- [x] **Functionality:** 
    - Implement "Back" button functionality.
    - Fix progress bar calculation (100% should only be at the very end).
- [x] **Conditional Logic (Fireplace):**
    - If surface = `Hard` → show "Installation over fireplace" question.
    - If surface = `Drywall` → show "Installation over fireplace" question. Separated into a dedicated step so it always fits perfectly on one screen.
    - If surface = `Metal Studs` → **hide** "Installation over fireplace" question.

### 6. Manual Tasks (Arthur)
- [manual] **Reviews:** Add "1500+ reviews" badge/text.
- [manual] **General Images:** Audit all site images to ensure none are cut off.

---

## 🟡 Stage 2: SEO, Geo-Targeting & Scaling (Post-Stage 1)

### 1. SEO & Suburbs
- [ ] **Content Uniqueness:** Implement a "spintax" or phrase-mixing system to make suburb pages unique for Google while maintaining meaning.
- [ ] **Strategy:** Shift from 100+ identical pages to "Main City + Nearby Areas" approach.

### 2. New Service Pages
- [ ] **Page Creation:** Build full-fledged landing pages for:
    - Accent Wall, Wood Wall, Commercial, Home Audio, Media Wall.
- [ ] **Content:** Develop detailed sections for each to optimize for targeted ad traffic.
- [ ] **Our Services:** Add missing services from the master list; prepare placeholders for new photos/texts.
- [ ] **Services Dropdown:** Implement a dropdown menu in the header with the following new services:
    - Accent Wall Installation (`/accent-wall-installation/`)
    - Wood Wall Panel Installation (`/wood-wall-panel-installation/`)
    - Commercial TV & AV Installation (`/commercial-tv-av-installation/`)
    - Home Audio System Installation & Calibration (`/home-audio-system-installation-calibration/`)
    - Media Wall Installation (`/media-wall-installation/`)

### 3. Advanced Geo-Targeting
- [ ] **Content Filtering:** 
    - User in service area $\rightarrow$ sees local version.
    - User outside service area $\rightarrow$ sees generic version (e.g., Houston) and hides the full list of local technicians.
