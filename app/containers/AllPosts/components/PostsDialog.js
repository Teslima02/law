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

const PostsDialog = props => {
  const {
    postDialog,
    closeNewPostDialog,
    closeEditPostDialog,
    dispatchNewPostAction,
    dispatchUpdatePostAction,
  } = props;
  const classes = useStyles();

  const [values, setValues] = React.useState({
    title: '',
    // desc: '',
    content: '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    setValues({
      ...postDialog.data,
    });
  }, [postDialog.data]);

  const closeComposeDialog = () => {
    // eslint-disable-next-line no-unused-expressions
    postDialog.type === 'new' ? closeNewPostDialog() : closeEditPostDialog();
  };

  return (
    <div>
      <Dialog
        {...postDialog.props}
        onClose={closeComposeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6">
              {postDialog.type === 'new' ? 'New Post' : 'Edit Post'}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {postDialog.type === 'new' ? (
            <div>
              <TextField
                id="standard-title"
                label="Title"
                className={classes.textField}
                value={values.title || ''}
                onChange={handleChange('title')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-title"
                label="Description"
                className={classes.textField}
                value={values.desc || ''}
                onChange={handleChange('desc')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="standard-description"
                label="Content"
                className={classes.textField}
                value={values.content || ''}
                onChange={handleChange('content')}
                margin="normal"
                fullWidth
                multiline
                rows="4"
              />
            </div>
          ) : (
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
            </div>
          )}
        </DialogContent>
        {postDialog.type === 'new' ? (
          <DialogActions>
            <Button
              onClick={() => {
                dispatchNewPostAction(values);
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
                dispatchUpdatePostAction(values);
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
}

PostsDialog.propTypes = {
  dispatchNewPostAction: PropTypes.func,
  closeNewPostDialog: PropTypes.func,
  closeEditPostDialog: PropTypes.func,
  postDialog: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  postDialog: Selectors.makeSelectPostDialog(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchNewPostAction: evt => dispatch(Actions.saveNewPost(evt)),
    closeNewPostDialog: () => dispatch(Actions.closeNewPostDialog()),
    openEditPostDialog: evt => dispatch(Actions.openEditPostDialog(evt)),
    closeEditPostDialog: () => dispatch(Actions.closeEditPostDialog()),
    dispatchUpdatePostAction: evt => dispatch(Actions.updatePost(evt)),
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
)(PostsDialog);
