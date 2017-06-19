// @flow

/* eslint-disable */

import type { Store } from 'redux';

declare module 'react-redux' {

    declare class Provider<TState: *, TAction: *> extends
        React$Component<void, { store: Store<TState, TAction>, children?: mixed }, void> { }

    declare type ConnectOptions = {
        pure?: boolean,
        withRef?: boolean
    };

    declare class ConnectedComponent<OwnProps, Props, D, ST> extends React$Component<void, OwnProps, void> {
        static WrappedComponent: Class<React$Component<D, Props, ST>>;
        getWrappedInstance(): React$Component<D, Props, ST>;
        static defaultProps: void;
        props: OwnProps;
        state: void;
    }

    declare type Connector<OwnProps, Props> = {
        ((Props) => React$Element<*>): Class<ConnectedComponent<OwnProps, Props, void, void>>;
        <D, ST>(Class<React$Component<D, Props, ST>>): Class<ConnectedComponent<OwnProps, Props, D, ST>>;
    };

    declare type MapStateToProps<State, OwnProps, StateProps> =
        | (State, OwnProps) => StateProps
        | () => (State, OwnProps) => StateProps;

    // TODO: support passing an object instead of a function to mapDispatchToProps
    declare type MapDispatchToProps<Dispatch, OwnProps, DispatchProps> =
        | (Dispatch, OwnProps) => DispatchProps
        | () => (Dispatch, OwnProps) => DispatchProps;


    // Connect ============================================================
    
    declare function connect<OwnProps>():
        Connector<OwnProps, {| ...OwnProps, dispatch: Dispatch |}>

    declare function connect<Dispatch, OwnProps>(
        mapStateToProps: null | void,
        mapDispatchToProps: null | void,
        mergeProps: null | void,
        options: ConnectOptions,
    ): Connector<OwnProps, {| ...OwnProps, dispatch: Dispatch |}>

    declare function connect<Dispatch, OwnProps>(
        mapStateToProps: null | void,
        mapDispatchToProps: null | void,
        mergeProps: null | void,
        options?: ConnectOptions,
    ): Connector<OwnProps, {| ...OwnProps, dispatch: Dispatch |}>

    declare function connect<Dispatch, State, OwnProps, StateProps>(
        mapStateToProps: MapStateToProps<State, OwnProps, StateProps>,
        mapDispatchToProps: null | void,
        mergeProps: null | void,
        options?: ConnectOptions,
    ): Connector<OwnProps, {| ...OwnProps, ...StateProps, dispatch: Dispatch |}>

    declare function connect<Dispatch, OwnProps, DispatchProps>(
        mapStateToProps: null | void, 
        mapDispatchToProps: MapDispatchToProps<Dispatch, OwnProps, DispatchProps>,
        mergeProps: null | void,
        options?: ConnectOptions,
    ): Connector<OwnProps, {| ...OwnProps, ...DispatchProps |}>

    declare function connect<Dispatch, State, OwnProps, StateProps, DispatchProps>(
        mapStateToProps: MapStateToProps<State, OwnProps, StateProps>,
        mapDispatchToProps: MapDispatchToProps<Dispatch, OwnProps, DispatchProps>,
        mergeProps: null | void,
        options?: ConnectOptions,
    ): Connector<OwnProps, {| ...OwnProps, ...StateProps, ...DispatchProps |}>

    declare function connect<Dispatch, State, OwnProps, StateProps, MergeProps>(
        mapStateToProps: MapStateToProps<State, OwnProps, StateProps>,
        mapDispatchToProps: null | void,
        mergeProps: (StateProps, dispatch: Dispatch, OwnProps) => MergeProps,
        options?: ConnectOptions,
    ): Connector<OwnProps, MergeProps>

    // FIXME: for some reason this case doesn't work. Or at least I can't write tests for it :-(
    declare function connect<Dispatch, OwnProps, MergeProps>(
        mapStateToProps: null | void, 
        mapDispatchToProps: MapDispatchToProps<Dispatch, OwnProps, DispatchProps>,
        mergeProps: (OwnProps, DispatchProps) => MergeProps,
        options?: ConnectOptions,
    ): Connector<OwnProps, MergeProps>

    declare function connect<Dispatch, OwnProps, DispatchProps, MergeProps>(
        mapStateToProps: MapStateToProps<State, OwnProps, StateProps>,
        mapDispatchToProps: MapDispatchToProps<Dispatch, OwnProps, DispatchProps>,
        mergeProps: (OwnProps, DispatchProps) => MergeProps,
        options?: ConnectOptions,
    ): Connector<OwnProps, MergeProps>
}


