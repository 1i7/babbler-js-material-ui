// BabblerDebugPanel.js

var React = require('react');

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';

import {red200, green200} from 'material-ui/styles/colors';
import keycode from 'keycode';

import BabblerDataFlow from './BabblerDataFlow';

import Babbler from 'babbler-js';

const btnStyle = {
  margin: 12
};

// Панель отладки
var BabblerDebugPanel = React.createClass({
// http://www.material-ui.com/#/components/raised-button
// http://www.material-ui.com/#/components/text-field
// https://github.com/callemall/material-ui/blob/v0.15.4/src/TextField/TextField.js#L367
// http://www.material-ui.com/#/components/subheader

    getInitialState: function() {
        return {
            deviceStatus: this.props.babbler.deviceStatus,
            cmdValue: ""
        };
    },
    
    componentDidMount: function() {
        // слушаем статус устройства
        this.deviceStatusListener = function(status) {
            this.setState({deviceStatus: status});
        }.bind(this);
        this.props.babbler.on(Babbler.Event.STATUS, this.deviceStatusListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babbler.removeListener(Babbler.Event.STATUS, this.deviceStatusListener);
    },
    
    handleCmdChange: function(event) {
        this.setState({
          cmdValue: event.target.value,
        });
    },
    
    handleCmdKeyDown: function(event) {
        // https://github.com/callemall/material-ui/blob/v0.15.4/src/TextField/TextField.js#L367
        //console.log(event.keyCode);
        //if(event.keyCode === 13) {
        if(this.state.cmdValue.length > 0 && keycode(event) === 'enter') {
            this.execCmd();
        }
    },
    
    render: function() {
        var connected = this.state.deviceStatus === Babbler.Status.CONNECTED ? true : false;
        return (
            <div style={{overflowY: "auto", height: 500}}>
                <div>
                    <TextField 
                        hintText="cmd [params]" 
                        value={this.state.cmdValue} 
                        onChange={this.handleCmdChange} 
                        onKeyDown={this.handleCmdKeyDown} 
                        disabled={!connected} 
                        fullWidth={true} />
                    <RaisedButton 
                        label="Выполнить" 
                        onClick={this.execCmd} 
                        disabled={!connected || this.state.cmdValue.length == 0} 
                        style={btnStyle} />
                    <RaisedButton label="ping" onClick={this.cmdPing} disabled={!connected} style={btnStyle} />
                    <RaisedButton label="help" onClick={this.cmdHelp} disabled={!connected} style={btnStyle} />
                </div>
                <Subheader>Команда</Subheader>
                <div style={{minHeight: 26, fontSize: 24, marginLeft: 45}}>{this.state.currCmd}</div>
                <Subheader>Ответ</Subheader>
                <div style={{minHeight: 26, fontSize: 24, marginLeft: 45}}>{this.state.reply}</div>
                <Subheader>Ошибка</Subheader>
                <div style={{minHeight: 18, marginLeft: 45, color: red200}}>{this.state.error}</div>
                <Subheader>Данные</Subheader>
                <BabblerDataFlow
                    babbler={this.props.babbler}
                    maxItems={100}
                    reverseOrder={true}
                    timestamp={true}
                    style={{margin: 20}}/>
            </div>
        );
    },
    
    execCmd: function() {
        var cmdParts = this.state.cmdValue.split(" ");
        // первый кусок - имя команды
        var cmd = cmdParts[0];
        // все остальное - параметры
        cmdParts.shift();
        var params = cmdParts;
        
        this.props.babbler.sendCmd(cmd, params,
            // onResult
            function(err, reply, cmd, params) {
                if(err) {
                    this.setState({reply: "-", error: err.message});
                } else {
                    this.setState({reply: reply, error: undefined});
                }
            }.bind(this)
        );
        this.setState({
            cmdValue: "", 
            currCmd: this.state.cmdValue,
            reply: "",
            error: ""
        });
    }, 
    
    cmdPing: function() {
        this.props.babbler.sendCmd("ping", [],
            // onResult
            function(err, reply, cmd, params) {
                if(err) {
                    this.setState({reply: "-", error: err.message});
                } else {
                    this.setState({reply: reply, error: undefined});
                }
            }.bind(this)
        );
        this.setState({
            currCmd: "ping",
            reply: "",
            error: ""
        });
    },
      
    cmdHelp: function() {
        this.props.babbler.sendCmd("help", ["--list"],
            // onResult
            function(err, reply, cmd, params) {
                if(err) {
                    this.setState({reply: "-", error: err.message});
                } else {
                    this.setState({reply: reply, error: undefined});
                }
            }.bind(this)
        );
        this.setState({
            currCmd: "help --list",
            reply: "",
            error: ""
        });
    }
});


// отправляем компонент на публику
module.exports = BabblerDebugPanel;

