type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string;
    data: unknown;
}

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(
        event: string,
        context?: Partial<T>
    ): (data?: T) => void;
}

export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    on<T extends object>(event: EventName, callback: (data: T) => void) {
        if (!this._events.has(event)) {
            this._events.set(event, new Set<Subscriber>());
        }
        this._events.get(event)?.add(callback);
    }

    emit<T extends object>(event: string, data?: T) {
        // Поиск всех подходящих подписчиков для события
        this._events.forEach((subscribers, eventName) => {
            // Проверка соответствия имени события
            // Если eventName строка, проверяем на точное соответствие
            // Если eventName регулярное выражение, проверяем на соответствие шаблону
            if (
                (typeof eventName === 'string' && eventName === event) ||
                (eventName instanceof RegExp && eventName.test(event))
            ) {
                // Вызов всех подписчиков с переданными данными
                subscribers.forEach(subscriber => {
                    subscriber(data);
                });
            }
        });
    }

    trigger<T extends object>(event: string, context?: Partial<T>) {
        // Возвращаем функцию, которая при вызове будет эмитить событие
        return (data?: T) => {
            // Объединяем данные из контекста и переданные данные
            const mergedData = {
                ...(context || {}),
                ...(data || {})
            } as T;

            // Вызываем emit с объединенными данными
            this.emit(event, mergedData);
        };
    }

    // Дополнительный метод для отписки от событий (не требуется по интерфейсу, но полезен)
    off<T extends object>(event: EventName, callback?: (data: T) => void) {
        if (!callback) {
            // Если callback не передан, удаляем всех подписчиков на это событие
            this._events.delete(event);
        } else if (this._events.has(event)) {
            // Иначе удаляем только указанный callback
            this._events.get(event)?.delete(callback);

            // Если подписчиков не осталось, удаляем ключ события
            if (this._events.get(event)?.size === 0) {
                this._events.delete(event);
            }
        }
    }
}