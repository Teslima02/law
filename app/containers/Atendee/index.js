/**
 *
 * Atendee
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAtendee from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function Atendee() {
  useInjectReducer({ key: 'atendee', reducer });
  useInjectSaga({ key: 'atendee', saga });

  return (
    <div>
      <Helmet>
        <title>Atendee</title>
        <meta name="description" content="Description of Atendee" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Atendee.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  atendee: makeSelectAtendee(),
});

function mapDispatchToProps(dispatch) {
  return {
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
