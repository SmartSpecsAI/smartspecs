# SmartSpecs

## Description

SmartSpecs is a web application built using React to manage tasks and projects, providing a user-friendly interface for effective collaboration. The application utilizes Firebase for storing requirements data and audio files. Additionally, OpenAI is used to analyze data, enhancing the application's capabilities.

## Video Overview

For a visual overview of the project, you can watch this [video](https://www.loom.com/share/229039890df042b08760942306ca4228?sid=ea4a11e5-803e-441f-9eb8-696c0c14d5f1).
Alternatively, you can view the embedded video below:

https://github.com/user-attachments/assets/003cb94b-6148-44f6-9443-62a6ab1cd1cb


## Tools and Technologies

- **Frontend:**
  - **Framework:** React
  - **Styling:**
    - Sass
    - Tailwind CSS
    - Ant Design (UI Component Library)
  - **State Management:** Context API
- **Backend:**
  - **Database:** Firebase Firestore (for storing requirements data)
  - **Storage:** Firebase Storage (for saving audio files)
  - **Data Analysis:** OpenAI (for analyzing data)

## Architecture

The architecture of the project is organized into several layers:

- **Datasource:** Handles data retrieval and storage using Firebase Firestore for requirements data and Firebase Storage for audio files.
- **Domain:** Contains the business logic and rules of the application.
- **Infrastructure:** Provides necessary data management tools.
- **Presentation:** Responsible for the user interface, built using React components styled with Sass, Tailwind CSS, and Ant Design.
- **Utils:** Includes utility functions and helpers for code reusability.
- **Config:** Manages configuration settings for the application.

## Installation

Instructions on how to set up the project locally. For example:

1. Clone the repository:
   ```bash
   git clone https://github.com/jesussanchezro/smartspecs.git
   ```
2. Navigate to the project directory:
   ```bash
   cd smartspecs
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Instructions on how to run the project. For example:

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Guidelines for contributing to the project. For example:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.
