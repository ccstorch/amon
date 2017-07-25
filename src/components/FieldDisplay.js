import React from 'react';
import { Row, Col } from 'antd';

const FieldDisplay = ({ children, label }) => (
  <Row style={{ borderBottom: 'solid 1px #f5f5f5', padding: '12px 0', maxWidth: '800' }}>
    <Col span={6}>
      <b>{label}</b>
    </Col>
    <Col span={18}>
      <span>{children}</span>
    </Col>
  </Row>
);

export default FieldDisplay;
