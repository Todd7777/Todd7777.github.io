# InterviewPro Developer Portal

A modern, elegant developer portal for managing API keys and monitoring API usage metrics. Built with Flask and Chart.js, featuring real-time analytics, interactive dashboards, and secure authentication.

![InterviewPro Dashboard](screenshots/dashboard.png)

## Features

- 🔐 **Secure Authentication**: Email-based authentication system with password hashing
- 📊 **Interactive Dashboard**: Real-time metrics visualization with Chart.js
- 🔑 **API Key Management**: Generate, view, and manage API keys
- 📈 **Usage Analytics**: Track API calls, response times, error rates, and active keys
- 📱 **Responsive Design**: Modern UI that works seamlessly across devices
- 📚 **API Documentation**: Built-in documentation with interactive examples

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- pip (Python package manager)
- Git
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/cs1060/Todd7777-hw3.git
   cd Todd7777-hw3
   ```

2. **Create a Virtual Environment**
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the Database**
   ```bash
   # Start Python interactive shell
   python
   
   # In Python shell
   >>> from app import db
   >>> db.create_all()
   >>> exit()
   ```

5. **Start the Development Server**
   ```bash
   python app.py
   ```

6. **Access the Portal**
   - Open your browser and navigate to `http://localhost:5004`
   - Register a new account or use the demo credentials:
     - Email: `demo@example.com`
     - Password: `demo123`

## Project Structure

```
InterviewPro/
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── static/            # Static assets
│   ├── css/          # Stylesheets
│   └── js/           # JavaScript files
└── templates/         # HTML templates
    ├── base.html     # Base template
    ├── dashboard.html # Dashboard template
    └── ...           # Other templates
```

## Development

To contribute to the project:

1. Create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

## Troubleshooting

Common issues and solutions:

1. **Database Errors**
   - Ensure you've initialized the database
   - Check file permissions in the project directory
   - Verify SQLite is installed and working

2. **Dependencies Issues**
   - Try removing and recreating the virtual environment
   - Update pip: `pip install --upgrade pip`
   - Install dependencies one by one if bulk install fails

3. **Server Won't Start**
   - Check if port 5004 is already in use
   - Verify Python version compatibility
   - Ensure all required environment variables are set

## License

This project is private and proprietary. All rights reserved.

## Support

For support, please contact:
- Email: support@interviewpro.com
- GitHub Issues: [Create a new issue](https://github.com/cs1060/Todd7777-hw3/issues)

---

Built with ❤️ by Todd7777
