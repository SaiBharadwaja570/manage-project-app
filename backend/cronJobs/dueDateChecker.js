// cron/dueDateAutomation.js
import Task from '../models/task.model.js';
import { runAutomations } from '../utils/automationRunner.js';

export const checkDueDates = async () => {
  const now = new Date();
  const overdueTasks = await Task.find({
    dueDate: { $lt: now },
    status: { $ne: 'Done' },
  });

  for (const task of overdueTasks) {
    await runAutomations('due_date_passed', task);
  }
};
