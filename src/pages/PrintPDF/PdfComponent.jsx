import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import DataComponent from "./DataComponent";

class PdfComponent extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          content={() => this.componentRef}
          trigger={() => (
            <div className="print_button">
              <Button>
                {" "}
                <FontAwesomeIcon icon={faPrint} />
              </Button>
            </div>
          )}
        />
        <DataComponent
          {...this.props}
          ref={(response) => (this.componentRef = response)}
        />
      </div>
    );
  }
}

export default PdfComponent;
