import React, { Component } from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    ListInput,
    Row,
    Col,
    Button
} from 'framework7-react';

class HomePage extends Component {

  constructor(props) {
    super(props)
      this.state = {
        weight: 100,
        age: 28,
        height: 180,
        goal: 80,
        intake: 2000
      }

      this.handleChange = this.handleChange.bind(this)
      this.clearInput = this.clearInput.bind(this)
      this.calculate = this.calculate.bind(this)
      this.calculateWeightLoss = this.calculateWeightLoss.bind(this)
      this.addDays = this.addDays.bind(this)
      this.calculateTDEE = this.calculateTDEE.bind(this)
      this.parseMonth = this.parseMonth.bind(this)
      this.checkValues = this.checkValues.bind(this)

  }

  handleChange(event) {
    event.persist()
    this.setState({[event.target.name]: event.target.value})
  }

  clearInput(event) {
    this.setState({[event.target.name]: ""})
  }

  calculate() {
    //do input checks first
    this.calculateWeightLoss()
  }

  //Adds specified number of days to current date
  addDays(date, days) {
    return new Date(date.setTime( date.getTime() + days * 86400000 ))
  }

  doChecks() {

  }

  calculateTDEE(weight, height, age) {

    let bmr = 0

    // check if gender is female
    if (this.state.gender == 0) {
      bmr = (10*weight) + (6.25*height) - (5*age) - 161
    } else {
      bmr = (10*weight) + (6.25*height) - (5*age) + 5
    }

    switch (parseInt(this.state.activityLevel)) {
      case 1: return parseInt(bmr*1.20)
      case 2: return parseInt(bmr*1.375)
      case 3: return parseInt(bmr*1.550)
      case 4: return parseInt(bmr*1.725)
      case 5: return parseInt(bmr*1.900)
      default: return parseInt(bmr*1.20)
    }

  }

  parseMonth(month) {
    switch (month) {
      case 0: return "Jan"
      case 1: return "Feb"
      case 2: return "Mar"
      case 3: return "Apr"
      case 4: return "May"
      case 5: return "Jun"
      case 6: return "Jul"
      case 7: return "Aug"
      case 8: return "Sep"
      case 9: return "Oct"
      case 10: return "Nov"
      case 11: return "Dec"
      default: return "N/A"
    }
  }

  //checks input and throws errors in case some values are inadequate
  checkValues() {
    if (this.state.weight < 40 || this.state.weight > 600) {
      this.setState({errorMessage: "Weight must be between 40 and 600."})
      return false
    }

    if (this.state.weight == null || this.state.weight == "" || isNaN(this.state.weight)) {
      this.setState({errorMessage: "Weight input cannot be empty!"})
      return false
    }

    if (this.state.age == null || this.state.age == "" || isNaN(this.state.age)) {
      this.setState({errorMessage: "Age input cannot be empty!"})
      return false
    }

    if (this.state.age < 10 || this.state.age > 110) {
      this.setState({errorMessage: "Age must be between 10 and 110."})
      return false
    }

    if (this.state.height == null || this.state.height == "" || isNaN(this.state.height)) {
      this.setState({errorMessage: "Height cannot be empty."})
      return false
    }

    if (this.state.height < 100 || this.state.height > 250) {
      this.setState({errorMessage: "Height must be between 100 and 250."})
      return false
    }

    if (this.state.goal > this.state.weight) {
      this.setState({errorMessage: "Goal weight must be lower than current weight."})
      return false
    }

    //there needs to be a functionality that calculates goal weight based on BMI if field is left empty
    if (this.state.goal == null || this.state.goal == "" || isNaN(this.state.goal)) {
      this.setState({errorMessage: "Goal weight cannot be empty."})
      return false
    }

    if (this.state.goal < 30 || this.state.goal > 500) {
      this.setState({errorMessage: "Goal weight must be between 30 and 500."})
      return false
    }

    if (this.state.intake < 1000) {
      this.setState({errorMessage: "Calorie intake of less than 1000 is very unhealthy, please don't do it."})
      return false
    }

    if (this.state.intake > 15000) {
      this.setState({errorMessage: "Calorie intake can't be higher than 15000."})
      return false
    }

    if (this.state.intake == null || this.state.intake == "" || isNaN(this.state.intake)) {
      this.setState({errorMessage: "Calorie intake can't be empty!"})
      return false
    }

    if (this.calculateTDEE(this.state.weight, this.state.height, this.state.age) < this.state.intake) {
      this.setState({errorMessage: "Your calorie intake is too high to lose weight. Reduce intake or increase excersise. Your intake needs to be lower than " + this.calculateTDEE(this.state.weight, this.state.height, this.state.age) + " kcal to lose weight." })
      return false
    }

    return true

  }

  calculateWeightLoss() {
    const labels = []
    const data = []
    const tableData = []
    let date = new Date()
    let finishDate = new Date()
    let goalAchieved = false

    let iterations = 0

    let weight = parseFloat(this.state.weight)
    let age = parseFloat(this.state.age)

    // put first label and data before calculating
    labels.push(this.parseMonth(date.getMonth()) + " '" + date.getFullYear().toString().slice(2))
    data.push(weight.toFixed(1))

    if(!this.checkValues()) {
      this.openCustomDialog(this.state.errorMessage)
    }

  // first make sure that TDEE is higher than intake
  if ((this.calculateTDEE(weight, this.state.height, age) > this.state.intake) && this.checkValues()) {
    while(parseFloat(weight) >= parseFloat(this.state.goal-3)) {
      // calculate caloric deficit by subtracting intake from TDEE
      let deficit = this.calculateTDEE(weight, this.state.height, age) - this.state.intake;
      // calculate deficit in KG by dividing calories/7700
      let kgDeficit = deficit/7700
      // set new weight after subtracting deficit
      weight = weight - kgDeficit
      // add a day?
      date = this.addDays(date, 1)
      // set age one day higher
      age = age + 1/365;

      iterations++

      //on the 14th day of each month add data to arrays that will be displayed on chart
      if(date.getDate() == 14) {
        labels.push(this.parseMonth(date.getMonth()) + " '" + date.getFullYear().toString().slice(2))
        data.push(weight.toFixed(1))
        tableData.push({
          label: this.parseMonth(date.getMonth()) + " " + date.getFullYear(),
          data: weight.toFixed(1)
        })
      }

      if (this.calculateTDEE(weight, this.state.height, age) <= this.state.intake) {
        this.openCustomDialog("You can't reach your goal weight with given calorie intake and level of activity. The lowest weight you will be able to achieve is " + weight.toFixed(1) + " kg")
        weight = 0; //this needs to be here to break out of while loop
    	}

      if ((parseFloat(weight) < parseFloat(this.state.goal)) && !goalAchieved) {
        goalAchieved = true
        finishDate = date
      }

    }

    if (parseFloat(weight) < parseFloat(this.state.goal-3)) {
      this.$f7router.navigate('/results/', {
          props: {
            data: this.generateData(labels, data),
            finishDate: finishDate,
            tableData: tableData
            }
          })
    }

      } else {
        // show warning that TDEE is lower than intake
      }


  }

  generateData(labels, data) {

    // generate fake data for second dataset
    const fakeGoalData = []
    data.map(() => fakeGoalData.push(80))

    return {
      labels: labels,
      datasets: [{
          label: 'Weight',
          data: data,
          backgroundColor: [
              'transparent'
          ],
          borderColor: [
              '#FDAB18'
          ],
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 20,
          cubicInterpolationMode: 'default'
      },
      {
          label: 'Goal',
          data: fakeGoalData,
          fill: false,
          borderColor: [
              'rgba(255,255,255,1)'
          ],
          borderWidth: 1,
          borderDash: [0],
          borderColor: [
              '#5A192E'
          ],
          pointRadius: 0,
          pointHitRadius: 20,
          cubicInterpolationMode: 'default'
      }
    ]
    }
  }

  openCustomDialog(message) {
    const self = this;
    self.$f7.dialog.alert(message, "Error")
  }

render() {
  return (
    <Page colorTheme="cavaliers-yellow">
      <Navbar colorTheme="cavaliers-yellow">
        <NavTitle>Weight loss estimator</NavTitle>
      </Navbar>
      <BlockTitle style={{marginLeft: "20px"}}>Enter your stats</BlockTitle>
        <List inset>
          <ListInput
            label="Current weight (kg)"
            type="number"
            placeholder="105 kg"
            name="weight"
            onChange={this.handleChange}
            value={this.state.weight}
            onInputClear={this.clearInput}
          />
          <ListInput
            label="Age"
            type="number"
            placeholder="29"
            name="age"
            onChange={this.handleChange}
            value={this.state.age}
            onInputClear={this.clearInput}
          />
          <ListInput
            label="Height (cm)"
            type="number"
            placeholder="179"
            name="height"
            onChange={this.handleChange}
            value={this.state.height}
            onInputClear={this.clearInput}
          />
          <ListInput
            label="Goal weight (kg)"
            type="number"
            placeholder="80"
            name="goal"
            onChange={this.handleChange}
            value={this.state.goal}
            onInputClear={this.clearInput}
          />
          <ListInput
            label="Daily intake (kcal)"
            type="number"
            placeholder="2100"
            name="intake"
            onChange={this.handleChange}
            value={this.state.intake}
            onInputClear={this.clearInput}
          />
          <ListInput
            label="Gender"
            type="select"
            defaultValue="1"
            placeholder="Please choose..."
            name="gender"
            onChange={this.handleChange}
            value={this.state.gender}
            >
            <option value="1">Male</option>
            <option value="0">Female</option>
          </ListInput>
          <ListItem title="Activity level" smartSelect smartSelectParams={{closeOnSelect: true}} >
            <select
              name="activityLevel"
              defaultValue="1"
              onChange={this.handleChange}
              value={this.state.activityLevel}

              >
              <option value="1">Couch potato</option>
              <option value="2">Light activity</option>
              <option value="3">Moderate activity</option>
              <option value="4">Heavy activity</option>
              <option value="5">Athlete</option>
            </select>
          </ListItem>
        </List>

        {/*<Block strong inset>
          <p>Click calculate to see the results.</p>
        </Block>*/}

      <Block>
        <Row>
          <Col>
            <Button fill round large onClick={this.calculate}>Calculate</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button href={"/about/"} style={{marginTop: "15px"}}>About</Button>
          </Col>
        </Row>
      </Block>

    </Page>
  )
}

}

export default HomePage
