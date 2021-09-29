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
import annotation from "./annotation";

import {
  IAnnotation,
  IAnnotationConnection,
  IMorphologicAnnotationProperty,
  IAnnotationProperty,
  IRelationalAnnotationProperty,
  ILayerDependentAnnotationProperty,
  IAnnotationPropertyComputeParameters,
  ITagAnnotationFilter
} from "./model";

// TODO: mutations for properties
// TODO: this means we probably need to regroup them all under one array
@Module({ dynamic: true, store, name: "properties" })
export class Properties extends VuexModule {
  morphologicProperties: IMorphologicAnnotationProperty[] = [
    {
      id: "length",
      name: "Length",

      enabled: false,
      computed: true,

      requiredShape: "line",

      async compute({ annotations }: IAnnotationPropertyComputeParameters) {
        this.computed = false;
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = Math.random() * 1000;
        });
        this.computed = true;
      }
    },
    {
      id: "perimeter",
      name: "Perimeter",

      enabled: false,
      computed: true,
      requiredShape: "polygon",

      async compute({ annotations }: IAnnotationPropertyComputeParameters) {
        this.computed = false;
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = Math.random() * 1000;
        });
        this.computed = true;
      }
    }
  ];

  relationalProperties: IRelationalAnnotationProperty[] = [
    {
      id: "numberOfConnected",
      name: "Number Of Connected",

      enabled: true,
      computed: false,

      independant: true,

      filter: {
        id: "numberOfConnectedFilter",
        tags: ["cell", "some tag"],
        exclusive: true,
        enabled: true
      },

      async compute({
        annotations,
        connections
      }: IAnnotationPropertyComputeParameters) {
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = connections?.length || 0;
        });
      }
    }
  ];

  layerDependantProperties: ILayerDependentAnnotationProperty[] = [
    {
      id: "averageIntensity",
      name: "Average Intensity",

      enabled: false,
      computed: false,

      layer: 0,

      async compute({
        annotations,
        image
      }: IAnnotationPropertyComputeParameters) {
        if (!image) {
          return;
        }
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = Math.random() * 100;
        });
      }
    }
  ];

  filterIds: string[] = [];
  annotationListIds: string[] = [];

  @Mutation
  addFilterId(id: string) {
    if (!this.filterIds.includes(id)) {
      this.filterIds = [...this.filterIds, id];
    }
  }

  @Mutation
  addAnnotationListId(id: string) {
    if (!this.annotationListIds.includes(id)) {
      this.annotationListIds = [...this.annotationListIds, id];
    }
  }

  @Mutation
  removeAnnotationListId(id: string) {
    if (this.annotationListIds.includes(id)) {
      this.annotationListIds = this.annotationListIds.filter(
        testId => id !== testId
      );
    }
  }

  @Mutation
  removeFilterId(id: string) {
    if (this.filterIds.includes(id)) {
      this.filterIds = this.filterIds.filter(testId => id !== testId);
    }
  }

  get properties(): IAnnotationProperty[] {
    return [
      ...this.morphologicProperties,
      ...this.relationalProperties,
      ...this.layerDependantProperties
    ];
  }

  @Action
  async handleNewAnnotation(
    newAnnotation: IAnnotation,
    newConnections: IAnnotationConnection[],
    image: any
  ) {
    const shapeFilter = (property: IMorphologicAnnotationProperty) =>
      property.requiredShape !== null &&
      property.requiredShape === newAnnotation.shape;
    const enabledFilter = (property: IAnnotationProperty) => property.enabled;
    return Promise.all([
      ...this.morphologicProperties
        .filter(shapeFilter)
        .filter(enabledFilter)
        .map((property: IMorphologicAnnotationProperty) =>
          property.compute({ annotations: [newAnnotation] })
        ),
      ...this.layerDependantProperties
        .filter(enabledFilter)
        .map((property: ILayerDependentAnnotationProperty) =>
          property.compute({ annotations: [newAnnotation], image })
        ),
      ...this.relationalProperties
        .filter(enabledFilter)
        .map((property: IRelationalAnnotationProperty) =>
          property.compute({
            annotations: [newAnnotation],
            connections: newConnections
          })
        )
    ]);
  }

  @Action
  async handleNewProperty(property: IAnnotationProperty) {
    console.error("NYI");
  }
}

export default getModule(Properties);
