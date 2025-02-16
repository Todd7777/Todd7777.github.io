document.addEventListener('DOMContentLoaded', function() {
    const charts = {};
    
    // Generate mock data
    function generateMockData(days = 1) {
        const data = [];
        const now = new Date();
        const points = days * 24; // hourly data points
        
        for (let i = 0; i < points; i++) {
            const timestamp = new Date(now - (points - i) * 3600000);
            data.push({
                timestamp: timestamp.toISOString(),
                value: Math.floor(Math.random() * 3500) + 1500
            });
        }
        
        return data;
    }

    // Mock metrics data
    const mockMetrics = {
        api_calls: {
            hourly: generateMockData(1)
        },
        response_times: {
            hourly: generateMockData(1).map(d => ({ ...d, value: Math.floor(d.value / 20) }))
        },
        error_rates: {
            hourly: generateMockData(1).map(d => ({ ...d, value: (d.value / 50000).toFixed(2) }))
        },
        active_keys: {
            hourly: generateMockData(1).map(d => ({ ...d, value: Math.floor(d.value / 5) }))
        }
    };

    // Chart options
    const sharedOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.99)',
                titleColor: '#94a3b8',
                bodyColor: '#94a3b8',
                borderColor: '#f8fafc',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                titleFont: {
                    size: 11,
                    weight: '500'
                },
                bodyFont: {
                    size: 11
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#cbd5e1',
                    font: {
                        size: 10
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f8fafc',
                    lineWidth: 1
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#cbd5e1',
                    font: {
                        size: 10
                    }
                }
            }
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 1.5,
                borderCapStyle: 'round',
                borderJoinStyle: 'round'
            },
            point: {
                radius: 0,
                hitRadius: 30,
                hoverRadius: 4,
                hoverBorderWidth: 1
            }
        }
    };

    function initializeCharts(metricsData) {
        const chartConfigs = {
            apiCallsChart: {
                data: metricsData.api_calls.hourly,
                label: 'API Calls',
                gradient: ['rgba(59, 130, 246, 0.08)', 'rgba(59, 130, 246, 0.01)'],
                borderColor: 'rgba(59, 130, 246, 0.7)'
            },
            responseTimesChart: {
                data: metricsData.response_times.hourly,
                label: 'Response Time (ms)',
                gradient: ['rgba(34, 197, 94, 0.08)', 'rgba(34, 197, 94, 0.01)'],
                borderColor: 'rgba(34, 197, 94, 0.7)'
            },
            errorRatesChart: {
                data: metricsData.error_rates.hourly,
                label: 'Error Rate (%)',
                gradient: ['rgba(239, 68, 68, 0.08)', 'rgba(239, 68, 68, 0.01)'],
                borderColor: 'rgba(239, 68, 68, 0.7)'
            },
            activeKeysChart: {
                data: metricsData.active_keys.hourly,
                label: 'Active Keys',
                gradient: ['rgba(168, 85, 247, 0.08)', 'rgba(168, 85, 247, 0.01)'],
                borderColor: 'rgba(168, 85, 247, 0.7)'
            }
        };

        Object.entries(chartConfigs).forEach(([chartId, config]) => {
            const ctx = document.getElementById(chartId).getContext('2d');
            
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, config.gradient[0]);
            gradient.addColorStop(1, config.gradient[1]);

            if (charts[chartId]) {
                charts[chartId].destroy();
            }

            charts[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: config.label,
                        data: config.data.map(d => ({
                            x: new Date(d.timestamp),
                            y: d.value
                        })),
                        borderColor: config.borderColor,
                        backgroundColor: gradient,
                        fill: true,
                        pointHoverBackgroundColor: 'white',
                        pointHoverBorderColor: config.borderColor
                    }]
                },
                options: sharedOptions
            });
        });

        // Initialize main chart
        const mainCtx = document.getElementById('mainChart').getContext('2d');
        const mainGradient1 = mainCtx.createLinearGradient(0, 0, 0, 300);
        mainGradient1.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        mainGradient1.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

        const mainGradient2 = mainCtx.createLinearGradient(0, 0, 0, 300);
        mainGradient2.addColorStop(0, 'rgba(34, 197, 94, 0.08)');
        mainGradient2.addColorStop(1, 'rgba(34, 197, 94, 0.01)');

        if (charts.mainChart) {
            charts.mainChart.destroy();
        }

        charts.mainChart = new Chart(mainCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'API Calls',
                        data: metricsData.api_calls.hourly.map(d => ({
                            x: new Date(d.timestamp),
                            y: d.value
                        })),
                        borderColor: 'rgba(59, 130, 246, 0.7)',
                        backgroundColor: mainGradient1,
                        fill: true,
                        pointHoverBackgroundColor: 'white',
                        pointHoverBorderColor: 'rgba(59, 130, 246, 0.7)'
                    },
                    {
                        label: 'Response Time',
                        data: metricsData.response_times.hourly.map(d => ({
                            x: new Date(d.timestamp),
                            y: d.value
                        })),
                        borderColor: 'rgba(34, 197, 94, 0.7)',
                        backgroundColor: mainGradient2,
                        fill: true,
                        pointHoverBackgroundColor: 'white',
                        pointHoverBorderColor: 'rgba(34, 197, 94, 0.7)'
                    }
                ]
            },
            options: sharedOptions
        });
    }

    // Time range buttons
    const timeRangeButtons = document.querySelectorAll('[data-range]');
    timeRangeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const range = this.dataset.range;
            timeRangeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const days = {
                'day': 1,
                'week': 7,
                'month': 30
            }[range];

            const newMetrics = {
                api_calls: { hourly: generateMockData(days) },
                response_times: { hourly: generateMockData(days).map(d => ({ ...d, value: Math.floor(d.value / 20) })) },
                error_rates: { hourly: generateMockData(days).map(d => ({ ...d, value: (d.value / 50000).toFixed(2) })) },
                active_keys: { hourly: generateMockData(days).map(d => ({ ...d, value: Math.floor(d.value / 5) })) }
            };

            initializeCharts(newMetrics);
        });
    });

    // Toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const series = button.dataset.series;
            button.classList.toggle('active');
            
            const mainChart = charts.mainChart;
            if (!mainChart) return;
            
            const datasetIndex = series === 'apiCalls' ? 0 : 1;
            const dataset = mainChart.data.datasets[datasetIndex];
            dataset.hidden = !dataset.hidden;
            
            mainChart.update();
        });
    });

    // Initialize with mock data
    initializeCharts(mockMetrics);
});
