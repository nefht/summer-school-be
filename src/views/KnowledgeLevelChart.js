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
        const response = await fetch(
          '/api/registrations/count-knowledge-levels',
        );
        const knowledgeLevels = await response.json();

        setChartData({
          labels: [
            'Chưa biết gì',
            'Tương đối hiểu biết',
            'Hiểu biết',
            'Chuyên gia',
          ],
          datasets: [
            {
              data: [
                knowledgeLevels['1'],
                knowledgeLevels['2'],
                knowledgeLevels['3'],
                knowledgeLevels['4'],
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
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
    <div style={{ marginBottom: '30px' }}>
      <h3>Thống kê Mức độ hiểu biết về chủ đề</h3>
      {loading ? (
        <Spin />
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
                      text: 'Mức độ hiểu biết về chủ đề',
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
                      text: 'Mức độ hiểu biết về chủ đề',
                    },
                    datalabels: {
                      // Thêm plugin datalabels vào đây
                      formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map((data) => {
                          sum += data;
                        });
                        let percentage = ((value * 100) / sum).toFixed(2) + '%';
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
