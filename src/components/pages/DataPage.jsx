import React, { Component } from 'react';
import {Block, BlockTitle, List, ListInput, Page, Navbar, BlockHeader} from 'framework7-react'
import { Line } from 'react-chartjs-2';

const graphOptions = {
  maintainAspectRatio: false, //this will make the graph use assigned size
  scales: {
      yAxes: [{
          ticks: {
              beginAtZero:false
          },
          gridLines: {
            display: true,
            color: "#252525",
            drawBorder: false
          }
      }],
      xAxes: [{
          ticks: {
              beginAtZero:false
          },
          gridLines: {
            display: false,
            color: "#f7f7f7",
            drawBorder: false
          }
      }]

  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false,
    backgroundColor: '#f7f7f7',
    titleFontColor: '#8e8e93',
    titleFontSize: 12,
    bodyFontColor: '#000',
    bodyFontSize: 16,
    displayColors: false,
    borderColor: '#000',
    borderWidth: 0
  }
}

class DataPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: ""
    }

    this.handleChange = this.handleChange.bind(this)
    this.clearInput = this.clearInput.bind(this)
  }

  handleChange(event) {
    event.persist()
    console.log("handle change", event)
    this.setState({[event.target.name]: event.target.value})
  }

  clearInput(event) {
    console.log("clear input", event)
    this.setState({[event.target.name]: ""})
  }

  render() {
    return (
      <Page>
        <Navbar title="Results" backLink="Back"></Navbar>
        <Block style={{height: "100vw"}} id="chart-block">
        <Line
            data={this.props.data}
            options={graphOptions}
          />
      </Block>
      {/*<Block strong inset>
        <p>{"You might achieve your goal weight sometime in " + this.props.finishDate.getMonth() + " " + this.props.finishDate.getFullYear() + "!"}</p>
      </Block>*/}

      <Block>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th className="label-cell">Date</th>
                <th className="numeric-cell">Weight</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.tableData.map(set => <tr key={set.label}>
                  <td className="label-cell">{set.label}</td>
                  <td className="numeric-cell">{set.data} kg</td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
      </Block>

      </Page>
    );
  }

}

export default DataPage;
