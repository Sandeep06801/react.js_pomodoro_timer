import React from 'react';
import './App.css';
import timerCompleteSound from './remainder.mp3';

class PomodoroTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      intervalType: 'work',
      workTime: 1500,
      breakTime: 300, 
      time: 1500, 
      isRunning: false,
      isTimerComplete: false,
    };
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  startTimer = () => {
    if (this.state.isRunning) return;
    const timer = setInterval(this.tick, 1000);
    this.setState({ timer, isRunning: true });
  };
  stopTimer = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null, isRunning: false });
  };
  resetTimer = () => {
    this.stopTimer();
    this.setState({
      intervalType: 'work',
      time: this.state.workTime,
      isRunning: false,
      isTimerComplete: false,
    });
  };
  switchInterval = () => {
    this.setState((prevState) => {
      const intervalType = prevState.intervalType === 'work' ? 'break' : 'work';
      const time = intervalType === 'work' ? prevState.workTime : prevState.breakTime;
      return { intervalType, time, isRunning: true };
    });
  };
  tick = () => {
    this.setState((prevState) => {
      const time = prevState.time - 1;

      if (time < 0) {
        clearInterval(this.state.timer);
        this.switchInterval();
        this.playTimerCompleteSound();
      } else {
        this.setState({ time });
      }
    });
  };
  playTimerCompleteSound = () => {
    const audio = new Audio(timerCompleteSound);
    let playCount = 0;
    const playSound = () => {
        playCount++;
        if (playCount <= 3) {
          audio.play();
          playCount++;
        } else {
          audio.removeEventListener('ended', playSound);
        }
    };
    audio.addEventListener('ended', playSound);
    audio.play();
  };
  handleWorkTimeChange = (event) => {
    const value = event.target.value;
    const timeInSeconds = this.parseTimeToSeconds(value);
    this.setState({ workTime: timeInSeconds });
    if (this.state.intervalType === 'work') {
      this.setState({ time: timeInSeconds });
    }
  };

  handleBreakTimeChange = (event) => {
    const value = event.target.value;
    const timeInSeconds = this.parseTimeToSeconds(value);
    this.setState({ breakTime: timeInSeconds });
    if (this.state.intervalType === 'break') {
      this.setState({ time: timeInSeconds });
    }
  };

  parseTimeToSeconds = (timeString) => {
    const timeArray = timeString.split(":").map((part) => parseInt(part, 10));
    const minutes = timeArray[0] || 0;
    const seconds = timeArray[1] || 0;
    return minutes * 60 + seconds;
  };
  render() {
    const { time, intervalType, isRunning } = this.state;
    const formattedTime = this.formatTime(time);
    return (
      <div className="App">
        <h1>Pomodoro Timer</h1>
        <div className="timer">
          <div className={`time ${intervalType}`}>{formattedTime}</div>
          <div className="controls">
            {isRunning ? (
              <button onClick={this.stopTimer}>Stop</button>
            ) : (
              <button onClick={this.startTimer}>Start</button>
            )}
            <button onClick={this.resetTimer}>Reset</button>
          </div>
        </div>
        <div className="interval-options">
          <div>
            <label>
              Work Interval (minutes:seconds):
              <input
                type="text"
                value={this.formatTimeInput(this.state.workTime)}
                onChange={this.handleWorkTimeChange}
              />
            </label>
            <button onClick={() => this.setState({ intervalType: 'work', time: this.state.workTime })}>Set Work Time</button>
          </div>
          <div>
            <label>
              Break Interval (minutes:seconds):
              <input
                type="text"
                value={this.formatTimeInput(this.state.breakTime)}
                onChange={this.handleBreakTimeChange}
              />
            </label>
            <button onClick={() => this.setState({ intervalType: 'break', time: this.state.breakTime })}>Set Break Time</button>
          </div>
        </div>
      </div>
    );
  }

  formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  formatTimeInput = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
}

export default PomodoroTimer;