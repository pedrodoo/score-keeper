(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: none;
        margin: var(--space-md) 0 var(--space-lg);
      }
      :host([visible]) {
        display: block;
      }
      .message {
        padding: var(--space-md) var(--space-lg);
        border-radius: var(--radius-lg);
        font-family: var(--font-display);
        font-weight: var(--text-score-weight);
        font-size: 1.75rem;
        letter-spacing: var(--letter-spacing-normal);
        text-transform: uppercase;
        background: linear-gradient(90deg, rgba(0, 212, 255, 0.15), rgba(255, 158, 0, 0.15));
        border: 1px solid var(--tron-border-cyan);
        color: var(--tron-text);
        text-shadow: var(--tron-glow-cyan);
        box-shadow: var(--tron-shadow-cyan);
        animation: drawPulse var(--duration-slow) var(--ease-in-out) infinite alternate;
      }
      @keyframes drawPulse {
        from { transform: scale(1); }
        to { transform: scale(1.03); }
      }
    </style>
    <div class="message" role="status" aria-live="polite">
      <slot></slot>
    </div>
  `;

  customElements.define('draw-message', class DrawMessage extends HTMLElement {
    static get observedAttributes() {
      return ['visible'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name) {
      if (name === 'visible') {
        const visible = this.hasAttribute('visible');
        this.shadowRoot.querySelector('.message').setAttribute('aria-hidden', visible ? 'false' : 'true');
      }
    }

    set visible(value) {
      if (value) {
        this.setAttribute('visible', '');
      } else {
        this.removeAttribute('visible');
      }
    }

    get visible() {
      return this.hasAttribute('visible');
    }
  });
})();
