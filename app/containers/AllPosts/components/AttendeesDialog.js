/**
 *
 * AllPosts
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import * as Selectors from '../selectors';
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

const AttendeesDialog = props => {
  const {
    allAttendees,
    attendeeDialog,
    closeAddAttendeeDialog,
    dispatchAddAttendeeAction,
  } = props;
  const classes = useStyles();

  const [values, setValues] = React.useState({
    _id: '',
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
    attendeeDialog.type === 'new' ? closeAddAttendeeDialog() : '';
  };

  console.log(allAttendees, 'allAttendees');

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
              {attendeeDialog.type === 'new' ? 'Add Attendee To Talk' : ''}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {attendeeDialog.type === 'new' ? (
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel id="attendee-label">Select Attendee</InputLabel>
                <Select
                  labelId="attendee-label"
                  id="demo-simple-select-helper"
                  value={values}
                  fullWidth
                  onChange={handleChange('_id')}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allAttendees &&
                    allAttendees.map((attendee, index) => (
                      <MenuItem key={attendee._id} value={attendee._id}>
                        {attendee.firstName} {attendee.lastName}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Select Attendee</FormHelperText>
              </FormControl>
            </div>
          ) : (
            <div />
          )}
        </DialogContent>
        {attendeeDialog.type === 'new' ? (
          <DialogActions>
            <Button
              onClick={() => {
                dispatchAddAttendeeAction(values);
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
          <div />
        )}
      </Dialog>
    </div>
  );
};

AttendeesDialog.propTypes = {
  allAttendees: PropTypes.array,
  getAttendeesAction: PropTypes.func,
  dispatchAddAttendeeAction: PropTypes.func,
  closeAddAttendeeDialog: PropTypes.func,
  attendeeDialog: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  attendeeDialog: Selectors.makeSelectAddAttendeeDialog(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchAddAttendeeAction: evt => dispatch(Actions.saveAttendee(evt)),
    closeAddAttendeeDialog: () => dispatch(Actions.closeAddAttendeeDialog()),
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
)(AttendeesDialog);
