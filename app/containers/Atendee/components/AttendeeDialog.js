/**
 *
 * AllAttendees
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import {
  TextField,
  makeStyles,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import * as Selectors from '../selectors';
import reducer from '../reducer';
import saga from '../saga';
import * as Actions from '../actions';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: theme.spacing(1),
    // marginRight: theme.spacing(1),
    // width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

const AttendeeDialog = props => {
  const {
    attendeeDialog,
    closeNewAttendeeDialog,
    closeEditAttendeeDialog,
    dispatchNewAttendeeAction,
    dispatchUpdateAttendeeAction,
  } = props;
  const classes = useStyles();

  const [values, setValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    setValues({
      ...attendeeDialog.data,
    });
  }, [attendeeDialog.data]);

  const closeComposeDialog = () => {
    // eslint-disable-next-line no-unused-expressions
    attendeeDialog.type === 'new'
      ? closeNewAttendeeDialog()
      : closeEditAttendeeDialog();
  };

  return (
    <div>
      <Dialog
        {...attendeeDialog.props}
        onClose={closeComposeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6">
              {attendeeDialog.type === 'new' ? 'New Attendee' : 'Edit Attendee'}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {attendeeDialog.type === 'new' ? (
            <div>
              <TextField
                id="standard-firstName"
                label="First Name"
                className={classes.textField}
                value={values.firstName || ''}
                onChange={handleChange('firstName')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-lastName"
                label="Last Name"
                className={classes.textField}
                value={values.lastName || ''}
                onChange={handleChange('lastName')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-email"
                label="Email"
                className={classes.textField}
                value={values.email || ''}
                onChange={handleChange('email')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-address"
                label="address"
                className={classes.textField}
                value={values.address || ''}
                onChange={handleChange('address')}
                margin="normal"
                fullWidth
                multiline
                rows="2"
              />
            </div>
          ) : (
            <div>
              <TextField
                id="standard-firstName"
                label="First Name"
                className={classes.textField}
                value={values.firstName || ''}
                onChange={handleChange('firstName')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-lastName"
                label="Last Name"
                className={classes.textField}
                value={values.lastName || ''}
                onChange={handleChange('lastName')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-email"
                label="Email"
                className={classes.textField}
                value={values.email || ''}
                onChange={handleChange('email')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-address"
                label="address"
                className={classes.textField}
                value={values.address || ''}
                onChange={handleChange('address')}
                margin="normal"
                fullWidth
                multiline
                rows="2"
              />
            </div>
          )}
        </DialogContent>
        {attendeeDialog.type === 'new' ? (
          <DialogActions>
            <Button
              onClick={() => {
                dispatchNewAttendeeAction(values);
                closeComposeDialog();
              }}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
            <Button
              onClick={() => closeComposeDialog()}
              color="primary"
              variant="contained"
            >
              Cancel
            </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button
              onClick={() => {
                dispatchUpdateAttendeeAction(values);
                closeComposeDialog();
              }}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
            <Button
              onClick={() => closeComposeDialog()}
              color="primary"
              variant="contained"
            >
              Cancel
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

AttendeeDialog.propTypes = {
  dispatchNewAttendeeAction: PropTypes.func,
  closeNewAttendeeDialog: PropTypes.func,
  closeEditAttendeeDialog: PropTypes.func,
  attendeeDialog: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  attendeeDialog: Selectors.makeSelectAttendeeDialog(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchNewAttendeeAction: evt => dispatch(Actions.saveNewAttendee(evt)),
    closeNewAttendeeDialog: () => dispatch(Actions.closeNewAttendeeDialog()),
    openEditAttendeeDialog: evt =>
      dispatch(Actions.openEditAttendeeDialog(evt)),
    closeEditAttendeeDialog: () => dispatch(Actions.closeEditAttendeeDialog()),
    dispatchUpdateAttendeeAction: evt => dispatch(Actions.updateAttendee(evt)),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AttendeeDialog);
