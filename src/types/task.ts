interface Task {
    id: number,
    title: string,
    description?: string,
    completed: boolean,
    userId: number
}

export default Task;