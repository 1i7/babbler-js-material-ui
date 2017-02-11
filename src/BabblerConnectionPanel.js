// BabblerConnectionPanel.js

var React = require('react');

import RaisedButton from 'material-ui/RaisedButton';

import SerialPortPopover from './SerialPortPopover';
//import SerialPortDropdown from './SerialPortDropdown';

import Babbler from 'babbler-js';

const btnStyle = {
  margin: 12
};

var BabblerConnectionPanel = React.createClass({
// http://www.material-ui.com/#/components/raised-button

    getInitialState: function() {
        return {
            deviceStatus: this.props.babbler.deviceStatus,
            portName: this.props.babbler.deviceName
        };
    },
    componentDidMount: function() {
        // слушаем статус устройства
        this.deviceStatusListener = function(status) {
            this.setState({deviceStatus: status, portName: this.props.babbler.deviceName});
        }.bind(this);
        this.props.babbler.on(Babbler.Event.STATUS, this.deviceStatusListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babbler.removeListener(Babbler.Event.STATUS, this.deviceStatusListener);
    },
    
    /** выбран другой порт в списке */
    handlePortNameChange: function(value) { 
        this.setState({portName: value});
    },
    
    render: function() {
        if(this.state.deviceStatus === Babbler.Status.DISCONNECTED) {
            // не подключены к устройству
            
            // проверка на пустую строку: true, если undefined, null, 0, "", " ")
            // http://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in/21732631#21732631
            var portSelected = !(this.state.portName ? this.state.portName.trim().length == 0 : true);
            
            return (
                <span style={this.props.style}>
                    <RaisedButton 
                        label="Подключиться" 
                        onClick={this.connect} 
                        disabled={!portSelected}
                        primary={true} 
                        style={btnStyle} />
                    устройство: 
                    <SerialPortPopover onChange={this.handlePortNameChange} portName={this.state.portName}/>
                </span>
            );
            
        } else if(this.state.deviceStatus === Babbler.Status.CONNECTING) {
            // подключаемся
            return (
                <span style={this.props.style}>
                    <RaisedButton onClick={this.disconnect} label="Отмена" secondary={true} style={btnStyle} />
                    
                    подключаем {this.state.portName}
                </span>
            );
        } else {//if(this.state.deviceStatus === Babbler.Status.CONNECTED) {
            // подключены
            return (
                <span style={this.props.style}>
                    <RaisedButton onClick={this.disconnect} label="Отключиться" secondary={true} style={btnStyle} />
                    подключены к {this.state.portName}
                </span>
            );
        }
    },

    /** Подключиться к выбранному в списке устройству */
    connect: function() {
        this.props.babbler.connect(this.state.portName);
    },
    
    /** Отключиться от устройства */
    disconnect: function() {
        this.props.babbler.disconnect();
    }
});

// отправляем компонент на публику
module.exports = BabblerConnectionPanel;

