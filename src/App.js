import React from 'react';
import Modal from './components/modal';
import MoneyInput from './components/money-input';
import Receipt from './components/receipt';
import WinningNumber from './components/winning-number';
import { LOTTERY_BALL_LENGTH, MAX_LOTTO_NUMBER, MIN_LOTTO_NUMBER } from './constants/number';
import getRandomNumber from './utils/random-number';
import Canvas from './components/canvas';
import TimeLeft from './components/time-left';
import muyaho from './sound/muyaho.mp3';
import './style.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMoneyInputValid: false,
      isModalOpen: false,
      isLoading: false,
      moneyAmount: 0,
      bonusNumber: 0,
      receipt: [],
      winningNumber: [],
    };
    this.MoneyInputRef = React.createRef();
    this.audio = new Audio(muyaho);
  }

  handleMoneySubmit(money) {
    this.setState({
      isMoneyInputValid: true,
      moneyAmount: money,
    });

    if (this.state.isMoneyInputValid) {
      this.audio.play();
    }
  }

  handleWinningNumberSubmit(winningNumbers, bonusNumber) {
    this.setState({
      winningNumber: winningNumbers,
      bonusNumber: bonusNumber,
    });
  }

  handleModalButtonClick() {
    this.setState({
      isModalOpen: true,
    });
  }

  handleResetButtonClick() {
    this.setState({
      isMoneyInputValid: false,
      isModalOpen: false,
    });
    this.MoneyInputRef.current.resetMoneyForm();
  }

  handleModalCloseButtonClick() {
    this.setState({
      isModalOpen: false,
    });
  }

  makeAutoTicket() {
    const uniqueTicket = new Set();
    while (uniqueTicket.size !== LOTTERY_BALL_LENGTH) {
      uniqueTicket.add(getRandomNumber(MIN_LOTTO_NUMBER, MAX_LOTTO_NUMBER));
    }

    return [...uniqueTicket];
  }

  makeReceipt(ticketCount) {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({
        isLoading: false,
        receipt: [...Array(ticketCount)].map(() => this.makeAutoTicket()),
      });
    }, 1000);
  }

  render() {
    return (
      <>
        {this.state.isMoneyInputValid && <TimeLeft></TimeLeft>}
        {this.state.isMoneyInputValid && (
          <audio controls autoPlay hidden>
            <source src={muyaho} type='audio/mp3' />
          </audio>
        )}
        <Canvas />
        <div className='title'>슈퍼 로또</div>
        <MoneyInput
          ref={this.MoneyInputRef}
          onHandleSubmit={(money, ticketCount) => {
            this.handleMoneySubmit(money);
            this.makeReceipt(ticketCount);
          }}
        ></MoneyInput>
        {this.state.isLoading && <div className='circle gelatine'>$</div>}
        {!this.state.isLoading && this.state.isMoneyInputValid && (
          <>
            <Receipt receipt={this.state.receipt}></Receipt>
            <WinningNumber
              onHandleSubmit={(winningNumbers, bonusNumber) =>
                this.handleWinningNumberSubmit(winningNumbers, bonusNumber)
              }
              onModalButtonClick={() => this.handleModalButtonClick()}
            ></WinningNumber>
          </>
        )}
        {!this.state.isLoading && this.state.isModalOpen && (
          <>
            <Modal
              winningNumber={this.state.winningNumber}
              bonusNumber={this.state.bonusNumber}
              receipt={this.state.receipt}
              moneyAmount={this.state.moneyAmount}
              onResetButtonClick={() => this.handleResetButtonClick()}
              onModalCloseButtonClick={() => this.handleModalCloseButtonClick()}
            ></Modal>
          </>
        )}
      </>
    );
  }
}

export default App;
