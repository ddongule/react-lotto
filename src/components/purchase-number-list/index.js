import React from 'react';
import ToggleButton from '../../utils/toggle';
class PurchaseNumberList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>구입한 로또 번호</p>
        <ToggleButton />
      </div>
    );
  }
}

export default PurchaseNumberList;
