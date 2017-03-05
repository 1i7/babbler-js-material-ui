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
                <FontIcon 
                    className="material-icons"
                    color={red200}
                    style={{...this.props.style, 
                        verticalAlign: "middle", 
                        fontSize: iconSize}}
                >highlight_off</FontIcon>
            );
            
        } else if(this.state.deviceStatus === Babbler.Status.CONNECTING) {
            // подключаемся
            return (
                <CircularProgress size={iconSize*0.9} 
                    style={{...this.props.style,
                        verticalAlign: "middle"}}/>
            );
        } else {//if(this.state.deviceStatus === Babbler.Status.CONNECTED) {
            // подключены
            return (
                <FontIcon 
                    className="material-icons"
                    color={green200}
                    style={{...this.props.style, 
                       verticalAlign: "middle", 
                       fontSize: iconSize}}
                >offline_pin</FontIcon>
            );
        }
    },
});

// отправляем компонент на публику
module.exports = BabblerConnectionStatusIcon;

