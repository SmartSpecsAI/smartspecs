import { Requirement, RequirementItem } from "@/smartspecs/lib/domain";
import { IRequirementRepository } from "@/smartspecs/lib/domain";
import {
  IFirebaseDatasource,
  IOpenAIDatasource,
} from "@/smartspecs/lib/infrastructure";
import { getInjection } from "@/smartspecs/di/container";

export class RequirementRepository implements IRequirementRepository {
  private readonly collection = "projects";
  private readonly firebase: IFirebaseDatasource;
  private readonly openAI: IOpenAIDatasource;

  constructor() {
    this.firebase = getInjection("IFirebaseDatasource");
    this.openAI = getInjection("IOpenAIDatasource");
  }

  async getAll(): Promise<Requirement[]> {
    const snapshot = await this.firebase.getCollection(this.collection);
    const promises = snapshot.map((doc) =>
      this.firebase.getDocument(this.collection, doc.id)
    );
    const docs = await Promise.all(promises);
    return docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Requirement[];
  }

  async getAllById(projectId: string): Promise<Requirement[]> {
    const docReference = await this.firebase.getDocumentReference(
      this.collection,
      projectId
    );

    const collectionSnapshot = await this.firebase.getCollection(
      "requirements",
      docReference
    );

    return collectionSnapshot.map((doc) => ({
      id: doc.id,
      ...doc,
    })) as Requirement[];
  }

  async getById(id: string): Promise<Requirement | null> {
    const doc = await this.firebase.getDocument(this.collection, id);
    if (!doc.exists) return null;
    return {
      id: doc.id,
      ...doc.data(),
    } as Requirement;
  }

  async create(requirement: Omit<Requirement, "id">): Promise<Requirement> {
    const docReference = await this.firebase.getDocumentReference(
      this.collection,
      requirement.projectId
    );

    const newDocId = await this.firebase.addDocumentToDocumentCollection(
      docReference,
      "requirements",
      requirement
    );

    return {
      id: newDocId,
      ...requirement,
    } as Requirement;
  }

  async update(
    id: string,
    requirement: Partial<Requirement>
  ): Promise<Requirement> {
    await this.firebase.updateDocument(this.collection, id, requirement);
    const updatedDoc = await this.firebase.getDocument(this.collection, id);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Requirement;
  }

  async delete(id: string): Promise<void> {
    await this.firebase.deleteDocument(this.collection, id);
  }

  async generateRequirementsItems(prompt: string): Promise<string> {
    return await this.openAI.executePrompt(prompt);
  }
}
