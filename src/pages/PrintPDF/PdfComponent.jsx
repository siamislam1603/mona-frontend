import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import DataComponent from './DataComponent';

class PdfComponent extends React.Component {
  render() {
    console.log("The props",this.props)

    return (
      <div>
        <DataComponent
          {...this.props}
          ref={(response) => (this.componentRef = response)}
        />
        <div className='bottom_button'>
          {/* <Button variant="outline">View Here</Button> */}
          <ReactToPrint
            content={() => this.componentRef}
            trigger={() => <Button>Save PDF</Button>}
            pageStyle="print"
            documentTitle=''
          />
        </div>
      </div>
    );
  }
}

export default PdfComponent;
