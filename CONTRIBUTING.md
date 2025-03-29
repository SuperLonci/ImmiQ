# 🚀 Contributing Guide

👋 Welcome! We're thrilled that you're interested in contributing to **ImmiQ**. Follow these steps to get started.  

## 🛠️ Setting Up the Project

1. **Fork the Repository**
   Click the fork button to create your own copy.  
2. **Clone Your Fork**  
   ```sh
   git clone https://github.com/your-username/ImmiQ.git
3. **Navigate to the Project Directory**  
   ```sh
   cd Immiq
4. **Add the Upstream Repository** (to stay updated with the main project)  
   ```sh
   git remote add upstream https://github.com/SuperLonci/ImmiQ.git
5. **Install Dependencies**  
   ```sh
   npm install
6. **Run the Project Locally**  
   ```sh
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

## 🔄 Contribution Workflow

1. **Sync with Upstream Repository** – 
   Before making changes, always pull the latest updates from the original repository:  
    ```sh
   git checkout main
   git pull upstream main
   git push origin main
2. **Creating a Branch** 
   Always create a new branch for your contribution: 
   ```sh
   git checkout -b feature/your-feature-name
   ```
   Use descriptive branch names like fix/readme-typo or feature/add-login.
3. **Writing Code** 
   Follow project conventions and coding standards.
   Use Prettier for consistent formatting.   
4. **Making a Commit** 
   Format commit messages clearly:
   ```sh
   feat: Added login feature
   fix: Resolved bug in user authentication
   docs: Updated README with installation steps
   ```

   Commit your changes:
   ```sh
   git add .
   git commit -m "your commit message"
   ```
5. **Pushing Your Changes** 
    ```sh
   git push origin feature/your-feature-name
6. **Opening a Pull Request (PR)** 
   Go to the original repository on GitHub.
   Click New Pull Request.
   Select your branch and submit your PR.
   A maintainer will review and approve it before merging.
   

  

  



