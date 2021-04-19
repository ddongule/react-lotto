import React from 'react';
import './style.scss';

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.focusRef = React.createRef();
  }

  onInputFocus() {
    this.focusRef.current.focus();
  }

  render() {
    const { customClass, onChangeNumber, ...attributes } = this.props;
    return (
      <input
        ref={this.focusRef}
        onChange={onChangeNumber}
        className={`number-input ${customClass}`}
        type='number'
        {...attributes}
        required
      />
    );
  }
}

export default NumberInput;
