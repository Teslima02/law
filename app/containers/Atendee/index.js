/**
 *
 * Atendee
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAtendee from './selectors';
import reducer from './reducer';
import saga from './saga';
import AttendeeList from './components/AttendeeList';
import * as Actions from './actions';
import AttendeeDialog from './components/AttendeeDialog';

export function Atendee(props) {
  const { dispatchAttendeesAction } = props;
  useInjectReducer({ key: 'atendee', reducer });
  useInjectSaga({ key: 'atendee', saga });

  useEffect(() => {
    dispatchAttendeesAction();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Atendee</title>
        <meta name="description" content="Description of Atendee" />
      </Helmet>
      <AttendeeList />

      <AttendeeDialog />
    </div>
  );
}

Atendee.propTypes = {
  dispatchAttendeesAction: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  atendee: makeSelectAtendee(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchAttendeesAction: () => dispatch(Actions.allAttendees()),
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
)(Atendee);
