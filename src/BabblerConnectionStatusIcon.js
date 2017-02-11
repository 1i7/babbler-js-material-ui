// BabblerConnectionStatusIcon.js

var React = require('react');

import FontIcon from 'material-ui/FontIcon';
import {red200, green200} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

import Babbler from 'babbler-js';

var BabblerConnectionStatusIcon = React.createClass({
// http://www.material-ui.com/#/components/circular-progress
// icons
// http://www.material-ui.com/#/components/font-icon
// http://www.material-ui.com/#/customization/colors
// http://google.github.io/material-design-icons/#icon-font-for-the-web
// https://design.google.com/icons/

    getInitialState: function() {
        return {
            deviceStatus: this.props.babbler.deviceStatus
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
    
    /** выбран другой порт в списке */
    handlePortNameChange: function(value) {
        this.setState({portName: value});
    },
    
    render: function() {
        var iconSize = this.props.iconSize ? this.props.iconSize : 50;
    
        if(this.state.deviceStatus === Babbler.Status.DISCONNECTED) {
            // не подключены к устройству
            return (
                <span style={this.props.style}>
                    <FontIcon 
                        className="material-icons"
                        style={{fontSize: iconSize}}
                        color={red200}
                    >highlight_off</FontIcon>
                </span>
            );
            
        } else if(this.state.deviceStatus === Babbler.Status.CONNECTING) {
            // подключаемся
            return (
                <span style={this.props.style}>
                    <CircularProgress size={iconSize} />
                </span>
            );
        } else {//if(this.state.deviceStatus === Babbler.Status.CONNECTED) {
            // подключены
            return (
                <span style={this.props.style}>
                    <FontIcon 
                        className="material-icons" 
                        style={{fontSize: iconSize}}
                        color={green200}
                    >offline_pin</FontIcon>
                </span>
            );
        }
    },
});

// отправляем компонент на публику
module.exports = BabblerConnectionStatusIcon;

