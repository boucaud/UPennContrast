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

@Module({ dynamic: true, store, name: "annotation" })
export class Annotations extends VuexModule {
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

  busy: Promise<void> | null = null;

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
    const promise = Promise.all([
      ...this.morphologicProperties.map(
        (property: IMorphologicAnnotationProperty) =>
          property.compute([newAnnotation])
      ),
      ...this.layerDependantProperties.map(
        (property: ILayerDependentAnnotationProperty) =>
          property.compute([newAnnotation], image)
      ),
      ...this.relationalProperties.map(
        (property: IRelationalAnnotationProperty) =>
          property.compute([newAnnotation], newConnections)
      )
    ]).then(() => {
      this.busy = null;
    });
    if (this.busy) {
      this.busy.then(() => {
        this.busy = promise;
      });
    } else {
      this.busy = promise;
    }
  }

  @Action
  async handleNewProperty(property: IAnnotationProperty) {
    console.error("NYI");
  }
}

export default getModule(Annotations);
