# Typing React Redux's Connect function

What is the problem? In a nutshell, this:

```
import { connect } from 'react-redux';
import React from 'react-dom';
import ReactDOM from 'react-dom';

// given these type
type ItemProps = {| a: string, b: number, c: boolean |};
type TState = {| i: number |};

// and this component
const Item = ({ a, b, c }: TProps) => (<span>a: {a}, b: {b}, c: {c ? 'yes' : 'no'}</span>);

// we would like to connect that with the react redux connect function:
const mapStateToProps = (state: TState, props: *) => ({ a: state.i.toString(), b: props.b, c: !!state.i });
const ConnectedItem = connect(
    mapStateToProps
)(Item);

// and then be able to use the connected component like this:
ReactDOM.render(<ConnectedItem b={4} />, document.getElementById('app'));
```

This is perfectly valid Javascript code, and I would like it to also be
perfectly valid Flow code - however with the current flow declarations for
`react-redux` in flow-typed, I get the following error for the above code:

```
 19: ReactDOM.render(<ConnectedItem b={4} />, document.getElementById('app'));
                     ^^^^^^^^^^^^^^^^^^^^^^^ props of React element `ConnectedItem`. Inexact type is incompatible with exact type
 10: const Item = ({ a, b, c }: TProps) => (<span>a: {a}, b: {b}, c: {c ? 'yes' : 'no'}</span>);
                                ^^^^^^ exact type: object type
```

Since this is valid Javascript code, I would like Flow to not throw errors. I
would also like Flow to help me, and provide type checking for the `b` property
of the `ConnectedItem`. I would also like flow to help me and ensure that the
`mapStateToProps` function and the properties passed from outside (`ownProps`)
fullfill the requirement defined by the `Item` components props - namely that
`a`, `b` and `c` a require properties, and there cannot be any other props than
those.

## Why not use the `Connector` type?

The flow typings for `react-redux` export a `Connector<OP, P>` type, and by typing to that:

```
type TOwnProps = { b: number };
const mapStateToProps = (state: TState) => ({ a: state.i.toString(), c: state.i > 0 });
const connector: Connector<TOwnProps, TProps> = connect(mapStateToProps);
const ConnectedItem = connector(Item);
```

it is supposedly possible to get Flow to accept the properties. However, it
doesn't seem to work well with the latest version of Flow, and it has some
problems:

 * Flow cannot infer the type, we manually have to restrict the type of the
   connector function to `Connect<TOwnProps, TProps>`.
 * We manually have to define the `TOwnProps` type. Flow should be able to
   infer that from the `TProps` type and whatever `mapStateToProps` returns.
 * `TOwnProps` cannot be declared as an excact type.

## Can we do better

Let's try!

The connect function accepts a rather large amount of different parameters, but
let us start small and only consider the case used in this example:

```
type TProps = {| a: string, b: number, c: boolean |};
type TState = {| i: number |};

const Item = ({ a, b, c }: TProps) => (<span>a: {a}, b: {b}, c: {c ? 'yes' : 'no'}</span>);

const mapStateToProps = (state: TState, ownProps: *) => ({ a: state.i.toString(), b: ownProps.b, c: !!state.i });
const ConnectedItem = connect(
    mapStateToProps
)(Item);

const store = createStore((state: TState) => state, { i: 4 });
ReactDOM.render(
    <Provider store={store}>
        <ConnectedItem b={4} />
    </Provider>, document.getElementById('app'));
```
Here we type the *ownProps* as `*`, meaning we would like Flow to infer them.

Let us begin by removing the flow-typed declarations for `react-redux` completely, and start from scrath:

```
declare module 'react-redux' {
    declare function connect(...args: *): any;
    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
}
```

This types! But, naturally, since we type the return type of connect to `any`
Flow will not do any type checking for us. Let us start with the return type
from connect - it is a function that accepts a stateless react component, and
returns a react component.

A React component looks like this: `React$Component<DefaultProps, Props,
State>`, and since we neither have state or default props in this case, we can
declare our return type like this:

```
type StatelessComponent<TProps> = (TProps) => *; // return type is some react element, let flow infer it
type Connector<TOwnProps, TProps> = (StatelessComponent<TProps>) => Class<React$Component<void, TOwnProps, void>>;

declare module 'react-redux' {
    declare function connect<TOwnProps, TProps>(...args: *): Connector<TOwnProps, TProps>;
    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
}
```

Flow still have no way infer anything about what `TOwnProps` and `TProps`
actually are, since we aren't telling it anything about how to infer that. Let
define the mapStateToProps function as argument:

```
type StatelessComponent<TProps> = (TProps) => *; // return type is some react element, let flow infer it
type Connector<TOwnProps, TProps> = (StatelessComponent<TProps>) => Class<React$Component<void, TOwnProps, void>>;
type MapStateToPropsFunc<TOwnProps, TStateProps> = (state: *, props: TOwnProps) => TStateProps;

declare module 'react-redux' {
    declare function connect<TOwnProps, TProps, TStateProps>(
        mapStateToProps: MapStateToPropsFunc<TOwnProps, TStateProps>
    ): Connector<TOwnProps, TStateProps>;
    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
}
```

And now we have achieved our goal! Flow now types both inner and outer props
correctly. If we try playing around with the returned value from
mapStateToProps, or the props set on the `ConnectedItem` we will get flow
errors whenever anything doesn't match the defition of the `Item` components
props.

// TODO: explain this a little better

## Dispatch to props

Let us try to add support for the mapDispatchToProps function. Given this code:

```
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

```

Using the declarations we made in the earlier step, we now get two complaints
from Flow. First, the connect function is getting an extra argument, and second
`Item` isn't getting a required `d` props. More or less what we expected. Let
up declare the `mapDispatchToProps` function like we did with `mapStateToProps`
before:

```
type StatelessComponent<TProps> = (TProps) => *; // return type is some react element, let flow infer it
type Connector<TOwnProps, TProps> = (StatelessComponent<TProps>) => Class<React$Component<void, TOwnProps, void>>;
type MapStateToPropsFunc<TOwnProps, TStateProps> = (state: *, props: TOwnProps) => TStateProps;
type MapDispatchToProps<TOwnProps, TDispatchProps> = (state: *, props: TOwnProps) => TDispatchProps;

declare module 'react-redux' {
    declare function connect<TOwnProps, TProps, TStateProps, TDispatchProps>(
        mapStateToProps: MapStateToPropsFunc<TOwnProps, TStateProps>,
        mapDispatchToProps: MapDispatchToProps<TOwnProps, TDispatchProps>
    ): Connector<TOwnProps, {| ...TStateProps, ...TDispatchProps |}>;
    declare class Provider<TState: *, TAction: *> extends React$Component<void, { store: Store<TState, TAction>, children?: any }, void> { }
}

```

We now declare that the connect function take `mapStateToProps` and
`mapDispatchToProps` function as it's input, and return a connector that maps
from `TOwnProps` (which gets inferred, to the "sum" of the return type from the
two map functions. That is what the `{| ...TStateProps, ...TDispatchProps |}`
syntax means. It works like the regular ES6 object spread, just for types.

With this declarations we now have achieved type safety for the connect function. At least, when it is used in exactly this way.
















