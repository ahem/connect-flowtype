import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

// =========== Types ================================

type Action = {
    type: 'INCREASE' | 'DECREASE',
};

type CounterState = {
    value: number,
};

type CounterProps = {
    title: string,
    value: number,
};

type CounterDispatchProps = {
    onUpButtonClick: () => void,
    onDownButtonClick: () => void,
}

// =========== Store ================================

function reducer(state: CounterState, action: Action) : CounterState {
    switch (action.type) {
        case 'INCREASE':
            return Object.assign({}, state, { value: state.value + 1 });
        case 'DECREASE':
            return Object.assign({}, state, { value: state.value - 1 });
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

const Counter = ({value, title, onUpButtonClick, onDownButtonClick}: CounterProps & CounterDispatchProps) => (
    <div>
        <span>{title}: {value}</span>
        <button type="button" onClick={onUpButtonClick}>Up</button>
        <button type="button" onClick={onDownButtonClick}>Down</button>
    </div>
);

// =========== Connected Component ==================

function mapStateToProps(state: CounterState, props: CounterProps): CounterProps {
    return {
        value: state.value,
        title: props.title,
    };
}

function mapDispatchToProps(dispatch, props: CounterProps): CounterDispatchProps {
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
        <ConnectedCounter title="hest" value={7} />
    </Provider>,
    document.getElementById('app')
);

