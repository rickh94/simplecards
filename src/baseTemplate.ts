import Handlebars from "handlebars";

export type Card = {
  title: string;
  corner: string;
  front: string;
  back: string;
  index: string;
};

export function defaultCard() {
  return {
    title: "",
    corner: "",
    front: "",
    back: "",
    index: "",
  };
}

export function defaultCardList() {
  const cards = [];
  for (let i = 0; i < 10; i++) {
    cards.push(defaultCard());
  }
  return cards;
}
// TODO: card buttons div + class, add duplicate and delete buttons

export default Handlebars.compile(`
{{#each pages}}
      <div class="around">
        <button class="removepage noprint" data-page-number="{{@index}}">Delete Page</button>
        <div class="cards front">
          <!-- margin -->
          <div class="left-marks"></div>
          <div class="vert-marks"></div>
          <div></div>
          <div class="right-marks"></div>

          <!-- row 1 -->
          <div class="left-marks"></div>
          <div class="card">
            <button class="edit-card-button noprint" data-card-idx="0" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.0.front }}</p>
            <h2 class="title">{{ this.0.title }}</h2>
            <div class="corner">{{ this.0.corner }}</div>
          </div>
          <div class="card">

<button class="edit-card-button noprint" data-card-idx="1" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.1.front }}</p>
            <h2 class="title">{{ this.1.title }}</h2>
            <div class="corner">{{ this.1.corner }}</div>
          </div>
          <div class="right-marks"></div>

          <!-- row 2 -->
          <div class="left-marks"></div>
          <div class="card">
<button class="edit-card-button noprint" data-card-idx="2" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.2.front }}</p>
            <h2 class="title">{{ this.2.title }}</h2>
            <div class="corner">{{ this.2.corner }}</div>
          </div>
          <div class="card">
<button class="edit-card-button noprint" data-card-idx="3" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.3.front }}</p>
            <h2 class="title">{{ this.3.title }}</h2>
            <div class="corner">{{ this.3.corner }}</div>
          </div>
          <div class="right-marks"></div>

          <!-- row 3 -->
          <div class="left-marks"></div>
          <div class="card">
            <button class="edit-card-button noprint" data-card-idx="4" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.4.front }}</p>
            <h2 class="title">{{ this.4.title }}</h2>
            <div class="corner">{{ this.4.corner }}</div>
          </div>
          <div class="card">

            <button class="edit-card-button noprint" data-card-idx="5" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.5.front }}</p>
            <h2 class="title">{{ this.5.title }}</h2>
            <div class="corner">{{ this.5.corner }}</div>
          </div>
          <div class="right-marks"></div>

          <!-- row 4 -->
          <div class="left-marks"></div>
          <div class="card">

            <button class="edit-card-button noprint" data-card-idx="6" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.6.front }}</p>
            <h2 class="title">{{ this.6.title }}</h2>
            <div class="corner">{{ this.6.corner }}</div>
          </div>
          <div class="card">

            <button class="edit-card-button noprint" data-card-idx="7" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.7.front }}</p>
            <h2 class="title">{{ this.7.title }}</h2>
            <div class="corner">{{ this.7.corner }}</div>
          </div>
          <div class="right-marks"></div>

          <!-- row -->
          <div class="left-marks"></div>
          <div class="card">
            <button class="edit-card-button noprint" data-card-idx="8" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.8.front }}</p>
            <h2 class="title">{{ this.8.title }}</h2>
            <div class="corner">{{ this.8.corner }}</div>
          </div>
          <div class="card">
            <button class="edit-card-button noprint" data-card-idx="9" data-page-number="{{@index}}">Edit</button>
            <p class="main">{{ this.9.front }}</p>
            <h2 class="title">{{ this.9.title }}</h2>
            <div class="corner">{{ this.9.corner }}</div>
          </div>
          <div class="right-marks"></div>

          <!-- margin -->
          <div></div>
          <div class="vert-marks"></div>
          <div class=""></div>
          <div></div>
        </div>
      </div>

      <div class="around back">
        <div class="cards">
          <!-- margin -->
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          <!-- row 1 -->
          <div></div>
          <div class="card">
            <p class="main">{{ this.0.back }}</p>
            <div class="corner">{{ this.0.index }}</div>
          </div>
          <div class="card">
            <p class="main">{{ this.1.back }}</p>
            <div class="corner">{{ this.1.index }}</div>
          </div>
          <div></div>

          <!-- row 2 -->
          <div></div>
          <div class="card">
            <p class="main">{{ this.2.back }}</p>
            <div class="corner">{{ this.2.index }}</div>
          </div>
          <div class="card">
            <p class="main">{{ this.3.back }}</p>
            <div class="corner">{{ this.3.index }}</div>
          </div>
          <div></div>

          <!-- row 3 -->
          <div></div>
          <div class="card">
            <p class="main">{{ this.4.back }}</p>
            <div class="corner">{{ this.4.index }}</div>
          </div>
          <div class="card">
            <p class="main">{{ this.5.back }}</p>
            <div class="corner">{{ this.5.index }}</div>
          </div>
          <div></div>

          <!-- row 4 -->
          <div></div>
          <div class="card">
            <p class="main">{{ this.6.back }}</p>
            <div class="corner">{{ this.6.index }}</div>
          </div>
          <div class="card">
            <p class="main">{{ this.7.back }}</p>
            <div class="corner">{{ this.7.index }}</div>
          </div>
          <div></div>

          <!-- row 5 -->
          <div></div>
          <div class="card">
            <p class="main">{{ this.8.back }}</p>
            <div class="corner">{{ this.8.index }}</div>
          </div>
          <div class="card">
            <p class="main">{{ this.9.back }}</p>
            <div class="corner">{{ this.9.index }}</div>
          </div>
          <div></div>
        </div>
      </div>
{{/each}}
`);
