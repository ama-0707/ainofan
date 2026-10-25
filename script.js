// 새 글을 추가하려면 아래 posts 배열에 같은 형식의 객체를 넣으세요.
const samplePosts = [
  { id: 1, category: '개발', date: '2026.10.20', icon: '⌨️', title: '처음부터 만드는 나만의 웹사이트', excerpt: 'HTML과 CSS, JavaScript로 작은 홈페이지를 만들어 본 기록.', body: `웹사이트를 직접 만들면 구조를 이해하기 쉬워집니다.\n\nHTML은 콘텐츠의 뼈대를 만들고, CSS는 화면의 디자인을 담당하며, JavaScript는 검색과 버튼 같은 상호작용을 구현합니다.\n\n처음부터 모든 기능을 넣기보다는 작은 페이지 하나를 완성하고 점차 확장하는 편이 좋습니다.` },
  { id: 2, category: '일상', date: '2026.10.16', icon: '☕', title: '커피 한 잔이 필요한 오후', excerpt: '특별하지 않은 날에도 오래 남는 장면들이 있다.', body: `오늘은 조금 천천히 걸었습니다.\n\n익숙한 골목에 새로 생긴 카페가 눈에 들어왔고, 창가 자리에서 커피를 마셨습니다.\n\n어쩌면 좋은 하루는 큰 사건이 아니라 이런 작은 순간으로 만들어지는 것 같습니다.` },
  { id: 3, category: '여행', date: '2026.10.12', icon: '🗻', title: '주말에 떠난 작은 일본 여행', excerpt: '낯선 골목과 조용한 풍경을 찾아 걸었던 하루.', body: `아침 일찍 출발해 평소와 다른 거리를 걸었습니다.\n\n지도에서 유명한 장소보다 우연히 마주친 풍경이 더 기억에 남습니다.\n\n다음에도 시간을 넉넉하게 잡고 천천히 여행하고 싶습니다.` },
  { id: 4, category: '개발', date: '2026.10.08', icon: '🧩', title: 'JavaScript로 검색 기능 구현하기', excerpt: '배열의 filter 메서드로 간단한 실시간 검색 만들기.', body: `검색 기능의 핵심은 사용자가 입력한 문자열을 기준으로 글 목록을 필터링하는 것입니다.\n\nJavaScript의 filter()와 includes()를 활용하면 서버 없이도 브라우저 안에서 검색을 구현할 수 있습니다.\n\n이 블로그의 검색창도 같은 원리로 만들어졌습니다.` },
  { id: 5, category: '일상', date: '2026.10.03', icon: '📚', title: '꾸준히 기록하는 습관', excerpt: '생각을 글로 정리하면서 발견한 작은 변화들.', body: `완벽한 글을 쓰려고 하면 시작하기가 어렵습니다.\n\n짧은 문장 한 줄이라도 매일 남기다 보면 내가 무엇을 좋아하고 궁금해하는지 보이기 시작합니다.\n\n이 공간은 그런 기록을 위한 장소입니다.` },
  { id: 6, category: '여행', date: '2026.09.28', icon: '🌿', title: '도시 속 작은 정원 발견하기', excerpt: '바쁜 하루 사이에서 찾아낸 초록빛 휴식.', body: `복잡한 도심 한가운데 조용한 정원을 찾았습니다.\n\n나무 그늘에 앉아 잠시 쉬는 것만으로도 하루의 분위기가 달라집니다.\n\n가까운 장소라도 새로운 눈으로 보면 충분히 여행이 됩니다.` }
];
let posts = samplePosts;

const grid = document.querySelector('#postGrid');
const searchInput = document.querySelector('#searchInput');
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
const filters = document.querySelectorAll('.filter');
const dialog = document.querySelector('#postDialog');
let selectedCategory = '전체';

function renderPosts() {
  const term = searchInput.value.trim().toLocaleLowerCase();
  const visible = posts.filter(post =>
    (selectedCategory === '전체' || post.category === selectedCategory) &&
    [post.title, post.excerpt, post.body, post.category].some(value => value.toLocaleLowerCase().includes(term))
  );
  grid.replaceChildren();
  visible.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card';
    const cover = document.createElement('div');
    cover.className = `post-cover ${post.category === '개발' ? 'cover-dev' : post.category === '일상' ? 'cover-life' : 'cover-trip'}`;
    const icon = document.createElement('span');
    icon.textContent = post.icon;
    if (post.image) { const image = document.createElement("img"); image.src = post.image; image.alt = ""; image.loading = "lazy"; image.className = "cover-image"; cover.append(image); } else { cover.append(icon); }
    const content = document.createElement('div');
    content.className = 'post-content';
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = post.category;
    const date = document.createElement('span');
    date.textContent = post.date;
    meta.append(tag, date);
    const title = document.createElement('h3');
    title.textContent = post.title;
    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt;
    const button = document.createElement('button');
    button.className = 'read-btn';
    button.type = 'button';
    button.textContent = '글 읽기 →';
    button.setAttribute('aria-label', `${post.title} 글 읽기`);
    button.addEventListener('click', () => openPost(post));
    content.append(meta, title, excerpt, button);
    card.append(cover, content);
    grid.append(card);
  });
  resultCount.textContent = `총 ${visible.length}개의 글`;
  emptyState.hidden = visible.length !== 0;
}

function openPost(post) {
  document.querySelector('#dialogCategory').textContent = post.category;
  document.querySelector('#dialogTitle').textContent = post.title;
  document.querySelector('#dialogDate').textContent = post.date;
  document.querySelector('#dialogBody').textContent = post.body;
  const image = document.querySelector('#dialogImage');
  image.hidden = !post.image;
  if (post.image) image.src = post.image; else image.removeAttribute('src');
  dialog.showModal();
}

filters.forEach(button => button.addEventListener('click', () => {
  selectedCategory = button.dataset.category;
  filters.forEach(filter => {
    const isActive = filter === button;
    filter.classList.toggle('active', isActive);
    filter.setAttribute('aria-pressed', String(isActive));
  });
  async function loadPublishedPosts() {
  try {
    const response = await fetch('./posts.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('게시물 파일을 불러오지 못했습니다.');
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('posts.json은 배열이어야 합니다.');
    posts = payload.filter(post => post && typeof post.title === 'string' && typeof post.body === 'string');
  } catch (error) {
    console.info('posts.json 읽기 실패: 기본 샘플 글 표시 (file:// 열기 등)', error);
  }
  renderPosts();
}
loadPublishedPosts();
}));
searchInput.addEventListener('input', renderPosts);
document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const themeToggle = document.querySelector('#themeToggle');
const storedTheme = localStorage.getItem('blog-theme');
const startingTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
  localStorage.setItem('blog-theme', theme);
}
setTheme(startingTheme);
themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
document.querySelector('#year').textContent = new Date().getFullYear();
async function loadPublishedPosts() {
  try {
    const response = await fetch('./posts.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('게시물 파일을 불러오지 못했습니다.');
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('posts.json은 배열이어야 합니다.');
    posts = payload.filter(post => post && typeof post.title === 'string' && typeof post.body === 'string');
  } catch (error) {
    console.info('posts.json 읽기 실패: 기본 샘플 글 표시 (file:// 열기 등)', error);
  }
  renderPosts();
}
loadPublishedPosts();
