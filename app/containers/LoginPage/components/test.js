import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
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
import { useInjectSaga } from '../../../utils/injectSaga';
import { useInjectReducer } from '../../../utils/injectReducer';
import makeSelectAdmins from '../selectors';
import reducer from '../reducer';
import saga from '../saga';
import * as Actions from '../../Admins/actions';
import messages from '../messages';

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

export function Tests(props) {
//   const { callSave } = props;
  useInjectReducer({ key: 'tests', reducer });
  useInjectSaga({ key: 'tests', saga });
  const classes = useStyles();

  const [values, setValues] = React.useState({
    title: '',
    desc: '',
    content: '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

//   console.log(callSave, 'callSave')

  return (
    <div>
      <TextField
        id="standard-title"
        label="Title"
        className={classes.textField}
        value={values.title}
        onChange={handleChange('title')}
        margin="normal"
        fullWidth
      />
      <TextField
        id="standard-title"
        label="Description"
        className={classes.textField}
        value={values.desc}
        onChange={handleChange('desc')}
        margin="normal"
        fullWidth
      />
      <TextField
        id="standard-description"
        label="Content"
        className={classes.textField}
        value={values.content}
        onChange={handleChange('content')}
        margin="normal"
        fullWidth
        multiline
        rows="4"
      />

      <Button
        onClick={() => {
          //   dispatchUpdatePostAction(values);
          //   closeComposeDialog();
        }}
        color="primary"
        variant="contained"
      >
        Save
      </Button>
      <Button
        // onClick={() => closeComposeDialog()}
        color="primary"
        variant="contained"
      >
        Cancel
      </Button>
    </div>
  );
}

Tests.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  admins: makeSelectAdmins(),
});

function mapDispatchToProps(dispatch) {
  return {
    // callSave: evt => dispatch(Actions.saveNewPost(evt)),
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
)(Tests);
