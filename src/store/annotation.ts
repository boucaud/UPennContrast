import {
  getModule,
  Action,
  Module,
  Mutation,
  VuexModule
} from "vuex-module-decorators";
import store from "./root";

import main from "./index";
import sync from "./sync";

import {
  IAnnotation,
  IAnnotationConnection,
  IAnnotationFilter,
  ITagAnnotationFilter,
  IPropertyAnnotationFilter,
  IROIAnnotationFilter
} from "./model";

@Module({ dynamic: true, store, name: "annotation" })
export class Annotations extends VuexModule {
  // Annotations from the current dataset and configuration
  annotations: IAnnotation[] = [];
  // Connections from the current dataset and configuration
  annotationConnections: IAnnotationConnection[] = [];

  // Annotation browser filters
  tagFilter: ITagAnnotationFilter = {
    id: "tagFilter",
    exclusive: false,
    enabled: true,
    tags: []
  };
  propertyFilters: IPropertyAnnotationFilter[] = [];
  roiFilters: IROIAnnotationFilter[] = [];

  get filteredAnnotations() {
    return this.annotations.filter((annotation: IAnnotation) => {
      // tag filter
      if (!this.tagFilter.enabled) {
        return true;
      }
      const hasAllTags = this.tagFilter.tags.reduce(
        (val: boolean, tag: string) => val && annotation.tags.includes(tag),
        true
      );
      if (this.tagFilter.exclusive) {
        return (
          hasAllTags &&
          annotation.tags
            .map((tag: string) => this.tagFilter.tags.includes(tag))
            .every((val: boolean) => val)
        );
      }
      return hasAllTags;
    });
  }

  @Mutation
  public setTagFilter(filter: ITagAnnotationFilter) {
    this.tagFilter = filter;
  }

  @Mutation
  public addTagToTagFilter(tag: string) {
    if (this.tagFilter.tags.includes(tag)) {
      return;
    }
    this.tagFilter = Object.assign({}, this.tagFilter, {
      tags: [...this.tagFilter.tags, tag]
    });
  }

  @Mutation
  public addAnnotation(value: IAnnotation) {
    this.annotations = [...this.annotations, value];
  }

  @Mutation
  public setAnnotations(values: IAnnotation[]) {
    this.annotations = values;
  }

  @Mutation
  public addConnection(value: IAnnotationConnection) {
    this.annotationConnections = [...this.annotationConnections, value];
  }

  @Mutation
  public setConnections(values: IAnnotationConnection[]) {
    this.annotationConnections = values;
  }

  @Action
  // Very inefficient, but will work for now
  async syncAnnotations() {
    if (!main.dataset) {
      return;
    }
    sync.setSaving(true);
    if (!main.configuration) {
      return;
    }
    try {
      await main.api.setAnnotationsToConfiguration(
        this.annotations,
        this.annotationConnections,
        main.configuration
      );
      sync.setSaving(false);
    } catch (error) {
      sync.setSaving(error);
    }
  }

  @Action
  async fetchAnnotations() {
    this.setAnnotations([]);
    this.setConnections([]);
    if (!main.dataset || !main.configuration) {
      return;
    }
    try {
      const results = await main.api.getAnnotationsForConfiguration(
        main.configuration
      );
      if (results) {
        this.setAnnotations(results.annotations);
        this.setConnections(results.annotationConnections);
      }
    } catch (error) {
      error(error.message);
    }
  }
}

export default getModule(Annotations);
