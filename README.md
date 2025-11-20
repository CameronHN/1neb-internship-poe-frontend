# Ostentans Resume Creator

## Overview

Ostentans (Latin for showing off) is a TypeScript-based frontend application for the Ostentans Resume Creator system. This system is a comprehensive resume management platform that allows users to create, manage, and geneerate professional PDF resumes.

This project serves as part of the portfolio of evidence for the 1Nebula Software Developer Internship program.

## What is the project?

**Ostentans** (Latin for "showing off") is a full-stack resume management system consisting of:

- **This Frontend project**: A React/TypeScript web application providing the user interface using Fluent UI React components
- **Backend API**: A C# .NET 8.0 Web API ([repository](https://github.com/CameronHN/1neb-internship-poe)) handling data management and PDF generation

The system enables users to:

- Create and manage professional resumes
- Input personal information, work experience, education, skills, and certifications
- Generate and export resumes as PDF documents
- Save multiple resume versions

### Prerequisites

- **Node.js** [(v16 or higher)](https://nodejs.org/en/download)
- **npm**

```bash
# Run the following command in your cmd
npm install -g npm
```

- **Backend API** running (see [backend setup instructions](https://github.com/CameronHN/1neb-internship-poe#configuration--setup))

### Installation Steps

1. **Clone and navigate to the repository:**

   ```bash
   git clone https://github.com/CameronHN/1neb-internship-poe-frontend.git
   cd 1neb-internship-poe-frontend/ostentans-poe
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Ensure backend is running at: `https://localhost:7165`

### Building for Production

```bash
npm run build
```

## How to use the project?

### Getting Started

1. **Register/Login**

   - Create a new account or log in with existing credentials
   - Access the main dashboard after authentication

2. **Add Resume Content**

   - **Work Experience**: Add job titles, companies, dates, and responsibilities
   - **Education**: Include institutions, qualifications, and achievements
   - **Skills**: List technical and soft skills with proficiency levels
   - **Certifications**: Add professional certifications and credentials
   - **Professional Link**: Add professional links
   - **Professional Summary**: Add resume summary or professional objective
   - **Title**: Add resume titles/headings

3. **Build Your Resume**

   - Use the resume builder interface
   - Select from available templates
   - Organize and structure your information

4. **Generate and Export**
   - Generate PDF version of your resume
   - Save multiple resume versions
   - Download and share your professional resume
