(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: block;
      }
      .card {
        padding: var(--team-card-padding);
        border-radius: var(--radius-lg);
        border: 1px solid var(--tron-border-cyan);
        background: rgba(0, 212, 255, 0.05);
        text-align: center;
      }
      .name {
        margin: 0 0 var(--space-sm);
        font-family: var(--font-display);
        font-size: var(--text-label);
        font-weight: var(--text-label-weight);
        letter-spacing: var(--letter-spacing-normal);
        color: var(--tron-text);
      }
      .score-wrap {
        margin: 0 0 var(--space-md);
      }
      .score {
        display: inline-block;
        font-family: var(--font-display);
        font-size: var(--text-score);
        font-weight: var(--text-score-weight);
        letter-spacing: var(--letter-spacing-normal);
        color: var(--tron-cyan);
        text-shadow: var(--tron-glow-cyan);
      }
      .buttons {
        display: flex;
        gap: var(--space-sm);
        justify-content: center;
      }
    </style>
    <div class="card">
      <h2 class="name" id="name"></h2>
      <div class="score-wrap">
        <span class="score" id="score" aria-live="polite">0</span>
      </div>
      <div class="buttons">
        <score-button direction="increment" label="+1"></score-button>
        <score-button direction="decrement" label="-1"></score-button>
      </div>
    </div>
  `;

  customElements.define('team-card', class TeamCard extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'team-id', 'score'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._nameEl = this.shadowRoot.getElementById('name');
      this._scoreEl = this.shadowRoot.getElementById('score');
      this._buttons = this.shadowRoot.querySelectorAll('score-button');
    }

    connectedCallback() {
      this._updateContent();
      this.shadowRoot.querySelectorAll('score-button').forEach((btn) => {
        btn.addEventListener('score-button-click', (e) => this._onButtonClick(e));
      });
    }

    attributeChangedCallback() {
      this._updateContent();
    }

    _updateContent() {
      this._nameEl.textContent = this.getAttribute('name') || 'Team';
      this._scoreEl.textContent = this.getAttribute('score') || '0';
    }

    _onButtonClick(e) {
      const direction = e.detail.direction;
      const teamId = this.getAttribute('team-id') || 'a';
      if (direction === 'increment') {
        this.dispatchEvent(new CustomEvent('score-increment', { bubbles: true, composed: true, detail: { teamId } }));
      } else {
        this.dispatchEvent(new CustomEvent('score-decrement', { bubbles: true, composed: true, detail: { teamId } }));
      }
    }

    set score(value) {
      this.setAttribute('score', String(value));
    }

    get score() {
      return parseInt(this.getAttribute('score') || '0', 10);
    }
  });
})();
