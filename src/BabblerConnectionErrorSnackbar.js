// BabblerConnectionErrorSnackbar.js

var React = require('react');

import Snackbar from 'material-ui/Snackbar';

import BabblerDevice from 'babbler-js';

var BabblerConnectionErrorSnackbar = React.createClass({
// http://www.material-ui.com/#/components/snackbar
    
    getInitialState: function() {
        return {
            open: false,
            message: ""
        };
    },
    
    componentDidMount: function() {
        // слушаем статус устройства
        this.deviceStatusListener = function(status) {
            // Показываем сообщение только если отключились с ошибкой
            var err = this.props.babblerDevice.deviceError();
            if(status === BabblerDevice.Status.DISCONNECTED && err != undefined) {
                this.setState({
                    open: true,
                    message: (err.hasOwnProperty("message") ? err.message : err.toString())
                });
            }
        }.bind(this);
        this.props.babblerDevice.on(BabblerDevice.Event.STATUS, this.deviceStatusListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babblerDevice.removeListener(BabblerDevice.Event.STATUS, this.deviceStatusListener);
    },
    
    handleRequestClose: function () {
        this.setState({
            open: false
        });
    },
    
    render: function() {
        return (
            <Snackbar
                open={this.state.open}
                message={this.state.message}
                action={"закрыть"}
                onRequestClose={this.handleRequestClose}
                onActionTouchTap={this.handleRequestClose}
            />
        );
    }
});

// отправляем компонент на публику
module.exports = BabblerConnectionErrorSnackbar;

