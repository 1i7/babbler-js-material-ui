// BabblerDataFlow.js

var React = require('react');

import {red200, lime900, deepPurple900, yellow900} from 'material-ui/styles/colors';

import Babbler from 'babbler-js';

var BabblerDataFlow = React.createClass({
    getInitialState: function() {
        return {
            dataFlow: []
        };
    },
    
    componentDidMount: function() {
        // счетчик элементов, нужен для идентификатора элементов
        this.itemKeyCounter = 0;
        
        function timestamp() {
            var now = new Date();
            return now.getFullYear() + "/" + now.getMonth() + "/" + now.getDay() + " " + 
                now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " " +
                now.getMilliseconds();
        }
        
        // слушаем данные от устройства
        this.dataListener = function onData(data, dir) {
            var skip = false;
            // посмотрим фильтры, разрешено все, что явно не запрещено
            if(this.props.filter != undefined && this.props.filter.data != undefined) {
                // задан фильтр по данным, посмотрим, есть чего запрещенного
                if( (this.props.filter.data === false) ||
                      (dir === Babbler.DataFlow.IN && this.props.filter.data.in === false) ||
                      (dir === Babbler.DataFlow.OUT && this.props.filter.data.out === false) ||
                      (dir === Babbler.DataFlow.QUEUE && this.props.filter.data.queue === false) ) {
                    skip = true;
                }
                
                // проверим фильтр по контенту
                if(typeof this.props.filter.data.content === 'string' || 
                      this.props.filter.data.content instanceof String) {
                    if(data.indexOf(this.props.filter.data.content) >=0) {
                        skip = true;
                    }
                } else if(this.props.filter.data.content instanceof Array) {
                    for (var val in this.props.filter.data.content) {
                        if(data.indexOf(this.props.filter.data.content[val]) >=0) {
                           skip = true;
                           break;
                        }
                    }
                }
            }
            
            if(!skip) {
                var mark;
                var style;
                if(dir === Babbler.DataFlow.IN) {
                    mark = "in>>";
                    style = {color: deepPurple900};
                } else if(dir === Babbler.DataFlow.OUT) {
                    mark = "out<<";
                    style = {color: lime900};
                } else {//if(dir === Babbler.DataFlow.QUEUE) {
                    mark = "queue<<";
                    style = {color: yellow900};
                }
                
                this.itemKeyCounter++;
                var logElem =
                    <span key={this.itemKeyCounter} style={style}>
                        {this.props.timestamp ? "[" + timestamp() + "] " : ""}{mark}{data}<br/>
                    </span>;
                    
                if(!this.props.reverseOrder) {
                    if(this.props.maxItems != undefined && this.state.dataFlow.length >= this.props.maxItems) {
                        // удаляем самое старое событие из начала массива
                        this.state.dataFlow.shift();
                    }
                    // последнее событие в конец массива
                    this.state.dataFlow.push(logElem);
                } else {
                    if(this.props.maxItems != undefined && this.state.dataFlow.length >= this.props.maxItems) {
                        // удаляем самое старое событие из конца массива
                        this.state.dataFlow.pop();
                    }
                
                    // последнее событие в начало массива
                    this.state.dataFlow.splice(0, 0, logElem);
                }
                // перерисовать
                this.setState({dataFlow: this.state.dataFlow});
            }
        }.bind(this);
        this.props.babbler.on(Babbler.Event.DATA, this.dataListener);
        
        // слушаем ошибки разбора данных устройства
        this.dataErrorListener = function(data, dir, error) {
            var skip = false;
            // посмотрим фильтры, разрешено все, что явно не запрещено
            if(this.props.filter != undefined && this.props.filter.err != undefined) {
                // задан фильтр по ошибкам, посмотрим, есть чего запрещенного
                if( (this.props.filter.err === false) ||
                      (dir === Babbler.DataFlow.IN && this.props.filter.err.in === false) ||
                      (dir === Babbler.DataFlow.OUT && this.props.filter.err.out === false) ||
                      (dir === Babbler.DataFlow.QUEUE && this.props.filter.err.queue === false) ) {
                    skip = true;
                }
                
                // проверим фильтр по контенту
                if(typeof this.props.filter.err.content === 'string' || 
                      this.props.filter.err.content instanceof String) {
                    if(data.indexOf(this.props.filter.err.content) >=0) {
                        skip = true;
                    }
                } else if(this.props.filter.err.content instanceof Array) {
                    for (var val in this.props.filter.err.content) {
                        if(data.indexOf(this.props.filter.err.content[val]) >=0) {
                           skip = true;
                           break;
                        }
                    }
                }
            }
            
            if(!skip) {
                var mark = (dir === Babbler.DataFlow.IN ? "err>>" : "err<<");
                var style = {color: red200};
                
                this.itemKeyCounter++;
                var logElem = 
                    <span key={this.itemKeyCounter} style={style}>
                        {this.props.timestamp ? "[" + timestamp() + "] " : ""}{mark}{error.toString()}:<br/>
                        <span style={{fontStyle: "italic"}}>{data.toString()}</span><br/>
                    </span>;
                if(!this.props.reverseOrder) {
                    // последнее событие в конец массива
                    this.state.dataFlow.push(logElem);
                } else {
                    // последнее событие в начало массива
                    this.state.dataFlow.splice(0, 0, logElem);
                }
                // перерисовать
                this.setState({dataFlow: this.state.dataFlow});
            }
        }.bind(this);
        this.props.babbler.on(Babbler.Event.DATA_ERROR, this.dataErrorListener);
    },
    
    componentWillUnmount: function() {
        // почистим слушателей
        this.props.babbler.removeListener(Babbler.Event.DATA, this.dataListener);
        this.props.babbler.removeListener(Babbler.Event.DATA_ERROR, this.dataParseErrorListener);
    },
    
    render: function() {
        return (
            <div style={this.props.style}>
                {this.state.dataFlow}
            </div>
        );
    },
});

// отправляем компонент на публику
module.exports = BabblerDataFlow;

