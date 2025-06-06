import express, { Request, Response } from 'express';
import Task from '../types/task'; 
import { authMiddleWare } from '../middleware/auth'; 
import prisma from '../prisma';

const router = express.Router(); // Create a Router instance

// Temporary in-memory storage (later replaced with Prisma)
const tasks: Task[] = [];

// GET /tasks - Get all tasks
router.get('/tasks', authMiddleWare, async (req: Request & {user?: {userId: number}}, res: Response): Promise<void> => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// POST /tasks - Create a new task
router.post('/tasks', authMiddleWare, async (req: Request & {user?: {userId: number}}, res: Response): Promise<void> => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    res.status(400).json({ error: 'Title and userId are required' });
  }

  const userIdNo = parseInt(userId);

  if (isNaN(userIdNo)) {
    res.status(400).json({error: 'userId must be a valid number'})
  }

  try {
    const task = await prisma.task.create({
      data: { title, description: description || '', userId: userIdNo, completed: false }
    });
    res.status(201).json(task)
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({error: 'Failed to create task'}) 
  }
});

// GET /tasks:id - Get a specific task by Id
router.get('/tasks/:id', authMiddleWare, async (req: Request & {user?: {userId: number}}, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({error: 'Invalid task ID'})
    }

    try {
      const task = await prisma.task.findUnique({
        where: {
          id: id
        }
      })
      if (!task) {
        res.status(404).json({error: 'Task not found'})
      }
      res.status(201).json(task)
    } catch (error) {
      res.status(500).json({error: 'Database error'})
    }
})

// PUT /tasks/:id - Update a specific task by Id
router.put('/tasks/:id', authMiddleWare, async (req: Request & {user?: {userId: number}}, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({error: 'Invalid task ID'});
  }
  
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id
      }
    })
    if (!task) {
      res.status(404).json({error: 'Task not found'})
    }
    
    const {title, description, completed} = req.body

    const updatedTask = await prisma.task.update({
      where: {
        id: id
      }, 
      data: {
        title: title || task?.title,
        description: description || task?.description,
        completed: completed !== undefined ? completed: task?.completed
      }
    })
    res.status(200).json({message: 'Task Updated Successfully', task: updatedTask})
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({error: 'Database error'})
  }
})

// DELETE /tasks/:id - Delete a specific task by Id
router.delete('/tasks/:id', authMiddleWare, async (req: Request & {user?: {userId: number}}, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({error: 'Invalid task ID'});
    }

    try {
      const task = await prisma.task.findUnique({
        where: {
          id: id
        }
      })

      if (!task) {
        res.status(404).json({error: 'Task not Found'})
      }

      const deletedTask = await prisma.task.delete({
        where: {
          id: id
        }
      })
      res.status(200).json({message: 'Task Deleted Successfully', task: deletedTask})
    } catch (error) {
      res.status(500).json({error: 'Database error'})
    }
})

export default router;