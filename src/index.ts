//Server Creation 
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import taskRoutes from './routes/task'
import userRouter from './routes/user'
import errorHandler from './middleware/errorHandler';

const app: Express = express(); // create an Express app
dotenv.config()
const port = process.env.PORT; // port number

// allows the server to parse JSON data
app.use(express.json());

// use the user route for authentication
app.use('/users', userRouter)

// use the task route for the /tasks endpoint
app.use('/api', taskRoutes);


// use the error handler middleware
app.use(errorHandler);

app.listen(port, () => { // start the server
    console.log(`Server is running on http://localhost:${port}`);
});