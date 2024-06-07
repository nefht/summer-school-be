import React, { useState, useEffect } from 'react';
import { Eyebrow, Gutter } from 'payload/components/elements';
import { Row, Col, Spin, Statistic } from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import 'chart.js/auto';
import moment from 'moment';

import KnowledgeLevelChart from './KnowledgeLevelChart';
import TargetGroupChart from './TargetGroupChart';
import ExportRegistrations from './ExportRegistrations';
import ExportConfirmed from './ExportConfirmed';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [registration, setRegistrations] = useState({
    registered: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [registrationTime, setRegistrationTime] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const registered = await fetch('/api/registrations');
        const confirmed = await fetch('/api/registrations/count-confirmed');
        const cancelled = await fetch('/api/registrations/count-cancelled');

        const data = await Promise.all([
          registered.json(),
          confirmed.json(),
          cancelled.json(),
        ]);

        setRegistrations({
          registered: data[0].totalDocs,
          confirmed: data[1].count,
          cancelled: data[2].count,
        });

        const course = await fetch('/api/course');
        const dataCourse = await course.json();
        // console.log(dataCourse);
        setRegistrationTime({
          start: dataCourse.docs[0].registrationTime.registrationStartDate,
          end: dataCourse.docs[0].registrationTime.registrationEndDate,
        });
      } catch (error) {
        console.error('Error fetching registration count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRemainingTime = (endTime) => {
    const now = moment();
    const end = moment(endTime);
    const duration = moment.duration(end.diff(now));
    return duration.asMilliseconds() > 0
      ? `${duration.days()} ngày ${duration.hours()} giờ ${duration.minutes()} phút`
      : 'Thời gian đăng ký đã kết thúc';
  };

  return (
    <>
      {/* <Eyebrow></Eyebrow> */}
      <Gutter>
        <h2>Trang quản trị</h2>
        <div style={{ marginBottom: '30px' }}>
          <h3>Thống kê số người đăng ký</h3>
          <Row>
            <Col span={6}>
              <Statistic
                title="Số người đăng ký"
                prefix={<UserOutlined />}
                value={registration.registered}
              />
              <ExportRegistrations />
            </Col>
            <Col span={6}>
              <Statistic
                title="Số người xác nhận"
                prefix={<UserAddOutlined />}
                value={registration.confirmed}
                suffix={` / ${registration.registered}`}
              />
              <ExportConfirmed />
            </Col>
            <Col span={6}>
              <Statistic
                title="Số người hủy bỏ"
                prefix={<UserDeleteOutlined />}
                value={registration.cancelled}
                suffix={` / ${registration.registered}`}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Thời gian đăng ký còn lại"
                value={getRemainingTime(registrationTime.end)}
              />
            </Col>
          </Row>
        </div>
        <KnowledgeLevelChart />
        <TargetGroupChart />
      </Gutter>
    </>
  );
}
