import React from 'react';
import ReactDOM from 'react-dom';


const Counter = ({value, title}) => (
    <div>
        <span>{title}: {value}</span>
        <button type="button">Up</button>
        <button type="button">Down</button>
    </div>
);

ReactDOM.render(<Counter title="horse" value={7} />, document.getElementById('app'));

