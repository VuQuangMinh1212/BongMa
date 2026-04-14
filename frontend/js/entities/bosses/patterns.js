// ===== PATTERNS ORCHESTRATOR =====
// File này chỉ import và re-export từ các module con.
// Mọi logic chiêu thức đã được phân tách theo boss theme vào thư mục patterns/.

export { activateShield } from "./patterns/patternHelpers.js";
import { ATTACK_MODES_MAP } from "./patterns/attackModes.js";
import { FIRE_SKILLS } from "./patterns/skillsFire.js";
import { EARTH_SKILLS } from "./patterns/skillsEarth.js";
import { ICE_WIND_SKILLS } from "./patterns/skillsIceWind.js";
import { THUNDER_SKILLS } from "./patterns/skillsThunder.js";
import { VOID_OMNI_SKILLS } from "./patterns/skillsVoidOmni.js";
import { GLITCH_SKILLS } from "./patterns/skillsGlitch.js";

export const ATTACK_MODES = ATTACK_MODES_MAP;

export const SPECIAL_SKILLS = {
  ...FIRE_SKILLS,
  ...EARTH_SKILLS,
  ...ICE_WIND_SKILLS,
  ...THUNDER_SKILLS,
  ...VOID_OMNI_SKILLS,
  ...GLITCH_SKILLS,
};
