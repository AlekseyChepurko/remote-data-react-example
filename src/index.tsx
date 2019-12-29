import React from 'react';
import ReactDOM from 'react-dom';
import { AppComponent } from './App.component';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<AppComponent />, document.getElementById('root'));

serviceWorker.unregister();
