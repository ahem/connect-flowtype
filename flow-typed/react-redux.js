// @flow

/* eslint-disable */

/* Definitions:
 *      TState: type of Redux state
 *      TProps: type of props for inner component
 *      TStateProps: type of the set of props returned from mapStateToProps - subset of TProps
 *      TDispatchProps: type of the set of props returned from mapDispatchToProps - subset of TProps
 *      TOwnProps: type of props for connected component ("external props") 
 */

import type { Dispatch, Store } from 'redux';

type MapStateToProps<TState, TOwnProps: Object, TStateProps: Object> =
    (state: TState, ownProps: TOwnProps) => TStateProps;

type MapDispatchToProps<TAction, TOwnProps: Object, TDispatchProps: Object> =
    ((dispatch: Dispatch<TAction>, ownProps: TOwnProps) => DP);


type ConnectArg = (React$Component<*, TProps, *> | (props: TProps) => mixed);

type Connector<TProps, TOwnProps> =
    (component: ConnectArg) => Class<React$Component<void, TOwnProps, void>>;

declare module 'react-redux' {

    declare function connect<TState, TAction, TOwnProps, TStateProps, TDispatchProps>(
        mapStateToProps: MapStateToProps<TState, TOwnProps, TStateProps>,
        mapDispatchToProps: MapDispatchToProps<TAction, TOwnProps, TDispatchProps>
    ): Connector<TOwnProps, TStateProps>

    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }

}
