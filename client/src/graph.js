import React, { Component } from "react";
import { Chart } from "react-google-charts";

import './graph.css';

class Graph extends Component {
    constructor(props){
        /* Calls the Component constructor */
        super(props);

        this.state = { display: 0 };
        this.switchView = this.switchView.bind(this);
    }

    /* For averages graph, creates hashmap with data and averages score per day */
    setAverages(values){
        let avgBucket = new Map();

        let dateSum = new Map();
        let dateCount = new Map();
        for (let i = 0; i < values.length; i++){
            let date = new Date((values[i][0]).replace('T', ' '));
            // Correct timezone of date
            date = new Date(date.getTime() + Math.abs(date.getTimezoneOffset()*60000))
            let dateStr = (date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear();

            if(!dateSum.has(dateStr)){
                dateSum.set(dateStr, values[i][1]);
                dateCount.set(dateStr, 1);
            }
            else {
                let sum = dateSum.get(dateStr) + values[i][1];
                let count = dateCount.get(dateStr) + 1;
                dateSum.set(dateStr, sum);
                dateCount.set(dateStr, count)
            }

        }
        for (let key of dateSum.keys()) {
            avgBucket.set(key, dateSum.get(key) / dateCount.get(key))
        }

        return avgBucket;
    }

    /* For histogram graph, creates a hashmap with Tweet # and Sentiment value */
    setHistories(values){
        let histBucket = new Map();

        for (let i = 0; i < values.length; i++){
            histBucket.set("Tweet " + (i).toString(), values[i][1]);
        }

        return histBucket;
    }

    /* For positive negative sentiment value graph */
    setPosNeg(values){
        const posData = [];
        const negData = [];
        const chartData = [];
        for (let i = 0; i < values.length; i++){
            if (values[i][1] > 0){
                posData.push(values[i]);
            }
            else{
                negData.push(values[i]);
            }
        }

        let posHash = this.setAverages(posData);
        let negHash = this.setAverages(negData);

        let posSentiments = this.createGraphData(posHash);
        let negSentiments = this.createGraphData(negHash);

        for (let i = 0; i < posSentiments.length; i++){
            chartData.push([i, posSentiments[i][1], negSentiments[i][1]]);
        }

        return chartData.sort(function(a, b){return a[0] - b[0]});
    }

    /* Utility function that converts Hashmap of data into graph data */
    createGraphData(bucket){
        const chartData = [];
        for (const [key, value] of bucket.entries()){
            chartData.push([key, value]);
        }

        return chartData.sort(function(a, b){return a[0] - b[0]});
    }

    /* Draws the average chart */
    drawAvgsChart(values){
        const chartHeader = [["Date", "Sentiment Value"]];
        let data = chartHeader.concat(this.createGraphData(this.setAverages(values)));
        if(values.length === 0){
            data = chartHeader.concat([[0, NaN]]);
            alert("No tweets with this query");
        }

        let options = {
           height: window.innerHeight * 0.7,
           width: window.innerWidth * 0.7,
           hAxis: {
                title: 'Date',
           },
           vAxis: {
                title: 'Sentiment Value',
           },
           title: "Sentiment Analysis Averages",
           legend: { position: "none" },
           backgroundColor: {fill: 'transparent'},
        };
        return (<div data-testid="oneLine">
                    <Chart className = "chart"
                    chartType = "LineChart"
                    data = {data}
                    options = {options}
                    legendToggle
                    /></div>);
    }

    /* Draws the histogram chart */
    drawHistogramChart(values){
        const chartHeader = [['Tweets', 'Sentiment Value']];
        let data = chartHeader.concat(this.createGraphData(this.setHistories(values)));
        if (values.length === 0){
            data = chartHeader.concat([[0, NaN]]);
            alert("No tweets with this query");
        }

        let options = {
           height: window.innerHeight * 0.7,
           width: window.innerWidth * 0.7,
           hAxis: {
                title: 'Sentiment Value',
           },
           vAxis: {
                title: 'Tweets',
           },
           title: "Sentiment Analysis Histogram",
           legend: {position: "none"},
           backgroundColor: {fill: 'transparent'},
        };
        return (<div data-testid="histogram">
                    <Chart className = "chart"
                    chartType = "Histogram"
                    data = {data}
                    options = {options}
                    legendtoggle
                    /></div>);
    }

    /* Draws the positive negative chart */
    drawPosNegChart(values){
        const chartHeader = [["Date", "Positive Sentiment Value", "Negative Sentiment Value"]];
        let data = chartHeader.concat(this.setPosNeg(values));
        if(values.length === 0){
            data = chartHeader.concat([[0, NaN, NaN]]);
            alert("No tweets with this query");
        }

        let options = {
           height: window.innerHeight * 0.7,
           width: window.innerWidth * 0.7,
           hAxis: {
                title: 'Date',
           },
           vAxis: {
                title: 'Sentiment Value',
           },
           title: "Sentiment Positive Negative Averages",
           legend: { position: "bottom" },
           backgroundColor: {fill: 'transparent'},
        };
        return (<div data-testid="twoLine">
                    <Chart className = "chart"
                    chartType = "LineChart"
                    data = {data}
                    options = {options}
                    legendToggle
                    /></div>);
    }

    /* Handles the on click position */
    switchView() {
        this.setState({ display: (this.state.display + 1) % 3 });
    }

    /* Calls the proper graph based on the current position */
    displayGraph(values) {
        if (this.state.curr_pos === 0){
            return this.drawAvgsChart(values);
        }
        else if (this.state.curr_pos === 1){
            return this.drawHistogramChart(values);
        }
        else if (this.state.curr_pos === 2){
            return this.drawPosNegChart(values);
        }
    }

    /* The chartData creates the data for the graph */
    render() {
        let values;
        if (this.props.data) {
            values = this.props.data.map((s) => [s.timestamp, s.score]);
        } else {
            values = [];
        }
        return (
            <div className="chartcontainer">
                {this.displayGraph(values)}
                <button className="graphButton" type="submit" onClick={this.switchView}/>
            </div>
        );
    }
}

export default Graph;
