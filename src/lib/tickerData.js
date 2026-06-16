/**
 * Статичный массив 12 фраз для бегущей строки в Hero.
 * Источник: TVPro_Top_Running_Line_Ticker_12_Items.md (корень проекта)
 *
 * Формат: { main: string } — совместим со структурой из Strapi /api/hero-text-lines.
 * Каждая строка содержит спинтакс {A|B|C}, который разворачивается через resolveSpintaxLine().
 *
 * Используется как fallback, если Strapi не вернул строки.
 */
export const RAW_TICKER_LINES = [
  { main: "{Discounts Available|Special Offers Available|Ask About Current Discounts}" },
  { main: "{Elegant Wall-Mounted Solutions for Frame & Ultra-Slim TVs|Clean Frame TV & Ultra-Slim TV Installation|Premium Low-Profile TV Mounting}" },
  { main: "{Premium Wire Concealment - Even Through Brick Walls|Wire Concealment for Drywall, Brick & Concrete Walls|Clean Cable Hiding for Brick, Concrete & Drywall}" },
  { main: "{Shoe Covers. Clean Work Area. Respect for Your Home. Always.|Clean Work. Shoe Covers. No Mess Left Behind.|We Protect Your Home and Clean Up After Installation}" },
  { main: "{TV Installation on Any Surface - Drywall, Brick, Tile & Stone|Mounting on Drywall, Brick, Concrete, Tile & Stone|Professional TV Mounting on Almost Any Wall Surface}" },
  { main: "{TV + Soundbar Combo Installation|TV and Soundbar Mounting in One Visit|Clean TV + Soundbar Setup}" },
  { main: "{Frame TV Installation with Recessed Box Options|Frame TV Setup with Hidden Wires|Samsung Frame TV Mounting with a Clean Finish}" },
  { main: "{Flush-to-Wall TV Mounting Available|Low-Profile TV Installation for a Sleek Look|Clean Flush Wall TV Setups}" },
  { main: "{MantelMount MM815 Installation Specialists|Professional MantelMount MM815 Setup|MantelMount MM815 Installed Safely and Cleanly}" },
  { main: "{4-TV and 6-TV Media Wall Installation|Video Wall Setup with 4 or 6 TVs|Multi-TV Media Walls Built as One Large Screen}" },
  { main: "{Commercial TV Installation for Offices and Facilities|Office, Retail and Commercial TV Mounting|Professional TV Installs for Business Spaces}" },
  { main: "{Available for Government Organization Projects|TV Installation for Offices and Government Facilities|Commercial and Government Facility TV Mounting}" },
];
