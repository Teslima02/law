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

const PostsList = props => {
  const {
    getAllPosts,
    loading,
    error,
    openEditPostDialog,
    dispatchDeletePostAction,
  } = props;

  const columns = [
    {
      name: 'Id',
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
    {
      name: 'desc',
      label: 'Description',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'id',
      label: 'Edit',
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => {
          const Post = getAllPosts.find(post => value === post.id);

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
      name: 'id',
      label: 'Delete',
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => {
          const Post = getAllPosts.find(post => value === post.id);

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
        title="All Posts"
        data={getAllPosts}
        columns={columns}
        options={options}
      />
    </div>
  );
};

PostsList.propTypes = {
  getAllPosts: PropTypes.array.isRequired,
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
  getAllPosts: Selectors.makeSelectGetAllPosts(),
  postDialog: Selectors.makeSelectPostDialog(),
});

function mapDispatchToProps(dispatch) {
  return {
    openEditPostDialog: evt => dispatch(Actions.openEditPostDialog(evt)),
    dispatchDeletePostAction: evt => dispatch(Actions.deletePost(evt)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PostsList);
