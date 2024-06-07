import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Spin, Row, Col } from 'antd';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(ChartDataLabels);

const KnowledgeLevelChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch knowledgeLevels data from an API endpoint
        const response = await fetch('/api/registrations/count-target-groups');
        const targetGroups = await response.json();

        setChartData({
          labels: ['Học sinh', 'Sinh viên', 'Người đi làm'],
          datasets: [
            {
              data: [
                targetGroups['pupil'],
                targetGroups['student'],
                targetGroups['workingPerson'],
              ],
              backgroundColor: [
                'rgb(122, 186, 120, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgb(82, 76, 66, 0.2)',
              ],
              borderColor: [
                'rgb(122, 186, 120)',
                'rgb(153, 102, 255)',
                'rgb(82, 76, 66)',
              ],
              borderWidth: 1,
              barThickness: 50,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching knowledgeLevels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        marginBottom: '40px',
        position: 'relative',
        width: '100%',
        height: 'auto',
      }}
    >
      <h3>Thống kê Đối tượng đăng ký khóa học</h3>
      {loading ? (
        <Spin
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        // <div style={{ display: 'flex' }}>
        <Row>
          <Col xl={12} xs={24}>
            <div style={{ width: '600px', margin: '0 auto' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false, // Ẩn chú thích
                    },
                    title: {
                      display: true,
                      text: 'Đối tượng đăng ký',
                    },
                  },
                }}
              />
            </div>
          </Col>
          <Col xl={12} xs={24}>
            <div style={{ width: '300px', margin: '0 auto' }}>
              <Pie
                data={chartData}
                plugins={[ChartDataLabels]}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Đối tượng đăng ký',
                    },
                    datalabels: {
                      // Thêm plugin datalabels vào đây
                      formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map((data) => {
                          sum += data;
                        });
                        let percentage = ((value * 100) / sum).toFixed(1) + '%';
                        return percentage;
                      },
                      color: '#2f2f2f',
                    },
                  },
                }}
              />
            </div>
          </Col>
        </Row>
        // </div>
      )}
    </div>
  );
};

export default KnowledgeLevelChart;
