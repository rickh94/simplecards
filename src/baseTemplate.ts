import Handlebars from "handlebars";

export type Card = {
  title: string;
  corner: string;
  front: string;
  back: string;
  index: string;
  big: boolean;
  qrcode: string | undefined;
};

export function blankCard() {
  return {
    title: "",
    corner: "",
    front: "",
    back: "",
    index: "",
    big: false,
    qrcode: undefined,
  };
}
// TODO: manually add pages

export function defaultCardList() {
  const cards = [];
  for (let i = 0; i < 10; i++) {
    cards.push(blankCard());
  }
  return cards;
}

Handlebars.registerHelper("date", (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
});

Handlebars.registerHelper("plusOne", (n: number) => {
  return n + 1;
});

Handlebars.registerPartial(
  "cardFront",
  `
<div class="card">
  <div class="card-buttons">
    <button class="edit-card-button noprint" data-card-idx="{{ cidx }}" data-page-number="{{ pidx }}">edit</button>
    <button class="dup-card-button noprint" data-card-text="{{ front }}" data-card-idx="{{ cidx }}" data-page-number="{{ pidx }}">clone</button>
    <button class="del-card-button noprint" data-card-text="{{ front }}" data-card-idx="{{ cidx }}" data-page-number="{{ pidx }}">erase</button>
  </div>
  <p class="main">{{ front }}</p>
  <h2 class="title">{{ title }}</h2>
  <div class="corner">{{ corner }}</div>
</div>
`,
);

Handlebars.registerPartial(
  "cardBack",
  `
<div class="card">
  <div class="card-buttons">
    <button class="edit-card-button noprint" data-card-idx="{{ cidx }}" data-page-number="{{ pidx }}">edit</button>
    <button class="dup-card-button noprint" data-card-idx="{{ cidx }}" data-page-number="{{ pidx }}">clone</button>
    <button class="del-card-button noprint" data-card-idx="{{ cidx }}" data-page-number="{{ pidx }}">delete</button>
  </div>

{{#if qrcode}}
<img src="{{ qrcode }}" class="qrcode"></img>
{{else}}
  {{#if big}}
    <p class="big main">{{ back }}</p>
  {{else}}
    <p class="main">{{ back }}</p>
  {{/if}}
{{/if}}
  <div class="corner">{{ index }}</div>
</div>
`,
);

export default Handlebars.compile(`
{{#each pages}}
  <div class="around">
    <div class="noprint page-marker">
      <div class="page-number">Page {{plusOne @index }} Front</div>
      <button class="removepage noprint" data-page-number="{{@index}}">Delete Page</button>
    </div>
    <div class="cards front">
      <!-- margin -->
      <div class="left-marks"></div>
      <div class="vert-marks"></div>
      <div></div>
      <div class="right-marks"></div>

      <!-- row 1 -->
      <div class="left-marks"></div>
      {{> cardFront cidx=0 pidx=@index front=this.0.front title=this.0.title corner=this.0.corner}}
      {{> cardFront cidx=1 pidx=@index front=this.1.front title=this.1.title corner=this.1.corner}}
      <div class="right-marks"></div>

      <!-- row 2 -->
      <div class="left-marks"></div>
      {{> cardFront cidx=2 pidx=@index front=this.2.front title=this.2.title corner=this.2.corner}}
      {{> cardFront cidx=3 pidx=@index front=this.3.front title=this.3.title corner=this.3.corner}}
      <div class="right-marks"></div>

      <!-- row 3 -->
      <div class="left-marks"></div>
      {{> cardFront cidx=4 pidx=@index front=this.4.front title=this.4.title corner=this.4.corner}}
      {{> cardFront cidx=5 pidx=@index front=this.5.front title=this.5.title corner=this.5.corner}}
      <div class="right-marks"></div>

      <!-- row 4 -->
      <div class="left-marks"></div>
      {{> cardFront cidx=6 pidx=@index front=this.6.front title=this.6.title corner=this.6.corner}}
      {{> cardFront cidx=7 pidx=@index front=this.7.front title=this.7.title corner=this.7.corner}}
      <div class="right-marks"></div>

      <!-- row -->
      <div class="left-marks"></div>
      {{> cardFront cidx=8 pidx=@index front=this.8.front title=this.8.title corner=this.8.corner}}
      {{> cardFront cidx=9 pidx=@index front=this.9.front title=this.9.title corner=this.9.corner}}
      <div class="right-marks"></div>

      <!-- margin -->
      <div></div>
      <div class="vert-marks"></div>
      <div class=""></div>
      <div></div>
    </div>
  </div>

  <div class="around back">
    <div class="noprint page-marker">
      <div class="page-number">Page {{plusOne @index }} Back</div>
      <button class="removepage noprint" data-page-number="{{@index}}">Delete Page</button>
    </div>
    <div class="cards">
      <!-- margin -->
      <div></div>
      <div></div>
      <div></div>
      <div></div>

      <!-- row 1 -->
      <div></div>
      {{> cardBack cidx=0 pidx=@index back=this.0.back index=this.0.index big=this.0.big qrcode=this.0.qrcode }}
      {{> cardBack cidx=1 pidx=@index back=this.1.back index=this.1.index big=this.1.big qrcode=this.1.qrcode }}
      <div></div>

      <!-- row 2 -->
      <div></div>
      {{> cardBack cidx=2 pidx=@index back=this.2.back index=this.2.index big=this.2.big qrcode=this.2.qrcode }}
      {{> cardBack cidx=3 pidx=@index back=this.3.back index=this.3.index big=this.3.big qrcode=this.3.qrcode }}
      <div></div>

      <!-- row 3 -->
      <div></div>
      {{> cardBack cidx=4 pidx=@index back=this.4.back index=this.4.index big=this.4.big qrcode=this.4.qrcode }}
      {{> cardBack cidx=5 pidx=@index back=this.5.back index=this.5.index big=this.5.big qrcode=this.5.qrcode }}
      <div></div>

      <!-- row 4 -->
      <div></div>
      {{> cardBack cidx=6 pidx=@index back=this.6.back index=this.6.index big=this.6.big qrcode=this.6.qrcode }}
      {{> cardBack cidx=7 pidx=@index back=this.7.back index=this.7.index big=this.7.big qrcode=this.7.qrcode }}
      <div></div>

      <!-- row 5 -->
      <div></div>
      {{> cardBack cidx=8 pidx=@index back=this.8.back index=this.8.index big=this.8.big qrcode=this.8.qrcode }}
      {{> cardBack cidx=9 pidx=@index back=this.9.back index=this.9.index big=this.9.big qrcode=this.9.qrcode }}
      <div></div>
    </div>
  </div>
{{/each}}
`);

export const loadTableTemplate = Handlebars.compile(`
{{#each index}}
<tr>
  <td>{{this.name}}</td>
  <td>{{ date this.date }}</td>
  <td><button class="load-item-button" data-uniqueid="{{ this.uniqueid }}">load</button></td>
  <td><button class="delete-item-button" data-uniqueid="{{ this.uniqueid }}">delete</button></td>
</tr>
{{/each}}

`);
