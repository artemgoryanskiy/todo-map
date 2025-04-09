import {EventEmitter, IEvents} from "./EventEmitter";

export interface IForm extends IEvents {
    buttonText: string;
    placeholder: string;
    setHandler(handlerFormSubmit: Function): void;
    render(): HTMLFormElement;
    setValue(data: string): void;
    getValue(): void;
    clearValue(): void;
}

export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}

export class Form extends EventEmitter implements IForm {
    protected formElement: HTMLFormElement;
    protected inputField: HTMLInputElement;
    protected handlerFormSubmit: Function;
    protected submitButton: HTMLButtonElement;

    constructor(formTemplate: HTMLTemplateElement) {
        super();
        this.formElement = formTemplate.content.querySelector('.todos__form').cloneNode(true) as HTMLFormElement;
        this.inputField = this.formElement.querySelector('.todo-form__input');
        this.submitButton = this.formElement.querySelector('.todo-form__submit-btn');
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.emit('submit', {value: this.inputField.value});
        })
    }

    setHandler(handlerFormSubmit: Function) {
        this.handlerFormSubmit = handlerFormSubmit;
    }

    render() {
        return this.formElement;
    }

    setValue(data: string) {
        this.inputField.value = data;
    }

    getValue() {
        return this.inputField.value;
    }

    clearValue() {
        this.formElement.reset();
    }

    set buttonText(data: string) {
        this.submitButton.textContent = data;
    }

    set placeholder(data: string) {
        this.inputField.placeholder = data;
    }
}