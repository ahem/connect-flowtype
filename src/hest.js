import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

type ItemProps = {| a: string, b: number, c: boolean, d: () => void |};
type TState = {| i: number |};

const Item = ({ a, b, c, d }: ItemProps) => (<span onClick={d}>a: {a}, b: {b}, c: {c ? 'yes' : 'no'}</span>);

const mapStateToProps = (state: TState, ownProps: *) => ({ a: state.i.toString(), b: ownProps.b, c: !!state.i });
const mapDispatchToProps = (dispatch: *, ownProps: *) => ({ d: dispatch({ type: 'SOME_ACTION' }) });

const ConnectedItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(Item);

const store = createStore((state: TState) => state, { i: 4 });
ReactDOM.render(
    <Provider store={store}>
        <ConnectedItem b={4} />
    </Provider>, document.getElementById('app'));

