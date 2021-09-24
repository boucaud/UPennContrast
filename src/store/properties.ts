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
      computing: true,

      requiredShape: "line",

      async compute({ annotations }: IAnnotationPropertyComputeParameters) {
        this.computing = false;
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = Math.random() * 1000;
        });
        this.computing = true;
      }
    },
    {
      id: "perimeter",
      name: "Perimeter",

      enabled: false,
      computing: true,
      requiredShape: "polygon",

      async compute({ annotations }: IAnnotationPropertyComputeParameters) {
        this.computing = false;
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = Math.random() * 1000;
        });
        this.computing = true;
      }
    }
  ];

  relationalProperties: IRelationalAnnotationProperty[] = [
    {
      id: "numberOfConnected",
      name: "Number Of Connected",

      enabled: true,
      computing: false,

      independant: true,

      filter: {
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
      computing: false,

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
    return Promise.all([
      ...this.morphologicProperties
        .filter(shapeFilter)
        .map((property: IMorphologicAnnotationProperty) =>
          property.compute({ annotations: [newAnnotation] })
        ),
      ...this.layerDependantProperties.map(
        (property: ILayerDependentAnnotationProperty) =>
          property.compute({ annotations: [newAnnotation], image })
      ),
      ...this.relationalProperties.map(
        (property: IRelationalAnnotationProperty) =>
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
