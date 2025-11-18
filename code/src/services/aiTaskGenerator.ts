import type { Task } from '@/types/task';
import type { TeamType } from '@/types/enums';

/**
 * Temporary task structure for AI generation
 * Before actual IDs are assigned
 */
export interface GeneratedTask {
  title: string;
  description?: string;
  team?: TeamType;
  subtasks?: GeneratedTask[];
  accepted?: boolean; // Track acceptance status during review (undefined = not decided)
}

/**
 * Mock AI Task Generator Service
 * Simulates AI-powered task generation based on case description
 */
export const aiTaskGenerator = {
  /**
   * Generate tasks based on case description and context
   */
  async generateTasks(
    description: string,
    _title: string,
    team?: TeamType
  ): Promise<GeneratedTask[]> {
    // Simulate AI processing delay (20 seconds)
    await new Promise(resolve => setTimeout(resolve, 20000));

    const descriptionLower = description.toLowerCase();
    
    // Template-based generation based on keywords
    if (descriptionLower.includes('plumbing') || descriptionLower.includes('pipe') || descriptionLower.includes('leak')) {
      return generatePlumbingTasks(team);
    }
    
    if (descriptionLower.includes('electrical') || descriptionLower.includes('power') || descriptionLower.includes('light')) {
      return generateElectricalTasks(team);
    }
    
    if (descriptionLower.includes('hvac') || descriptionLower.includes('heating') || descriptionLower.includes('cooling') || descriptionLower.includes('air condition')) {
      return generateHVACTasks(team);
    }
    
    if (descriptionLower.includes('cleaning') || descriptionLower.includes('housekeeping')) {
      return generateCleaningTasks(team);
    }
    
    if (descriptionLower.includes('damage') || descriptionLower.includes('repair') || descriptionLower.includes('broken')) {
      return generateRepairTasks(team);
    }
    
    if (descriptionLower.includes('guest') || descriptionLower.includes('complaint') || descriptionLower.includes('communication')) {
      return generateGuestCommTasks(team);
    }
    
    // Default to WiFi issues template
    return generateWiFiTasks(team);
  }
};

/**
 * Template: WiFi/Internet issues
 */
function generateWiFiTasks(_team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'Validate issue',
      team: 'PROPERTY_MANAGEMENT_DE',
      accepted: undefined,
      subtasks: [
        {
          title: 'Verify case validity',
          team: 'PROPERTY_MANAGEMENT_DE',
          accepted: undefined,
        },
        {
          title: 'Open a Breezeway ticket',
          team: 'PROPERTY_MANAGEMENT_DE',
          accepted: undefined,
        }
      ]
    },
    {
      title: 'Troubleshoot/fix WiFi (via Breezeway)',
      team: 'PROPERTY_MANAGEMENT_DE',
      accepted: undefined,
    },
    {
      title: 'Send resolution confirmation to guest via Conduit',
      team: 'GUEST_COMM_DE',
      accepted: undefined,
    }
  ];
}

/**
 * Template: Plumbing issues
 */
function generatePlumbingTasks(team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'Emergency inspection and assessment',
      description: 'Complete assessment of plumbing leak and water damage extent',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Check unit above (A-201) for plumbing issues',
          team,
          accepted: undefined,
        },
        {
          title: 'Document damage with photos',
          team,
          accepted: undefined,
        }
      ]
    },
    {
      title: 'Repair plumbing and ceiling',
      description: 'Execute all necessary repairs to restore unit to operational status',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Replace damaged pipe section',
          team,
          accepted: undefined,
        },
        {
          title: 'Dry out ceiling and walls',
          team,
          accepted: undefined,
        },
        {
          title: 'Patch and repaint ceiling',
          team,
          accepted: undefined,
        }
      ]
    }
  ];
}

/**
 * Template: Electrical issues
 */
function generateElectricalTasks(team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'Electrical safety inspection',
      description: 'Thorough inspection of all electrical systems to identify safety risks',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Test circuit breakers and main panel',
          team,
          accepted: undefined,
        },
        {
          title: 'Inspect all outlets and switches',
          team,
          accepted: undefined,
        },
        {
          title: 'Check for exposed wiring or burn marks',
          team,
          accepted: undefined,
        }
      ]
    },
    {
      title: 'Complete electrical repairs',
      description: 'Complete all necessary electrical repairs to restore safe operation',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Replace damaged wiring and outlets',
          team,
          accepted: undefined,
        },
        {
          title: 'Install new fixtures with proper grounding',
          team,
          accepted: undefined,
        },
        {
          title: 'Final testing and safety certification',
          team,
          accepted: undefined,
        }
      ]
    }
  ];
}

/**
 * Template: HVAC issues
 */
function generateHVACTasks(team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'HVAC system diagnosis',
      description: 'Identify root cause of heating or cooling malfunction',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Check thermostat settings and calibration',
          team,
          accepted: undefined,
        },
        {
          title: 'Inspect HVAC unit and compressor',
          team,
          accepted: undefined,
        },
        {
          title: 'Check air filters and vents for blockages',
          team,
          accepted: undefined,
        }
      ]
    },
    {
      title: 'HVAC repair and maintenance',
      description: 'Complete all necessary service work to restore optimal performance',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Replace air filters and clean ductwork',
          team,
          accepted: undefined,
        },
        {
          title: 'Service unit and check refrigerant levels',
          team,
          accepted: undefined,
        },
        {
          title: 'Test system across all settings',
          team,
          accepted: undefined,
        }
      ]
    }
  ];
}

/**
 * Template: Cleaning issues
 */
function generateCleaningTasks(team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'Pre-cleaning inspection',
      description: 'Document current condition and identify all areas requiring attention',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Photograph and document problem areas',
          team,
          accepted: undefined,
        },
        {
          title: 'Identify stains and special treatments needed',
          team,
          accepted: undefined,
        }
      ]
    },
    {
      title: 'Complete deep cleaning',
      description: 'Perform thorough cleaning to meet property standards',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Deep clean floors, walls, and fixtures',
          team,
          accepted: undefined,
        },
        {
          title: 'Sanitize bathroom surfaces and tiles',
          team,
          accepted: undefined,
        },
        {
          title: 'Clean kitchen appliances and counters',
          team,
          accepted: undefined,
        },
        {
          title: 'Final quality inspection',
          team,
          accepted: undefined,
        }
      ]
    }
  ];
}

/**
 * Template: Repair/Damage issues
 */
function generateRepairTasks(team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'Damage assessment and documentation',
      description: 'Complete evaluation of all damage with detailed cost estimates',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Inspect property and document damage',
          team,
          accepted: undefined,
        },
        {
          title: 'Photograph all damaged areas',
          team,
          accepted: undefined,
        },
        {
          title: 'Create repair estimate',
          team,
          accepted: undefined,
        }
      ]
    },
    {
      title: 'Complete repairs',
      description: 'Perform all necessary repairs to restore property to original condition',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Order necessary materials and tools',
          team,
          accepted: undefined,
        },
        {
          title: 'Repair walls, floors, and fixtures',
          team,
          accepted: undefined,
        },
        {
          title: 'Apply paint and finishing touches',
          team,
          accepted: undefined,
        },
        {
          title: 'Final inspection and approval',
          team,
          accepted: undefined,
        }
      ]
    }
  ];
}

/**
 * Template: Guest communication issues
 */
function generateGuestCommTasks(team?: TeamType): GeneratedTask[] {
  return [
    {
      title: 'Acknowledge guest concern',
      description: 'Provide immediate response and gather complete information',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Send acknowledgment email within 2 hours',
          team,
          accepted: undefined,
        },
        {
          title: 'Review booking and communication history',
          team,
          accepted: undefined,
        }
      ]
    },
    {
      title: 'Investigate and resolve issue',
      description: 'Take all necessary actions to resolve complaint and restore guest trust',
      team,
      accepted: undefined,
      subtasks: [
        {
          title: 'Analyze root cause and identify solution',
          team,
          accepted: undefined,
        },
        {
          title: 'Implement corrective action',
          team,
          accepted: undefined,
        },
        {
          title: 'Follow up with guest on resolution',
          team,
          accepted: undefined,
        },
        {
          title: 'Document case and update procedures',
          team,
          accepted: undefined,
        }
      ]
    }
  ];
}


/**
 * Convert generated tasks to actual Task objects with IDs
 * Only converts tasks and subtasks that are explicitly accepted (accepted === true)
 */
export function convertToTasks(
  generatedTasks: GeneratedTask[],
  caseId: string
): Task[] {
  let taskCounter = 1;
  
  function convertTask(genTask: GeneratedTask, parentId?: string): Task | null {
    const taskId = parentId 
      ? `${caseId}.${taskCounter}`
      : `${caseId}.${taskCounter}`;
    
    taskCounter++;
    
    const task: Task = {
      id: taskId,
      title: genTask.title,
      description: genTask.description,
      status: 'TODO',
      team: genTask.team,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Process subtasks recursively, filtering only accepted ones
    if (genTask.subtasks && genTask.subtasks.length > 0) {
      const acceptedSubtasks = genTask.subtasks.filter(st => st.accepted === true);
      if (acceptedSubtasks.length > 0) {
        const convertedSubtasks = acceptedSubtasks
          .map(subtask => convertTask(subtask, taskId))
          .filter((t): t is Task => t !== null);
        
        if (convertedSubtasks.length > 0) {
          task.subtasks = convertedSubtasks;
        }
      }
    }
    
    return task;
  }
  
  return generatedTasks
    .map(genTask => convertTask(genTask))
    .filter((t): t is Task => t !== null);
}

