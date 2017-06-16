// @flow

/* eslint-disable */

/* Definitions:
 *      TState: type of Redux state
 *      TProps: type of props for inner component
 *      TStateProps: type of the set of props returned from mapStateToProps - subset of TProps
 *      TDispatchProps: type of the set of props returned from mapDispatchToProps - subset of TProps
 *      TOwnProps: type of props for connected component ("external props") 
 */

// import type { Dispatch, Store } from 'redux';

// type MapStateToPropsFunc<TOwnProps, TStateProps> = (state: *, props: TOwnProps) => TStateProps;
// type MapDispatchToProps<TOwnProps, TDispatchProps> = (dispatch: *, props: TOwnProps) => TDispatchProps;
// type Connector<TMergeProps, TOwnProps> = (component: (props: TMergeProps) => *) => Class<React$Component<void, TOwnProps, void>>

// declare module 'react-redux' {
//     declare function connect<
//             TOwnProps,
//             TProps,
//             TStateProps,
//             TDispatchProps,
//         >(
//             mapStateToProps: MapStateToPropsFunc<TOwnProps, TStateProps>,
//             mapDispatchToProps: MapStateToPropsFunc<TOwnProps, TDispatchProps>,
//         ): Connector<{|...TStateProps, ...TDispatchProps|}, TOwnProps>


//     declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
// }

type StatelessComponent<TProps> = (TProps) => *; // return type is some react element, let flow infer it
type Connector<TOwnProps, TProps> = (StatelessComponent<TProps>) => Class<React$Component<void, TOwnProps, void>>;
type MapStateToPropsFunc<TOwnProps, TStateProps> = (state: *, props: TOwnProps) => TStateProps;
type MapDispatchToProps<TOwnProps, TDispatchProps> = (state: *, props: TOwnProps) => TDispatchProps;

declare module 'react-redux' {
    declare function connect<TOwnProps, TProps, TStateProps>(
        mapStateToProps: MapStateToPropsFunc<TOwnProps, TStateProps>,
    ): Connector<TOwnProps, TStateProps>;

    declare function connect<TOwnProps, TProps, TStateProps, TDispatchProps>(
        mapStateToProps: MapStateToPropsFunc<TOwnProps, TStateProps>,
        mapDispatchToProps: MapDispatchToProps<TOwnProps, TDispatchProps>
    ): Connector<TOwnProps, {| ...TStateProps, ...TDispatchProps |}>;


    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
}

