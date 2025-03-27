import { Requirement } from "@/smartspecs/lib/domain";
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

  async getById(projectId: string, id: string): Promise<Requirement | null> {
    const requirementsByProject = await this.getAllById(projectId);
    const requirement = requirementsByProject.find((req) => req.id === id);
    if (!requirement) return null;
    return requirement as Requirement;
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
    projectId: string,
    requirement: Requirement
  ): Promise<Requirement> {
    const { id, ...data } = requirement;
    console.log("ID", id, data);

    const docReference = await this.firebase.getDocumentReference(
      this.collection,
      projectId
    );

    const collectionReference = await this.firebase.getCollectionReference(
      "requirements",
      docReference
    );

    // Remove duplicate update call
    await this.firebase.updateDocumentByCollection(
      collectionReference,
      id,
      data
    );

    // Reuse docReference instead of creating docReference2
    const collectionSnapshot = await this.firebase.getCollection(
      "requirements",
      docReference
    );

    // Use find instead of filter to directly get the updated document
    const updatedDoc = collectionSnapshot.find((col) => col.id === id);

    if (!updatedDoc) {
      throw new Error(`Requirement with id ${id} not found after update.`);
    }

    return {
      id: updatedDoc.id,
      ...updatedDoc,
    } as Requirement;
  }

  async delete(id: string): Promise<void> {
    await this.firebase.deleteDocument(this.collection, id);
  }

  async generateRequirementsItems(prompt: string): Promise<string> {
    return await this.openAI.executePrompt(prompt);
  }
}
