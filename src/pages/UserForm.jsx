import React, { useEffect, useState, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useParams } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FullLoader } from '../components/Loader';
import debounce from 'lodash.debounce';
import {
  FetchFormList,
  GetFromListColumns,
} from '../helpers/users/profile/userFroms/FetchFormList';

const UserForm = () => {
  const navigate = useNavigate();
  const { userId, userRole } = useParams();
  const [search, setSearch] = useState('');
  let columns = GetFromListColumns(navigate);
  let {
    formList: forms,
    isLoading,
    error,
  } = FetchFormList({ userId, userRole, search });

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearchResult = useMemo(() => {
    return debounce(handleInputChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearchResult.cancel();
    };
  });

  return (
    <>
      <div id="main" className="main-class">
        <section className="mainsection">
          <FullLoader loading={isLoading} />
          <Container>
            <div className="admin-wrapper">
              <div className="sec-column">
                <div className="data-search me-3">
                  <Form.Group
                    className="d-flex"
                    style={{ position: 'relative' }}
                  >
                    <div className="user-search">
                      <img src="./img/search-icon-light.svg" alt="" />
                    </div>
                    <Form.Control
                      className="searchBox"
                      type="text"
                      placeholder="Search"
                      name="search"
                      onChange={debouncedSearchResult}
                    />
                  </Form.Group>
                </div>
                <div className="entry-container">
                  <div className="user-management-sec user-form">
                    {error === null ? (
                      forms.length > 0 ? (
                        <>
                          <ToolkitProvider
                            keyField="name"
                            data={forms}
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
                          No Forms Available
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

export default UserForm;
