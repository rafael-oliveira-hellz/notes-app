import { NextFunction, Request, Response } from 'express';
import Bundle from '../utils/Bundle';

class AccessControl {
  isAdmin(request: Request, response: Response, next: NextFunction) {
    const user = Bundle.getBundle(request, null);

    if (user.models.role != 'user') {
      return response.status(401).send('Acesso não autorizado.');
    }

    next();
  }

  isUserOrAdmin(request: Request, response: Response, next: NextFunction) {
    const user = Bundle.getBundle(request, null);

    const userId = request.headers.id;

    if (user.models.id != userId && user.models.role != 'admin') {
      return response.status(401).send('Acesso não autorizado.');
    }

    next();
  }

  async isOwnUser(request: Request, response: Response, next: NextFunction) {
    const user = Bundle.getBundle(request, null);

    const userId = request.headers.id;

    if (user.models.id != userId) {
      return response.status(401).send('Acesso não autorizado.');
    }

    next();
  }
}

export default new AccessControl();
