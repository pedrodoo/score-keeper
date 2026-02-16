(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      @keyframes tronGlowPulse {
        0%, 100% { text-shadow: 0 0 12px rgba(0, 212, 255, 0.8), 0 0 24px rgba(0, 212, 255, 0.5); opacity: 1; }
        50% { text-shadow: 0 0 20px rgba(0, 212, 255, 1), 0 0 40px rgba(0, 212, 255, 0.7); opacity: 0.95; }
      }
      @keyframes tronBorderPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.5); }
        50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.8), 0 0 50px rgba(0, 212, 255, 0.4); }
      }
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
        animation: tronBorderPulse var(--tron-border-pulse-duration) var(--ease-in-out) infinite;
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
        animation: tronGlowPulse var(--tron-glow-pulse-duration) var(--ease-in-out) infinite;
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
    <h1 class="title">CROM SCORE KEEPER</h1>
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
