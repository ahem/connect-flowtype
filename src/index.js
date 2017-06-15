import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';

// =========== Types ================================

type Action = {|
    type: 'INCREASE' | 'DECREASE',
|};

type State = {|
    value: number,
|};

type CounterProps = {|
    title: string,
    value: number,
    onUpButtonClick: () => void,
    onDownButtonClick: () => void,
|};

// =========== Store ================================

function reducer(state: State, action: Action) : State {
    switch (action.type) {
        case 'INCREASE':
            return Object.assign(({}: $Shape<State>), state, { value: state.value + 1 });
        case 'DECREASE':
            return Object.assign(({}: $Shape<State>), state, { value: state.value - 1 });
        default:
            return state;
    }
}

const store = createStore(reducer, { value: 7 });

// =========== Actions ==============================

function increaseCounter() {
    return { type: 'INCREASE' };
}

function decreaseCounter() {
    return { type: 'DECREASE' };
}

// =========== Component ============================

const Counter = ({value, title, onUpButtonClick, onDownButtonClick}: CounterProps) => (
    <div>
        <span>{title}: {value}</span>
        <button type="button" onClick={onUpButtonClick}>Up</button>
        <button type="button" onClick={onDownButtonClick}>Down</button>
    </div>
);

// =========== Connected Component ==================

function mapStateToProps(state, props) {
    return {
        value: state.value,
        title: props.title,
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        onUpButtonClick: () => dispatch(increaseCounter()),
        onDownButtonClick: () => dispatch(decreaseCounter()),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
const ConnectedCounter = connector(Counter);

// =========== Render ===============================

ReactDOM.render(
    <Provider store={store}>
        <ConnectedCounter title="hest" />
    </Provider>,
    document.getElementById('app')
);

