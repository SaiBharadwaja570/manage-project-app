import Automation from '../models/Automation.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import Notification from '../models/Notification.js';

export const processAutomations = async (task, triggerType) => {
  try {
    // Find all automations for this project with the matching trigger type
    const automations = await Automation.find({
      projectId: task.projectId,
      'trigger.type': triggerType
    });
    
    if (!automations.length) {
      return;
    }
    
    // Process each automation
    for (const automation of automations) {
      const { trigger, action } = automation;
      
      // Check if the trigger condition is met
      let conditionMet = false;
      
      switch (triggerType) {
        case 'status_change':
          conditionMet = task.status === trigger.condition.status;
          break;
        case 'assignment':
          conditionMet = !trigger.condition.userId || task.assigneeId === trigger.condition.userId;
          break;
        case 'due_date':
          conditionMet = task.dueDate && new Date(task.dueDate) < new Date();
          break;
        default:
          break;
      }
      
      if (!conditionMet) {
        continue;
      }
      
      // Execute the action
      switch (action.type) {
        case 'change_status':
          await Task.findByIdAndUpdate(task._id, { status: action.data.status });
          break;
        case 'assign_badge':
          // Find or create the badge
          let badge = await Badge.findOne({ name: action.data.badgeName });
          
          if (!badge) {
            badge = new Badge({
              name: action.data.badgeName,
              description: `Earned by completing tasks in ${task.projectId}`,
              icon: 'trophy'
            });
            await badge.save();
          }
          
          // Assign badge to user
          await User.findByIdAndUpdate(
            task.assigneeId || task.createdBy,
            {
              $addToSet: {
                badges: {
                  badgeId: badge._id,
                  earnedAt: new Date()
                }
              }
            }
          );
          break;
        case 'send_notification':
          // Create notification for task assignee or creator
          const notification = new Notification({
            userId: task.assigneeId || task.createdBy,
            title: 'Task Notification',
            message: action.data.message || `Notification for task: ${task.title}`,
            read: false
          });
          await notification.save();
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error('Error processing automations:', error);
    throw error;
  }
};

// Schedule job to check for due date automations
export const scheduleDueDateCheck = () => {
  // Run every hour
  setInterval(async () => {
    try {
      // Find tasks with due dates that have passed
      const overdueTasks = await Task.find({
        dueDate: { $lt: new Date() }
      });
      
      // Process automations for each overdue task
      for (const task of overdueTasks) {
        await processAutomations(task, 'due_date');
      }
    } catch (error) {
      console.error('Error in scheduled due date check:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
};