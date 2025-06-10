# InsightInk – Dynamic Blog Application with a variety of Tech Articles

![project2](https://github.com/user-attachments/assets/a3da6d18-5775-4fdc-80dd-1437645622cd)


MediLink is a full-stack web platform designed to streamline doctor appointments, diagnosis tracking, and patient-doctor interactions. It offers a robust admin dashboard, secure authentication, image uploads, and online payments — all in one place.

## Features

- Explore various articles about tech  
- Read and write unique articles about your own topic  
- Participate in different events  
- Admin control panel for managing users, articles, events, comments etc...   
- Track post views and engagement  


## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Redux  
- **Backend:** Node.js, Express.js  
- **Databases:** MongoDB (NoSQL) & MySQL (SQL) & Firebase

 
## Installation

1. Clone the repository  
    ```bash
    git clone https://github.com/AdhurimBerisha51865/MediLink-Lende-Laboratorike-2-.git
    ```

2. Install dependencies for frontend and backend  
    ```bash
    cd client
    npm install

    cd api
    npm install
    ```

3. Set up environment variables (see below)

4. Run the development servers  
    ```bash
    # api
    npm run dev

    # client
    npm run dev
    ```

## Environment Variables

This project requires a few environment variables to run properly.

- For the **client**, create a `.env` file.

### api `.env` variables include:

- `VITE_FIREBASE_API_KEY` — your_firebase_api_key


