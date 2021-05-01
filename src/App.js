import React from 'react';
import Modal from './components/Modal';
import MoneyInput from './components/MoneyInput';
import Receipt from './components/Receipt';
import WinningNumber from './components/WinningNumber';
import { LOTTERY_BALL_LENGTH, MAX_LOTTO_NUMBER, MIN_LOTTO_NUMBER } from './constants/number';
import getRandomNumber from './utils/random-number';
import Canvas from './components/Canvas';
import TimeLeft from './components/TimeLeft';
import { hideScroll, showScroll } from './utils/scroll';
import muyahoAudio from './sound/muyaho.mp3';
import Lottie from 'react-lottie';
import coinSpin from './animation/coinSpin.json';
import './style.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMoneyInputValid: false,
      isModalOpen: false,
      isLoading: false,
      moneyAmount: 0,
      receipt: [],
      lotto: { numbers: [], bonus: 0 },
    };

    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleModalButtonClick = this.handleModalButtonClick.bind(this);
    this.moneyInputRef = React.createRef();
    this.audio = new Audio(muyahoAudio);
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
    if (typeof bonusNumber !== 'number') return;
    if (!winningNumbers instanceof Array) return;
    this.setState({
      lotto: {
        numbers: winningNumbers,
        bonus: bonusNumber,
      },
    });
  }

  handleModalButtonClick() {
    this.setState({
      isModalOpen: true,
    });

    hideScroll();
  }

  handleResetButtonClick() {
    this.setState({
      isMoneyInputValid: false,
      isModalOpen: false,
    });

    showScroll();
  }

  handleModalClose() {
    this.setState({
      isModalOpen: false,
    });

    showScroll();
  }

  makeAutoTicket() {
    const uniqueTicket = new Set();
    while (uniqueTicket.size !== LOTTERY_BALL_LENGTH) {
      uniqueTicket.add(getRandomNumber(MIN_LOTTO_NUMBER, MAX_LOTTO_NUMBER));
    }

    return [...uniqueTicket];
  }

  makeReceipt(ticketCount) {
    if (typeof ticketCount !== 'number') return;
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({
        isLoading: false,
        receipt: [...Array(ticketCount)].map(this.makeAutoTicket),
      });
    }, 1000);
  }

  componentWillUnmount() {
    this.audio = null;
  }
  render() {
    const receiptPage = (
      <>
        <Receipt receipt={this.state.receipt} />
        <WinningNumber
          onHandleSubmit={(winningNumbers, bonusNumber) =>
            this.handleWinningNumberSubmit(winningNumbers, bonusNumber)
          }
          onModalButtonClick={this.handleModalButtonClick}
        />
      </>
    );

    const modalPage = (
      <>
        <Modal
          winningNumber={this.state.lotto.numbers}
          bonusNumber={this.state.lotto.bonus}
          receipt={this.state.receipt}
          moneyAmount={this.state.moneyAmount}
          onResetButtonClick={this.handleResetButtonClick}
          onModalClose={this.handleModalClose}
        />
      </>
    );

    return (
      <div ref={this.bodyRef}>
        {this.state.isMoneyInputValid && (
          <>
            <TimeLeft />
            <audio controls autoPlay hidden>
              <source src={muyahoAudio} type='audio/mp3' />
            </audio>
          </>
        )}
        <Canvas />
        <div className='title'>슈퍼 로또</div>
        <MoneyInput
          ref={this.moneyInputRef}
          onHandleSubmit={(money, ticketCount) => {
            this.handleMoneySubmit(money);
            this.makeReceipt(ticketCount);
          }}
        />
        {this.state.isLoading ? (
          <Lottie
            speed={1}
            height='300px'
            width='300px'
            options={{
              animationData: coinSpin,
              loop: false,
            }}
          />
        ) : (
          !this.state.isLoading && (
            <>
              {this.state.isMoneyInputValid && receiptPage}
              {this.state.isModalOpen && modalPage}
            </>
          )
        )}
      </div>
    );
  }
}

export default App;
