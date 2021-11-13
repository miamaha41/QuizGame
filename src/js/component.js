 class Quiz extends HTMLElement {
     static get observedAttributes() {
         return ['index', 'count', 'title', 'answers'];
     }
     constructor() {
         super();
         const template = document.querySelector('.template');
         const shadowroot = this.attachShadow({ mode: 'open' }); // return this.shadowroot = shadowDom
         shadowroot.appendChild(template.content.cloneNode(true));
     }
     render(nameAttribute) {
         switch (nameAttribute) {
             case "index":
             case "count":
                 const index = this.shadowRoot.querySelector(".question-count");
                 index.innerText = this.getCount();
                 break;
             case "title":
                 const title = this.shadowRoot.querySelector(".question-tittle");
                 title.innerText = this.getTitle();
                 break;
             case "answers":
                 const answers = this.shadowRoot.querySelector(".question-answer-list");
                 const li = document.createElement("li");
                 li.innerText = this.getAnswers();
                 li.classList.add('answer-item');
                 answers.appendChild(li);
                 break;
         }
     }

     connectedCallback() {
         const btnNext = this.shadowRoot.querySelector('.btnNext')
         const btnPrev = this.shadowRoot.querySelector('.btnPrev')
         btnNext.addEventListener("click", () => {
             this.style.display = 'none';
         })
         btnPrev.addEventListener("click", () => {
             this.previousElementSibling.style.display = '';
         })
     }
     attributeChangedCallback(name, oldValue, newValue) {
         this.render(name);
     }
     disconnectedCallback() {

     }
     getCount() {
         return `Quiz: ${this.getAttribute('index')}/${this.getAttribute('count')}`;
     }
     getTitle() {
         return this.getAttribute('title');
     }
     getAnswers() {
         return this.getAttribute('answers')
     }
 }
 export default Quiz;