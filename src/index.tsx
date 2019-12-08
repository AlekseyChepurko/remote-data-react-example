import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const App: React.FunctionComponent = () => <h1>hello</h1>;

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
