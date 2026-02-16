(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: inline-block;
      }
      button {
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
        transform: translateY(-1px);
      }
      button:active {
        transform: translateY(0);
        box-shadow: none;
      }
      :host([direction="increment"]) button {
        background: var(--tron-cyan);
        box-shadow: var(--tron-glow-cyan);
      }
      :host([direction="increment"]) button:hover {
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.8), 0 0 25px rgba(0, 212, 255, 0.5);
      }
      :host([direction="decrement"]) button {
        background: var(--tron-amber);
        box-shadow: var(--tron-glow-amber);
      }
      :host([direction="decrement"]) button:hover {
        box-shadow: 0 0 15px rgba(255, 158, 0, 0.8), 0 0 25px rgba(255, 158, 0, 0.5);
      }
    </style>
    <button type="button" aria-label=""><span class="label"></span></button>
  `;

  customElements.define('score-button', class ScoreButton extends HTMLElement {
    static get observedAttributes() {
      return ['direction', 'label'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._button = this.shadowRoot.querySelector('button');
      this._labelEl = this.shadowRoot.querySelector('.label');
    }

    connectedCallback() {
      this._updateLabel();
      this._updateAriaLabel();
      this._button.addEventListener('click', () => this._dispatchClick());
    }

    attributeChangedCallback(name) {
      if (name === 'label' || name === 'direction') {
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
