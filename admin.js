// GitHub Pages는 정적 호스팅입니다. 이 편집기는 로그인/서버 저장/자동 배포를 제공하지 않습니다.
const KEY = 'comma-blog-draft-v1';
const $ = id => document.getElementById(id);
let posts = [], editingId = null, currentImage = '';
function notify(message) { $('status').textContent = message; }
function validate(items) {
  if (!Array.isArray(items)) throw new Error('JSON 최상위 값은 글 배열이어야 합니다.');
  if (items.length > 1000) throw new Error('글은 최대 1000개까지 가져올 수 있습니다.');
  const ids = new Set();
  return items.map((item,i) => {
    if (!item || typeof item !== 'object' || !Number.isSafeInteger(item.id) || ids.has(item.id)) throw new Error(`${i+1}번째 글의 ID가 잘못되었거나 중복입니다.`);
    ids.add(item.id);
    if (typeof item.title !== 'string' || !item.title.trim() || typeof item.body !== 'string' || typeof item.excerpt !== 'string') throw new Error(`${i+1}번째 글의 필수 항목이 잘못되었습니다.`);
    if (item.image && (typeof item.image !== 'string' || !(item.image.startsWith('data:image/jpeg;base64,') || /^https:\/\//.test(item.image)))) throw new Error('이미지는 JPEG 데이터 또는 HTTPS 주소여야 합니다.');
    return {id:item.id, category:['개발','일상','여행'].includes(item.category)?item.category:'일상', date:typeof item.date==='string'?item.date:'', icon:typeof item.icon==='string'?item.icon:'📝',title:item.title,excerpt:item.excerpt,body:item.body,image:item.image||''};
  });
}
function persist() { try { localStorage.setItem(KEY,JSON.stringify(posts)); return true; } catch { notify('브라우저 저장 공간 부족입니다. JSON을 다운로드해 백업하세요.'); return false; } }
function formatDate(date) {return date.replaceAll('-','.');}
function unformatDate(date) {return /^\d{4}\.\d{2}\.\d{2}$/.test(date)?date.replaceAll('.','-'):date;}
function resetForm() {editingId=null;currentImage='';$('postForm').reset();$('date').value=new Date().toLocaleDateString('en-CA');$('imagePreview').hidden=true;$('imagePreview').removeAttribute('src');$('formHeading').textContent='새 글 작성';$('imageFile').value='';notify('');}
function renderList() {const box=$('adminList');box.replaceChildren();posts.forEach(item=>{const row=document.createElement('div');row.className='admin-post-item';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=item.title;const sub=document.createElement('small');sub.textContent=`${item.category} · ${item.date}`;info.append(title,sub);const buttons=document.createElement('div');buttons.className='admin-actions';const edit=document.createElement('button');edit.type='button';edit.className='action-btn secondary';edit.textContent='수정';edit.addEventListener('click',()=>editPost(item.id));const del=document.createElement('button');del.type='button';del.className='action-btn danger';del.textContent='삭제';del.addEventListener('click',()=>deletePost(item.id));buttons.append(edit,del);row.append(info,buttons);box.append(row);});if(!posts.length)box.textContent='글이 없습니다. 새 글을 작성해 보세요.';}
function editPost(id){const item=posts.find(p=>p.id===id);if(!item)return;editingId=id;$('title').value=item.title;$('category').value=item.category;$('date').value=unformatDate(item.date);$('excerpt').value=item.excerpt;$('body').value=item.body;currentImage=item.image||'';updateImage();$('formHeading').textContent='글 수정';$('editor').scrollIntoView({behavior:'smooth'});notify('기존 글을 편집 중입니다.');}
function deletePost(id){if(!confirm('이 글을 삭제할까요? 삭제한 뒤 JSON을 내보내기 전에는 공개 사이트가 변경되지 않습니다.'))return;posts=posts.filter(p=>p.id!==id);persist();renderList();if(editingId===id)resetForm();notify('목록에서 삭제했습니다. JSON을 다운로드해 배포하세요.');}
function updateImage(){$('imagePreview').hidden=!currentImage;if(currentImage)$('imagePreview').src=currentImage;else $('imagePreview').removeAttribute('src');}
async function compressImage(file){if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type))throw Error('지원하지 않는 이미지 형식입니다.');if(file.size>10*1024*1024)throw Error('이미지는 10MB 이하여야 합니다.');const bitmap=await createImageBitmap(file);try{const ratio=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.78);}finally{bitmap.close();}}
$('imageFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{currentImage=await compressImage(file);updateImage();notify('이미지가 첨부되었습니다. 글을 저장하세요.');}catch(error){notify(error.message);e.target.value='';}});
$('clearImage').addEventListener('click',()=>{currentImage='';$('imageFile').value='';updateImage();notify('이미지가 제거되었습니다.');});
$('postForm').addEventListener('submit',e=>{e.preventDefault();const id=editingId??(Math.max(0,...posts.map(p=>p.id))+1);const entry={id,category:$('category').value,date:formatDate($('date').value),icon:({'개발':'⌨️','일상':'☕','여행':'🗻'})[$('category').value],title:$('title').value.trim(),excerpt:$('excerpt').value.trim(),body:$('body').value.trim(),image:currentImage};if(!entry.title||!entry.body||!entry.excerpt)return notify('필수 항목을 입력하세요.');posts=editingId===null?[entry,...posts]:posts.map(p=>p.id===id?entry:p);const ok=persist();renderList();resetForm();notify(ok?'브라우저에 저장했습니다. 공개하려면 posts.json을 다운로드해 GitHub에 올리세요.':'저장 공간 부족: JSON 파일로 백업하세요.');});
$('newPost').addEventListener('click',resetForm);
$('exportPosts').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(posts,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='posts.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('posts.json 다운로드를 시작했습니다. GitHub 저장소에 업로드하세요.');});
$('importPosts').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>25*1024*1024)throw Error('JSON은 25MB 이하만 가져올 수 있습니다.');const incoming=validate(JSON.parse(await file.text()));if(!confirm(`현재 편집 목록을 ${incoming.length}개 글로 교체할까요?`))return;posts=incoming;persist();renderList();resetForm();notify('글 목록을 가져왔습니다.');}catch(error){notify('가져오기 실패: '+error.message);}finally{e.target.value='';}});
function theme(value){document.documentElement.dataset.theme=value;$('themeToggle').textContent=value==='dark'?'☀':'☾';localStorage.setItem('blog-theme',value);}
theme(localStorage.getItem('blog-theme')==='dark'?'dark':'light');$('themeToggle').addEventListener('click',()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
(async()=>{try{const draft=localStorage.getItem(KEY);if(draft){posts=validate(JSON.parse(draft));}else{const response=await fetch('./posts.json',{cache:'no-store'});if(!response.ok)throw Error();posts=validate(await response.json());persist();}}catch{posts=[];notify('초기 posts.json 로드에 실패했습니다. 로컬 파일은 웹 서버에서 실행하거나 JSON을 가져오세요.');}resetForm();renderList();})();
