'use strict';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY'}).format(Number(v)||0),date=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit'});};
function eventTimeRange(event){
  const start=new Date(event.startsAt),minutes=Number(event.durationMinutes)||120;
  if(Number.isNaN(start.getTime()))return '—';
  const end=new Date(start.getTime()+minutes*60000);
  const endLabel=start.toDateString()===end.toDateString()?end.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}):date(end);
  return `${date(start)}〜${endLabel}`;
}
const pages={overview:'ダッシュボード',events:'イベント管理',reservations:'予約・参加管理',customers:'顧客管理',delivery:'メッセージ配信',memberships:'チケット',settings:'設定'};
const cardNames={tournament:'トナメチケット',reward:'報酬チケット'};
const paths=['M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z','M5 4h14v17H5z M8 2v4 M16 2v4 M5 9h14','M5 3h14v18H5z M8 8h8 M8 12h8 M8 16h5','M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3a4 4 0 0 1 0 8','M3 5h18v14H3z M3 5l9 7 9-7','M3 6h18v12H3z M7 10h4 M7 14h2','M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2','M5 5h.01 M12 5h.01 M19 5h.01 M5 12h.01 M12 12h.01 M19 12h.01 M5 19h.01 M12 19h.01 M19 19h.01'];
const icon=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[i]||paths[6]}"/></svg>`;
let data=null,page='overview',query='',customerTag='',messagePreview=null,busy=false,deliverySection='chat',automationSection='confirmation';
const listPages={customers:1,reservationUpcoming:1,reservationPast:1,reservationParticipants:1,sources:1,cardRecords:1};
let reservationPageEventId=null,lastCustomerPageSize=0;
function customerPageSize(){const width=Number(window.innerWidth)||1280,height=Number(window.innerHeight)||900;return width<=760?5:Math.max(2,Math.min(12,Math.floor((height-390)/74)));}
const eventCalendarState={month:null,selected:null,type:''};
const types={trial:'体験会・講習',tournament:'トーナメント',special:'特別講習',other:'その他'};
const confirmed=b=>b.status!=='cancelled',eventOf=b=>{const current=data.events.find(e=>e.id===b.eventId),snap=b.event||b.eventSnapshot||current||{};return {...snap,eventType:snap.eventType||current?.eventType||'other'};},name=p=>p?.fullName||p?.pokerName||'未登録';
function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',4000);}
async function api(url,body){const r=await fetch(url,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});let j;try{j=await r.json();}catch{throw new Error('応答を読み込めませんでした。');}if(!r.ok)throw new Error(j.error||j.message||'操作に失敗しました。');return j;}
async function load(){data=await api('/api/admin/data');updateEnvironmentLabels();render();}
async function mutate(url,body,button,successMessage='保存しました'){if(busy)return;busy=true;if($('#dialog-feedback'))$('#dialog-feedback').hidden=true;if(button)button.disabled=true;try{await api(url,body);await load();toast(successMessage);return true;}catch(e){const feedback=$('#dialog[open] #dialog-feedback');if(feedback){feedback.textContent=e.message;feedback.hidden=false;}else toast(e.message);return false;}finally{busy=false;if(button)button.disabled=false;}}
function header(title,description,action=''){if(page!=='overview'&&page!=='settings')return `<h1 class="sr-only">${esc(title)}</h1>${action?`<div class="page-action-row">${action}</div>`:''}`;return `<div class="page-head"><div><div class="eyebrow">OPERATIONS / ${page.toUpperCase()}</div><h1>${esc(title)}</h1><p class="subtitle">${esc(description)}</p></div>${action}</div>`;}
function empty(text='まだデータがありません'){return `<div class="empty"><strong>${text}</strong>${data?.demoMode?'参加者画面で申し込むか、デモ用のサンプルを追加してください。<br><button class="btn" data-action="sample">サンプルを追加</button>':'参加者画面からの登録をお待ちください。'}</div>`;}
function eventTable(events){return events.length?`<div class="table-wrap"><table><thead><tr><th>イベント / 会場</th><th>開催日時</th><th>予約 / 定員</th><th>参加費</th><th>公開状態</th><th></th></tr></thead><tbody>${events.map(e=>`<tr><td><div class="cell-title">${esc(e.title)}</div><div class="cell-sub">${esc(e.venue)} · ${esc(types[e.eventType]||types.trial)}</div></td><td>${esc(eventTimeRange(e))}</td><td>${Number(e.booked)||0}<span class="muted"> / ${Number(e.capacity)||0}名</span><div class="cell-sub">残り ${Math.max(0,Number(e.capacity)-Number(e.booked||0))}席</div><div class="progress"><span style="width:${Math.min(100,(Number(e.booked)||0)/(Number(e.capacity)||1)*100)}%"></span></div></td><td>${money(e.priceYen)}</td><td><span class="badge ${e.published===false?'gray':''}">${e.published===false?'非公開':'公開中'}</span></td><td><button class="btn small" data-edit-event="${esc(e.id)}">編集</button></td></tr>`).join('')}</tbody></table></div>`:empty('イベントがありません');}
function bookingTable(bookings,showEvent=true){return bookings.length?`<div class="table-wrap"><table${showEvent?'':' class="reservation-customer-table"'}><thead><tr><th>参加者</th>${showEvent?'<th>イベント</th>':''}<th>申込日時</th><th>予約状態</th>${!showEvent?'<th>顧客詳細</th>':''}</tr></thead><tbody>${bookings.map(b=>`<tr><td><div class="cell-title">${esc(name(b.profile))}</div><div class="cell-sub">${esc(b.profile?.pokerName)}</div>${!showEvent&&b.profile?.phoneNumber?`<div class="reservation-customer-phone">${esc(b.profile.phoneNumber)}</div>`:''}</td>${showEvent?`<td>${esc(eventOf(b).title||'—')} <span class="badge gray">${esc(types[eventOf(b).eventType]||types.trial)}</span><div class="cell-sub">${esc(eventTimeRange(eventOf(b)))}</div></td>`: ''}<td>${esc(date(b.createdAt))}</td><td><span class="badge ${confirmed(b)?'':'gray'}">${b.status==='confirmed'?(b.payment?.environment==='sandbox'?'テスト決済確認・実決済なし':'予約確定'):b.status==='awaiting_payment_setup'?'申込受付・未決済':b.status==='cancelled'?'キャンセル':esc(b.status)}</span></td>${!showEvent?`<td>${data.customers.some(c=>c.id===b.customerId)?`<button type="button" class="btn" data-customer="${esc(b.customerId)}" aria-label="${esc(name(b.profile))}の顧客詳細を開く">顧客詳細を見る</button>`:'—'}</td>`:''}</tr>`).join('')}</tbody></table></div>`:empty('予約がありません');}
function pagedList(items,key,size,label){
  const totalPages=Math.max(1,Math.ceil(items.length/size));
  const current=Math.min(Math.max(1,listPages[key]||1),totalPages);
  listPages[key]=current;
  const start=(current-1)*size;
  const pageNumbers=[...new Set([1,current-1,current,current+1,totalPages])].filter(number=>number>=1&&number<=totalPages).sort((a,b)=>a-b);
  const button=(number,text,disabled=false)=>`<button type="button" class="btn small" data-list-page="${key}" data-page-number="${number}" ${disabled?'disabled':''} ${number===current&&typeof text==='number'?'aria-current="page"':''} aria-label="${esc(label)} ${text==='前へ'?'前のページ':text==='次へ'?'次のページ':`${number}ページ目`}">${text}</button>`;
  let last=0;
  const numbers=pageNumbers.map(number=>{const gap=number-last>1?'<span class="pagination-ellipsis" aria-hidden="true">…</span>':'';last=number;return gap+button(number,number);}).join('');
  const controls=items.length>size?`<nav class="pagination" aria-label="${esc(label)}のページ切り替え"><span class="pagination-status">${start+1}〜${Math.min(start+size,items.length)}件 / 全${items.length}件</span><div class="pagination-buttons">${button(current-1,'前へ',current===1)}${numbers}${button(current+1,'次へ',current===totalPages)}</div></nav>`:'';
  return {items:items.slice(start,start+size),controls};
}
function bindPagination(root=document){
  root.querySelectorAll('[data-list-page]').forEach(button=>button.onclick=()=>{
    const key=button.dataset.listPage;
    listPages[key]=Number(button.dataset.pageNumber);
    if(key==='customers'){paintCustomerResults();fillCustomerPage();}else render();
    document.querySelector(`[data-list-page="${key}"][aria-current="page"]`)?.focus({preventScroll:true});
    if(key!=='customers')document.querySelector(`[data-page-section="${key}"]`)?.scrollIntoView({block:'start'});
  });
}
function filteredCustomers(){const selectedCustomer=new URLSearchParams(location.hash.split('?')[1]||'').get('customer');return data.customers.filter(c=>selectedCustomer?c.id===selectedCustomer:(!customerTag||(c.tags||[]).includes(customerTag))&&`${name(c.profile)} ${c.profile?.pokerName||''} ${(c.tags||[]).join(' ')}`.includes(query));}
let lineFollowersState=null,lineFollowersPending=null;
function dashboardFollowers(){
  if(!lineFollowersState)return '<span class="dashboard-metric-value">取得中…</span><span class="dashboard-metric-note">LINEの集計を確認しています</span>';
  if(lineFollowersState.status==='ready'){
    const day=lineFollowersState.asOf;
    const total=new Intl.NumberFormat('ja-JP').format(lineFollowersState.followers);
    const asOf=esc(`${day.slice(0,4)}/${day.slice(4,6)}/${day.slice(6,8)}時点`);
    return !Number.isInteger(lineFollowersState.monthlyAdds)
      ? `<span class="dashboard-metric-value dashboard-metric-unavailable">今月の集計待ち</span><span class="dashboard-metric-note">${asOf} · 累計${total}人</span>`
      : `<span class="dashboard-metric-value">+${new Intl.NumberFormat('ja-JP').format(lineFollowersState.monthlyAdds)}<small>人</small></span><span class="dashboard-metric-note">${asOf} · 累計${total}人（ブロック後も含む）</span>`;
  }
  return `<span class="dashboard-metric-value dashboard-metric-unavailable">${lineFollowersState.status==='unconfigured'?'未接続':'取得できません'}</span><span class="dashboard-metric-note">${lineFollowersState.status==='unconfigured'?'LINE連携後に表示します':'LINEの集計を確認してください'}</span>`;
}
function dashboardTicketSales(){
  const sales=data.ticketSales;
  if(sales?.status==='ready'&&Number.isInteger(sales.sold)&&sales.sold>=0&&Number.isInteger(sales.revenueYen)&&sales.revenueYen>=0)
    return `<span class="dashboard-metric-value">${new Intl.NumberFormat('ja-JP').format(sales.sold)}<small>枚</small></span><span class="dashboard-metric-note">実売上 ${money(sales.revenueYen)} · 決済確定分</span>`;
  return '<span class="dashboard-metric-value dashboard-metric-unavailable">未連携</span><span class="dashboard-metric-note">実決済の連携後に販売枚数と売上を表示します</span>';
}
async function loadDashboardFollowers(){
  if(lineFollowersState||lineFollowersPending)return;
  lineFollowersPending=api('/api/admin/line/followers').catch(()=>({status:'unavailable'}));
  try{lineFollowersState=await lineFollowersPending;const target=$('#dashboard-line-followers');if(target)target.innerHTML=dashboardFollowers();}
  finally{lineFollowersPending=null;}
}
function dashboardPage(upcoming){
  const rows=upcoming.slice(0,3).map(event=>`<a class="dashboard-event" href="#reservations?event=${encodeURIComponent(event.id)}"><span class="dashboard-event-date">${esc(date(event.startsAt))}</span><span class="dashboard-event-name">${esc(event.title)}${event.published===false?'<span class="badge gray">非公開</span>':''}</span><span class="dashboard-event-seats">予約 ${Number(event.booked)||0} / ${Number(event.capacity)||0}名 <span>残り${Math.max(0,Number(event.capacity)-Number(event.booked||0))}席</span></span><span class="dashboard-event-link">予約者を見る →</span></a>`).join('');
  return header('ダッシュボード','直近の予定と今月の動きを確認できます。')+
    `<section class="panel dashboard-events"><div class="panel-head"><h2>直近の開催予定</h2><a href="#events" class="muted">すべて見る →</a></div>${rows||'<div class="dashboard-empty">開催予定はありません。<a class="btn" href="#events">イベントを作成</a></div>'}</section>`+
    `<section class="dashboard-metrics" aria-label="今月の状況"><div class="dashboard-metric"><span class="dashboard-metric-label">今月のチケット販売</span>${dashboardTicketSales()}</div><div class="dashboard-metric"><span class="dashboard-metric-label">今月のLINE友だち追加</span><div id="dashboard-line-followers">${dashboardFollowers()}</div></div></section>`;
}
function navLink(key,label,i,active=page===key){return `<a href="#${key}" class="${active?'active':''}" ${active?'aria-current="page"':''}>${icon(i)}<span>${label}</span></a>`;}
function renderMobileNav(){
  if(!$('#mobile-nav-links')||!$('#mobile-more-toggle')||!$('#mobile-more-links'))return;
  const primary=['overview','events','reservations','customers'],secondary=['delivery','memberships','settings'],moreActive=secondary.includes(page);
  $('#mobile-nav-links').innerHTML=primary.map(key=>navLink(key,({overview:'ホーム',events:'イベント',reservations:'予約',customers:'顧客'})[key],Object.keys(pages).indexOf(key))).join('');
  const more=$('#mobile-more-toggle');more.innerHTML=`${icon(7)}<span>その他</span>`;more.classList.toggle('active',moreActive);if(moreActive)more.setAttribute('aria-current','page');else more.removeAttribute('aria-current');
  $('#mobile-more-links').innerHTML=secondary.map(key=>navLink(key,pages[key],Object.keys(pages).indexOf(key),page===key)).join('');
}
function render(){hideEventPreview();page=location.hash.slice(1).split('?')[0]||'overview';if(page==='sources'){page='settings';history.replaceState(null,'','#settings');}if(!pages[page])page='overview';$('#nav').innerHTML=Object.entries(pages).map(([key,label],i)=>navLink(key,label,i)).join('');renderMobileNav();const upcoming=data.events.filter(e=>new Date(e.startsAt)>=new Date()).sort((a,b)=>new Date(a.startsAt)-new Date(b.startsAt));let html='';
if(page==='overview')html=dashboardPage(upcoming);
if(page==='events')html=eventsManagementPage();
if(page==='reservations')html=reservationsPage();
if(page==='customers'){const selectedCustomer=new URLSearchParams(location.hash.split('?')[1]||'').get('customer');const list=filteredCustomers();const paged=pagedList(list,'customers',lastCustomerPageSize=customerPageSize(),'顧客一覧');html=header('顧客管理','プロフィール、参加履歴、顧客メモをまとめて管理します。',selectedCustomer?'<a class="btn" href="#customers">すべての顧客を見る</a>':'')+`<section class="panel" data-page-section="customers"><div class="panel-head"><h2>顧客一覧<span id="customer-count" class="count">${list.length}名</span></h2>${selectedCustomer?'':`${tagSelect('customer-tag',customerTag)}<input id="customer-search" value="${esc(query)}" placeholder="氏名・ポーカーネーム・タグで検索" aria-label="顧客検索" style="max-width:300px">`}</div><div id="customer-results">${customerTable(paged.items)}${paged.controls}</div></section>`;}
if(page==='delivery')html=deliveryPage();
if(page==='memberships')html=cardSalesPage();
if(page==='settings')html=header('設定','流入リンクと外部サービスの接続状況を確認します。')+`<section class="panel"><div class="panel-head"><h2>外部サービス</h2></div><div class="panel-body"><div class="connection"><div><h3>LINE / LIFF</h3><p class="subtitle">参加者プロフィールと予約画面</p></div><span class="badge ${data.settings.lineConfigured?'':'gray'}">${data.settings.lineConfigured?'設定済み':'未設定'}</span></div><div class="connection"><div><h3>Square</h3><p class="subtitle">決済環境：${esc(data.settings.squareEnvironment||'未設定')}</p></div><span class="badge ${data.settings.squareConfigured?'':'gray'}">${data.settings.squareConfigured?'設定済み':'未設定'}</span></div><div class="connection"><div><h3>メッセージ自動送信</h3><p class="subtitle">${data.demoMode?'ローカル配信シミュレーション・LINEには送信されません':'個別チャットはLINE Push APIで送信します'}</p></div><span class="badge gold">${data.demoMode?'デモ記録':'LINE送信'}</span></div></div></section>`+sourcesPage()+`<div class="note">${data.demoMode?'管理画面はデモ環境です。参加者画面と同じデモデータを使用しています。':'管理画面は参加者画面と運営データを共有しています。'}</div>`;
$('#main').classList.toggle('event-calendar-page',page==='events');$('#main').classList.toggle('customer-page',page==='customers');$('#main').innerHTML=html;bind();fitAdminCalendar();fitCustomerPage();fillCustomerPage();if(page==='overview')void loadDashboardFollowers();}
function openDialog(title,body,kind=''){$('#dialog').classList.toggle('customer-detail-dialog',kind==='customer');$('#dialog-content').innerHTML=`<div class="dialog-head"><h2 id="admin-dialog-title">${title}</h2><button class="btn small" data-action="close-dialog" aria-label="閉じる">閉じる</button></div><div class="dialog-body"><p id="dialog-feedback" class="error" role="alert" hidden></p>${body}</div>`;if(!$('#dialog').open)$('#dialog').showModal();bindDialog();}
function editEvent(id){const e=data.events.find(x=>x.id===id)||{},locked=Boolean(e.hasBookingHistory)||Number(e.booked)>0;const value=(key,fallback='')=>esc(e[key]??fallback);const datetime=e.startsAt?new Date(new Date(e.startsAt).getTime()-new Date(e.startsAt).getTimezoneOffset()*60000).toISOString().slice(0,16):'';openDialog(id?'イベントを編集':'イベントを作成',`${locked?'<div class="note">申込のある回は定員・公開状態のみ変更できます。</div>':''}<form id="event-form" data-id="${value('id')}"><div class="field"><label for="event-type">イベント種別</label><select id="event-type" name="eventType" ${locked?'disabled':''}>${Object.entries(types).map(([k,v])=>`<option value="${k}" ${(e.eventType||'trial')===k?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label for="event-title">イベント名</label><input id="event-title" name="title" required maxlength="120" value="${value('title')}" ${locked?'disabled':''}></div><div class="row"><div class="field"><label for="event-start">開催日時</label><input id="event-start" name="startsAt" type="datetime-local" required value="${datetime}" ${locked?'disabled':''}></div><div class="field"><label for="event-duration">所要時間（分）</label><input id="event-duration" name="durationMinutes" type="number" min="15" max="1440" required value="${value('durationMinutes',120)}" ${locked?'disabled':''}></div></div><div class="field"><label for="event-venue">会場</label><input id="event-venue" name="venue" required maxlength="200" value="${value('venue')}" ${locked?'disabled':''}></div><div class="row"><div class="field"><label for="event-capacity">定員（名）</label><input id="event-capacity" name="capacity" type="number" min="${Math.max(1,Number(e.booked)||0)}" required value="${value('capacity',10)}"></div><div class="field"><label for="event-price">参加費（円）</label><input id="event-price" name="priceYen" type="number" min="1" required value="${value('priceYen',5000)}" ${locked?'disabled':''}></div></div><div class="field"><label for="event-description">説明</label><textarea id="event-description" name="description" ${locked?'disabled':''}>${value('description')}</textarea></div><label class="check"><input type="checkbox" name="published" ${e.published!==false?'checked':''}>参加者画面に公開する</label><p id="form-error" class="error" role="alert"></p><div class="form-actions"><button type="button" class="btn" data-action="close-dialog">キャンセル</button><button class="btn primary" type="submit">${id?'変更を保存':'イベントを作成'}</button></div></form>`);$('#event-type').onchange=ev=>{if(id)return;const defaults={trial:[5000,10],tournament:[3000,null],special:[15000,15],other:[5000,10]}[ev.target.value];$('#event-price').value=defaults[0];$('#event-capacity').value=defaults[1]??'';$('#event-capacity').placeholder=defaults[1]?'':'定員を入力してください';};$('#event-form').onsubmit=async ev=>{ev.preventDefault();if(busy)return;const f=new FormData(ev.target),out={...e};for(const k of ['title','venue','description','eventType'])if(f.has(k))out[k]=f.get(k);for(const k of ['capacity','durationMinutes','priceYen'])if(f.has(k))out[k]=Number(f.get(k));if(f.has('startsAt'))out.startsAt=new Date(f.get('startsAt')).toISOString();out.published=f.has('published');const ok=await mutate('/api/admin/events',{event:out},ev.submitter);if(ok)$('#dialog').close();};}
function customerDetail(id){
  const customer=data.customers.find(c=>c.id===id);
  if(!customer)return;
  const profile=customer.profile||{};
  const history=data.bookings.filter(b=>b.customerId===id).sort((a,b)=>new Date(eventOf(b).startsAt)-new Date(eventOf(a).startsAt));
  const purchases=[...(customer.purchases||[])].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const manualTags=customer.manualTags||((customer.tags||[]).filter(tag=>!(customer.automaticTags||[]).includes(tag)));
  const experience=({none:'未経験',beginner:'初心者',experienced:'経験あり'})[profile.pokerExperience]||profile.pokerExperience||'未登録';
  const tab=(key,label,selected=false)=>`<button type="button" role="tab" id="customer-tab-${key}" aria-controls="customer-panel-${key}" aria-selected="${selected}" tabindex="${selected?0:-1}" data-customer-tab="${key}">${label}</button>`;
  openDialog('顧客詳細',`<div class="customer-detail-layout">
    <section class="customer-detail-summary" aria-label="顧客の基本情報"><div class="customer-detail-identity"><h3>${esc(name(profile))}</h3><p>${profile.pokerName?`<span>${esc(profile.pokerName)}</span>`:''}${profile.phoneNumber?`<a href="tel:${esc(profile.phoneNumber)}">${esc(profile.phoneNumber)}</a>`:''}</p></div><dl class="customer-detail-metrics"><div><dt>予約履歴</dt><dd>${history.length}<small>件</small></dd></div><div><dt>利用可能チケット</dt><dd>${(data.cards?.products||[]).map(product=>`${esc(product.name)} ${Number(customer.ticketWallet?.[product.id]?.available)||0}枚`).join(' / ')}</dd></div></dl></section>
    <div class="customer-detail-tabs" role="tablist" aria-label="顧客情報の切り替え">${tab('profile','基本情報・メモ',true)}${tab('history',`予約・受講 <span>${history.length}</span>`)}${tab('purchases',`購入履歴 <span>${purchases.length}</span>`)}</div>
    <section class="customer-detail-panel" role="tabpanel" id="customer-panel-profile" aria-labelledby="customer-tab-profile" tabindex="0">
      <div class="customer-detail-overview"><section class="customer-detail-facts"><h4>プロフィール</h4><dl><div><dt>ポーカー経験</dt><dd>${esc(experience)}</dd></div><div><dt>初回の流入元</dt><dd>${esc(customer.acquisition?.sourceName||'不明（直接アクセス等）')}</dd></div><div><dt>初回流入日時</dt><dd>${customer.acquisition?esc(date(customer.acquisition.firstSeenAt)):'—'}</dd></div><div><dt>自動タグ</dt><dd>${(customer.automaticTags||[]).map(tag=>`<span class="badge gold">${esc(tag)}</span>`).join(' ')||'未付与'}</dd></div></dl></section>
      <form id="customer-form" data-id="${esc(id)}"><div class="field"><label for="customer-tags">タグ <span class="customer-field-hint">カンマ区切り</span></label><input id="customer-tags" name="tags" value="${esc(manualTags.join(', '))}" placeholder="初心者, サブスク検討中"></div><div class="field"><label for="customer-source">流入元メモ</label><input id="customer-source" name="source" value="${esc(customer.source||'')}" placeholder="紹介元などを記入"></div><div class="field"><label for="customer-notes">顧客メモ</label><textarea id="customer-notes" name="notes" rows="3" placeholder="対応時のメモなど">${esc(customer.notes||'')}</textarea></div><div class="customer-detail-actions"><button type="button" class="btn" id="customer-open-chat">個別チャットを開く</button><button class="btn primary" type="submit">変更を保存</button></div></form></div>
    </section>
    <section class="customer-detail-panel" role="tabpanel" id="customer-panel-history" aria-labelledby="customer-tab-history" tabindex="0" hidden>
      <div class="customer-history-toolbar"><h4>予約・受講履歴</h4><select id="customer-history-type" aria-label="履歴をイベント種別で絞り込み"><option value="">すべての種類</option>${Object.entries(types).map(([key,label])=>`<option value="${key}">${esc(label)}</option>`).join('')}</select></div>
      ${history.length?`<div class="customer-record-list">${history.map(booking=>{const event=eventOf(booking);return `<article class="customer-record" data-customer-history-type="${esc(event.eventType||'other')}"><div><p class="customer-record-date">${esc(eventTimeRange(event))}</p><h4>${esc(event.title||'イベント名未登録')}</h4><p class="customer-record-meta">${esc(types[event.eventType]||types.other)} · ${esc(event.venue||'会場未設定')}</p><p class="customer-record-meta">申込 ${esc(date(booking.createdAt))}</p></div><div class="customer-record-status"><span class="badge ${confirmed(booking)?'':'gray'}">${esc(customerBookingStatus(booking))}</span>${booking.attendance==='attended'?'<span class="badge gold">参加記録あり</span>':booking.attendance==='absent'?'<span class="badge gray">欠席記録あり</span>':''}</div></article>`;}).join('')}</div><p class="customer-detail-empty" id="customer-history-empty" hidden>この種類の履歴はありません。</p>`:'<p class="customer-detail-empty">予約・受講履歴はありません。</p>'}
    </section>
    <section class="customer-detail-panel" role="tabpanel" id="customer-panel-purchases" aria-labelledby="customer-tab-purchases" tabindex="0" hidden>${purchases.length?`<div class="customer-record-list">${purchases.map(purchase=>`<article class="customer-record"><div><p class="customer-record-date">${esc(date(purchase.createdAt))}</p><h4>${esc(purchase.kind==='card'?purchase.title||cardNames[purchase.cardType]||'チケット':purchase.title||purchase.productName||'チケット')}</h4><span class="badge gray">${esc(({demo:'デモ・決済なし',sandbox:'テスト決済・実決済なし',sandbox_paid:'テスト決済・実決済なし',paid:'支払済み',cancelled:'取消済み',pending:'処理待ち'})[purchase.status]||purchase.status||'—')}</span></div><strong class="customer-purchase-amount">${purchase.amountYen==null&&purchase.priceYen==null?'—':money(purchase.amountYen??purchase.priceYen)}</strong></article>`).join('')}</div>`:'<p class="customer-detail-empty">購入履歴はありません。</p>'}</section>
  </div>`,'customer');
  bindCustomerDetailTabs();
  $('#customer-open-chat').onclick=()=>{$('#dialog').close();location.hash=`delivery?customer=${encodeURIComponent(id)}`;};
  $('#customer-history-type').addEventListener('change',event=>{
    let visible=0;
    $('#customer-panel-history').querySelectorAll('[data-customer-history-type]').forEach(row=>{row.hidden=Boolean(event.target.value&&row.dataset.customerHistoryType!==event.target.value);if(!row.hidden)visible++;});
    const empty=$('#customer-history-empty');
    if(empty)empty.hidden=visible>0;
  });
  $('#customer-form').onsubmit=async event=>{
    event.preventDefault();
    const form=new FormData(event.target);
    const ok=await mutate('/api/admin/customers',{customerId:id,tags:String(form.get('tags')).split(/[,、]/).map(tag=>tag.trim()).filter(Boolean),notes:form.get('notes'),source:form.get('source')},event.submitter);
    if(ok)$('#dialog').close();
  };
}
function customerBookingStatus(booking){
  return booking.status==='confirmed'?(booking.payment?.environment==='sandbox'?'テスト決済確認・実決済なし':'予約確定'):booking.status==='awaiting_payment_setup'?'申込受付・未決済':booking.status==='cancelled'?'キャンセル':booking.status||'—';
}
function bindCustomerDetailTabs(){
  const tabs=[...$('#dialog').querySelectorAll('[data-customer-tab]')];
  const select=tab=>{
    tabs.forEach(button=>{
      const active=button===tab;
      button.setAttribute('aria-selected',String(active));
      button.tabIndex=active?0:-1;
      $('#'+button.getAttribute('aria-controls')).hidden=!active;
    });
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next===undefined)return;
      event.preventDefault();select(tabs[next]);tabs[next].focus();
    });
  });
}

function bindDialog(){document.querySelectorAll('[data-action="close-dialog"]').forEach(b=>b.onclick=()=>$('#dialog').close());}
function bind(){document.querySelectorAll('[data-action="sample"]').forEach(b=>b.onclick=()=>mutate('/api/admin/sample',{},b));document.querySelectorAll('[data-edit-event]').forEach(b=>b.onclick=()=>editEvent(b.dataset.editEvent));document.querySelectorAll('[data-customer]').forEach(b=>b.onclick=()=>customerDetail(b.dataset.customer));$('[data-action="new-event"]')?.addEventListener('click',()=>editEvent());bindCustomerSearch();bindPagination();bindDeliveryTabs();bindDelivery();bindChat();bindEventCalendar();bindCardSales();$('#customer-tag')?.addEventListener('change',e=>{customerTag=e.target.value;listPages.customers=1;render();});$('#automation-form')?.addEventListener('submit',ev=>{ev.preventDefault();const f=new FormData(ev.target),automation={};for(const k of ['confirmation','reminder','followup'])automation[k]={enabled:true,text:f.get(k+'-text')};automation.reminder.hour=Number(f.get('reminder-hour'));automation.followup.delayHours=Number(f.get('followup-delay'));automation.followup.courseText=f.get('followup-course');automation.followup.membershipText=f.get('followup-membership');mutate('/api/admin/automation',{automation},ev.submitter);});}
function bindMobileNavigation(){
  const toggle=$('#mobile-more-toggle'),dialog=$('#mobile-more-dialog');
  if(!toggle||!dialog||!$('#mobile-more-links'))return;
  toggle.addEventListener('click',()=>{if(dialog.open)dialog.close();else dialog.showModal();toggle.setAttribute('aria-expanded',String(dialog.open));});
  dialog.addEventListener('close',()=>toggle.setAttribute('aria-expanded','false'));
  dialog.addEventListener('click',event=>{if(event.target.closest('.mobile-more-close'))dialog.close();});
  $('#mobile-more-links').addEventListener('click',event=>{if(event.target.closest('a'))dialog.close();});
}
bindMobileNavigation();
window.addEventListener('hashchange',()=>{query='';render();});load().catch(e=>{$('#main').innerHTML=`<div class="empty"><strong>管理データを読み込めません</strong>${esc(e.message)}<br><button class="btn" id="retry">再読み込み</button></div>`;$('#retry').onclick=()=>location.reload();});
function tagSelect(id,value=''){const tags=[...new Set(data.customers.flatMap(c=>c.tags||[]))].sort();return `<select id="${id}" aria-label="タグで絞り込み"><option value="">すべての顧客（${data.customers.length}名）</option>${tags.map(t=>`<option value="${esc(t)}" ${value===t?'selected':''}>${esc(t)}（${data.customers.filter(c=>(c.tags||[]).includes(t)).length}名）</option>`).join('')}</select>`;}
function deliveryPage(){
  if(new URLSearchParams(location.hash.split('?')[1]||'').has('customer'))deliverySection='chat';
  const automation=data.settings.automation||{};
  const mainTabs=data.demoMode?[['chat','個別チャット'],['manual','タグ別配信'],['automation','自動配信']]:[['chat','個別チャット']];
  const steps=[['confirmation','申込確認','予約確定時のご案内'],['reminder','前日リマインド','開催前日の指定時刻に記録'],['followup','参加後フォロー','参加記録があり、終了時刻＋待機時間を過ぎた方が対象']];
  const tab=(key,label,group,selected)=>`<button type="button" role="tab" id="delivery-tab-${key}" aria-controls="delivery-panel-${key}" aria-selected="${selected}" tabindex="${selected?0:-1}" data-delivery-${group}="${key}">${label}</button>`;
  const step=([key,title,description])=>`<section class="delivery-step" role="tabpanel" id="delivery-panel-${key}" aria-labelledby="delivery-tab-${key}" tabindex="0" ${automationSection===key?'':'hidden'}><h3>${({confirmation:'予約確定メッセージ',reminder:'前日のお知らせ',followup:'お礼と次回のご案内'})[key]}</h3><p class="subtitle delivery-description">${description}</p><div class="field"><label for="${key}-text">${key==='followup'?'お礼の文面':'メッセージ文面'}</label><textarea id="${key}-text" name="${key}-text" maxlength="2000" rows="4">${esc(automation[key]?.text||'')}</textarea></div>${key==='reminder'?`<div class="field"><label for="reminder-hour">前日の記録時刻（時）</label><input id="reminder-hour" name="reminder-hour" type="number" min="0" max="23" value="${Number(automation.reminder?.hour??18)}"></div>`:''}${key==='followup'?`<div class="field"><label for="followup-delay">終了からの待機時間（時間）</label><input id="followup-delay" name="followup-delay" type="number" min="0" max="168" required value="${Number(automation.followup?.delayHours??24)}"></div><div class="field"><label for="followup-course">次回講習の案内</label><textarea id="followup-course" name="followup-course" maxlength="2000">${esc(automation.followup?.courseText||'')}</textarea></div><div class="field"><label for="followup-membership">Membership の案内</label><textarea id="followup-membership" name="followup-membership" maxlength="2000">${esc(automation.followup?.membershipText||'')}</textarea></div><p class="subtitle">未来のイベントは参加を記録しても、終了＋待機時間を過ぎるまで対象になりません。対象は約30秒ごとに確認し、同じ予約のフォローは一度だけ記録します。</p>`:''}</section>`;
  return header('メッセージ配信','用途を選んで、対象と文面を管理します。')+
    `<div class="note">${data.demoMode?'デモ環境：個別チャットはローカルに記録され、LINEには送信されません。':'個別チャットの送信はLINE APIへ送ります。送信先と文面を確認してください。'}</div>`+
    `<div class="delivery-main-tabs delivery-tab-list" role="tablist" aria-label="配信メニュー">${mainTabs.map(([key,label])=>tab(key,label,'main',deliverySection===key)).join('')}</div>`+
    chatPanel()+`<section class="panel delivery-panel" role="tabpanel" id="delivery-panel-manual" aria-labelledby="delivery-tab-manual" tabindex="0" ${deliverySection==='manual'?'':'hidden'}><div class="panel-head"><h2>配信内容</h2></div><div class="panel-body"><p class="subtitle delivery-description">対象と文面を確認してからローカルに記録します。</p><form id="message-form"><div class="field"><label for="message-tag">配信対象</label>${tagSelect('message-tag')}</div><div class="field"><label for="message-text">文面</label><textarea id="message-text" maxlength="2000" required rows="4"></textarea></div><button class="btn" type="submit">対象・文面をプレビュー</button></form><div id="message-preview" aria-live="polite"></div></div></section>`+
    `<section class="panel delivery-panel" role="tabpanel" id="delivery-panel-automation" aria-labelledby="delivery-tab-automation" tabindex="0" ${deliverySection==='automation'?'':'hidden'}><div class="panel-head"><h2>自動記録の設定</h2></div><div class="panel-body"><p class="subtitle delivery-description">設定した条件に合う予約をローカルで確認し、記録します。</p><div class="delivery-step-tabs delivery-tab-list" role="tablist" aria-label="自動配信の種類">${steps.map(([key,title])=>tab(key,title,'step',automationSection===key)).join('')}</div><form id="automation-form">${steps.map(step).join('')}<div class="form-actions"><button class="btn primary" type="submit">自動記録の設定を保存</button></div></form></div></section>`;
}
function bindDeliveryTabs(){
  document.querySelectorAll('.delivery-tab-list').forEach(list=>{
    const tabs=[...list.querySelectorAll(':scope > [role="tab"]')];
    const select=tab=>{
      tabs.forEach(button=>{
        const active=button===tab;
        button.setAttribute('aria-selected',String(active));
        button.tabIndex=active?0:-1;
        document.getElementById(button.getAttribute('aria-controls')).hidden=!active;
      });
      if(tab.dataset.deliveryMain){deliverySection=tab.dataset.deliveryMain;if(deliverySection==='chat')refreshChat();}
      if(tab.dataset.deliveryStep)automationSection=tab.dataset.deliveryStep;
    };
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event=>{
        let next;
        if(event.key==='ArrowRight')next=(index+1)%tabs.length;
        if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
        if(event.key==='Home')next=0;
        if(event.key==='End')next=tabs.length-1;
        if(next===undefined)return;
        event.preventDefault();select(tabs[next]);tabs[next].focus();
      });
    });
  });
  $('#followup-delay')?.addEventListener('invalid',()=>{
    $('#delivery-tab-automation')?.click();
    $('#delivery-tab-followup')?.click();
  });
}
function sourcesPage(){const paged=pagedList(data.sources||[],'sources',10,'流入リンク');return `<div class="note">リンク経由の流入を計測します。直接アクセスは不明として扱います。訪問はリンクの表示回数、顧客は初回流入を記録できた人数、予約はその顧客の申込数です。</div><section class="panel" data-page-section="sources"><div class="panel-head"><h2>流入リンク</h2></div><div class="panel-body"><form id="source-form" class="toolbar"><input name="name" aria-label="流入元名" placeholder="流入元名（例：Instagram）" maxlength="80" required><button type="submit" class="btn primary">リンクを作成</button></form></div>${(data.sources||[]).length?`<div class="table-wrap"><table><thead><tr><th>流入元</th><th>専用リンク</th><th>訪問</th><th>顧客</th><th>予約</th><th>操作</th></tr></thead><tbody>${paged.items.map(s=>{const url=new URL(s.url,location.origin).href;return `<tr><td>${esc(s.name)}</td><td><div class="source-url"><input readonly aria-label="${esc(s.name)}の専用リンク" value="${esc(url)}"><button class="btn small" data-copy-source="${esc(url)}">コピー</button><a class="btn small" href="${esc(s.url)}">開く</a></div></td><td>${Number(s.visits)||0}</td><td>${Number(s.customers)||0}</td><td>${Number(s.bookings)||0}</td><td><button type="button" class="btn small" data-delete-source="${esc(s.id)}" data-source-name="${esc(s.name)}" aria-label="${esc(s.name)}の流入リンクを削除">削除</button></td></tr>`;}).join('')}</tbody></table></div>${paged.controls}`:'<p class="panel-body muted">流入リンクはありません.流入元名を入力して作成してください。</p>'}</section>`;}
function bindDelivery(){messagePreview=null;$('#source-form')?.addEventListener('submit',ev=>{ev.preventDefault();mutate('/api/admin/sources',{name:new FormData(ev.target).get('name')},ev.submitter);});document.querySelectorAll('[data-delete-source]').forEach(b=>b.onclick=()=>{if(window.confirm(`「${b.dataset.sourceName}」の流入リンクを削除しますか？\n削除後、このリンクからの流入は計測されません。記録済みの顧客の流入元は残ります。`))mutate('/api/admin/sources/delete',{id:b.dataset.deleteSource},b,'流入リンクを削除しました');});document.querySelectorAll('[data-copy-source]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copySource);toast('リンクをコピーしました');}catch{toast('コピーできませんでした。リンク欄を選択してコピーしてください。');}});const form=$('#message-form');if(!form)return;const clear=()=>{messagePreview=null;$('#message-preview').innerHTML='';};form.addEventListener('input',clear);form.addEventListener('submit',async ev=>{ev.preventDefault();const b=ev.submitter;b.disabled=true;try{const tag=$('#message-tag').value,text=$('#message-text').value;const r=await api('/api/admin/messages/preview',{tag,text});messagePreview={tag,text,requestId:crypto.randomUUID()};$('#message-preview').innerHTML=`<div class="preview-box"><h3>配信対象 ${r.count}名</h3><p class="message-cell">${esc(r.text||text)}</p><ul>${r.recipients.map(c=>`<li>${esc(name(c.profile))} <span class="muted">${esc((c.tags||[]).join(' / '))}</span></li>`).join('')}</ul><button id="record-message" class="btn primary" ${!r.count?'disabled':''}>デモ配信を記録</button></div>`;$('#record-message').onclick=async e=>{if(!messagePreview||busy)return;busy=true;e.target.disabled=true;try{const result=await api('/api/admin/messages',messagePreview);await load();toast(`${result.count}名のデモ配信を記録しました`);}catch(err){toast(err.message);e.target.disabled=false;}finally{busy=false;}};}catch(e){toast(e.message);}finally{b.disabled=false;}});}

const adminDayFormatter=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});
const adminTimeFormatter=new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hour12:false});
function adminEventTimeRange(event){
  const start=new Date(event.startsAt),end=new Date(start.getTime()+(Number(event.durationMinutes)||120)*60000);
  return `${adminTimeFormatter.format(start)}〜${adminTimeFormatter.format(end)}`;
}
function adminDay(value){return adminDayFormatter.format(new Date(value));}
function adminMonthShift(month,offset){const [year,number]=month.split('-').map(Number);return new Date(Date.UTC(year,number-1+offset,1)).toISOString().slice(0,7);}
function filteredAdminEvents(){return data.events.filter(e=>!eventCalendarState.type||e.eventType===eventCalendarState.type).sort((a,b)=>Date.parse(a.startsAt)-Date.parse(b.startsAt));}
function ensureCalendarMonth(){
  if(eventCalendarState.month)return;
  const events=filteredAdminEvents(),first=events.find(e=>Date.parse(e.startsAt)>=Date.now())||events[0];
  eventCalendarState.month=first?adminDay(first.startsAt).slice(0,7):adminDay(Date.now()).slice(0,7);
  eventCalendarState.selected=first?adminDay(first.startsAt):null;
}
function eventsManagementPage(){
  ensureCalendarMonth();
  const state=eventCalendarState,events=filteredAdminEvents();
  const filters=`<div class="event-kind-cards" role="group" aria-label="イベント種別">${[['','すべて'],...Object.entries(types)].map(([key,label])=>`<button type="button" class="event-kind-card" data-event-kind="${esc(key)}" aria-pressed="${state.type===key}">${esc(label)}</button>`).join('')}</div>`;
  return `<h1 class="sr-only">イベント管理</h1><div class="event-management-toolbar">${filters}<button class="btn primary" data-action="new-event">＋ イベントを作成</button></div>`+adminCalendar(events);
}
function adminCalendar(events){
  const state=eventCalendarState,[year,month]=state.month.split('-').map(Number),first=Date.UTC(year,month-1,1),offset=new Date(first).getUTCDay(),today=adminDay(Date.now());
  const byDay=new Map();for(const event of events){const key=adminDay(event.startsAt);if(!byDay.has(key))byDay.set(key,[]);byDay.get(key).push(event);}
  const cells=Array.from({length:Math.ceil((offset+new Date(Date.UTC(year,month,0)).getUTCDate())/7)*7},(_,index)=>{
    const value=new Date(first+(index-offset)*86400000),day=value.toISOString().slice(0,10),inMonth=day.startsWith(state.month),items=byDay.get(day)||[],selected=state.selected===day;
    if(!inMonth)return '<div class="admin-cal-outside" aria-hidden="true"></div>';
    const summary=items.slice(0,2).map(e=>{const time=adminEventTimeRange(e);return `<button type="button" class="admin-cal-event ${e.published?'':'unpublished'}" data-admin-event="${esc(e.id)}" aria-label="${esc(`${time} ${e.title}、${e.remaining===0?'満席':e.remaining===null?'定員未設定':`残り${e.remaining}席`}の詳細を表示`)}"><span class="admin-cal-time">${esc(time)}</span><span class="admin-cal-name">${esc(e.title)}</span><span class="admin-cal-seats">${e.published?'':'非公開 · '}${e.remaining===null?'定員未設定':e.remaining===0?'満席':`残${Number(e.remaining)}席`}</span></button>`;}).join('');
    const accessible=`${year}年${month}月${value.getUTCDate()}日、${items.length}件${items.length?'の開催回を表示':''}`;
    return `<div class="admin-cal-day ${day===today?'is-today':''} ${selected?'is-selected':''}" data-calendar-day="${day}"><button type="button" class="admin-cal-date-button" data-admin-date="${day}" aria-label="${esc(accessible)}" aria-pressed="${selected}"><span class="admin-cal-date">${value.getUTCDate()}</span>${items.length>2?`<span class="admin-cal-more">全${items.length}件</span>`:''}${items.length&&items.length<=2?`<span class="admin-cal-mobile-count">${items.length}件</span>`:''}</button><span class="admin-cal-events">${summary}</span></div>`;
  }).join('');
  const visible=events.filter(e=>adminDay(e.startsAt).startsWith(state.month));
  return `<section class="panel admin-calendar-panel"><div class="panel-head admin-cal-head"><h2>${year}年${month}月<span class="count">${visible.length}件</span></h2><div class="admin-cal-controls"><button type="button" class="btn" data-admin-month="-1" aria-label="前の月">←</button><button type="button" class="btn" id="admin-cal-today">今月</button><button type="button" class="btn" data-admin-month="1" aria-label="次の月">→</button></div></div><div class="admin-cal-weekdays" aria-hidden="true">${['日','月','火','水','木','金','土'].map(day=>`<span>${day}</span>`).join('')}</div><div class="admin-cal-grid" style="--calendar-rows:${Math.ceil((offset+new Date(Date.UTC(year,month,0)).getUTCDate())/7)}">${cells}</div><div class="admin-cal-help">イベントにマウスを合わせると1件の詳細を表示します。日付を選ぶと、その日の全開催回から選べます。${visible.length?'':'この月には該当するイベントがありません。'}</div></section>`;
}
function bindEventCalendar(){
  bindEventPreviews();
  document.querySelectorAll('[data-event-kind]').forEach(button=>button.onclick=()=>{eventCalendarState.type=button.dataset.eventKind;render();Array.from(document.querySelectorAll('[data-event-kind]')).find(item=>item.dataset.eventKind===eventCalendarState.type)?.focus({preventScroll:true});});
  document.querySelectorAll('[data-admin-month]').forEach(button=>button.onclick=()=>{const offset=Number(button.dataset.adminMonth);eventCalendarState.month=adminMonthShift(eventCalendarState.month,offset);eventCalendarState.selected=null;render();$(`[data-admin-month="${offset}"]`)?.focus({preventScroll:true});});
  $('#admin-cal-today')?.addEventListener('click',()=>{eventCalendarState.month=adminDay(Date.now()).slice(0,7);eventCalendarState.selected=adminDay(Date.now());render();$('#admin-cal-today')?.focus({preventScroll:true});});
  document.querySelectorAll('[data-event-reservations]').forEach(button=>button.onclick=()=>{query='';location.hash='reservations?event='+encodeURIComponent(button.dataset.eventReservations);});
}

function reservationsPage(){
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const selected=data.events.find(e=>e.id===params.get('event'));
  if(!selected){
    reservationPageEventId=null;
    const now=Date.now();
    const upcoming=data.events.filter(e=>new Date(e.startsAt).getTime()>=now).sort((a,b)=>new Date(a.startsAt)-new Date(b.startsAt));
    const past=data.events.filter(e=>new Date(e.startsAt).getTime()<now).sort((a,b)=>new Date(b.startsAt)-new Date(a.startsAt));
    const upcomingPage=pagedList(upcoming,'reservationUpcoming',9,'開催予定');
    const pastPage=pagedList(past,'reservationPast',9,'過去のイベント');
    const cards=events=>`<div class="reservation-event-grid">${events.map(e=>{
      const bookings=data.bookings.filter(b=>b.eventId===e.id&&confirmed(b));
      return `<a class="reservation-event-card" href="#reservations?event=${encodeURIComponent(e.id)}"><div class="reservation-event-card-top"><span class="badge gold">${esc(types[e.eventType]||types.trial)}</span>${e.published===false?'<span class="badge gray">非公開</span>':''}</div><div class="reservation-event-date">${esc(eventTimeRange(e))}</div><h3>${esc(e.title)}</h3><p class="reservation-event-venue">${esc(e.venue||'会場未設定')}</p><div class="reservation-event-card-bottom"><span>申込 <strong>${bookings.length}</strong><span class="muted"> / ${Number(e.capacity)||0}名</span></span><span class="reservation-event-open">予約者を見る →</span></div></a>`;
    }).join('')}</div>`;
    return header('予約・参加管理','予約を確認するイベントを選んでください。')+
      (data.events.length?`${upcoming.length?`<section class="reservation-event-section" data-page-section="reservationUpcoming" aria-labelledby="upcoming-reservations"><h2 id="upcoming-reservations">開催予定<span class="count">${upcoming.length}件</span></h2>${cards(upcomingPage.items)}${upcomingPage.controls}</section>`:''}${past.length?`<section class="reservation-event-section" data-page-section="reservationPast" aria-labelledby="past-reservations"><h2 id="past-reservations">過去のイベント<span class="count">${past.length}件</span></h2>${cards(pastPage.items)}${pastPage.controls}</section>`:''}`:'<section class="panel"><div class="empty"><strong>イベントがありません</strong>イベントを作成すると、ここから予約を確認できます。<br><a class="btn" href="#events">イベント管理へ</a></div></section>');
  }
  if(reservationPageEventId!==selected.id){listPages.reservationParticipants=1;reservationPageEventId=selected.id;}
  const list=data.bookings.filter(b=>b.eventId===selected.id);
  const participantsPage=pagedList(list,'reservationParticipants',10,'参加者一覧');
  return `<div class="page-head reservation-participants-head"><div><span class="badge gold">${esc(types[selected.eventType]||types.trial)}</span><h1>${esc(selected.title)}</h1><p class="subtitle">${esc(eventTimeRange(selected))} / ${esc(selected.venue||'会場未設定')}</p><p class="reservation-participant-summary"><span>申込 <strong>${list.filter(confirmed).length}名</strong> / 定員 ${Number(selected.capacity)||0}名</span><a class="btn reservation-back" href="#reservations">← イベントを選び直す</a></p></div></div><section class="panel" data-page-section="reservationParticipants"><div class="panel-head"><h2>参加者一覧<span class="count">${list.length}件</span></h2><a class="btn" href="/api/admin/reservations.csv?eventId=${encodeURIComponent(selected.id)}">CSV出力</a></div>${list.length?bookingTable(participantsPage.items,false)+participantsPage.controls:'<div class="empty"><strong>このイベントへの予約はまだありません</strong>申込があると、この一覧に表示されます。</div>'}</section>`;
}

let eventPreviewElement=null,eventPreviewAnchor=null,eventPreviewTimer=null;
function hideEventPreview(){
  clearTimeout(eventPreviewTimer);
  if(eventPreviewAnchor)eventPreviewAnchor.setAttribute('aria-expanded','false');
  eventPreviewElement?.remove();eventPreviewElement=null;eventPreviewAnchor=null;
}
function deferEventPreviewHide(){clearTimeout(eventPreviewTimer);eventPreviewTimer=setTimeout(hideEventPreview,180);}
function eventPreviewCard(event){
  const time=adminEventTimeRange(event);
  const remaining=event.remaining===null?'定員未設定':event.remaining===0?'満席':`${Number(event.remaining)}名`;
  return `<article class="event-hover-card"><div class="event-hover-meta"><span>${esc(types[event.eventType]||types.other)}</span><span class="badge ${event.published?'gold':'gray'}">${event.published?'公開中':'非公開'}</span></div><h3 id="event-preview-title">${esc(event.title)}</h3><p class="event-hover-date">${esc(new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(new Date(event.startsAt)))}</p><p class="event-hover-time">${esc(time)}<span>${Number(event.durationMinutes)||120}分</span></p><dl class="event-hover-details"><dt>会場</dt><dd>${esc(event.venue||'未設定')}</dd><dt>参加費</dt><dd>${event.priceYen==null?'未設定':money(event.priceYen)}</dd><dt>定員</dt><dd>${event.capacity==null?'未設定':`${Number(event.capacity)}名`}</dd><dt>予約数</dt><dd>${Number(event.booked)||0}名</dd><dt>空席</dt><dd class="event-hover-remaining">${remaining}</dd></dl><div class="event-hover-description"><h4>イベント説明</h4><p>${esc(event.description||'説明は登録されていません。')}</p></div><div class="event-hover-actions"><button type="button" class="btn" data-hover-reservations="${esc(event.id)}">予約者を見る</button><button type="button" class="btn primary" data-hover-edit="${esc(event.id)}">編集</button></div></article>`;
}
function positionEventPreview(){
  if(!eventPreviewElement||!eventPreviewAnchor)return;
  const margin=12,rect=eventPreviewAnchor.closest('.admin-cal-day').getBoundingClientRect(),width=eventPreviewElement.offsetWidth,height=eventPreviewElement.offsetHeight;
  let left=rect.right+10;
  if(left+width>window.innerWidth-margin)left=rect.left-width-10;
  if(left<margin)left=Math.min(Math.max(margin,rect.left),window.innerWidth-width-margin);
  const top=window.innerWidth<=760?Math.max(margin,(window.innerHeight-height)/2):Math.max(margin,Math.min(rect.top,window.innerHeight-height-margin));
  if(window.innerWidth<=760)left=(window.innerWidth-width)/2;
  Object.assign(eventPreviewElement.style,{left:`${left}px`,top:`${top}px`});
}
function selectEventPreview(eventId){
  const panel=eventPreviewElement;
  if(!panel)return;
  const event=filteredAdminEvents().find(item=>item.id===eventId&&adminDay(item.startsAt)===panel.dataset.day);
  if(!event)return;
  panel.dataset.selectedEvent=eventId;
  panel.querySelectorAll('[data-preview-select]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewSelect===eventId)));
  panel.querySelector('.event-preview-detail').innerHTML=eventPreviewCard(event);
  panel.querySelector('[data-hover-reservations]').onclick=()=>{hideEventPreview();query='';location.hash='reservations?event='+encodeURIComponent(event.id);};
  panel.querySelector('[data-hover-edit]').onclick=()=>{hideEventPreview();editEvent(event.id);};
  positionEventPreview();
}
function showEventPreview(anchor,eventId=null,focusControl=false){
  clearTimeout(eventPreviewTimer);
  const day=anchor.closest('.admin-cal-day').dataset.calendarDay;
  const events=filteredAdminEvents().filter(event=>adminDay(event.startsAt)===day);
  if(!events.length)return;
  if(eventPreviewElement?.dataset.day===day){
    if(eventPreviewAnchor!==anchor){eventPreviewAnchor?.setAttribute('aria-expanded','false');eventPreviewAnchor=anchor;anchor.setAttribute('aria-expanded','true');}
    selectEventPreview(eventId||eventPreviewElement.dataset.selectedEvent||events[0].id);
  }else{
    hideEventPreview();
    eventPreviewAnchor=anchor;anchor.setAttribute('aria-expanded','true');
    const panel=document.createElement('section');panel.id='admin-event-preview';panel.className=`event-hover-preview${events.length>1?' has-event-list':''}`;panel.dataset.day=day;
    panel.setAttribute('role','dialog');panel.setAttribute('aria-label',`${day}のイベント詳細`);panel.setAttribute('aria-modal','false');
    const list=events.length>1?`<nav class="event-preview-list" aria-label="同日の開催回">${events.map(event=>`<button type="button" data-preview-select="${esc(event.id)}" aria-pressed="false"><span class="event-preview-list-time">${esc(adminEventTimeRange(event))}</span><span class="event-preview-list-title">${esc(event.title)}</span><span class="event-preview-list-seats">${event.remaining===0?'満席':event.remaining===null?'定員未設定':`残${Number(event.remaining)}席`}</span></button>`).join('')}</nav>`:'';
    panel.innerHTML=`<div class="event-hover-top"><span>イベント詳細 · ${events.length}件</span><button type="button" class="event-hover-close" aria-label="イベント詳細を閉じる">×</button></div><div class="event-preview-layout">${list}<div class="event-preview-detail"></div></div>`;
    document.body.append(panel);eventPreviewElement=panel;
    panel.addEventListener('pointerenter',()=>clearTimeout(eventPreviewTimer));
    panel.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!panel.contains(document.activeElement))deferEventPreviewHide();});
    panel.addEventListener('focusin',()=>clearTimeout(eventPreviewTimer));
    panel.addEventListener('focusout',event=>{if(!panel.contains(event.relatedTarget)&&!anchor.closest('.admin-cal-day').contains(event.relatedTarget))deferEventPreviewHide();});
    panel.querySelector('.event-hover-close').onclick=()=>{const trigger=eventPreviewAnchor;hideEventPreview();trigger?.focus({preventScroll:true});};
    panel.querySelectorAll('[data-preview-select]').forEach(button=>{
      button.onclick=()=>selectEventPreview(button.dataset.previewSelect);
      button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')selectEventPreview(button.dataset.previewSelect);});
    });
    selectEventPreview(eventId||events[0].id);
  }
  if(focusControl)(eventPreviewElement.querySelector('[data-preview-select][aria-pressed="true"]')||eventPreviewElement.querySelector('.event-hover-close')).focus({preventScroll:true});
}
function bindEventPreviews(){
  document.querySelectorAll('.admin-cal-day').forEach(cell=>{
    const day=cell.dataset.calendarDay;
    const events=filteredAdminEvents().filter(event=>adminDay(event.startsAt)===day);
    const dateButton=cell.querySelector('[data-admin-date]');
    dateButton.onclick=()=>{
      eventCalendarState.selected=day;
      document.querySelectorAll('.admin-cal-day').forEach(item=>item.classList.toggle('is-selected',item===cell));
      document.querySelectorAll('[data-admin-date]').forEach(item=>item.setAttribute('aria-pressed',String(item===dateButton)));
      if(events.length)showEventPreview(dateButton,null,true);
    };
    if(!events.length)return;
    dateButton.setAttribute('aria-haspopup','dialog');dateButton.setAttribute('aria-expanded','false');
    if(events.length>2)dateButton.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')showEventPreview(dateButton);});
    cell.querySelectorAll('[data-admin-event]').forEach(button=>{
      button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');
      button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')showEventPreview(button,button.dataset.adminEvent);});
      button.onclick=()=>{
        eventCalendarState.selected=day;
        document.querySelectorAll('.admin-cal-day').forEach(item=>item.classList.toggle('is-selected',item===cell));
        document.querySelectorAll('[data-admin-date]').forEach(item=>item.setAttribute('aria-pressed',String(item===dateButton)));
        showEventPreview(button,button.dataset.adminEvent,true);
      };
    });
    cell.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!eventPreviewElement?.contains(document.activeElement))deferEventPreviewHide();});
  });
}
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&eventPreviewElement){const anchor=eventPreviewAnchor;hideEventPreview();anchor?.focus({preventScroll:true});}});
document.addEventListener('pointerdown',event=>{if(eventPreviewElement&&!eventPreviewElement.contains(event.target)&&!eventPreviewAnchor?.closest('.admin-cal-day')?.contains(event.target))hideEventPreview();});
window.addEventListener('scroll',event=>{if(eventPreviewElement&&!eventPreviewElement.contains(event.target)&&!eventPreviewElement.contains(document.activeElement))hideEventPreview();},true);
window.addEventListener('resize',positionEventPreview);

function fitAdminCalendar(){const main=$('#main');if(main?.classList.contains('event-calendar-page'))main.style.setProperty('--calendar-offset',`${main.getBoundingClientRect().top+window.scrollY}px`);}
window.addEventListener('resize',fitAdminCalendar);
function fitCustomerPage(){const main=$('#main');if(main?.classList.contains('customer-page'))main.style.setProperty('--customer-offset',`${main.getBoundingClientRect().top+window.scrollY}px`);}
window.addEventListener('resize',()=>{fitCustomerPage();if(page==='customers'){lastCustomerPageSize=customerPageSize();paintCustomerResults();fillCustomerPage();}});

function customerTable(list){return list.length?`<div class="table-wrap"><table><thead><tr><th>顧客</th><th>電話番号</th><th>申込 / 参加</th><th>タグ</th><th>利用可能チケット</th><th></th></tr></thead><tbody>${list.map(c=>`<tr><td><div class="cell-title">${esc(name(c.profile))}</div><div class="cell-sub">${esc(c.profile?.pokerName)}</div></td><td>${esc(c.profile?.phoneNumber||'—')}</td><td>${Number(c.bookings)||0} / ${Number(c.attended)||0}</td><td>${(c.tags||[]).map(t=>`<span class="badge gray">${esc(t)}</span>`).join(' ')||'—'}</td><td>${(data.cards?.products||[]).map(product=>`${esc(product.name)} ${Number(c.ticketWallet?.[product.id]?.available)||0}枚`).join('<br>')}</td><td><button class="btn small" data-customer="${esc(c.id)}">詳細</button></td></tr>`).join('')}</tbody></table></div>`:empty('顧客がありません');}

function paintCustomerResults(){
  const list=filteredCustomers();
  const paged=pagedList(list,'customers',lastCustomerPageSize||customerPageSize(),'顧客一覧');
  $('#customer-count').textContent=`${list.length}名`;
  const results=$('#customer-results');
  results.innerHTML=customerTable(paged.items)+paged.controls;
  if(listPages.customers!==1&&paged.items.length>=3&&paged.items.length===(lastCustomerPageSize||customerPageSize()))results.querySelector?.('.table-wrap')?.classList?.add('is-filled');
  results.querySelectorAll('[data-customer]').forEach(button=>button.onclick=()=>customerDetail(button.dataset.customer));
  results.querySelectorAll('[data-action="sample"]').forEach(button=>button.onclick=()=>mutate('/api/admin/sample',{},button));
  bindPagination(results);
}
function fillCustomerPage(){
  if(page!=='customers'||(Number(window.innerWidth)||1280)<=760||listPages.customers!==1)return;
  const total=filteredCustomers().length;
  for(let attempts=0;attempts<12&&lastCustomerPageSize>2;attempts++){
    const wrap=$('#customer-results .table-wrap'),table=wrap?.querySelector('table');
    if(!table||!wrap.clientHeight||table.getBoundingClientRect().height<=wrap.clientHeight+1)break;
    lastCustomerPageSize--;
    paintCustomerResults();
  }
  for(let attempts=0;attempts<12&&lastCustomerPageSize<Math.min(total,12);attempts++){
    const wrap=$('#customer-results .table-wrap');
    const table=wrap?.querySelector('table');
    if(!table||!wrap.clientHeight||table.getBoundingClientRect().height>=wrap.clientHeight-4)break;
    const previous=lastCustomerPageSize;
    lastCustomerPageSize++;
    paintCustomerResults();
    const nextWrap=$('#customer-results .table-wrap');
    const nextTable=nextWrap?.querySelector('table');
    if(!nextTable||nextTable.getBoundingClientRect().height>nextWrap.clientHeight+1){
      lastCustomerPageSize=previous;
      paintCustomerResults();
      break;
    }
  }
  const wrap=$('#customer-results .table-wrap'),table=wrap?.querySelector('table');
  if(total>=5&&table&&table.getBoundingClientRect().height>=wrap.clientHeight*.6)wrap.classList?.add('is-filled');
}
function bindCustomerSearch(){
  const input=$('#customer-search');
  if(!input)return;
  let composing=false;
  const update=()=>{query=input.value;listPages.customers=1;lastCustomerPageSize=customerPageSize();paintCustomerResults();fillCustomerPage();};
  input.addEventListener('compositionstart',()=>{composing=true;});
  input.addEventListener('compositionend',()=>{composing=false;update();});
  input.addEventListener('input',event=>{if(!composing&&!event.isComposing)update();});
}

const chatState={list:[],conversation:null,selected:'',search:'',messageSearch:'',searchOpen:false,drafts:{},requests:{},attachment:null,replyTo:null,emojiOpen:false,menuMessage:'',mobileThread:false,loading:false,refreshQueued:false,error:'',sending:false,unsending:'',changing:false,loaded:false,lastThreadId:''};
function updateEnvironmentLabels(){
  $('#environment-label').textContent=data.demoMode?'ローカルデモ環境':'LINE運用環境';
  $('#environment-footer').textContent=data.demoMode?'デモ環境の個別チャットはローカル記録のみです。LINEには送信されません。':'個別チャットはLINEへ送信されます。参加者画面と運営データを共有しています。';
}
function chatPanel(){
  const id=new URLSearchParams(location.hash.split('?')[1]||'').get('customer')||'';
  if(id){deliverySection='chat';chatState.selected=id;chatState.mobileThread=true;}
  return `<section class="panel delivery-panel chat-panel" id="delivery-panel-chat" role="tabpanel" aria-labelledby="delivery-tab-chat" ${deliverySection==='chat'?'':'hidden'}>
    <div class="chat-layout ${chatState.mobileThread?'is-thread-open':''}"><aside class="chat-sidebar"><div class="chat-search"><div class="chat-sidebar-title"><h2>トーク</h2><button type="button" class="chat-icon-button" id="chat-refresh" title="会話を更新" aria-label="会話を更新">↻</button></div><label class="sr-only" for="chat-search">顧客を検索</label><input id="chat-search" type="search" placeholder="友だちを検索" value="${esc(chatState.search)}"></div><div id="chat-list" class="chat-list" aria-label="顧客の会話"></div></aside>
    <div class="chat-thread"><div id="chat-heading" class="chat-heading"></div><div id="chat-message-search" class="chat-message-search" hidden><label class="sr-only" for="chat-find">トーク内を検索</label><input id="chat-find" type="search" placeholder="このトークを検索" value="${esc(chatState.messageSearch)}"><span id="chat-find-count"></span><button type="button" id="chat-find-close" class="chat-icon-button" aria-label="検索を閉じる">×</button></div><p id="chat-error" class="error chat-error" role="alert" hidden></p><div id="chat-messages" class="chat-messages" role="log" aria-label="メッセージ履歴" aria-live="polite"></div><button type="button" id="chat-latest" class="chat-latest" hidden>↓ 最新のメッセージ</button>
    <form id="chat-form" class="chat-compose" hidden><div id="chat-reply" class="chat-reply" hidden></div><div id="chat-attachment" class="chat-attachment" hidden></div><input id="chat-image-input" type="file" accept="image/jpeg,image/png,image/webp" hidden><div class="chat-compose-row"><button type="button" class="chat-icon-button chat-tool" id="chat-attach" aria-label="画像を添付" title="画像を添付">＋</button><button type="button" class="chat-icon-button chat-tool" id="chat-emoji" aria-label="絵文字を選ぶ" title="絵文字を選ぶ">☺</button><label class="sr-only" for="chat-text">メッセージ</label><textarea id="chat-text" rows="1" maxlength="2000" placeholder="メッセージを入力"></textarea><button type="submit" class="chat-send-button" id="chat-send" aria-label="送信" title="送信">➤</button></div><div id="chat-emoji-picker" class="chat-emoji-picker" hidden></div><div class="chat-compose-hint"><span id="chat-send-note"></span><span>Enterで送信 · Shift+Enterで改行</span></div></form></div></div><dialog id="chat-image-viewer" class="chat-image-viewer" aria-label="画像を表示"><button type="button" id="chat-viewer-close" aria-label="閉じる">×</button><img id="chat-viewer-image" alt="送信した画像"></dialog></section>`;
}
function chatClock(value){return value?new Intl.DateTimeFormat('ja-JP',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Tokyo'}).format(new Date(value)):'';}
function chatDay(value){return value?new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'long',day:'numeric',weekday:'short',timeZone:'Asia/Tokyo'}).format(new Date(value)):'';}
function chatDateKey(value){return value?new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Tokyo'}).format(new Date(value)):'';}
function chatAvatar(name){return `<span class="chat-avatar" aria-hidden="true">${esc((name||'?').trim().slice(0,1))}</span>`;}
function paintChatList(){
  const list=$('#chat-list');if(!list)return;
  const filtered=chatState.list.filter(c=>`${c.name||''} ${c.userId||''}`.toLowerCase().includes(chatState.search.toLowerCase()));
  list.innerHTML=filtered.length?filtered.map(c=>`<button type="button" class="chat-customer ${c.customerId===chatState.selected?'selected':''}" data-chat-customer="${esc(c.customerId)}" ${c.customerId===chatState.selected?'aria-current="true"':''}>${chatAvatar(c.name)}<span class="chat-customer-content"><span class="chat-customer-top"><strong>${esc(c.name||'未登録')}</strong><time>${esc(chatClock(c.lastAt))}</time></span><span class="chat-customer-bottom"><span class="chat-preview">${esc(c.preview||'メッセージはありません')}</span>${Number(c.unreadCount)>0?`<span class="chat-unread" aria-label="未読${Number(c.unreadCount)}件">${Number(c.unreadCount)}</span>`:''}</span></span></button>`).join(''):`<p class="chat-empty">${chatState.loaded?'該当する顧客の会話はありません。':'会話を読み込んでいます…'}</p>`;
  list.querySelectorAll('[data-chat-customer]').forEach(b=>b.onclick=()=>{chatState.selected=b.dataset.chatCustomer;chatState.conversation=null;chatState.messageSearch='';chatState.searchOpen=false;chatState.mobileThread=true;location.hash='delivery?customer='+encodeURIComponent(chatState.selected);paintChatList();paintChatThread();refreshChat();});
}
function paintChatThread(){
  if(!$('#chat-heading'))return;
  const c=chatState.conversation,valid=c&&c.customerId===chatState.selected;
  const log=$('#chat-messages'),nearBottom=log.scrollHeight-log.scrollTop-log.clientHeight<70,oldScroll=log.scrollTop;
  const changedThread=chatState.lastThreadId!==chatState.selected;
  chatState.lastThreadId=chatState.selected;
  $('.chat-layout')?.classList.toggle('is-thread-open',chatState.mobileThread);
  $('#chat-error').textContent=chatState.error;$('#chat-error').hidden=!chatState.error;
  $('#chat-heading').innerHTML=valid?`<button type="button" id="chat-back" class="chat-icon-button chat-back" aria-label="トーク一覧に戻る">‹</button>${chatAvatar(c.name)}<div class="chat-heading-info"><h2>${esc(c.name||'未登録')}</h2></div><button type="button" id="chat-search-toggle" class="chat-icon-button" aria-label="トーク内を検索" title="トーク内を検索">⌕</button>`:'<div class="chat-heading-info"><h2>トークを選択</h2><span>左の一覧から顧客を選んでください</span></div>';
  const searchBox=$('#chat-message-search');
  searchBox.hidden=!valid||!chatState.searchOpen;
  if(valid&&chatState.searchOpen){const input=$('#chat-find');if(document.activeElement!==input)input.value=chatState.messageSearch;}
  const all=valid?[...(c.messages||[])].sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)):[];
  const messages=chatState.messageSearch?all.filter(m=>(m.text||'').toLocaleLowerCase().includes(chatState.messageSearch.toLocaleLowerCase())):all;
  $('#chat-find-count').textContent=chatState.messageSearch?`${messages.length}件`:'';
  const byId=new Map(all.map(m=>[m.id,m]));
  let previousDay='';
  const markup=valid?(messages.length?messages.map(m=>{
    const day=chatDateKey(m.createdAt),divider=day!==previousDay?`<div class="chat-day-divider"><span>${esc(chatDay(m.createdAt))}</span></div>`:'';
    previousDay=day;
    const outbound=['outbound','outgoing','out'].includes(m.direction),ownImage=data.demoMode&&m.kind==='image'&&m.sender==='admin'&&m.imageMime;
    const imageUrl=`/api/admin/conversations/${encodeURIComponent(c.customerId)}/images/${encodeURIComponent(m.id)}`;
    const quote=byId.get(m.replyTo);
    const reply=quote?`<button type="button" class="chat-quoted" data-jump="${esc(quote.id)}"><strong>${quote.direction==='in'?'顧客':'運営'}</strong><span>${esc(quote.status==='unsent'?'送信を取り消しました':quote.text||'画像')}</span></button>`:'';
    const body=m.status==='unsent'?'<span class="chat-unsent-text">送信を取り消しました</span>':ownImage?`<button type="button" class="chat-image-open" data-view-image="${imageUrl}" aria-label="画像を拡大"><img class="chat-message-image" src="${imageUrl}" alt="送信した画像" loading="lazy"></button>`:esc(m.text||({image:'画像',sticker:'スタンプ',video:'動画',audio:'音声',location:'位置情報'}[m.kind]||'メッセージ'));
    const canCopy=m.kind==='text'&&m.status!=='unsent';
    const canReply=data.demoMode&&m.status!=='unsent';
    const canUnsend=data.demoMode&&outbound&&m.sender==='admin'&&m.status==='demo';
    const actions=canCopy||canReply||canUnsend;
    const menu=chatState.menuMessage===m.id?`<div class="chat-message-menu" role="menu">${canCopy?`<button type="button" role="menuitem" data-copy="${esc(m.id)}">コピー</button>`:''}${canReply?`<button type="button" role="menuitem" data-reply="${esc(m.id)}">返信</button>`:''}${canUnsend?`<button type="button" role="menuitem" data-unsend="${esc(m.id)}">送信取消</button>`:''}</div>`:'';
    const status=({accepted:'LINE受付済み',demo:'デモ記録',unsent:'取消済み',failed:'送信失敗',unknown:'結果不明',pending:'送信中'})[m.status]||'';
    return `${divider}<article id="chat-msg-${esc(m.id)}" class="chat-message ${outbound?'outbound':'inbound'}">${outbound?'':chatAvatar(c.name)}<div class="chat-message-main">${m.sender==='bot'?`<span class="chat-sender">自動応答</span>`:''}<div class="chat-message-line">${outbound?`<span class="chat-message-meta">${esc(chatClock(m.createdAt))}${status?`<small>${esc(status)}</small>`:''}</span>`:''}<div class="chat-bubble">${reply}${body}</div>${outbound?'':`<span class="chat-message-meta">${esc(chatClock(m.createdAt))}</span>`}${actions?`<div class="chat-message-options"><button type="button" class="chat-menu-trigger" data-menu="${esc(m.id)}" aria-label="メッセージの操作" aria-expanded="${chatState.menuMessage===m.id}">⋯</button>${menu}</div>`:''}</div></div></article>`;
  }).join(''):`<p class="chat-empty">${chatState.messageSearch?'一致するメッセージはありません。':'まだメッセージがありません。'}</p>`):'<div class="chat-welcome"><span aria-hidden="true">☏</span><p>トークを選択してください</p></div>';
  if(log.innerHTML!==markup){log.innerHTML=markup;log.scrollTop=changedThread||nearBottom?log.scrollHeight:oldScroll;}
  $('#chat-form').hidden=!valid;
  if(valid){
    const text=$('#chat-text'),attachment=chatState.attachment?.customerId===c.customerId?chatState.attachment:null;
    if(document.activeElement!==text)text.value=chatState.drafts[c.customerId]||'';
    text.disabled=chatState.sending||c.blocked;
    $('#chat-attach').disabled=chatState.sending||c.blocked||!data.demoMode;
    $('#chat-attach').title=data.demoMode?'JPEG・PNG・WebP、5MBまで':'本番LINEへの画像送信には公開HTTPS画像サーバーが必要です。';
    $('#chat-emoji').disabled=chatState.sending||c.blocked;
    $('#chat-send').disabled=chatState.sending||c.blocked||(!attachment&&!text.value.trim());
    $('#chat-send').title=attachment?'画像を記録':data.demoMode?'デモ記録':'LINEへ送信';
    $('#chat-send-note').textContent=c.blocked?'ブロック中のため送信できません。':attachment?'画像を単独で記録します。文面は残ります。':data.demoMode?'ローカルデモ · LINEには送信されません':'送信すると顧客のLINEに届きます';
    const preview=$('#chat-attachment');preview.hidden=!attachment;
    preview.innerHTML=attachment?`<img src="${attachment.url}" alt="添付画像のプレビュー"><span>${esc(attachment.file.name)}</span><button type="button" class="btn small" id="chat-remove-image">削除</button>`:'';
    $('#chat-remove-image')?.addEventListener('click',clearChatAttachment);
    const replyMessage=chatState.replyTo?.customerId===c.customerId?byId.get(chatState.replyTo.messageId):null;
    const replyBox=$('#chat-reply');replyBox.hidden=!replyMessage;
    replyBox.innerHTML=replyMessage?`<div><strong>返信先</strong><span>${esc(replyMessage.status==='unsent'?'送信を取り消しました':replyMessage.text||'画像')}</span></div><button type="button" id="chat-reply-close" aria-label="返信をやめる">×</button>`:'';
    $('#chat-reply-close')?.addEventListener('click',()=>{chatState.replyTo=null;delete chatState.requests[c.customerId];paintChatThread();});
    const picker=$('#chat-emoji-picker');picker.hidden=!chatState.emojiOpen;
    picker.innerHTML=chatState.emojiOpen?['😀','😊','😂','😍','👍','🙏','🎉','❤️','♠️','🃏','🔥','🙇'].map(emoji=>`<button type="button" data-emoji="${emoji}" aria-label="${emoji}を入力">${emoji}</button>`).join(''):'';
    picker.querySelectorAll('[data-emoji]').forEach(button=>button.onclick=()=>{const area=$('#chat-text');area.value+=button.dataset.emoji;area.dispatchEvent(new Event('input',{bubbles:true}));area.focus();chatState.emojiOpen=false;picker.hidden=true;});
  }
  $('#chat-back')?.addEventListener('click',()=>{chatState.mobileThread=false;paintChatThread();});
  $('#chat-search-toggle')?.addEventListener('click',()=>{chatState.searchOpen=!chatState.searchOpen;searchBox.hidden=!chatState.searchOpen;if(chatState.searchOpen)$('#chat-find').focus();else{chatState.messageSearch='';paintChatThread();}});
  log.querySelectorAll('[data-menu]').forEach(button=>button.onclick=()=>{chatState.menuMessage=chatState.menuMessage===button.dataset.menu?'':button.dataset.menu;paintChatThread();});
  log.querySelectorAll('[data-copy]').forEach(button=>button.onclick=async()=>{const message=byId.get(button.dataset.copy);try{if(message){await navigator.clipboard.writeText(message.text);toast('メッセージをコピーしました');}}catch{toast('コピーできませんでした。ブラウザの権限を確認してください。');}chatState.menuMessage='';paintChatThread();});
  log.querySelectorAll('[data-reply]').forEach(button=>button.onclick=()=>{chatState.replyTo={customerId:chatState.selected,messageId:button.dataset.reply};delete chatState.requests[chatState.selected];chatState.menuMessage='';paintChatThread();$('#chat-text')?.focus();});
  log.querySelectorAll('[data-unsend]').forEach(button=>button.onclick=async()=>{const id=chatState.selected,messageId=button.dataset.unsend;if(!confirm('このデモメッセージの送信を取り消しますか？'))return;chatState.menuMessage='';chatState.unsending=messageId;paintChatThread();try{await api(`/api/admin/conversations/${encodeURIComponent(id)}/unsend/${encodeURIComponent(messageId)}`,{});await refreshChat(true);}catch(err){chatState.error=err.message;}finally{chatState.unsending='';paintChatThread();}});
  log.querySelectorAll('[data-view-image]').forEach(button=>button.onclick=()=>{const viewer=$('#chat-image-viewer');$('#chat-viewer-image').src=button.dataset.viewImage;viewer.showModal();});
  log.querySelectorAll('[data-jump]').forEach(button=>button.onclick=()=>{const target=document.getElementById('chat-msg-'+button.dataset.jump);if(target)target.scrollIntoView({block:'center',behavior:'smooth'});});
}
async function refreshChat(force=false){
  if(page!=='delivery'||deliverySection!=='chat')return;
  if(chatState.loading){if(force)chatState.refreshQueued=true;return;}
  chatState.loading=true;const id=chatState.selected;
  try{const [list,detail]=await Promise.all([api('/api/admin/conversations'),id?api(`/api/admin/conversations/${encodeURIComponent(id)}`):Promise.resolve(null)]);chatState.list=list.conversations||[];chatState.loaded=true;if(id===chatState.selected&&detail){chatState.conversation=detail.conversation;if(!document.hidden&&(detail.conversation.messages||[]).length){await api(`/api/admin/conversations/${encodeURIComponent(id)}/read`,{});const row=chatState.list.find(c=>c.customerId===id);if(row)row.unreadCount=0;}}chatState.error='';}catch(err){chatState.error=err.message;chatState.loaded=true;}finally{chatState.loading=false;paintChatList();paintChatThread();if(chatState.refreshQueued||id!==chatState.selected){chatState.refreshQueued=false;refreshChat();}}
}
function clearChatAttachment(){
  if(chatState.attachment)URL.revokeObjectURL(chatState.attachment.url);
  chatState.attachment=null;
  if($('#chat-image-input'))$('#chat-image-input').value='';
  paintChatThread();
}
function setChatAttachment(file){
  if(!data.demoMode||!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5_000_000||!file.size){if($('#chat-image-input'))$('#chat-image-input').value='';chatState.error='5MB以下のJPEG・PNG・WebP画像を選んでください。';paintChatThread();return;}
  if(chatState.attachment)URL.revokeObjectURL(chatState.attachment.url);
  chatState.attachment={customerId:chatState.selected,file,url:URL.createObjectURL(file),requestId:crypto.randomUUID()};
  chatState.error='';paintChatThread();
}
function bindChat(){
  if(!$('#chat-list'))return;paintChatList();paintChatThread();refreshChat();
  $('#chat-search').oninput=e=>{chatState.search=e.target.value;paintChatList();};
  $('#chat-refresh').onclick=()=>refreshChat(true);
  $('#chat-find').oninput=e=>{chatState.messageSearch=e.target.value;paintChatThread();};
  $('#chat-find-close').onclick=()=>{chatState.searchOpen=false;chatState.messageSearch='';paintChatThread();};
  $('#chat-viewer-close').onclick=()=>$('#chat-image-viewer').close();
  $('#chat-image-viewer').onclick=e=>{if(e.target.id==='chat-image-viewer')e.target.close();};
  $('#chat-latest').onclick=()=>{$('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;$('#chat-latest').hidden=true;};
  $('#chat-messages').onscroll=()=>{const log=$('#chat-messages');$('#chat-latest').hidden=log.scrollHeight-log.scrollTop-log.clientHeight<120;};
  $('#chat-text').oninput=e=>{chatState.drafts[chatState.selected]=e.target.value;delete chatState.requests[chatState.selected];$('#chat-send').disabled=!e.target.value.trim()&&chatState.attachment?.customerId!==chatState.selected;e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,150)+'px';};
  $('#chat-attach').onclick=()=>$('#chat-image-input').click();
  $('#chat-emoji').onclick=()=>{chatState.emojiOpen=!chatState.emojiOpen;paintChatThread();};
  $('#chat-image-input').onchange=e=>setChatAttachment(e.target.files?.[0]);
  $('#chat-text').onpaste=e=>{const file=[...(e.clipboardData?.files||[])].find(item=>item.type.startsWith('image/'));if(file&&data.demoMode){e.preventDefault();setChatAttachment(file);}};
  $('#chat-form').ondragover=e=>{if(data.demoMode&&[...(e.dataTransfer?.items||[])].some(item=>item.kind==='file'))e.preventDefault();};
  $('#chat-form').ondrop=e=>{if(!data.demoMode)return;const file=[...(e.dataTransfer?.files||[])].find(item=>item.type.startsWith('image/'));if(file){e.preventDefault();setChatAttachment(file);}};
  $('#chat-text').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#chat-form').requestSubmit();}if(e.key==='Escape'){e.preventDefault();chatState.emojiOpen=false;chatState.replyTo=null;paintChatThread();}};
  $('#chat-form').onsubmit=async e=>{e.preventDefault();const id=chatState.selected,text=(chatState.drafts[id]||'').trim(),attachment=chatState.attachment?.customerId===id?chatState.attachment:null;if((!text&&!attachment)||chatState.sending||chatState.conversation?.blocked)return;chatState.sending=true;chatState.error='';if(!attachment)chatState.requests[id] ||= crypto.randomUUID();paintChatThread();try{if(attachment){const response=await fetch(`/api/admin/conversations/${encodeURIComponent(id)}/image`,{method:'POST',headers:{'Content-Type':attachment.file.type,'X-Chat-Request-Id':attachment.requestId},body:attachment.file});let result;try{result=await response.json();}catch{throw new Error('画像の応答を読み込めませんでした。');}if(!response.ok)throw new Error(result.error||'画像を記録できませんでした。');clearChatAttachment();}else{const replyTo=chatState.replyTo?.customerId===id?chatState.replyTo.messageId:undefined;await api(`/api/admin/conversations/${encodeURIComponent(id)}/send`,{text,requestId:chatState.requests[id],...(replyTo?{replyTo}:{})});chatState.drafts[id]='';chatState.replyTo=null;delete chatState.requests[id];if(chatState.selected===id)$('#chat-text').value='';}chatState.emojiOpen=false;await refreshChat(true);}catch(err){chatState.error=err.message;}finally{chatState.sending=false;paintChatThread();$('#chat-text')?.focus();}};
}
setInterval(()=>{if(!document.hidden)refreshChat();},8000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshChat();});

function cardSalesPage(){
  const products=data.cards?.products||[];
  const records=data.cards?.records||[];
  const recordsPage=pagedList(records,'cardRecords',10,'チケットの履歴');
  const customerOptions=data.customers.map(c=>`<option value="${esc(c.id)}">${esc(name(c.profile))} · ${esc(c.profile?.phoneNumber||c.id.slice(0,8))}</option>`).join('');
  const labels={product_created:'チケット作成',product_updated:'設定を変更',demo_purchase:'デモ購入',direct_grant:'直接付与',held:'予約でキープ',released:'キャンセルで解放',used:'使用確定',expired:'期限切れ'};
  return header('チケット','チケットの作成、付与、利用履歴を確認します。')+
    `<div class="note">現在はローカルデモです。設定した価格で実際の決済は行いません。チケットを使えるイベントの規則は未設定です。</div>
    <div class="ticket-workspace"><div class="ticket-workspace-left"><section class="panel ticket-catalog"><div class="panel-head"><div><h2>販売するチケット</h2><p class="subtitle">商品ごとに価格・有効期限・販売枚数を管理します。</p></div><button class="btn primary" id="ticket-create" type="button" ${data.demoMode?'':'disabled'}>チケットを作成</button></div><div class="ticket-product-list">${products.map(product=>`<div class="ticket-product-row"><div class="ticket-product-name"><strong>${esc(product.name)}</strong><span class="badge ${product.expired?'gray':product.configured?'gold':'gray'}">${product.expired?'期限切れ':product.configured?'設定済み':'未設定'}</span></div><dl><div><dt>価格</dt><dd>${product.priceYen==null?'未設定':money(product.priceYen)}</dd></div><div><dt>有効期限</dt><dd>${esc(product.expiresOn||'未設定')}</dd></div><div><dt>販売枚数</dt><dd>${product.salesLimit==null?'未設定':`${Number(product.sold)||0} / ${Number(product.salesLimit)}枚`}</dd></div></dl>${product.configured?`<button class="btn small ticket-product-edit" type="button" data-ticket-edit="${esc(product.id)}" ${product.editable?'':'disabled title="購入・付与後は編集できません"'}>編集</button>`:''}</div>`).join('')}</div></section>
    <section class="panel card-grant-panel"><div class="panel-head"><h2>チケットを直接付与</h2></div><form id="card-grant-form" class="panel-body"><div class="field"><label for="grant-customer">顧客</label><select id="grant-customer" name="customerId" required>${customerOptions}</select></div><div class="row"><div class="field"><label for="grant-product">チケット</label><select id="grant-product" name="productId">${products.filter(product=>!product.expired).map(product=>`<option value="${esc(product.id)}">${esc(product.name)}</option>`).join('')}</select></div><div class="field"><label for="grant-quantity">枚数</label><input id="grant-quantity" name="quantity" type="number" min="1" max="100" value="1" required></div></div><div class="field"><label for="grant-reason">付与理由</label><input id="grant-reason" name="reason" maxlength="200" placeholder="例：店舗キャンペーン" required></div><button class="btn primary" type="submit" ${data.demoMode&&data.customers.length?'':'disabled'}>付与する</button><p class="subtitle">直接付与は販売枚数の上限に含まれません。</p></form></section>
    </div><section class="panel ticket-history" data-page-section="cardRecords"><div class="panel-head"><div><h2>チケットの履歴</h2><p class="subtitle">購入・付与・予約・使用の記録を新しい順に表示します。</p></div><span class="count">全${records.length}件</span></div>${records.length?`<ol class="ticket-log-list">${recordsPage.items.map(item=>`<li class="ticket-log-item"><div class="ticket-log-date">${esc(date(item.createdAt))}</div><div class="ticket-log-content"><span class="ticket-log-action">${esc(labels[item.reason]||item.reason)}</span><strong>${esc(item.productName||cardNames[item.cardType]||'チケット')}${item.quantity?` <span>${Number(item.quantity)}枚</span>`:''}</strong><p>${item.customerName?`${esc(item.customerName)}さん`:''}${item.eventTitle?` · ${esc(item.eventTitle)}`:''}${item.note?` · ${esc(item.note)}`:''}</p>${item.customerId?`<a href="#customers?customer=${encodeURIComponent(item.customerId)}">顧客を見る →</a>`:''}</div></li>`).join('')}</ol>${recordsPage.controls}`:'<div class="empty"><strong>まだ記録はありません</strong>チケットを作成、購入、付与するとここに表示されます。</div>'}</section></div>`;
}

function bindCardSales(){
  const grant=$('#card-grant-form');
  if(!grant)return;
  let grantRequestId=crypto.randomUUID();
  grant.oninput=()=>{grantRequestId=crypto.randomUUID();};
  grant.onsubmit=async event=>{event.preventDefault();const f=new FormData(grant);const ok=await mutate('/api/admin/cards/grant',{customerId:f.get('customerId'),productId:f.get('productId'),quantity:Number(f.get('quantity')),reason:f.get('reason'),requestId:grantRequestId},event.submitter,'チケットを付与しました');if(ok)grantRequestId=crypto.randomUUID();};
  $('#ticket-create')?.addEventListener('click',()=>showTicketForm());
  document.querySelectorAll('[data-ticket-edit]').forEach(button=>button.onclick=()=>showTicketForm((data.cards?.products||[]).find(product=>product.id===button.dataset.ticketEdit)));

}

function showTicketForm(product=null){
  const products=data.cards?.products||[];
  const available=['tournament','reward'].filter(id=>!products.find(item=>item.id===id)?.configured);
  let requestId=crypto.randomUUID();
  const kindField=product?`<div class="field"><label>種類</label><p class="subtitle">${esc(cardNames[product.cardType]||'新しい種類のチケット')}</p></div>`:`<div class="field"><label for="ticket-kind">種類</label><select id="ticket-kind" name="kind">${available.map(id=>`<option value="${id}">${esc(cardNames[id])}</option>`).join('')}<option value="custom">新しい種類のチケット</option></select></div>`;
  openDialog(product?'チケットを編集':'チケットを作成',`<form id="ticket-create-form">${kindField}<div class="field"><label for="ticket-name">名前</label><input id="ticket-name" name="name" maxlength="80" value="${esc(product?.name||'')}" required></div><div class="row"><div class="field"><label for="ticket-price">価格（税込・円）</label><input id="ticket-price" name="priceYen" type="number" min="0" max="10000000" step="1" value="${product?.priceYen??''}" required></div><div class="field"><label for="ticket-limit">販売枚数の上限</label><input id="ticket-limit" name="salesLimit" type="number" min="1" max="100000" step="1" value="${product?.salesLimit??''}" required></div></div><div class="field"><label for="ticket-expiry">有効期限</label><input id="ticket-expiry" name="expiresOn" type="date" value="${esc(product?.expiresOn||'')}" required><p class="subtitle">この日まで使用できます。期限切れのチケットは予約に利用できません。</p></div><p class="subtitle">販売枚数は購入の上限です。直接付与は含みません。購入・付与後は設定を変更できません。</p><div class="form-actions"><button class="btn" type="button" data-action="close-dialog">キャンセル</button><button class="btn primary" type="submit">${product?'保存する':'作成する'}</button></div></form>`);
  const form=$('#ticket-create-form'),kind=$('#ticket-kind'),name=$('#ticket-name'),expiry=$('#ticket-expiry');
  expiry.min=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(kind){const suggest=()=>{if(kind.value!=='custom')name.value=cardNames[kind.value];else if(Object.values(cardNames).includes(name.value))name.value='';};suggest();kind.onchange=suggest;}
  form.oninput=()=>{requestId=crypto.randomUUID();};
  form.onsubmit=async event=>{event.preventDefault();const values=new FormData(form);const payload={name:values.get('name'),priceYen:Number(values.get('priceYen')),expiresOn:values.get('expiresOn'),salesLimit:Number(values.get('salesLimit')),requestId,...(product?{productId:product.id}:{kind:values.get('kind')})};const ok=await mutate(product?'/api/admin/ticket-products/update':'/api/admin/ticket-products',payload,event.submitter,product?'チケットを更新しました':'チケットを作成しました');if(ok)$('#dialog').close();};
}
