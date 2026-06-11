import { VibeType, Voucher } from './types';

export interface CityPreset {
  name: string;
  image: string;
  slogan: string;
  tags: string[];
}

export const PRESET_CITIES: CityPreset[] = [
  {
    name: 'Đà Lạt',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=500&auto=format&fit=crop&q=60',
    slogan: 'Thành phố mờ sương, thiên đường trốn deadline 🌲',
    tags: ['Nhiệt độ lơ lửng', 'Cà phê thông', 'Ăn bánh tráng nướng']
  },
  {
    name: 'Hà Nội',
    image: 'https://images.unsplash.com/photo-1509060464153-4466739b78d0?w=500&auto=format&fit=crop&q=60',
    slogan: 'Hà Nội không vội được đâu, làm ly cà phê trứng đê! ☕',
    tags: ['Phố cổ', 'Hồ Tây lộng gió', 'Trà chanh chợ Gạo']
  },
  {
    name: 'Phú Quốc',
    image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=500&auto=format&fit=crop&q=60',
    slogan: 'Biển xanh cát trắng, ngắm hoàng hôn đỏ lựng cực lả lướt 🏝️',
    tags: ['Bún quậy hoàng kim', 'Lặn san hô', 'Sunset ngắm biển']
  },
  {
    name: 'Sa Pa',
    image: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=500&auto=format&fit=crop&q=60',
    slogan: 'Nơi mây ôm núi, ruộng bậc thang tầng tầng lớp lớp mê mẩn 🏔️',
    tags: ['Fansipan lộng gió', 'Thung lũng Mường Hoa', 'Thắng cố độc lạ']
  },
  {
    name: 'Hội An',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60',
    slogan: 'Phố đèn lồng lung linh nhuốm màu rực rỡ hoài niệm 🏮',
    tags: ['Bánh mì Phượng', 'Thuyền hoa thả đèn', 'Sông Hoài lơ đãng']
  },
  {
    name: 'Phú Quý',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60',
    slogan: 'Đảo hoang sơ, check-in dốc Phượt lồng lộng gió biển 🌊',
    tags: ['Dốc Phượt xịn đét', 'Gành Hang thơ mộng', 'Hải sản tươi rói']
  }
];

export const VIBE_DETAILS: { vibe: VibeType; emoji: string; color: string; desc: string; label: string }[] = [
  {
    vibe: 'Chill',
    emoji: '🍃',
    color: 'bg-emerald-500 text-white',
    desc: 'Bình tĩnh sống, healing tâm hồn, trốn sếp trốn deadline, tận hưởng nhịp độ siêu thong thả.',
    label: 'Chill chữa lành'
  },
  {
    vibe: 'Foodie',
    emoji: '🍜',
    color: 'bg-amber-500 text-white',
    desc: 'Lấp đầy chiếc bụng đói với những món ngon đường phố hoành tráng, ăn sập mọi nẻo đường.',
    label: 'Ăn sập thế gian'
  },
  {
    vibe: 'Indie',
    emoji: '🎸',
    color: 'bg-indigo-500 text-white',
    desc: 'Khám phá triển lãm nghệ thuật, quán cafe ẩn sâu trong hẻm, phong cách nghệ sĩ hoài cổ độc lạ.',
    label: 'Nghệ sĩ Indie'
  },
  {
    vibe: 'Maximalism',
    emoji: '📸',
    color: 'bg-pink-500 text-white',
    desc: 'Đi kín lịch, check-in 7749 điểm cực hot, oanh tạc mọi góc sống ảo rực rỡ sắc màu.',
    label: 'Cháy máy sống ảo'
  },
  {
    vibe: 'Nightlife',
    emoji: '🍻',
    color: 'bg-purple-500 text-white',
    desc: 'Quẩy nhiệt huyết khi phố lên đèn, bia bọt cocktail, âm nhạc cực sung không ngủ.',
    label: 'Quẩy đêm rực rỡ'
  }
];

export const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: 'V1',
    code: 'LAKA15',
    partnerName: 'Cà phê Yên',
    discount: 'Giảm 15%',
    vibeRequired: 'Indie',
    claimed: false,
    description: 'Giảm giá cực keo lỳ cho các dòng sản phẩm cà phê thủ công tại mọi chi nhánh.',
    logo: '☕'
  },
  {
    id: 'V2',
    code: 'ANHEM20',
    partnerName: 'Lẩu gánh & nướng hẻm',
    discount: 'Ưu đãi 20%',
    vibeRequired: 'Foodie',
    claimed: false,
    description: 'Cùng cạ cứng ngồi vỉa hè nhâm nhi lẩu nướng ngập mặt không lo xẹp ví.',
    logo: '🍲'
  },
  {
    id: 'V3',
    code: 'CHILL30',
    partnerName: 'Mây Glamping',
    discount: 'Cực hời 30%',
    vibeRequired: 'Chill',
    claimed: false,
    description: 'Giảm giá thuê lều trại view thung lũng lãng mạn mộng mơ ngắm mây trôi bồng bềnh.',
    logo: '⛺'
  },
  {
    id: 'V4',
    code: 'SHINE10',
    partnerName: 'Local Brand Outfits',
    discount: 'Tặng ngay 10%',
    vibeRequired: 'Maximalism',
    claimed: false,
    description: 'Ưu đãi mua sắm trang phục style cực bảnh, chụp hình lung linh tôn dáng.',
    logo: '👕'
  },
  {
    id: 'V5',
    code: 'NIGHT40',
    partnerName: 'The Local Pub',
    discount: 'Tẹt ga 40%',
    vibeRequired: 'Nightlife',
    claimed: false,
    description: 'Giảm giá bill đồ uống cho nhóm đi 4 người quẩy bung xõa rực lửa phố đêm.',
    logo: '🍹'
  }
];

export interface CustomSticker {
  destination: string;
  emoji: string;
  color: string;
  unlockedMsg: string;
}

export const PASSPORT_STICKERS: Record<string, CustomSticker> = {
  'Đà Lạt': { destination: 'Đà Lạt', emoji: '⛰️', color: 'bg-teal-400', unlockedMsg: 'Thần dân sương mù' },
  'Hà Nội': { destination: 'Hà Nội', emoji: '🍜', color: 'bg-yellow-400', unlockedMsg: 'Dân chơi hồ Tây' },
  'Phú Quốc': { destination: 'Phú Quốc', emoji: '🏝️', color: 'bg-blue-400', unlockedMsg: 'Kình ngư đảo ngọc' },
  'Sa Pa': { destination: 'Sa Pa', emoji: '🏔️', color: 'bg-emerald-400', unlockedMsg: 'Chinh phục Fansipan' },
  'Hội An': { destination: 'Hội An', emoji: '🏮', color: 'bg-pink-400', unlockedMsg: 'Chúa tể đèn lồng' },
  'Phú Quý': { destination: 'Phú Quý', emoji: '🌊', color: 'bg-indigo-400', unlockedMsg: 'Chiến thần dốc phượt' },
};
