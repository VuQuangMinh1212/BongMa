export const FPS = 60;
export const GHOST_DATA_KEY = "AsynchronousEchoes_V4";

export const UPGRADES = [
  {
    id: "spd",
    name: "Giày Gió",
    desc: "+10% Tốc độ di chuyển",
    action: (p) => (p.speed *= 1.1),
  },
  {
    id: "fire",
    name: "Kích Thích",
    desc: "Giảm 20% thời gian nạp đạn",
    action: (p) => (p.fireRate = Math.max(5, p.fireRate * 0.8)),
  },
  {
    id: "multi",
    name: "Đạn Kép",
    desc: "Bắn thêm 1 tia đạn (Tối đa 5)",
    action: (p) => (p.multiShot = Math.min(5, p.multiShot + 1)),
  },
  {
    id: "bounce",
    name: "Đạn Nẩy",
    desc: "Đạn nẩy vào tường 1 lần",
    action: (p) => p.bounces++,
  },
  {
    id: "dash",
    name: "Lướt Nhanh",
    desc: "Giảm 30% hồi chiêu Lướt",
    action: (p) => (p.dashMaxCooldown *= 0.7),
  },
];

export const CHARACTERS = [
  {
    id: "speedster",
    name: "Tia Chớp",
    price: 300,
    baseStats: { hp: 3, speed: 6.5, fireRate: 18, multiShot: 1, bounces: 0 },
    skills: [
      { name: "Phóng nhanh", desc: "+30% tốc độ trong 10 giây" },
      { name: "Đạn laser", desc: "Tốc độ đạn +20%" },
      { name: "Bước chân bóng", desc: "Giảm hồi chiêu lướt 15%" },
    ],
  },
  {
    id: "tank",
    name: "Pháo Đài",
    price: 300,
    baseStats: { hp: 6, speed: 4, fireRate: 22, multiShot: 1, bounces: 1 },
    skills: [
      { name: "Giáp cứng", desc: "+1 khiên cơ bản" },
      { name: "Mảnh vụn", desc: "Đạn nẩy +1" },
      { name: "Hồi phục", desc: "Tăng hồi máu nhỏ" },
    ],
  },
  {
    id: "sharpshooter",
    name: "Xạ Thủ",
    price: 300,
    baseStats: { hp: 4, speed: 5, fireRate: 15, multiShot: 2, bounces: 0 },
    skills: [
      { name: "Tập trung", desc: "Tăng sát thương đạn" },
      { name: "Bắn chéo", desc: "Đạn thêm 1 tia" },
      { name: "Định tâm", desc: "Giảm 5% tỉ lệ vắng" },
    ],
  },
  {
    id: "ghost",
    name: "Bóng Ma",
    price: 300,
    baseStats: { hp: 3, speed: 4.5, fireRate: 16, multiShot: 1, bounces: 2 },
    skills: [
      { name: "Nảy mạnh", desc: "Bounces +1" },
      { name: "Mập mờ", desc: "Tăng gracePeriod" },
      { name: "Lượn nhanh", desc: "Tăng tốc độ lướt" },
    ],
  },
  {
    id: "mage",
    name: "Phù Thủy",
    price: 300,
    baseStats: { hp: 4, speed: 5, fireRate: 12, multiShot: 3, bounces: 0 },
    skills: [
      { name: "Lời nguyền", desc: "Thuốc tăng exp" },
      { name: "Mưa đạn", desc: "Thêm 1 tia fire" },
      { name: "Năng lượng", desc: "Hồi phục khi đánh" },
    ],
  },
];

export const BOSS_REWARDS = [
  {
    id: "hp",
    name: "Trái Tim",
    desc: "+1 Máu tối đa & Hồi đầy máu",
    action: (p) => {
      p.maxHp++;
      p.hp = p.maxHp;
    },
  },
  {
    id: "shield",
    name: "Khiên Năng Lượng",
    desc: "Chặn 1 đòn tấn công bất kỳ và tự hồi sau 5s",
    action: (p) => {
      p.maxShield = (p.maxShield || 0) + 1;
      p.shield = p.maxShield;
      p.shieldRegenTimer = 0;
    },
  },
  {
    id: "coin",
    name: "Túi Tiền",
    desc: "+100 Tiền (Chưa có shop)",
    action: (p) => (p.coins = (p.coins || 0) + 100),
  },
];
