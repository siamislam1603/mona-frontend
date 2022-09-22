import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import DataComponent from './DataComponent';
class PdfComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageShow: false
    };
  }
  setInPrintPreview(status){
    this.setState({...this.state, imageShow: status});
  }
  render() {
    return (
      <div>
        <DataComponent
          {...this.props}
          imageShow={this.state.imageShow}
          ref={(response) => (this.componentRef = response)}
        />
        <div className='bottom_button'>
          {/* <Button variant="outline">View Here</Button> */}
          <ReactToPrint
            onBeforePrint={() => this.setInPrintPreview(true)}
            content={() => this.componentRef}
            trigger={() => 
              <Button>Save PDF</Button>
            }
            pageStyle="print"
            documentTitle=''
            onAfterPrint={() => this.setInPrintPreview(false)}

          />
        </div>
      </div>
    );
  }
}

export default PdfComponent;
