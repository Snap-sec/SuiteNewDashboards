import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartCatalogue = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const charts = [
    {
      id: 1,
      name: 'Multi-Line Trend Chart',
      category: 'line',
      description: 'Dual-line chart showing total assets vs exposures over time',
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: true },
          zoom: { enabled: true }
        },
        colors: ['#6B7FFD', '#FF4560'],
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        title: {
          text: '30-Day Trend',
          align: 'left',
          style: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#263238'
          }
        },
        grid: {
          borderColor: '#f1f1f1',
          strokeDashArray: 4
        },
        markers: {
          size: 6,
          colors: ['#6B7FFD', '#FF4560'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: { size: 8 }
        },
        xaxis: {
          categories: ['2025-11-19', '2025-11-20', '2025-11-21', '2025-11-22', '2025-11-23', '2025-11-24', '2025-11-25'],
          labels: {
            style: { colors: '#666', fontSize: '12px' }
          }
        },
        yaxis: {
          labels: {
            style: { colors: '#666', fontSize: '12px' },
            formatter: (val) => val.toFixed(1)
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          markers: { radius: 12 }
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (val) => val.toFixed(2)
          }
        }
      },
      series: [
        {
          name: 'Total Assets',
          data: [1200, 2100, 1900, 2050, 2000, 3100, 1850]
        },
        {
          name: 'Exposures',
          data: [50, 100, 150, 120, 180, 380, 250]
        }
      ]
    },
    {
      id: 2,
      name: 'Vertical Bar Chart',
      category: 'bar',
      description: 'Column chart showing quarterly revenue comparison',
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: true }
        },
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: '60%',
            dataLabels: { position: 'top' }
          }
        },
        colors: ['#00E396', '#008FFB', '#FEB019', '#FF4560'],
        dataLabels: {
          enabled: true,
          formatter: (val) => val + 'K',
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        title: {
          text: 'Quarterly Revenue 2024',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          categories: ['Q1', 'Q2', 'Q3', 'Q4'],
          labels: { style: { fontSize: '14px', fontWeight: 500 } }
        },
        yaxis: {
          title: { text: 'Revenue (Thousands)', style: { fontSize: '14px' } },
          labels: { formatter: (val) => val + 'K' }
        },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [{
        name: 'Revenue',
        data: [440, 505, 414, 671]
      }]
    },
    {
      id: 3,
      name: 'Horizontal Bar Chart',
      category: 'bar',
      description: 'Horizontal bars for regional sales comparison',
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: true }
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            horizontal: true,
            barHeight: '70%',
            distributed: true
          }
        },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
        dataLabels: {
          enabled: true,
          style: { fontSize: '12px', colors: ['#fff'] }
        },
        title: {
          text: 'Sales by Region',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          categories: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East']
        },
        legend: { show: false },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [{
        data: [400, 430, 448, 470, 540]
      }]
    },
    {
      id: 4,
      name: 'Grouped Bar Chart',
      category: 'bar',
      description: 'Multi-series comparison bars',
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: true }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '70%',
            borderRadius: 6
          }
        },
        colors: ['#6366F1', '#EC4899', '#10B981'],
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        title: {
          text: 'Product Sales Comparison',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yaxis: {
          title: { text: 'Sales' }
        },
        fill: { opacity: 1 },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [
        { name: 'Product A', data: [44, 55, 57, 56, 61, 58] },
        { name: 'Product B', data: [76, 85, 101, 98, 87, 105] },
        { name: 'Product C', data: [35, 41, 36, 26, 45, 48] }
      ]
    },
    {
      id: 5,
      name: 'Stacked Bar Chart',
      category: 'bar',
      description: 'Stacked columns showing cumulative data',
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: { show: true }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 6
          }
        },
        colors: ['#2E93fA', '#66DA26', '#E91E63', '#FF9800'],
        title: {
          text: 'Revenue Breakdown by Category',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yaxis: {
          title: { text: 'Total Revenue' }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        fill: { opacity: 1 },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [
        { name: 'Electronics', data: [44, 55, 41, 67, 22, 43] },
        { name: 'Clothing', data: [13, 23, 20, 8, 13, 27] },
        { name: 'Food', data: [11, 17, 15, 15, 21, 14] },
        { name: 'Others', data: [21, 7, 25, 13, 22, 8] }
      ]
    },
    {
      id: 6,
      name: 'Area Chart',
      category: 'area',
      description: 'Filled area chart for trend visualization',
      options: {
        chart: {
          type: 'area',
          height: 350,
          zoom: { enabled: true },
          toolbar: { show: true }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#00E396', '#008FFB'],
        title: {
          text: 'Website Traffic Over Time',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        },
        yaxis: {
          title: { text: 'Visitors' }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
          }
        },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [
        { name: 'Organic Traffic', data: [31, 40, 28, 51, 42, 109, 100, 91, 120] },
        { name: 'Paid Traffic', data: [11, 32, 45, 32, 34, 52, 41, 60, 75] }
      ]
    },
    {
      id: 7,
      name: 'Pie Chart',
      category: 'pie',
      description: 'Classic pie chart for proportional data',
      options: {
        chart: {
          type: 'pie',
          height: 350
        },
        labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
        colors: ['#6366F1', '#EC4899', '#10B981', '#F59E0B'],
        title: {
          text: 'Device Usage Distribution',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: 'bottom' }
          }
        }],
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(1) + '%'
        }
      },
      series: [44, 35, 15, 6]
    },
    {
      id: 8,
      name: 'Donut Chart',
      category: 'donut',
      description: 'Donut chart with center information',
      options: {
        chart: {
          type: 'donut',
          height: 350
        },
        labels: ['Marketing', 'Development', 'Sales', 'Operations', 'HR'],
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
        title: {
          text: 'Budget Allocation',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Budget',
                  fontSize: '16px',
                  fontWeight: 600,
                  formatter: () => '$1.2M'
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(1) + '%'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: 'bottom' }
          }
        }]
      },
      series: [35, 25, 20, 15, 5]
    },
    {
      id: 9,
      name: 'Radial Bar Chart',
      category: 'radial',
      description: 'Circular progress indicators',
      options: {
        chart: {
          type: 'radialBar',
          height: 350
        },
        plotOptions: {
          radialBar: {
            hollow: { size: '60%' },
            dataLabels: {
              show: true,
              name: {
                fontSize: '16px',
                fontWeight: 600
              },
              value: {
                fontSize: '14px',
                formatter: (val) => val + '%'
              }
            }
          }
        },
        colors: ['#6366F1', '#EC4899', '#10B981', '#F59E0B'],
        labels: ['Completion', 'Quality', 'Performance', 'Satisfaction'],
        title: {
          text: 'Project Metrics',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        legend: {
          show: true,
          position: 'bottom'
        }
      },
      series: [85, 78, 92, 88]
    },
    {
      id: 10,
      name: 'Mixed Chart',
      category: 'mixed',
      description: 'Combination of line and column charts',
      options: {
        chart: {
          height: 350,
          type: 'line',
          toolbar: { show: true }
        },
        stroke: {
          width: [0, 3]
        },
        colors: ['#00E396', '#FF4560'],
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        title: {
          text: 'Revenue vs Profit Margin',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          type: 'category'
        },
        yaxis: [
          {
            title: { text: 'Revenue' }
          },
          {
            opposite: true,
            title: { text: 'Profit Margin (%)' }
          }
        ],
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [
        {
          name: 'Revenue',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752]
        },
        {
          name: 'Profit Margin',
          type: 'line',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22]
        }
      ]
    },
    {
      id: 11,
      name: 'Heatmap Chart',
      category: 'heatmap',
      description: 'Matrix visualization for dense data',
      options: {
        chart: {
          height: 350,
          type: 'heatmap',
          toolbar: { show: true }
        },
        dataLabels: { enabled: false },
        colors: ['#008FFB'],
        title: {
          text: 'Weekly Activity Heatmap',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            colorScale: {
              ranges: [
                { from: 0, to: 20, name: 'Low', color: '#00A100' },
                { from: 21, to: 40, name: 'Medium', color: '#128FD9' },
                { from: 41, to: 60, name: 'High', color: '#FFB200' },
                { from: 61, to: 100, name: 'Very High', color: '#FF0000' }
              ]
            }
          }
        },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [
        { name: 'Week 1', data: [30, 40, 25, 50, 49, 21, 70] },
        { name: 'Week 2', data: [23, 42, 35, 27, 43, 22, 45] },
        { name: 'Week 3', data: [44, 55, 41, 37, 22, 43, 21] },
        { name: 'Week 4', data: [30, 58, 39, 52, 41, 30, 55] }
      ]
    },
    {
      id: 12,
      name: 'Scatter Plot',
      category: 'scatter',
      description: 'X-Y coordinate data visualization',
      options: {
        chart: {
          height: 350,
          type: 'scatter',
          zoom: { enabled: true, type: 'xy' },
          toolbar: { show: true }
        },
        colors: ['#6366F1', '#EC4899', '#10B981'],
        title: {
          text: 'Customer Segmentation',
          align: 'left',
          style: { fontSize: '18px', fontWeight: 600 }
        },
        xaxis: {
          title: { text: 'Purchase Frequency' },
          tickAmount: 10
        },
        yaxis: {
          title: { text: 'Average Order Value' },
          tickAmount: 7
        },
        markers: {
          size: 8,
          hover: { size: 10 }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
        grid: { borderColor: '#f1f1f1' }
      },
      series: [
        {
          name: 'Segment A',
          data: [[16.4, 5.4], [21.7, 2.0], [25.4, 3.0], [19, 2.0], [10.9, 1.0], [13.6, 3.2]]
        },
        {
          name: 'Segment B',
          data: [[36.4, 13.4], [1.7, 11.0], [5.4, 8.0], [9, 17.0], [1.9, 4.0], [3.6, 12.2]]
        },
        {
          name: 'Segment C',
          data: [[21.4, 24.0], [23.2, 34.5], [24.9, 31.0], [25.2, 30.5], [24.7, 32.9]]
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Charts', icon: '📊' },
    { id: 'line', name: 'Line Charts', icon: '📈' },
    { id: 'bar', name: 'Bar Charts', icon: '📊' },
    { id: 'area', name: 'Area Charts', icon: '🌊' },
    { id: 'pie', name: 'Pie Charts', icon: '🥧' },
    { id: 'donut', name: 'Donut Charts', icon: '🍩' },
    { id: 'radial', name: 'Radial Charts', icon: '⭕' },
    { id: 'mixed', name: 'Mixed Charts', icon: '🔀' },
    { id: 'heatmap', name: 'Heatmaps', icon: '🔥' },
    { id: 'scatter', name: 'Scatter Plots', icon: '🎯' }
  ];

  const filteredCharts = selectedCategory === 'all' 
    ? charts 
    : charts.filter(chart => chart.category === selectedCategory);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Professional Chart UI Catalogue
          </h1>
          <p className="text-slate-600 text-lg">
            Production-ready ApexCharts components for React applications
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filter by Type</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCharts.map(chart => (
            <div
              key={chart.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {chart.name}
                  </h3>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    {chart.category}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{chart.description}</p>
              </div>
              
              <div className="p-6">
                <ReactApexChart
                  options={chart.options}
                  series={chart.series}
                  type={chart.options.chart.type}
                  height={chart.options.chart.height}
                />
              </div>

              <div className="px-6 pb-6">
                <details className="group">
                  <summary className="cursor-pointer text-indigo-600 font-medium hover:text-indigo-700 transition-colors list-none flex items-center gap-2">
                    <span className="transform group-open:rotate-90 transition-transform">▶</span>
                    View Code Configuration
                  </summary>
                  <pre className="mt-3 p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
                    <code>{JSON.stringify({ options: chart.options, series: chart.series }, null, 2)}</code>
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>

        {filteredCharts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No charts found in this category</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Implementation Notes</h3>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li>• Install: <code className="px-2 py-1 bg-slate-100 rounded">npm install react-apexcharts apexcharts</code></li>
            <li>• Import: <code className="px-2 py-1 bg-slate-100 rounded">import ReactApexChart from 'react-apexcharts'</code></li>
            <li>• All charts are responsive and include interactive tooltips</li>
            <li>• Customize colors, fonts, and styling via the options object</li>
            <li>• Each chart includes toolbar for download and zoom functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChartCatalogue;