import React, { createRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NumberInput from '../util-component/number-input/index';
import Button from '../util-component/button/index';
import { BONUS_BALL_LENGTH, LOTTERY_BALL_LENGTH } from '../../constants/number';
import './style.scss';

class WinningNumber extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      inputArray: [...new Array(LOTTERY_BALL_LENGTH + BONUS_BALL_LENGTH)],
    };
  }

  onWinningNumberSubmit(e) {
    e.preventDefault();

    // TODO: 깔끔한 방법 찾기
    const winningNumbers = [];
    e.target
      .querySelectorAll('.winning-number')
      .forEach((winningNumberInput) => winningNumbers.push(Number(winningNumberInput.value)));
    const bonusNumber = Number(e.target.querySelector('.bonus-number').value);

    this.props.onHandleSubmit(winningNumbers, bonusNumber);
    this.props.onModalButtonClick();
  }

  onChangeWinningNumber(e, index) {
    if (this.state.inputArray.includes(e.target.value)) {
      alert('다시너어줘!!!!!!');
      e.target.value = '';
      return;
    }
    const newArray = [...this.state.inputArray];
    newArray[index] = e.target.value;

    this.setState({
      inputArray: newArray,
    });
  }

  render() {
    return (
      <form onSubmit={(e) => this.onWinningNumberSubmit(e)}>
        <div className='winning-number-form'>
          {[...this.state.inputArray].map((number, index) => {
            return (
              <NumberInput
                ref={this.inputRef}
                min='1'
                max='45'
                key={uuidv4()}
                customClass={'winning-number'}
                value={number && number}
                onChangeNumber={(e) => this.onChangeWinningNumber(e, index)}
              />
            );
          })}
          <NumberInput min='1' max='45' key={uuidv4()} customClass={'bonus-number'} />
        </div>
        <Button buttonText='결과 확인하기'></Button>
      </form>
    );
  }
}

export default WinningNumber;
