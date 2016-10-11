# babbler-js-material-ui
MaterialUI widgets for Babbler.js Arduino control library

babbler_h library for Arduino/ChipKIT boards:
https://github.com/1i7/babbler_h

See babbler.js library
https://github.com/1i7/babbler-js

and babbler-js-demo
https://github.com/1i7/babbler-js-demo

for usage examples.

Demo application video in action:
https://www.youtube.com/watch?v=uLHPr1sS558

<a href="http://www.youtube.com/watch?feature=player_embedded&v=uLHPr1sS558
" target="_blank"><img src="http://img.youtube.com/vi/uLHPr1sS558/0.jpg" 
alt="Babbler.js управление Arduino через последовательный порт" width="240" height="180" border="10" /></a>


Material UI React components
http://www.material-ui.com/#/

~~~jsx
var React = require('react');
var ReactDOM = require('react-dom');

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';

...

// Babbler.js
import BabblerDevice from 'babbler-js';

// виджеты Babbler MaterialUI
import BabblerConnectionStatusIcon from 'babbler-js-material-ui/lib/BabblerConnectionStatusIcon';
import BabblerConnectionErrorSnackbar from 'babbler-js-material-ui/lib/BabblerConnectionErrorSnackbar';
import BabblerConnectionPanel from 'babbler-js-material-ui/lib/BabblerConnectionPanel';
import BabblerDataFlow from 'babbler-js-material-ui/lib/BabblerDataFlow';

...

// Контент приложения
ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div>
        <Paper>
            <BabblerConnectionPanel babblerDevice={babblerDevice1}/>
            <BabblerConnectionStatusIcon 
                babblerDevice={babblerDevice1} 
                iconSize={50}
                style={{position: "absolute", right: 0, marginRight: 14, marginTop: 5}} />
        </Paper>
        
        <Divider style={{marginTop: 20, marginBottom: 20}}/>
        
        <Tabs>
            <Tab label="Лампочки" >
                <BabblerLedControlPnl babblerDevice={babblerDevice1}/>
            </Tab>
            <Tab label="Отладка" >
                <BabblerDebugPnl babblerDevice={babblerDevice1}/>
            </Tab>
            <Tab label="Лог" >
                <BabblerDataFlow 
                    babblerDevice={babblerDevice1} 
                    reverseOrder={true}
                    maxItems={10000}
                    timestamp={true}
//                    filter={{ err: false, data: false }}
//                    filter={{ data: {queue: false} }}
//                    filter={{ err: {in: false, out: false, queue: false}, data: {in: false, out: false, queue: false} }}
                    style={{margin: 20}}/>
            </Tab>
        </Tabs>
        
        <BabblerConnectionErrorSnackbar babblerDevice={babblerDevice1}/>
      </div>
    </MuiThemeProvider>,
    document.getElementById('app-content')
);

~~~
