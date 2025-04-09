export interface IPopup {
    content: HTMLElement;
    open(): void;
    close(): void;
}

export class Popup implements IPopup {
    protected closeButton: HTMLElement;
    protected _content: HTMLElement;

    constructor(protected container: HTMLElement) {
        this.closeButton = this.container.querySelector('.popup__close');
        this._content = this.container.querySelector('.popup__content');

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (e) => e.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('popup_is-opened');
    }
    close() {
        this.container.classList.remove('popup_is-opened');
        this.content = null;
    }
}