// utils/automationRunner.js

import Automation from '../models/automation.model.js';
import Task from '../models/task.model.js';
import User from '../models/user.model.js';

/**
 * Executes an automation action on a task.
 * Extend this to support more action types.
 */
const executeAction = async (action, task) => {
  try {
    switch (action.type) {
      case 'notify':
        console.log(`[Automation Notify] ${action.message} for Task: ${task.title}`);
        // TODO: Integrate with real notification system (WebSocket, email, etc.)
        alert(`[Automation Notify] ${action.message} for Task: ${task.title}`);
        break;

      case 'update_status':
        if (action.newStatus && task.status !== action.newStatus) {
          task.status = action.newStatus;
          await task.save();
          console.log(`[Automation] Task status updated to ${action.newStatus}`);
        }
        break;

      // Future ideas: assign_user, create_comment, move_to_column, send_email, etc.
      default:
        console.warn(`[Automation] Unknown action type: ${action.type}`);
    }
  } catch (err) {
    console.error(`[Automation Action Error] Failed to execute action: ${action.type}`, err.message);
  }
};

/**
 * Runs all automation rules matching the trigger and project.
 *
 * @param {String} trigger - The event type ('status_changed', 'task_assigned', 'due_date_passed')
 * @param {Object} task - The updated task object (after changes)
 * @param {Object} oldTaskData - The task object before changes (for comparison)
 */
export const runAutomations = async (trigger, task, oldTaskData = {}) => {
  try {
    const automations = await Automation.find({
      trigger,
      project: task.project,
    });

    for (const automation of automations) {
      const { condition, action } = automation;

      if (trigger === 'status_changed') {
        const { from, to } = condition;
        if (oldTaskData.status === from && task.status === to) {
          await executeAction(action, task);
        }

      } else if (trigger === 'task_assigned') {
        if (
          condition.assignee &&
          task.assignee?.toString() === condition.assignee &&
          oldTaskData.assignee?.toString() !== task.assignee?.toString()
        ) {
          await executeAction(action, task);
        }

      } else if (trigger === 'due_date_passed') {
        const now = new Date();
        if (
          task.dueDate &&
          task.dueDate < now &&
          task.status !== 'Done'
        ) {
          await executeAction(action, task);
        }
      }
    }
  } catch (err) {
    console.error('[Automation Error]', err.message);
  }
};
