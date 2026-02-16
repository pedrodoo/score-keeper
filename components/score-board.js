(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      @keyframes tronGlowPulse {
        0%, 100% { text-shadow: 0 0 calc(12px * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, 0.8), 0 0 calc(24px * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, 0.5); opacity: 1; }
        50% { text-shadow: 0 0 calc(20px * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, 1), 0 0 calc(40px * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, 0.7); opacity: 0.95; }
      }
      @keyframes tronBorderPulse {
        0%, 100% { box-shadow: 0 0 calc(20px * var(--glow-intensity, 1) * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, calc(0.3 + 0.5 * var(--glow-intensity, 1))); }
        50% { box-shadow: 0 0 calc(30px * var(--glow-intensity, 1) * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, calc(0.5 + 0.3 * var(--glow-intensity, 1))), 0 0 calc(50px * var(--glow-intensity, 1) * var(--glow-size-multiplier, 1)) rgba(0, 212, 255, 0.4); }
      }
      :host {
        display: block;
        --glow-intensity: 1;
        --glow-size-multiplier: 1;
        --glow-pulse-duration: 2.5s;
        background: linear-gradient(145deg, var(--tron-bg-secondary) 0%, var(--tron-bg) 100%);
        padding: var(--scoreboard-padding);
        border-radius: var(--radius-xl);
        border: 1px solid var(--tron-border-cyan);
        box-shadow: 0 0 calc(20px * var(--glow-intensity) * var(--glow-size-multiplier)) rgba(0, 212, 255, calc(0.3 + 0.5 * var(--glow-intensity)));
        text-align: center;
        max-width: var(--scoreboard-max-width);
        width: 100%;
        animation: tronBorderPulse var(--glow-pulse-duration) var(--ease-in-out) infinite;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-lg);
      }
      .title {
        margin: 0;
        font-family: var(--font-display);
        font-size: var(--text-title);
        font-weight: var(--text-title-weight);
        letter-spacing: var(--letter-spacing-wide);
        text-transform: uppercase;
        color: var(--tron-cyan);
        animation: tronGlowPulse var(--glow-pulse-duration) var(--ease-in-out) infinite;
      }
      .reset-btn {
        font-family: var(--font-display);
        font-size: var(--text-caption);
        font-weight: var(--text-caption-weight);
        letter-spacing: var(--letter-spacing-normal);
        color: var(--tron-text-muted);
        background: transparent;
        border: 1px solid var(--tron-border-cyan);
        border-radius: var(--radius-sm);
        padding: var(--space-xs) var(--space-sm);
        cursor: pointer;
        transition: color var(--duration-normal), border-color var(--duration-normal), box-shadow var(--duration-normal);
      }
      .reset-btn:hover {
        color: var(--tron-cyan);
        border-color: var(--tron-cyan);
        box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
      }
      .teams {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: var(--space-lg);
        align-items: center;
      }
      .vs {
        font-family: var(--font-display);
        font-size: var(--text-label);
        font-weight: var(--text-label-weight);
        letter-spacing: var(--letter-spacing-normal);
        color: var(--tron-text-muted);
        text-align: center;
      }
      @media (max-width: 600px) {
        :host {
          padding: var(--space-xl) var(--space-lg);
        }
        .teams {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto auto;
        }
      }
    </style>
    <div class="header">
      <h1 class="title">CROM SCORE KEEPER</h1>
      <button type="button" class="reset-btn" aria-label="Reset scores">Reset</button>
    </div>
    <div class="teams">
      <slot name="team-a"></slot>
      <div class="vs">VS</div>
      <slot name="team-b"></slot>
    </div>
  `;

  customElements.define('score-board', class ScoreBoard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      const btn = this.shadowRoot.querySelector('.reset-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('score-reset', { bubbles: true, composed: true }));
        });
      }
    }
  });
})();
