(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: block;
        background: linear-gradient(145deg, var(--tron-bg-secondary) 0%, var(--tron-bg) 100%);
        padding: var(--scoreboard-padding);
        border-radius: var(--radius-xl);
        border: 1px solid var(--tron-border-cyan);
        box-shadow: var(--tron-shadow-cyan);
        text-align: center;
        max-width: var(--scoreboard-max-width);
        width: 100%;
      }
      .title {
        margin-top: 0;
        margin-bottom: var(--space-lg);
        font-family: var(--font-display);
        font-size: var(--text-title);
        font-weight: var(--text-title-weight);
        letter-spacing: var(--letter-spacing-wide);
        text-transform: uppercase;
        color: var(--tron-cyan);
        text-shadow: var(--tron-glow-cyan);
      }
      .teams {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-lg);
      }
      @media (max-width: 600px) {
        :host {
          padding: var(--space-xl) var(--space-lg);
        }
        .teams {
          grid-template-columns: 1fr;
        }
      }
    </style>
    <h1 class="title">Score Keeper</h1>
    <slot name="draw-message"></slot>
    <div class="teams">
      <slot name="team-a"></slot>
      <slot name="team-b"></slot>
    </div>
  `;

  customElements.define('score-board', class ScoreBoard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  });
})();
