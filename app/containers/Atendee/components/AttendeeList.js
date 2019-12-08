import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { makeStyles, FormControlLabel, Icon, List } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import AddButton from './AddButton';
import * as Selectors from '../selectors';
import * as Actions from '../actions';
import LoadingIndicator from '../../../components/LoadingIndicator';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

const AttendeeList = props => {
  const {
    getAllAttendees,
    loading,
    error,
    openEditPostDialog,
    dispatchDeletePostAction,
  } = props;

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
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: '_id',
      label: 'Edit',
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => {
          // eslint-disable-next-line no-underscore-dangle
          const Post = getAllAttendees.find(post => value === post._id);

          if (value === '') {
            return '';
          }
          return (
            <FormControlLabel
              label="Edit"
              control={<Icon>create</Icon>}
              onClick={evt => {
                evt.stopPropagation();
                openEditPostDialog(Post);
              }}
            />
          );
        },
      },
    },
    {
      name: '_id',
      label: 'Delete',
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => {
          // eslint-disable-next-line no-underscore-dangle
          const Post = getAllAttendees.find(post => value === post._id);

          if (value === '') {
            return '';
          }
          return (
            <FormControlLabel
              label="Delete"
              control={<Icon>delete</Icon>}
              onClick={evt => {
                evt.stopPropagation();
                dispatchDeletePostAction(Post);
              }}
            />
          );
        },
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
        title="All Attendees"
        data={getAllAttendees}
        columns={columns}
        options={options}
      />
    </div>
  );
};

AttendeeList.propTypes = {
  getAllAttendees: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  dispatchDeletePostAction: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  openEditPostDialog: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

const mapStateToProps = createStructuredSelector({
  loading: Selectors.makeSelectLoading(),
  error: Selectors.makeSelectError(),
  getAllAttendees: Selectors.makeSelectGetAllAttendees(),
  postDialog: Selectors.makeSelectAttendeeDialog(),
});

function mapDispatchToProps(dispatch) {
  return {
    openEditPostDialog: evt => dispatch(Actions.openEditAttendeeDialog(evt)),
    dispatchDeletePostAction: evt => dispatch(Actions.deleteAttendee(evt)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AttendeeList);
