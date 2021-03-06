import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { FormControlLabel, Icon, List } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import AddAttendee from './AddAttendee';
import * as Selectors from '../selectors';
import * as Actions from '../actions';
import LoadingIndicator from '../../../components/LoadingIndicator';
import AttendeesDialog from './AttendeesDialog';

const AttendeesList = props => {
  const {
    match,
    openViewAttendees,
    getTalkDetails,
    getAttendeesListAction,
    getAttendeesList,
    loading,
    error,
  } = props;

  useEffect(() => {
    getAttendeesListAction(match.params.id);
    openViewAttendees(match.params.id);
  }, []);

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
      name: 'firstName',
      label: 'First Name',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'email',
      label: 'Email',
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
    customToolbar: () => <AddAttendee />,
  };

  if (loading) {
    return <List component={LoadingIndicator} />;
  }

  return (
    <div>
      <MUIDataTable
        title="All Talks"
        data={getAttendeesList.talk && getAttendeesList.talk.users}
        columns={columns}
        options={options}
      />

      <AttendeesDialog
        allAttendees={getAttendeesList.attendees}
        getTalkDetails={getTalkDetails}
      />
    </div>
  );
};

AttendeesList.propTypes = {
  openViewAttendees: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  getTalkDetails: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  getAttendeesListAction: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  getAttendeesList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  loading: Selectors.makeSelectLoading(),
  error: Selectors.makeSelectError(),
  getAttendeesList: Selectors.makeSelectGetAttendeesList(),
  getTalkDetails: Selectors.makeSelectAttendeesView(),
});

function mapDispatchToProps(dispatch) {
  return {
    openViewAttendees: evt => dispatch(Actions.viewAttendees(evt)),
    getAttendeesListAction: evt => dispatch(Actions.getAttendeesList(evt)),
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
