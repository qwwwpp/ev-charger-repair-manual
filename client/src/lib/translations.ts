// Define a type for the translation object structure
interface TranslationMap {
  app_title: string;
  error_types: string;
  all_errors: string;
  normal_stop: string;
  device_error: string;
  vehicle_error: string;
  language_toggle: string;
  help: string;
  search_placeholder: string;
  common_searches: string;
  results: string;
  results_count: string;
  error_code: string;
  error_type: string;
  description: string;
  cause: string;
  error_details: string;
  repair_steps: string;
  download_guide: string;
  view_tutorial: string;
  no_results: string;
  try_different: string;
  view_all: string;
  home: string;
  search: string;
  favorites: string;
  settings: string;
  video_tutorials: string;
  related_videos: string;
  video_duration: string;
  watch_video: string;
  no_videos: string;
  all_videos: string;
  [key: string]: string; // Allow string indexing for dynamic keys
}

// Type for the translations object
interface Translations {
  zh: TranslationMap;
  en: TranslationMap;
}

export const translations: Translations = {
  zh: {
    app_title: 'EV充电桩维修手册',
    error_types: '故障类型',
    all_errors: '全部故障',
    normal_stop: '常规停止',
    device_error: '设备异常',
    vehicle_error: '车辆异常',
    language_toggle: '切换语言 / English',
    help: '帮助',
    search_placeholder: '输入故障码或关键词搜索...',
    common_searches: '常见搜索',
    results: '查询结果',
    results_count: '共 {count} 条结果',
    error_code: '故障码',
    error_type: '故障类型',
    description: '故障描述',
    cause: '故障原因',
    error_details: '故障详情',
    repair_steps: '维修步骤',
    download_guide: '下载更换指南',
    view_tutorial: '查看视频教程',
    no_results: '未找到匹配结果',
    try_different: '请尝试使用不同的搜索词或浏览所有故障码分类。',
    view_all: '查看所有故障码',
    home: '首页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    video_tutorials: '视频教程',
    related_videos: '相关视频教程',
    video_duration: '时长',
    watch_video: '观看视频',
    no_videos: '暂无相关视频',
    all_videos: '查看所有视频教程'
  },
  en: {
    app_title: 'EV Charger Repair Manual',
    error_types: 'Error Types',
    all_errors: 'All Errors',
    normal_stop: 'Normal Stop',
    device_error: 'Device Error',
    vehicle_error: 'Vehicle Error',
    language_toggle: '中文 / English',
    help: 'Help',
    search_placeholder: 'Search by error code or keywords...',
    common_searches: 'Common Searches',
    results: 'Results',
    results_count: 'Total: {count} results',
    error_code: 'Error Code',
    error_type: 'Error Type',
    description: 'Description',
    cause: 'Cause',
    error_details: 'Error Details',
    repair_steps: 'Repair Steps',
    download_guide: 'Download Guide',
    view_tutorial: 'View Tutorial',
    no_results: 'No Results Found',
    try_different: 'Please try different keywords or browse all error codes.',
    view_all: 'View All Error Codes',
    home: 'Home',
    search: 'Search',
    favorites: 'Favorites',
    settings: 'Settings',
    video_tutorials: 'Video Tutorials',
    related_videos: 'Related Video Tutorials',
    video_duration: 'Duration',
    watch_video: 'Watch Video',
    no_videos: 'No Videos Available',
    all_videos: 'View All Tutorials'
  }
};
