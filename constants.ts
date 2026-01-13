
import { MenuItem, Promotion } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'p1',
    name: '松露牛肝菌燉飯',
    description: '使用義大利頂級松露與牛肝菌，口感濃郁。',
    price: 480,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    isPopular: true
  },
  {
    id: 'p2',
    name: '經典瑪格麗特披薩',
    description: '新鮮莫札瑞拉起司、番茄醬與羅勒。',
    price: 380,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&h=300&fit=crop',
    isPopular: true
  },
  {
    id: 'p3',
    name: '海鮮墨魚義大利麵',
    description: '嚴選中卷、大蝦，搭配手作墨魚麵條。',
    price: 450,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop'
  },
  {
    id: 'p4',
    name: '提拉米蘇',
    description: '道地義式甜點，帶著淡淡的蘭姆酒香。',
    price: 180,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'
  }
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo1',
    title: '平日午餐 85 折',
    description: '凡於平日周一至周五午餐時段用餐，即享 85 折優惠。',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=300&fit=crop',
    expiryDate: '2024-12-31'
  },
  {
    id: 'promo2',
    title: '當月壽星禮',
    description: '壽星當月來店用餐，免費贈送提拉米蘇一份。',
    image: 'https://images.unsplash.com/photo-1530101121243-cff926505044?w=600&h=300&fit=crop',
    expiryDate: '2025-06-30'
  }
];

export const FAQS = [
  {
    question: '請問有提供素食嗎？',
    answer: '是的，我們提供多款蛋奶素與全素的義大利麵與披薩，菜單上有特別標註。'
  },
  {
    question: '低消是多少？',
    answer: '每位成人低消為一份主餐或 300 元，兒童(120cm以下)免低消。'
  },
  {
    question: '可以帶寵物嗎？',
    answer: '我們是寵物友善餐廳，只要有牽繩或推車即可進入室內區域。'
  }
];
