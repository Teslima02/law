/**
 *
 * AllPosts
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Add } from '@material-ui/icons';
import reducer from '../reducer';
import saga from '../saga';
import * as Actions from '../actions';

const defaultToolbarStyles = {
  iconButton: {},
};

// eslint-disable-next-line react/prop-types
export function AddAttendee({ classes, openAddAttendeeDialogAction }) {
  useInjectReducer({ key: 'allPosts', reducer });
  useInjectSaga({ key: 'allPosts', saga });

  return (
    <React.Fragment>
      <Tooltip title="Add New Post">
        <IconButton
          className={classes.iconButton}
          onClick={openAddAttendeeDialogAction}
        >
          <Add className={classes.deleteIcon} />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

AddAttendee.prototypes = {
  classes: PropTypes.object.isRequired,
  openAddAttendeeDialogAction: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    openAddAttendeeDialogAction: () =>
      dispatch(Actions.openAddAttendeeDialog()),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(defaultToolbarStyles, { name: 'CustomToolbar' }),
  withConnect,
  memo,
)(AddAttendee);
