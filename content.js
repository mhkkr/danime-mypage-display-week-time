const generateAnimes = async () => {
  const animes = [];

  const date = new Date();
  const cours = [1, 4, 7, 10];
  const courIndex = cours.findIndex(cour => cour > date.getMonth() + 1) - 1;
  const cour = String(date.getFullYear()) + ('00' + cours[courIndex]).slice(-2);

  const response = await fetch(`https://anime.dmkt-sp.jp/animestore/rest/WS000118?cours=${cour}&includeOthersFlag=1`);
  const json = await response.json()

  json.data.workList.map(work => animes.push({
    title: work.workInfo.workTitle,
    time: work.workInfo.workTime,
    week: work.workInfo.workWeek,
  }));

  return animes;
};

const displayWeekTime = async () => {
  const animes = await generateAnimes();
  const weekList = { mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日' };
  const $itemModules = document.querySelectorAll('.itemModule');
  Array.from($itemModules).map($itemModule => {
    const $title = $itemModule.querySelector('.line1');
    const $iconContainer = $itemModule.querySelector('.iconContainer');
    if ($title && $iconContainer) {
      const anime = animes.find(anime => anime.title === $title.textContent.trim());
      if (anime) $iconContainer.insertAdjacentHTML('beforeend', `<li><span style="margin-left: .25em; vertical-align: bottom; font-weight: bold;">${weekList[anime.week]} ${anime.time}</span></li>`);
    }
  });
};
const displayCurrentTime = () => {
  const date = new Date();
  const $itemWrapper = document.querySelector('.itemWrapper');
  if ($itemWrapper) {
    $itemWrapper.style.position = 'relative';
    $itemWrapper.insertAdjacentHTML('afterbegin', `<div style="
      position: sticky;
      top: 0;
      display: table;
      margin: 0 auto 20px;
      background-color: #fff;
      font-size: 16px;
      font-weight: bold;
      padding: 0.25em 0.5em;
      border-radius: 4px;
      box-shadow: 0 0 5px black;
      z-index: 9999;
    ">${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}(${["月","火","水","木","金","土","日"][date.getDay()]})</div>`);
  }
};

window.addEventListener('load', displayWeekTime);
window.addEventListener('load', displayCurrentTime);