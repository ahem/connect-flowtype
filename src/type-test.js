import { connect } from 'react-redux';

import React, { Component } from 'react';

// FIXME: The types do infer pretty nice types, and generate pretty nice errors

type State = {|
    c: number,
    d: string,
|};

type Props1 = {|
    a: number,
    b: string,
    dispatch: () => void,
|};

type Props2 = {|
    a: number,
    b: string,
    onClick: () => void,
|};

var CC;

// ==================================================
// no arguments:
//      connect()
// ==================================================

CC = connect()((props: Props1) => <div>{props.a} {props.b}</div>);
<CC a={1} b="s" />;

// $ExpectError - missing b
CC = connect()((props: Props1) => <div>{props.a} {props.b}</div>);
<CC a={1} />;

// $ExpectError - wrong a type
CC = connect()((props: Props1) => <div>{props.a} {props.b}</div>);
<CC a="s" b="s" />;

// $ExpectError - too many props
CC = connect()((props: Props1) => <div>{props.a} {props.b}</div>);
<CC a={1} b="s" foo="bar" />;

// ==================================================
// with options:
//      connect(null, null, null, options)
// ==================================================

connect(null, null, null, { pure: true })((props: Props1) => <div>{props.a} {props.b}</div>);

// $ExpectError
connect(null, null, null, { pure: 1 })((props: Props1) => <div>{props.a} {props.b}</div>); // wrong type

connect(null, null, null, { withRef: true })((props: Props1) => <div>{props.a} {props.b}</div>);

// $ExpectError
connect(null, null, null, { withRef: 1 })((props: Props1) => <div>{props.a} {props.b}</div>); // wrong type

CC = connect(null, null, null, {})((props: Props1) => <div>{props.a} {props.b}</div>);
<CC a={1} b="s" />;

// $ExpectError - missing a, b
CC = connect(null, null, null, {})((props: Props1) => <div>{props.a} {props.b}</div>);
<CC />;

// ==================================================
// mapStateToProps, without ownProps arg in function
//      connect((state => ({ a: state.a }))
// ==================================================

CC = connect((state: State) => ({ a: state.c }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC b="s" />;

// $ExpectError - missing b
CC = connect((state: State) => ({ a: state.c }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC />;

// $ExpectError - wrong type
CC = connect((state: State) => ({ a: state.c }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC b={1} />; 

// $ExpectError - too many props
CC = connect((state: State) => ({ a: state.c }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC b={1} foo="bar" />; 

// ==================================================
// mapStateToProps, ownprops arg in function
//      connect((state, ownProps) => ({ a: state.a }))
// ==================================================

CC = connect((state: State, ownProps) => ({ a: state.c, b: ownProps.b + 's' }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC b={4} />;

// $ExpectError - wrong type
CC = connect((state: State, ownProps) => ({ a: state.c, b: Number(ownProps.b) }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC b="4" />; 

// $ExpectError - too many props
CC = connect((state: State, ownProps) => ({ a: state.c, b: ownProps.b + 's' }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC b={1} foo="bar" />; 

// FIXME: I cannot get this to work, without typing `ownProps` a little :-(
// $ExpectError - missing b
CC = connect((state: State, ownProps: { b: * }) => ({ a: state.c, b: ownProps.b }))((props: Props1) => <div>{props.a} {props.b}</div>);
<CC />;

// ==================================================
// mapDispatchToProps, without ownProps arg in function
//      connect(null, (dispatch => ({ onClick: () => dispatch(/* ... */) })))
// ==================================================

CC = connect(null, (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }))(
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC a={1} b="s" />;

CC = connect(null, (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }))(
    // $ExpectError - missing property
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC a={1} />;

CC = connect(null, (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }))(
    // $ExpectError - wrong type
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC a={1} b={1} />;

CC = connect(null, (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }))(
    // $ExpectError - extra props
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC a={1} b="s" foo="bar" />;

CC = connect(null, (dispatch: *) => ({ onClick: 42 }))(
    // $ExpectError - wrong type
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC a={1} b={1} />;


// ==================================================
// mapStateToProps & mapDispatchToProps
// ==================================================


CC = connect(
        (state: State, ownProps) => ({ a: state.c, b: ownProps.b + 's' }),
        (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }),
)(
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC b={1} />;

CC = connect(
        (state: State, ownProps) => ({ a: state.c, b: ownProps.b + 's' }),
        (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }),
)(
    // $ExpectError - extra args
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC b="s" foo="bar" />;

CC = connect(
        (state: State) => ({ a: state.c }),
        (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }),
)(
    // $ExpectError - wrong type
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC b={1} />;

// ==================================================
// mapStateToProps & mergeProps
// ==================================================

CC = connect(
        (state: State, ownProps) => ({ a: state.c, b: ownProps.b + 's' }),
        null,
    (stateProps, dispatchProps, ownProps) => Object.assign(({}: $Shape<Props2>), stateProps, { onClick: dispatchProps.dispatch({ type: 'click' }) }),
)(
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC b={1} />;

CC = connect(
        // $ExpectError - wrong type
        (state: State, ownProps) => ({ a: state.c, b: ownProps.b }),
        null,
        (stateProps, dispatchProps, ownProps) => Object.assign(({}: $Shape<Props2>), stateProps, { onClick: dispatchProps.dispatch({ type: 'click' }) }),
)(
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC b={1} />;


// ==================================================
// mapStateToProps & mapDispatchToProps & mergeProps
// ==================================================

CC = connect(
        (state: State, ownProps) => ({ a: state.c, b: ownProps.b }),
        (dispatch: *) => ({ onClick: () => dispatch({ type: 'click' }) }),
        // $ExpectError - wrong type
        (stateProps, dispatchProps) => Object.assign(({}: $Shape<Props2>), stateProps, dispatchProps),
)(
    (props: Props2) => <div onClick={props.onClick}>{props.a} {props.b}</div>
);
<CC b={1} />;


// ==================================================
// Support React$Component
// ==================================================

class CC2 extends Component {
    render() {
        return (<div>{this.props.a} {this.props.b}</div>);
    }
    props: Props1;
}

CC = connect()(CC2);
<CC a={1} b="s" />;

class CC3 extends Component {
    render() {
        return (<div>{this.props.a} {this.props.b}</div>);
    }
    props: Props1;
}

CC = connect((state: State, ownProps) => ({ a: state.c, b: ownProps.b + 's' }))(CC3);
<CC a={1} b={1} />;


class CC4 extends Component {
    render() {
        return (<div>{this.props.a} {this.props.b}</div>);
    }
    props: Props1;
}

// $ExpectError - wrong type
CC = connect((state: State, ownProps) => ({ a: state.c, b: ownProps.b }))(CC4);
<CC b={1} />;


