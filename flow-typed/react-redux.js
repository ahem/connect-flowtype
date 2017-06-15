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

type MapStateToPropsFunc<TOwnProps, TStateProps> = (state: *, props: TOwnProps) => TStateProps;
type Connector<TProps, TOwnProps> = (component: (props: TProps) => *) => Class<React$Component<void, TOwnProps, void>>


declare module 'react-redux' {
    declare function connect<
            TProps,
            TOwnProps,
        >(mapStateToProps: MapStateToPropsFunc<TOwnProps, TProps>): Connector<TProps, TOwnProps>

    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
}

