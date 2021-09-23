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
  ILayerDependentAnnotationProperty
} from "./model";

function canAnnotationHaveProperty(
  annotation: IAnnotation,
  property: IAnnotationProperty
) {
  if (property.requiredShape && annotation.shape !== property.requiredShape) {
    return false;
  }
  return property.enabled && property.computing;
}

@Module({ dynamic: true, store, name: "properties" })
export class Properties extends VuexModule {
  morphologicProperties: IMorphologicAnnotationProperty[] = [
    {
      id: "length",
      name: "Length",

      enabled: false,
      computing: true,

      requiredShape: "line",

      independant: true,

      async compute(annotations: IAnnotation[]) {
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
      independant: true,

      async compute(annotations: IAnnotation[]) {
        this.computing = false;
        annotations.forEach((annotation: IAnnotation) => {
          annotation.computedValues[this.id] = Math.random() * 1000;
        });
        this.computing = true;
      }
    }
  ];

  relationalProperties: IRelationalAnnotationProperty[] = [];

  layerDependantProperties: ILayerDependentAnnotationProperty[] = [];

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
    const shapeFilter = (property: IAnnotationProperty) =>
      property.requiredShape !== null &&
      property.requiredShape === newAnnotation.shape;
    return Promise.all([
      ...this.morphologicProperties
        .filter(shapeFilter)
        .map((property: IMorphologicAnnotationProperty) =>
          property.compute([newAnnotation])
        ),
      ...this.layerDependantProperties
        .filter(shapeFilter)
        .map((property: ILayerDependentAnnotationProperty) =>
          property.compute([newAnnotation], image)
        ),
      ...this.relationalProperties
        .filter(shapeFilter)
        .map((property: IRelationalAnnotationProperty) =>
          property.compute([newAnnotation], newConnections)
        )
    ]);
  }

  @Action
  async handleNewProperty(property: IAnnotationProperty) {
    console.error("NYI");
  }
}

export default getModule(Properties);
