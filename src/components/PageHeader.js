import React from 'react';
import { Icon, Row, Col } from 'antd'
import { history } from '../store';
import { Link } from 'react-router-dom'

const PageHeader = ({ title, newPath, rightContent, showReturn, secondaryContent }) => (
  <div className='pageHeader'>
    <Row type="flex" justify="space-between">
      <Col span={12}>
        {showReturn &&
          <a onClick={history.goBack}>
            <Icon type="left" style={{ fontSize: 18, marginRight: 12 }} />
          </a>
        }
        <h2 className='title' style={{ display: 'inline-block' }}>{title}</h2>
        {newPath &&
          <Link to={newPath}>
            <Icon type='plus-circle-o' style={{ fontSize: 18, marginLeft: 12 }} />
          </Link>
        }
        {secondaryContent &&
          <span style={{ marginLeft: 12 }}>{secondaryContent}</span>
        }
      </Col>
      <Col span={12}>{rightContent}</Col>
    </Row>
  </div>
);

export default PageHeader;
