import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ResidentialUserInterface {
  id?: string;
  user_id: string;
  energy_goal?: number;
  energy_usage?: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ResidentialUserGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
