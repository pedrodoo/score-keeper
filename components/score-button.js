(function () {
  const rays = Array.from({ length: 10 }, (_, i) => `<div class="ray" style="--ray-i: ${i}"></div>`).join('');
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: inline-block;
        position: relative;
      }
      .btn-wrap {
        position: relative;
        z-index: 1;
      }
      .scan-burst {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 80px;
        height: 80px;
        margin-left: -40px;
        margin-top: -40px;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
      }
      .scan-burst.active {
        animation: scanBurst 0.4s var(--ease-out) forwards;
      }
      .scan-burst .ray {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2px;
        height: 45px;
        margin-left: -1px;
        margin-top: -22px;
        transform-origin: 50% 50%;
        transform: rotate(calc(var(--ray-i) * 36deg));
        background: var(--scan-burst-color, var(--tron-cyan));
        box-shadow: 0 0 6px var(--scan-burst-color, var(--tron-cyan));
      }
      :host([direction="increment"][team-theme="blue"]) .scan-burst .ray,
      :host([direction="increment"]:not([team-theme])) .scan-burst .ray {
        --scan-burst-color: var(--tron-cyan);
      }
      :host([direction="increment"][team-theme="red"]) .scan-burst .ray {
        --scan-burst-color: var(--team-red-primary);
      }
      :host([direction="decrement"]) .scan-burst .ray {
        --scan-burst-color: var(--tron-amber);
      }
      @keyframes scanBurst {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
        40% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
      }
      button {
        position: relative;
        padding: var(--space-sm) var(--space-md);
        border-radius: 999px;
        border: none;
        cursor: pointer;
        font-size: var(--text-caption);
        font-weight: var(--text-caption-weight);
        font-family: var(--font-body);
        transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
        color: #0a0e17;
      }
      button:hover {
        transform: translateY(-2px);
      }
      button:active {
        transform: translateY(0);
        box-shadow: none;
      }
      /* Increment: fallback cyan when no team-theme */
      :host([direction="increment"]) button {
        background: var(--tron-cyan);
        box-shadow: var(--tron-glow-cyan);
      }
      :host([direction="increment"]) button:hover {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.9), 0 0 35px rgba(0, 212, 255, 0.6);
      }
      :host([direction="increment"][team-theme="blue"]) button {
        background: var(--team-blue-primary);
        box-shadow: var(--team-blue-glow);
      }
      :host([direction="increment"][team-theme="blue"]) button:hover {
        box-shadow: 0 0 22px rgba(0, 212, 255, 0.95), 0 0 40px rgba(0, 212, 255, 0.6);
      }
      :host([direction="increment"][team-theme="red"]) button {
        background: var(--team-red-primary);
        box-shadow: var(--team-red-glow);
      }
      :host([direction="increment"][team-theme="red"]) button:hover {
        box-shadow: 0 0 22px rgba(255, 51, 102, 0.95), 0 0 40px rgba(255, 51, 102, 0.6);
      }
      /* Decrement: amber for all */
      :host([direction="decrement"]) button {
        background: var(--tron-amber);
        box-shadow: var(--tron-glow-amber);
      }
      :host([direction="decrement"]) button:hover {
        box-shadow: 0 0 20px rgba(255, 158, 0, 0.9), 0 0 35px rgba(255, 158, 0, 0.6);
      }
    </style>
    <div class="scan-burst" aria-hidden="true">${rays}</div>
    <div class="btn-wrap">
      <button type="button" aria-label=""><span class="label"></span></button>
    </div>
  `;

  customElements.define('score-button', class ScoreButton extends HTMLElement {
    static get observedAttributes() {
      return ['direction', 'label', 'team-theme'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._button = this.shadowRoot.querySelector('button');
      this._labelEl = this.shadowRoot.querySelector('.label');
      this._scanBurst = this.shadowRoot.querySelector('.scan-burst');
    }

    connectedCallback() {
      this._updateLabel();
      this._updateAriaLabel();
      this._button.addEventListener('click', () => this._onClick());
    }

    attributeChangedCallback(name) {
      if (name === 'label' || name === 'direction' || name === 'team-theme') {
        this._updateLabel();
        this._updateAriaLabel();
      }
    }

    _updateLabel() {
      const label = this.getAttribute('label') || (this.getAttribute('direction') === 'decrement' ? '-1' : '+1');
      this._labelEl.textContent = label;
    }

    _updateAriaLabel() {
      const direction = this.getAttribute('direction') || 'increment';
      this._button.setAttribute('aria-label', direction === 'increment' ? 'Add one point' : 'Remove one point');
    }

    _onClick() {
      const burst = this._scanBurst;
      if (burst) {
        burst.classList.remove('active');
        void burst.offsetWidth;
        burst.classList.add('active');
        burst.addEventListener('animationend', () => {
          burst.classList.remove('active');
        }, { once: true });
      }
      this._dispatchClick();
    }

    _dispatchClick() {
      const direction = this.getAttribute('direction') || 'increment';
      this.dispatchEvent(new CustomEvent('score-button-click', {
        bubbles: true,
        composed: true,
        detail: { direction }
      }));
    }
  });
})();
