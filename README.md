# Pharma

I created a full-stack application called Pharma, an AI-powered study tool for pharmacy students that features a chatbot and flashcard generator using OpenAI GPT-4o. I built the frontend with React and Vite, developed a RESTful API with Express.js, implemented JWT-based authentication, and used MongoDB for data storage to ensure secure and scalable user interactions.

## Features
* AI-Powered Chatbot & Flashcard Generation – Integrated OpenAI GPT-4o to enable intelligent, conversational responses and automatic flashcard creation based on user input, enhancing personalized learning.
* JWT-Based Authentication – Implemented secure login functionality using JSON Web Tokens, with support for token refresh and expiry to protect user sessions.
* RESTful API Design – Built a robust backend with Express.js to manage user data and flashcards, enabling efficient CRUD operations and scalability.
* MongoDB Data Storage – Utilized MongoDB to store and organize user-generated content and progress, ensuring reliable access and data integrity.
* Modern Frontend – Developed a fast and responsive user interface using React and Vite, allowing for smooth user interactions and minimal load times.
  
## Tech Stack

| Layer        | Tools & Services                                   |
| :----------- | :------------------------------------------------  |
| Frontend     | React, Vite Tailwind CSS                           |
| Backend      | ExpressJS, NodeJS                                  |
| Storage      | MongoDB                                            |
| Auth         | JWT (JSON Web Tokens)                              |
| AI API       | OpenAI GPT-4o                                      |

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/05jwang/Poketrade.git](https://github.com/ARYPAT2005/Pharma.git
    ```
2. Run the backend server

    ```bash
    cd backend
    npm install
    Create a .env file in the backend directory and add the following:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    OPENAI_API_KEY=your_openai_api_key
    Run nodemon app.js or just node app.js if you do not have nodemon installed
    ```

3. Run the frontend server in a seperate terminal
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
   



## Video Link

## Screenshots
Home Page
<figure style="text-align: center;">
  <img 
    src="https://github.com/user-attachments/assets/6259e92b-d83b-460b-84f1-c047045f73f1" 
    alt="image" 
    style="width: 50%; height: auto;" 
  />
</figure>

Chatbot
<figure style="text-align: center;">
  <img width="1274" height="673" alt="image" src="https://github.com/user-attachments/assets/1da0106e-0313-4996-9acc-e2cf2e4ed072" />
</figure>

Flashcards
<figure style="text-align: center;">
  <img width="1274" height="676" alt="image" src="https://github.com/user-attachments/assets/e314cd24-0a23-406d-aaaf-09d3b183793b" />
</figure>




