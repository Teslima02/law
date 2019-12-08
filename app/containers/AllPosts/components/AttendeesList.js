import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { FormControlLabel, Icon, List } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import AddButton from './AddButton';
import * as Selectors from '../selectors';
import * as AttendeesSelectors from '../../Atendee/selectors';
import * as Actions from '../actions';
import * as AttendeesActions from '../../Atendee/actions';
import LoadingIndicator from '../../../components/LoadingIndicator';

const AttendeesList = props => {
  const {
    getAttendeesAction,
    allAttendees,
    getAttendeesListAction,
    getAttendeesList,
    loading,
    error,
  } = props;

  useEffect(() => {
    getAttendeesListAction();
    getAttendeesAction();
  }, []);

  console.log(allAttendees, 'allAttendees');
  console.log(getAttendeesList, 'getAttendeesList');

  const columns = [
    {
      name: '_id',
      label: 'S/N',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta) => {
          if (value === '') {
            return '';
          }
          return (
            <FormControlLabel
              label={tableMeta.rowIndex + 1}
              control={<Icon />}
            />
          );
        },
      },
    },
    {
      name: 'title',
      label: 'Tittle',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'content',
      label: 'Content',
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const options = {
    filterType: 'checkbox',
    responsive: 'scrollMaxHeight',
    selectableRows: 'none',
    customToolbar: () => <AddButton />,
  };

  if (loading) {
    return <List component={LoadingIndicator} />;
  }

  return (
    <div>
      <MUIDataTable
        title="All Talks"
        data={getAttendeesList.users}
        columns={columns}
        options={options}
      />
    </div>
  );
};

AttendeesList.propTypes = {
  getAttendeesListAction: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  getAttendeesAction: PropTypes.func,
  getAttendeesList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  allAttendees: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  allAttendees: AttendeesSelectors.makeSelectGetAllAttendees(),
  loading: Selectors.makeSelectLoading(),
  error: Selectors.makeSelectError(),
  getAttendeesList: Selectors.makeSelectGetAttendeesList(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAttendeesListAction: () => dispatch(Actions.getAttendeesList()),
    getAttendeesAction: () => dispatch(AttendeesActions.allAttendees()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  memo,
)(AttendeesList);
