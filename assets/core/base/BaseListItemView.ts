import { Component } from "cc";

export abstract class BaseListItemView<T> extends Component {
    abstract render(data: T): void;
}
