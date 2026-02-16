(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: none;
        margin: var(--space-md) 0 0;
      }
      :host([visible]) {
        display: block;
      }
      .message {
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-lg);
        font-family: var(--font-display);
        font-weight: var(--text-score-weight);
        font-size: 1rem;
        letter-spacing: var(--letter-spacing-normal);
        text-transform: uppercase;
        background: linear-gradient(90deg, rgba(0, 212, 255, 0.2), rgba(255, 51, 102, 0.2));
        border: 1px solid rgba(0, 212, 255, 0.5);
        color: var(--tron-text);
        text-shadow: 0 0 12px rgba(0, 212, 255, 0.8), 0 0 12px rgba(255, 51, 102, 0.6);
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.5), 0 0 25px rgba(255, 51, 102, 0.4);
        animation: drawPulse var(--tron-glow-pulse-duration) var(--ease-in-out) infinite alternate;
      }
      @keyframes drawPulse {
        0% { transform: scale(1); box-shadow: 0 0 25px rgba(0, 212, 255, 0.5), 0 0 25px rgba(255, 51, 102, 0.4); }
        100% { transform: scale(1.04); box-shadow: 0 0 35px rgba(0, 212, 255, 0.8), 0 0 35px rgba(255, 51, 102, 0.6); }
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
