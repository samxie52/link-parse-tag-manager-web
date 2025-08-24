import type { ParseResponse } from '@/lib/api/api-types';

/**
 * Mock data for testing LinkParseResultDialog components
 */

export const mockXiaoHongShuData: ParseResponse = {
  parse_type: 'ai_enhanced',
  platform: 'xiaohongshu',
  basic: {
    title: '超好用的护肤品推荐！敏感肌必看✨',
    description: '最近发现了几款超级温和的护肤品，特别适合敏感肌的姐妹们！用了一个月皮肤状态真的变好了很多，分享给大家～',
    url: 'https://www.xiaohongshu.com/explore/64f8a2b3000000001203e4d5',
    author: '小红薯用户',
    tags: ['护肤', '敏感肌', '种草', '美妆'],
    images: [
      'https://sns-webpic-qc.xhscdn.com/202309151234/image1.jpg',
      'https://sns-webpic-qc.xhscdn.com/202309151234/image2.jpg',
      'https://sns-webpic-qc.xhscdn.com/202309151234/image3.jpg'
    ],
    videos: [],
    publish_time: '2023-09-15T12:34:56Z',
    language: 'zh-CN',
    metadata: {
      word_count: 156,
      reading_time: 1,
      content_type: 'lifestyle'
    }
  },
  platform_metadata: {
    note_id: '64f8a2b3000000001203e4d5',
    note_title: '超好用的护肤品推荐！敏感肌必看✨',
    author_id: 'user123456',
    author_name: '护肤达人小美',
    author_avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/user123456.jpg',
    author_desc: '护肤博主 | 敏感肌救星',
    liked_count: 1234,
    collected_count: 567,
    comment_count: 89,
    shared_count: 23,
    note_tags: ['护肤心得', '产品测评', '敏感肌'],
    topic_tags: ['护肤', '美妆种草'],
    image_count: 3,
    video_count: 0,
    at_user_list: [],
    interact_info: {
      liked: false,
      collected: false,
      followed: false
    }
  },
  ai_metadata: {
    sentiment: 'positive',
    keywords: ['护肤品', '敏感肌', '温和', '推荐'],
    summary: '博主分享适合敏感肌的护肤品推荐，强调产品温和性和使用效果',
    category: 'beauty_skincare',
    confidence: 0.92,
    language_detected: 'zh-CN',
    content_quality: 'high',
    engagement_prediction: 'high'
  }
};

export const mockAmapData: ParseResponse = {
  parse_type: 'basic',
  platform: 'amap',
  basic: {
    title: '北京三里屯太古里',
    description: '时尚购物中心，汇集国际知名品牌，是北京最具活力的商业区之一',
    url: 'https://ditu.amap.com/place/B000A83M9D',
    author: '高德地图',
    tags: ['购物中心', '时尚', '三里屯'],
    images: [
      'https://store.is.autonavi.com/showpic/pic1.jpg',
      'https://store.is.autonavi.com/showpic/pic2.jpg'
    ],
    videos: [],
    publish_time: '2023-09-15T10:00:00Z',
    language: 'zh-CN',
    metadata: {
      poi_type: 'shopping_mall',
      business_area: '三里屯'
    }
  },
  platform_metadata: {
    poi_id: 'B000A83M9D',
    poi_name: '北京三里屯太古里',
    address: '北京市朝阳区三里屯路19号',
    location: {
      lat: 39.937967,
      lng: 116.447836
    },
    district: {
      country: '中国',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      street: '三里屯路'
    },
    contact: {
      phone: '010-64171234',
      website: 'https://www.taikoolisanlitun.com'
    },
    business_info: {
      opening_hours: '10:00-22:00',
      price_level: '高档',
      rating: 4.5,
      review_count: 15678
    },
    categories: ['购物服务', '购物中心'],
    facilities: ['停车场', 'WiFi', '母婴室', '无障碍设施'],
    transport: {
      subway: ['10号线太古里站'],
      bus: ['113路', '115路', '117路']
    },
    photos: [
      'https://store.is.autonavi.com/showpic/large1.jpg',
      'https://store.is.autonavi.com/showpic/large2.jpg'
    ]
  },
  ai_metadata: null
};

export const mockGenericData: ParseResponse = {
  parse_type: 'basic',
  platform: 'generic',
  basic: {
    title: 'React 18 新特性详解 - 技术博客',
    description: '深入解析 React 18 的新特性，包括并发渲染、自动批处理、Suspense 改进等重要更新',
    url: 'https://techblog.example.com/react-18-features',
    author: '前端开发者',
    tags: ['React', 'JavaScript', '前端开发', '技术'],
    images: [
      'https://techblog.example.com/images/react18-banner.jpg'
    ],
    videos: [],
    publish_time: '2023-09-10T14:30:00Z',
    language: 'zh-CN',
    metadata: {
      word_count: 2500,
      reading_time: 10,
      content_type: 'technical_article'
    }
  },
  platform_metadata: {
    domain: 'techblog.example.com',
    site_name: 'Tech Blog',
    article_type: 'blog_post',
    canonical_url: 'https://techblog.example.com/react-18-features',
    meta_keywords: 'React 18, 并发渲染, 前端开发',
    og_image: 'https://techblog.example.com/images/react18-og.jpg',
    twitter_card: 'summary_large_image'
  },
  ai_metadata: {
    sentiment: 'neutral',
    keywords: ['React 18', '并发渲染', '自动批处理', 'Suspense'],
    summary: '技术文章详细介绍了 React 18 的主要新特性和改进',
    category: 'technology',
    confidence: 0.88,
    language_detected: 'zh-CN',
    content_quality: 'high',
    engagement_prediction: 'medium'
  }
};

export const mockEmptyData: ParseResponse = {
  parse_type: 'basic',
  platform: 'unknown',
  basic: {
    title: '',
    description: '',
    url: 'https://example.com/empty',
    author: '',
    tags: [],
    images: [],
    videos: [],
    publish_time: '',
    language: '',
    metadata: {}
  },
  platform_metadata: {},
  ai_metadata: null
};

/**
 * Test scenarios for different component states
 */
export const testScenarios = [
  {
    name: 'XiaoHongShu AI Enhanced',
    data: mockXiaoHongShuData,
    description: 'XiaoHongShu note with AI metadata and rich content'
  },
  {
    name: 'AMAP Basic Parse',
    data: mockAmapData,
    description: 'AMAP location with detailed POI information'
  },
  {
    name: 'Generic Website',
    data: mockGenericData,
    description: 'Generic website with basic metadata'
  },
  {
    name: 'Empty/Minimal Data',
    data: mockEmptyData,
    description: 'Minimal data to test fallback behavior'
  }
];

/**
 * Helper function to simulate API delay
 */
export const simulateApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API functions for testing
 */
export const mockApi = {
  parseUrl: async (url: string): Promise<ParseResponse> => {
    await simulateApiDelay();
    
    if (url.includes('xiaohongshu.com')) {
      return mockXiaoHongShuData;
    } else if (url.includes('amap.com') || url.includes('ditu.amap.com')) {
      return mockAmapData;
    } else if (url.includes('example.com/empty')) {
      return mockEmptyData;
    } else {
      return mockGenericData;
    }
  },
  
  saveParseResult: async (data: ParseResponse): Promise<void> => {
    await simulateApiDelay(500);
    console.log('Mock save:', data);
  }
};
