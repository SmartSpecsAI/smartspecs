import { Requirement, RequirementItem } from "../entities";

export interface IRequirementRepository {
  getAll(): Promise<Requirement[]>;
  getAllById(id: string): Promise<Requirement[]>;
  getById(id: string): Promise<Requirement | null>;
  create(requirement: Omit<Requirement, "id">): Promise<Requirement>;
  update(id: string, requirement: Partial<Requirement>): Promise<Requirement>;
  delete(id: string): Promise<void>;
  generateRequirementsItems(conversation: String): Promise<string>;
}
