import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FullLoader } from '../components/Loader';
import {
  FetchTrainingList,
  GetTrainingListColumns,
} from '../helpers/users/profile/userTrainings/FetchTrainingList';

const UserTraining = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  let columns = GetTrainingListColumns(navigate);
  let { trainingList: trainings, isLoading, error } = FetchTrainingList(userId);

  return (
    <>
      <div id="main" className="main-class">
        <section className="mainsection">
          <FullLoader loading={isLoading} />
          <Container>
            <div className="admin-wrapper">
              <div className="sec-column">
                <div className="entry-container">
                  <div className="user-management-sec user-training">
                    {error === null ? (
                      trainings.length > 0 ? (
                        <>
                          <ToolkitProvider
                            keyField="name"
                            data={trainings}
                            columns={columns}
                          >
                            {(props) => (
                              <>
                                <BootstrapTable
                                  {...props.baseProps}
                                  pagination={paginationFactory()}
                                />
                              </>
                            )}
                          </ToolkitProvider>
                        </>
                      ) : (
                        <p
                          style={{
                            textAlign: 'center',
                            color: '#888',
                            fontWeight: 'normal',
                            fontSize: '18px',
                          }}
                        >
                          No Trainings Available
                        </p>
                      )
                    ) : (
                      <p
                        style={{
                          textAlign: 'center',
                          color: '#888',
                          fontWeight: 'normal',
                          fontSize: '18px',
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default UserTraining;
