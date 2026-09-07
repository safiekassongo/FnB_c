// sample-posts.js
//
// Used only when site-config.js's BASE_URL is empty (local preview mode)
// so the News and Research pages have something to show instead of an
// empty list. Once a real API is connected, these are never used -
// actual published posts come from the database instead.

window.FNB_SAMPLE_NEWS = [
  {
    id: 'sample-news-1',
    title: 'FnB opens client intake in Dar es Salaam',
    category: 'Announcement',
    date: '2026-08-01',
    body: 'Forward in Business is now accepting new client engagements for land and title verification, construction supervision, and property management across Tanzania.\n\nThis is a sample post shown in local preview mode. Connect a real API in site-config.js to replace this with actual published updates.',
    image: 'https://images.unsplash.com/photo-1589177900326-900782f88a55?q=80&w=900&auto=format&fit=crop',
  },
];

window.FNB_SAMPLE_RESEARCH = [
  {
    id: 'sample-research-1',
    title: 'East African Diaspora Investment Index - preview',
    ref: 'REF. 2028 / INDEX',
    status: 'Flagship - annual',
    date: '2026-08-01',
    body: 'A preview of the format for FnB\u2019s flagship annual report, ranking regions by rental yield, land governance, construction cost, and ease of doing business.\n\nThis is a sample entry shown in local preview mode. Connect a real API in site-config.js to replace this with actual published research.',
  },
];
