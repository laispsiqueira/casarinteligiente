
import { AppMode, UserRole } from '../../types';

export interface VisibilityStatus {
  visible: boolean;
  locked: boolean;
}

export class PermissionManager {
  static getModuleVisibility(role: UserRole, moduleId: AppMode): VisibilityStatus {
    if (role === 'Administrador') {
      return { visible: true, locked: false };
    }

    switch (role) {
      case 'Noivo Free':
        if ([AppMode.IMAGES, AppMode.CHAT, AppMode.PLANNER].includes(moduleId)) {
          return { visible: true, locked: false };
        }
        if ([AppMode.GUESTS, AppMode.SUPPLIERS].includes(moduleId)) {
          return { visible: true, locked: true };
        }
        return { visible: false, locked: false };
      
      case 'Noivo+':
        if ([AppMode.IMAGES, AppMode.CHAT, AppMode.PLANNER, AppMode.GUESTS, AppMode.SUPPLIERS].includes(moduleId)) {
          return { visible: true, locked: false };
        }
        return { visible: false, locked: false };

      case 'Assessor Free':
      case 'Assessor Plus':
      case 'Assessor Premium':
        // Assessores enxergam as ferramentas de planejamento e o dashboard, 
        // mas não têm acesso à aba de Gestão & Clientes (ACCOUNT).
        if (moduleId === AppMode.ACCOUNT) {
          return { visible: false, locked: false };
        }
        return { visible: true, locked: false };

      default:
        return { visible: false, locked: false };
    }
  }
}
