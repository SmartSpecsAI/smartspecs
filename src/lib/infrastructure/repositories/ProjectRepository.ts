import { Project } from "@/smartspecs/domain/entities";
import { IProjectsRepository } from "@/smartspecs/domain";
import { IFirebaseDatasource } from "../datasources";
import { getInjection } from "@/di/container";

export class ProjectsRepository implements IProjectsRepository {
  private readonly collection = "projects";
  private readonly firebase: IFirebaseDatasource;

  constructor() {
    this.firebase = getInjection("IFirebaseDatasource");
  }

  async getAll(): Promise<Project[]> {
    const snapshot = await this.firebase.getCollection(this.collection);
    const promises = snapshot.map((doc) =>
      this.firebase.getDocument(this.collection, doc.id)
    );
    const docs = await Promise.all(promises);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  }

  async getById(id: string): Promise<Project | null> {
    const doc = await this.firebase.getDocument(this.collection, id);
    if (!doc.exists) return null;
    return {
      id: doc.id,
      ...doc.data(),
    } as Project;
  }

  async create(project: Omit<Project, "id">): Promise<Project> {
    const docId = await this.firebase.addDocument(this.collection, project);
    const newDoc = await this.firebase.getDocument(this.collection, docId);
    return {
      id: newDoc.id,
      ...newDoc.data(),
    } as Project;
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    await this.firebase.updateDocument(this.collection, id, project);
    const updatedDoc = await this.firebase.getDocument(this.collection, id);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Project;
  }

  async delete(id: string): Promise<void> {
    await this.firebase.deleteDocument(this.collection, id);
  }
}
