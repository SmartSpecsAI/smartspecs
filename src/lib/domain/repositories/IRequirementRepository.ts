import { Requirement, RequirementItem } from "../entities";

export interface IRequirementRepository {
  getAll(): Promise<Requirement[]>;
  getAllById(id: string): Promise<Requirement[]>;
  getById(projectId: string, id: string): Promise<Requirement | null>;
  create(requirement: Omit<Requirement, "id">): Promise<Requirement>;
  update(projectId: string, requirement: Requirement): Promise<Requirement>;
  delete(id: string): Promise<void>;
  generateRequirementsItems(conversation: String): Promise<string>;
}
